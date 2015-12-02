define(function Snippet(require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');

	var myForm = new Backbone.Model({
		horizontal: $('#horizontal-toggle').checkbox('isChecked')
	});

	myForm.refreshHorizontalSetting = function refreshHorizontalSetting() {
		myForm.set({horizontal: $('#horizontal-toggle').checkbox('isChecked')});
	}

	return myForm;
});
