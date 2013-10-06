var __slice = Array.prototype.slice;
var SPECIAL_KEYS = require('./special-keys');
var webdriver = require('./webdriver');
var promiseWebdriver = require('./promise-webdriver');

// parses server parameters
var parseRemoteWdConfig = function(args) {
  var config;
  if (typeof (args[0]) === 'object') {
    config = args[0];
  } else {
    config = {
      host: args[0],
      port: args[1],
      username: args[2],
      accessKey: args[3]
    };
  }
  return config;
};

// creates the webdriver object
// server parameters can be passed in 2 ways
// - as a list of arguments host,port, username, accessKey
// - as an option object containing the fields above
exports.remote = function() {
  var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  var rwc = parseRemoteWdConfig(args);

  return new webdriver(rwc);
};


exports.promiseRemote = function() {
  var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  var rwc = parseRemoteWdConfig(args);

  return new promiseWebdriver(rwc);
};


exports.SPECIAL_KEYS = SPECIAL_KEYS;
