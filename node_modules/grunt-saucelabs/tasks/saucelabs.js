module.exports = function(grunt) {
  var _ = (grunt.utils || grunt.util)._;
  var request = require('request');
  var proc = require('child_process');
  var wd = require('wd');
  var rqst = request.defaults({jar: false});

  var SauceStatus = function(user, key) {
    this.user = user;
    this.key = key;
    this.baseUrl = ["https://", this.user, ':', this.key, '@saucelabs.com', '/rest/v1/', this.user].join("");
  };

  SauceStatus.prototype.passed = function(jobid, status, callback) {
    var _body = JSON.stringify({ "passed": status }),
      _url = this.baseUrl + "/jobs/" + jobid;
    rqst({
      headers: { 'content-type' : 'application/x-www-form-urlencoded' },
      method: "PUT",
      url: _url,
      body: _body,
      json: true
    }, function() {
      callback();
    });
  };

  var SauceTunnel = function(user, key, tunneled, tunnelTimeout) {
      this.user = user;
      this.key = key;
      this.tunneled = tunneled;
      this.tunnelTimeout = tunnelTimeout;
      this.baseUrl = ["https://", this.user, ':', this.key, '@saucelabs.com', '/rest/v1/', this.user].join("");
    };

  SauceTunnel.prototype.openTunnel = function(callback) {
    var args = ["-jar", __dirname + "/Sauce-Connect.jar", this.user, this.key];
    this.proc = proc.spawn('java', args);
    var calledBack = false;

    this.proc.stdout.on('data', function(data) {
      if(!data.toString().match(/^\[-u,/g)) {
        console.log(data.toString().replace(/[\n\r]/g, ''));
      }
      if(data.toString().match(/Connected\! You may start your tests/)) {
        console.log('=> Sauce Labs Tunnel established'.cyan);
        if(!calledBack) {
          calledBack = true;
          callback(true);
        }
      }
    });

    this.proc.stderr.on('data', function(data) {
      console.log(data.toString().replace(/[\n\r]/g, '').red);
    });

    this.proc.on('exit', function(code) {
      console.log('=> Sauce Labs Tunnel disconnected ', code);
      if(!calledBack) {
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
    console.log("Trying to kill all tunnels".cyan);
    this.getTunnels(function(tunnels) {
      (function killTunnel(i) {
        if(i >= tunnels.length) {
          setTimeout(callback, 1000 * 5);
          return;
        }
        console.log("Killing tunnel %s".red, tunnels[i]);
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
      if (!tunnels){
        console.log("=> Could not get tunnels for Sauce Labs. Still continuing to try connecting to Sauce Labs".red.inverse);
      }
      if(tunnels && tunnels.length > 0) {
        console.log("=> Looks like there are existing tunnels to Sauce Labs - %s".bold, tunnels);
        (function waitForTunnelsToDie(retryCount) {
          if(retryCount > 5) {
            console.log("=> Waited for %s retries, now trying to shut down all tunnels and try again".bold, retryCount);
            me.killAllTunnels(function() {
              me.start(callback);
            });
          } else {
            console.log("=> %s. Sauce Labs tunnels already exist, will try to connect again %s milliseconds.".red, retryCount, me.tunnelTimeout / 5);
            setTimeout(function() {
              waitForTunnelsToDie(retryCount + 1);
            }, me.tunnelTimeout / 5);
          }
        }(0));
      } else {
        console.log("=> Sauce Labs trying to open tunnel".inverse);
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

  TestRunner.prototype.forEachBrowser = function(configs, runner, concurrency, onTestComplete) {
    var me = this;
    return {
      testPages: function(pages, testTimeout, testInterval, testReadyTimeout, detailedError, callback) {

        function initBrowser(cfg) {
          cfg.name = cfg.name || [cfg.browserName, cfg.platform || "", cfg.version || ""].join("/");
          var success = true;

          function onPageTested(status, page, config, browser, cb) {
            var waitForAsync = false;
            this.async = function() {
              waitForAsync = true;
              return function(ret) {
                success = success && (typeof ret === "undefined" ? status : ret);
                cb();
              };
            };
            if(typeof onTestComplete === "function") {
              var ret = onTestComplete(status, page, config, browser);
              status = typeof ret === "undefined" ? status : ret;
            }
            if(!waitForAsync) {
              success = success && status;
              cb();
            }
          }

          return function(done) {
            var driver = wd.remote(me.host, me.port, me.user, me.key);
            console.log("Starting tests on browser configuration".cyan, cfg);
            driver.init(cfg, function(err, sessionId) {
              if(err) {
                console.log("[%s] Could not initialize browser for session".red, cfg.name, sessionId, cfg);
                success = false;
                me.report.passed(driver.sessionID, success, function() {
                  done(success);
                });
                return;
              }
              (function testPage(j) {
                if(j >= pages.length) {
                  driver.quit(function() {
                    me.report.passed(driver.sessionID, success, function() {
                      done(success);
                    });
                  });
                  return;
                }
                console.log("[%s] Starting test for page (%s) %s".cyan, cfg.name, j, pages[j]);
                driver.get(pages[j], function(err) {
                  if(err) {
                    console.log("[%s] Could not fetch page (%s)%s".red, cfg.name,  j, pages[j]);
                    onPageTested(false, pages[j], cfg, driver, function() {
                      testPage(j + 1);
                    });
                    return;
                  }
                  runner.call(me, driver, cfg, testTimeout, testInterval, testReadyTimeout, detailedError, function(status) {
                    onPageTested(status, pages[j], cfg, driver, function() {
                      console.log("[%s] Test Results: http://saucelabs.com/tests/%s  ".yellow, cfg.name, driver.sessionID);
                      testPage(j + 1);
                    });
                  });
                });
              }(0));
            });
          };
        }

        var brwrs = [], curr = 0, running = 0, res = true;
        _.each(configs, function(_c) {
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

  TestRunner.prototype.jasmineRunner = function(driver, cfg,testTimeout, testInterval, testReadyTimeout, detailedError, callback) {
    console.log("Starting Jasmine tests".cyan);
    driver.waitForElementByClassName('alert', testReadyTimeout, function() {
      driver.elementsByClassName('version', function(err, el) {
        if(err) {
          console.log("[%s] Could not get element by id".red, cfg.name, err);
          callback(false);
          return;
        }
        driver.text(el, function(err, versionText) {
          if(err) {
            console.log("[%s] Could not see test inside element".red, cfg.name,err);
            callback(false);
          }

          var versionMatch = versionText.match(/[0-9]+(\.[0-9]+)*/);
          var version = versionMatch && versionMatch[0];
          console.log("[%s] Detected jasmine version %s".cyan, cfg.name, version);

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


          var showDetailedError = function (callback) {
            driver.elementById('details', function(err, detailEl) {
              driver.text(detailEl, function (err, detailText) {
                console.log("\n%s", detailText.red);
                callback();
              });
            });
          };

          driver.elementsByClassName(resultParser[version].resultClass, function(err, els) {
            if(err) {
              console.log("[%s] Could not get element by id".red, cfg.name, err);
              callback(false);
              return;
            }
            console.log("Fetched test result element, waiting for text inside it to change to complete".cyan);
            var el = els[0];
            var retryCount = 0;
            (function isCompleted() {
              driver.text(el, function(err, text) {
                if(err) {
                  console.log("[%s] Could not see test inside element".red, cfg.name,err);
                  callback(false);
                } else if(retryCount * testInterval > testTimeout) {
                  console.log("[%s] Failed, waited for more than %s milliseconds".red, cfg.name,testTimeout);
                  callback(false);
                } else if(text.match(resultParser[version].fail)) {
                  console.log("[%s] => Tests ran result %s".red, cfg.name,text);
                  if (detailedError) {
                    return showDetailedError(function () {
                      callback(false);
                    });
                  }
                  callback(false);
                } else if(text.match(resultParser[version].success)) {
                  console.log("[%s] => Tests ran result %s".green, cfg.name,text);
                  callback(true);
                } else if(++retryCount * testInterval <= testTimeout) {
                  console.log("[%s] %s. Still running, Time passed - %s of %s milliseconds".yellow, cfg.name, retryCount, testInterval * retryCount, testTimeout);
                  setTimeout(isCompleted, testInterval);
                }
              });
            }());
          });
        });
      });
    });
  };

  TestRunner.prototype.qunitRunner = function(driver, cfg, testTimeout, testInterval, testReadyTimeout, detailedError, callback) {
    var testResult = "qunit-testresult";
    console.log("[%s] Starting qunit tests".cyan, cfg.name);
    driver.waitForElementById(testResult, testReadyTimeout, function() {
      console.log("[%s] Test div found, fetching the test result element".cyan, cfg.name);
      driver.elementById(testResult, function(err, el) {
        if(err) {
          console.log("[%s] Could not get element by id".red, cfg.name, err);
          callback(false);
          return;
        }
        console.log("[%s] Fetched test result element, waiting for text inside it to change to complete".cyan, cfg.name);
        var retryCount = 0;

        var showDetailedError = function (cb) {
          driver.elementById('qunit-tests', function(err, detailEl) {
            driver.text(detailEl, function (err, detailText) {
              console.log("\n%s", detailText.red);
              cb();
            });
          });
        };

        (function isCompleted() {
          driver.text(el, function(err, text) {
            if(err) {
              console.log("[%s] Could not see test inside element".red, cfg.name, err);
              callback(false);
              return;
            }
            if(!text.match(/completed/) && ++retryCount * testInterval <= testTimeout) {
              console.log("[%s] %s. Still running, Time passed - %s of %s milliseconds".yellow, cfg.name, retryCount, testInterval * retryCount, testTimeout);
              setTimeout(isCompleted, testInterval);
              return;
            }
            if(retryCount * testInterval > testTimeout) {
              console.log("[%s] Failed, waited for more than %s milliseconds".red, cfg.name, testTimeout);
              callback(false);
              return;
            }
            var x = text.split(/\n|of|,/);
            if(parseInt(x[1], 10) !== parseInt(x[2], 10)) {
              console.log("[%s] => Tests ran result %s".red, cfg.name, text);
              if (detailedError) {
                return showDetailedError(function () {
                  callback(false);
                });
              }
              callback(false);
            } else {
              console.log("[%s] => Tests ran result %s".green, cfg.name, text);
              callback(true);
            }
          });
        }());
      });
    });
  };

  function defaults(data) {
    var result = {}, build = Math.floor((new Date()).getTime() / 1000 - 1230768000).toString();
    result.url = data.url || data.urls;
    if(_.isArray(result.url)) {
      result.pages = result.url;
    } else {
      result.pages = [result.url];
    }

    result.username = data.username || process.env.SAUCE_USERNAME;
    result.key = data.key || process.env.SAUCE_ACCESS_KEY;
    result.tunneled = typeof data.tunneled !== 'undefined' ? data.tunneled : true;
    result.tunnelTimeout = data.tunnelTimeout || 120;
    result.testTimeout = data.testTimeout || (1000 * 60 * 5);
    result.testInterval = data.testInterval || (1000 * 5);
    result.testReadyTimeout = data.testReadyTimeout || (1000 * 5);
    result.onTestComplete = data.onTestComplete;
    result.detailedError = data.detailedError || false;

    _.map(data.browsers, function(d) {
      d.name = d.name || data.testname || "";
      d.tags = d.tags || data.tags || [];
      d.build = data.build || build;
    });
    result.configs = data.browsers || [{}];
    result.concurrency = data.concurrency || result.configs.length;
    return result;
  }

  grunt.registerMultiTask('saucelabs-jasmine', 'Run Jasmine test cases using Sauce Labs browsers', function() {
    var done = this.async(),
      arg = defaults(this.data);
    var tunnel = new SauceTunnel(arg.username, arg.key, arg.tunneled, arg.tunnelTimeout);
    if (this.tunneled) {
      console.log("=> Starting Tunnel to Sauce Labs".inverse.bold);
    }
    tunnel.start(function(isCreated) {
      if(!isCreated) {
        done(false);
      }
      var test = new TestRunner(arg.username, arg.key);
      test.forEachBrowser(arg.configs, test.jasmineRunner, arg.concurrency, arg.onTestComplete).testPages(arg.pages, arg.testTimeout, arg.testInterval, arg.testReadyTimeout, arg.detailedError, function(status) {
        console.log("All tests completed with status %s".blue, status);
        tunnel.stop(function() {
          done(status);
        });
      });
    });
  });

  grunt.registerMultiTask('saucelabs-qunit', 'Run Qunit test cases using Sauce Labs browsers', function() {
    var done = this.async(),
      arg = defaults(this.data);
    var tunnel = new SauceTunnel(arg.username, arg.key, arg.tunneled, arg.tunnelTimeout);
    if (this.tunneled) {
      console.log("=> Starting Tunnel to Sauce Labs".inverse.bold);
    }
    tunnel.start(function(isCreated) {
      if(!isCreated) {
        done(false);
      }
      var test = new TestRunner(arg.username, arg.key);
      test.forEachBrowser(arg.configs, test.qunitRunner, arg.concurrency, arg.onTestComplete).testPages(arg.pages, arg.testTimeout, arg.testInterval, arg.testReadyTimeout, arg.detailedError, function(status) {
        console.log("All tests completed with status %s", status);
        tunnel.stop(function() {
          done(status);
        });
      });
    });
  });
};
