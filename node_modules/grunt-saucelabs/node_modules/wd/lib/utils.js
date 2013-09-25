var Args = require("vargs").Constructor;

exports.varargs = function(args) {
  var fargs = new(Args)(args);
  // returning undefined instead of empty callback
  fargs.callback = fargs.callbackGiven()? fargs.callback : undefined;
  return fargs;
};

// convert to type to something like ById, ByCssSelector, etc...
exports.elFuncSuffix = function(type){
  var res = (' by ' + type).replace(/(\s[a-z])/g,
    function($1){return $1.toUpperCase().replace(' ','');});
  return res.replace('Xpath', 'XPath');
};

// return correct jsonwire type
exports.elFuncFullType = function(type){
  if(type === 'css') {return 'css selector'; } // shortcut for css
  return type;
};

// from JsonWire spec + shortcuts
exports.elementFuncTypes = ['class name', 'css selector','id','name','link text',
  'partial link text','tag name', 'xpath', 'css' ];
