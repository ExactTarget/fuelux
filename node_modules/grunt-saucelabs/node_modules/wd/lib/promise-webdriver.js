var webdriver = require('./webdriver')
  , Q = require('q')
  , element = require('./element').element
  , slice = Array.prototype.slice.call.bind(Array.prototype.slice);

var copyFunctions = function(newObj, originalObj, wrapMatching) {
    // copy all the public functions on the webdriver prototype
    for (var prop in originalObj.prototype) {
        var fn = originalObj.prototype[prop];

        // wrap only elements matching wrapMatching if it is provided
        if (wrapMatching &&  prop.indexOf(wrapMatching) === -1) {
            continue;
        }
        // ordered per performance on
        // http://jsperf.com/compare-typeof-indexof-hasownproperty
        if (typeof fn === 'function' &&
            prop !== 'chain' &&
            prop !== 'toString' &&
            prop.indexOf('_') !== 0 &&
            originalObj.prototype.hasOwnProperty(prop)
        ) {
            newObj.prototype[prop] = wrap(fn);
        }
    }
};

// promisify element shortcuts too
var promiseElement = function() {
    return element.apply(this, arguments);
};
promiseElement.prototype = Object.create(element.prototype);

var promiseWebdriver = module.exports = function() {
    // inject promisified element
    arguments[0].element = promiseElement;
    return webdriver.apply(this, arguments);
};

promiseWebdriver.prototype = Object.create(webdriver.prototype);

copyFunctions(promiseWebdriver, webdriver);

// in element promisifiing only methods with element in the name
// (other methods should already return promises)
copyFunctions(promiseElement, element, 'element');

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
