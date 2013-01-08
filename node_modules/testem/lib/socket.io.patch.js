/*

socket.io.patch.js
==================

A monkey patch to set the log level before the Socket.IO manager is created
so that we don't get any log messages at all from Socket.IO.

*/
require('socket.io').Manager.prototype.get = function (key) {
    if (key === 'log level')
        return 0
    return this.settings[key]
}