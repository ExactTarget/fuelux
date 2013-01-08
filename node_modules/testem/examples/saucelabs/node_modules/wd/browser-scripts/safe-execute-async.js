var code = arguments[0], args = arguments[1], done = arguments[2];
var wrap = function() {
  return eval(code);
};

args.push(done);
return wrap.apply(this, args);
