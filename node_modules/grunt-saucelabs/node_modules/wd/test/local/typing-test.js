var _ = require("underscore");

var test = require('../common/typing-test-base').test,
    utils = require('../common/utils');

describe("wd", function() {
  describe("local", function() {
    describe("typing test", function() {
      _(utils.browsers).each(function (browser) {
        describe("using " + browser, function() {
          test({}, {
            browserName: browser
          });
        });
      });
    });
  });
});
