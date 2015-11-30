define(function Component(require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var _PopoverMain = require('text!templates/popover/popover-main.html');
	var _PopoverInput = require('text!templates/popover/popover-input.html');
	var _PopoverNumber = require('text!templates/popover/popover-number.html');
	var _PopoverSelect = require('text!templates/popover/popover-select.html');
	var _PopoverTextArea = require('text!templates/popover/popover-textarea.html');
	var _PopoverTextAreaSplit = require('text!templates/popover/popover-textarea-split.html');
	var _PopoverCheckbox = require('text!templates/popover/popover-checkbox.html');
	var _componentTemplates = require('templates/component/component-templates');
	require('bootstrap');
	require('fuelux');

	return Backbone.View.extend({
		tagName: 'div',
		className: 'component',
		initialize: function initialize() {
			this.template = _.template(_componentTemplates[this.model.idFriendlyTitle()]);
			this.popoverTemplates = {
				'input': _.template(_PopoverInput),
				'number': _.template(_PopoverNumber),
				'select': _.template(_PopoverSelect),
				'textarea': _.template(_PopoverTextArea),
				'textarea-split': _.template(_PopoverTextAreaSplit),
				'checkbox': _.template(_PopoverCheckbox)
			};
		},
		render: function render(withAttributes) {
			var that = this;
			var content = _.template(_PopoverMain)({
				'title': that.model.get('title'),
				'items': that.model.get('fields'),
				'popoverTemplates': that.popoverTemplates
			});

			var theHTML = that.template(_.extend({}, {horizontal: true}, that.model.getValues()));
			if (withAttributes) {
				return this.$el.html(theHTML).attr({
					'data-content': content,
					'data-title': that.model.get('title'),
					'data-trigger': 'manual',
					'data-html': true
				});
			} else {
				return this.$el.html(theHTML);
			}
		}
	});
});
