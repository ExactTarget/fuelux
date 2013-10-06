/*global describe,before,it,after */
var async, should, test, wd;

should = require('should');

async = require('async');

wd = require('./wd-with-cov');

test = function(browserName) {
  var browser;
  browser = null;
  describe("wd.remote", function() {
    it("should create browser", function(done) {
      browser = wd.remote({});
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
  describe("chaining", function() {
    it("should work", function(done) {
      browser.chain().init({
        browserName: browserName,
        tags: ["examples"],
        name: "This is an example test"
      }).get("http://admc.io/wd/test-pages/guinea-pig.html").title(function(err, title) {
        title.should.include('I am a page title - Sauce Labs');
      }).elementById('submit', function(err, el) {
        should.not.exist(err);
        should.exist(el);

        // Commenting this test, nothing preventing quit to be called first
        // we should make clickElement not require a callback
        // browser.clickElement(el, function(err) {
        //  should.not.exist.err;
        //});
      })["eval"]("window.location.href", function(err, href) {
        href.should.include('http');
      }).quit(function(err) {
        done(null);
      });
    });
  });
};

exports.test = test;
