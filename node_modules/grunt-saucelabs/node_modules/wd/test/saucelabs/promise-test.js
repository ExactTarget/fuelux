/*global describe,before,it,after */
var chromeDesired, configHelper, explorerDesired, firefoxDesired, nameBase, remoteWdConfig, test;

test = require('../common/promise-test-base').test;

configHelper = require('./config-helper');

remoteWdConfig = configHelper.getRemoteWdConfig();

nameBase = "saucelabs promise test - ";

chromeDesired = {
  name: nameBase + 'chrome',
  browserName: 'chrome',
  tags: ['wd', 'test'],
  "record-video": false
};

firefoxDesired = {
  name: nameBase + 'firefox',
  browserName: 'firefox',
  tags: ['wd', 'test'],
  "record-video": false
};

explorerDesired = {
  name: nameBase + 'explorer',
  browserName: 'iexplore',
  version: '9',
  platform: 'Windows 2008',
  tags: ['wd', 'test'],
  "record-video": false
};

describe("wd", function() {
  describe("saucelabs", function() {
    describe("promise tests", function() {
      describe("using chrome", function() {
        test(remoteWdConfig, chromeDesired, configHelper.jobPassed );
      });
      describe("using firefox", function() {
        test(remoteWdConfig, firefoxDesired, configHelper.jobPassed);
      });
      describe("using explorer", function() {
        test(remoteWdConfig, explorerDesired, configHelper.jobPassed);
      });
    });
  });
});
