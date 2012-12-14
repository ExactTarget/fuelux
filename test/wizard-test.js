/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/wizard'], function($) {

    var html = '<div><div class="wizard">' +
                    '<ul class="steps">' +
                        '<li data-target="#step1" class="active"><span class="badge badge-info">1</span>Step 1</li>' +
                        '<li data-target="#step2"><span class="badge">2</span>Step 2</li>' +
                        '<li data-target="#step3"><span class="badge">3</span>Step 3</li>' +
                        '<li data-target="#step4"><span class="badge">4</span>Step 4</li>' +
                        '<li data-target="#step5"><span class="badge">5</span>Step 5</li>' +
                    '</ul>' +
                    '<div class="actions">' +
                        '<a href="#">Cancel</a>' +
                        '<button class="btn btn-mini btn-primary btn-prev"> <i class="icon-white icon-arrow-left"></i>Prev</button>' +
                        '<button class="btn btn-mini btn-primary btn-next" data-last="Finish">Next<i class="icon-white icon-arrow-right"></i></button>' +
                    '</div>' +
                '</div>' +
                '<div class="step-content">' +
                    '<div class="step-pane active" id="step1">This is step 1</div>' +
                    '<div class="step-pane" id="step2">This is step 2</div>' +
                    '<div class="step-pane" id="step3">This is step 3</div>' +
                    '<div class="step-pane" id="step4">This is step 4</div>' +
                    '<div class="step-pane" id="step5">This is step 5</div>' +
                '</div></div>';


    module("Fuel UX wizard");

    test("should be defined on jquery object", function () {
        ok($(document.body).wizard, 'wizard method is defined');
    });

    test("should return element", function () {
        ok($(document.body).wizard()[0] === document.body, 'document.body returned');
    });

    test("should set step index", function() {
        var $wizard = $(html).wizard();
        var index = $wizard.wizard('selectedItem').step;

        // check default state
        equal(index, 1, 'default step is set');

        // move to next step
        $wizard.wizard('next');
        index = $wizard.wizard('selectedItem').step;
        equal(index, 2, 'next step is set');

        // move to previous step
        $wizard.wizard('previous');
        index = $wizard.wizard('selectedItem').step;
        equal(index, 1, 'previous step is set');
    });

    test("should fire change event", function() {
        var eventFired = false;

        var $wizard = $(html).wizard().on('change', function (evt, data) {
            eventFired = true;
        });

        // move to next step
        $wizard.wizard('next');

        equal(eventFired, true, 'change event fired');
    });

    test("should fire changed event", function() {
        var eventFired = false;

        var $wizard = $(html).wizard().on('changed', function (evt, data) {
            eventFired = true;
        });

        // move to next step
        $wizard.wizard('next');
        var index = $wizard.wizard('selectedItem').step;

        equal(eventFired, true, 'changed event fired');
        equal(index, 2, 'step changed');
    });

    test("should suppress changed event", function() {
        var eventFired = false;

        var $wizard = $(html).wizard().on('change', function (evt, data) {
            eventFired = true;
            return evt.preventDefault(); // prevent action
        });

        // move to next step
        $wizard.wizard('next');
        var index = $wizard.wizard('selectedItem').step;

        equal(eventFired, true, 'change event fired');
        equal(index, 1, 'step not changed');
    });

	test("should fire finished event", function() {
		var eventFired = false;

		var $wizard = $(html).wizard().on('finished', function (evt, data) {
			eventFired = true;
		});

		// move to next step
		$wizard.wizard('next'); // move to step2
		$wizard.wizard('next'); // move to step3
		$wizard.wizard('next'); // move to step4
		$wizard.wizard('next'); // move to step5
		$wizard.wizard('next'); // calling next method on last step triggers event

		equal(eventFired, true, 'finish event fired');
	});

    /*test("should manage step panes", function() {
        var $wizard = $(html).wizard();
        var $step = $wizard.find('#step1');

        equal($wizard.find('#step1').hasClass('active'), true, 'active class set');
        $wizard.wizard('next');
        equal($wizard.find('#step1').hasClass('active'), false, 'active class removed');
    });*/

});