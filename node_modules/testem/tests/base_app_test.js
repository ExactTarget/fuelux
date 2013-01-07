var BaseApp = require('../lib/base_app')
var expect = require('./testutils.js').expect
var spy = require('sinon').spy
var Model = require('backbone').Model

describe('BaseApp', function(){
    var app, runner1, runner2

    beforeEach(function(){
        app = new BaseApp(new Model({ port: 3000 }))

        runner1 = new Model({ results: new Model({ all: false }) })
        runner2 = new Model({ results: new Model({ all: false }) })

        app.runners.add([runner1, runner2])
    })

    it('runs the postprocessors once all runners have reported all test results', function(){
        app.runPostprocessors = spy()

        runner1.get('results').set('all', true)
        app.emit('all-test-results')
        expect(app.runPostprocessors.called).not.to.be.ok

        runner2.get('results').set('all', true)
        app.emit('all-test-results')
        expect(app.runPostprocessors.called).to.be.ok
    })

    it('runs the postprocessors at exit', function(){
        app.runExitHook = spy()

        app.emit('exit')
        expect(app.runExitHook.called).to.be.ok
    })
})