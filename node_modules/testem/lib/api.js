var log = require('winston'),
    Config = require('./config'),
    catchem = require('./catchem'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    ProcessRunner = require('./runners').ProcessRunner;

/*
    progOptions:
    file: test file
    port: 7357
    launch: list of launchers to use
    skip: list of launchers to skip
    test_page: the page to use to run tests
    timeout: timeout for a browser
    framework: test framework to use
    src_files: list of files or file patterns
*/


var EventLogger = Backbone.Model.extend({
    initialize: function(attrs){
        this.set({
            name: attrs.name
            , allPassed: true
            , messages: new Backbone.Collection()
        })
    },
    clear: function() {
        this.get('messages').reset([])
    },
    hasMessages: function() {
        var messages = this.get('messages')
        return messages.length > 0
    },
    hasResults: function() { return false; },
    addMessage: function( type, message, color ){
        var messages = this.get('messages')
        messages.push({ type: type, text: message, color: color })
    },
    startTests: function() {}
} )


catchem.on('err', function(e){
    log.error(e.message)
    log.error(e.stack)
})

var Api = function() {
    _.bindAll( this )
}

Api.prototype.setup = function(mode, dependency){
    var self = this
    var App = require(dependency)
    var config = this.config = new Config(mode, this.options)
    this.configureLogging()
    log.info("Test'em starting...")
    config.read(function() {
        self.app = new App(config)
    })
}

Api.prototype.configureLogging = function(){
    log.remove(log.transports.Console)
    if (this.config.get('debug')){
        log.add(log.transports.File, {filename: 'testem.log'})
    }
}

Api.prototype.startDev = function(options){
    this.options = options
    this.setup('dev', './dev_mode_app.js')
}

Api.prototype.restart = function() {
    this.app.startTests( function() {} )
}

Api.prototype.startCI = function(options){
    this.options = options
    this.setup('ci', './ci_mode_app.js')
}

Api.prototype.getLogger = function( name ) {
    var logger = new EventLogger({ name: name })
    return logger
}

Api.prototype.addTab = function( logger ) {
    this.app.runners.push( logger )
}

module.exports = Api