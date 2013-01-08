var Server = require('../lib/server')
var Config = require('../lib/config')
var test = require('./testutils.js')
var EventEmitter = require('events').EventEmitter
var Backbone = require('backbone')
var request = require('request')
var jsdom = require('jsdom')
var fs = require('fs')
var path = require('path')

var expect = test.expect

describe('Server', function(){
	var server, runners, app, socketClient, config
	var orgSetTimeout, baseUrl, port
	before(function(done){
        port = 73571
        config = new Config('dev', {
            port: port,
            src_files: [
                'web/hello.js',
                'web/hello_tests.js'
            ]
        })
        baseUrl = 'http://localhost:' + port + '/'
		runners = new Backbone.Collection

		app = {config: config, runners: runners, removeBrowser: function(){}}
		server = new Server(app)
        server.start()
        server.once('server-start', function(){
            done()
        })
		socketClient = new EventEmitter
	})
    after(function(done){
        server.stop(function(){
            done()
        })
    })

    it('gets home page', function(done){
        var port = config.get('port')
        jsdom.env(baseUrl, function(err, window){
            var document = window.document
            expect(window.document.title).to.equal('Test\'em Runner')
            var scripts = document.getElementsByTagName('script')
            var srcs = Array.prototype.map.call(scripts, function(s){ return s.src })
            expect(srcs).to.deep.equal([ 
                '/testem/jasmine.js',
                '/testem.js',
                '/testem/jasmine-html.js',
                '',
                'web/hello.js',
                'web/hello_tests.js' ])
            done()
        })
    })

    function assertUrlReturnsFileContents(url, file, done){
        request(url, function(err, req, text){
            expect(text).to.equal(fs.readFileSync(file).toString())
            done()
        })
    }

    it('gets src file', function(done){
        assertUrlReturnsFileContents(baseUrl + 'web/hello.js', 'web/hello.js', done)
    })

    it('gets bundled files', function(done){
        assertUrlReturnsFileContents(baseUrl + 'testem/jasmine.js', '../public/testem/jasmine.js', done)
    })

    it('serves custom test page', function(done){
        config.set('test_page', 'web/tests.html')
        assertUrlReturnsFileContents(baseUrl, 'web/tests.html', done)
    })

    it('renders custom test page as template', function(done){
        config.set('test_page', 'web/tests_template.html')
        request(baseUrl, function(err, req, text){
            expect(text).to.equal(
                [
                '<!doctype html>'
                , '<html>'
                , '<head>'
                , '        <script src="web/hello.js"></script>'
                , '        <script src="web/hello_tests.js"></script>'
                , '    </head>'
                ].join('\n'))
            done()
        })
    })

    describe('routes', function(){
        beforeEach(function(){
            config.set('routes', {
                '/index.html': 'web/tests.html'
                , '/www': 'web'
                , '/': 'web/tests.html'
                , '/config.js': path.join(__dirname, '../lib/config.js')
            })
        })
        it('routes file path', function(done){
            assertUrlReturnsFileContents(baseUrl + 'index.html', 'web/tests.html', done)
        })
        it('routes dir path', function(done){
            assertUrlReturnsFileContents(baseUrl + 'www/hello.js', 'web/hello.js', done)
        })
        it('route base path', function(done){
            assertUrlReturnsFileContents(baseUrl, 'web/tests.html', done)
        })
        it('can route files in parent directory', function(done){
            assertUrlReturnsFileContents(baseUrl + 'config.js', '../lib/config.js', done)
        })
    })
    
})