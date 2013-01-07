var getTermSize = require('../gettermsize')

function initCharm(){
    // A wrapper around charm (gives the same API) that automatically parks the cursor
    // to the bottom right corner when not in use
    var charm = function(charm){
        var timeoutID
        function parkCursor(){
            getTermSize(function(cols, lines){
                charm.position(cols, lines)
            })
        }
        function wrapFunc(func){
            return function(){
                if (timeoutID) clearTimeout(timeoutID)
                var retval = func.apply(charm, arguments)
                timeoutID = setTimeout(parkCursor, 150)
                return retval
            }
        }
        var cursorParker = {}
        for (var prop in charm){
            var value = charm[prop]
            if (typeof value === 'function'){
                cursorParker[prop] = wrapFunc(value)
            }
        }
        return cursorParker
    }(require('charm')(process))
    // allow charm.write() to take any object: just convert the passed in object to a string
    charm.write = function(charm, write){
        return function(obj){
            if (!(obj instanceof Buffer) && typeof obj !== 'string'){
                obj = String(obj)
            }
            return write.call(charm, obj)
        }
    }(charm, charm.write)
    return charm
}

require('../patchcharm.js')
module.exports = initCharm()