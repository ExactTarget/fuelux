var webdriver  = require('wd');

var assert = require('assert');
var browser = webdriver.remote();

browser.on('status', function(info){
  console.log('\x1b[36m%s\x1b[0m', info);
});

browser.on('command', function(meth, path){
  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
});

browser.init({
    browserName:'firefox'
    , tags : ["examples"]
    , name: "This is an example test"
  }, function() {

  browser.get("http://saucelabs.com/test/guinea-pig", function() {
      browser.title(function(err, title) {
      assert.ok(~title.indexOf('I am a page title - Sauce Labs'), 'Wrong title!');
	  browser.elementById('comments', function(err, el) {
	      el.sendKeys("this is not a comment", function(err) {
		  browser.elementById('submit', function(err, el) {
		      el.click(function() {
			  browser.eval("window.location.href", function(err, title) {
			      assert.ok(~title.indexOf('#'), 'Wrong title!');
			      browser.elementById("your_comments", function(err, el) {
				  el.textPresent("this is not a comment", function(err, present) {
				      assert.ok(present, "Comments not correct");
				      el.text(function(err, text) {
					  console.log(text);
					  browser.quit();  
            })				      
				  })
         })
			  })
       })
		  })
     })
	  })
   })
  })
});
