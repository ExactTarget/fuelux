var should = require('should');

var utils = require('../common/utils'),
    wd = require('../common/wd-with-cov');

var browser1 = 'firefox',
    browser2 = 'chrome'

if(utils.isTravis()){
  browser2 = 'firefox'
}

describe("wd", function() {
  describe("local", function() {
    describe("browser init tests", function() {
      describe("default init", function() {
        it("should open " + browser1, function(done) {
          var browser;
          this.timeout(15000);
          browser = wd.remote();
          browser.defaultCapabilities.should.eql({
            browserName: browser1,
            version: '',
            javascriptEnabled: true,
            platform: 'ANY'
          });
          browser.init(function(err) {
            should.not.exist(err);
            browser.sessionCapabilities(function(err, capabilities) {
              should.not.exist(err);
              capabilities.browserName.should.equal(browser1);
              browser.quit(function(err) {
                should.not.exist(err);
                done(null);
              });
            });
          });
        });
      });
      describe("browser.defaultCapabilities", function() {
        it("should open " + browser2, function(done) {
          var browser;
          this.timeout(15000);
          browser = wd.remote();
          browser.defaultCapabilities.browserName = browser2;
          browser.defaultCapabilities.javascriptEnabled = false;
          browser.defaultCapabilities.should.eql({
            browserName: browser2,
            version: '',
            javascriptEnabled: false,
            platform: 'ANY'
          });
          browser.init(function(err) {
            should.not.exist(err);
            browser.sessionCapabilities(function(err, capabilities) {
              should.not.exist(err);
              capabilities.browserName.should.equal(browser2);
              browser.quit(function(err) {
                should.not.exist(err);
                done(null);
              });
            });
          });
        });
      });
      describe("desired only", function() {
        it("should open " + browser2, function(done) {
          var browser;
          this.timeout(15000);
          browser = wd.remote();
          browser.defaultCapabilities.should.eql({
            browserName: browser1,
            version: '',
            javascriptEnabled: true,
            platform: 'ANY'
          });
          browser.init({
            browserName: browser2
          }, function(err) {
            should.not.exist(err);
            browser.sessionCapabilities(function(err, capabilities) {
              should.not.exist(err);
              capabilities.browserName.should.equal(browser2);
              browser.quit(function(err) {
                should.not.exist(err);
                done(null);
              });
            });
          });
        });
      });
      describe("desired overiding defaultCapabilities", function() {
        it("should open " + browser1, function(done) {
          var browser;
          this.timeout(15000);
          browser = wd.remote();
          browser.defaultCapabilities.browserName = browser2;
          browser.defaultCapabilities.should.eql({
            browserName: browser2,
            version: '',
            javascriptEnabled: true,
            platform: 'ANY'
          });
          browser.init({
            browserName: browser1
          }, function(err) {
            should.not.exist(err);
            browser.sessionCapabilities(function(err, capabilities) {
              should.not.exist(err);
              capabilities.browserName.should.equal(browser1);
              browser.quit(function(err) {
                should.not.exist(err);
                done(null);
              });
            });
          });
        });
      });
    });
  });
});
