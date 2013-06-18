module.exports = function(grunt) {
  var _ = (grunt.utils || grunt.util)._,
    request = require('request'),
    proc = require('child_process'),
    wd = require('wd'),
    rqst = request.defaults({
      jar: false
    });

  var SauceStatus = function(user, key) {
    this.user = user;
    this.key = key;
    this.baseUrl = ["https://", this.user, ':', this.key, '@saucelabs.com', '/rest/v1/', this.user].join("");
  };

  SauceStatus.prototype.passed = function(jobid, status, callback) {
    var _body = JSON.stringify({
      "passed": status
    }),
      _url = this.baseUrl + "/jobs/" + jobid;
    rqst({
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "PUT",
      url: _url,
      body: _body,
      json: true
    }, function() {
      callback();
    });
  };

  SauceStatus.prototype.result = function(jobid, data, callback) {
    var _body = JSON.stringify(data),
      _url = this.baseUrl + "/jobs/" + jobid;
    rqst({
      headers: {
        'content-type': 'application/json'
      },
      method: "PUT",
      url: _url,
      body: _body,
      json: true
    }, function() {
      callback();
    });
  };

  var SauceTunnel = function(user, key, identifier, tunneled, tunnelTimeout) {
    this.user = user;
    this.key = key;
    this.identifier = identifier;
    this.tunneled = tunneled;
    this.tunnelTimeout = tunnelTimeout;
    this.baseUrl = ["https://", this.user, ':', this.key, '@saucelabs.com', '/rest/v1/', this.user].join("");
  };

  SauceTunnel.prototype.openTunnel = function(callback) {
    var args = ["-jar", __dirname + "/Sauce-Connect.jar", this.user, this.key, "-i", this.identifier];
    this.proc = proc.spawn('java', args);
    var calledBack = false;

    this.proc.stdout.on('data', function(d) {
      var data = typeof d !== 'undefined' ? d.toString() : '';
      if (typeof data === 'string' && !data.match(/^\[-u,/g)) {
        grunt.verbose.debug(data.replace(/[\n\r]/g, ''));
      }
      if (typeof data === 'string' && data.match(/Connected\! You may start your tests/)) {
        grunt.verbose.ok('=> Sauce Labs Tunnel established');
        if (!calledBack) {
          calledBack = true;
          callback(true);
        }
      }
    });

    this.proc.stderr.on('data', function(data) {
      grunt.log.error(data.toString().replace(/[\n\r]/g, ''));
    });

    this.proc.on('exit', function(code) {
      grunt.verbose.ok('Sauce Labs Tunnel disconnected ', code);
      if (!calledBack) {
        calledBack = true;
        callback(false);
      }
    });
  };

  SauceTunnel.prototype.getTunnels = function(callback) {
    rqst({
      url: this.baseUrl + '/tunnels',
      json: true
    }, function(err, resp, body) {
      callback(body);
    });
  };

  SauceTunnel.prototype.killAllTunnels = function(callback) {
    if (!this.tunneled) {
      return callback();
    }
    var me = this;
    grunt.verbose.debug("Trying to kill all tunnels");
    this.getTunnels(function(tunnels) {
      (function killTunnel(i) {
        if (i >= tunnels.length) {
          setTimeout(callback, 1000 * 5);
          return;
        }
        grunt.log.writeln("=> Killing tunnel %s", tunnels[i]);
        rqst({
          method: "DELETE",
          url: me.baseUrl + "/tunnels/" + tunnels[i],
          json: true
        }, function() {
          killTunnel(i + 1);
        });
      }(0));
    });
  };

  SauceTunnel.prototype.start = function(callback) {
    var me = this;
    if (!this.tunneled) {
      return callback(true);
    }
    this.getTunnels(function(tunnels) {
      if (!tunnels) {
        grunt.verbose.error("=> Could not get tunnels for Sauce Labs. Still continuing to try connecting to Sauce Labs".inverse);
      }
      if (tunnels && tunnels.length > 0) {
        grunt.log.writeln("=> Looks like there are existing tunnels to Sauce Labs, need to kill them. TunnelID:%s", tunnels);
        (function waitForTunnelsToDie(retryCount) {
          if (retryCount > 5) {
            grunt.verbose.writeln("=> Waited for %s retries, now trying to shut down all tunnels and try again", retryCount);
            me.killAllTunnels(function() {
              me.start(callback);
            });
          } else {
            grunt.verbose.debug("=> %s. Sauce Labs tunnels already exist, will try to connect again %s milliseconds.", retryCount, me.tunnelTimeout / 5);
            setTimeout(function() {
              waitForTunnelsToDie(retryCount + 1);
            }, me.tunnelTimeout / 5);
          }
        }(0));
      } else {
        grunt.verbose.writeln("=> Sauce Labs trying to open tunnel".inverse);
        me.openTunnel(function(status) {
          callback(status);
        });
      }
    });
  };

  SauceTunnel.prototype.stop = function(callback) {
    if (this.proc) {
      this.proc.kill();
    }
    this.killAllTunnels(function() {
      callback();
    });
  };

  var TestRunner = function(user, key) {
    this.user = user;
    this.key = key;
    this.host = 'ondemand.saucelabs.com';
    this.port = 80;
    this.report = new SauceStatus(user, key);
  };

  TestRunner.prototype.forEachBrowser = function(configs, runner, saucify, concurrency, onTestComplete) {
    var me = this;
    return {
      testPages: function(pages, testTimeout, testInterval, testReadyTimeout, detailedError, callback) {
        function initBrowser(cfg) {
          var success = true;
          var results = [];

          function onPageTested(status, page, config, browser, cb) {
            var waitForAsync = false;
            this.async = function() {
              waitForAsync = true;
              return function(ret) {
                success = success && (typeof ret === "undefined" ? status : ret);
                cb();
              };
            };
            if (typeof onTestComplete === "function") {
              var ret = onTestComplete(status, page, config, browser);
              status = typeof ret === "undefined" ? status : ret;
            }
            if (!waitForAsync) {
              success = success && status;
              cb();
            }
          }

          return function(done) {
            var driver = wd.remote(me.host, me.port, me.user, me.key);
            grunt.verbose.writeln("Starting tests on browser configuration", cfg);
            driver.init(cfg, function(err, sessionId) {
              if (err) {
                grunt.log.error("[%s] Could not initialize browser for session", cfg.prefix, sessionId, cfg);
                success = false;
                me.report.passed(driver.sessionID, success, function() {
                  done(success);
                });
                return;
              }
              var finished = function(cb) {
                if (results.length > 0 && typeof saucify === 'function') {
                  me.report.result(driver.sessionID, saucify(results), function() {
                    cb(success);
                  });
                } else {
                  cb(success);
                }
              };
              (function testPage(j) {
                if (j >= pages.length) {
                  driver.quit(function() {
                    me.report.passed(driver.sessionID, success, function() {
                      finished(done);
                    });
                  });
                  return;
                }
                grunt.verbose.writeln("[%s] Testing page#%s %s at http://saucelabs.com/tests/%s", cfg.prefix, j, pages[j], driver.sessionID);
                driver.get(pages[j], function(err) {
                  if (err) {
                    grunt.log.error("[%s] Could not fetch page (%s)%s", cfg.prefix, j, pages[j]);
                    onPageTested(false, pages[j], cfg, driver, function() {
                      testPage(j + 1);
                    });
                    return;
                  }
                  driver.page = pages[j];
                  runner.call(me, driver, cfg, testTimeout, testInterval, testReadyTimeout, detailedError, function(status, obj) {
                    results.push(obj);
                    onPageTested(status, pages[j], cfg, driver, function() {
                      testPage(j + 1);
                    });
                  });
                });
              }(0));
            });
          };
        }

        var brwrs = [],
          colors = ['yellow', 'cyan', 'magenta', 'blue', 'green', 'red'],
          curr = 0,
          running = 0,
          res = true;
        _.each(configs, function(_c, i) {
          _c.prefix = _c.name || (_c.platform ? _c.platform + '::' : '') + _c.browserName + (_c.version ? '(' + _c.version + ')' : '');
          _c.prefix = _c.prefix[colors[i % colors.length]];
          brwrs.push(initBrowser(_c));
        });

        (function next(success) {
          if (typeof success !== 'undefined') {
            res = res && success;
            running--;
          }

          if (curr >= brwrs.length && running <= 0) {
            return callback(res);
          }

          if (running < concurrency && curr < brwrs.length) {
            brwrs[curr](next);
            curr++;
            running++;
            next();
          }
        }());
      }
    };
  };

  TestRunner.prototype.jasmineRunner = function(driver, cfg, testTimeout, testInterval, testReadyTimeout, detailedError, callback) {
    grunt.verbose.writeln("Starting Jasmine tests");
    driver.waitForElementByClassName('alert', testReadyTimeout, function() {
      driver.elementsByClassName('version', function(err, el) {
        if (err) {
          grunt.log.error("[%s] Could not read test result", cfg.prefix, err);
          grunt.log.error("[%s] More details about error at http://saucelabs.com/tests/%s", cfg.prefix, driver.sessionID);
          callback(false);
          return;
        }
        driver.text(el, function(err, versionText) {
          if (err) {
            grunt.log.error("[%s] Could not see test inside element", cfg.prefix, err);
            grunt.log.error("[%s] More details about error at http://saucelabs.com/tests/%s", cfg.prefix, driver.sessionID);

            callback(false);
          }

          var versionMatch = versionText.match(/[0-9]+(\.[0-9]+)*/);
          var version = versionMatch && versionMatch[0];
          grunt.verbose.writeln("[%s] Detected jasmine version %s", cfg.prefix, version);

          var descriptionResultParser = {
            "resultClass": "description",
            "success": /0 failures/,
            "fail": /([1-9][0-9]*)\s*failure/
          };
          var alertResultParser = {
            "resultClass": "alert",
            "success": /Passing/,
            "fail": /Failing/
          };
          var resultParser = {
            "1.2.0": descriptionResultParser,
            "1.3.0": alertResultParser,
            "1.3.1": alertResultParser
          };


          var showDetailedError = function(callback) {
            driver.elementById('details', function(err, detailEl) {
              driver.text(detailEl, function(err, detailText) {
                grunt.log.error("[%s] Error: %s", detailText, cfg.prefix);
                callback();
              });
            });
          };

          driver.elementsByClassName(resultParser[version].resultClass, function(err, els) {
            if (err) {
              grunt.log.error("[%s] Could not get element by id", cfg.prefix, err);
              grunt.log.error("[%s] More details about error at http://saucelabs.com/tests/%s", cfg.prefix, driver.sessionID);

              callback(false);
              return;
            }
            grunt.verbose.writeln("Fetched test result element, waiting for text inside it to change to complete");
            var el = els[0];
            var retryCount = 0;
            (function isCompleted() {
              driver.text(el, function(err, text) {
                grunt.log.subhead("\nTested %s", driver.page);
                grunt.log.writeln("Environment: %s", cfg.prefix);
                if (err) {
                  grunt.log.error("Could not see test inside element", err);
                  callback(false);
                } else if (retryCount * testInterval > testTimeout) {
                  grunt.log.error("Failed, waited for more than %s milliseconds", testTimeout);
                  callback(false);
                } else if (typeof text !== 'string') {
                  grunt.log.error('Result : Error. Text not defined when trying to fetch results %s', typeof text);
                  callback(false);
                } else if (text.match(resultParser[version].fail)) {
                  grunt.log.error("Result:  %s", text);
                  if (detailedError) {
                    return showDetailedError(function() {
                      callback(false);
                    });
                  }
                  callback(false);
                } else if (text.match(resultParser[version].success)) {
                  grunt.log.writeln("Result: %s", text.replace(/\n/g, ' '));
                  callback(true);
                } else if (++retryCount * testInterval <= testTimeout) {
                  grunt.verbose.writeln("[%s] %s. Still running, Time passed - %s of %s milliseconds", cfg.prefix, retryCount, testInterval * retryCount, testTimeout);
                  setTimeout(isCompleted, testInterval);
                }
                grunt.log.writeln("Test Video: http://saucelabs.com/tests/%s", driver.sessionID);
              });
            }());
          });
        });
      });
    });
  };

  TestRunner.prototype.qunitSaucify = function(results) {
    var _data = _.reduce(results, function(a, b) {
      if (a === null) {
        return b;
      } else {
        _.each(b, function(value, key, lst) {
          a[key] += lst[key];
        });
        return a;
      }
    }, null);
    return {
      'custom-data': {
        qunit: _data
      }
    };
  };

  TestRunner.prototype.qunitRunner = function(driver, cfg, testTimeout, testInterval, testReadyTimeout, detailedError, callback) {
    var testResult = "qunit-testresult";
    grunt.verbose.writeln("[%s] Starting qunit tests for page", cfg.prefix);
    driver.waitForElementById(testResult, testReadyTimeout, function() {
      grunt.verbose.writeln("[%s] Test div found, fetching the test result element", cfg.prefix);
      driver.elementById(testResult, function(err, el) {
        if (err) {
          grunt.log.error("[%s] Could not read test result for %s", cfg.prefix, err, driver.page);
          grunt.log.error("[%s] More details at http://saucelabs.com/tests/%s", cfg.prefix, driver.page);
          callback(false);
          return;
        }
        grunt.verbose.writeln("[%s] Fetched test result element, waiting for text inside it to change to complete", cfg.prefix);
        var retryCount = 0;

        var showDetailedError = function(cb) {
          driver.elementById('qunit-tests', function(err, detailEl) {
            driver.text(detailEl, function(err, detailText) {
              grunt.log.error("\n%s", detailText);
              cb();
            });
          });
        };

        var fetchResults = function(cb, status) {
          driver.safeEval("window.global_test_results", function(err, obj) {
            cb(status, err || obj);
          });
        };

        (function isCompleted() {
          driver.text(el, function(err, text) {
            if (typeof text !== 'string'){
              grunt.log.error('Error - Could not read text to check if this was completed %s', typeof text);
              callback(false);
              return;
            }
            if (!text.match(/completed/) && ++retryCount * testInterval <= testTimeout) {
              grunt.verbose.writeln("[%s] %s. Still running, Time passed - %s of %s milliseconds", cfg.prefix, retryCount, testInterval * retryCount, testTimeout);
              setTimeout(isCompleted, testInterval);
              return;
            }

            // Test is now completed, so parse the results
            grunt.log.subhead('\nTested %s', driver.page);
            grunt.log.writeln('Environment: %s', cfg.prefix);
            if (err) {
              grunt.log.error("Could not see test results: %s", err.replace(/\n/g, ' '));
              fetchResults(callback, false);
              return;
            }
            if (retryCount * testInterval > testTimeout) {
              grunt.log.error("Timeout, waited for more than %s milliseconds", testTimeout);
              fetchResults(callback, false);
              return;
            }
            var x = text.split(/\n|of|,/);
            if (parseInt(x[1], 10) !== parseInt(x[2], 10)) {
              if (detailedError) {
                return showDetailedError(function() {
                  fetchResults(callback, false);
                });
              }
              fetchResults(callback, false);
            } else {
              grunt.log.ok("Result: %s", text.replace(/\n/g, '  '));
              fetchResults(callback, true);
            }
            grunt.log.writeln("Test Video: http://saucelabs.com/tests/%s", driver.sessionID);
          });
        }());
      });
    });
  };

  var defaultsObj = {
    username: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    identifier: Math.floor((new Date()).getTime() / 1000 - 1230768000).toString(),
    tunneled: true,
    testTimeout: (1000 * 60 * 5),
    tunnelTimeout: 120,
    testInterval: 1000 * 5,
    testReadyTimeout: 1000 * 5,
    onTestComplete: function() {

    },
    detailedError: false,
    testname: "",
    tags: [],
    browsers: [{}]
  };

  function defaults(data) {
    var result = data;
    result.pages = result.url || result.urls;
    if (!_.isArray(result.pages)) {
      result.pages = [result.pages];
    }

    _.map(result.browsers, function(d) {
      return _.extend(d, {
        'name': result.testname,
        'tags': result.tags,
        'build': result.build,
        'tunnel-identifier': result.tunneled ? result.identifier : ''
      });
    });
    result.concurrency = result.concurrency || result.browsers.length;
    return result;
  }

  grunt.registerMultiTask('saucelabs-jasmine', 'Run Jasmine test cases using Sauce Labs browsers', function() {
    var done = this.async(),
      arg = defaults(this.options(defaultsObj), this.data.browsers);
    var tunnel = new SauceTunnel(arg.username, arg.key, arg.identifier, arg.tunneled, arg.tunnelTimeout);
    grunt.log.writeln("=> Connecting to Saucelabs ...");
    if (this.tunneled) {
      grunt.verbose.writeln("=> Starting Tunnel to Sauce Labs".inverse.bold);
    }
    tunnel.start(function(isCreated) {
      if (!isCreated) {
        done(false);
        return;
      }
      grunt.log.ok("Connected to Saucelabs");
      var test = new TestRunner(arg.username, arg.key);
      test.forEachBrowser(arg.browsers, test.jasmineRunner, null, arg.concurrency, arg.onTestComplete).testPages(arg.pages, arg.testTimeout, arg.testInterval, arg.testReadyTimeout, arg.detailedError, function(status) {
        grunt.log[status ? 'ok' : 'error']("All tests completed with status %s", status);
        tunnel.stop(function() {
          done(status);
        });
      });
    });
  });

  grunt.registerMultiTask('saucelabs-qunit', 'Run Qunit test cases using Sauce Labs browsers', function() {
    var done = this.async(),
      arg = defaults(this.options(defaultsObj));
    var tunnel = new SauceTunnel(arg.username, arg.key, arg.identifier, arg.tunneled, arg.tunnelTimeout);
    grunt.log.writeln("=> Connecting to Saucelabs ...");
    if (this.tunneled) {
      grunt.verbose.writeln("=> Starting Tunnel to Sauce Labs".inverse.bold);
    }
    tunnel.start(function(isCreated) {
      if (!isCreated) {
        done(false);
        return;
      }
      grunt.log.ok("Connected to Saucelabs");
      var test = new TestRunner(arg.username, arg.key);
      test.forEachBrowser(arg.browsers, test.qunitRunner, test.qunitSaucify, arg.concurrency, arg.onTestComplete).testPages(arg.pages, arg.testTimeout, arg.testInterval, arg.testReadyTimeout, arg.detailedError, function(status) {
        grunt.log[status ? 'ok' : 'error']("All tests completed with status %s", status);
        tunnel.stop(function() {
          done(status);
        });
      });
    });
  });
};
