# WD.js -- WebDriver/Selenium 2 for node.js

[![Build Status](https://secure.travis-ci.org/admc/wd.png?branch=master)](http://travis-ci.org/admc/wd)
[![Selenium Test Status](https://saucelabs.com/buildstatus/wdjs)](https://saucelabs.com/u/wdjs)

## Update node to latest

http://nodejs.org/#download

## Install

<pre>
npm install wd
</pre>

## Authors

  - Adam Christian ([admc](http://github.com/admc))
  - Ruben Daniels ([javruben](https://github.com/javruben))
  - Peter Braden ([peterbraden](https://github.com/peterbraden))
  - Seb Vincent ([sebv](https://github.com/sebv))
  - Peter 'Pita' Martischka ([pita](https://github.com/Pita))
  - Jonathan Lipps ([jlipps](https://github.com/jlipps))
  - Phil Sarin ([pdsarin](https://github.com/pdsarin))
  - Mathieu Sabourin ([OniOni](https://github.com/OniOni))
  - Bjorn Tipling ([btipling](https://github.com/btipling))
  - Santiago Suarez Ordonez ([santiycr](https://github.com/santiycr))
  - Bernard Kobos ([bernii](https://github.com/bernii))
  - Jason Carr ([maudineormsby](https://github.com/maudineormsby))

## License

  * License - Apache 2: http://www.apache.org/licenses/LICENSE-2.0

## Usage

<pre>
): wd shell
> x = wd.remote() or wd.remote("ondemand.saucelabs.com", 80, "username", "apikey")

> x.init() or x.init({desired capabilities ovveride})
> x.get("http://www.url.com")
> x.eval("window.location.href", function(e, o) { console.log(o) })
> x.quit()
</pre>


## Writing a test!

<pre>
var webdriver = require('wd')
  , assert = require('assert');

var browser = webdriver.remote();

browser.on('status', function(info){
  console.log('\x1b[36m%s\x1b[0m', info);
});
browser.on('command', function(meth, path){
  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
});

desired = {
  browserName:'chrome'
  , tags: ["examples"]
  , name: "This is an example test"
};

browser.init(desired, function() {
  browser.get("http://admc.io/wd/test-pages/guinea-pig.html", function() {
    browser.title(function(err, title) {
      assert.ok(~title.indexOf('I am a page title - Sauce Labs'), 'Wrong title!');
      browser.elementById('i am a link', function(err, el) {
        browser.clickElement(el, function() {
          browser.eval("window.location.href", function(err, location) {
            assert.ok(~location.indexOf('guinea-pig2'));
            browser.quit();
          });
        });
      });
    });
  });
});
</pre>

## Promises Api

A promise api using [q](https://github.com/kriskowal/q) is
available. Code sample is
[here](https://github.com/admc/wd/blob/master/examples/example.promise.chrome.js).

## Chain Api

A chain api is also available. Code sample is [here](https://github.com/admc/wd/blob/master/examples/example.chain.chrome.js).

## Supported Methods

<table class="wikitable">
<tbody>
<tr>
<td width="50%" style="border: 1px solid #ccc; padding: 5px;">
<strong>JsonWireProtocol</strong>
</td>
<td width="50%" style="border: 1px solid #ccc; padding: 5px;">
<strong>wd</strong>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/status">/status</a><br>
Query the server's current status.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
status(cb) -&gt; cb(err, status)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session">/session</a><br>
Create a new session.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
init(desired, cb) -&gt; cb(err, sessionID)<br>
Initialize the browser.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/sessions">/sessions</a><br>
Returns a list of the currently active sessions.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
sessions(cb) -&gt; cb(err, sessions)<br>
</p>
<p>
## Alternate strategy to get session capabilities from server session list<br>
altSessionCapabilities(cb) -&gt; cb(err, capabilities)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId">/session/:sessionId</a><br>
Retrieve the capabilities of the specified session.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
sessionCapabilities(cb) -&gt; cb(err, capabilities)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId">/session/:sessionId</a><br>
Delete the session.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
quit(cb) -&gt; cb(err)<br>
Destroy the browser.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts">/session/:sessionId/timeouts</a><br>
Configure the amount of time that a particular type of operation can execute for before they are aborted and a |Timeout| error is returned to the client.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setPageLoadTimeout(ms, cb) -&gt; cb(err)<br>
(use setImplicitWaitTimeout and setAsyncScriptTimeout to set the other timeouts)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/async_script">/session/:sessionId/timeouts/async_script</a><br>
Set the amount of time, in milliseconds, that asynchronous scripts executed by /session/:sessionId/execute_async are permitted to run before they are aborted and a |Timeout| error is returned to the client.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setAsyncScriptTimeout(ms, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/implicit_wait">/session/:sessionId/timeouts/implicit_wait</a><br>
Set the amount of time the driver should wait when searching for elements.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setImplicitWaitTimeout(ms, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window_handle">/session/:sessionId/window_handle</a><br>
Retrieve the current window handle.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
windowHandle(cb) -&gt; cb(err, handle)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window_handles">/session/:sessionId/window_handles</a><br>
Retrieve the list of all window handles available to the session.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
windowHandles(cb) -&gt; cb(err, arrayOfHandles)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/url">/session/:sessionId/url</a><br>
Retrieve the URL of the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
url(cb) -&gt; cb(err, url)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/url">/session/:sessionId/url</a><br>
Navigate to a new URL.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
get(url,cb) -&gt; cb(err)<br>
Get a new url.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/forward">/session/:sessionId/forward</a><br>
Navigate forwards in the browser history, if possible.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
forward(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/back">/session/:sessionId/back</a><br>
Navigate backwards in the browser history, if possible.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
back(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/refresh">/session/:sessionId/refresh</a><br>
Refresh the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
refresh(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/execute">/session/:sessionId/execute</a><br>
Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
execute(code, args, cb) -&gt; cb(err, result)<br>
execute(code, cb) -&gt; cb(err, result)<br>
args: script argument array (optional)<br>
</p>
<p>
Execute script using eval(code):<br>
safeExecute(code, args, cb) -&gt; cb(err, result)<br>
safeExecute(code, cb) -&gt; cb(err, result)<br>
args: script argument array (optional)<br>
</p>
<p>
Evaluate expression (using execute):<br>
eval(code, cb) -&gt; cb(err, value)<br>
</p>
<p>
Evaluate expression (using safeExecute):<br>
safeEval(code, cb) -&gt; cb(err, value)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/execute_async">/session/:sessionId/execute_async</a><br>
Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
executeAsync(code, args, cb) -&gt; cb(err, result)<br>
executeAsync(code, cb) -&gt; cb(err, result)<br>
args: script argument array (optional)<br>
</p>
<p>
Execute async script using eval(code):<br>
safeExecuteAsync(code, args, cb) -&gt; cb(err, result)<br>
safeExecuteAsync(code, cb) -&gt; cb(err, result)<br>
args: script argument array (optional)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/screenshot">/session/:sessionId/screenshot</a><br>
Take a screenshot of the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
takeScreenshot(cb) -&gt; cb(err, screenshot)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/frame">/session/:sessionId/frame</a><br>
Change focus to another frame on the page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
frame(frameRef, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window">/session/:sessionId/window</a><br>
Change focus to another window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
window(name, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/window">/session/:sessionId/window</a><br>
Close the current window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
close(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/maximize">/session/:sessionId/window/:windowHandle/maximize</a><br>
Maximize the specified window if not already maximized.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
maximize(handle, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/cookie">/session/:sessionId/cookie</a><br>
Retrieve all cookies visible to the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
allCookies() -&gt; cb(err, cookies)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/cookie">/session/:sessionId/cookie</a><br>
Set a cookie.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setCookie(cookie, cb) -&gt; cb(err)<br>
cookie example:<br>
{name:'fruit', value:'apple'}<br>
## Optional cookie fields<br>
path, domain, secure, expiry<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie">/session/:sessionId/cookie</a><br>
Delete all cookies visible to the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
deleteAllCookies(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie/:name">/session/:sessionId/cookie/:name</a><br>
Delete the cookie with the given name.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
deleteCookie(name, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/source">/session/:sessionId/source</a><br>
Get the current page source.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
source(cb) -&gt; cb(err, source)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/title">/session/:sessionId/title</a><br>
Get the current page title.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
title(cb) -&gt; cb(err, title)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element">/session/:sessionId/element</a><br>
Search for an element on the page, starting from the document root.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
element(using, value, cb) -&gt; cb(err, element)<br>
</p>
<p>
elementByClassName(value, cb) -&gt; cb(err, element)<br>
elementByCssSelector(value, cb) -&gt; cb(err, element)<br>
elementById(value, cb) -&gt; cb(err, element)<br>
elementByName(value, cb) -&gt; cb(err, element)<br>
elementByLinkText(value, cb) -&gt; cb(err, element)<br>
elementByPartialLinkText(value, cb) -&gt; cb(err, element)<br>
elementByTagName(value, cb) -&gt; cb(err, element)<br>
elementByXPath(value, cb) -&gt; cb(err, element)<br>
elementByCss(value, cb) -&gt; cb(err, element)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/elements">/session/:sessionId/elements</a><br>
Search for multiple elements on the page, starting from the document root.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
elements(using, value, cb) -&gt; cb(err, elements)<br>
</p>
<p>
elementsByClassName(value, cb) -&gt; cb(err, elements)<br>
elementsByCssSelector(value, cb) -&gt; cb(err, elements)<br>
elementsById(value, cb) -&gt; cb(err, elements)<br>
elementsByName(value, cb) -&gt; cb(err, elements)<br>
elementsByLinkText(value, cb) -&gt; cb(err, elements)<br>
elementsByPartialLinkText(value, cb) -&gt; cb(err, elements)<br>
elementsByTagName(value, cb) -&gt; cb(err, elements)<br>
elementsByXPath(value, cb) -&gt; cb(err, elements)<br>
elementsByCss(value, cb) -&gt; cb(err, elements)<br>
</p>
<p>
## Retrieve an element avoiding not found exception and returning null instead<br>
elementOrNull(using, value, cb) -&gt; cb(err, element)<br>
</p>
<p>
elementByClassNameOrNull(value, cb) -&gt; cb(err, element)<br>
elementByCssSelectorOrNull(value, cb) -&gt; cb(err, element)<br>
elementByIdOrNull(value, cb) -&gt; cb(err, element)<br>
elementByNameOrNull(value, cb) -&gt; cb(err, element)<br>
elementByLinkTextOrNull(value, cb) -&gt; cb(err, element)<br>
elementByPartialLinkTextOrNull(value, cb) -&gt; cb(err, element)<br>
elementByTagNameOrNull(value, cb) -&gt; cb(err, element)<br>
elementByXPathOrNull(value, cb) -&gt; cb(err, element)<br>
elementByCssOrNull(value, cb) -&gt; cb(err, element)<br>
</p>
<p>
## Retrieve an element avoiding not found exception and returning undefined instead<br>
elementIfExists(using, value, cb) -&gt; cb(err, element)<br>
</p>
<p>
elementByClassNameIfExists(value, cb) -&gt; cb(err, element)<br>
elementByCssSelectorIfExists(value, cb) -&gt; cb(err, element)<br>
elementByIdIfExists(value, cb) -&gt; cb(err, element)<br>
elementByNameIfExists(value, cb) -&gt; cb(err, element)<br>
elementByLinkTextIfExists(value, cb) -&gt; cb(err, element)<br>
elementByPartialLinkTextIfExists(value, cb) -&gt; cb(err, element)<br>
elementByTagNameIfExists(value, cb) -&gt; cb(err, element)<br>
elementByXPathIfExists(value, cb) -&gt; cb(err, element)<br>
elementByCssIfExists(value, cb) -&gt; cb(err, element)<br>
</p>
<p>
## Check if element exists<br>
hasElement(using, value, cb) -&gt; cb(err, boolean)<br>
</p>
<p>
hasElementByClassName(value, cb) -&gt; cb(err, boolean)<br>
hasElementByCssSelector(value, cb) -&gt; cb(err, boolean)<br>
hasElementById(value, cb) -&gt; cb(err, boolean)<br>
hasElementByName(value, cb) -&gt; cb(err, boolean)<br>
hasElementByLinkText(value, cb) -&gt; cb(err, boolean)<br>
hasElementByPartialLinkText(value, cb) -&gt; cb(err, boolean)<br>
hasElementByTagName(value, cb) -&gt; cb(err, boolean)<br>
hasElementByXPath(value, cb) -&gt; cb(err, boolean)<br>
hasElementByCss(value, cb) -&gt; cb(err, boolean)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/active">/session/:sessionId/element/active</a><br>
Get the element on the page that currently has focus.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
active(cb) -&gt; cb(err, element)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/element">/session/:sessionId/element/:id/element</a><br>
Search for an element on the page, starting from the identified element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
elementByClassName(value, cb) -&gt; cb(err, element)<br>
elementByCssSelector(value, cb) -&gt; cb(err, element)<br>
elementById(value, cb) -&gt; cb(err, element)<br>
elementByName(value, cb) -&gt; cb(err, element)<br>
elementByLinkText(value, cb) -&gt; cb(err, element)<br>
elementByPartialLinkText(value, cb) -&gt; cb(err, element)<br>
elementByTagName(value, cb) -&gt; cb(err, element)<br>
elementByXPath(value, cb) -&gt; cb(err, element)<br>
elementByCss(value, cb) -&gt; cb(err, element)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/click">/session/:sessionId/element/:id/click</a><br>
Click on an element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
clickElement(element, cb) -&gt; cb(err)<br>
</p>
<p>
element.click(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/submit">/session/:sessionId/element/:id/submit</a><br>
Submit a FORM element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
submit(element, cb) -&gt; cb(err)<br>
Submit a `FORM` element.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/text">/session/:sessionId/element/:id/text</a><br>
Returns the visible text for the element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
text(element, cb) -&gt; cb(err, text)<br>
element: specific element, 'body', or undefined<br>
</p>
<p>
element.text(cb) -&gt; cb(err, text)<br>
</p>
<p>
## Check if text is present<br>
textPresent(searchText, element, cb) -&gt; cb(err, boolean)<br>
element: specific element, 'body', or undefined<br>
</p>
<p>
element.textPresent(searchText, cb) -&gt; cb(err, boolean)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/value">/session/:sessionId/element/:id/value</a><br>
Send a sequence of key strokes to an element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
type(element, keys, cb) -&gt; cb(err)<br>
Type keys (all keys are up at the end of command).<br>
special key map: wd.SPECIAL_KEYS (see lib/special-keys.js)<br>
</p>
<p>
element.type(keys, cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/keys">/session/:sessionId/keys</a><br>
Send a sequence of key strokes to the active element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
keys(keys, cb) -&gt; cb(err)<br>
Press keys (keys may still be down at the end of command).<br>
special key map: wd.SPECIAL_KEYS (see lib/special-keys.js)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/name">/session/:sessionId/element/:id/name</a><br>
Query for an element's tag name.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getTagName(element, cb) -&gt; cb(err, name)<br>
</p>
<p>
element.getTagName(cb) -&gt; cb(err, name)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/clear">/session/:sessionId/element/:id/clear</a><br>
Clear a TEXTAREA or text INPUT element's value.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
clear(element, cb) -&gt; cb(err)<br>
</p>
<p>
element.clear(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/selected">/session/:sessionId/element/:id/selected</a><br>
Determine if an OPTION element, or an INPUT element of type checkbox or radiobutton is currently selected.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
isSelected(element, cb) -&gt; cb(err, selected)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/attribute/:name">/session/:sessionId/element/:id/attribute/:name</a><br>
Get the value of an element's attribute.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getAttribute(element, attrName, cb) -&gt; cb(err, value)<br>
</p>
<p>
element.getAttribute(attrName, cb) -&gt; cb(err, value)<br>
</p>
<p>
Get element value (in value attribute):<br>
getValue(element, cb) -&gt; cb(err, value)<br>
</p>
<p>
element.getValue(cb) -&gt; cb(err, value)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/displayed">/session/:sessionId/element/:id/displayed</a><br>
Determine if an element is currently displayed.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
isDisplayed(element, cb) -&gt; cb(err, displayed)<br>
</p>
<p>
element.isDisplayed(cb) -&gt; cb(err, displayed)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/location">/session/:sessionId/element/:id/location</a><br>
Determine an element's location on the page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getLocation(element, cb) -&gt; cb(err, location)<br>
</p>
<p>
element.getLocation(cb) -&gt; cb(err, location)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/size">/session/:sessionId/element/:id/size</a><br>
Determine an element's size in pixels.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getSize(element, cb) -&gt; cb(err, size)<br>
</p>
<p>
element.getSize(cb) -&gt; cb(err, size)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/css/:propertyName">/session/:sessionId/element/:id/css/:propertyName</a><br>
Query the value of an element's computed CSS property.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getComputedCss(element, cssProperty , cb) -&gt; cb(err, value)<br>
</p>
<p>
element.getComputedCss(cssProperty , cb) -&gt; cb(err, value)<br>
</p>
<p>
element.getComputedCss(cssProperty , cb) -&gt; cb(err, value)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/orientation">/session/:sessionId/orientation</a><br>
Get the current browser orientation.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getOrientation(cb) -&gt; cb(err, orientation)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/orientation">/session/:sessionId/orientation</a><br>
Set the browser orientation.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setOrientation(cb) -&gt; cb(err, orientation)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/alert_text">/session/:sessionId/alert_text</a><br>
Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
alertText(cb) -&gt; cb(err, text)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/alert_text">/session/:sessionId/alert_text</a><br>
Sends keystrokes to a JavaScript prompt() dialog.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
alertKeys(keys, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/accept_alert">/session/:sessionId/accept_alert</a><br>
Accepts the currently displayed alert dialog.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
acceptAlert(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/dismiss_alert">/session/:sessionId/dismiss_alert</a><br>
Dismisses the currently displayed alert dialog.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
dismissAlert(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/moveto">/session/:sessionId/moveto</a><br>
Move the mouse by an offset of the specificed element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
moveTo(element, xoffset, yoffset, cb) -&gt; cb(err)<br>
Move to element, xoffset and y offset are optional.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/click">/session/:sessionId/click</a><br>
Click any mouse button (at the coordinates set by the last moveto command).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
click(button, cb) -&gt; cb(err)<br>
Click on current element.<br>
Buttons: {left: 0, middle: 1 , right: 2}<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/buttondown">/session/:sessionId/buttondown</a><br>
Click and hold the left mouse button (at the coordinates set by the last moveto command).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
buttonDown(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/buttonup">/session/:sessionId/buttonup</a><br>
Releases the mouse button previously held (where the mouse is currently at).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
buttonUp(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/doubleclick">/session/:sessionId/doubleclick</a><br>
Double-clicks at the current mouse coordinates (set by moveto).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
doubleclick(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/touch/flick">/session/:sessionId/touch/flick</a><br>
Flick on the touch screen using finger motion events.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
flick(xSpeed, ySpeed, cb) -&gt; cb(err)<br>
Flicks, starting anywhere on the screen.<br>
flick(element, xoffset, yoffset, speed, cb) -&gt; cb(err)<br>
Flicks, starting at element center.<br>
</p>
<p>
element.flick(xoffset, yoffset, speed, cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
esired, cb<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Opens a new window (using Javascript window.open):<br>
newWindow(url, name, cb) -&gt; cb(err)<br>
newWindow(url, cb) -&gt; cb(err)<br>
name: optional window name<br>
Window can later be accessed by name with the window method,<br>
or by getting the last handle returned by the windowHandles method.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
rl, name, cb<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
windowName(cb) -&gt; cb(err, name)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitForElement(using, value, timeout, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitForVisible(using, value, timeout, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitForElementByClassName(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByCssSelector(value, timeout, cb) -&gt; cb(err)<br>
waitForElementById(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByName(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByLinkText(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByPartialLinkText(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByTagName(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByXPath(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByCss(value, timeout, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitForVisibleByClassName(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByCssSelector(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleById(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByName(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByLinkText(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByPartialLinkText(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByTagName(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByXPath(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByCss(value, timeout, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
isVisible(element , cb) -&gt; cb(err, boolean)<br>
isVisible(queryType, querySelector, cb) -&gt; cb(err, boolean)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Waits for JavaScript condition to be true (polling within wd client):<br>
waitForCondition(conditionExpr, timeout, pollFreq, cb) -&gt; cb(err, boolean)<br>
waitForCondition(conditionExpr, timeout, cb) -&gt; cb(err, boolean)<br>
waitForCondition(conditionExpr, cb) -&gt; cb(err, boolean)<br>
conditionExpr: condition expression, should return a boolean<br>
timeout: timeout (optional, default: 1000)<br>
pollFreq: pooling frequency (optional, default: 100)<br>
return true if condition satisfied, error otherwise.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Waits for JavaScript condition to be true (async script polling within browser):<br>
waitForConditionInBrowser(conditionExpr, timeout, pollFreq, cb) -&gt; cb(err, boolean)<br>
waitForConditionInBrowser(conditionExpr, timeout, cb) -&gt; cb(err, boolean)<br>
waitForConditionInBrowser(conditionExpr, cb) -&gt; cb(err, boolean)<br>
conditionExpr: condition expression, should return a boolean<br>
timeout: timeout (optional, default: 1000)<br>
pollFreq: pooling frequency (optional, default: 100)<br>
return true if condition satisfied, error otherwise.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
isVisible(cb) -&gt; cb(err, boolean)<br>
</td>
</tr>
</tbody>
</table>

## JsonWireProtocol mapping

[supported mapping](https://github.com/admc/wd/blob/master/doc/jsonwire-mapping.md)

[full mapping](https://github.com/admc/wd/blob/master/doc/jsonwire-full-mapping.md)

## More docs!
<pre>
WD is simply implementing the Selenium JsonWireProtocol, for more details see the official docs:
 - <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol">http://code.google.com/p/selenium/wiki/JsonWireProtocol</a>
</pre>

## Run the tests!
<pre>
  - Run the selenium server with chromedriver:
      java -jar selenium-server-standalone-2.21.0.jar -Dwebdriver.chrome.driver=&lt;PATH&gt;/chromedriver
  - cd wd
  - npm install .
  - make test
  - look at the results!
</pre>

## Run the tests on Sauce Labs cloud!
<pre>
  - cd wd
  - npm install .
  - make test_saucelabs
</pre>

## Adding new method / Contributing

If the method you want to use is not yet implemented, that should be
easy to add it to `lib/webdriver.js`. You can use the `doubleclick`
method as a template for methods not returning data, and `getOrientation`
for methods which returns data. No need to modify README as the doc
generation is automated. Other contributions are welcomed.

## Doc

The JsonWire mappings in the README and mapping files are generated from code
comments using [dox](https://github.com/visionmedia/dox).

To update the mappings run the following commands:

<pre>
  - make mapping > doc/jsonwire-mapping.md 
  - make full_mapping > doc/jsonwire-full-mapping.md
</pre>

The content of doc/jsonwire-mapping.md should then be manually integrated into
README.md.

## Test Coverage

[test coverage](http://admc.io/wd/coverage.html)
