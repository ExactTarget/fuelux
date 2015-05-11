/*
 * Fuel UX Repeater - Thumbnail View Plugin
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the BSD New license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// For more information on UMD visit:
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery', 'fuelux/repeater'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {
	// -- END UMD WRAPPER PREFACE --

	// -- BEGIN MODULE CODE HERE --

	if ($.fn.repeater) {
		//ADDITIONAL METHODS
		$.fn.repeater.Constructor.prototype.thumbnail_clearSelectedItems = function () {
			this.$canvas.find('.repeater-thumbnail-cont .selectable.selected').removeClass('selected');
		};

		$.fn.repeater.Constructor.prototype.thumbnail_getSelectedItems = function () {
			var selected = [];
			this.$canvas.find('.repeater-thumbnail-cont .selectable.selected').each(function () {
				selected.push($(this));
			});
			return selected;
		};

		$.fn.repeater.Constructor.prototype.thumbnail_setSelectedItems = function (items, force) {
			var selectable = this.viewOptions.thumbnail_selectable;
			var self = this;
			var i, $item, l, n;

			//this function is necessary because lint yells when a function is in a loop
			function compareItemIndex () {
				if (n === items[i].index) {
					$item = $(this);
					return false;
				} else {
					n++;
				}
			}

			//this function is necessary because lint yells when a function is in a loop
			function compareItemSelector () {
				$item = $(this);
				if ($item.is(items[i].selector)) {
					selectItem($item, items[i].selected);
				}
			}

			function selectItem ($itm, select) {
				select = (select !== undefined) ? select : true;
				if (select) {
					if (!force && selectable !== 'multi') {
						self.thumbnail_clearSelectedItems();
					}

					$itm.addClass('selected');
				} else {
					$itm.removeClass('selected');
				}
			}

			if (!$.isArray(items)) {
				items = [items];
			}

			if (force === true || selectable === 'multi') {
				l = items.length;
			} else if (selectable) {
				l = (items.length > 0) ? 1 : 0;
			} else {
				l = 0;
			}

			for (i = 0; i < l; i++) {
				if (items[i].index !== undefined) {
					$item = $();
					n = 0;
					this.$canvas.find('.repeater-thumbnail-cont .selectable').each(compareItemIndex);
					if ($item.length > 0) {
						selectItem($item, items[i].selected);
					}

				} else if (items[i].selector) {
					this.$canvas.find('.repeater-thumbnail-cont .selectable').each(compareItemSelector);
				}
			}
		};

		//ADDITIONAL DEFAULT OPTIONS
		$.fn.repeater.defaults = $.extend({}, $.fn.repeater.defaults, {
			thumbnail_alignment: 'left',
			thumbnail_infiniteScroll: false,
			thumbnail_itemRendered: null,
			thumbnail_noItemsHTML: 'no items found',
			thumbnail_selectable: false,
			thumbnail_template: '<div class="thumbnail repeater-thumbnail"><img height="75" src="{{src}}" width="65"><span>{{name}}</span></div>'
		});

		//EXTENSION DEFINITION
		$.fn.repeater.viewTypes.thumbnail = {
			selected: function () {
				var infScroll = this.viewOptions.thumbnail_infiniteScroll;
				var opts;
				if (infScroll) {
					opts = (typeof infScroll === 'object') ? infScroll : {};
					this.infiniteScrolling(true, opts);
				}
			},
			before: function (helpers) {
				var alignment = this.viewOptions.thumbnail_alignment;
				var $cont = this.$canvas.find('.repeater-thumbnail-cont');
				var data = helpers.data;
				var response = {};
				var $empty, validAlignments;

				if ($cont.length < 1) {
					$cont = $('<div class="clearfix repeater-thumbnail-cont" data-container="true" data-infinite="true" data-preserve="shallow"></div>');
					if (alignment && alignment !== 'none') {
						validAlignments = {
							'center': 1,
							'justify': 1,
							'left': 1,
							'right': 1
						};
						alignment = (validAlignments[alignment]) ? alignment : 'justify';
						$cont.addClass('align-' + alignment);
						this.thumbnail_injectSpacers = true;
					} else {
						this.thumbnail_injectSpacers = false;
					}
					response.item = $cont;
				} else {
					response.action = 'none';
				}

				if (data.items && data.items.length < 1) {
					$empty = $('<div class="empty"></div>');
					$empty.append(this.viewOptions.thumbnail_noItemsHTML);
					$cont.append($empty);
				} else {
					$cont.find('.empty:first').remove();
				}

				return response;
			},
			renderItem: function (helpers) {
				var selectable = this.viewOptions.thumbnail_selectable;
				var selected = 'selected';
				var self = this;
				var $thumbnail = $(fillTemplate(helpers.subset[helpers.index], this.viewOptions.thumbnail_template));

				if (selectable) {
					$thumbnail.addClass('selectable');
					$thumbnail.on('click', function () {
						if (!$thumbnail.hasClass(selected)) {
							if (selectable !== 'multi') {
								self.$canvas.find('.repeater-thumbnail-cont .selectable.selected').each(function () {
									var $itm = $(this);
									$itm.removeClass(selected);
									self.$element.trigger('deselected.fu.repeaterThumbnail', $itm);
								});
							}

							$thumbnail.addClass(selected);
							self.$element.trigger('selected.fu.repeaterThumbnail', $thumbnail);
						} else {
							$thumbnail.removeClass(selected);
							self.$element.trigger('deselected.fu.repeaterThumbnail', $thumbnail);
						}
					});
				}

				helpers.container.append($thumbnail);
				if (this.thumbnail_injectSpacers) {
					$thumbnail.after('<span class="spacer">&nbsp;</span>');
				}

				if (this.viewOptions.thumbnail_itemRendered) {
					this.viewOptions.thumbnail_itemRendered({
						container: helpers.container,
						item: $thumbnail,
						itemData: helpers.subset[helpers.index]
					}, function () {});
				}

				return false;
			}
		};
	}

	//ADDITIONAL METHODS
	function fillTemplate (itemData, template) {
		var invalid = false;

		function replace () {
			var end, start, val;

			start = template.indexOf('{{');
			end = template.indexOf('}}', start + 2);

			if (start > -1 && end > -1) {
				val = $.trim(template.substring(start + 2, end));
				val = (itemData[val] !== undefined) ? itemData[val] : '';
				template = template.substring(0, start) + val + template.substring(end + 2);
			} else {
				invalid = true;
			}
		}

		while (!invalid && template.search('{{') >= 0) {
			replace(template);
		}

		return template;
	}

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
