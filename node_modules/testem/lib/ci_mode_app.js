/*

ci_mode_app.js
==============

The entry point for CI mode.

*/

var yaml = require('js-yaml')
var fs = require('fs')
var Server = require('./server')
var spawn = require('child_process').spawn
var tap = require('tap')
var path = require('path')
var async = require('async')
var Backbone = require('backbone')
var Config = require('./config')
var log = require('winston')
var TestResults = require('./runners').TestResults
var BaseApp = require('./base_app')
var race = require('./race')
var _ = require('underscore')

var fileExists = fs.exists || path.exists

function App(config){
    BaseApp.call(this, config)
    var self = this
    config.getLaunchers(this, function(launchers){
        self.launchers = launchers
        self.initialize()
        self.server.once('server-start', function(){
            self.startOnStartHook(function(){
                self.begin()
            })
        })
    })
    process.on('uncaughtException', function(err){
        self.quit(err)
    })
}

App.prototype = {
    __proto__: BaseApp.prototype
    , initialize: function(){
        var config = this.config
        this.tapProducer = new tap.Producer(true)
        this.tapProducer.pipe(process.stdout)
        this.testId = 1
        this.failed = false
        this.testsStarted = false
        this.server = new Server(this)
        with(this.server){
            on('test-result', this.onTestResult.bind(this))
            //on('server-start', this.onServerStart.bind(this))
        }
        this.server.start()
    }
    , begin: function(){
        var self = this
        this.runPreprocessors(function(err, stdout, stderr, command){
            if (err){
                var name = 'before_tests hook'
                var errMsg = self.config.get('before_tests')
                var results = self.makeTestResults({
                    passed: false
                    , testName: name
                    , errMsg: errMsg
                    , stdout: stdout
                    , stderr: stderr
                })
                self.outputTap(results)
                self.quit()
            }else{
                self.runAllTheTests()
            }
        })
    }
    , makeTestResults: function(params){
        var passed = params.passed
        var testName = params.testName
        var errMsg = params.errMsg
        var runner = params.runner
        var stdout = params.stdout
        var stderr = params.stderr
        var results = new TestResults
        var errorItem = {
            passed: false
            , message: errMsg
        }
        var result = {
            passed: passed
            , failed: !passed
            , total: 1
            , id: 1
            , name: testName
            , items: [errorItem]
        }
        if (runner){
            errorItem.stdout = runner.get('messages')
                .filter(function(m){
                    return m.get('type') === 'log'
                }).map(function(m){
                    return m.get('text')
                }).join('\n')
            errorItem.stderr = runner.get('messages')
                .filter(function(m){
                    return m.get('type') === 'error'
                }).map(function(m){
                    return m.get('text')
                }).join('\n')
        }
        if (stdout) errorItem.stdout = stdout
        if (stderr) errorItem.stderr = stderr
        results.addResult(result)
        return results
    }
    , makeTestResultsForCode: function(code, launcher){
        var command = launcher.settings.command
        return this.makeTestResults({
            passed: code === 0
            , testName: '"' + command + '"'
            , errMsg: 'Exited with code ' + code
            , runner: launcher.runner
        })
    }
    , makeTestResultsForTimeout: function(timeout, launcher){
        var command = launcher.settings.command || 'Timed Out'
        var errMsg = 'Timed out ' + launcher.name + 
                        ' after waiting for ' + timeout + ' seconds'
        return this.makeTestResults({
            passed: false
            , testName: command
            , errMsg: errMsg
            , runner: launcher.runner
        })
    }
    , runAllTheTests: function(){
        var self = this
        var url = 'http://localhost:' + this.config.get('port')
        async.forEachSeries(this.launchers, function(launcher, next){
            console.log("# Launching " + launcher.name)
            process.stdout.write('# ')
            
            var processExited, gotTestResults

            function finish(){
                if (launcher.tearDown){
                    launcher.tearDown(next)
                }else{
                    next()
                }
            }
            
            race(self.getRacers(launcher), function(results, gotResults){
                if (launcher.runner){
                    launcher.runner.set('results', results)
                }
                if (!gotResults) self.emit('all-test-results', results)
                self.outputTap(results, launcher)
                launcher.kill()
                finish()
            })
            
            if (launcher.setup){
                launcher.setup(self, function(){
                    launcher.start()
                })
            }else{
                launcher.start()
            }

        }, function(){  
            self.quit()
        })
    }
    , getRacers: function(launcher){
        var self = this
        return [
            function(done){
                launcher.once('processExit', function(code){
                    var results = self.makeTestResultsForCode(code, launcher)
                    setTimeout(function(){
                        done(results)
                    }, 200)
                })
            }
            , function(done){
                self.once('all-test-results', function(results){
                    done(results, true)
                })
            }
            , function(done){
                var timeout
                if (timeout = self.config.get('timeout')){
                    setTimeout(function(){
                        var results = self.makeTestResultsForTimeout(timeout, launcher)
                        done(results)
                    }, timeout * 1000)
                }
            }
        ]
    }
    , onTestResult: function(){
        process.stdout.write('.')
    }
    , outputTap: function(results, launcher){
        var producer = this.tapProducer

        console.log() // new line
        
        results.get('tests').forEach(function(test){
            var testName = launcher ? 
                ' - ' + launcher.name + ' ' + test.get('name') :
                test.get('name')
            if (!test.get('failed')){
                producer.write({
                    id: this.testId++,
                    ok: true,
                    name: testName
                })
            }else{
                this.failed = true
                var item = test.get('items').filter(function(i){
                    return !i.passed
                })[0]

                var line = {
                    id: this.testId++
                    , ok: false
                    , name: testName
                    , message: item.message
                }
                if (item.stacktrace) line.stacktrace = item.stacktrace
                if (item.stdout) line.stdout = item.stdout
                if (item.stderr) line.stderr = item.stderr
                producer.write(line)
                
            }
        }.bind(this))

        console.log() // new line
    }
    , quit: function(err){
        var self = this
        if (this.tapProducer.writable){
            this.tapProducer.end()
        }
        this.cleanUpLaunchers(function(){
            var code = self.failed ? 1 : 0
            self.runPostprocessors(function(){
                self.runExitHook(function(){
                    if (err) console.error(err.stack)
                    process.exit(code)
                })
            })
        })
    }
}

module.exports = App