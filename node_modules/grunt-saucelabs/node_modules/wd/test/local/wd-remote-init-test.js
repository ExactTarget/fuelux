/*global describe,before,it,after */
var should = require('should'),
    wd = require('../common/wd-with-cov'),
    _ = require('underscore');

process.env = _(process.env).omit('SAUCE_USERNAME', 'SAUCE_ACCESS_KEY');

describe("wd", function() {
  describe("local", function() {
    describe("wd remote tests", function() {
      describe("default", function() {
        it("browser should be initialized with default parameters", function(done) {
          var browser;
          browser = wd.remote();
          browser.options.host.should.equal('127.0.0.1');
          browser.options.port.should.equal(4444);
          browser.options.path.should.equal('/wd/hub/session');
          browser.basePath.should.equal('/wd/hub');
          should.not.exist(browser.username);
          should.not.exist(browser.accessKey);
          done();
        });
      });
      describe("params", function() {
        describe("host, port", function() {
          it("browser should be initialized with given parameters", function(done) {
            var browser;
            browser = wd.remote('localhost', 8888);
            browser.options.host.should.equal('localhost');
            browser.options.port.should.equal(8888);
            browser.options.path.should.equal('/wd/hub/session');
            browser.basePath.should.equal('/wd/hub');
            should.not.exist(browser.username);
            should.not.exist(browser.accessKey);
            done(null);
          });
        });
        describe("host, port, username, accesskey", function() {
          it("browser should be initialized with given parameters", function(done) {
            var browser;
            browser = wd.remote('localhost', 8888, 'mickey', 'mouse');
            browser.options.host.should.equal('localhost');
            browser.options.port.should.equal(8888);
            browser.options.path.should.equal('/wd/hub/session');
            browser.basePath.should.equal('/wd/hub');
            browser.username.should.equal('mickey');
            browser.accessKey.should.equal('mouse');
            done(null);
          });
        });
      });
    });
    describe("options", function() {
      describe("empty options", function() {
        it("browser should be initialized with default", function(done) {
          var browser;
          browser = wd.remote({});
          browser.options.host.should.equal('127.0.0.1');
          browser.options.port.should.equal(4444);
          browser.options.path.should.equal('/wd/hub/session');
          browser.basePath.should.equal('/wd/hub');
          should.not.exist(browser.username);
          should.not.exist(browser.accessKey);
          done(null);
        });
      });
      describe("host, port", function() {
        it("browser should be initialized with given options", function(done) {
          var browser;
          browser = wd.remote({
            host: 'localhost',
            port: 8888
          });
          browser.options.host.should.equal('localhost');
          browser.options.port.should.equal(8888);
          browser.options.path.should.equal('/wd/hub/session');
          browser.basePath.should.equal('/wd/hub');
          should.not.exist(browser.username);
          should.not.exist(browser.accessKey);
          done(null);
        });
      });
      describe("host, port, username, accesskey", function() {
        it("browser should be initialized with given options", function(done) {
          var browser;
          browser = wd.remote({
            host: 'localhost',
            port: 8888,
            username: 'mickey',
            accessKey: 'mouse'
          });
          browser.options.host.should.equal('localhost');
          browser.options.port.should.equal(8888);
          browser.options.path.should.equal('/wd/hub/session');
          browser.basePath.should.equal('/wd/hub');
          browser.username.should.equal('mickey');
          browser.accessKey.should.equal('mouse');
          done(null);
        });
      });
      describe("path", function() {
        it("browser should be initialized with given options", function(done) {
          var browser;
          browser = wd.remote({
            path: '/taiwan'
          });
          browser.options.host.should.equal('127.0.0.1');
          browser.options.port.should.equal(4444);
          browser.options.path.should.equal('/taiwan/session');
          browser.basePath.should.equal('/taiwan');
          should.not.exist(browser.username);
          should.not.exist(browser.accessKey);
          done(null);
        });
      });
      describe("host, port, path", function() {
        it("browser should be initialized with given options", function(done) {
          var browser;
          browser = wd.remote({
            host: 'localhost',
            port: 8888,
            path: '/'
          });
          browser.options.host.should.equal('localhost');
          browser.options.port.should.equal(8888);
          browser.options.path.should.equal('/session');
          browser.basePath.should.equal('/');
          should.not.exist(browser.username);
          should.not.exist(browser.accessKey);
          done(null);
        });
      });
      describe("host, port, username, accesskey, path", function() {
        it("browser should be initialized with given options", function(done) {
          var browser;
          browser = wd.remote({
            host: 'localhost',
            port: 8888,
            username: 'mickey',
            accessKey: 'mouse',
            path: '/asia/taiwan'
          });
          browser.options.host.should.equal('localhost');
          browser.options.port.should.equal(8888);
          browser.options.path.should.equal('/asia/taiwan/session');
          browser.basePath.should.equal('/asia/taiwan');
          browser.username.should.equal('mickey');
          browser.accessKey.should.equal('mouse');
          done(null);
        });
      });
    });
  });
});
