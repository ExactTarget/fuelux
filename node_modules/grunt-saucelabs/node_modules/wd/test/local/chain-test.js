var _ = require("underscore");

var test = require('../common/chain-test-base').test,
    utils = require('../common/utils');

describe("wd", function() {
  describe("local", function() {
    describe("chain tests", function() {
      _(utils.browsers).each(function (browser) {
        describe("using " + browser, function() {
          test(browser);
        });
      });
    });
  });
});
