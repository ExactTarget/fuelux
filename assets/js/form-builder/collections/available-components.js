define(function Snippets(require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Component = require('models/component');
	var TabComponent = require('views/tab-component');

	return Backbone.Collection.extend({
		model: Component,
		renderAll: function() {
			return this.map(function(component) {
				return new TabComponent({
					model: component
				}).render();
			});
		}
	});
});
