var wd;
try {
  wd = require('wd');
} catch( err ) { 
  wd = require('../lib/main');
}
var assert = require('assert');
var browser = wd.promiseRemote();

browser.on('status', function(info){
  console.log('\x1b[36m%s\x1b[0m', info);
});

browser.on('command', function(meth, path, data){
  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path, data || '');
});

browser.init({
    browserName: 'chrome',
    tags: ["examples"],
    name: "This is an example test"
}).then(function () {
    return browser.get("http://admc.io/wd/test-pages/guinea-pig.html");
}).then(function () {
    return browser.title();
}).then(function (title) {
    assert.ok(~title.indexOf('I am a page title - Sauce Labs'), 'Wrong title!');
    return browser.elementById('i am a link');
}).then(function (el) {
    return browser.clickElement(el);
}).then(function () {
    return browser.eval("window.location.href");
}).then(function (href) {
    assert.ok(~href.indexOf('guinea-pig2'));
}).fin(function () {
    browser.quit();
}).done();

