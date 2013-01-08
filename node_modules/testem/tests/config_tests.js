var Config = require('../lib/config.js')
var test = require('./testutils.js')
var EventEmitter = require('events').EventEmitter
var expect = test.expect
var spy = require('sinon').spy
var stub = require('sinon').stub
var browser_launcher = require('../lib/browser_launcher')

describe('Config', function(){
	var config, appMode, progOptions
	beforeEach(function(){
		appMode = 'dev'
		progOptions = {
			file: __dirname + '/testem.yml',
			timeout: null
		}
		config = new Config(appMode, progOptions)
	})
	it('can create', function(){
		expect(config.progOptions).to.equal(progOptions)
	})
	it('gives progOptions properties when got', function(){
		expect(config.get('file')).to.equal(progOptions.file)
	})

	describe('read yaml config file', function(){
		beforeEach(function(done){
			config.read(done)
		})
		it('gets properties from config file', function(){
			expect(config.get('framework')).to.equal('jasmine')
			expect(String(config.get('src_files'))).to.equal('implementation.js,tests.js')
		})
		it('falls back to config file value when progOptions is null', function(){
			expect(config.get('timeout')).to.equal(2)
		})
	})
	
	describe('read json config file', function(){
		var config
		beforeEach(function(done){
			var progOptions = {
				file: __dirname + '/testem.json'
			}
			config = new Config('dev', progOptions)
			config.read(done)
		})
		it('gets properties from config file', function(){
			expect(config.get('framework')).to.equal('mocha')
			expect(String(config.get('src_files'))).to.equal('impl.js,tests.js')
		})
	})

	it('give precendence to json config file', function(done){
		var config = new Config('dev', {})
		config.read(function(){
			expect(config.get('framework')).to.equal('mocha')
			done()
		})
	})

	it('returns whether isCwdMode (read js files from current dir)', function(){
		test.stub(config, 'get', function(key){
			return null
		})
		expect(config.isCwdMode()).to.be.ok
		config.get.restore()
		test.stub(config, 'get', function(key){
			if (key === 'src_files') return ['implementation.js']
			return null
		})
		expect(config.isCwdMode()).to.not.be.ok
		config.get.restore()
		test.stub(config, 'get', function(key){
			if (key === 'test_page') return 'tests.html'
			return null
		})
		expect(config.isCwdMode()).to.not.be.ok
		config.get.restore()
	})

	it('should getLaunchers should call getAvailable browsers', function(){
		stub(config, 'getWantedLaunchers', function(n){return n})
		var getAvailableBrowsers = browser_launcher.getAvailableBrowsers
		var availableBrowsers = [
			{name: 'Chrome', exe: 'chrome.exe'}
			, {name: 'Firefox'}
		]
		browser_launcher.getAvailableBrowsers = function(cb){
			cb(availableBrowsers)
		}
		var cb = spy()
		config.getLaunchers({}, cb)
		expect(cb.called).to.be.ok
		var launchers = cb.args[0][0]
		expect(launchers.chrome.name).to.equal('Chrome')
		expect(launchers.chrome.settings.exe).to.equal('chrome.exe')
		expect(launchers.firefox.name).to.equal('Firefox')
		browser_launcher.getAvailableBrowsers = getAvailableBrowsers
	})

	it('should install custom launchers', function(){
		stub(config, 'getWantedLaunchers', function(n){return n})
		var launchers = {
			Node: {
				command: 'node tests.js'
			}
		}
		config.config = {
			launchers: launchers
		}
		browser_launcher.getAvailableBrowsers = function(cb){
			cb([])
		}
		var cb = spy()
		config.getLaunchers({}, cb)
		var launchers = cb.args[0][0]
		expect(launchers.node.name).to.equal('Node')
		expect(launchers.node.settings.command).to.equal('node tests.js')
	})

	it('getWantedLaunchers uses getWantedLauncherNames', function(){
		stub(config, 'getWantedLauncherNames').returns(['Chrome', 'Firefox'])
		var results = config.getWantedLaunchers({
			chrome: { name: 'Chrome' }
			, firefox: { name: 'Firefox' }
		})
		expect(results).to.deep.equal([{ name: 'Chrome' }, { name: 'Firefox' }])
	})

	describe('getWantedLauncherNames', function(){
		it('adds "launch" param', function(){
			config.progOptions.launch = 'Chrome,Firefox'
			expect(config.getWantedLauncherNames()).to.deep.equal(['Chrome', 'Firefox'])
			config.progOptions.launch = 'IE'
			expect(config.getWantedLauncherNames()).to.deep.equal(['IE'])
		})
		it('adds "launch_in_dev" config', function(){
			config.config = {launch_in_dev: ['Chrome', 'Firefox']}
			expect(config.getWantedLauncherNames()).to.deep.equal(['Chrome', 'Firefox'])
		})
		it('adds "launch_in_ci" config', function(){
			config.appMode = 'ci'
			config.config = {launch_in_ci: ['Chrome', 'Firefox']}
			expect(config.getWantedLauncherNames()).to.deep.equal(['Chrome', 'Firefox'])
		})
		it('removes skip param', function(){
			config.progOptions.launch = 'Chrome,Firefox'
			config.progOptions.skip = 'Chrome'
			expect(config.getWantedLauncherNames()).to.deep.equal(['Firefox'])
		})
	})
})


function mockTopLevelProgOptions(){
	var options = [
		{ name: function(){ return 'timeout' } }
	]
	var commands = [
		{ name: function(){ return 'ci' } }
		, { name: function(){ return 'launchers' } }
	]
	var parentOptions = {
		port: 8081
		, options: [
			{name: function(){ return 'port' }}
			, { name: function(){ return 'launcher' } }
		]
	}
	var progOptions = {
		timeout: 2
		, parent: parentOptions
		, __proto__: parentOptions
		, options: options
		, commands: commands
		, _events: []
	}
	return progOptions
}

describe('getTemplateData', function(){
	it('should give templateData', function(done){
		var fileConfig = {
			src_files: [
				"web/*.js",
			]
		}
		var progOptions = mockTopLevelProgOptions()
		var config = new Config('dev', progOptions, fileConfig)
		config.getTemplateData(function(err, data){
			expect(data).to.deep.equal({
				timeout: 2,
				port: 8081,
				src_files: ['web/*.js'],
				serve_files: [
					'web/hello.js',
					'web/hello_tests.js'
				]
			})
			done()
		})
	})

})