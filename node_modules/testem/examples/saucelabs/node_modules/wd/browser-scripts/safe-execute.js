var code = arguments[0], args = arguments[1];

var wrap = function() {
  return eval(code);
}

return wrap.apply(this, args);
