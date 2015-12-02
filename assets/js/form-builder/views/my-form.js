define(function MyForm(require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var DragHelperComponent = require('views/drag-helper-component');
	var PubSub = require('helper/pubsub');
	var _renderForm = require('text!templates/app/renderform.html');

	var myForm = require('models/my-form');

	return Backbone.View.extend({
		tagName: 'fieldset',
		initialize: function initialize() {
			this.collection.on('add', this.render, this);
			this.collection.on('remove', this.render, this);
			this.collection.on('change', this.render, this);
			PubSub.on('placedComponentDrag', this.handlePlacedComponentDrag, this);
			PubSub.on('dragHelperMove', this.handleDragHelperMove, this);
			PubSub.on('dragHelperDrop', this.handleDragHelperDrop, this);
			PubSub.on('horizontalToggle', this.handleHorizontalToggle, this);
			this.$build = $('#build');
			this.renderForm = _.template(_renderForm);
			this.render();

			$('#horizontal-toggle').on('change', function (e) {
				PubSub.trigger('horizontalToggle', e, this);
			});
		},

		render: function render() {
			var self = this;

			//Render Snippet Views
			this.$el.empty();

			if(myForm.get('horizontal')){
				$('#target').addClass('form-horizontal');
			}

			_.each(this.collection.renderAll(), function (component) {
				self.$el.append(component);
			});

			myForm.set({text: _.map(this.collection.renderAllClean(), function (e) {
					return e.html();
				}).join('\n')
				, horizontal: myForm.get('horizontal')
			});

			$('#render').val(self.renderForm(myForm.attributes));
			this.$el.appendTo('#build form');
			this.delegateEvents();
		},

		getBottomAbove: function getBottomAbove(eventY) {
			var myFormBits = $(this.$el.find('.component'));
			var topelement = _.find(myFormBits, function (renderedSnippet) {
				if (($(renderedSnippet).offset().top + $(renderedSnippet).height()) > eventY - 90) {
					return true;
				} else {
					return false;
				}
			});
			if (topelement) {
				return topelement;
			} else {
				return myFormBits[0];
			}
		},

		handlePlacedComponentDrag: function handlePlacedComponentDrag(mouseEvent, snippetModel) {
			$('body').append(new DragHelperComponent({
				model: snippetModel,
				horizontal: myForm.get('horizontal')
			}).render());
			this.collection.remove(snippetModel);
			PubSub.trigger('newDragHelperPostRender', mouseEvent);
		},

		handleHorizontalToggle: function handleHorizontalToggle(mouseEvent) {
			myForm.set({horizontal: $('#horizontal-toggle').checkbox('isChecked')});
			this.render();
		},

		mouseInBounds: function mouseInBounds(mouseEvent, $build) {
			return (
				mouseEvent.pageX >= $build.offset().left &&
				mouseEvent.pageX < ($build.width() + $build.offset().left) &&
				mouseEvent.pageY >= $build.offset().top &&
				mouseEvent.pageY < ($build.height() + $build.offset().top)
			);
		},

		handleDragHelperMove: function handleDragHelperMove(mouseEvent) {
			$('.target').removeClass('target');

			if (this.mouseInBounds(mouseEvent, this.$build)) {
				$(this.getBottomAbove(mouseEvent.pageY)).addClass('target');
			}
		},

		handleDragHelperDrop: function handleDragHelperDrop(mouseEvent, model) {
			var index = $('.target').index();
			$('.target').removeClass('target');

			if (this.mouseInBounds(mouseEvent, this.$build)) {
				this.collection.add(model, {
					at: index + 1
				});
			}
		}
	});
});
