/*

browserclient.js
================

Model objects (via Backbone) for a browser client (a connection to a browser + the test run session)
and the returned test results for a run of tests.

*/

var log = require('winston')
  , Backbone = require('backbone')
  , tap = require('tap')
  , extend = require('util')._extend

var TestResults = Backbone.Model.extend({
    initialize: function(){
        this.reset()
    }
    , reset: function(){
        this.set({
            topLevelError: null
            , failed: 0
            , passed: 0
            , total: 0
            , tests: new Backbone.Collection
            , all: false
        })
    }
    , addResult: function(result){
        var total = this.get('total')
          , passed = this.get('passed')
          , failed = this.get('failed')
        total++
        if (result.failed == 0)
            passed++
        else
            failed++
        this.set({
            total: total
            , passed: passed
            , failed: failed
            , items: result.items
        })
        this.get('tests').push(result)
    }
})

exports.TestResults = TestResults

var BrowserRunner = Backbone.Model.extend({
    defaults: {
        type: 'browser'
    }
    , initialize: function(){
        this.set({
            messages: new Backbone.Collection
            , results: new TestResults
        }, {silent: true})
        this.registerSocketEvents()
        this.on('change:socket', function(){
            this.previous('socket').removeAllListeners()
            this.registerSocketEvents()
        }, this)
    }
    , registerSocketEvents: function(){
        var self = this
        var results = this.get('results')
        var messages = this.get('messages')
        var socket = this.get('socket')
        var app = this.get('app')
        var server = app.server
        socket.on('top-level-error', function(msg, url, line){
            var message = msg + ' at ' + url + ', line ' + line + '\n'
            messages.push({
                type: 'error'
                , text: message
            })
        })
        socket.on('error', function(message){
            messages.push({
                type: 'error'
                , text: message + '\n'
            })
        })
        socket.on('warn', function(message){
            messages.push({
                type: 'warn'
                , text: message + '\n'
            })
        })
        socket.on('log', function(message){
            messages.push({
                type: 'log'
                , text: message + '\n'
            })
        })
        socket.on('tests-start', function(){
            self.trigger('tests-start')
        })
        socket.on('test-result', function(result){
            results.addResult(result)
            server.emit('test-result', result)
        })
        socket.on('all-test-results', function(){
            results.set('all', true)
            self.trigger('tests-end')
            app.emit('all-test-results', results, self)
        })
        socket.on('disconnect', function(){
            log.info('Client disconnected ' + self.get('name'))
            self.get('results').reset()
            self.get('messages').reset()
            self.pending = setTimeout(function(){
                app.removeBrowser(self)
            }, 1000)
        })
    }
    , startTests: function(){
        this.get('results').reset()
        this.get('socket').emit('start-tests')
    }
    , hasResults: function(){
        var results = this.get('results')
        var total = results.get('total')
        return total > 0
    }
    , hasMessages: function(){
        return this.get('messages').length > 0
    }
})

exports.BrowserRunner = BrowserRunner

var ProcessRunner = Backbone.Model.extend({
    defaults: {
        type: 'process'
    }
    , initialize: function(attrs){
        this.launcher = attrs.launcher
        this.app = attrs.app
        // Assume launcher has already launched
        this.set({
            name: this.launcher.name
            , messages: new Backbone.Collection
            , results: this.isTap() ? new TestResults : null
        })
        
        this.startTests()
    }
    , isTap: function(){
        return this.launcher.settings.protocol === 'tap'
    }
    , hasResults: function(){
        return this.isTap()
    }
    , hasMessages: function(){
        return this.get('messages').length > 0
    }
    , registerProcess: function(process){
        var settings = this.launcher.settings
        var stdout = process.stdout
        var stderr = process.stderr
        var self = this
        if (!settings.hide_stdout){
            stdout.on('data', function(data){
                self.get('messages').push({
                    type: 'log'
                    , text: '' + data
                })
            })
        }
        if (!settings.hide_stderr){
            stderr.on('data', function(data){
                self.get('messages').push({
                    type: 'error'
                    , text: '' + data
                })
            })
        }
        process.on('exit', function(code){
            self.set('allPassed', code === 0)
            self.trigger('tests-end')
        })
        if (this.isTap()){
            this.setupTapConsumer(process)
        }
    }
    , setupTapConsumer: function(process){
        var stdout = process.stdout
        this.message = null
        this.stacktrace = []
        this.tapConsumer = new tap.Consumer
        this.tapConsumer.on('data', this.onTapData.bind(this))
        this.tapConsumer.on('end', this.onTapEnd.bind(this))
        this.tapConsumer.on('bailout', this.onTapError.bind(this))
        stdout.pipe(this.tapConsumer)
    }
    , onTapData: function(data){
        if (typeof data === 'string'){
            if (this.message === null){
                this.message = data
            }else{
                this.stacktrace.push(data)
            }
            return
        }
        if (data.skip){
            return
        }
        var results = this.get('results')

        if (data.id === undefined) {
            return
        }

        var test = {
            passed: 0
            , failed: 0
            , total: 1
            , id: data.id
            , name: data.name.trim()
            , items: []
        }

        if (!data.ok) {
            var stack = data.stack

            if (!stack) {
                stack = this.stacktrace.join('\n')
            } else if (Array.isArray(stack)) {
                stack = stack.join("\n")
            } else {
                stack = JSON.stringify(stack, null, "\t")
            }
          
            test.items.push(extend(data, {
                passed: false
                , message: this.message
                , stacktrace: stack
            }))
            test.failed++
        } else {
            test.passed++
        }
        results.addResult(test)
        this.message = null
        this.stacktrace = []
    }
    , onTapError: function(){
        this.set('results', null)
    }
    , onTapEnd: function(err, testCount){
        var results = this.get('results')
        results.set('all', true)
        this.tapConsumer.removeAllListeners()
        this.tapConsumer = null
        this.app.emit('all-test-results', results)
        this.launcher.kill()
    }
    , startTests: function(){
        var self = this
        if (this.get('results')){
            this.get('results').reset()
        }else{
            this.set('results', this.isTap() ? new TestResults : null)
        }
        this.get('messages').reset([])
        this.set('allPassed', undefined)

        this.launcher.launch(function(process){
            self.registerProcess(process)
            setTimeout(function(){
                self.trigger('tests-start')
            }, 1)
        })
    }
})

exports.ProcessRunner = ProcessRunner

