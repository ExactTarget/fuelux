/*global describe,before,it,after */
var TIMEOUT, assert, should, test;

should = require('should');

assert = require('assert');

TIMEOUT = 60000;

test = function(remoteWdConfig, desired, markAsPassed) {
  var sessionID;
  var browser, wd;
  wd = require('./wd-with-cov');
  if (typeof remoteWdConfig === 'function') {
    remoteWdConfig = remoteWdConfig();
  }
  browser = null;

  describe("remote promises", function() {
    describe("remote", function() {
      it("should create browser", function(done) {
        browser = wd.promiseRemote(remoteWdConfig);
        should.exist(browser);
        if (!process.env.WD_COV) {
          browser.on("status", function(info) {
            return console.log("\u001b[36m%s\u001b[0m", info);
          });
          browser.on("command", function(meth, path) {
            return console.log(" > \u001b[33m%s\u001b[0m: %s", meth, path);
          });
        }
        done(null);
      });
    });
    describe("init", function(done) {
      it("should initialize browser", function(done) {
        this.timeout(TIMEOUT);
        browser.init(desired).then(function() {
          sessionID = browser.sessionID;
          done(null);
        });
      });
    });
    describe("browsing", function() {
      describe("getting page", function() {
        it("should navigate to test page and check title", function(done) {
          this.timeout(TIMEOUT);
          browser.get("http://admc.io/wd/test-pages/guinea-pig.html").then(function() {
            return browser.title();
          }).then(function(title) {
            assert.ok(~title.indexOf("I am a page title - Sauce Labs"), "Wrong title!");
            done(null);
          });
        });
      });
      describe("clicking submit", function(done) {
        it("submit element should be clicked", function() {
          this.timeout(TIMEOUT);
          browser.elementById("submit").then(function(el) {
            return browser.clickElement(el);
          }).then(function() {
            return browser["eval"]("window.location.href");
          }).then(function(location) {
            assert.ok(~location.indexOf("http://"), "Wrong location!");
            done(null);
          });
        });
      });
    });
    describe("leaving", function() {
      it("closing browser", function(done) {
        this.timeout(TIMEOUT);
        browser.quit().then(function () {
          done(null);
        });
      });
    });
    if(markAsPassed) {
      describe("marking job as passed", function() {
        it("should mark job ass passed", function(done) {
          markAsPassed(sessionID, done);
        });
      });
    }
  });
};

exports.test = test;
