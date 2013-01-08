var width = 100
var height = 100
var line = 0
var col = 0
var buffer = []
var foreground = null
var background = null

function initialize(){
    buffer = []
    for (var l = height; l--;){
        for (var c = width; c--;){
            buffer[l] = Array(width + 1).join(' ')
        }
    }
}
initialize()

var FakeScreen = {
    $setSize: function(w, h){
        width = w
        height = h
        initialize()
    }
    , $lines: function(start, end){
        if (end === undefined){
            end = start
            start = 0
        }
        return buffer.slice(start, end)
    }
    , foreground: function(color){
        foreground = color
        return this
    }
    , background: function(color){
        background = color
        return this
    }
    , position: function(_col, _line){
        col = _col
        line = _line - 1
        return this
    }
    , write: function(str){
        // get rid of all display codes
        str = str.replace(/\u001b\[[0-9]+m/g, '')
        
        var original = buffer[line]
        if (!original){
            throw new Error('Attempt to draw out of bounds: ' + str)
        }
        var before = original.substring(0, col)
        var after = original.substring(col + str.length)
        var result = (before + str + after)
        if (result.length > width){
            throw new Error('Attempt to draw out of bounds: ' + result)
        }
        buffer[line] = result
        col += str.length
        return this
    }
    , erase: function(){
        var original = buffer[line]
        if (!original) return this
        if (width - col + 1 > 0){
            buffer[line] = original.substring(0, col) + Array(width - col + 1).join(' ')
        }
        return this
    }
    , display: function(){
        return this
    }
}

Object.defineProperty(FakeScreen, 'buffer', {
    get: function(){
        return buffer
    }
})

module.exports = FakeScreen