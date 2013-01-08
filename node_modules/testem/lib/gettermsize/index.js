/*

gettermsize.js
==============

This utility gets the current size of the terminal.

Example usage:

    var getTermSize = require('gettermsize')
    getTermSize(function(cols, lines){
        // You have the terminal size!
    })

*/

var lib = require('./lib')

function getTermSize(cb){
    var size = lib.getStdoutSize() || lib.getTtySize()
    if (size)
        cb.apply(null, size)
    else
        lib.getSpawnSize(cb)
}

module.exports = getTermSize
