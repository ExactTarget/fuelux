var CoffeeScript = require('coffee-script');

var should = require('should');

var async = require('async');

var Express = require('./express').Express;

var wd = require('./wd-with-cov');

var altKey = wd.SPECIAL_KEYS.Alt;

var nullKey = wd.SPECIAL_KEYS.NULL;

var returnKey = wd.SPECIAL_KEYS.Return;

var enterKey = wd.SPECIAL_KEYS.Enter;

var executeCoffee = function(browser, script, done) {
  var scriptAsJs;
  scriptAsJs = CoffeeScript.compile(script, {
    bare: 'on'
  });
  browser.execute(scriptAsJs, function(err) {
    should.not.exist(err);
    done(null);
  });
};

var valueShouldEqual = function(browser, element, expected, done) {
  browser.getValue(element, function(err, res) {
    should.not.exist(err);
    res.should.equal(expected);
    done(null);
  });
};

var click = function(browser, _sel, done) {
  browser.elementByCss(_sel, function(err, inputField) {
    should.not.exist(err);
    should.exist(inputField);
    browser.clickElement(inputField, function(err) {
      should.not.exist(err);
      done(null);
    });
  });
};

var typeAndCheck = function(browser, _sel, chars, expected, done) {
  browser.elementByCss(_sel, function(err, inputField) {
    should.not.exist(err);
    should.exist(inputField);
    async.series([
      function(done) {
        browser.type(inputField, chars, function(err) {
          should.not.exist(err);
          done(null);
        });
      }, function(done) {
        valueShouldEqual(browser, inputField, expected, done);
      }
    ], function(err) {
      should.not.exist(err);
      done(null);
    });
  });
};

var keysAndCheck = function(browser, _sel, chars, expected, done) {
  browser.elementByCss(_sel, function(err, inputField) {
    should.not.exist(err);
    should.exist(inputField);
    async.series([
      function(done) {
        browser.moveTo(inputField, function(err) {
          should.not.exist(err);
          done(null);
        });
      }, function(done) {
        browser.keys(chars, function(err) {
          should.not.exist(err);
          done(null);
        });
      }, function(done) {
        valueShouldEqual(browser, inputField, expected, done);
      }
    ], function(err) {
      should.not.exist(err);
      done(null);
    });
  });
};

var inputAndCheck = function(browser, method, _sel, chars, expected, done) {
  switch (method) {
    case 'type':
      return typeAndCheck(browser, _sel, chars, expected, done);
    case 'keys':
      return keysAndCheck(browser, _sel, chars, expected, done);
  }
};

var clearAndCheck = function(browser, _sel, done) {
  browser.elementByCss(_sel, function(err, inputField) {
    should.not.exist(err);
    should.exist(inputField);
    async.series([
      function(done) {
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
};

var preventDefault = function(browser, _sel, eventType, done) {
  var script;
  script = "$('" + _sel + "')." + eventType + " (e) ->\n  e.preventDefault()";
  executeCoffee(browser, script, done);
};

var unbind = function(browser, _sel, eventType, done) {
  var script;
  script = "$('" + _sel + "').unbind '" + eventType + "' ";
  executeCoffee(browser, script, done);
};

var altKeyTracking = function(browser, _sel, done) {
  var script;
  script = "f = $('" + _sel + "')\nf.keydown (e) ->\n  if e.altKey\n    f.val 'altKey on'\n  else\n    f.val 'altKey off'\n  e.preventDefault()";
  executeCoffee(browser, script, done);
};

var test = function(remoteWdConfig, desired) {
  var browser, browserName, express, testMethod;
  browser = null;
  browserName = desired !== null ? desired.browserName : 0;
  express = new Express();
  before(function(done) {
    express.start();
    done(null);
  });
  after(function(done) {
    express.stop();
    done(null);
  });
  testMethod = function(method, sel) {
    describe("method:" + method, function() {
      describe("sel:" + sel, function() {
        describe("1/ click", function() {
          it("should work", function(done) {
            click(browser, sel, done);
          });
        });
        if (!(method === 'keys' || (browserName === 'chrome'))) {
          describe("1/ typing nothing", function() {
            it("should work", function(done) {
              inputAndCheck(browser, method, sel, "", "", done);
            });
          });
        }
        if (method !== 'keys') {
          describe("2/ typing []", function() {
            it("should work", function(done) {
              inputAndCheck(browser, method, sel, [], "", done);
            });
          });
        }
        describe("3/ typing 'Hello'", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, 'Hello', 'Hello', done);
          });
        });
        describe("4/ clear", function() {
          it("should work", function(done) {
            clearAndCheck(browser, sel, done);
          });
        });
        describe("5/ typing ['Hello']", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, ['Hello'], 'Hello', done);
          });
        });
        describe("6/ clear", function() {
          it("should work", function(done) {
            clearAndCheck(browser, sel, done);
          });
        });
        describe("7/ typing ['Hello',' ','World','!']", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, ['Hello', ' ', 'World', '!'], 'Hello World!', done);
          });
        });
        describe("8/ clear", function() {
          it("should work", function(done) {
            clearAndCheck(browser, sel, done);
          });
        });
        describe("9/ typing 'Hello\\n'", function() {
          it("should work", function(done) {
            var expected;
            expected = (sel.match(/input/) ? 'Hello' : 'Hello\n');
            inputAndCheck(browser, method, sel, 'Hello\n', expected, done);
          });
        });
        describe("10/ typing '\\r'", function() {
          it("should work", function(done) {
            if (browserName === 'chrome' || (process.env.GHOSTDRIVER_TEST)) {
              // chrome chrashes when sent '\r', ghostdriver does not
              // seem to like it
              inputAndCheck(browser, method, sel, [returnKey], (sel.match(/input/) ? 'Hello' : 'Hello\n\n'), done);
            } else {
              inputAndCheck(browser, method, sel, '\r', (sel.match(/input/) ? 'Hello' : 'Hello\n\n'), done);
            }
          });
        });
        describe("11/ typing [returnKey]", function() {
          it("should work", function(done) {
            var expected;
            expected = (sel.match(/input/) ? 'Hello' : 'Hello\n\n\n');
            inputAndCheck(browser, method, sel, [returnKey], expected, done);
          });
        });
        describe("12/ typing [enterKey]", function() {
          it("should work", function(done) {
            var expected;
            expected = (sel.match(/input/) ? 'Hello' : 'Hello\n\n\n\n');
            inputAndCheck(browser, method, sel, [enterKey], expected, done);
          });
        });
        describe("13/ typing ' World!'", function() {
          it("should work", function(done) {
            var expected;
            expected = (sel.match(/input/) ? 'Hello World!' : 'Hello\n\n\n\n World!');
            inputAndCheck(browser, method, sel, ' World!', expected, done);
          });
        });
        describe("14/ clear", function() {
          it("should work", function(done) {
            clearAndCheck(browser, sel, done);
          });
        });
        describe("15/ preventing default on keydown", function() {
          it("should work", function(done) {
            preventDefault(browser, sel, 'keydown', done);
          });
        });
        describe("16/ typing 'Hello'", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, 'Hello', '', done);
          });
        });
        describe("17/ unbinding keydown", function() {
          it("should work", function(done) {
            unbind(browser, sel, 'keydown', done);
          });
        });
        describe("18/ typing 'Hello'", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, 'Hello', 'Hello', done);
          });
        });
        describe("19/ clear", function() {
          it("should work", function(done) {
            clearAndCheck(browser, sel, done);
          });
        });
        describe("20/ preventing default on keypress", function() {
          it("should work", function(done) {
            preventDefault(browser, sel, 'keypress', done);
          });
        });
        describe("21/ typing 'Hello'", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, 'Hello', '', done);
          });
        });
        describe("22/ unbinding keypress", function() {
          it("should work", function(done) {
            unbind(browser, sel, 'keypress', done);
          });
        });
        describe("23/ typing 'Hello'", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, 'Hello', 'Hello', done);
          });
        });
        describe("24/ clear", function() {
          it("should work", function(done) {
            clearAndCheck(browser, sel, done);
          });
        });
        describe("25/ preventing default on keyup", function() {
          it("should work", function(done) {
            preventDefault(browser, sel, 'keyup', done);
          });
        });
        describe("26/ typing 'Hello'", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, 'Hello', 'Hello', done);
          });
        });
        describe("27/ unbinding keypress", function() {
          it("should work", function(done) {
            unbind(browser, sel, 'keyup', done);
          });
        });
        describe("28/ clear", function() {
          it("should work", function(done) {
            clearAndCheck(browser, sel, done);
          });
        });
        describe("29/ adding alt key tracking", function() {
          it("should work", function(done) {
            altKeyTracking(browser, sel, done);
          });
        });
        describe("30/ typing ['a']", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, ['a'], 'altKey off', done);
          });
        });
        describe("31/ typing [altKey,nullKey,'a']", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, [altKey, nullKey, 'a'], 'altKey off', done);
          });
        });
        describe("32/ typing [altKey,'a']", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, [altKey, 'a'], 'altKey on', done);
          });
        });
        if (!process.env.GHOSTDRIVER_TEST) {
          describe("33/ typing ['a']", function() {
            it("should work", function(done) {
              var expected;
              expected = (method === 'type' ? 'altKey off' : 'altKey on');
              inputAndCheck(browser, method, sel, ['a'], expected, done);
            });
          });
        }
        describe("34/ clear", function() {
          it("should work", function(done) {
            clearAndCheck(browser, sel, done);
          });
        });
        describe("35/ typing [nullKey]", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, [nullKey], '', done);
          });
        });
        describe("36/ typing ['a']", function() {
          it("should work", function(done) {
            inputAndCheck(browser, method, sel, ['a'], 'altKey off', done);
          });
        });
        describe("37/ clear", function() {
          it("should work", function(done) {
            clearAndCheck(browser, sel, done);
          });
        });
        describe("38/ unbinding keydown", function() {
          it("should work", function(done) {
            unbind(browser, sel, 'keydown', done);
          });
        });
      });
    });
  };
  describe("wd.remote", function() {
    it("should work", function(done) {
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
  describe("init", function() {
    it("should work", function(done) {
      browser.init(desired, function(err) {
        should.not.exist(err);
        done(err);
      });
    });
  });
  describe("get", function() {
    it("should work", function(done) {
      browser.get("http://127.0.0.1:8181/type-test-page.html", function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  testMethod("type", "#type input");
  testMethod("keys", "#type input");
  testMethod("type", "#type textarea");
  testMethod("keys", "#type textarea");
  describe("quit", function() {
    it("should work", function(done) {
      browser.quit(function(err) {
        should.not.exist(err);
        done(err);
      });
    });
  });
};

exports.test = test;
