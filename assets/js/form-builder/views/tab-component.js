define(function TabSnippet(require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var SnippetModel = require('models/component');
	var SnippetView = require('views/component');
	var DragHelperComponent = require('views/drag-helper-component');
	var PubSub = require('helper/pubsub');

	return SnippetView.extend({
		events: {
			'mousedown': 'mouseDownHandler'
		},
		mouseDownHandler: function mouseDownHandler(mouseDownEvent) {
			mouseDownEvent.preventDefault();
			mouseDownEvent.stopPropagation();
			//hide all popovers
			$('.popover').hide();
			$('body').append(new DragHelperComponent({
				model: new SnippetModel($.extend(true, {}, this.model.attributes))
			}).render());
			PubSub.trigger('newDragHelperPostRender', mouseDownEvent);
		}
	});
});
