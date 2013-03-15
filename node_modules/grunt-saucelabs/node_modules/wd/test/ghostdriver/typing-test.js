/*global describe,before,it,after */
var desired, remoteWdConfig, test, _ref;

_ref = require('./config');
desired = _ref.desired;
remoteWdConfig = _ref.remoteWdConfig;

test = require('../common/typing-test-base').test;

describe("wd", function() {
  describe("ghostdriver", function() {
    describe("typing test", function() {
      describe("using chrome", function() {
        test(remoteWdConfig, desired);
      });
    });
  });
});
