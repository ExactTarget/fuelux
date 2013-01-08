var child_process = require('child_process')
var EventEmitter = require('events').EventEmitter
var log = require('winston')
var fs = require('fs')
var path = require('path')
var fileExists = fs.exists || path.exists
var async = require('async')
var ProcessRunner = require('./runners').ProcessRunner
var template = require('./strutils').template

function Launcher(name, settings, app){
    this.name = name
    this.app = app
    this.settings = settings
    this.setupDefaultSettings()
}

Launcher.prototype = {
    __proto__: EventEmitter.prototype
    , setupDefaultSettings: function(){
        var settings = this.settings
        if (settings.protocol === 'tap' && !('hide_stdout' in settings)){
            settings.hide_stdout = true
        }
    }
    , isProcess: function(){
        return this.settings.protocol !== 'browser'
    }
    , start: function(){
        if (this.isProcess()){
            var self = this
            var app = this.app
            self.runner = new ProcessRunner({
                app: app
                , launcher: self
            })
            app.runners.push(self.runner)
        }else{
            this.launch()
        }
    }
    , launch: function(cb){
        var self = this
        var app = this.app
        var url = app.url
        var settings = this.settings
        this.kill('SIGTERM', function(){
            if (settings.setup){
                settings.setup(app, function(){
                    self.doLaunch(cb)
                })
            }else{
                self.doLaunch(cb)
            }
        })

    }
    , doLaunch: function(cb){
        var app = this.app
        var url = app.url
        var settings = this.settings
        var self = this
        var options = {}
        if (settings.cwd) options.cwd = settings.cwd
        if (settings.exe){

            function spawn(exe){
                args = args.map(app.template.bind(app))
                self.process = child_process.spawn(exe, args, options)
                self.process.once('exit', self.onExit.bind(self))
                self.emit('processStarted', self.process)
                if (cb) cb(self.process)
            }

            var args = [url]
            if (settings.args instanceof Array)
                args = settings.args.concat(args)
            else if (settings.args instanceof Function)
                args = settings.args(app)

            if (Array.isArray(settings.exe)){
                async.filter(settings.exe, fileExists, function(found){
                    spawn(found[0])
                })
            }else{
                spawn(settings.exe)
            }

        }else if (settings.command){
            var cmd = app.template(settings.command)
            this.process = child_process.exec(cmd, options)
            this.process.on('exit', self.onExit.bind(self))
            self.emit('processStarted', self.process)
            if (cb) cb(self.process)
        }
    }
    , onExit: function(code){
        this.exitCode = code
        this.emit('processExit', code)
        this.process = null
    }
    , kill: function(sig, cb){
        if (!this.process){
            if(cb) cb(this.exitCode)
            return
        }
        var process = this.process
        process.stdout.removeAllListeners()
        process.stderr.removeAllListeners()
        sig = sig || 'SIGTERM'

        process.once('exit', function(){
            process.removeAllListeners()
            if (cb) cb()
        })

        process.kill(sig)
    }
}

module.exports = Launcher
