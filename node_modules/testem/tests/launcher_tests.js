var Launcher = require('../lib/launcher')
var template = require('../lib/strutils').template
var expect = require('chai').expect
var stub = require('sinon').stub
var spy = require('sinon').spy

describe('Launcher', function(){
    var settings, app, launcher

    function createMockApp() {
        return {
            url: 'http://blah.com',
            port: '7357',
            template: function(str) {
                return template(str, {
                    url: this.url,
                    port: this.port
                })
            }
        }
    }

    describe('via command', function(){
        beforeEach(function(){
            settings = {command: 'echo hello'}
            app = createMockApp()
            launcher = new Launcher('say hello', settings, app)
        })
        it('should instantiate', function(){
            expect(launcher.name).to.equal('say hello')
            expect(launcher.settings).to.equal(settings)
        })
        it('should launch something, and also kill it', function(done){
            launcher.launch()
            var data = ''
            launcher.process.stdout.on('data', function(chunk){
                data += String(chunk)
            })
            setTimeout(function(){
                expect(data).to.equal('hello\n')
                launcher.kill('SIGKILL', function(){
                    done()
                })
            }, 10)
        })
        it('should be process iff protocol is not browser', function(){
            settings.protocol = 'browser'
            expect(launcher.isProcess()).not.to.be.ok
            settings.protocol = 'tap'
            expect(launcher.isProcess()).to.be.ok
            delete settings.protocol
            expect(launcher.isProcess()).to.be.ok
        })
        it('should launch if not a process and started', function(){
            stub(launcher, 'isProcess').returns(false)
            spy(launcher, 'launch')
            launcher.start()
            expect(launcher.launch.called).to.be.ok
        })
        it('should add new ProcessRunner if start() and is process', function(){
            stub(launcher, 'isProcess').returns(true)
            var push = spy()
            app.runners = { push: push }
            launcher.start()
            var runner = push.args[0][0]
            expect(runner.get('app')).to.equal(app)
            expect(runner.get('launcher')).to.equal(launcher)
        })
    })

    describe('via exe', function(){
        it('sholud launch and also kill it', function(done){
            settings = {exe: 'echo', args: ['hello']}
            app = createMockApp()
            launcher = new Launcher('say hello', settings, app)
            launcher.launch()
            var data = ''
            launcher.process.stdout.on('data', function(chunk){
                data += String(chunk)
            })
            setTimeout(function(){
                expect(data).to.equal('hello http://blah.com\n')
                launcher.kill('SIGKILL', function(){
                    done()
                })
            }, 10)
        })
    })
})
