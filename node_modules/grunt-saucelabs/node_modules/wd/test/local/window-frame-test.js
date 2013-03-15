var _ = require("underscore");

var test = require('../common/window-frame-test-base').test,
    utils = require('../common/utils');

describe("wd", function() {
  describe("local", function() {
    describe("window frame test", function() {
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
