// CONFIGURE SAUCE CREDENTIALS HERE
var username = "<USERNAME>",
accessKey = "<ACCESS_KEY>";
 
var webdriver;
try {
  webdriver = require('wd'); 
} catch( err ) { 
  webdriver = require('../lib/main');
}
var assert = require('assert');
var browser = webdriver.remote("ondemand.saucelabs.com", 80, username, accessKey);

browser.on('status', function(info){
  console.log('\x1b[36m%s\x1b[0m', info);
});

browser.on('command', function(meth, path){
  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
});

var desired = {
  browserName:'iexplore' 
  , version:'9'
  , platform:'Windows 2008'
  , tags: ["examples"]
  , name: "This is an example test"
}

browser.init( desired, function() {
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
