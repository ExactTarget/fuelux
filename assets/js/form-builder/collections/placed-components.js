define(function placedComponent(require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Component = require('models/component');
	var AvailableComponents = require('collections/available-components');
	var PlacedComponent = require('views/placed-component');

	return AvailableComponents.extend({
		model: Component,
		renderAll: function () {
			return this.map(function (component) {
				return new PlacedComponent({
					model: component
				}).render(true);
			});
		},
		renderAllClean: function () {
			return this.map(function (component) {
				return new PlacedComponent({
					model: component
				}).render(false);
			});
		}
	});
});
