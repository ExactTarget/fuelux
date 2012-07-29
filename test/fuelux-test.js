/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

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
		strictEqual(this.elems.alert(), this.elems, 'alert should be initialized');
	});
	
	test('button is initialized', function() {
		strictEqual(this.elems.button(), this.elems, 'button should be initialized');
	});
	
	test('collapse is initialized', function() {
		strictEqual(this.elems.collapse(), this.elems, 'collapse should be initialized');
	});
	
	test('carousel is initialized', function() {
		strictEqual(this.elems.carousel(), this.elems, 'carousel should be initialized');
	});
	
	test('typeahead is initialized', function() {
		strictEqual(this.elems.typeahead(), this.elems, 'typeahead should be initialized');
	});

});