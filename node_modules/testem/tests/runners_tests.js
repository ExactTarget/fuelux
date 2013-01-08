var runners = require('../lib/runners')
var BrowserRunner = runners.BrowserRunner
var ProcessRunner = runners.ProcessRunner
var test = require('./testutils.js')
var spy = require('sinon').spy
var stub = require('sinon').stub
var EventEmitter = require('events').EventEmitter
var expect = test.expect
var BufferStream = require('bufferstream')

describe('BrowserRunner', function(){
    var socket, app, runner, server
    beforeEach(function(){
        socket = new EventEmitter
        server = {
            emit: test.spy()
            , cleanUpConnections: test.spy()
            , removeBrowser: test.spy()
        }
        app = {
            emit: test.spy()
            , server: server
        }
        runner = new BrowserRunner({
            name: 'Chrome 19.0'
            , socket: socket
            , app: app
        })
    })
    it('can create', function(){
        expect(runner.get('socket')).to.equal(socket)
        expect(runner.get('app')).to.equal(app)
    })
    describe('reset Test Results', function(){
        it('resets topLevelError', function(){
            var results = runner.get('results')
            results.set('topLevelError', 'blah')
            results.reset()
            expect(results.get('topLevelError')).to.equal(null)
        })
        it('resets results', function(){
            var results = runner.get('results')
            results.addResult({
                failed: false
                , passed: true
            })
            results.reset()
            expect(results.get('total')).to.equal(0)
            expect(results.get('passed')).to.equal(0)
        })
    })
    it('emits start-tests and resets when startTests', function(){
        var results = runner.get('results')
        test.spy(results, 'reset')
        test.spy(socket, 'emit')
        runner.startTests()
        expect(results.reset.callCount).to.equal(1)
        expect(socket.emit.calledWith('start-tests')).to.be.ok
        results.reset.restore()
        socket.emit.restore()
    })
    it('sets topLevelError when error emitted', function(){
        socket.emit('top-level-error', 'TypeError: bad news', 'http://test.com/bad.js', 45)
        expect(runner.get('messages').at(0).get('text')).to.equal('TypeError: bad news at http://test.com/bad.js, line 45\n')
    })
    it('emits tests-start on server on tests-start', function(){
        test.spy(runner, 'trigger')
        socket.emit('tests-start')
        expect(runner.trigger.calledWith('tests-start')).to.be.ok
        runner.trigger.restore()
    })
    it('updates results on test-result', function(){
        var results = runner.get('results')
        socket.emit('test-result', {failed: 1})
        expect(results.get('passed')).to.equal(0)
        expect(results.get('failed')).to.equal(1)
        socket.emit('test-result', {failed: 0})
        expect(results.get('passed')).to.equal(1)
        expect(results.get('tests').length).to.equal(2)
    })
    it('sets "all" on all-tests-results', function(){
        socket.emit('all-test-results')
        expect(runner.get('results').get('all')).to.be.ok
    })
    it('emits all-test-results on server on all-tests-results', function(){
        socket.emit('all-test-results')
        expect(app.emit.calledWith('all-test-results', runner.get('results'), runner))
            .to.be.ok
    })
    it('removes self from server if disconnect', function(){
        socket.emit('disconnect')
        expect(server.removeBrowser.calledWith(runner))
    })
})

describe('ProcessRunner', function(){
    var runner
    var onStdoutData
    var onStderrData
    var launcher
    var settings
    var process

    describe('bare process', function(){

        beforeEach(function(){
            settings = { protocol: 'process' }
            process = {
                on: function(){}
                , stdout: {
                    on: function(evt, cb){
                        if (evt === 'data')
                            onStdoutData = cb
                    }
                }
                , stderr: {
                    on: function(evt, cb){
                        if (evt === 'data')
                            onStderrData = cb
                    }
                }
            }
            launcher = {
                settings: settings
                , process: process
                , launch: function(cb){
                    cb(process)
                }
            }
            runner = new ProcessRunner({
                app: {}
                , launcher: launcher
            })
        })
        it('should instantiate', function(){
        })
        it('should return whether is tap', function(){
            settings.protocol = 'tap'
            expect(runner.isTap()).to.be.ok
            delete settings.protocol
            expect(runner.isTap()).not.to.be.ok
        })
        it('should have results if tap', function(){
            stub(runner, 'isTap').returns(true)
            expect(runner.hasResults()).to.be.ok
            runner.isTap.returns(false)
            expect(runner.hasResults()).not.to.be.ok
        })
        it('initially has 0 messages', function(){
            expect(runner.get('messages').length).to.equal(0)
        })
        it('hasMessages if messages has length > 0', function(){
            expect(runner.hasMessages()).not.to.be.ok
            runner.get('messages').push({})
            expect(runner.hasMessages()).to.be.ok
        })
        it('reads stdout into messages', function(){
            onStdoutData('foobar')
            expect(runner.get('messages').length).to.equal(1)
            var message = runner.get('messages').at(0)
            expect(message.get('type')).to.equal('log')
            expect(message.get('text')).to.equal('foobar')
        })
        it('reads stderr into messages', function(){
            onStderrData('foobar')
            expect(runner.get('messages').length).to.equal(1)
            var message = runner.get('messages').at(0)
            expect(message.get('type')).to.equal('error')
            expect(message.get('text')).to.equal('foobar')
        })
        it('should have results object be undefined', function(){
            expect(runner.get('results')).to.equal(null)
        })
    })

    describe('tap', function(){
        var stdout
        beforeEach(function(){
            settings = { protocol: 'tap' }
            stdout = new BufferStream([{encoding:'utf8', size:'none'}])
            process = {
                on: function(){}
                , stdout: stdout
                , stderr: {
                    on: function(evt, cb){
                        if (evt === 'data')
                            onStderrData = cb
                    }
                }
            }
            launcher = {
                settings: settings
                , process: process
                , launch: function(cb){
                    cb(process)
                }
                , kill: function(){}
            }
            runner = new ProcessRunner({
                app: {emit: function(){}}
                , launcher: launcher
            })
        })
        it('should have a results object', function(){
            expect(runner.get('results')).not.to.equal(null)
        })
        it('reads tap into testresult object', function(){
            settings.protocol = 'tap'
            var tapOutput = '1..1\nok 1 foobar that'
            stdout.end(tapOutput)
            var results = runner.get('results')
            var total = results.get('total')
            var pass = results.get('passed')
            var fail = results.get('failed')
            expect(pass).to.equal(1)
            expect(total).to.equal(1)
            expect(fail).to.equal(0)
        })


    })

})