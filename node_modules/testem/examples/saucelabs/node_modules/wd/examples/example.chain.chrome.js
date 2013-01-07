var webdriver = require('wd');
var assert = require('assert');

var browser = webdriver.remote();

browser.on('status', function(info){
  console.log('\x1b[36m%s\x1b[0m', info);
});

browser.on('command', function(meth, path){
  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
});

browser
  .chain()
  .init({
      browserName:'chrome'
      , tags : ["examples"]
      , name: "This is an example test"
  })
  .get("http://saucelabs.com/test/guinea-pig")
  .title(function(err, title) {
    assert.ok(~title.indexOf('I am a page title - Sauce Labs'), 'Wrong title!');
  })
  .elementById('submit', function(err, el) {
    //we should make clickElement not require a callback
    browser.clickElement(el, function() {
      console.log("did the click!")
    })
  })
  .eval("window.location.href", function(err, href) {
    assert.ok(~href.indexOf('#'), 'Wrong url!');
  })
  .quit();
