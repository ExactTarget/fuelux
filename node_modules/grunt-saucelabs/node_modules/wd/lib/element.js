//Element object
//Wrapper around browser methods
var _ = require("underscore")
  , utils = require("./utils.js");;

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
    return this.browser.type(this, keys, cb);
};

element.prototype.sendKeys = element.prototype.type;


/**
 * element.click(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/click
 */
element.prototype.click = function (cb) {
    return this.browser.clickElement(this, cb);
};

/**
 * element.flick(xoffset, yoffset, speed, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/touch/flick
 */
element.prototype.flick = function (xoffset, yoffset, speed, cb) {
    this.browser.flick(this.value, xoffset, yoffset, speed, cb);
};


/**
 * element.text(cb) -> cb(err, text)
 *
 * @jsonWire GET /session/:sessionId/element/:id/text
 * @docOrder 2
 */
element.prototype.text = function (cb) {
    return this.browser.text(this, cb);
};

/**
 * element.textPresent(searchText, cb) -> cb(err, boolean)
 *
 * @jsonWire GET /session/:sessionId/element/:id/text
 * @docOrder 4
 */
element.prototype.textPresent = function(searchText, cb) {
    return this.browser.textPresent(searchText, this, cb);
};

/**
 * element.getAttribute(attrName, cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/attribute/:name
 * @docOrder 2
 */
element.prototype.getAttribute = function(name, cb) {
    return this.browser.getAttribute(this, name, cb);
};

/**
 * element.getTagName(cb) -> cb(err, name)
 *
 * @jsonWire GET /session/:sessionId/element/:id/name
 */
element.prototype.getTagName = function(cb) {
    return this.browser.getTagName(this, cb);
};

/**
 * element.isDisplayed(cb) -> cb(err, displayed)
 *
 * @jsonWire GET /session/:sessionId/element/:id/displayed
 */
element.prototype.isDisplayed = function(cb) {
    return this.browser.isDisplayed(this, cb);
};

element.prototype.displayed = element.prototype.isDisplayed;

/**
 * isVisible(cb) -> cb(err, boolean)
 */
element.prototype.isVisible = function(cb) {
    return this.browser.isVisible(this, cb);
};

/**
 * element.getLocation(cb) -> cb(err, location)
 *
 * @jsonWire GET /session/:sessionId/element/:id/location
 */
element.prototype.getLocation = function (cb) {
    this.browser.getLocation(this, cb);
};

/**
 * element.getSize(cb) -> cb(err, size)
 *
 * @jsonWire GET /session/:sessionId/element/:id/size
 */
element.prototype.getSize = function (cb) {
    this.browser.getSize(this, cb);
};

/**
 * element.getValue(cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/attribute/:name
 * @docOrder 4
 */
element.prototype.getValue = function(cb) {
    return this.browser.getValue(this, cb);
};

/**
 * element.getComputedCss(cssProperty , cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/css/:propertyName
 */
element.prototype.getComputedCss = function(styleName, cb) {
    return this.browser.getComputedCss(this, styleName, cb);
};

element.prototype.getComputedCSS = element.prototype.getComputedCss;

/**
 * element.clear(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/clear
 */
element.prototype.clear = function(cb) {
    return this.browser.clear(this, cb);
};

/**
 * element.getComputedCss(cssProperty , cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/css/:propertyName
 */
element.prototype.getComputedCss = function(styleName, cb) {
    this.browser.getComputedCss(this, styleName, cb);
};

_.each(utils.elementFuncTypes, function(type) {
  /**
   * elementByClassName(value, cb) -> cb(err, element)
   * elementByCssSelector(value, cb) -> cb(err, element)
   * elementById(value, cb) -> cb(err, element)
   * elementByName(value, cb) -> cb(err, element)
   * elementByLinkText(value, cb) -> cb(err, element)
   * elementByPartialLinkText(value, cb) -> cb(err, element)
   * elementByTagName(value, cb) -> cb(err, element)
   * elementByXPath(value, cb) -> cb(err, element)
   * elementByCss(value, cb) -> cb(err, element)
   *
   * @jsonWire POST /session/:sessionId/element/:id/element
   */
  element.prototype['element' + utils.elFuncSuffix(type)] = function(value, cb) {
    element.prototype.element.apply(this, [utils.elFuncFullType(type), value, cb]);
  };

  element.prototype['elements' + utils.elFuncSuffix(type)] = function(value, cb) {
    element.prototype.elements.apply(this, [utils.elFuncFullType(type), value, cb]);
  };
});

element.prototype.element = function(using, value, cb) {
    var _this = this;
    this.browser._jsonWireCall({
      method: 'POST'
      , relPath: '/element/' + _this.value + '/element'
      , data: {using: using, value: value}
      , cb: this.browser._elementCallback(cb)
    });
};

element.prototype.elements = function(using, value, cb) {
    var _this = this;
    this.browser._jsonWireCall({
      method: 'POST'
      , relPath: '/element/' + _this.value + '/elements'
      , data: {using: using, value: value}
      , cb: this.browser._elementsCallback(cb)
    });
};

exports.element = element;
