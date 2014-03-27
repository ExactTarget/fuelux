/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

( function() {

	module('FuelUX Component Initialization (via Browser Globals)', {
		setup: function() {
			this.elems = $('#qunit-fixture').children();
		}
	});

	// In order to be be UMD compliant, modules must work with 
	// AMD (require.js) and as browser globals. The following tests
	// check to see if the only the browser global is present 
	// and nothing else.

	test('should be defined on jquery object', function () {
		ok($(document.body).checkbox, 'checkbox method is defined');
	});

	test('should be defined on jquery object', function () {
		ok($(document.body).combobox, 'combobox method is defined');
	});

	test('should be defined on jquery object', function () {
		ok($(document.body).datagrid, 'datagrid method is defined');
	});

	test( 'should be defined on the jQuery object', function() {
		ok( $(document.body).datepicker, 'datepicker method is defined' );
	});

	test('should be defined on jquery object', function () {
		ok($(this.pillboxHTML).pillbox, 'pillbox method is defined');
	});

	test('should be defined on jquery object', function () {
		ok($(document.body).radio, 'radio method is defined');
	});

	test('should be defined on the jQuery object', function(){
		ok( $(document.body).scheduler, 'scheduler method is defined' );
	});

	test('should be defined on jquery object', function () {
		ok($(document.body).search, 'search method is defined');
	});

	test('should be defined on jquery object', function () {
		ok($(document.body).select, 'select method is defined');
	});

	test('should return element', function () {
		ok($(document.body).spinbox()[0] === document.body, 'document.body returned');
	});

	test('should be defined on jquery object', function () {
		ok($(document.body).tree, 'tree method is defined');
	});

	test('should be defined on jquery object', function () {
		ok($(document.body).wizard, 'wizard method is defined');
	});

})();