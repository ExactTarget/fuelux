/*
var appview = require('../lib/appview.js')
  , test = require('./testutils.js')
  , EventEmitter = require('events').EventEmitter
  , expect = test.expect
  , async = require('async')
  , Backbone = require('backbone')

describe('RunnerTab', function(){
	var tab, runner, app, position, write, results, tests
	beforeEach(function(){
		app = new Backbone.Model()
		runner = new Backbone.Model({
			results: results = new Backbone.Model({
				tests: tests = new Backbone.Collection
			})
		})
		appview.View.prototype.charm = {
			position: function(){return this}
			, write: function(){return this}
			, foreground: function(){return this}
			, display: function(){return this}
		}
		tab = new appview.RunnerTab({
			runner: runner
			, index: 0
			, appview: app
		})
	})
	it('should be unselected', function(){
		expect(tab.get('selected')).to.not.be.ok
	})
	it('should render unselected if unselected', function(){
		test.spy(tab, 'renderUnselected')
		test.spy(tab, 'renderSelected')
		tab.renderTab()
		expect(tab.renderUnselected.callCount).to.equal(1)
		expect(tab.renderSelected.callCount).to.equal(0)
	})
	it('should render selected if selected', function(){
		test.spy(tab, 'renderUnselected')
		test.spy(tab, 'renderSelected')
		tab.set('selected', true, {silent: true})
		tab.renderTab()
		expect(tab.renderUnselected.callCount).to.equal(0)
		expect(tab.renderSelected.callCount).to.equal(1)
	})
	it('should re-render tab if select changed', function(){
		test.spy(tab, 'renderTab')
		tab.set('selected', true)
		expect(tab.renderTab.callCount).to.equal(1)
	})
	it('should render runner name if runner name changed', function(){
		test.spy(tab, 'renderRunnerName')
		runner.set('name', 'IE 9.0')
		expect(tab.renderRunnerName.callCount).to.equal(1)
	})
	it('should render results if results changed', function(){
		test.spy(tab, 'renderResults')
		results.set('total', 3)
		expect(tab.renderResults.callCount).to.equal(1)
	})
})

describe('LogPanel', function(){
	var logPanel, charm, position, write, runner, av, results, tests
	beforeEach(function(){
		av = new Backbone.Model()
		runner = new Backbone.Model({
			results: results = new Backbone.Model({
				tests: tests = new Backbone.Collection
			})
		})
		appview.View.prototype.charm = {
			position: position = test.spy(function(){return this})
			, write: write = test.spy(function(){return this})
			, foreground: function(){return this}
			, display: function(){return this}
		}
		logPanel = new appview.LogPanel({
			line: 6
			, col: 1
			, runner: runner
			, appview: av
		})
	})
	it('has line, col, height, width and text properties', function(){
		expect(logPanel.get('line')).to.equal(6)
		expect(logPanel.get('col')).to.equal(1)
	})
	it('re-renders on change', function(){
		test.spy(logPanel, 'render')
		logPanel.set('textLines', ['blah'])
		expect(logPanel.render.callCount).to.equal(1)
	})
})
*/