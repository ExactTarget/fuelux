/*
 * FuelUX Fileupload
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

define(['require','jquery'],function(require) {

	var $ = require('jquery');


	// FILEUPLOAD CONSTRUCTOR AND PROTOTYPE

	var Fileupload = function (element, options) {
		this.$element = $(element);
		this.type = this.$element.data('uploadtype') || (this.$element.find('.thumbnail').length > 0 ? "image" : "file");
		
		this.$input = this.$element.find(':file');
		if (this.$input.length === 0) { 
			return; 
		}
		
		this.name = this.$input.attr('name') || options.name;
		
		this.$hidden = this.$element.find(':hidden[name="'+this.name+'"]');
		if (this.$hidden.length === 0) {
			this.$hidden = $('<input type="hidden" />');
			this.$element.prepend(this.$hidden);
		}

		this.$preview = this.$element.find('.fileupload-preview');
		var height = this.$preview.css('height');
		if (this.$preview.css('display') !== 'inline' && height !== '0px' && height !== 'none') {
			this.$preview.css('line-height', height);
		}

		this.$remove = this.$element.find('[data-dismiss="fileupload"]');
		
		this.listen();
	};

	Fileupload.prototype = {

		constructor: Fileupload,

		listen: function() {
			this.$input.on('change.fileupload', $.proxy(this.change, this));
			if (this.$remove) { 
				this.$remove.on('click.fileupload', $.proxy(this.clear, this)); 
			}
		},

		change: function(e, invoked) {
			var file = e.target.files !== undefined ? e.target.files[0] : { name: e.target.value.replace(/^.+\\/, '') };
			if (!file || invoked === 'clear') {
				return;
			}
			
			this.$hidden.val('');
			this.$hidden.attr('name', '');
			this.$input.attr('name', this.name);

			if (this.type === "image" && this.$preview.length > 0 && (typeof file.type !== "undefined" ? file.type.match('image.*') : file.name.match('\\.(gif|png|jpe?g)$')) && typeof FileReader !== "undefined") {
				var reader = new FileReader();
				var preview = this.$preview;
				var element = this.$element;

				reader.onload = function(e) {
					preview.html('<img src="' + e.target.result + '" ' + (preview.css('max-height') !== 'none' ? 'style="max-height: ' + preview.css('max-height') + ';"' : '') + ' />');
					element.addClass('fileupload-exists').removeClass('fileupload-new');
				};

				reader.readAsDataURL(file);
			} else {
				this.$preview.text(file.name);
				this.$element.addClass('fileupload-exists').removeClass('fileupload-new');
			}
		},

		clear: function(e) {
			this.$hidden.val('');
			this.$hidden.attr('name', this.name);
			this.$input.attr('name', '');

			this.$preview.html('');
			this.$element.addClass('fileupload-new').removeClass('fileupload-exists');

			this.$input.trigger('change', [ 'clear' ]);

			e.preventDefault();
			return false;
		}
	};


	// FILEUPLOAD PLUGIN DEFINITION

	$.fn.fileupload = function (options) {
		return this.each(function () {
			var $this = $(this), data = $this.data('fileupload');
			if (!data) { 
				$this.data('fileupload', (data = new Fileupload(this, options))); 
			}
		});
	};

	$.fn.fileupload.Constructor = Fileupload;

	// FILEUPLOAD DATA-API

	$(function () {
		$('body').on('click.fileupload.data-api', '[data-provides="fileupload"]', function (e) {
			var $this = $(this);
			if ($this.data('fileupload')) {
				return;
			}
			$this.fileupload($this.data());
			
			if ($(e.target).data('dismiss') === 'fileupload') {
				$(e.target).trigger('click.fileupload');
			}
		});
	});
});