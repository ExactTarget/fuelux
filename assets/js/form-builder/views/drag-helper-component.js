define(function TempSnippet(require) {
	var $ = require('jquery');
	var Component = require('views/component');
	var _dragHelperTemplate = require('text!templates/app/drag-helper-component.html');
	var PubSub = require('helper/pubsub');
	var myForm = require('models/my-form');

	return Component.extend({
		className: 'drag-helper-component',
		events: {
			'mousemove': 'mouseMoveHandler',
			'mouseup': 'mouseUpHandler'
		},
		initialize: function initialize() {
			PubSub.on('newDragHelperPostRender', this.postRender, this);
			this.constructor.__super__.initialize.call(this);
			this.dragHelperTemplate = _.template(_dragHelperTemplate);
		},
		render: function render() {
			return this.$el.html(this.dragHelperTemplate({
				text: this.constructor.__super__.render.call(this).html(),
				horizontal: myForm.get('horizontal')
			}));
		},
		postRender: function postRender(mouseEvent) {
			this.tempForm = this.$el.find('form')[0];
			this.halfHeight = Math.floor(this.tempForm.clientHeight / 2);
			this.halfWidth = Math.floor(this.tempForm.clientWidth / 2);
			this.centerOnEvent(mouseEvent);
		},
		centerOnEvent: function centerOnEvent(mouseEvent) {
			var mouseX = mouseEvent.pageX;
			var mouseY = mouseEvent.pageY;
			this.tempForm.style.top = (mouseY - this.halfHeight) + 'px';
			this.tempForm.style.left = (mouseX - this.halfWidth) + 'px';
			// Make sure the element has been drawn and
			// has height in the dom before triggering.
			PubSub.trigger('dragHelperMove', mouseEvent);
		},
		mouseMoveHandler: function mouseMoveHandler(mouseEvent) {
			mouseEvent.preventDefault();
			this.centerOnEvent(mouseEvent);
		},
		mouseUpHandler: function mouseUpHandler(mouseEvent) {
			mouseEvent.preventDefault();
			PubSub.trigger('dragHelperDrop', mouseEvent, this.model);
			this.remove();
		}
	});
});
