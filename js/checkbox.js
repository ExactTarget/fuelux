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

	var Checkbox = function Checkbox(element, options) {
		this.options = $.extend({}, $.fn.checkbox.defaults, options);

		// cache elements
		this.$element = $(element).is('input[type="checkbox"]') ? $(element) : $(element).find('input[type="checkbox"]:first');

		this.$checkedElement = this.$element.parent();
		this.$checkedElement.addClass('checked').attr('checked', 'checked').prop('checked', true);

		this.$uncheckedElement = this.$checkedElement.clone();
		//clean up the unchecked checkbox, ensure double ids do not occur on the page if the starting element is the checkbox
		this.$uncheckedElement.attr('id', this.$checkedElement.attr('id') + 'unchecked');
		this.$uncheckedElement.removeClass('checked').removeAttr('checked').prop('checked', false);
		this.$uncheckedElement.find('input[type="checkbox"]:first').remove();
		this.$uncheckedElement = this.$uncheckedElement.insertAfter(this.$checkedElement);

		//need to bind toggle (click, spacebar, etc) events to BOTH of the checkboxes
		this.$checkedElement.on('click', $.proxy(this.toggle, this));
		this.$uncheckedElement.on('click', $.proxy(this.toggle, this));

		this.$parent = this.$checkedElement.parent('.checkbox');
		this.$linkedElement = this.$element.attr('data-toggle');
		this.state = {
			disabled: false,
			checked: false
		};

		if (this.$parent.length === 0) {
			this.$parent = null;
		}

		if (Boolean(this.$linkedElement)) {
			this.$linkedElement = $(this.$linkedElement);
		} else {
			this.$linkedElement = null;
		}

		// handle events
		this.$element.on('change.fu.checkbox', $.proxy(this.itemchecked, this));

		// set default state
		this._clearDisabledClasses();
		this.setState();
	};

	Checkbox.prototype = {

		constructor: Checkbox,

		setState: function setState($chk) {
			$chk = $chk || this.$element;

			this.state.disabled = Boolean($chk.prop('disabled'));
			this.setChecked(Boolean($chk.is(':checked')));

			// set state of checkbox
			this._ensureCheckedState();
			this._ensureDisabledState();

			//toggle container
			this.toggleLinkedElement();
		},

		enable: function enable() {
			this.state.disabled = false;
			this.$element.attr('disabled', this.state.disabled);
			this._clearDisabledClasses();
			this.$element.trigger('enabled.fu.checkbox');
		},

		disable: function disable() {
			this.state.disabled = true;
			this.$element.attr('disabled', this.state.disabled);
			this._setDisabledClass();
			this.$element.trigger('disabled.fu.checkbox');
		},

		check: function check() {
			this.setChecked(true);

			this.$uncheckedElement.hide();
			this.$checkedElement.show();

			this.$checkedElement.attr('checked', 'checked').prop('checked', this.isChecked()).toggleClass('checked', this.isChecked());
			this.$element.attr('checked', 'checked').prop('checked', this.isChecked()).toggleClass('checked', this.isChecked());
			if (!!this.$parent) {
				this.$parent.toggleClass('checked', this.isChecked());
			}

			this.$element.trigger('checked.fu.checkbox');
			this.toggleLinkedElement();
		},

		uncheck: function uncheck() {
			this.setChecked(false);

			this.$checkedElement.hide();
			this.$uncheckedElement.show();

			this.$checkedElement.removeAttr('checked').removeProp('checked').toggleClass('checked', this.isChecked());
			this.$element.removeAttr('checked').prop('checked', this.isChecked()).toggleClass('checked', this.isChecked());
			if (!!this.$parent) {
				this.$parent.toggleClass('checked', this.isChecked());
			}

			this.$element.trigger('unchecked.fu.checkbox');
			this.toggleLinkedElement();
		},

		isChecked: function isChecked() {
			return this.state.checked;
		},

		setChecked: function setChecked(state){
			this.state.checked = state;
		},

		toggle: function toggle(e) {
			//keep event from bubbling into the checkbox, causing the checkbox to cycle immediately back into the last state and appearing as if nothing happened.
			if (!!e) {
				e.preventDefault();
			}

			//keep disabled checkboxen from being interactive
			if (this.state.disabled) {
				return;
			}

			this.setChecked(!this.isChecked());

			this._ensureCheckedState(e);
		},

		toggleLinkedElement: function toggleLinkedElement() {
			if (Boolean(this.$linkedElement)) {
				this.$linkedElement.toggleClass('hide', this.isChecked());
				this.$linkedElement.attr('aria-hidden', this.isChecked().toString());
			}
		},

		itemchecked: function itemchecked(element) {
			this.setState($(element.target));
		},

		destroy: function destroy() {
			this.$parent.remove();
			//clean up original checkbox in case they re-insert elsewhere. Removing uncheckedElement keeps it from getting duplicated on re-init
			this.$uncheckedElement.remove();
			//Make sure that checkedElement is visible if they re-insert elsewhere.
			this.$checkedElement.show();
			// remove any external bindings
			// [none]
			// empty elements to return to original markup
			// [none]
			return this.$parent[0].outerHTML;
		},

		_clearDisabledClasses: function _clearDisabledClasses() {
			var classesToRemove = 'disabled';

			if (this.$parent) {
				this.$parent.removeClass(classesToRemove);
			}
		},

		_ensureCheckedState: function _ensureCheckedState(e) {
			if (this.isChecked()) {
				this.check(e);
			} else {
				this.uncheck(e);
			}
		},

		_ensureDisabledState: function _ensureDisabledState() {
			if (this.state.disabled) {
				this.disable();
			} else {
				this.enable();
			}
		},

		_setDisabledClass: function _setDisabledClass() {
			if (this.$parent) {
				this.$parent.addClass('disabled');
			}
		}
	};


	// CHECKBOX PLUGIN DEFINITION

	$.fn.checkbox = function checkbox(option) {
		var args = Array.prototype.slice.call(arguments, 1);
		var methodReturn;

		var $set = this.each(function() {
			var $this = $(this);
			var data = $this.data('fu.checkbox') || $this.find('[type=checkbox]').data('fu.checkbox');
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

	$.fn.checkbox.noConflict = function noConflict() {
		$.fn.checkbox = old;
		return this;
	};

	// DATA-API

	$(document).on('mouseover.fu.checkbox.data-api', '[data-initialize=checkbox]', function onmouseover_checkbox(e) {
		var $control = $(e.target).closest('.checkbox').find('[type=checkbox]');
		if (!$control.data('fu.checkbox')) {
			$control.checkbox($control.data());
		}
	});

	// Must be domReady for AMD compatibility
	$(function() {
		$('[data-initialize=checkbox] [type=checkbox]').each(function initialize_checkboxen() {
			var $this = $(this);
			if (!$this.data('fu.checkbox')) {
				$this.checkbox($this.data());
			}
		});
	});

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
