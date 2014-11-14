/*
 * Fuel UX Checkbox
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the BSD New license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// For more information on UMD visit:
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function($) {
	// -- END UMD WRAPPER PREFACE --

	// -- BEGIN MODULE CODE HERE --

	var old = $.fn.checkbox;

	// CHECKBOX CONSTRUCTOR AND PROTOTYPE

	var Checkbox = function(element, options) {
		this.options = $.extend({}, $.fn.checkbox.defaults, options);

		// cache elements
		this.$element = $(element).is('input[type="checkbox"]') ? $(element) : $(element).find('input[type="checkbox"]:first');
		this.$checkedElement = this.$element.parent();
		this.$uncheckedElement = this.$checkedElement.clone().attr('id', this.$checkedElement.attr('id') + 'unchecked');
		this.$uncheckedElement = this.$uncheckedElement.insertAfter(this.$checkedElement);

		this.$checkedElement.addClass('checked');
		this.$uncheckedElement.removeClass('checked');

		//need to bind toggle (click, spacebar, etc) events to BOTH of the checkboxes

		this.$parent = this.$checkedElement.parent('.checkbox');
		this.$toggleContainer = this.$element.attr('data-toggle');
		this.state = {
			disabled: false,
			checked: false
		};

		if (this.$parent.length === 0) {
			this.$parent = null;
		}

		if (Boolean(this.$toggleContainer)) {
			this.$toggleContainer = $(this.$toggleContainer);
		} else {
			this.$toggleContainer = null;
		}

		// handle events
		this.$element.on('change.fu.checkbox', $.proxy(this.itemchecked, this));

		// set default state
		this._clearDisabledClasses();
		this.setState();
	};

	Checkbox.prototype = {

		constructor: Checkbox,

		setState: function($chk) {
			$chk = $chk || this.$element;

			console.log('hereeeeeeee');

			this.state.disabled = Boolean($chk.prop('disabled'));
			this.state.checked = Boolean($chk.is(':checked'));

			// set state of checkbox
			this._ensureCheckedState();
			this._ensureDisabledState();

			//toggle container
			this.toggleContainer();
		},

		enable: function() {
			this.state.disabled = false;
			this.$element.attr('disabled', false);
			this._clearDisabledClasses();
			this.$element.trigger('enabled.fu.checkbox');
		},

		disable: function() {
			this.state.disabled = true;
			this.$element.attr('disabled', true);
			this._setDisabledClass();
			this.$element.trigger('disabled.fu.checkbox');
		},

		check: function() {
			console.log('checkityo');
			this.$uncheckedElement.hide();
			this.$checkedElement.show();
			this.state.checked = true;
			this.$element.trigger('checked.fu.checkbox');
		},

		uncheck: function() {
			this.$checkedElement.hide();
			this.$uncheckedElement.show();
			this.state.checked = false;
			this.$element.trigger('unchecked.fu.checkbox');
		},

		isChecked: function() {
			return this.state.checked;
		},

		toggle: function() {
			this.state.checked = !this.state.checked;

			this._ensureCheckedState();
		},

		toggleContainer: function() {
			if (Boolean(this.$toggleContainer)) {
				if (this.state.checked) {
					this.$toggleContainer.removeClass('hide');
					this.$toggleContainer.attr('aria-hidden', 'false');
				} else {
					this.$toggleContainer.addClass('hide');
					this.$toggleContainer.attr('aria-hidden', 'true');
				}
			}
		},

		itemchecked: function(element) {
			this.setState($(element.target));
		},

		destroy: function() {
			this.$parent.remove();
			// remove any external bindings
			// [none]
			// empty elements to return to original markup
			// [none]
			return this.$parent[0].outerHTML;
		},

		_clearDisabledClasses: function() {
			var classesToRemove = 'disabled';

			// this.$label.removeClass(classesToRemove);

			if (this.$parent) {
				this.$parent.removeClass(classesToRemove);
			}
		},

		_ensureCheckedState: function() {
			if (this.state.checked) {
				this.check();
			} else {
				this.uncheck();
			}
		},

		_ensureDisabledState: function() {
			if (this.state.disabled) {
				this.disable();
			} else {
				this.enable();
			}
		},

		_setDisabledClass: function() {
			// this.$label.addClass('disabled');

			if (this.$parent) {
				this.$parent.addClass('disabled');
			}
		}
	};


	// CHECKBOX PLUGIN DEFINITION

	$.fn.checkbox = function(option) {
		var args = Array.prototype.slice.call(arguments, 1);
		var methodReturn;

		var $set = this.each(function() {
			var $this = $(this);
			var data = $this.data('fu.checkbox');
			var options = typeof option === 'object' && option;

			if (!data) {
				$this.data('fu.checkbox', (data = new Checkbox(this, options)));
			}

			if (typeof option === 'string') {
				methodReturn = data[option].apply(data, args);
			}
		});

		return (methodReturn === undefined) ? $set : methodReturn;
	};

	$.fn.checkbox.defaults = {};

	$.fn.checkbox.Constructor = Checkbox;

	$.fn.checkbox.noConflict = function() {
		$.fn.checkbox = old;
		return this;
	};

	// DATA-API

	$(document).on('mouseover.fu.checkbox.data-api', '[data-initialize=checkbox]', function(e) {
		var $control = $(e.target).closest('.checkbox').find('[type=checkbox]');
		if (!$control.data('fu.checkbox')) {
			$control.checkbox($control.data());
		}
	});

	// Must be domReady for AMD compatibility
	$(function() {
		$('[data-initialize=checkbox] [type=checkbox]').each(function() {
			var $this = $(this);
			if (!$this.data('fu.checkbox')) {
				$this.checkbox($this.data());
			}
		});
	});

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
