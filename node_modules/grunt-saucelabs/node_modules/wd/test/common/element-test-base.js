/*global describe,before,it,after */
var CoffeeScript, Express, async, executeCoffee, should, test, textShouldEqual, wd;

CoffeeScript = require('coffee-script');

should = require('should');

async = require('async');

Express = require('./express').Express;

wd = require('./wd-with-cov');

textShouldEqual = function(browser, element, expected, done) {
  browser.text(element, function(err, res) {
    should.not.exist(err);
    res.should.equal(expected);
    done(null);
  });
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

test = function(remoteWdConfig, desired) {
  var browser, express;
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
  describe("wd.remote", function() {
    it("should create browser", function(done) {
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
    it("should initialize browserinit", function(done) {
      this.timeout(45000);
      browser.init(desired, function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("get", function() {
    it("should navigate to test page", function(done) {
      this.timeout(15000);
      browser.get("http://127.0.0.1:8181/element-test-page.html", function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("element.text", function() {
    it("should retrieve the text", function(done) {
      browser.element("id", "text", function(err, el) {
        should.not.exist(err);
        el.should.have.property("text");
        el.text(function(err, res) {
          res.should.include("I am some text");
          done(null);
        });
      });
    });
  });
  describe("element.textPresent", function() {
    it("should check if text is present", function(done) {
      browser.element("id", "text", function(err, el) {
        should.not.exist(err);
        el.should.have.property("textPresent");
        el.textPresent("some text", function(err, present) {
          should.not.exist(err);
          present.should.be.true;
          done(null);
        });
      });
    });
  });
  describe("element.click", function() {
    it("element should be clicked", function(done) {
      browser.elementByCss("#click a", function(err, anchor) {
        should.not.exist(err);
        should.exist(anchor);
        async.series([
          executeCoffee(browser, 'jQuery ->\n  a = $(\'#click a\')\n  a.click ->\n    a.html \'clicked\'\n    false              '), function(done) {
            textShouldEqual(browser, anchor, "not clicked", done);
          }, function(done) {
            anchor.click(function(err) {
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
  describe("element.getTagName", function() {
    it("should get correct tag name", function(done) {
      async.series([
        function(done) {
          browser.elementByCss("#getTagName input", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            field.getTagName(function(err, res) {
              should.not.exist(err);
              res.should.equal("input");
              done(null);
            });
          });
        }, function(done) {
          browser.elementByCss("#getTagName a", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            field.getTagName(function(err, res) {
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
  describe("element.isDisplayed", function() {
    it("should check if elemnt is displayed", function(done) {
      async.series([
        function(done) {
          browser.elementByCss("#isDisplayed .displayed", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            field.isDisplayed(function(err, res) {
              should.not.exist(err);
              res.should.be.true;
              done(null);
            });
          });
        }, function(done) {
          browser.elementByCss("#isDisplayed .hidden", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            field.isDisplayed(function(err, res) {
              should.not.exist(err);
              res.should.be.false;
              done(null);
            });
          });
        }, function(done) {
          browser.elementByCss("#isDisplayed .displayed", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            field.displayed(function(err, res) {
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
  describe("element.getComputedCss", function() {
    it("should retrieve the element computed css", function(done) {
      async.series([
        function(done) {
          browser.elementByCss("#getComputedCss a", function(err, field) {
            should.not.exist(err);
            should.exist(field);
            field.getComputedCss('color', function(err, res) {
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
            field.getComputedCSS('color', function(err, res) {
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
  describe("element.getAttribute", function() {
    it("should retrieve attribute value", function(done) {
      browser.element("id", "getAttribute", function(err, el) {
        should.not.exist(err);
        el.should.have.property("getAttribute");
        el.getAttribute("att", function(err, value) {
          should.not.exist(err);
          value.should.equal("42");
          done(null);
        });
      });
    });
  });
  describe("element.getValue", function() {
    it("should retrieve value", function(done) {
      browser.element("id", "getValue", function(err, el) {
        should.not.exist(err);
        el.should.have.property("getValue");
        el.getValue(function(err, value) {
          should.not.exist(err);
          value.should.equal("value");
          done(null);
        });
      });
    });
  });
  describe("element.sendKeys", function() {
    var firstText = "keys";
    it("should send keys", function(done) {
      var text;
      text = firstText;
      browser.element("id", "sendKeys", function(err, el) {
        should.not.exist(err);
        el.should.have.property("sendKeys");
        el.sendKeys(text, function(err) {
          should.not.exist(err);
          el.getValue(function(err, textReceived) {
            should.not.exist(err);
            textReceived.should.equal(text);
            done(null);
          });
        });
      });
    });
    it("should send keys as strings", function(done) {
      var text;
      text = [100136872.21, {}];
      browser.element("id", "sendKeys", function(err, el) {
        should.not.exist(err);
        el.should.have.property("sendKeys");
        el.sendKeys(text, function(err) {
          should.not.exist(err);
          el.getValue(function(err, textReceived) {
            should.not.exist(err);
            textReceived.should.equal(firstText + text[0].toString() +
                                      text[1].toString());
            done(null);
          });
        });
      });
    });
  });
  describe("element.clear", function() {
    it("should clear input field", function(done) {
      browser.element("id", "clear", function(err, el) {
        should.not.exist(err);
        el.should.have.property("clear");
        el.clear(function(err) {
          should.not.exist(err);
          el.getValue(function(err, textReceived) {
            should.not.exist(err);
            textReceived.should.equal("");
            done(null);
          });
        });
      });
    });
  });
  describe("element.element", function() {
    it("should find an element within itself", function(done) {
      browser.elementById("getComputedCss", function(err, el) {
        should.not.exist(err);
        el.elementByTagName("a", function(err, el2) {
          should.not.exist(err);
          el2.text(function(err, text) {
            text.should.equal("a1");
            done();
          });
        });
      });
    });
    if (desired.browserName != "firefox") {
      // this hangs and times out in ff, probably a ffdriver bug
      it("should not find an element not within itself", function(done) {
        browser.setImplicitWaitTimeout(0, function(err) {
          should.not.exist(err);
          browser.elementById("getComputedCss", function(err, el) {
            should.not.exist(err);
            el.elementByTagName("textarea", function(err, el2) {
              should.exist(err);
              done();
            });
          });
        });
      });
    }
  });
  describe("element.elements", function() {
    it("should find some elements within itself", function(done) {
      browser.elementById("isDisplayed", function(err, el) {
        should.not.exist(err);
        el.elementsByTagName("input", function(err, els) {
          should.not.exist(err);
          els.length.should.equal(2);
          done();
        });
      });
    });
    it("should not find an element not within itself", function(done) {
      browser.setImplicitWaitTimeout(0, function(err) {
        should.not.exist(err);
        browser.elementById("getComputedCss", function(err, el) {
          should.not.exist(err);
          el.elementsByCss("input", function(err, els) {
            should.not.exist(err);
            els.length.should.equal(0);
            done();
          });
        });
      });
    });
  });
  describe("quit", function() {
    it("should destroy browser", function(done) {
      browser.quit(function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
};

exports.test = test;
