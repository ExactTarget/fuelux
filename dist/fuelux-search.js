define(['require','jquery'],function(require) {

	var $ = require('jquery');


	// SEARCH CONSTRUCTOR AND PROTOTYPE

	var Search = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.search.defaults, options);
		this.$element.find('button').on('click', $.proxy(this.buttonclicked, this));
		this.$input = this.$element.find('input');
		this.$icon = this.$element.find('i');
		this.state = 'idle';
	};

	Search.prototype = {

		constructor: Search,

		action: function () {
			var val;

			if (this.state === 'idle' && (val = this.$input.val())) {
				this.$element.trigger('searched', val);
				this.$icon.attr('class', 'icon-remove');
				this.state = 'active';
			} else {
				this.$icon.attr('class', 'icon-search');
				this.$input.val('');
				this.state = 'idle';
			}
		},

		buttonclicked: function (e) {
			e.preventDefault();
			this.action();
		}

	};


	// SEARCH PLUGIN DEFINITION

	$.fn.search = function (option) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('search');
			var options = typeof option === 'object' && option;

			if (!data) $this.data('search', (data = new Search(this, options)));
			if (typeof option === 'string') data[option]();
		});
	};

	$.fn.search.defaults = {};

	$.fn.search.Constructor = Search;


	// SEARCH DATA-API

	$(function () {
		$('body').on('mousedown.search.data-api', '.search', function () {
			var $this = $(this);
			if ($this.data('search')) return;
			$this.search($this.data());
		});
	});

});
