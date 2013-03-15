var webdriver = require('./webdriver');
var Q = require('q');

var slice = Array.prototype.slice.call.bind(Array.prototype.slice);

var promiseWebdriver = module.exports = function() {
    return webdriver.apply(this, arguments);
};

promiseWebdriver.prototype = Object.create(webdriver.prototype);
// copy all the public functions on the webdriver prototype
for (var prop in webdriver.prototype) {
    var fn = webdriver.prototype[prop];
    // ordered per performance on
    // http://jsperf.com/compare-typeof-indexof-hasownproperty
    if (typeof fn === 'function' &&
        prop !== 'chain' &&
        prop.indexOf('_') !== 0 &&
        webdriver.prototype.hasOwnProperty(prop)
    ) {
        promiseWebdriver.prototype[prop] = wrap(fn);
    }
}

function wrap(fn) {
    return function() {
        var callback;
        var deferred = Q.defer();

        var args = slice(arguments);

        // Remove any undefined values from the end of the arguments array
        // as these interfere with our callback detection below
        for (var i = args.length - 1; i >= 0 && args[i] === undefined; i--) {
            args.pop();
        }

        // If the last argument is a function assume that it's a callback
        // (Based on the API as of 2012/12/1 this assumption is always correct)
        if (typeof args[args.length - 1] === 'function') {
            // Remove to replace it with our callback and then call it
            // appropriately when the promise is resolved or rejected
            callback = args.pop();
            deferred.promise.then(function(value) {
                callback(null, value);
            }, function(error) {
                callback(error);
            });
        }

        args.push(deferred.makeNodeResolver());
        fn.apply(this, args);

        return deferred.promise;
    };
}
