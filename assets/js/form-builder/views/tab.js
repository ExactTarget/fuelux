define(function Tab(require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var _tabNavTemplate = require('text!templates/app/tab-nav.html');

	return Backbone.View.extend({
		tagName: 'div',
		className: 'tab-pane',
		initialize: function initialize(options) {
			this.options = options;
			this.id = this.options.title.toLowerCase().replace(/\W/g, '');
			this.tabNavTemplate = _.template(_tabNavTemplate);
			this.render();
		},
		render: function render() {
			// Render Snippet Views
			var that = this;
			if (that.collection !== undefined) {
				_.each(this.collection.renderAll(), function(component) {
					that.$el.append(component);
				});
			} else if (that.options.content) {
				that.$el.append(that.options.content);
			}
			// Render & append nav for tab
			$('#formtabs').append(this.tabNavTemplate({
				title: this.options.title,
				id: this.id
			}));
			// Render tab
			this.$el.attr('id', this.id);
			this.$el.appendTo('.tab-content');
			this.delegateEvents();
		}
	});
});
