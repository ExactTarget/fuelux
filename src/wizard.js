/*
 * Fuel UX Wizard
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

define(function (require) {

	var $ = require('jquery');


	// WIZARD CONSTRUCTOR AND PROTOTYPE

	var Wizard = function(element, options)
	{
	    var kids;
	    var self = this;

	    this.$element = $(element);
	    this.options = $.extend({}, $.fn.wizard.defaults, options);
	    this.currentStep = 1;
	    this.numSteps = this.$element.find('.steps:first li').length;
	    this.$prevBtn = this.$element.find('button.btn-prev');
	    this.$nextBtn = this.$element.find('button.btn-next');

	    this.$nextBtn.each(function()
	    {
	        kids = $(this).children().detach();
	        self.nextText = $.trim($(this).text());
	        $(this).append(kids);
	    });

	    // handle events
	    this.$prevBtn.on('click', $.proxy(this.previous, this));
	    this.$nextBtn.on('click', $.proxy(this.next, this));
	    this.$element.on('click', 'li.complete', $.proxy(this.stepclicked, this));
	};

	Wizard.prototype = {

	    constructor: Wizard,

	    setState: function()
	    {
	        var self = this;

	        var canMovePrev = (this.currentStep > 1);
	        var firstStep = (this.currentStep === 1);
	        var lastStep = (this.currentStep === this.numSteps);

	        // disable buttons based on current step
	        this.$prevBtn.each(function() { $(this).attr('disabled', (firstStep === true || canMovePrev === false)) });

	        // change button text of last step, if specified
	        this.$nextBtn.each(function()
	        {
	            var data = $(this).data();

	            if(data && data.last)
	            {
	                self.lastText = data.last;
	                if(typeof self.lastText !== 'undefined')
	                {
	                    // replace text
	                    var text = (lastStep !== true) ? self.nextText : self.lastText;
	                    var kids = $(this).children().detach();
	                    $(this).text(text).append(kids);
	                }
	            }
	        });

	        // reset classes for all steps
	        var $steps = this.$element.find('.steps li');
	        $steps.removeClass('active').removeClass('complete');
	        $steps.find('span.badge').removeClass('badge-info').removeClass('badge-success');


	        var targetChanged = false;

	        this.$element.find('.steps').each(function()
	        {
	            // set class for all previous steps
	            var prevSelector = 'li:lt(' + (self.currentStep - 1) + ')';
	            var $prevSteps = $(this).find(prevSelector);
	            $prevSteps.addClass('complete');
	            $prevSteps.find('span.badge').addClass('badge-success');

	            // set class for current step
	            var currentSelector = 'li:eq(' + (self.currentStep - 1) + ')';
	            var $currentStep = $(this).find(currentSelector);
	            $currentStep.addClass('active');
	            $currentStep.find('span.badge').addClass('badge-info');

	            // only process on the first steps target to avoid flicker
	            if(!targetChanged)
	            {
	                targetChanged = true;

	                // set display of target element
	                var target = $currentStep.data().target;
	                self.$element.find('.step-pane').removeClass('active');
	                $(target).addClass('active');
	            }
	        });

	        this.$element.trigger('changed');
	    },

	    stepclicked: function(e)
	    {
	        var li = $(e.currentTarget);

	        var index = $(e.currentTarget).closest('.steps').find('li').index(li);

	        var evt = $.Event('stepclick');
	        this.$element.trigger(evt, { step: index + 1 });
	        if(evt.isDefaultPrevented()) return;

	        this.currentStep = (index + 1);
	        this.setState();
	    },

	    previous: function()
	    {
	        var canMovePrev = (this.currentStep > 1);
	        if(canMovePrev)
	        {
	            var e = $.Event('change');
	            this.$element.trigger(e, { step: this.currentStep, direction: 'previous' });
	            if(e.isDefaultPrevented()) return;

	            this.currentStep -= 1;
	            this.setState();
	        }
	    },

	    next: function()
	    {
	        var canMoveNext = (this.currentStep + 1 <= this.numSteps);
	        var lastStep = (this.currentStep === this.numSteps);

	        if(canMoveNext)
	        {
	            var e = $.Event('change');
	            this.$element.trigger(e, { step: this.currentStep, direction: 'next' });

	            if(e.isDefaultPrevented()) return;

	            this.currentStep += 1;
	            this.setState();
	        }
	        else if(lastStep)
	        {
	            this.$element.trigger('finished');
	        }
	    },

	    selectedItem: function(val)
	    {
	        return {
	            step: this.currentStep
	        };
	    }
	};


	// WIZARD PLUGIN DEFINITION

	$.fn.wizard = function(option, value)
	{
	    var methodReturn;

	    var $set = this.each(function()
	    {
	        var $this = $(this);
	        var data = $this.data('wizard');
	        var options = typeof option === 'object' && option;

	        if(!data) $this.data('wizard', (data = new Wizard(this, options)));
	        if(typeof option === 'string') methodReturn = data[option](value);
	    });

	    return (methodReturn === undefined) ? $set : methodReturn;
	};

	$.fn.wizard.defaults = {};

	$.fn.wizard.Constructor = Wizard;


	// WIZARD DATA-API

	$(function()
	{
	    $('body').on('mousedown.wizard.data-api', '.wizard', function()
	    {
	        var $this = $(this);
	        if($this.data('wizard')) return;
	        $this.wizard($this.data());
	    });
	});

});
