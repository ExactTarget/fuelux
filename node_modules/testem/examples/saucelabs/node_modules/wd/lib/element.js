//Element object
//Wrapper around browser methods

var element = function(value, browser) {
    this.value = value;
    this.browser = browser;

    if(!value){
      throw new Error("no value passed to element constructor");
    }

    if(!browser){
      throw new Error("no browser passed to element constructor");
    }
};

element.prototype.toString = function () {
    return String(this.value);
};

/**
 * element.type(keys, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/value
 */
element.prototype.type = function (keys, cb) {
    this.browser.type(this, keys, cb);
};

element.prototype.sendKeys = element.prototype.type


/**
 * element.click(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/click
 */
element.prototype.click = function (cb) {
    this.browser.clickElement(this, cb);
};

/**
 * element.text(cb) -> cb(err, text)
 * 
 * @jsonWire GET /session/:sessionId/element/:id/text
 * @docOrder 2
 */
element.prototype.text = function (cb) {
    this.browser.text(this, cb);
};

/**
 * element.textPresent(searchText, cb) -> cb(err, boolean)
 *  
 * @jsonWire GET /session/:sessionId/element/:id/text
 * @docOrder 4
 */
element.prototype.textPresent = function(searchText, cb) {
    this.browser.textPresent(searchText, this, cb);
};

/**
 * element.getAttribute(attrName, cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/attribute/:name
 * @docOrder 2 
 */
element.prototype.getAttribute = function(name, cb) {
    this.browser.getAttribute(this, name, cb);
};

/**
 * element.getTagName(cb) -> cb(err, name)
 *
 * @jsonWire GET /session/:sessionId/element/:id/name
 */
element.prototype.getTagName = function(cb) {
    this.browser.getTagName(this, cb);
};

/**
 * element.isDisplayed(cb) -> cb(err, displayed)
 *
 * @jsonWire GET /session/:sessionId/element/:id/displayed
 */
element.prototype.isDisplayed = function(cb) {
    this.browser.isDisplayed(this, cb);
};

element.prototype.displayed = element.prototype.isDisplayed

/**
 * isVisible(cb) -> cb(err, boolean)
 */
element.prototype.isVisible = function(cb) {
    this.browser.isVisible(this, cb);
};

/**
 * element.getValue(cb) -> cb(err, value)
 * 
 * @jsonWire GET /session/:sessionId/element/:id/attribute/:name
 * @docOrder 4 
 */
element.prototype.getValue = function(cb) {
    this.browser.getValue(this, cb);
};

/**
 * element.getComputedCss(cssProperty , cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/css/:propertyName
 */
element.prototype.getComputedCss = function(styleName, cb) {
    this.browser.getComputedCss(this, styleName, cb);
};

element.prototype.getComputedCSS = element.prototype.getComputedCss

/**
 * element.clear(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/clear
 */
element.prototype.clear = function(cb) {
    this.browser.clear(this, cb);
};

exports.element = element