var wd = require('../lib/main')
  , assert = require('assert')
  , colors = require('colors')
  , browser = wd.remote();

browser.on('status', function(info) {
  console.log(info.cyan);
});

browser.on('command', function(meth, path, data) {
  console.log(' > ' + meth.yellow, path.grey, data || '');
});

browser.init({
    browserName:'chrome'
    , tags : ["examples"]
    , name: "This is an example test"
  }, function() {

  browser.get("http://admc.io/wd/test-pages/guinea-pig.html", function() {
    browser.title(function(err, title) {
      assert.ok(~title.indexOf('I am a page title - Sauce Labs'), 'Wrong title!');
      browser.elementById('i am a link', function(err, el) {
        browser.clickElement(el, function() {
          browser.eval("window.location.href", function(err, href) {
            assert.ok(~href.indexOf('guinea-pig2'));
            browser.quit();
          });
        });
      });
    });
  });
});
