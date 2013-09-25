var args = Array.prototype.slice.call(arguments, 0);
var condExpr = args[0], timeout = args[1], 
    poll = args[2], cb = args[3];

// recursive implementation
var waitForConditionImpl = function(conditionExpr, limit, poll, cb) {
  
  // timeout check
  if (Date.now() < limit) {
    // condition check
    var res = eval(conditionExpr);
    if (res === true ) {
      // condition ok
      cb(res);
    } else {        
      // wait for poll and try again
      setTimeout(function() {
        waitForConditionImpl(conditionExpr, limit, poll, cb);
      }, poll);        
    }      
  } else {
    // try one last time
    res = eval(conditionExpr);
    return cb(res);
  }
};

// calling impl
var limit = Date.now() + timeout;  
waitForConditionImpl(condExpr, limit, poll, cb);
