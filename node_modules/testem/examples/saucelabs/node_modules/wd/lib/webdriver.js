var EventEmitter = require('events').EventEmitter;
var async = require("async");
var fs = require("fs");
var element = require('./element').element;
var http = require("http");
var https = require("https");
var __slice = Array.prototype.slice;
var JSONWIRE_ERRORS = require('./jsonwire-errors.js');

// webdriver client main class
// WdConfig is an option object containing the following fields:
// host,port, username, accessKey
var webdriver = module.exports = function(remoteWdConfig) {
  this.sessionID = null;
  this.username = remoteWdConfig.username || process.env.SAUCE_USERNAME;
  this.accessKey = remoteWdConfig.accessKey  || process.env.SAUCE_ACCESS_KEY;
  this.basePath = (remoteWdConfig.path || '/wd/hub');
  this.https = (remoteWdConfig.https || false);
  // default
  this.options = {
    host: remoteWdConfig.host || '127.0.0.1'
    , port: remoteWdConfig.port || 4444
    , path: (this.basePath + '/session').replace('//', '/')
  };
  this.defaultCapabilities = {
    browserName: 'firefox'
    , version: ''
    , javascriptEnabled: true
    , platform: 'ANY'
  };
  // saucelabs default
  if ((this.username != null) && (this.accessKey != null)) {
    this.defaultCapabilities.platform = 'VISTA';
  }
};

//inherit from EventEmitter
webdriver.prototype = new EventEmitter();

webdriver.prototype._getJsonwireError = function(status) {
  var jsonwireError = JSONWIRE_ERRORS.filter(function(err) {
    return err.status = status;
  });
  return ((jsonwireError.length>0) ? jsonwireError[0] : null);
};

webdriver.prototype._newError = function(opts)
{
  var err = new Error();
  for (var k in opts) {
    err[k] = opts[k]
  }
  // nicer error output
  err.inspect = function() {
    var res = "";
    var browserError = null;
    for (var k in this) {
      var _this = this;
      (function() {
        var v = _this[k];
        if (typeof v === 'object') {
          if ((v["class"] != null) &&  v["class"].match(/org.openqa.selenium.remote.Response/)) {
            // for selenium classes, hidding long fields or field with
            // duplicate information
            var vAsStr = JSON.stringify(v, function(key, value) {
              if (key === 'screen' || key === 'stackTrace' || key === 'buildInformation' || key === 'localizedMessage') {
                return '[hidden]';
              } else if (key === 'message') {
                // trying to extract browser error message
                var messageMatch = value.match(/([^\n]+)\nCommand duration/);
                if((messageMatch!=null) && (messageMatch.length >= 1)) { browserError = messageMatch[1].trim(); }
                return value;
              } else {
                return value;
              }
            }, "  ");
            res += k + ": " + vAsStr + "\n";
          } else {
            // for other objects making sure output is not too long
            var vAsStr = JSON.stringify(v, undefined, "  ");
            var maxLength = 1000;
            if (vAsStr.length > maxLength) {
              vAsStr = vAsStr.substr(0, maxLength) + "\n...";
            }
            res += k + ": " + vAsStr + "\n";
          }
        } else if (typeof v != 'function')
        {
          // printing non object types without modif
          res += k + ": " + v + "\n";
        }
      })();
    };
    if(browserError != null){
      res += "browser-error: " + browserError + "\n";
    }
    return res;
  };
  return err;
};

webdriver.prototype._isWebDriverException = function(res) {
  var _ref;
  if ((typeof res !== "undefined" && res !== null ?
    (_ref = res["class"]) != null ? _ref.indexOf('WebDriverException') :
      void 0 : void 0) > 0) {
    return true;
  }
  return false;
}

// just calls the callback when there is no result
webdriver.prototype._simpleCallback = function(cb) {
  var _this = this;
  return function(res) {
    if(res==null) {
      // expected behaviour for quit
      if(cb!=null){ return cb(null);}
    }else{
      res.setEncoding('utf8');
      var data = '';
      res.on('data', function(chunk) { data += chunk.toString(); });
      res.on('end', function() {
        if((data == '') || (data == 'OK')) {
          // expected behaviour when not returning JsonWire response
          return cb(null)
        } else {
          // looking for JsonWire response
          var jsonWireRes = null;
          try{jsonWireRes = JSON.parse(data);}catch(err){}
          if ((jsonWireRes !== null) && (jsonWireRes.sessionId != null) && (jsonWireRes.status != null)) {
            // valid JsonWire response 
            if(jsonWireRes.status === 0) {
              return cb(null)              
            } else {
              return cb(_this._newError(
                {message:'Error response status.',status:jsonWireRes.status,cause:jsonWireRes} ) );              
            }
          } else {         
            // something wrong
            if(cb!=null){
              return cb(_this._newError(
                {message:'Unexpected data in simpleCallback.', data:data}) );
            }
          }
        }
      });
    }
  };
};

// base for all callback handling data
webdriver.prototype._callbackWithDataBase = function(cb) {
  var strip = function strip(str) {
    var x = [];
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i)) {
        x.push(str.charAt(i));
      }
    }
    return x.join('');
  };

  var _this = this;
  return function(res) {
    res.setEncoding('utf8');
    var data = '';
    res.on('data', function(chunk) { data += chunk.toString(); });
    res.on('end', function() {
      var obj;
      try {
        obj = JSON.parse(strip(data));
      } catch (e) {
        return cb(_this._newError({message:'Not JSON response', data:data}));
      }
      if (obj.status > 0) {
        var err = _this._newError(
          {message:'Error response status.',status:obj.status,cause:obj});
        var jsonwireError  = _this._getJsonwireError(obj.status);
        if(jsonwireError != null){ err['jsonwire-error'] = jsonwireError; }
        cb(err);
      } else {
        cb(null, obj);
      }
    });
  }
};

// retrieves field value from result
webdriver.prototype._callbackWithData = function(cb) {
  var _this = this;
  return _this._callbackWithDataBase(function(err,obj) {
    if(err != null) {return cb(err);}
    if(_this._isWebDriverException(obj.value)) {return cb(_this._newError(
      {message:obj.value.message,cause:obj.value}));}
    cb(null, obj.value);
  });
};

// retrieves ONE element
webdriver.prototype._elementCallback = function(cb) {
  var _this = this;
  return _this._callbackWithDataBase(function(err, obj) {
    if(err != null) {return cb(err);}
    if(_this._isWebDriverException(obj.value)) {return cb(_this._newError(
      {message:obj.value.message,cause:obj.value}));}
    if (!obj.value.ELEMENT) {
      cb(_this._newError(
        {message:"no ELEMENT in response value field.",cause:obj}));
    } else {
      var el = new element(obj.value.ELEMENT, _this);
      cb(null, el);
    }
  });
};

// retrieves SEVERAL elements
webdriver.prototype._elementsCallback = function(cb) {
  var _this = this;
  return _this._callbackWithDataBase(function(err, obj) {
    //_this = this; TODO: not sure about this
    if(err != null) {return cb(err);}
    if(_this._isWebDriverException(obj.value)) {return cb(_this._newError(
      {message:obj.value.message,cause:obj.value}));}
    if (!(obj.value instanceof Array)) {return cb(_this._newError(
      {message:"Response value field is not an Array.", cause:obj.value}));}
    var i, elements = [];
    for (i = 0; i < obj.value.length; i++) {
      var el = new element(obj.value[i].ELEMENT, _this);
      elements.push(el);
    }
    cb(null, elements);
  });
};

webdriver.prototype._newHttpOpts = function(method) {
  var opts = new Object();
  opts.method = method;
  for (var o in this.options) {
    opts[o] = this.options[o];
  }
  opts.headers = {};
  opts.headers['Connection'] = 'keep-alive';
  if (opts.method === 'POST' || opts.method === 'GET')
    opts.headers['Accept'] = 'application/json';
  if (opts.method == 'POST')
    opts.headers['Content-Type'] = 'application/json; charset=UTF-8';
  return opts;
};

 
/**
 * init(desired, cb) -> cb(err, sessionID)
 * Initialize the browser.
 *
 * @jsonWire POST /session
 */
webdriver.prototype.init = function(desired, cb) {
  var _this = this;

  //allow desired ovveride to be left out
  if (typeof desired == 'function') {
    cb = desired;
    desired = {};
  }

  // making copy
  var _desired = {};
  for (var k in desired) {
    _desired[k] = desired[k];
  }

  // defaulting capabilities when necessary
  for (var k in this.defaultCapabilities) {
    _desired[k] = _desired[k] || this.defaultCapabilities[k];
  }

  // http options
  var httpOpts = _this._newHttpOpts.apply(this, ['POST']);

  // authentication (for saucelabs)
  if ((_this.username != null) && (_this.accessKey != null)) {
    var authString = _this.username + ':' + _this.accessKey;
    var buf = new Buffer(authString);
    httpOpts['headers'] = {
      'Authorization': 'Basic ' + buf.toString('base64')
    };
  }

  // building request
  var data = JSON.stringify({desiredCapabilities: _desired});
  httpOpts.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
  var req = (this.https ? https : http).request(httpOpts, function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      if (res.headers.location == undefined) {
        console.log('\x1b[31mError\x1b[0m: The environment you requested was unavailable.\n');
        console.log('\x1b[33mReason\x1b[0m:\n');
        console.log(data);
        console.log('\nFor the available values please consult the WebDriver JSONWireProtocol,');
        console.log('located at: \x1b[33mhttp://code.google.com/p/selenium/wiki/JsonWireProtocol#/session\x1b[0m');
        if (cb)
          cb({ message: 'The environment you requested was unavailable.' });
        return;
      }
      var locationArr = res.headers.location.split('/');
      _this.sessionID = locationArr[locationArr.length - 1];
      _this.emit('status', '\nDriving the web on session: ' + _this.sessionID + '\n');

      if (cb) { cb(null, _this.sessionID) }
    });
  });
  req.on('error', function(e) { cb(e); });

  // writting data
  req.write(data);

  // sending
  req.end();
};

// standard jsonwire call
webdriver.prototype._jsonWireCall = function(opts) {
  var _this = this;

  // http options init
  var httpOpts = _this._newHttpOpts.apply(_this, [opts.method]);

  // retrieving path information
  var relPath = opts.relPath;
  var absPath = opts.absPath;

  // setting path in http options
  if (this.sessionID != null) { httpOpts['path'] += '/' + this.sessionID; }
  if (relPath) { httpOpts['path'] += relPath; }
  if (absPath) { httpOpts['path'] = absPath;}

  // building callback
  var cb = opts.cb
  if (opts.emit != null) {
    // wrapping cb if we need to emit a message
    var _cb = cb;
    cb = function(res) {
      if (opts.emit != null) {
        _this.emit(opts.emit.event, opts.emit.message);
      }
      if (_cb) { _cb(null); }
    };
  }

  // logging
  _this.emit('command', httpOpts['method'],
    httpOpts['path'].replace(this.sessionID, ':sessionID')
      .replace(this.basePath, '')
    );

  // writting data
  var data = '';
  if (opts.data != null) {
    data = opts.data;
  }
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  httpOpts.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
  // building request
  var req = (this.https ? https : http).request(httpOpts, cb);
  req.on('error', function(e) { cb(e); });

  req.write(data);

  //sending
  req.end();
};

/**
 * status(cb) -> cb(err, status)
 *
 * @jsonWire GET /status
 */
webdriver.prototype.status = function(cb) {
  this._jsonWireCall({
    method: 'GET'
    , absPath: this.basePath + '/status'
    , cb: this._callbackWithData(cb)
  });
};

/**
 * sessions(cb) -> cb(err, sessions)
 * 
 * @jsonWire GET /sessions
 */
webdriver.prototype.sessions = function(cb) {
  this._jsonWireCall({
    method: 'GET'
    , absPath: this.basePath + '/sessions'
    , cb: this._callbackWithData(cb)
  });
}

webdriver.prototype.chain = function(){
  var _this = this;

  //add queue if not already here
  if(!_this._queue){
    _this._queue = async.queue(function (task, callback) {
      if(task.args.length > 0 && typeof task.args[task.args.length-1] === "function"){
        //wrap the existing callback
        var func = task.args[task.args.length-1];
        task.args[task.args.length-1] = function(){
          func.apply(null, arguments);
          callback();
        }
      } else {
        //add a callback
        task.args.push(callback);
      }

      //call the function
      _this[task.name].apply(_this, task.args);
    }, 1);
  }

  var chain = {};

  //builds a placeHolder functions
  var buildPlaceholder = function(name){
    return function(){
      _this._queue.push({name: name, args: Array.prototype.slice.apply(arguments)});
      return chain;
    }
  }

  //fill the chain with placeholders
  for(var name in _this){
    if(typeof _this[name] === "function" && name !== "chain"){
      chain[name] = buildPlaceholder(name);
    }
  }

  return chain;
}

/**
 * Alternate strategy to get session capabilities from server session list: 
 * altSessionCapabilities(cb) -> cb(err, capabilities)
 * 
 * @jsonWire GET /sessions
 */
webdriver.prototype.altSessionCapabilities = function(cb) {
  var _this = this;
  // looking for the current session
  _this.sessions.apply(this, [function(err, sessions) {
    if (err == null) {
      sessions = sessions.filter(function(session) {
        return session.id === _this.sessionID;
      });
      var _ref;
      return cb(null, (_ref = sessions[0]) != null ? _ref.capabilities : void 0);
    } else {
      return cb(err, sessions);
    }
  }]);
};

/**
 * sessionCapabilities(cb) -> cb(err, capabilities)
 * 
 * @jsonWire GET /session/:sessionId
 */
webdriver.prototype.sessionCapabilities = function(cb) {
  this._jsonWireCall({
    method: 'GET'
    // default url
    , cb: this._callbackWithData(cb)
  });
}

/**
 * Opens a new window (using Javascript window.open):
 * newWindow(url, name, cb) -> cb(err)
 * newWindow(url, cb) -> cb(err)
 * name: optional window name
 * Window can later be accessed by name with the window method, 
 * or by getting the last handle returned by the windowHandles method.
 */
webdriver.prototype.newWindow = function(url, name, cb) {
  if ((cb == undefined) && (typeof(name) == 'function')) {
    cb = name;
    name = undefined;
  };
  this.execute("var url=arguments[0], name=arguments[1]; window.open(url, name);", [url,name] , cb);
}

/**
 * close(cb) -> cb(err)
 * 
 * @jsonWire DELETE /session/:sessionId/window
 */
webdriver.prototype.close = function(cb) {
  this._jsonWireCall({
    method: 'DELETE'
    , relPath: '/window'
    , cb: this._simpleCallback(cb)
  });
}

/**
 * window(name, cb) -> cb(err)
 * 
 * @jsonWire POST /session/:sessionId/window
 */
webdriver.prototype.window = function(windowRef, cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/window'
    , cb: this._simpleCallback(cb)
    , data: { name: windowRef }
  });
}

/**
 * frame(frameRef, cb) -> cb(err)
 * 
 * @jsonWire POST /session/:sessionId/frame
 */
webdriver.prototype.frame = function(frameRef, cb) {  
  // avoid using this, webdriver seems very buggy  
  // doesn't work at all with chromedriver
  if(typeof(frameRef)=='function'){
    cb = frameRef;
    frameRef = null;
  }
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/frame'
    , cb: this._simpleCallback(cb)
    , data: { id: frameRef }
  });
}

/**
 * windowName(cb) -> cb(err, name)
 */
webdriver.prototype.windowName = function(cb) {
  this.safeEval("window.name", cb);
};

/**
 * windowHandle(cb) -> cb(err, handle)
 * 
 * @jsonWire GET /session/:sessionId/window_handle
 */
webdriver.prototype.windowHandle = function(cb) {
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/window_handle'
    , cb: this._callbackWithData(cb)
  });
};

/**
 * windowHandles(cb) -> cb(err, arrayOfHandles)
 * 
 * @jsonWire GET /session/:sessionId/window_handles
 */
webdriver.prototype.windowHandles = function(cb) {
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/window_handles'
    , cb: this._callbackWithData(cb)
  });
};

/**
 * quit(cb) -> cb(err)
 * Destroy the browser.
 * 
 * @jsonWire DELETE /session/:sessionId
 */
webdriver.prototype.quit = function(cb) {
  this._jsonWireCall({
    method: 'DELETE'
    // default url
    , emit: {event: 'status', message: '\nEnding your web drivage..\n'}
    , cb: this._simpleCallback(cb)
  });
}

/**
 * Evaluate expression (using execute): 
 * eval(code, cb) -> cb(err, value)
 * 
 * @jsonWire POST /session/:sessionId/execute
 */ 
webdriver.prototype.eval = function(code, cb) {
  code = "return " + code + ";"
  this.execute.apply( this, [code, function(err, res) {
    if(err!=null) {return cb(err);}
    cb(null, res);
  }]);
};

/**
 * Evaluate expression (using safeExecute): 
 * safeEval(code, cb) -> cb(err, value)
 * 
 * @jsonWire POST /session/:sessionId/execute
 */ 
webdriver.prototype.safeEval = function(code, cb) {
  this.safeExecute.apply( this, [code, function(err, res) {
    if(err!=null) {return cb(err);}
    cb(null, res);
  }]);
};

/**
 * execute(code, args, cb) -> cb(err, result)
 * execute(code, cb) -> cb(err, result)
 * args: script argument array (optional)
 *  
 * @jsonWire POST /session/:sessionId/execute
 * @docOrder 1
 */ 
webdriver.prototype.execute = function(code,args,cb) {
  // parsing arguments (code,args,cb) with optional args
  var _args, _i;
  _args = 2 <= arguments.length ? __slice.call(arguments, 0,
    _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
  code = _args[0], args = _args[1];

  //args default
  if (typeof args === "undefined" || args === null) {
    args = [];
  }

  this._jsonWireCall({
    method: 'POST'
    , relPath: '/execute'
    , cb: this._callbackWithData(cb)
    , data: {script: code, args: args}
  });
}

// script to be executed in browser
var safeExecuteJsScript = fs.readFileSync( __dirname + "/../browser-scripts/safe-execute.js", 'utf8');

/**
 * Execute script using eval(code): 
 * safeExecute(code, args, cb) -> cb(err, result)
 * safeExecute(code, cb) -> cb(err, result)
 * args: script argument array (optional)
 *  
 * @jsonWire POST /session/:sessionId/execute
 * @docOrder 2
 */ 
webdriver.prototype.safeExecute = function(code,args,cb) {
  // parsing arguments (code,args,cb) with optional args
  var _args, _i;
  _args = 2 <= arguments.length ? __slice.call(arguments, 0,
    _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
  code = _args[0], args = _args[1];

  //args default
  if (typeof args === "undefined" || args === null) {
    args = [];
  }

  this._jsonWireCall({
    method: 'POST'
    , relPath: '/execute'
    , cb: this._callbackWithData(cb)
    , data: {script: safeExecuteJsScript, args: [code, args]}
  });
}

/**
 * executeAsync(code, args, cb) -> cb(err, result)
 * executeAsync(code, cb) -> cb(err, result)
 * args: script argument array (optional)
 *  
 * @jsonWire POST /session/:sessionId/execute_async
 */ 
webdriver.prototype.executeAsync = function(code,args,cb) {
  // parsing arguments (code,args,cb) with optional args
  var _args, _i;
  _args = 2 <= arguments.length ? __slice.call(arguments, 0,
    _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
  code = _args[0], args = _args[1];

  //args default
  if (typeof args === "undefined" || args === null) {
    args = [];
  }

  this._jsonWireCall({
    method: 'POST'
    , relPath: '/execute_async'
    , cb: this._callbackWithData(cb)
    , data: {script: code, args: args}
  });
}

// script to be executed in browser
var safeExecuteAsyncJsScript = fs.readFileSync( __dirname + "/../browser-scripts/safe-execute-async.js", 'utf8');

/**
 * Execute async script using eval(code): 
 * safeExecuteAsync(code, args, cb) -> cb(err, result)
 * safeExecuteAsync(code, cb) -> cb(err, result)
 * args: script argument array (optional)
 * 
 * @jsonWire POST /session/:sessionId/execute_async
 */ 
webdriver.prototype.safeExecuteAsync = function(code,args,cb) {
  // parsing arguments (code,args,cb) with optional args
  var _args, _i;
  _args = 2 <= arguments.length ? __slice.call(arguments, 0,
    _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
  code = _args[0], args = _args[1];

  //args default
  if (typeof args === "undefined" || args === null) {
    args = [];
  }

  this._jsonWireCall({
    method: 'POST'
    , relPath: '/execute_async'
    , cb: this._callbackWithData(cb)
    , data: {script: safeExecuteAsyncJsScript , args: [code, args]}
  });
}

/**
 * get(url,cb) -> cb(err)
 * Get a new url.
 *
 * @jsonWire POST /session/:sessionId/url
 */
webdriver.prototype.get = function(url, cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/url'
    , data: {'url': url}
    , cb: this._simpleCallback(cb)
  });
}

/**
 * refresh(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/refresh
 */
webdriver.prototype.refresh = function(cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/refresh'
    , cb: this._simpleCallback(cb)
  });
}

/**
 * forward(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/forward
 */
webdriver.prototype.forward = function(cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/forward'
    , cb: this._simpleCallback(cb)
  });
}

/**
 * back(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/back
 */
webdriver.prototype.back = function(cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/back'
    , cb: this._simpleCallback(cb)
  });
}


/**
 * setImplicitWaitTimeout(ms, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/timeouts/implicit_wait
 */
webdriver.prototype.setImplicitWaitTimeout = function(ms, cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/timeouts/implicit_wait'
    , data: {ms: ms}
    , cb: this._simpleCallback(cb)
  });
}

// for backward compatibility
webdriver.prototype.setWaitTimeout = webdriver.prototype.setImplicitWaitTimeout;

/**
 * setAsyncScriptTimeout(ms, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/timeouts/async_script
 */
webdriver.prototype.setAsyncScriptTimeout = function(ms, cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/timeouts/async_script'
    , data: {ms: ms}
    , cb: this._simpleCallback(cb)
  });
}

/**
 * setPageLoadTimeout(ms, cb) -> cb(err)
 * (use setImplicitWaitTimeout and setAsyncScriptTimeout to set the other timeouts)
 *
 * @jsonWire POST /session/:sessionId/timeouts
 */
webdriver.prototype.setPageLoadTimeout = function(ms, cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/timeouts'
    , data: {type: 'page load', ms: ms}
    , cb: this._simpleCallback(cb)
  });
}

/**
 * element(using, value, cb) -> cb(err, element)
 *
 * @jsonWire POST /session/:sessionId/element
 */
webdriver.prototype.element = function(using, value, cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/element'
    , data: {using: using, value: value}
    , cb: this._elementCallback(cb)
  });
}

/**
 * Retrieve an element avoiding not found exception and returning null instead: 
 * elementOrNull(using, value, cb) -> cb(err, element)
 *
 * @jsonWire POST /session/:sessionId/elements
 * @docOrder 3
 */
webdriver.prototype.elementOrNull = function(using, value, cb) {
  this.elements.apply(this, [using, value,
    function(err, elements) {
      if(err == null)
        if(elements.length>0) {cb(null,elements[0]);} else {cb(null,null);}
      else
        cb(err);
    }
  ]);
};

/**
 * Retrieve an element avoiding not found exception and returning undefined instead: 
 * elementIfExists(using, value, cb) -> cb(err, element)
 *
 * @jsonWire POST /session/:sessionId/elements
 * @docOrder 5
 */
webdriver.prototype.elementIfExists = function(using, value, cb) {
  this.elements.apply(this, [using, value,
    function(err, elements) {
      if(err == null)
        if(elements.length>0) {cb(null,elements[0]);} else {cb(null,undefined);}
      else
        cb(err);
    }
  ]);
};

/**
 * elements(using, value, cb) -> cb(err, elements)
 *
 * @jsonWire POST /session/:sessionId/elements
 * @docOrder 1
 */
webdriver.prototype.elements = function(using, value, cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/elements'
    , data: {using: using, value: value}
    , cb: this._elementsCallback(cb)
  });
}

/**
 * Check if element exists: 
 * hasElement(using, value, cb) -> cb(err, boolean)
 * 
 * @jsonWire POST /session/:sessionId/elements
 * @docOrder 7 
 */
webdriver.prototype.hasElement = function(using, value, cb){
  this.elements.apply( this, [using, value, function(err, elements){
    if(err==null)
      cb(null, elements.length > 0 )
    else
    cb(err);
  }]);
}

/**
 * waitForElement(using, value, timeout, cb) -> cb(err)
 */ 
webdriver.prototype.waitForElement = function(using, value, timeout, cb){
  var _this = this;
  var endTime = Date.now() + timeout;

  var poll = function(){
    _this.hasElement(using, value, function(err, isHere){
      if(err){
        return cb(err);
      }

      if(isHere){
        cb(null);
      } else {
        if(Date.now() > endTime){
          cb(new Error("Element didn't appear"));
        } else {
          setTimeout(poll, 200);
        }
      }
    });
  }

  poll();
}

/**
 * waitForVisible(using, value, timeout, cb) -> cb(err)
 */ 
webdriver.prototype.waitForVisible = function(using, value, timeout, cb) {
  var _this = this;
  var endTime = Date.now() + timeout;

  var poll = function(){
    _this.isVisible(using, value, function(err, visible) {
      if (err) {
        return cb(err);
      }

      if (visible) {
        cb(null);
      } else {
        if (Date.now() > endTime) {
          cb(new Error("Element didn't become visible"));
        } else {
          setTimeout(poll, 200);
        }
      }
    });
  }
  poll();
}

/**
 * takeScreenshot(cb) -> cb(err, screenshot)
 * 
 * @jsonWire GET /session/:sessionId/screenshot
 */
webdriver.prototype.takeScreenshot = function(cb) {
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/screenshot'
    , cb: this._callbackWithData(cb)
  });
}

// convert to type to something like ById, ByCssSelector, etc...
var elFuncSuffix = function(type){
  var res = (' by ' + type).replace(/(\s[a-z])/g,
    function($1){return $1.toUpperCase().replace(' ','');});
  return res.replace('Xpath', 'XPath');
};

// return correct jsonwire type
var elFuncFullType = function(type){
  if(type == 'css') {return 'css selector'} // shortcut for css
  return type;
};

// from JsonWire spec + shortcuts
var elementFuncTypes = ['class name', 'css selector','id','name','link text',
  'partial link text','tag name', 'xpath', 'css' ];

// adding all elementBy... , elementsBy... function

for (var i = 0; i < elementFuncTypes.length; i++) {

  (function() {
    var type = elementFuncTypes[i];
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
     * @jsonWire POST /session/:sessionId/element
     */
    webdriver.prototype['element' + elFuncSuffix(type)] = function(value, cb) {
      webdriver.prototype.element.apply(this, [elFuncFullType(type), value, cb]);
    };

    /**
     * elementByClassNameOrNull(value, cb) -> cb(err, element)
     * elementByCssSelectorOrNull(value, cb) -> cb(err, element)
     * elementByIdOrNull(value, cb) -> cb(err, element)
     * elementByNameOrNull(value, cb) -> cb(err, element)
     * elementByLinkTextOrNull(value, cb) -> cb(err, element)
     * elementByPartialLinkTextOrNull(value, cb) -> cb(err, element)
     * elementByTagNameOrNull(value, cb) -> cb(err, element)
     * elementByXPathOrNull(value, cb) -> cb(err, element)
     * elementByCssOrNull(value, cb) -> cb(err, element)
     *
     * @jsonWire POST /session/:sessionId/elements
     * @docOrder 4     
     */    
    webdriver.prototype['element' + elFuncSuffix(type)+ 'OrNull'] = function(value, cb) {
      webdriver.prototype.elements.apply(this, [elFuncFullType(type), value,
        function(err, elements) {
          if(err == null)
            if(elements.length>0) {cb(null,elements[0]);} else {cb(null,null);}
          else
            cb(err);
        }
      ]);
    };

    /**
     * elementByClassNameIfExists(value, cb) -> cb(err, element)
     * elementByCssSelectorIfExists(value, cb) -> cb(err, element)
     * elementByIdIfExists(value, cb) -> cb(err, element)
     * elementByNameIfExists(value, cb) -> cb(err, element)
     * elementByLinkTextIfExists(value, cb) -> cb(err, element)
     * elementByPartialLinkTextIfExists(value, cb) -> cb(err, element)
     * elementByTagNameIfExists(value, cb) -> cb(err, element)
     * elementByXPathIfExists(value, cb) -> cb(err, element)
     * elementByCssIfExists(value, cb) -> cb(err, element)
     *
     * @jsonWire POST /session/:sessionId/elements
     * @docOrder 6
     */       
    webdriver.prototype['element' + elFuncSuffix(type)+ 'IfExists'] = function(value, cb) {
      webdriver.prototype.elements.apply(this, [elFuncFullType(type), value,
        function(err, elements) {
          if(err == null)
            if(elements.length>0) {cb(null,elements[0]);} else {cb(null,undefined);}
          else
            cb(err);
        }
      ]);
    };

    /**
     * hasElementByClassName(value, cb) -> cb(err, boolean) 
     * hasElementByCssSelector(value, cb) -> cb(err, boolean) 
     * hasElementById(value, cb) -> cb(err, boolean) 
     * hasElementByName(value, cb) -> cb(err, boolean) 
     * hasElementByLinkText(value, cb) -> cb(err, boolean) 
     * hasElementByPartialLinkText(value, cb) -> cb(err, boolean) 
     * hasElementByTagName(value, cb) -> cb(err, boolean) 
     * hasElementByXPath(value, cb) -> cb(err, boolean) 
     * hasElementByCss(value, cb) -> cb(err, boolean) 
     *
     * @jsonWire POST /session/:sessionId/elements
     * @docOrder 8          
     */
    webdriver.prototype['hasElement' + elFuncSuffix(type)] = function(value, cb) {
      webdriver.prototype.hasElement.apply(this, [elFuncFullType(type), value, cb]);
    };

    /**
     * waitForElementByClassName(value, timeout, cb) -> cb(err)
     * waitForElementByCssSelector(value, timeout, cb) -> cb(err)
     * waitForElementById(value, timeout, cb) -> cb(err)
     * waitForElementByName(value, timeout, cb) -> cb(err)
     * waitForElementByLinkText(value, timeout, cb) -> cb(err)
     * waitForElementByPartialLinkText(value, timeout, cb) -> cb(err)
     * waitForElementByTagName(value, timeout, cb) -> cb(err)
     * waitForElementByXPath(value, timeout, cb) -> cb(err)
     * waitForElementByCss(value, timeout, cb) -> cb(err)
     */ 
    webdriver.prototype['waitForElement' + elFuncSuffix(type)] = function(value, timeout, cb) {
      webdriver.prototype.waitForElement.apply(this, [elFuncFullType(type), value, timeout, cb]);
    };

    /**
     * waitForVisibleByClassName(value, timeout, cb) -> cb(err)
     * waitForVisibleByCssSelector(value, timeout, cb) -> cb(err)
     * waitForVisibleById(value, timeout, cb) -> cb(err)
     * waitForVisibleByName(value, timeout, cb) -> cb(err)
     * waitForVisibleByLinkText(value, timeout, cb) -> cb(err)
     * waitForVisibleByPartialLinkText(value, timeout, cb) -> cb(err)
     * waitForVisibleByTagName(value, timeout, cb) -> cb(err)
     * waitForVisibleByXPath(value, timeout, cb) -> cb(err)
     * waitForVisibleByCss(value, timeout, cb) -> cb(err)
     */ 
    webdriver.prototype['waitForVisible' + elFuncSuffix(type)] = function(value, timeout, cb) {
      webdriver.prototype.waitForVisible.apply(this, [elFuncFullType(type), value, timeout, cb]);
    };

    /**
     * elementsByClassName(value, cb) -> cb(err, elements)      
     * elementsByCssSelector(value, cb) -> cb(err, elements)      
     * elementsById(value, cb) -> cb(err, elements)      
     * elementsByName(value, cb) -> cb(err, elements)      
     * elementsByLinkText(value, cb) -> cb(err, elements)      
     * elementsByPartialLinkText(value, cb) -> cb(err, elements)      
     * elementsByTagName(value, cb) -> cb(err, elements)      
     * elementsByXPath(value, cb) -> cb(err, elements)      
     * elementsByCss(value, cb) -> cb(err, elements)      
     *
     * @jsonWire POST /session/:sessionId/elements
     * @docOrder 2     
     */       
    webdriver.prototype['elements' + elFuncSuffix(type)] = function(value, cb) {
      webdriver.prototype.elements.apply(this, [elFuncFullType(type), value, cb]);
    };

  })();

}

/**
 * getTagName(element, cb) -> cb(err, name)
 *
 * @jsonWire GET /session/:sessionId/element/:id/name
 */
webdriver.prototype.getTagName = function(element, cb) {
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/name'
    , cb: this._callbackWithData(cb)
  });
}

/**
 * getAttribute(element, attrName, cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/attribute/:name
 * @docOrder 1
 */
webdriver.prototype.getAttribute = function(element, attrName, cb) {
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/attribute/' + attrName
    , cb: this._callbackWithData(cb)
  });
}

/**
 * isDisplayed(element, cb) -> cb(err, displayed)
 *
 * @jsonWire GET /session/:sessionId/element/:id/displayed
 */
webdriver.prototype.isDisplayed = function(element, cb) {
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/displayed'
    , cb: this._callbackWithData(cb)
  });
}

webdriver.prototype.displayed = webdriver.prototype.isDisplayed

/**
 * Get element value (in value attribute): 
 * getValue(element, cb) -> cb(err, value)
 * 
 * @jsonWire GET /session/:sessionId/element/:id/attribute/:name
 * @docOrder 3
 */
webdriver.prototype.getValue = function(element, cb) {
  this.getAttribute.apply(this, [element, 'value', cb]);
};

/**
 * clickElement(element, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/click
 */
webdriver.prototype.clickElement = function(element, cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/element/' + element + '/click'
    , cb: this._simpleCallback(cb)
  });
}

/**
 * getComputedCss(element, cssProperty , cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/css/:propertyName
 */
webdriver.prototype.getComputedCss = function(element, cssProperty, cb) {
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/css/' + cssProperty
    , cb: this._callbackWithData(cb)
  });
}

webdriver.prototype.getComputedCSS = webdriver.prototype.getComputedCss

/**
 * moveTo(element, xoffset, yoffset, cb) -> cb(err)
 * Move to element, xoffset and y offset are optional.
 * 
 * @jsonWire POST /session/:sessionId/moveto
 */
webdriver.prototype.moveTo = function(element, xoffset, yoffset, cb) {
  // parsing arguments, xoffset and y offset are optional
  var args, _i;
  element = arguments[0], args = 3 <= arguments.length ?
    __slice.call(arguments, 1, _i = arguments.length - 1) :
      (_i = 1, []), cb = arguments[_i++];
  xoffset = args[0], yoffset = args[1], args;

  this._jsonWireCall({
    method: 'POST'
    , relPath: '/moveto'
    , data: { element: element.toString(), xoffset: xoffset, yoffset: yoffset }
    , cb: this._simpleCallback(cb)
  });
}

/**
 * buttonDown(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/buttondown
 */
webdriver.prototype.buttonDown = function(cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/buttondown'
    , cb: this._simpleCallback(cb)
  });
}

/**
 * buttonUp(cb) -> cb(err)
 * 
 * @jsonWire POST /session/:sessionId/buttonup
 */
webdriver.prototype.buttonUp = function(cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/buttonup'
    , cb: this._simpleCallback(cb)
  });
}

/**
 * click(button, cb) -> cb(err)
 * Click on current element.
 * Buttons: {left: 0, middle: 1 , right: 2}
 *
 * @jsonWire POST /session/:sessionId/click
 */
webdriver.prototype.click = function(button, cb) {
  // parsing args, button optional
  var args, _i;
  args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
  button = args[0], args;

  this._jsonWireCall({
    method: 'POST'
    , relPath: '/click'
    , data: {button: button}
    , cb: this._simpleCallback(cb)
  });
}

/**
 * doubleclick(cb) -> cb(err) 
 *
 * @jsonWire POST /session/:sessionId/doubleclick
 */
webdriver.prototype.doubleclick = function(cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/doubleclick'
    , cb: this._simpleCallback(cb)
  });
}

/**
 * type(element, keys, cb) -> cb(err)
 * Type keys (all keys are up at the end of command).
 * special key map: wd.SPECIAL_KEYS (see lib/special-keys.js)
 *
 * @jsonWire POST /session/:sessionId/element/:id/value
 */
webdriver.prototype.type = function(element, keys, cb) {
  if (!(keys instanceof Array)) {keys = [keys];}
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/element/' + element + '/value'
    , data: {value: keys}
    , cb: this._simpleCallback(cb)
  });
}

/**
 * keys(keys, cb) -> cb(err)
 * Press keys (keys may still be down at the end of command).
 * special key map: wd.SPECIAL_KEYS (see lib/special-keys.js)
 *
 * @jsonWire POST /session/:sessionId/keys
 */
webdriver.prototype.keys = function(keys, cb) {
  if (!(keys instanceof Array)) {keys = [keys];}
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/keys'
    , data: {value: keys}
    , cb: this._simpleCallback(cb)
  });
}

/**
 * clear(element, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/clear
 */
webdriver.prototype.clear = function(element, cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/element/' + element + '/clear'
    , cb: this._simpleCallback(cb)
  });
}

/**
 * title(cb) -> cb(err, title)
 *
 * @jsonWire GET /session/:sessionId/title
 */
webdriver.prototype.title = function(cb) {
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/title'
    , cb: this._callbackWithData(cb)
  });
}

// element must be specified
webdriver.prototype._rawText = function(element, cb) {
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/text'
    , cb: this._callbackWithData(cb)
  });
}

/**
 * text(element, cb) -> cb(err, text)
 * element: specific element, 'body', or undefined
 * 
 * @jsonWire GET /session/:sessionId/element/:id/text
 * @docOrder 1
 */
webdriver.prototype.text = function(element, cb) {
  var _this = this;
  if (typeof element === 'undefined' || element == 'body' || element === null) {
    _this.element.apply(this, ['tag name', 'body', function(err, bodyEl) {
      if (err == null) {_this._rawText.apply(_this, [bodyEl, cb]);} else {cb(err);}
    }]);
  }else {
    _this._rawText.apply(_this, [element, cb]);
  }
};

/**
 * Check if text is present: 
 * textPresent(searchText, element, cb) -> cb(err, boolean)
 * element: specific element, 'body', or undefined
 *  
 * @jsonWire GET /session/:sessionId/element/:id/text
 * @docOrder 3 
 */
webdriver.prototype.textPresent = function(searchText, element, cb) {
  this.text.apply(this, [element, function(err, text) {
    if (err) {
      cb(err, null);
    } else {
      cb(err, text.indexOf(searchText) >= 0);
    }
  }]);
};

/**
 * acceptAlert(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/accept_alert
 */
webdriver.prototype.acceptAlert = function(cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/accept_alert'
    , cb: this._simpleCallback(cb)
  });
}

/**
 * dismissAlert(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/dismiss_alert
 */
webdriver.prototype.dismissAlert = function(cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/dismiss_alert'
    , cb: this._simpleCallback(cb)
  });
}

/**
 * active(cb) -> cb(err, element)
 *
 * @jsonWire POST /session/:sessionId/element/active
 */
webdriver.prototype.active = function(cb) {
  var _this = this;
  var cbWrap = function(e, o) {
    var el = new element(o['ELEMENT'], _this);
    cb(null, el)
  };
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/element/active'
    , cb: this._callbackWithData(cbWrap)
  });
}

/**
 * url(cb) -> cb(err, url)
 *
 * @jsonWire GET /session/:sessionId/url
 */
webdriver.prototype.url = function(cb) {
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/url'
    , cb: this._callbackWithData(cb)
  });
}

/**
 * allCookies() -> cb(err, cookies)
 *
 * @jsonWire GET /session/:sessionId/cookie
 */
webdriver.prototype.allCookies = function(cb) {
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/cookie'
    , cb: this._callbackWithData(cb)
  });
}

/**
 * setCookie(cookie, cb) -> cb(err)
 * cookie example:  
 *  {name:'fruit', value:'apple'}
 * Optional cookie fields: 
 *  path, domain, secure, expiry
 *
 * @jsonWire POST /session/:sessionId/cookie
 */
webdriver.prototype.setCookie = function(cookie, cb) {
  // setting secure otherwise selenium server throws
  if ((typeof cookie !== 'undefined' && cookie !== null) &&
    !((typeof cookie !== 'undefined' &&
    cookie !== null ? cookie.secure : void 0) != null)) {
    cookie.secure = false;
  }
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/cookie'
    , data: { cookie: cookie }
    , cb: this._simpleCallback(cb)
  });
}

/**
 * deleteAllCookies(cb) -> cb(err)
 *
 * @jsonWire DELETE /session/:sessionId/cookie
 */
webdriver.prototype.deleteAllCookies = function(cb) {
  this._jsonWireCall({
    method: 'DELETE'
    , relPath: '/cookie'
    , cb: this._simpleCallback(cb)
  });
}

/**
 * deleteCookie(name, cb) -> cb(err)
 *
 * @jsonWire DELETE /session/:sessionId/cookie/:name
 */
webdriver.prototype.deleteCookie = function(name, cb) {
  this._jsonWireCall({
    method: 'DELETE'
    , relPath: '/cookie/' + encodeURIComponent(name)
    , cb: this._simpleCallback(cb)
  });
}

var _isVisible1 = function(element , cb){
  this.getComputedCSS(element, "display", function(err, display){
    if(err){
      return cb(err);
    }

    cb(null, display !== "none");
  });
}

// deprecated 
var _isVisible2 = function(queryType, querySelector, cb){
  this.elementIfExists(queryType, querySelector, function(err, element){
    if(err){
      return cb(err);
    }

    if(element == null){
      return cb(null, false);
    }
    element.isVisible(cb);
  });
}

/**
 * isVisible(element , cb) -> cb(err, boolean)
 * deprecated: isVisible(queryType, querySelector, cb) -> cb(err, boolean)
 */
webdriver.prototype.isVisible = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (args.length <= 2) {
    return _isVisible1.apply(this, args);
  } else {
    return _isVisible2.apply(this, args);
  }
};

// waitForCondition recursive implementation
webdriver.prototype._waitForConditionImpl = function(conditionExpr, limit, poll, cb) {
  var _this = this;

  // timeout check
  if (Date.now() < limit) {
    // condition check
    _this.safeEval.apply( _this , [conditionExpr, function(err, res) {
      if(err != null) {return cb(err);}
      if (res == true) {
        // condition ok
        return cb(null, true);
      } else {
        // wait for poll and try again
        setTimeout(function() {
          _this._waitForConditionImpl.apply(_this, [conditionExpr, limit, poll, cb]);
        }, poll);
      }
    }]);
  } else {
    // try one last time
    _this.safeEval.apply( _this, [conditionExpr, function(err, res) {
      if(err != null) {return cb(err);}
      if (res == true) {
        return cb(null, true);
      } else {
        // condition nok within timeout
        return cb("waitForCondition failure for: " + conditionExpr);
      }
    }]);
  }
};

/**
 * Waits for JavaScript condition to be true (polling within wd client): 
 * waitForCondition(conditionExpr, timeout, pollFreq, cb) -> cb(err, boolean)
 * waitForCondition(conditionExpr, timeout, cb) -> cb(err, boolean)
 * waitForCondition(conditionExpr, cb) -> cb(err, boolean)
 * conditionExpr: condition expression, should return a boolean
 * timeout: timeout (optional, default: 1000) 
 * pollFreq: pooling frequency (optional, default: 100)
 * return true if condition satisfied, error otherwise. 
 */
webdriver.prototype.waitForCondition = function() {
  var _this = this;

  // parsing args
  var args, cb, conditionExpr, limit, poll, timeout, _i;
  args = 2 <= arguments.length ? __slice.call(arguments, 0,
    _i = arguments.length - 1) : (_i = 0, []),
      cb = arguments[_i++];
  conditionExpr = args[0], timeout = args[1], poll = args[2];

  //defaults
  timeout = timeout || 1000;
  poll = poll || 100;

  // calling implementation
  limit = Date.now() + timeout;
  _this._waitForConditionImpl.apply(this, [conditionExpr, limit, poll, cb]);
};

// script to be executed in browser
webdriver.prototype._waitForConditionInBrowserJsScript = fs.readFileSync( __dirname + "/../browser-scripts/wait-for-cond-in-browser.js", 'utf8');

/**
 * Waits for JavaScript condition to be true (async script polling within browser): 
 * waitForConditionInBrowser(conditionExpr, timeout, pollFreq, cb) -> cb(err, boolean)
 * waitForConditionInBrowser(conditionExpr, timeout, cb) -> cb(err, boolean)
 * waitForConditionInBrowser(conditionExpr, cb) -> cb(err, boolean)
 * conditionExpr: condition expression, should return a boolean
 * timeout: timeout (optional, default: 1000) 
 * pollFreq: pooling frequency (optional, default: 100)
 * return true if condition satisfied, error otherwise. 
 */
webdriver.prototype.waitForConditionInBrowser = function() {
  var _this = this;
  // parsing args
  var args, cb, conditionExpr, limit, poll, timeout, _i;
  args = 2 <= arguments.length ? __slice.call(arguments, 0,
    _i = arguments.length - 1) : (_i = 0, []),
      cb = arguments[_i++];
  conditionExpr = args[0], timeout = args[1], poll = args[2];

  //defaults
  timeout = timeout || 1000;
  poll = poll || 100;

  // calling script
  _this.safeExecuteAsync.apply( _this, [_this._waitForConditionInBrowserJsScript,
    [conditionExpr,timeout,poll], function(err,res) {
      if(err != null) {return cb(err);}
      if(res != true) {return cb("waitForConditionInBrowser failure for: " + conditionExpr);}
      cb(null, res);
    }
  ]);
};

