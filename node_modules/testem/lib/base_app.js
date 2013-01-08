var EventEmitter = require('events').EventEmitter
var Backbone = require('backbone')
var BrowserRunner = require('./runners').BrowserRunner
var exec = require('child_process').exec
var log = require('winston')
var template = require('./strutils').template
var async = require('async')

function BaseApp(config){
    var self = this
    this.config = config
    this.port = this.config.get('port')
    this.url = 'http://localhost:' + this.port
    this.runners = new Backbone.Collection
    this.templateParameters = {
        url: this.url,
        port: this.port
    }

    this
        .on('all-test-results', function () {
            var allRunnersComplete = self.runners.all(function (runner) {
                var results = runner.get('results')
                return results && !!results.get('all')
            })
            if (allRunnersComplete) {
                self.emit('all-runners-complete')
            }
        })
}
BaseApp.prototype = {
    __proto__: EventEmitter.prototype
    , runPreprocessors: function(callback){
        this.runHook('before_tests', callback)
    }
    , runPostprocessors: function(callback){
        this.runHook('after_tests', callback)
    }
    , template: function(str) {
        return template(str, this.templateParameters)
    }
    , startOnStartHook: function(callback){
        var on_start = this.config.get('on_start')
        if (on_start){
            var cmd = on_start.command ? this.template(on_start.command) : this.template(on_start)
            var waitForText = on_start.wait_for_text
            log.info('Starting on_start hook: ' + cmd, + this)
            this.onStartProcess = exec(cmd)
            this.onStartProcess.stdout.on('data', function(data){
                var text = '' + data
                if (text && text.indexOf(waitForText) !== -1){
                    if (callback) callback()
                }
            })
            if (!waitForText){
                if (callback) callback()
            }
        }else{
            if (callback) callback()
        }
    }
    , runExitHook: function (callback) {
        if(this.onStartProcess) {
            this.onStartProcess.kill('SIGTERM');
        }
        this.runHook('on_exit', callback)
    }
    , runHook: function(hook, callback){
        var self = this
        var hookCommand = this.config.get(hook)
        if (hookCommand){
            hookCommand = this.template(hookCommand)
            log.info('Running ' + hook + ' command ' + hookCommand)
            this.disableFileWatch = true
            exec(hookCommand, function(err, stdout, stderr){
                self.disableFileWatch = false
                if (callback) callback(err, stdout, stderr, hookCommand)
            })
        }else{
            if (callback) callback()
        }
    }
    , removeBrowser: function(browser){
        this.runners.remove(browser)
    }
    , connectBrowser: function(browserName, client){
        var existing = this.runners.find(function(runner){
            return runner.pending && runner.get('name') === browserName
        })
        if (existing){
            clearTimeout(existing.pending)
            existing.set('socket', client)
        }else{
            var browser = new BrowserRunner({
                name: browserName
                , socket: client
                , app: this
            })
            this.runners.push(browser)
        }
    }
    , cleanUpLaunchers: function(callback){
        if (!this.launchers){
            if (callback) callback()
            return
        }
        async.forEach(this.launchers, function(launcher, done){
            if (launcher && launcher.process){
                launcher.kill('SIGTERM', done)
            }else{
                done()
            }
        }, callback)
    }
}

module.exports = BaseApp
