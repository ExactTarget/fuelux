/*global describe,before,it,after */
var CoffeeScript, Express, TIMEOUT_BASE, async, elementByCss, evalShouldEqual, executeCoffee, imageinfo, safeEvalShouldEqual, should, test, textShouldEqual, valueShouldEqual, wd;

CoffeeScript = require('coffee-script');

should = require('should');

async = require('async');

imageinfo = require('imageinfo');

Express = require('./express').Express;

wd = require('./wd-with-cov');

TIMEOUT_BASE = 1000;

if (process.env.GHOSTDRIVER_TEST) {
  TIMEOUT_BASE = 250;
}

evalShouldEqual = function(browser, formula, expected) {
  return function(done) {
    browser["eval"](formula, function(err, res) {
      should.not.exist(err);
      res.should.equal(expected);
      done(null);
    });
  };
};

safeEvalShouldEqual = function(browser, formula, expected) {
  return function(done) {
    browser.safeEval(formula, function(err, res) {
      should.not.exist(err);
      res.should.equal(expected);
      done(null);
    });
  };
};

executeCoffee = function(browser, script) {
  var scriptAsJs;
  scriptAsJs = CoffeeScript.compile(script, {
    bare: 'on'
  });
  return function(done) {
    browser.execute(scriptAsJs, function(err) {
      should.not.exist(err);
      done(null);
    });
  };
};

elementByCss = function(browser, env, css, name) {
  return function(done) {
    browser.elementByCss(css, function(err, res) {
      should.not.exist(err);
      env[name] = res;
      done(null);
    });
  };
};

textShouldEqual = function(browser, element, expected, done) {
  browser.text(element, function(err, res) {
    should.not.exist(err);
    res.should.equal(expected);
    done(null);
  });
};

valueShouldEqual = function(browser, element, expected, done) {
  browser.getValue(element, function(err, res) {
    should.not.exist(err);
    res.should.equal(expected);
    done(null);
  });
};

test = function(remoteWdConfig, desired) {
  var browser, elementFunctionTests, express;
  browser = null;
  express = new Express();
  before(function(done) {
    express.start();
    done(null);
  });
  after(function(done) {
    express.stop();
    done(null);
  });
  elementFunctionTests = function() {
    var _funcSuffix, _i, _len, _ref, _results;
    describe("element", function() {
      it("should retrieve element", function(done) {
        async.series([
          function(done) {
            browser.element("name", "elementByName", function(err, res) {
              should.not.exist(err);
              should.exist(res);
              done(null);
            });
          }, function(done) {
            browser.element("name", "elementByName2", function(err, res) {
              should.exist(err);
              err.status.should.equal(7);
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
    describe("elementOrNull", function() {
      it("should retrieve element or null", function(done) {
        async.series([
          function(done) {
            browser.elementOrNull("name", "elementByName", function(err, res) {
              should.not.exist(err);
              should.exist(res);
              done(null);
            });
          }, function(done) {
            browser.elementOrNull("name", "elementByName2", function(err, res) {
              should.not.exist(err);
              (res === null).should.be.true;
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
    describe("elementIfExists", function() {
      it("should retrieve element or undefined", function(done) {
        async.series([
          function(done) {
            browser.elementIfExists("name", "elementByName", function(err, res) {
              should.not.exist(err);
              should.exist(res);
              done(null);
            });
          }, function(done) {
            browser.elementIfExists("name", "elementByName2", function(err, res) {
              should.not.exist(err);
              (res === undefined).should.be.true;
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
    describe("hasElement", function() {
      it("should check if element exist", function(done) {
        async.series([
          function(done) {
            browser.hasElement("name", "elementByName", function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              done(null);
            });
          }, function(done) {
            browser.hasElement("name", "elementByName2", function(err, res) {
              should.not.exist(err);
              res.should.be.false;
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
    describe("waitForElement", function() {
      it("should wait for element", function(done) {
        this.timeout(10000);
        async.series([
          executeCoffee(browser, "setTimeout ->\n  $('#waitForElement').append '<div class=\"child\">a waitForElement child</div>'\n, " + (0.75 * TIMEOUT_BASE)), function(done) {
            browser.elementByCss("#waitForElement .child", function(err, res) {
              should.exist(err);
              err.status.should.equal(7);
              done(null);
            });
          }, function(done) {
            browser.waitForElement("css selector", "#waitForElement .child", 2 * TIMEOUT_BASE, function(err) {
              should.not.exist(err);
              done(err);
            });
          }, function(done) {
            browser.waitForElement("css selector", "#wrongsel .child", 2 * TIMEOUT_BASE, function(err) {
              should.exist(err);
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
    describe("waitForVisible", function() {
      it("should wait until element is visible", function(done) {
        this.timeout(10000);
        async.series([
          executeCoffee(browser, "$('#waitForVisible').append '<div class=\"child\">a waitForVisible child</div>'              \n$('#waitForVisible .child').hide()\nsetTimeout ->\n  $('#waitForVisible .child').show()\n, " + (0.75 * TIMEOUT_BASE)), function(done) {
            browser.elementByCss("#waitForVisible .child", function(err, res) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            browser.waitForVisible("css selector", "#waitForVisible .child", 2 * TIMEOUT_BASE, function(err) {
              should.not.exist(err);
              done(err);
            });
          }, function(done) {
            browser.waitForVisible("css selector", "#wrongsel .child", 2 * TIMEOUT_BASE, function(err) {
              should.exist(err);
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
    describe("elements", function() {
      it("should retrieve several elements", function(done) {
        async.series([
          function(done) {
            browser.elements("name", "elementsByName", function(err, res) {
              should.not.exist(err);
              res.should.have.length(3);
              done(null);
            });
          }, function(done) {
            browser.elements("name", "elementsByName2", function(err, res) {
              should.not.exist(err);
              res.should.eql([]);
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
    _ref = ['ByClassName', 'ByCssSelector', 'ById', 'ByName', 'ByLinkText', 'ByPartialLinkText', 'ByTagName', 'ByXPath', 'ByCss'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _funcSuffix = _ref[_i];
      _results.push((function() {
        var elementFuncName, elementsFuncName, funcSuffix, hasElementFuncName, searchSeveralText, searchSeveralText2, searchText, searchText2, waitForElementFuncName, waitForVisibleFuncName;
        funcSuffix = _funcSuffix;
        elementFuncName = 'element' + funcSuffix;
        hasElementFuncName = 'hasElement' + funcSuffix;
        elementsFuncName = 'elements' + funcSuffix;
        waitForElementFuncName = 'waitForElement' + funcSuffix;
        waitForVisibleFuncName = 'waitForVisible' + funcSuffix;
        searchText = elementFuncName;
        if (searchText.match(/ByLinkText/)) {
          searchText = "click " + searchText;
        }
        if (searchText.match(/ByCss/)) {
          searchText = "." + searchText;
        }
        if (searchText.match(/ByXPath/)) {
          searchText = "//div[@id='elementByXPath']/input";
        }
        if (searchText.match(/ByTagName/)) {
          searchText = "span";
        }
        searchText2 = searchText + '2';
        if (searchText.match(/ByXPath/)) {
          searchText2 = "//div[@id='elementByXPath2']/input";
        }
        if (searchText.match(/ByTagName/)) {
          searchText2 = "span2";
        }
        searchSeveralText = searchText.replace('element', 'elements');
        searchSeveralText2 = searchText2.replace('element', 'elements');
        describe(elementFuncName, function() {
          it("should retrieve element", function(done) {
            async.series([
              function(done) {
                browser[elementFuncName](searchText, function(err, res) {
                  should.not.exist(err);
                  should.exist(res);
                  done(null);
                });
              }, function(done) {
                browser[elementFuncName](searchText2, function(err, res) {
                  should.exist(err);
                  err.status.should.equal(7);
                  done(null);
                });
              }
            ], function(err) {
              should.not.exist(err);
              done(null);
            });
          });
        });
        describe( elementFuncName + "OrNull", function() {
          it("should retrieve element or null", function(done) {
            async.series([
              function(done) {
                browser[elementFuncName + 'OrNull'](searchText, function(err, res) {
                  should.not.exist(err);
                  should.exist(res);
                  done(null);
                });
              }, function(done) {
                browser[elementFuncName + 'OrNull'](searchText2, function(err, res) {
                  should.not.exist(err);
                  (res === null).should.be.true;
                  done(null);
                });
              }
            ], function(err) {
              should.not.exist(err);
              done(null);
            });
          });
        });
        describe(elementFuncName + "IfExists", function() {
          it("should retrieve element or undefined", function(done) {
            async.series([
              function(done) {
                browser[elementFuncName + 'IfExists'](searchText, function(err, res) {
                  should.not.exist(err);
                  should.exist(res);
                  done(null);
                });
              }, function(done) {
                browser[elementFuncName + 'IfExists'](searchText2, function(err, res) {
                  should.not.exist(err);
                  (res === undefined).should.be.true;
                  done(null);
                });
              }
            ], function(err) {
              should.not.exist(err);
              done(null);
            });
          });
        });
        describe(hasElementFuncName, function() {
          it("should check if element exists", function(done) {
            async.series([
              function(done) {
                browser[hasElementFuncName](searchText, function(err, res) {
                  should.not.exist(err);
                  res.should.be.true;
                  done(null);
                });
              }, function(done) {
                browser[hasElementFuncName](searchText2, function(err, res) {
                  should.not.exist(err);
                  res.should.be.false;
                  done(null);
                });
              }
            ], function(err) {
              should.not.exist(err);
              done(null);
            });
          });
        });
        describe(waitForElementFuncName, function() {
          it("should wait for element (" + funcSuffix + ")", function(done) {
            var childHtml, searchChild;
            this.timeout(10000);
            childHtml = "<div class='child child_" + waitForElementFuncName + "'>a " + waitForElementFuncName + " child</div>";
            if (funcSuffix.match(/ById/)) {
              childHtml = "<div class='child' id='child_" + waitForElementFuncName + "'>a " + waitForElementFuncName + " child</div>";
            }
            if (funcSuffix.match(/ByName/)) {
              childHtml = "<div class='child' name='child_" + waitForElementFuncName + "'>a " + waitForElementFuncName + " child</div>";
            }
            if (funcSuffix.match(/ByLinkText/)) {
              childHtml = "<a class='child'>child_" + waitForElementFuncName + "</a>";
            }
            if (funcSuffix.match(/ByPartialLinkText/)) {
              childHtml = "<a class='child'>hello child_" + waitForElementFuncName + "</a>";
            }
            if (funcSuffix.match(/ByTagName/)) {
              childHtml = "<hr class='child'>";
            }
            searchChild = "child_" + waitForElementFuncName;
            if (funcSuffix.match(/ByCss/)) {
              searchChild = "." + searchChild;
            }
            if (funcSuffix.match(/ByTagName/)) {
              searchChild = "hr";
            }
            if (funcSuffix.match(/ByXPath/)) {
              searchChild = "//div[@class='child child_" + waitForElementFuncName + "']";
            }
            async.series([
              executeCoffee(browser, "$('hr').remove()                \nsetTimeout ->\n  $('#" + waitForElementFuncName + "').append \"" + childHtml + "\"\n, " + (0.75 * TIMEOUT_BASE)), function(done) {
                browser[elementFuncName](searchChild, function(err, res) {
                  should.exist(err);
                  err.status.should.equal(7);
                  done(null);
                });
              }, function(done) {
                browser[waitForElementFuncName](searchChild, 2 * TIMEOUT_BASE, function(err) {
                  should.not.exist(err);
                  done(err);
                });
              }, function(done) {
                if (funcSuffix === 'ByClassName') {
                  browser[waitForElementFuncName]("__wrongsel", 2 * TIMEOUT_BASE, function(err) {
                    should.exist(err);
                    done(null);
                  });
                } else {
                  done(null);
                }
              }
            ], function(err) {
              should.not.exist(err);
              done(null);
            });
          });
        });
        describe(waitForVisibleFuncName, function() {
          it("should wait until element is visible", function(done) {
            var childHtml, searchChild;
            this.timeout(10000);
            childHtml = "<div class='child child_" + waitForVisibleFuncName + "'>a " + waitForVisibleFuncName + " child</div>";
            if (funcSuffix.match(/ById/)) {
              childHtml = "<div class='child' id='child_" + waitForVisibleFuncName + "'>a " + waitForVisibleFuncName + " child</div>";
            }
            if (funcSuffix.match(/ByName/)) {
              childHtml = "<div class='child' name='child_" + waitForVisibleFuncName + "'>a " + waitForVisibleFuncName + " child</div>";
            }
            if (funcSuffix.match(/ByLinkText/)) {
              childHtml = "<a class='child'>child_" + waitForVisibleFuncName + "</a>";
            }
            if (funcSuffix.match(/ByPartialLinkText/)) {
              childHtml = "<a class='child'>hello child_" + waitForVisibleFuncName + "</a>";
            }
            if (funcSuffix.match(/ByTagName/)) {
              childHtml = "<hr class='child'>";
            }
            searchChild = "child_" + waitForVisibleFuncName;
            if (funcSuffix.match(/ByCss/)) {
              searchChild = "." + searchChild;
            }
            if (funcSuffix.match(/ByTagName/)) {
              searchChild = "hr";
            }
            if (funcSuffix.match(/ByXPath/)) {
              searchChild = "//div[@class='child child_" + waitForVisibleFuncName + "']";
            }
            async.series([
              executeCoffee(browser, "$('hr').remove()\n$('#" + waitForVisibleFuncName + "').append \"" + childHtml + "\"\n$('#" + waitForVisibleFuncName + " .child').hide()\nsetTimeout ->\n  $('#" + waitForVisibleFuncName + " .child').show()\n, " + (0.75 * TIMEOUT_BASE)), function(done) {
                if (funcSuffix !== 'ByLinkText' && funcSuffix !== 'ByPartialLinkText') {
                  browser[elementFuncName](searchChild, function(err, res) {
                    should.not.exist(err);
                    done(null);
                  });
                } else {
                  done(null);
                }
              }, function(done) {
                browser[waitForVisibleFuncName](searchChild, 2 * TIMEOUT_BASE, function(err) {
                  should.not.exist(err);
                  done(err);
                });
              }, function(done) {
                if (funcSuffix === 'ByClassName') {
                  browser[waitForVisibleFuncName]("__wrongsel", 2 * TIMEOUT_BASE, function(err) {
                    should.exist(err);
                    done(null);
                  });
                } else {
                  done(null);
                }
              }
            ], function(err) {
              should.not.exist(err);
              done(null);
            });
          });
        });
        describe(elementsFuncName, function() {
          it("should retrieve several elements", function(done) {
            async.series([
              function(done) {
                browser[elementsFuncName](searchSeveralText, function(err, res) {
                  should.not.exist(err);
                  if (elementsFuncName.match(/ById/)) {
                    res.should.have.length(1);
                  } else if (elementsFuncName.match(/ByTagName/)) {
                    (res.length > 1).should.be.true;
                  } else {
                    res.should.have.length(3);
                  }
                  done(null);
                });
              }, function(done) {
                browser[elementsFuncName](searchSeveralText2, function(err, res) {
                  should.not.exist(err);
                  res.should.eql([]);
                  done(null);
                });
              }
            ], function(err) {
              should.not.exist(err);
              done(null);
            });
          });
        });
      })());
    }
    _results;
  };
  describe("wd.remote<COMP>", function() {
    it("should create browser object", function(done) {
      browser = wd.remote(remoteWdConfig);
      if (!process.env.WD_COV) {
        browser.on("status", function(info) {
          console.log("\u001b[36m%s\u001b[0m", info);
        });
        browser.on("command", function(meth, path) {
          console.log(" > \u001b[33m%s\u001b[0m: %s", meth, path);
        });
      }
      done(null);
    });
  });
  describe("status", function() {
    it("should retrieve selenium server status", function(done) {
      browser.status(function(err, status) {
        should.not.exist(err);
        should.exist(status);
        done(null);
      });
    });
  });
  describe("sessions", function() {
    it("should retrieve selenium server sessions", function(done) {
      browser.sessions(function(err, sessions) {
        should.not.exist(err);
        should.exist(sessions);
        done(null);
      });
    });
  });
  describe("init<COMP>", function() {
    it("should initialize browser and open browser window", function(done) {
      this.timeout(20000);
      browser.init(desired, function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("sessionCapabilities", function() {
    it("should retrieve the session capabilities", function(done) {
      browser.sessionCapabilities(function(err, capabilities) {
        should.not.exist(err);
        should.exist(capabilities);
        should.exist(capabilities.browserName);
        should.exist(capabilities.platform);
        done(null);
      });
    });
  });
  describe("altSessionCapabilities", function() {
    it("should retrieve the session capabilities using alt method", function(done) {
      browser.altSessionCapabilities(function(err, capabilities) {
        should.not.exist(err);
        should.exist(capabilities);
        should.exist(capabilities.browserName);
        should.exist(capabilities.platform);
        done(null);
      });
    });
  });
  describe("get<COMP>", function() {
    it("should navigate to the test page", function(done) {
      this.timeout(20000);
      browser.get("http://127.0.0.1:8181/test-page.html", function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  if ((desired? desired.browserName : undefined) !== 'chrome') {
    // would do with better test, but can't be bothered
    // not working on chrome
    describe("setPageLoadTimeout", function() {
      it("should set the page load timeout, test get, and unset it", function(done) {
        this.timeout(10000);
        async.series([
          function(done) {
            browser.setPageLoadTimeout(TIMEOUT_BASE / 2, function(err) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            browser.setPageLoadTimeout(TIMEOUT_BASE / 2, function(err) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            browser.get("http://127.0.0.1:8181/test-page.html", function(err) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            var defaultTimeout;
            defaultTimeout = (desired && (desired.browserName === 'firefox'))? -1 : 10000;
            browser.setPageLoadTimeout(defaultTimeout, function(err) {
              should.not.exist(err);
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  }
  describe("refresh", function() {
    it("should refresh page", function(done) {
      this.timeout(10000);
      browser.refresh(function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("back forward", function() {
    it("urls should be correct when navigating back/forward", function(done) {
      this.timeout(45000);
      async.series([
        function(done) {
          var _this = this;
          setTimeout(function() {
            browser.get("http://127.0.0.1:8181/test-page.html?p=2", function(err) {
              should.not.exist(err);
              done(null);
            });
          }, 1000);
        }, function(done) {
          browser.url(function(err, url) {
            should.not.exist(err);
            url.should.include("?p=2");
            done(null);
          });
        }, function(done) {
          browser.back(function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.url(function(err, url) {
            should.not.exist(err);
            url.should.not.include("?p=2");
            done(null);
          });
        }, function(done) {
          browser.forward(function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.url(function(err, url) {
            should.not.exist(err);
            url.should.include("?p=2");
            done(null);
          });
        }, function(done) {
          browser.get("http://127.0.0.1:8181/test-page.html", function(err) {
            should.not.exist(err);
            done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("eval", function() {
    it("should correctly evaluate various formulas", function(done) {
      async.series([evalShouldEqual(browser, "1+2", 3), evalShouldEqual(browser, "document.title", "TEST PAGE"), evalShouldEqual(browser, "$('#eval').length", 1), evalShouldEqual(browser, "$('#eval li').length", 2)], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
    describe("safeEval", function() {
      it("should correctly evaluate (with safeEval) various formulas", function(done) {
        async.series([
          safeEvalShouldEqual(browser, "1+2", 3), safeEvalShouldEqual(browser, "document.title", "TEST PAGE"), safeEvalShouldEqual(browser, "$('#eval').length", 1), safeEvalShouldEqual(browser, "$('#eval li').length", 2), function(done) {
            browser.safeEval('wrong formula +', function(err, res) {
              should.exist(err);
              (err instanceof Error).should.be.true;
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  });
  describe("execute (no args)", function() {
    it("should execute script", function(done) {
      async.series([
        function(done) {
          browser.execute("window.wd_sync_execute_test = 'It worked!'", function(err) {
            should.not.exist(err);
            done(null);
          });
        }, evalShouldEqual(browser, "window.wd_sync_execute_test", 'It worked!')
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("execute (with args)", function() {
    it("should execute script", function(done) {
      var jsScript;
      jsScript = 'var a = arguments[0], b = arguments[1];\nwindow.wd_sync_execute_test = \'It worked! \' + (a+b)';
      async.series([
        function(done) {
          browser.execute(jsScript, [6, 4], function(err) {
            should.not.exist(err);
            done(null);
          });
        }, evalShouldEqual(browser, "window.wd_sync_execute_test", 'It worked! 10')
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("safeExecute (no args)", function() {
    it("should execute script (with safeExecute)", function(done) {
      async.series([
        function(done) {
          browser.safeExecute("window.wd_sync_execute_test = 'It worked!'", function(err) {
            should.not.exist(err);
            done(null);
          });
        }, evalShouldEqual(browser, "window.wd_sync_execute_test", 'It worked!'), function(done) {
          browser.safeExecute("invalid-code> here", function(err) {
            should.exist(err);
            (err instanceof Error).should.be.true;
            done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("safeExecute (with args)", function() {
    it("should execute script (with safeExecute)", function(done) {
      var jsScript;
      jsScript = 'var a = arguments[0], b = arguments[1];\nwindow.wd_sync_execute_test = \'It worked! \' + (a+b)';
      async.series([
        function(done) {
          browser.safeExecute(jsScript, [6, 4], function(err) {
            should.not.exist(err);
            done(null);
          });
        }, evalShouldEqual(browser, "window.wd_sync_execute_test", 'It worked! 10'), function(done) {
          browser.safeExecute("invalid-code> here", [6, 4], function(err) {
            should.exist(err);
            (err instanceof Error).should.be.true;
            done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("executeAsync (no args)", function() {
    it("should execute async script", function(done) {
      var scriptAsCoffee, scriptAsJs;
      scriptAsCoffee = "[args...,done] = arguments\ndone \"OK\"              ";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      browser.executeAsync(scriptAsJs, function(err, res) {
        should.not.exist(err);
        res.should.equal("OK");
        done(null);
      });
    });
  });
  describe("executeAsync (with args)", function() {
    it("should execute async script", function(done) {
      var scriptAsCoffee, scriptAsJs;
      scriptAsCoffee = "[a,b,done] = arguments\ndone(\"OK \" + (a+b))              ";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      browser.executeAsync(scriptAsJs, [10, 5], function(err, res) {
        should.not.exist(err);
        res.should.equal("OK 15");
        done(null);
      });
    });
    describe("safeExecuteAsync (no args)", function() {
      it("should execute async script (using safeExecuteAsync)", function(done) {
        async.series([
          function(done) {
            var scriptAsCoffee, scriptAsJs;
            scriptAsCoffee = "[args...,done] = arguments\ndone \"OK\"              ";
            scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
              bare: 'on'
            });
            browser.safeExecuteAsync(scriptAsJs, function(err, res) {
              should.not.exist(err);
              res.should.equal("OK");
              done(null);
            });
          }, function(done) {
            browser.safeExecuteAsync("123 invalid<script", function(err, res) {
              should.exist(err);
              (err instanceof Error).should.be.true;
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
    describe("safeExecuteAsync (with args)", function() {
      it("should execute async script (using safeExecuteAsync)", function(done) {
        async.series([
          function(done) {
            var scriptAsCoffee, scriptAsJs;
            scriptAsCoffee = "[a,b,done] = arguments\ndone(\"OK \" + (a+b))              ";
            scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
              bare: 'on'
            });
            browser.safeExecuteAsync(scriptAsJs, [10, 5], function(err, res) {
              should.not.exist(err);
              res.should.equal("OK 15");
              done(null);
            });
          }, function(done) {
            browser.safeExecuteAsync("123 invalid<script", [10, 5], function(err, res) {
              should.exist(err);
              (err instanceof Error).should.be.true;
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  });
  describe("setImplicitWaitTimeout", function() {
    it("should set the wait timeout and implicit wait timeout, " + "run scripts to check functionality, " + "and unset them", function(done) {
      this.timeout(5000);
      async.series([
        function(done) {
          browser.setImplicitWaitTimeout(0, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, executeCoffee(browser, "setTimeout ->\n  $('#setWaitTimeout').html '<div class=\"child\">a child</div>'\n, " + TIMEOUT_BASE), function(done) {
          browser.elementByCss("#setWaitTimeout .child", function(err, res) {
            should.exist(err);
            err.status.should.equal(7);
            done(null);
          });
        }, function(done) {
          browser.setImplicitWaitTimeout(2 * TIMEOUT_BASE, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.elementByCss("#setWaitTimeout .child", function(err, res) {
            should.not.exist(err);
            should.exist(res);
            done(null);
          });
        }, function(done) {
          browser.setImplicitWaitTimeout(0, function(err) {
            should.not.exist(err);
            done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
    describe("setAsyncScriptTimeout", function() {
      it("should set the async script timeout, " + "run scripts to check functionality, " + "and unset it", function(done) {
        this.timeout(5000);
        async.series([
          function(done) {
            browser.setAsyncScriptTimeout(TIMEOUT_BASE / 2, function(err) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            var scriptAsCoffee, scriptAsJs;
            scriptAsCoffee = "[args...,done] = arguments\nsetTimeout ->\n  done \"OK\"\n, " + (2 * TIMEOUT_BASE);
            scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
              bare: 'on'
            });
            browser.executeAsync(scriptAsJs, function(err, res) {
              should.exist(err);
              err.status.should.equal(28);
              done(null);
            });
          }, function(done) {
            browser.setAsyncScriptTimeout(2 * TIMEOUT_BASE, function(err) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            var scriptAsCoffee, scriptAsJs;
            scriptAsCoffee = "[args...,done] = arguments\nsetTimeout ->\n  done \"OK\"\n, " + (TIMEOUT_BASE / 2);
            scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
              bare: 'on'
            });
            browser.executeAsync(scriptAsJs, function(err, res) {
              should.not.exist(err);
              res.should.equal("OK");
              done(null);
            });
          }, function(done) {
            browser.setAsyncScriptTimeout(0, function(err) {
              should.not.exist(err);
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  });
  elementFunctionTests();
  describe("getAttribute", function() {
    it("should get correct attribute value", function(done) {
      browser.elementById("getAttribute", function(err, testDiv) {
        should.not.exist(err);
        should.exist(testDiv);
        async.series([
          function(done) {
            browser.getAttribute(testDiv, "weather", function(err, res) {
              should.not.exist(err);
              res.should.equal("sunny");
              done(null);
            });
          }, function(done) {
            browser.getAttribute(testDiv, "timezone", function(err, res) {
              should.not.exist(err);
              should.not.exist(res);
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  });
  describe("getTagName", function() {
    it("should get correct tag name", function(done) {
      async.series([
        function(done) {
          browser.elementByCss("#getTagName input", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            browser.getTagName(field, function(err, res) {
              should.not.exist(err);
              res.should.equal("input");
              done(null);
            });
          });
        }, function(done) {
          browser.elementByCss("#getTagName a", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            browser.getTagName(field, function(err, res) {
              should.not.exist(err);
              res.should.equal("a");
              done(null);
            });
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("getValue (input)", function() {
    it("should get correct value", function(done) {
      browser.elementByCss("#getValue input", function(err, inputField) {
        should.not.exist(err);
        should.exist(inputField);
        browser.getValue(inputField, function(err, res) {
          should.not.exist(err);
          res.should.equal("Hello getValueTest!");
          done(null);
        });
      });
    });
  });
  describe("getValue (textarea)", function() {
    it("should get correct value", function(done) {
      browser.elementByCss("#getValue textarea", function(err, inputField) {
        should.not.exist(err);
        should.exist(inputField);
        browser.getValue(inputField, function(err, res) {
          should.not.exist(err);
          res.should.equal("Hello getValueTest2!");
          done(null);
        });
      });
    });
  });
  describe("isDisplayed", function() {
    it("should check if elemnt is displayed", function(done) {
      async.series([
        function(done) {
          browser.elementByCss("#isDisplayed .displayed", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            browser.isDisplayed(field, function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              done(null);
            });
          });
        }, function(done) {
          browser.elementByCss("#isDisplayed .hidden", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            browser.isDisplayed(field, function(err, res) {
              should.not.exist(err);
              res.should.be.false;
              done(null);
            });
          });
        }, function(done) {
          browser.elementByCss("#isDisplayed .displayed", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            browser.displayed(field, function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              done(null);
            });
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("element.isEnabled", function() {
    it("should check if element is enabled", function(done) {
      async.series([
        function(done) {
          browser.elementByCss("#isEnabled .enabled", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            field.isEnabled(function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              done(null);
            });
          });
        }, function(done) {
          browser.elementByCss("#isEnabled .disabled", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            field.isEnabled(function(err, res) {
              should.not.exist(err);
              res.should.be.false;
              done(null);
            });
          });
        }, function(done) {
          browser.elementByCss("#isEnabled .enabled", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            field.enabled(function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              done(null);
            });
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("getComputedCss", function() {
    it("should retrieve the element computed css", function(done) {
      async.series([
        function(done) {
          browser.elementByCss("#getComputedCss a", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            browser.getComputedCss(field, 'color', function(err, res) {
              should.not.exist(err);
              should.exist(res);
              res.length.should.be.above(0);
              done(null);
            });
          });
        }, function(done) {
          browser.elementByCss("#getComputedCss a", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            browser.getComputedCSS(field, 'color', function(err, res) {
              should.not.exist(err);
              should.exist(res);
              res.length.should.be.above(0);
              done(null);
            });
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("clickElement", function() {
    it("element should be clicked", function(done) {
      browser.elementByCss("#clickElement a", function(err, anchor) {
        should.not.exist(err);
        should.exist(anchor);
        async.series([
          executeCoffee(browser, 'jQuery ->\n  a = $(\'#clickElement a\')\n  a.click ->\n    a.html \'clicked\'\n    false              '), function(done) {
            textShouldEqual(browser, anchor, "not clicked", done);
          }, function(done) {
            browser.clickElement(anchor, function(err) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            textShouldEqual(browser, anchor, "clicked", done);
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  });
  describe("moveTo", function() {
    it("should move to correct element", function(done) {
      var env, _textShouldEqual;
      env = {};
      _textShouldEqual = textShouldEqual;
      // hover does not trigger in phantomjs, so disabling test
      textShouldEqual = function(browser, element, expected, done) {
        if (!process.env.GHOSTDRIVER_TEST) {
          _textShouldEqual(browser, element, expected, done);
        } else {
          done(null);
        }
      };
      async.series([
        elementByCss(browser, env, "#moveTo .a1", 'a1'), elementByCss(browser, env, "#moveTo .a2", 'a2'), elementByCss(browser, env, "#moveTo .current", 'current'), function(done) {
          textShouldEqual(browser, env.current, '', done);
        }, executeCoffee(browser, 'jQuery ->\n  a1 = $(\'#moveTo .a1\')\n  a2 = $(\'#moveTo .a2\')\n  current = $(\'#moveTo .current\')\n  a1.hover ->\n    current.html \'a1\'\n  a2.hover ->\n    current.html \'a2\''), function(done) {
          textShouldEqual(browser, env.current, '', done);
        }, function(done) {
          browser.moveTo(env.a1, 5, 5, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          textShouldEqual(browser, env.current, 'a1', done);
        }, function(done) {
          done(null);
        }, function(done) {
          browser.moveTo(env.a2, void 0, void 0, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          textShouldEqual(browser, env.current, 'a2', done);
        }, function(done) {
          browser.moveTo(env.a1, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          textShouldEqual(browser, env.current, 'a1', done);
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("buttonDown / buttonUp", function() {
    it("should press/unpress button", function(done) {
      var env;
      env = {};
      async.series([
        elementByCss(browser, env, "#mouseButton a", 'a'), elementByCss(browser, env, "#mouseButton div", 'resDiv'), executeCoffee(browser, 'jQuery ->\n  a = $(\'#mouseButton a\')\n  resDiv = $(\'#mouseButton div\')\n  a.mousedown ->\n    resDiv.html \'button down\'\n  a.mouseup ->\n    resDiv.html \'button up\''), function(done) {
          textShouldEqual(browser, env.resDiv, '', done);
        }, function(done) {
          browser.moveTo(env.a, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.buttonDown(function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          textShouldEqual(browser, env.resDiv, 'button down', done);
        }, function(done) {
          browser.buttonUp(function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          textShouldEqual(browser, env.resDiv, 'button up', done);
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("click", function() {
    it("should move to then click element", function(done) {
      var env;
      env = {};
      async.series([
        elementByCss(browser, env, "#click .numOfClicks", 'numOfClicksDiv'), elementByCss(browser, env, "#click .buttonNumber", 'buttonNumberDiv'), executeCoffee(browser, 'jQuery ->\n  window.numOfClick = 0\n  numOfClicksDiv = $(\'#click .numOfClicks\')\n  buttonNumberDiv = $(\'#click .buttonNumber\')\n  numOfClicksDiv.mousedown (eventObj) ->\n    button = eventObj.button\n    button = \'default\' unless button?\n    window.numOfClick = window.numOfClick + 1\n    numOfClicksDiv.html "clicked #{window.numOfClick}"\n    buttonNumberDiv.html "#{button}"    \n    false                                         '), function(done) {
          textShouldEqual(browser, env.numOfClicksDiv, "not clicked", done);
        }, function(done) {
          browser.moveTo(env.numOfClicksDiv, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.click(0, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          textShouldEqual(browser, env.numOfClicksDiv, "clicked 1", done);
        }, function(done) {
          textShouldEqual(browser, env.buttonNumberDiv, "0", done);
        }, function(done) {
          browser.moveTo(env.numOfClicksDiv, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.click(function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          textShouldEqual(browser, env.numOfClicksDiv, "clicked 2", done);
        }, function(done) {
          textShouldEqual(browser, env.buttonNumberDiv, "0", done);
        }
        // not testing right click, cause not sure how to dismiss the right
        // click menu in chrome and firefox
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("doubleclick", function() {
    it("should move to then doubleclick element", function(done) {
      var env;
      env = {};
      async.series([
        elementByCss(browser, env, "#doubleclick div", 'div'), executeCoffee(browser, 'jQuery ->\n  div = $(\'#doubleclick div\')\n  div.dblclick ->\n    div.html \'doubleclicked\'                                 '), function(done) {
          textShouldEqual(browser, env.div, "not clicked", done);
        }, function(done) {
          browser.moveTo(env.div, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.doubleclick(function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          textShouldEqual(browser, env.div, "doubleclicked", done);
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("type", function() {
    it("should correctly input text", function(done) {
      var altKey, nullKey;
      altKey = wd.SPECIAL_KEYS.Alt;
      nullKey = wd.SPECIAL_KEYS.NULL;
      browser.elementByCss("#type input", function(err, inputField) {
        should.not.exist(err);
        should.exist(inputField);
        async.series([
          function(done) {
            valueShouldEqual(browser, inputField, "", done);
          }, function(done) {
            browser.type(inputField, "Hello", function(err) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            valueShouldEqual(browser, inputField, "Hello", done);
          }, function(done) {
            browser.type(inputField, [altKey, nullKey, " World"], function(err) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            valueShouldEqual(browser, inputField, "Hello World", done);
          }, function(done) {
            browser.type(inputField, "\n", function(err) {
              // no effect
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            valueShouldEqual(browser, inputField, "Hello World", done);
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  });
  describe("keys", function() {
    it("should press keys to input text", function(done) {
      var altKey, nullKey;
      altKey = wd.SPECIAL_KEYS.Alt;
      nullKey = wd.SPECIAL_KEYS.NULL;
      browser.elementByCss("#keys input", function(err, inputField) {
        should.not.exist(err);
        should.exist(inputField);
        async.series([
          function(done) {
            valueShouldEqual(browser, inputField, "", done);
          }, function(done) {
            browser.clickElement(inputField, function(err) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            browser.keys("Hello", function(err) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            valueShouldEqual(browser, inputField, "Hello", done);
          }, function(done) {
            browser.keys([altKey, nullKey, " World"], function(err) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            valueShouldEqual(browser, inputField, "Hello World", done);
          }, function(done) {
            browser.keys("\n", function(err) {
              // no effect
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            valueShouldEqual(browser, inputField, "Hello World", done);
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  });
  describe("clear", function() {
    it("should clear input field", function(done) {
      browser.elementByCss("#clear input", function(err, inputField) {
        should.not.exist(err);
        should.exist(inputField);
        async.series([
          function(done) {
            valueShouldEqual(browser, inputField, "not cleared", done);
          }, function(done) {
            browser.clear(inputField, function(err) {
              should.not.exist(err);
              done(null);
            });
          }, function(done) {
            valueShouldEqual(browser, inputField, "", done);
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  });
  describe("title", function() {
    it("should retrieve title", function(done) {
      browser.title(function(err, title) {
        should.not.exist(err);
        title.should.equal("TEST PAGE");
        done(null);
      });
    });
  });
  describe("text (passing element)", function() {
    it("should retrieve text", function(done) {
      browser.elementByCss("#text", function(err, textDiv) {
        should.not.exist(err);
        should.exist(textDiv);
        browser.text(textDiv, function(err, res) {
          should.not.exist(err);
          res.should.include("text content");
          res.should.not.include("div");
          done(null);
        });
      });
    });
  });
  describe("text (passing undefined)", function() {
    it("should retrieve text", function(done) {
      browser.text(undefined, function(err, res) {
        should.not.exist(err);
        // the whole page text is returned
        res.should.include("text content");
        res.should.include("sunny");
        res.should.include("click elementsByLinkText");
        res.should.not.include("div");
        done(null);
      });
    });
  });
  describe("text (passing body)", function() {
    it("should retrieve text", function(done) {
      browser.text('body', function(err, res) {
        should.not.exist(err);
        // the whole page text is returned
        res.should.include("text content");
        res.should.include("sunny");
        res.should.include("click elementsByLinkText");
        res.should.not.include("div");
        done(null);
      });
    });
  });
  describe("text (passing null)", function() {
    it("should retrieve text", function(done) {
      browser.text(null, function(err, res) {
        should.not.exist(err);
        // the whole page text is returned
        res.should.include("text content");
        res.should.include("sunny");
        res.should.include("click elementsByLinkText");
        res.should.not.include("div");
        done(null);
      });
    });
  });
  describe("textPresent", function() {
    it("should check if text is present", function(done) {
      browser.elementByCss("#textPresent", function(err, textDiv) {
        should.not.exist(err);
        should.exist(textDiv);
        async.series([
          function(done) {
            browser.textPresent('sunny', textDiv, function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              done(null);
            });
          }, function(done) {
            browser.textPresent('raining', textDiv, function(err, res) {
              should.not.exist(err);
              res.should.be.false;
              done(null);
            });
          }
        ], function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  });
  describe("getLocation (browser)", function() {
    it("should retrieve x and y locations", function(done) {
      browser.elementByCss("#elementLocation", function(err, locationDiv) {
        should.not.exist(err);
        should.exist(locationDiv);
        browser.getLocation(locationDiv, function(err, location) {
          should.not.exist(err);
          should.exist(location.x);
          should.exist(location.y);
          done(null);
        });
      });
    });
  });
  describe("getLocation (element)", function() {
    it("should retrieve x and y locations", function(done) {
      browser.elementByCss("#elementLocation", function(err, locationDiv) {
        should.not.exist(err);
        should.exist(locationDiv);
        locationDiv.getLocation(function(err, location) {
          should.not.exist(err);
          should.exist(location.x);
          should.exist(location.y);
          done(null);
        });
      });
    });
  });
  describe("getSize (element)", function() {
    it("should retrieve height and width", function(done) {
      browser.elementByCss("#elementSize", function(err, sizeDiv) {
        should.not.exist(err);
        should.exist(sizeDiv);
        sizeDiv.getSize(function(err, size) {
          should.not.exist(err);
          should.exist(size.height);
          should.exist(size.height);
          done(null);
        });
      });
    });
  });
  describe("getSize (browser)", function() {
    it("should retrieve height and width", function(done) {
      browser.elementByCss("#elementSize", function(err, sizeDiv) {
        should.not.exist(err);
        should.exist(sizeDiv);
        browser.getSize(sizeDiv, function(err, size) {
          should.not.exist(err);
          should.exist(size.width);
          should.exist(size.height);
          done(null);
        });
      });
    });
  });
  // not yet implemented in ghostdriver
  if (process.env.GHOSTDRIVER_TEST === null) {
    describe("acceptAlert", function() {
      it("should accept alert", function(done) {
        browser.elementByCss("#acceptAlert a", function(err, a) {
          should.not.exist(err);
          should.exist(a);
          async.series([
            executeCoffee(browser, "jQuery ->            \n  a = $('#acceptAlert a')\n  a.click ->\n    alert \"coffee is running out\"\n    false"), function(done) {
              browser.clickElement(a, function(err) {
                should.not.exist(err);
                done(null);
              });
            }, function(done) {
              browser.acceptAlert(function(err) {
                should.not.exist(err);
                done(null);
              });
            }
          ], function(err) {
            should.not.exist(err);
            done(null);
          });
        });
      });
    });
  }
  // not yet implemented in ghostdriver
  if (!process.env.GHOSTDRIVER_TEST) {
    describe("dismissAlert", function() {
      it("should dismiss alert", function(done) {
        browser.elementByCss("#dismissAlert a", function(err, a) {
          var capabilities;
          should.not.exist(err);
          should.exist(a);
          capabilities = null;
          async.series([
            function(done) {
              browser.sessionCapabilities(function(err, res) {
                should.not.exist(err);
                capabilities = res;
                done(null);
              });
            }, executeCoffee(browser, "jQuery ->                        \n  a = $('#dismissAlert a')\n  a.click ->\n    alert \"coffee is running out\"\n    false"), function(done) {
              browser.clickElement(a, function(err) {
                should.not.exist(err);
                done(null);
              });
            }, function(done) {
              // known bug on chrome/mac, need to use acceptAlert instead
              if (!(capabilities.platform === 'MAC' && capabilities.browserName === 'chrome')) {
                browser.dismissAlert(function(err) {
                  should.not.exist(err);
                  done(null);
                });
              } else {
                browser.acceptAlert(function(err) {
                  should.not.exist(err);
                  done(null);
                });
              }
            }
          ], function(err) {
            should.not.exist(err);
            done(null);
          });
        });
      });
    });
  }
  describe("active", function() {
    it("should check if element is active", function(done) {
      var env;
      env = {};
      async.series([
        elementByCss(browser, env, "#active .i1", 'i1'), elementByCss(browser, env, "#active .i2", 'i2'), function(done) {
          browser.clickElement(env.i1, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.active(function(err, res) {
            var k, _i, _len;
            should.not.exist(err);
            for (_i = 0, _len = res.length; _i < _len; _i++) {
              k = res[_i];
              res.should.equal(env.i1[k]);
              env.i1.should.have.property(k);
            }
            done(null);
          });
        }, function(done) {
          browser.clickElement(env.i2, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.active(function(err, res) {
            var k, _i, _len;
            should.not.exist(err);
            for (_i = 0, _len = res.length; _i < _len; _i++) {
              k = res[_i];
              res.should.equal(env.i2[k]);
              env.i2.should.have.property(k);
            }
            done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("url", function() {
    it("should retrieve url", function(done) {
      browser.url(function(err, res) {
        res.should.include("test-page.html");
        res.should.include("http://");
        done(null);
      });
    });
  });
  describe("takeScreenshot", function() {
    it("should take a screenshot", function(done) {
      browser.takeScreenshot(function(err, res) {
        var data, img;
        should.not.exist(err);
        data = new Buffer(res, 'base64');
        img = imageinfo(data);
        img.should.not.be.false;
        img.format.should.equal('PNG');
        img.width.should.not.equal(0);
        img.height.should.not.equal(0);
        done(null);
      });
    });
  });
  describe("allCookies / setCookies / deleteAllCookies / deleteCookie", function() {
    it("cookies should work", function(done) {
      async.series([
        function(done) {
          browser.deleteAllCookies(function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.allCookies(function(err, res) {
            should.not.exist(err);
            res.should.eql([]);
            done(null);
          });
        }, function(done) {
          browser.setCookie({
            name: 'fruit1',
            value: 'apple'
          }, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.allCookies(function(err, res) {
            should.not.exist(err);
            res.should.have.length(1);
            (res.filter(function(c) {
              return c.name === 'fruit1' && c.value === 'apple';
            })).should.have.length(1);
            done(null);
          });
        }, function(done) {
          browser.setCookie({
            name: 'fruit2',
            value: 'pear'
          }, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.allCookies(function(err, res) {
            should.not.exist(err);
            res.should.have.length(2);
            (res.filter(function(c) {
              return c.name === 'fruit2' && c.value === 'pear';
            })).should.have.length(1);
            done(null);
          });
        }, function(done) {
          browser.setCookie({
            name: 'fruit3',
            value: 'orange'
          }, function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.allCookies(function(err, res) {
            should.not.exist(err);
            res.should.have.length(3);
            done(null);
          });
        }, function(done) {
          browser.deleteCookie('fruit2', function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.allCookies(function(err, res) {
            should.not.exist(err);
            res.should.have.length(2);
            (res.filter(function(c) {
              return c.name === 'fruit2' && c.value === 'pear';
            })).should.have.length(0);
            done(null);
          });
        }, function(done) {
          browser.deleteAllCookies(function(err) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.allCookies(function(err, res) {
            should.not.exist(err);
            res.should.eql([]);
            done(null);
          });
        }, function(done) {
          // not too sure how to test this case this one, so just making sure
          // that it does not throw
          browser.setCookie({
            name: 'fruit3',
            value: 'orange',
            secure: true
          }, function(err) {
            should.not.exist(err);
            done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("localStorage", function() {
    it("should add & retrieve a key/value pair", function(done) {
      browser.setLocalStorageKey("foo", "bar", function(err) {
        should.not.exist(err);
        browser.getLocalStorageKey("foo", function(err, value) {
          should.not.exist(err);
          value.should.equal("bar");
          done(null);
        });
      });
    });
    it("should add & remove a key/value pair", function(done) {
      browser.setLocalStorageKey("bar", "ham", function(err) {
        should.not.exist(err);
        browser.removeLocalStorageKey("bar", function(err) {
          should.not.exist(err);
          browser.getLocalStorageKey("bar", function(err, value) {
            should.not.exist(err);
            should.not.exists(value);
            done(null);
          });
        });
      });
    });
    it("should clear localStorage", function(done) {
      browser.setLocalStorageKey("ham", "foo", function(err) {
        should.not.exist(err);
        browser.clearLocalStorage(function(err){
          should.not.exist(err);
          browser.getLocalStorageKey("ham", function(err) {
            should.not.exist(err);
            done(null);
          });
        });
      });
    });
  });
  describe("isVisible", function() {
    it("should check if element is visible", function(done) {
      async.series([
        function(done) {
          browser.elementByCss("#isVisible a", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            browser.isVisible(field, function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              done(null);
            });
          });
        }, function(done) {
          browser.isVisible("css selector", "#isVisible a", function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            done(null);
          });
        }, function(done) {
          browser.execute("$('#isVisible a').hide();", function(err, res) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.elementByCss("#isVisible a", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            browser.isVisible(field, function(err, res) {
              should.not.exist(err);
              res.should.be.false;
              done(null);
            });
          });
        }, function(done) {
          browser.isVisible("css selector", "#isVisible a", function(err, res) {
            should.not.exist(err);
            res.should.be.false;
            done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("waitForCondition", function() {
    it("should wait for condition", function(done) {
      var exprCond;
      this.timeout(10000);
      exprCond = "$('#waitForCondition .child').length > 0";
      async.series([
        executeCoffee(browser, "setTimeout ->\n  $('#waitForCondition').html '<div class=\"child\">a waitForCondition child</div>'\n, " + (1.5 * TIMEOUT_BASE)), function(done) {
          browser.elementByCss("#waitForCondition .child", function(err, res) {
            should.exist(err);
            err.status.should.equal(7);
            done(null);
          });
        }, function(done) {
          browser.waitForCondition(exprCond, 2 * TIMEOUT_BASE, 200, function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            done(err);
          });
        }, function(done) {
          browser.waitForCondition(exprCond, 2 * TIMEOUT_BASE, function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            done(err);
          });
        }, function(done) {
          browser.waitForCondition(exprCond, function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            done(err);
          });
        }, function(done) {
          browser.waitForCondition('$wrong expr!!!', function(err, res) {
            should.exist(err);
            done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("waitForConditionInBrowser", function() {
    it("should wait for condition within the browser", function(done) {
      var exprCond;
      this.timeout(10000);
      exprCond = "$('#waitForConditionInBrowser .child').length > 0";
      async.series([
        executeCoffee(browser, "setTimeout ->\n  $('#waitForConditionInBrowser').html '<div class=\"child\">a waitForCondition child</div>'\n, " + (1.5 * TIMEOUT_BASE)), function(done) {
          browser.elementByCss("#waitForConditionInBrowser .child", function(err, res) {
            should.exist(err);
            err.status.should.equal(7);
            done(null);
          });
        }, function(done) {
          browser.setAsyncScriptTimeout(5 * TIMEOUT_BASE, function(err, res) {
            should.not.exist(err);
            done(null);
          });
        }, function(done) {
          browser.waitForConditionInBrowser(exprCond, 2 * TIMEOUT_BASE, 0.2 * TIMEOUT_BASE, function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            done(err);
          });
        }, function(done) {
          browser.waitForConditionInBrowser(exprCond, 2 * TIMEOUT_BASE, function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            done(err);
          });
        }, function(done) {
          browser.waitForConditionInBrowser(exprCond, function(err, res) {
            should.not.exist(err);
            res.should.be.true;
            done(err);
          });
        }, function(done) {
          browser.waitForConditionInBrowser("totally #} wrong == expr", function(err, res) {
            should.exist(err);
            done(null);
          });
        }, function(done) {
          browser.setAsyncScriptTimeout(0, function(err, res) {
            should.not.exist(err);
            done(null);
          });
        }
      ], function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  if (!process.env.GHOSTDRIVER_TEST) {
    describe("err.inspect", function() {
      it("error output should be clean", function(done) {
        browser.safeExecute("invalid-code> here", function(err) {
          should.exist(err);
          (err instanceof Error).should.be.true;
          (err.inspect().length <= 510).should.be.true
          done(null);
        });
      });
    });
  }
  describe("quit<COMP>", function() {
    it("should destroy browser", function(done) {
      browser.quit(function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
};

exports.test = test;
