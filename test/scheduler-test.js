/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'test/scheduler-markup', 'fuelux/scheduler'], function ($, schedulerMarkup) {

	module('Fuel UX scheduler', {
        setup: function(){
            this.$markup = $(schedulerMarkup);
        }
    });

    test('should be defined on the jQuery object', function(){
        ok( $(document.body).scheduler, 'scheduler method is defined' );
    });

    test("should return element", function () {
        ok($(document.body).scheduler()[0] === document.body, 'document.body returned');
    });

    test("should disable control (all inputs)", function () {
        var disabled = true;
        var $scheduler = this.$markup.scheduler();

        $scheduler.scheduler('disable');

        $scheduler.find('.combobox .btn').each(function(){
            if(!$(this).hasClass('disabled')){
                disabled = false;
            }
        });
        equal(disabled, true, 'all combobox controls disabled');

        $scheduler.find('.datepicker input').each(function(){
            if(!$(this).prop('disabled')){
                disabled = false;
            }
        });
        equal(disabled, true, 'all datepicker controls disabled');

        $scheduler.find('.radio input').each(function(){
            if(!$(this).is(':disabled')){
                disabled = false;
            }
        });
        equal(disabled, true, 'all radio button controls disabled');

        $scheduler.find('.select .btn').each(function(){
            if(!$(this).hasClass('disabled')){
                disabled = false;
            }
        });
        equal(disabled, true, 'all select controls disabled');

        $scheduler.find('.spinner .spinner-input').each(function(){
            if(!$(this).prop('disabled')){
                disabled = false;
            }
        });
        equal(disabled, true, 'all spinner controls disabled');

        disabled = $scheduler.find('.scheduler-weekly .btn-group').hasClass('disabled');
        equal(disabled, true, 'scheduler weekly btn-group disabled');
    });

    test("should enable control (all inputs)", function () {
        var enabled = true;
        var $scheduler = this.$markup.scheduler();

        $scheduler.scheduler('disable');
        $scheduler.scheduler('enable');

        $scheduler.find('.combobox .btn').each(function(){
            if($(this).hasClass('disabled')){
                enabled = false;
            }
        });
        equal(enabled, true, 'all combobox controls enabled');

        $scheduler.find('.datepicker input').each(function(){
            if($(this).prop('disabled')){
                enabled = false;
            }
        });
        equal(enabled, true, 'all datepicker controls enabled');

        $scheduler.find('.radio input').each(function(){
            if($(this).is(':disabled')){
                enabled = false;
            }
        });
        equal(enabled, true, 'all radio button controls enabled');

        $scheduler.find('.select .btn').each(function(){
            if($(this).hasClass('disabled')){
                enabled = false;
            }
        });
        equal(enabled, true, 'all select controls enabled');

        $scheduler.find('.spinner .spinner-input').each(function(){
            if($(this).prop('disabled')){
                enabled = false;
            }
        });
        equal(enabled, true, 'all spinner controls enabled');

        enabled = ($scheduler.find('.scheduler-weekly .btn-group').hasClass('disabled')) ? false : true;
        equal(enabled, true, 'scheduler weekly btn-group enabled');
    });
});