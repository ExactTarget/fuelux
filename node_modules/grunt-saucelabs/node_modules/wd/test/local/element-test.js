var _ = require("underscore");

var test = require('../common/element-test-base').test,
    utils = require('../common/utils');

describe("wd", function() {
  describe("local", function() {
    describe("element tests", function() {
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
