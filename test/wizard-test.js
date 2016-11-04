/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define( function ( require ) {
	var QUnit = require('qunit');
	var $ = require( "jquery" );
	var html = require( "text!test/markup/wizard-markup.html!strip" );

	require( "bootstrap" );
	require( "fuelux/wizard" );

	function testWizardStepStates( assert, $wizard, activeStep ) {
		var $steps = $wizard.find( ".steps-container .steps li" );

		for ( var i = 0; i < $steps.length; i++ ) {
			if ( i === ( activeStep - 1 ) ) {
				assert.equal( $steps.eq( i ).hasClass( "active" ), true, "step " + activeStep + " is active" );
			} else if ( i < ( activeStep - 1 ) ) {
				assert.equal( $steps.eq( i ).hasClass( "complete" ), true, "step " + ( i + 1 ) + " is complete" );
			} else {
				assert.equal( $steps.eq( i ).hasClass( "complete" ), false, "step " + ( i + 1 ) + " is not complete" );
			}

		}
	}

	QUnit.module( "Fuel UX Wizard" );

	QUnit.test( "should be defined on jquery object", function( assert ) {
		assert.ok( $().wizard, "wizard method is defined" );
	} );

	QUnit.test( "should return element", function( assert ) {
		var $wizard = $( html ).find( "#MyWizard" );
		assert.ok( $wizard.wizard() === $wizard, "wizard should be initialized" );
	} );

	QUnit.test( "next and previous should work as expected", function( assert ) {
		var $wizard = $( html ).find( "#MyWizard" ).wizard();

		// Check default state
		assert.equal( $wizard.find( ".active" ).data( "step" ), 1, "default step is set" );

		// Move to next step
		$wizard.wizard( "next" );
		assert.equal( $wizard.find( ".active" ).data( "step" ), 2, "next step is set" );

		// Move to previous step
		$wizard.wizard( "previous" );
		assert.equal( $wizard.find( ".active" ).data( "step" ), 1, "previous step is set" );
	} );

	QUnit.test( "selectedItem should return expected object", function( assert ) {
		var $wizard = $( html ).find( "#MyWizard" ).wizard();

		var retVal = $wizard.wizard( "selectedItem" );
		var expectedRetVal = {
			step: 1
		};
		assert.deepEqual( retVal, expectedRetVal, "selectedItem used as getter returns step data as expected" );

		retVal = $wizard.wizard( "selectedItem", 2 );
		assert.equal( retVal.$element.hasClass( "wizard" ), true, "selectedItem used as setter returns Wizard() as expected" );
	} );

	QUnit.test( "should fire actionclicked event", function( assert ) {
		var $wizard = $( html ).find( "#MyWizard" ).wizard();
		var eventFired = false;

		$wizard.on( "actionclicked.fu.wizard", function( evt, data ) {
			eventFired = true;
		} );

		// Move to next step
		$wizard.wizard( "next" );

		assert.equal( eventFired, true, "actionclicked event fired" );
	} );

	QUnit.test( "should fire changed event", function( assert ) {
		var $wizard = $( html ).find( "#MyWizard" ).wizard();
		var eventFired = false;

		$wizard.on( "changed.fu.wizard", function( evt, data ) {
			eventFired = true;
		} );

		// Move to next step
		$wizard.wizard( "next" );
		var index = $wizard.wizard( "selectedItem" ).step;

		assert.equal( eventFired, true, "changed event fired" );
		assert.equal( index, 2, "step changed" );
	} );

	QUnit.test( "should suppress changed event", function( assert ) {
		var $wizard = $( html ).find( "#MyWizard" ).wizard();
		var eventFired = false;

		$wizard.on( "actionclicked.fu.wizard", function( evt, data ) {
			eventFired = true;
			return evt.preventDefault();// Prevent action
		} );

		// Move to next step
		$wizard.wizard( "next" );
		var index = $wizard.wizard( "selectedItem" ).step;

		assert.equal( eventFired, true, "actionclicked event fired" );
		assert.equal( index, 1, "step not changed" );
	} );

	QUnit.test( "should suppress stepclick event", function( assert ) {
		var $wizard = $( html ).find( "#MyWizard" ).wizard();
		var eventFired = false;

		$wizard.on( "stepclicked.fu.wizard", function( evt, data ) {
			eventFired = true;
			return evt.preventDefault();// Prevent action
		} );

		// Move to second step
		$wizard.wizard( "next" );

		// Click first step
		$wizard.find( ".steps li:first" ).click();

		var index = $wizard.wizard( "selectedItem" ).step;

		assert.equal( eventFired, true, "stepclick event fired" );
		assert.equal( index, 2, "step not changed" );
	} );

	QUnit.test( "should not suppress stepclick event for content", function( assert ) {
		var $wizard = $( html ).find( "#MyWizard" ).wizard();
		var eventFired = false;

		$wizard.on( "stepclicked.fu.wizard", function( evt, data ) {
			eventFired = true;
			return evt.preventDefault();// Prevent action
		} );

		// Move to second step
		$wizard.wizard( "next" );

		// Click content element
		$wizard.find( ".step-content li.complete:first" ).click();

		var index = $wizard.wizard( "selectedItem" ).step;

		assert.equal( eventFired, false, "stepclick event not fired" );
		assert.equal( index, 2, "step not changed" );

	} );

	QUnit.test( "should fire finished event", function( assert ) {
		var $wizard = $( html ).find( "#MyWizard" ).wizard();
		var eventFired = false;

		$wizard.on( "finished.fu.wizard", function( evt, data ) {
			eventFired = true;
		} );

		// Move to next step
		$wizard.wizard( "next" );// Move to step2
		$wizard.wizard( "next" );// Move to step3
		$wizard.wizard( "next" );// Move to step4
		$wizard.wizard( "next" );// Move to step5
		$wizard.wizard( "next" );// Calling next method on last step triggers event

		assert.equal( eventFired, true, "finish event fired" );
	} );

	QUnit.test( "should change nextBtn text as appropriate", function( assert ) {
		var $wizard = $( html ).find( "#MyWizardWithSpaces" ).wizard();
		var $nextClone;

		$nextClone = $wizard.find( ".btn-next" ).clone();
		$nextClone.children().remove();
		assert.equal( $.trim( $nextClone.text() ), "Next", 'nextBtn text equal to "Next"' );

		$wizard.wizard( "next" );
		$wizard.wizard( "next" );
		$wizard.wizard( "next" );
		$wizard.wizard( "next" );
		$wizard.wizard( "next" );
		$nextClone = $wizard.find( ".btn-next" ).clone();
		$nextClone.children().remove();
		assert.equal( $.trim( $nextClone.text() ), "Finish", 'nextBtn text equal to "Finish"' );

		$wizard.wizard( "previous" );
		$nextClone = $wizard.find( ".btn-next" ).clone();
		$nextClone.children().remove();
		assert.equal( $.trim( $nextClone.text() ), "Next", 'nextBtn text equal to "Next"' );
	} );

	QUnit.test( "pass no init parameter to set current step", function( assert ) {
		var step = 1;
		var $wizard = $( html ).find( "#MyWizard" ).wizard();

		testWizardStepStates( assert, $wizard, step );
	} );

	QUnit.test( "pass init parameter to set current step > 1", function( assert ) {
		var step = 3;
		var $wizard = $( html ).find( "#MyWizard" ).wizard( {
			selectedItem: {
				step: step
			}
		} );

		testWizardStepStates( assert, $wizard, step );
	} );

	QUnit.test( "use selectedItem to set current step", function( assert ) {
		var step = 3;
		var $wizard = $( html ).find( "#MyWizard" ).wizard();

		testWizardStepStates( assert, $wizard, 1 );

		$wizard.wizard( "selectedItem", {
			step: step
		} );

		testWizardStepStates( assert, $wizard, step );

		$wizard.wizard( "selectedItem", {
			step: "named step"
		} );

		testWizardStepStates( assert, $wizard, 5 );

		//This shouldn't cause anything to happen
		$wizard.wizard( "selectedItem", {
			step: "nonexistent step"
		} );

		testWizardStepStates( assert, $wizard, 5 );

		//This shouldn't cause anything to happen
		$wizard.wizard( "selectedItem", {
			step: 99999999999
		} );

		testWizardStepStates( assert, $wizard, 5 );
	} );

	QUnit.test( "should disabled previous steps when data attribute is present", function( assert ) {
		var step = 3;
		var secondStep = 2;
		var $wizard = $( html ).find( "#MyWizardPreviousStepDisabled" ).wizard();

		// Checking disabled property of previous button and making sure CSS class is present that removes hovers and changes cursor on previous steps
		var prevBtnDisabled = !!$wizard.find( ".btn-prev" ).prop( "disabled" );
		var stepsListCssClass = !!$wizard.find( ".steps" ).hasClass( "previous-disabled" );

		testWizardStepStates( assert, $wizard, 1 );

		// Testing to see if step changes when previous step clicked on
		$wizard.wizard( "selectedItem", {
			step: step
		} );
		$wizard.find( ".steps > li:first-child" ).click();
		var activeStepIndex = $wizard.find( ".steps > li" ).index( $wizard.find( ".steps > li.active" ) ) + 1;

		// Making sure wizard can still programatically set it's own step
		$wizard.wizard( "selectedItem", {
			step: secondStep
		} );
		var wizardSetActiveStep = $wizard.find( ".steps > li" ).index( $wizard.find( ".steps > li.active" ) ) + 1;

		// Tests
		assert.equal( prevBtnDisabled, true, "previous step button is disabled" );
		assert.equal( stepsListCssClass, true, "step list has correct CSS class for disabling hovers and changing cursor" );
		assert.equal( activeStepIndex, step, "did not go to step when previous step clicked" );
		assert.equal( wizardSetActiveStep, secondStep, "can still programatically set previous step" );
	} );

	QUnit.test( "should manage step panes", function( assert ) {
		var $wizard = $( html ).find( "#MyWizard" ).wizard();
		var $step = $wizard.find( ".steps li:first" );

		assert.equal( $step.hasClass( "active" ), true, "active class set" );
		$wizard.wizard( "next" );
		assert.equal( $step.hasClass( "active" ), false, "active class removed" );
	} );

	QUnit.test( "addSteps method should behave as expected", function( assert ) {
		var $wizard = $( html ).find( "#MyWizard" ).wizard();
		var $test;

		$wizard.wizard( "addSteps", -1, [ {
			label: "Test0",
			pane: "Test Pane Content 0"
		} ] );
		$test = $wizard.find( ".steps li:last" );
		$test.find( "span" ).remove();
		assert.equal( $test.text(), "Test0", "item correctly added via array and negative index, has correct label" );
		assert.equal( $wizard.find( ".step-content .step-pane:last" ).text(), "Test Pane Content 0", "pane content set correctly" );

		$wizard.wizard( "addSteps", 2, {
			badge: "T1",
			label: "Test1",
			pane: "Test Pane Content 1"
		}, {
			badge: "T2",
			label: "Test2",
			pane: "Test Pane Content 2"
		} );
		$test = $wizard.find( ".steps li:nth-child(2)" );
		assert.equal( $test.find( ".badge" ).text(), "T1", "item correctly added at index via arguments, has correct badge" );
		$test = $test.next();
		assert.equal( $test.find( ".badge" ).text(), "T2", "multiple items added correctly via arguments" );
		assert.equal( $wizard.find( ".step-content .step-pane:nth-child(2)" ).text(), "Test Pane Content 1", "pane content set correctly" );
		assert.equal( $wizard.find( ".step-content .step-pane:nth-child(3)" ).text(), "Test Pane Content 2", "pane content set correctly" );
	} );

	QUnit.test( "removeSteps method should behave as expected", function( assert ) {
		var $wizard = $( html ).find( "#MyWizard" ).wizard();
		var $test;

		$wizard.wizard( "removeSteps", 2, 1 );
		$test = $wizard.find( ".steps li:nth-child(2)" );
		$test.find( "span" ).remove();
		assert.equal( $test.text(), "Template", "one step was removed at correct index" );

		$wizard.wizard( "removeSteps", 1, 3 );
		assert.equal( $wizard.find( ".steps li" ).length, 1, "multiple items were removed correctly" );
	} );

	QUnit.test( "should destroy control", function( assert ) {
		var $el = $( html ).find( "#MyWizard" ).wizard();

		assert.equal( typeof ( $el.wizard( "destroy" ) ), "string", "returns string (markup)" );
		assert.equal( $el.parent().length, false, "control has been removed from DOM" );
	} );
} );
