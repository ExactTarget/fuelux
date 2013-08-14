// CONFIGURE SAUCE CREDENTIALS HERE
var username = "<USERNAME>",
accessKey = "<ACCESS_KEY>";
 
var wd;
try {
  wd = require('wd'); 
} catch( err ) { 
  wd = require('../lib/main');
}
var assert = require('assert');
var browser = wd.remote("ondemand.saucelabs.com", 80, username, accessKey);

browser.on('status', function(info){
  console.log('\x1b[36m%s\x1b[0m', info);
});

browser.on('command', function(meth, path, data){
  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path, data || '');
});

var desired = {
  browserName:'iexplore' 
  , version:'9'
  , platform:'Windows 2008'
  , tags: ["examples"]
  , name: "This is an example test"
};

browser.init(desired, function() {
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
