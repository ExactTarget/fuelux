var webdriver;
try {
  webdriver = require('wd');
} catch( err ) { 
  webdriver = require('../lib/main');
}
var assert = require('assert');
var browser = webdriver.remote();

browser.on('status', function(info){
  console.log('\x1b[36m%s\x1b[0m', info);
});

browser.on('command', function(meth, path){
  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
});

browser.init({
    browserName:'chrome'
    , tags : ["examples"]
    , name: "This is an example test"
  }, function() {

  browser.get("http://saucelabs.com/test/guinea-pig", function() {
    browser.title(function(err, title) {
      assert.ok(~title.indexOf('I am a page title - Sauce Labs'), 'Wrong title!');
      browser.elementById('submit', function(err, el) {
        browser.clickElement(el, function() {
          browser.eval("window.location.href", function(err, title) {
            assert.ok(~title.indexOf('#'), 'Wrong title!');
            browser.quit()
          })
        })
      })
    })
  })
})
