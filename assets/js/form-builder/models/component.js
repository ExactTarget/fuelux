/*

A Form Builder component.

*/
define(function Snippet(require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');

	return Backbone.Model.extend({
		getValues: function getValues() {
			return _.reduce(this.get('fields'), function (fields, field, index) {
				if (field.type === 'select') {
					fields[index] = _.find(field.value, function (fields) {
						return fields.selected;
					}).value;
				} else {
					fields[index] = field.value;
				}

				return fields;
			}, {});
		},
		// I believe this takes a title (as defined in JSON data structure in /data folder)
		// and translates it from "A Name" into "a-name" which will correspond with
		// a variable name in /templates/component/component_templates.js.
		idFriendlyTitle: function idFriendlyTitle() {
			return this.get('title').replace(/\W/g, '_').toLowerCase();
		},
		setField: function setField(name, value) {
			var fields = this.get('fields');
			fields[name].value = value;
			this.set('fields', fields);
		}
	});
});
