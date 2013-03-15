(function() {
  function objectToSpecIt(expectation, args) {
    var args = $.makeArray(args),
        matcherAndArgs = [args.shift()];
    $.each(args, function(i, item) { matcherAndArgs.push(item); });
    return SpecIt.expectations(this)[expectation].apply(this, matcherAndArgs);
  }

  function nativeShould()    { return objectToSpecIt.call(this, "should", arguments); }
  function nativeShouldNot() { return objectToSpecIt.call(this, "shouldNot", arguments); }

  String.prototype.  should    = nativeShould;
  Array.prototype.   should    = nativeShould;
  Function.prototype.should    = nativeShould;
  Number.prototype.  should    = nativeShould;
  $.fn.              should    = nativeShould;
  String.prototype.  shouldNot = nativeShouldNot;
  Array.prototype.   shouldNot = nativeShouldNot;
  Function.prototype.shouldNot = nativeShouldNot;
  Number.prototype.  shouldNot = nativeShouldNot;
  $.fn.              shouldNot = nativeShouldNot;
})();

var SpecIt = {
  currentExpectation: 'should',
  describe: function(description, body) { module(description); body(); },
  it: function(description, body)       { test(description, body); },
  asyncIt: function(description, body)  { asyncTest(description, body); },
  expectations: function(current) {
    var basicExpectation = function(expectation, args) {
      var args = $.makeArray(args),
          matcher = args.shift();
      SpecIt.currentExpectation = expectation;
      matcher.apply(current, args);
    };

    return {
      should:    function() { return basicExpectation("should", arguments); },
      shouldNot: function() { return basicExpectation("shouldNot", arguments); }
    }
  },
  matchers: {
    include: function() {
      var args = $.makeArray(arguments),
          expectation = true,
          current = this;

      $.each(args, function(i, item) {
        if(current.indexOf(item) < 0) { expectation = false; }
      });

      if(SpecIt.currentExpectation === 'should') {
        ok(expectation,
           "Expected " + this + " to include " + args);
      } else {
        ok(!expectation,
           "Expected " + this + " to not include " + args);
      }
    },
    eql: function() {
      if(SpecIt.currentExpectation === 'should') {
        same(this,
               arguments[0],
               "Expected " + this + " to equal " + arguments[0]);
      } else {
        notEqual(this,
                 arguments[0],
                 "Expected " + this + " to not equal " + arguments[0]);
      }
    },
    beOnPage: function() {
      var timesCalled = arguments[0];

      if(SpecIt.currentExpectation === 'should') {
        ok(timesCalled ? this.length == timesCalled : this.length > 0,
           this.selector + " should be on the page");
      } else {
        ok(this.length === 0,
           this.selector + " should not be on the page");
      }
    }
  }
};

// set up window methods for it, describe, matchers
(function() {
  for(var matcher in SpecIt.matchers) {
    window[matcher] = SpecIt.matchers[matcher];
  }

  window.describe = SpecIt.describe;
  window.it       = SpecIt.it;
  window.asyncIt  = SpecIt.asyncIt;
})();
