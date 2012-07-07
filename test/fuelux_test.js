/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require.config({
	baseUrl: '../src',
	paths: {
		jquery: '../lib/jquery',
		bootstrap: '../lib/bootstrap/js'
	},
	shim: {
		'bootstrap/js/bootstrap-transition': ['jquery'],
		'bootstrap/js/bootstrap-alert': ['bootstrap/js/bootstrap-transition'],
		'bootstrap/js/bootstrap-button': ['bootstrap/js/bootstrap-transition'],
		'bootstrap/js/bootstrap-carousel': ['bootstrap/js/bootstrap-transition'],
		'bootstrap/js/bootstrap-collapse': ['bootstrap/js/bootstrap-transition'],
		'bootstrap/js/bootstrap-dropdown': ['bootstrap/js/bootstrap-transition'],
		'bootstrap/js/bootstrap-modal': ['bootstrap/js/bootstrap-transition'],
		'bootstrap/js/bootstrap-popover': ['bootstrap/js/bootstrap-transition', 'bootstrap/js/bootstrap-tooltip'],
		'bootstrap/js/bootstrap-scrollspy': ['bootstrap/js/bootstrap-transition'],
		'bootstrap/js/bootstrap-tab': ['bootstrap/js/bootstrap-transition'],
		'bootstrap/js/bootstrap-tooltip': ['bootstrap/js/bootstrap-transition'],
		'bootstrap/js/bootstrap-typeahead': ['bootstrap/js/bootstrap-transition']
	}
});

require(['jquery', 'fuelux'], function($) {

	module('Twitter Bootstrap plugins', {
		setup: function() {
			this.elems = $('#qunit-fixture').children();
		}
	});

	test('transitions are initialized', function() {
		strictEqual(typeof $.support.transition, 'object', 'transitions should be initialized');
	});

	test('modal is initialized', function() {
		strictEqual(this.elems.modal(), this.elems, 'modal should be initialized');
	});
	
	test('dropdown is initialized', function() {
		strictEqual(this.elems.dropdown(), this.elems, 'dropdown should be initialized');
	});
	
	test('scrollspy is initialized', function() {
		strictEqual(this.elems.scrollspy(), this.elems, 'scrollspy should be initialized');
	});
	
	test('tab is initialized', function() {
		strictEqual(this.elems.tab(), this.elems, 'tab should be initialized');
	});
	
	test('tooltip is initialized', function() {
		strictEqual(this.elems.tooltip(), this.elems, 'tooltip should be initialized');
	});
	
	test('popover is initialized', function() {
		strictEqual(this.elems.popover(), this.elems, 'popover should be initialized');
	});
	
	test('alert is initialized', function() {
		strictEqual(this.elems.alert(), this.alert, 'modal should be initialized');
	});
	
	test('button is initialized', function() {
		strictEqual(this.elems.button(), this.elems, 'button should be initialized');
	});
	
	test('collapse is initialized', function() {
		strictEqual(this.elems.collapse(), this.elems, 'collapse should be initialized');
	});
	
	test('carousel is initialized', function() {
		strictEqual(this.elems.carousel(), this.carousel, 'modal should be initialized');
	});
	
	test('typeahead is initialized', function() {
		strictEqual(this.elems.typeahead(), this.typeahead, 'modal should be initialized');
	});

});