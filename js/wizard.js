/*
 * Fuel UX Wizard
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the MIT license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// For more information on UMD visit: 
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {
	// -- END UMD WRAPPER PREFACE --
		
	// -- BEGIN MODULE CODE HERE --

	var old = $.fn.wizard;

	// WIZARD CONSTRUCTOR AND PROTOTYPE

	var Wizard = function (element, options) {
		var kids;

		this.$element = $(element);
		this.options = $.extend({}, $.fn.wizard.defaults, options);
		this.options.disablePreviousStep = ( this.$element.attr('data-restrict') === "previous" ) ? true : this.options.disablePreviousStep;
		this.currentStep = this.options.selectedItem.step;
		this.numSteps = this.$element.find('.steps li').length;
		this.$prevBtn = this.$element.find('button.btn-prev');
		this.$nextBtn = this.$element.find('button.btn-next');

		kids = this.$nextBtn.children().detach();
		this.nextText = $.trim(this.$nextBtn.text());
		this.$nextBtn.append(kids);

		// handle events
		this.$prevBtn.on('click.fu.wizard', $.proxy(this.previous, this));
		this.$nextBtn.on('click.fu.wizard', $.proxy(this.next, this));
		this.$element.on('click.fu.wizard', 'li.complete', $.proxy(this.stepclicked, this));
		
		this.selectedItem(this.options.selectedItem);

		if( this.options.disablePreviousStep ) {
			this.$prevBtn.attr( 'disabled', true );
			this.$element.find( '.steps' ).addClass( 'previous-disabled' );
		}
	};

	Wizard.prototype = {

		constructor: Wizard,

		//index is 1 based
		//second parameter can be array of objects [{ ... }, { ... }] or you can pass n additional objects as args
		//object structure is as follows (all params are optional): { badge: '', label: '', pane: '' }
		addSteps: function(index){
			var items = [].slice.call(arguments).slice(1);
			var $steps = this.$element.find('.steps');
			var $stepContent = this.$element.find('.step-content');
			var i, l, $pane, $startPane, $startStep, $step;

			index = (index===-1 || (index>(this.numSteps+1))) ? this.numSteps+1 : index;
			if(items[0] instanceof Array){
				items = items[0];
			}

			$startStep = $steps.find('li:nth-child(' + index + ')');
			$startPane = $stepContent.find('.step-pane:nth-child(' + index + ')');
			if($startStep.length<1){
				$startStep = null;
			}

			for(i=0, l=items.length; i<l; i++){
				$step = $('<li data-step="' + index + '"><span class="badge badge-info"></span></li>');
				$step.append(items[i].label || '').append('<span class="chevron"></span>');
				$step.find('.badge').append(items[i].badge || index);

				$pane = $('<div class="step-pane" data-step="' + index + '"></div>');
				$pane.append(items[i].pane || '');

				if(!$startStep){
					$steps.append($step);
					$stepContent.append($pane);
				}else{
					$startStep.before($step);
					$startPane.before($pane);
				}
				index++;
			}

			this.syncSteps();
			this.numSteps = $steps.find('li').length;
			this.setState();
		},

		//index is 1 based, howMany is number to remove
		removeSteps: function(index, howMany){
			var action = 'nextAll';
			var i = 0;
			var $steps = this.$element.find('.steps');
			var $stepContent = this.$element.find('.step-content');
			var $start;

			howMany = (howMany!==undefined) ? howMany : 1;

			if(index>$steps.find('li').length){
				$start = $steps.find('li:last');
			}else{
				$start = $steps.find('li:nth-child(' + index + ')').prev();
				if($start.length<1){
					action = 'children';
					$start = $steps;
				}
			}

			$start[action]().each(function(){
				var item = $(this);
				var step = item.attr('data-step');
				if(i<howMany){
					item.remove();
					$stepContent.find('.step-pane[data-step="' + step + '"]:first').remove();
				}else{
					return false;
				}
				i++;
			});

			this.syncSteps();
			this.numSteps = $steps.find('li').length;
			this.setState();
		},

		setState: function () {
			var canMovePrev = (this.currentStep > 1);
			var firstStep = (this.currentStep === 1);
			var lastStep = (this.currentStep === this.numSteps);

			// disable buttons based on current step
			if( !this.options.disablePreviousStep ) {
				this.$prevBtn.attr('disabled', (firstStep === true || canMovePrev === false));
			}

			// change button text of last step, if specified
			var last = this.$nextBtn.attr('data-last');
			if (last) {
				this.lastText = last;
				// replace text
				var text = this.nextText;
				if ( lastStep === true ) {
					text = this.lastText;
					// add status class to wizard
					this.$element.addClass('complete');
				}
				else {
					this.$element.removeClass('complete');
				}
				var kids = this.$nextBtn.children().detach();
				this.$nextBtn.text(text).append(kids);
			}

			// reset classes for all steps
			var $steps = this.$element.find('.steps li');
			$steps.removeClass('active').removeClass('complete');
			$steps.find('span.badge').removeClass('badge-info').removeClass('badge-success');

			// set class for all previous steps
			var prevSelector = '.steps li:lt(' + (this.currentStep - 1) + ')';
			var $prevSteps = this.$element.find(prevSelector);
			$prevSteps.addClass('complete');
			$prevSteps.find('span.badge').addClass('badge-success');

			// set class for current step
			var currentSelector = '.steps li:eq(' + (this.currentStep - 1) + ')';
			var $currentStep = this.$element.find(currentSelector);
			$currentStep.addClass('active');
			$currentStep.find('span.badge').addClass('badge-info');

			// set display of target element
			var $stepContent = this.$element.find('.step-content');
			var target = $currentStep.attr('data-step');
			$stepContent.find('.step-pane').removeClass('active');
			$stepContent.find('.step-pane[data-step="' + target + '"]:first').addClass('active');

			// reset the wizard position to the left
			this.$element.find('.steps').first().attr('style','margin-left: 0');

			// check if the steps are wider than the container div
			var totalWidth = 0;
			this.$element.find('.steps > li').each(function () {
				totalWidth += $(this).outerWidth();
			});
			var containerWidth = 0;
			if (this.$element.find('.actions').length) {
				containerWidth = this.$element.width() - this.$element.find('.actions').first().outerWidth();
			} else {
				containerWidth = this.$element.width();
			}
			if (totalWidth > containerWidth) {
			
				// set the position so that the last step is on the right
				var newMargin = totalWidth - containerWidth;
				this.$element.find('.steps').first().attr('style','margin-left: -' + newMargin + 'px');
				
				// set the position so that the active step is in a good
				// position if it has been moved out of view
				if (this.$element.find('li.active').first().position().left < 200) {
					newMargin += this.$element.find('li.active').first().position().left - 200;
					if (newMargin < 1) {
						this.$element.find('.steps').first().attr('style','margin-left: 0');
					} else {
						this.$element.find('.steps').first().attr('style','margin-left: -' + newMargin + 'px');
					}
				}
			}

			// only fire changed event after initializing
			if(typeof(this.initialized) !== 'undefined' ) {
				var e = $.Event('changed.fu.wizard');
				this.$element.trigger(e, {step: this.currentStep});
			}

			this.initialized = true;
		},

		stepclicked: function (e) {
			var li          = $(e.currentTarget);
			var index       = this.$element.find('.steps li').index(li);
			var canMovePrev = true;

			if( this.options.disablePreviousStep ) {
				if( index < this.currentStep ) {
					canMovePrev = false;
				}
			}

			if( canMovePrev ) {
				var evt = $.Event('stepclicked.fu.wizard');
				this.$element.trigger(evt, {step: index + 1});
				if (evt.isDefaultPrevented()) { return; }

				this.currentStep = (index + 1);
				this.setState();
			}
		},

		syncSteps: function(){
			var i = 1;
			var $steps = this.$element.find('.steps');
			var $stepContent = this.$element.find('.step-content');

			$steps.children().each(function(){
				var item = $(this);
				var badge = item.find('.badge');
				var step = item.attr('data-step');

				if(!isNaN(parseInt(badge.html(), 10))){
					badge.html(i);
				}
				item.attr('data-step', i);
				$stepContent.find('.step-pane[data-step="' + step + '"]:last').attr('data-step', i);
				i++;
			});
		},

		previous: function () {
			var canMovePrev = (this.currentStep > 1);
			if( this.options.disablePreviousStep ) {
				canMovePrev = false;
			}
			if (canMovePrev) {
				var e = $.Event('actionclicked.fu.wizard');
				this.$element.trigger(e, {step: this.currentStep, direction: 'previous'});
				if (e.isDefaultPrevented()) { return; } // don't increment

				this.currentStep -= 1;
				this.setState();
			}

			// return focus to control after selecting an option
			if( this.$prevBtn.is(':disabled') ) {
				this.$nextBtn.focus();
			}
			else {
				this.$prevBtn.focus();
			}

		},

		next: function () {
			var canMoveNext = (this.currentStep + 1 <= this.numSteps);
			var lastStep = (this.currentStep === this.numSteps);

			if (canMoveNext) {
				var e = $.Event('actionclicked.fu.wizard');
				this.$element.trigger(e, {step: this.currentStep, direction: 'next'});
				if (e.isDefaultPrevented()) { return; }	// don't increment

				this.currentStep += 1;
				this.setState();
			}
			else if (lastStep) {
				this.$element.trigger('finished.fu.wizard');
			}

			// return focus to control after selecting an option
			if( this.$nextBtn.is(':disabled') ) {
				this.$prevBtn.focus();
			}
			else {
				this.$nextBtn.focus();
			}
		},

		selectedItem: function (selectedItem) {
			var retVal, step;

			if(selectedItem) {

				step = selectedItem.step || -1;

				if(step >= 1 && step <= this.numSteps) {
					this.currentStep = step;
					this.setState();
				}else{
					step = this.$element.find('.steps li.active:first').attr('data-step');
					if(!isNaN(step)){
						this.currentStep = parseInt(step, 10);
						this.setState();
					}
				}

				retVal = this;
			}
			else {
				retVal = { step: this.currentStep };
			}

			return retVal;
		}
	};


	// WIZARD PLUGIN DEFINITION

	$.fn.wizard = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data( 'wizard' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('wizard', (data = new Wizard( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.wizard.defaults = {
		disablePreviousStep: false,
		selectedItem: { step: -1 }	//-1 means it will attempt to look for "active" class in order to set the step
	};

	$.fn.wizard.Constructor = Wizard;

	$.fn.wizard.noConflict = function () {
		$.fn.wizard = old;
		return this;
	};


	// DATA-API

	$(document).on('mouseover.fu.wizard.data-api', '[data-initialize=wizard]', function (e) {
		var $control = $(e.target).closest('.wizard');
		if ( !$control.data('wizard') ) {
			$control.wizard($control.data());
		}
	});

	// Must be domReady for AMD compatibility
	$(function () {
		$('[data-initialize=wizard]').each(function () {
			var $this = $(this);
			if ($this.data('wizard')) return;
			$this.wizard($this.data());
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
	// -- END UMD WRAPPER AFTERWORD --