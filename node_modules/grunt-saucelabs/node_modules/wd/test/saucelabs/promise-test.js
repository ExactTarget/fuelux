var _ = require('underscore');

var test = require('../common/promise-test-base').test;

var configHelper = require('./config-helper');

var remoteWdConfig = configHelper.getRemoteWdConfig();

var nameBase = "saucelabs promise test - ";

var browsers = ['chrome','firefox','explorer'];

var desired = {};

_(browsers).each(function(b) {
  desired[b] = _.defaults({
    name: nameBase + b,
    tags: ['wd', 'test'],
    "record-video": false
  }, configHelper.desiredDefaults[b]);
});

describe("wd", function() {
  describe("saucelabs", function() {
    describe("promise tests", function() {
      _(browsers).each(function(b) {
        describe("using " + b, function() {
          test(remoteWdConfig, desired[b], configHelper.jobPassed);
        }, this);
      });
    });
  });
});
