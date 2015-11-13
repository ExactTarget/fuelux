define(function MyFormSnippet(require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Component = require('views/component');
	var DragHelperComponent = require('views/drag-helper-component');
	var PubSub = require('helper/pubsub');

	return Component.extend({
		events: {
			'click': 'preventPropagation',//stops checkbox / radio reacting.
			'mousedown': 'mouseDownHandler',
			'mouseup': 'mouseUpHandler'
		},

		mouseDownHandler: function mouseDownHandler(mouseDownEvent) {
			mouseDownEvent.stopPropagation();
			mouseDownEvent.preventDefault();
			var that = this;
			// show the edit field popover
			$('.popover').remove();
			this.$el.popover('show');
			$('.popover #save').on('click', this.saveHandler(that));
			$('.popover #cancel').on('click', this.cancelHandler(that));
			//add drag event or all but form name
			if (this.model.get('title') !== 'Form Name') {
				$('body').on('mousemove', function (mouseMoveEvent) {
					if (
						Math.abs(mouseDownEvent.pageX - mouseMoveEvent.pageX) > 10 ||
						Math.abs(mouseDownEvent.pageY - mouseMoveEvent.pageY) > 10
					) {
						that.$el.popover('destroy');
						PubSub.trigger('placedComponentDrag', mouseDownEvent, that.model);
						that.mouseUpHandler();
					}
				});
			}
		},

		preventPropagation: function preventPropagation(e) {
			e.stopPropagation();
			e.preventDefault();
		},

		mouseUpHandler: function mouseUpHandler(mouseUpEvent) {
			$('body').off('mousemove');
		},

		saveHandler: function saveHandler(boundContext) {
			return function (mouseEvent) {
				mouseEvent.preventDefault();

				var fields = $('.popover input:not([type=submit],[type=button]), textarea');

				_.each(fields, function (e) {
					var $e = $(e),
						type = $e.attr('data-type'),
						name = $e.attr('id');

					switch (type) {
						case 'checkbox':
							boundContext.model.setField(name, $e.is(':checked'));
							break;
						case 'input':
						case 'number':
							boundContext.model.setField(name, $e.val());
							break;
						case 'textarea':
							boundContext.model.setField(name, $e.val());
							break;
						case 'textarea-split':
							boundContext.model.setField(name,
								_.chain($e.val().split('\n'))
									.map(function (t) {
										return $.trim(t);
									})
									.filter(function (t) {
										return t.length > 0;
									})
									.value()
							);
							break;
						case 'select':
							var valarr = _.map($e.find('option'), function (e) {
								return {
									value: e.value,
									selected: e.selected,
									label: $(e).text()
								};
							});
							boundContext.model.setField(name, valarr);
							break;
					}
				});
				boundContext.model.trigger('change', boundContext.model);
				$('.popover').remove();
			};
		},

		cancelHandler: function cancelHandler(boundContext) {
			return function (mouseEvent) {
				mouseEvent.preventDefault();
				$('.popover').remove();
				boundContext.model.trigger('change', boundContext.model);
			};
		}
	});
});
