/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/spinbox-markup.html!strip');
	/* FOR DEV TESTING - uncomment to test against index.html */
	//html = require('text!index.html!strip');

	require('bootstrap');
	require('fuelux/spinbox');

	module("Fuel UX Spinbox");

	test("should be defined on jquery object", function () {
		ok($().spinbox, 'spinbox method is defined');
	});

	test("should return element", function () {
		var $spinbox = $(html).find('#MySpinbox');
		ok($spinbox.spinbox() === $spinbox, 'spinbox should be initialized');
	});

	test("should behave as designed", function () {
		var $spinbox = $(html).find('#MySpinbox').spinbox();

		//returning default value
		equal($spinbox.spinbox('value'), 0, 'spinbox returns selected item');

		//set number value
		$spinbox.spinbox('value',2);
		equal($spinbox.spinbox('value'), 2, 'spinbox sets number value');

		//set numeric string value
		$spinbox.spinbox('value','2.1');
		equal($spinbox.spinbox('value'), 2.1, 'spinbox sets floating point numeric string value');

		$spinbox.spinbox('value','2');
		equal($spinbox.spinbox('value'), 2, 'spinbox sets integer numeric string value');

		//disable
		$spinbox.spinbox('disable');
		equal($spinbox.find('.spinbox-input').attr('disabled'), "disabled", 'spinbox sets disabled');

		//enable
		$spinbox.spinbox('enable');
		equal($spinbox.find('.spinbox-input').attr('disabled') ? false : true, true, 'spinbox sets enabled');

		//change
		$spinbox.spinbox('value','b2');
		$spinbox.spinbox('change');
		equal($spinbox.spinbox('value'), 2, 'spinbox change not working for alpha strings');

		//increment positive
		$spinbox.spinbox('step',true);
		equal($spinbox.spinbox('value'), 3, 'spinbox increments positive');

		//increment nagative
		$spinbox.spinbox('step',false);
		equal($spinbox.spinbox('value'), 2, 'spinbox increments negative');

		//Spinbox should upadate value on focusout
		$spinbox.find('.spinbox-input').val(4);
		$spinbox.find('.spinbox-input').focusout();
		equal($spinbox.spinbox('value'), 4, 'spinbox updates value on focus out');

		//Spinbox should update value before initiating increment
		$spinbox.find('.spinbox-input').val(5);
		$spinbox.find('.spinbox-input').focusin();
		$spinbox.spinbox('step',true);
		equal($spinbox.spinbox('value'), 6, 'spinbox updates value before initiating increment');
	});

	test("should allow setting value to zero", function () {
		var $spinbox = $(html).find('#MySpinbox').spinbox();
		$spinbox.spinbox('value', 0);
		equal($spinbox.spinbox('value'), 0, 'spinbox value was set to zero');
	});

	test("should keep existing value", function () {
		var $spinbox = $(html).find('#MySpinboxWithDefault').spinbox();
		equal($spinbox.spinbox('value'), 3, 'spinbox kept existing value');
	});

	test("spinbox should not allow maximum/minimum values to be surpassed by manual input", function () {
		var $spinbox = $(html).find('#MySpinbox').spinbox({
			min: -10,
			max: 10
		});

		//Spinbox does not allow max value to be surpassed
		$spinbox.find('.spinbox-input').val(15);
		$spinbox.find('.spinbox-input').focusout();
		equal($spinbox.spinbox('value'), 10, 'spinbox resets to max value when max value is surpassed');

		//Spinbox does not allow min value to be surpassed
		$spinbox.find('.spinbox-input').val(-15);
		$spinbox.find('.spinbox-input').focusout();
		equal($spinbox.spinbox('value'), -10, 'spinbox resets to min value when min value is surpassed');
	});

	test("should cycle when min or max values are reached", function () {
		var $spinbox = $(html).find('#MySpinbox').spinbox({
			min: 1,
			max: 3,
			cycle: true
		});
		$spinbox.spinbox('step',true); // 2
		$spinbox.spinbox('step',true); // 3
		$spinbox.spinbox('step',true); // 1
		$spinbox.spinbox('step',true); // 2
		equal($spinbox.spinbox('value'), 2, 'spinbox value cycled at max');
		$spinbox.spinbox('step',false); // 1
		$spinbox.spinbox('step',false); // 3
		$spinbox.spinbox('step',false); // 2
		equal($spinbox.spinbox('value'), 2, 'spinbox value cycled at min');
	});

	test("spinbox should behave correctly when units are included", function () {
		var $spinbox = $(html).find('#MySpinbox').spinbox({
			min: -10,
			units: ['px']
		});

		//spinbox behaves when units are enabled for non-unit values
		$spinbox.spinbox('value', 1);
		ok($spinbox.spinbox('value') === '1', 'spinbox returned integer');

		//spinbox handles string with appropriate unit
		$spinbox.spinbox('value', '1px');
		ok($spinbox.spinbox('value') === '1px', 'spinbox returned string and supported units');

		//increment positive
		$spinbox.spinbox('step',true);
		equal($spinbox.spinbox('value'), '2px', 'spinbox increments positive');

		//increment nagative
		$spinbox.spinbox('step',false);
		equal($spinbox.spinbox('value'), '1px', 'spinbox increments negative');

		//Should not allow units not supported
		$spinbox.spinbox('value','2pp');
		equal($spinbox.spinbox('value'), 2, 'spinbox not allowing units not supported');

		//Spinbox should change on focusout with units
		$spinbox.find('.spinbox-input').val('4px');
		$spinbox.find('.spinbox-input').focusout();
		equal($spinbox.spinbox('value'), '4px', 'spinbox updates string value on focus out');

	});

	test("spinbox should add default unit if none is specified", function () {
		var $spinbox = $(html).find('#MySpinbox').spinbox({
			units: ['px'],
			defaultUnit: 'px'
		});

		$spinbox.spinbox('value', 1);
		ok($spinbox.spinbox('value') === '1px', 'spinbox returned value with default unit');

	});

	test("spinbox should not add default unit if it not allowed", function () {
		var $spinbox = $(html).find('#MySpinbox').spinbox({
			units: ['px'],
			defaultUnit: 'ouch'
		});

		$spinbox.spinbox('value', 1);
		ok($spinbox.spinbox('value') === '1', 'spinbox returned value WITHOUT default unit');

	});

	test("spinbox should behave correctly when custom decimalMark is used", function () {
		var $spinbox = $(html).find('#MySpinboxDecimal').spinbox({
			value: '1,1',
			min: 0,
			max: 10,
			step: 0.1,
			decimalMark: ','
		});

		//spinbox behaves when there is no custom decimal mark
		$spinbox.spinbox('value', '1');
		equal($spinbox.spinbox('value'), '1', 'spinbox returned correct number');

		//increment positive
		$spinbox.spinbox('step',true);
		equal($spinbox.spinbox('value'), '1,1', 'spinbox increments positive');

		//increment nagative
		$spinbox.spinbox('step',false);
		equal($spinbox.spinbox('value'), '1', 'spinbox increments negative');

	});

	test("should destroy control", function () {
		var $el = $(html).find('#MySpinbox');

		equal(typeof( $el.spinbox('destroy')) , 'string', 'returns string (markup)');
		equal( $el.parent().length, false, 'control has been removed from DOM');
	});

});
