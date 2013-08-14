/*global describe,before,it,after */
var desired, remoteWdConfig, test, _ref;

_ref = require('./config');
desired = _ref.desired;
remoteWdConfig = _ref.remoteWdConfig;

test = require('../common/per-method-test-base').test;

describe("wd", function() {
  describe("ghostdriver", function() {
    describe("per method tests", function() {
      describe("using ghostdriver", function() {
        test(remoteWdConfig, desired);
      });
    });
  });
});
