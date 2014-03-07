/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');

//	require('test/checkbox-test');
	require('test/combobox-test');
	require('test/datagrid-test');
	require('test/datepicker-test');
	require('test/datepicker-moment-test');
	require('test/pillbox-test');
//	require('test/radio-test');
//	require('test/scheduler-test');
	require('test/search-test');
	require('test/spinner-test');
	require('test/select-test');
	require('test/tree-test');
	require('test/wizard-test');

});
