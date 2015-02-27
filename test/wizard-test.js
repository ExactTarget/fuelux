/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/wizard-markup.html');

	require('bootstrap');
	require('fuelux/wizard');

	function testWizardStepStates($wizard, activeStep) {
		var $steps = $wizard.find('li');

		for (var i = 0; i < $steps.length; i++) {
			if (i === (activeStep - 1)) {
				equal($steps.eq(i).hasClass('active'), true, 'step ' + activeStep + ' is active');
			} else if (i < (activeStep - 1)) {
				equal($steps.eq(i).hasClass('complete'), true, 'step ' + (i + 1) + ' is complete');
			} else {
				equal($steps.eq(i).hasClass('complete'), false, 'step ' + (i + 1) + ' is not complete');
			}

		}
	}

	module("Fuel UX Wizard");

	test("should be defined on jquery object", function () {
		ok($().wizard, 'wizard method is defined');
	});

	test("should return element", function () {
		var $wizard = $(html).find('#MyWizard');
		ok($wizard.wizard() === $wizard, 'wizard should be initialized');
	});

	test("next and previous should work as expected", function () {
		var $wizard = $(html).find('#MyWizard').wizard();

		// check default state
		equal($wizard.find('.active').data('step'), 1, 'default step is set');

		// move to next step
		$wizard.wizard('next');
		equal($wizard.find('.active').data('step'), 2, 'next step is set');

		// move to previous step
		$wizard.wizard('previous');
		equal($wizard.find('.active').data('step'), 1, 'previous step is set');
	});

	test("selectedItem should return expected object", function () {
		var $wizard = $(html).find('#MyWizard').wizard();

		var retVal = $wizard.wizard('selectedItem');
		var expectedRetVal = {
			step: 1
		};
		deepEqual(retVal, expectedRetVal, 'selectedItem used as getter returns step data as expected');

		retVal = $wizard.wizard('selectedItem', 2);
		equal(retVal.$element.hasClass('wizard'), true, 'selectedItem used as setter returns Wizard() as expected');
	});

	test("should fire actionclicked event", function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var eventFired = false;

		$wizard.on('actionclicked.fu.wizard', function (evt, data) {
			eventFired = true;
		});

		// move to next step
		$wizard.wizard('next');

		equal(eventFired, true, 'actionclicked event fired');
	});

	test("should fire changed event", function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var eventFired = false;

		$wizard.on('changed.fu.wizard', function (evt, data) {
			eventFired = true;
		});

		// move to next step
		$wizard.wizard('next');
		var index = $wizard.wizard('selectedItem').step;

		equal(eventFired, true, 'changed event fired');
		equal(index, 2, 'step changed');
	});

	test("should suppress changed event", function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var eventFired = false;

		$wizard.on('actionclicked.fu.wizard', function (evt, data) {
			eventFired = true;
			return evt.preventDefault();// prevent action
		});

		// move to next step
		$wizard.wizard('next');
		var index = $wizard.wizard('selectedItem').step;

		equal(eventFired, true, 'actionclicked event fired');
		equal(index, 1, 'step not changed');
	});

	test("should suppress stepclick event", function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var eventFired = false;

		$wizard.on('stepclicked.fu.wizard', function (evt, data) {
			eventFired = true;
			return evt.preventDefault();// prevent action
		});

		// move to second step
		$wizard.wizard('next');

		// click first step
		$wizard.find('.steps li:first').click();

		var index = $wizard.wizard('selectedItem').step;

		equal(eventFired, true, 'stepclick event fired');
		equal(index, 2, 'step not changed');
	});


	test("should fire finished event", function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var eventFired = false;

		$wizard.on('finished.fu.wizard', function (evt, data) {
			eventFired = true;
		});

		// move to next step
		$wizard.wizard('next');// move to step2
		$wizard.wizard('next');// move to step3
		$wizard.wizard('next');// move to step4
		$wizard.wizard('next');// move to step5
		$wizard.wizard('next');// calling next method on last step triggers event

		equal(eventFired, true, 'finish event fired');
	});

	test("should change nextBtn text as appropriate", function () {
		var $wizard = $(html).find('#MyWizardWithSpaces').wizard();
		var $nextClone;

		$nextClone = $wizard.find('.btn-next').clone();
		$nextClone.children().remove();
		equal($.trim($nextClone.text()), 'Next', 'nextBtn text equal to "Next"');

		$wizard.wizard('next');
		$wizard.wizard('next');
		$wizard.wizard('next');
		$wizard.wizard('next');
		$wizard.wizard('next');
		$nextClone = $wizard.find('.btn-next').clone();
		$nextClone.children().remove();
		equal($.trim($nextClone.text()), 'Finish', 'nextBtn text equal to "Finish"');

		$wizard.wizard('previous');
		$nextClone = $wizard.find('.btn-next').clone();
		$nextClone.children().remove();
		equal($.trim($nextClone.text()), 'Next', 'nextBtn text equal to "Next"');
	});

	test("pass no init parameter to set current step", function () {
		var step = 1;
		var $wizard = $(html).find('#MyWizard').wizard();

		testWizardStepStates($wizard, step);
	});

	test("pass init parameter to set current step > 1", function () {
		var step = 3;
		var $wizard = $(html).find('#MyWizard').wizard({
			selectedItem: {
				step: step
			}
		});

		testWizardStepStates($wizard, step);
	});

	test("use selectedItem to set current step", function () {
		var step = 3;
		var $wizard = $(html).find('#MyWizard').wizard();

		testWizardStepStates($wizard, 1);

		$wizard.wizard('selectedItem', {
			step: step
		});

		testWizardStepStates($wizard, step);

		$wizard.wizard('selectedItem', {
			step: "named step"
		});

		testWizardStepStates($wizard, 5);

		//this shouldn't cause anything to happen
		$wizard.wizard('selectedItem', {
			step: "nonexistent step"
		});

		testWizardStepStates($wizard, 5);

		//this shouldn't cause anything to happen
		$wizard.wizard('selectedItem', {
			step: 99999999999
		});

		testWizardStepStates($wizard, 5);
	});

	test("should disabled previous steps when data attribute is present", function () {
		var step = 3;
		var secondStep = 2;
		var $wizard = $(html).find('#MyWizardPreviousStepDisabled').wizard();

		// checking disabled property of previous button and making sure CSS class is present that removes hovers and changes cursor on previous steps
		var prevBtnDisabled = !!$wizard.find('.btn-prev').prop('disabled');
		var stepsListCssClass = !!$wizard.find('.steps').hasClass('previous-disabled');

		testWizardStepStates($wizard, 1);

		// testing to see if step changes when previous step clicked on
		$wizard.wizard('selectedItem', {
			step: step
		});
		$wizard.find('.steps > li:first-child').click();
		var activeStepIndex = $wizard.find('.steps > li').index($wizard.find('.steps > li.active')) + 1;

		// making sure wizard can still programatically set it's own step
		$wizard.wizard('selectedItem', {
			step: secondStep
		});
		var wizardSetActiveStep = $wizard.find('.steps > li').index($wizard.find('.steps > li.active')) + 1;

		// tests
		equal(prevBtnDisabled, true, 'previous step button is disabled');
		equal(stepsListCssClass, true, 'step list has correct CSS class for disabling hovers and changing cursor');
		equal(activeStepIndex, step, 'did not go to step when previous step clicked');
		equal(wizardSetActiveStep, secondStep, 'can still programatically set previous step');
	});

	test("should manage step panes", function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var $step = $wizard.find('.steps li:first');

		equal($step.hasClass('active'), true, 'active class set');
		$wizard.wizard('next');
		equal($step.hasClass('active'), false, 'active class removed');
	});

	test('addSteps method should behave as expected', function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var $test;

		$wizard.wizard('addSteps', -1, [{
			label: 'Test0',
			pane: 'Test Pane Content 0'
		}]);
		$test = $wizard.find('.steps li:last');
		$test.find('span').remove();
		equal($test.text(), 'Test0', 'item correctly added via array and negative index, has correct label');
		equal($wizard.find('.step-content .step-pane:last').text(), 'Test Pane Content 0', 'pane content set correctly');

		$wizard.wizard('addSteps', 2, {
			badge: 'T1',
			label: 'Test1',
			pane: 'Test Pane Content 1'
		}, {
				badge: 'T2',
				label: 'Test2',
				pane: 'Test Pane Content 2'
			});
		$test = $wizard.find('.steps li:nth-child(2)');
		equal($test.find('.badge').text(), 'T1', 'item correctly added at index via arguments, has correct badge');
		$test = $test.next();
		equal($test.find('.badge').text(), 'T2', 'multiple items added correctly via arguments');
		equal($wizard.find('.step-content .step-pane:nth-child(2)').text(), 'Test Pane Content 1', 'pane content set correctly');
		equal($wizard.find('.step-content .step-pane:nth-child(3)').text(), 'Test Pane Content 2', 'pane content set correctly');
	});

	test('removeSteps method should behave as expected', function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var $test;

		$wizard.wizard('removeSteps', 2, 1);
		$test = $wizard.find('.steps li:nth-child(2)');
		$test.find('span').remove();
		equal($test.text(), 'Template', 'one step was removed at correct index');

		$wizard.wizard('removeSteps', 1, 3);
		equal($wizard.find('.steps li').length, 1, 'multiple items were removed correctly');
	});


	test("should destroy control", function () {
		var $el = $(html).find('#MyWizard').wizard();

		equal(typeof ($el.wizard('destroy')), 'string', 'returns string (markup)');
		equal($el.parent().length, false, 'control has been removed from DOM');
	});
});
