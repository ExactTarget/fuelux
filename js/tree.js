/*
 * Fuel UX Tree
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the MIT license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// For more information on UMD visit: 
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {
	// -- END UMD WRAPPER PREFACE --
		
	// -- BEGIN MODULE CODE HERE --

	var old = $.fn.tree;

	// TREE CONSTRUCTOR AND PROTOTYPE

	var Tree = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.tree.defaults, options);

		this.$element.on('click.fu.tree', '.tree-item', $.proxy( function(ev) { this.selectItem(ev.currentTarget); } ,this));
		this.$element.on('click.fu.tree', '.tree-folder-header', $.proxy( function(ev) { this.openFolder(ev.currentTarget); }, this));

		if( this.options.folderSelect ){
			this.$element.on('click.fu.tree', '.tree-folder-name', $.proxy( function(ev) { this.selectFolder(ev.currentTarget); }, this));
		}

		this.render();
	};

	Tree.prototype = {
		constructor: Tree,

		render: function () {
			this.populate(this.$element);
		},

		populate: function ($el) {
			var self = this;
			var $parent = $el.parent();
			var loader = $parent.find('.tree-loader:eq(0)');

			loader.show();
			this.options.dataSource($el.data(), function (items) {
				loader.hide();

				$.each( items.data, function(index, value) {
					var $entity;

					if(value.type === "folder") {
						$entity = self.$element.find('.tree-folder:eq(0)').clone().show();
						$entity.find('.tree-folder-name').html(value.name);
						$entity.find('.tree-folder-header').data(value);
					} else if (value.type === "item") {
						$entity = self.$element.find('.tree-item:eq(0)').clone().show();
						$entity.find('.tree-item-name').html(value.name);
						$entity.data(value);
					}

					// Decorate $entity with data making the element
					// easily accessable with libraries like jQuery.
					//
					// Values are contained within the object returned
					// for folders and items as dataAttributes:
					//
					// {
					//     name: "An Item",
					//     type: 'item',
					//     dataAttributes = {
					//         'classes': 'required-item red-text',
					//         'data-parent': parentId,
					//         'guid': guid
					//     }
					// };

					var dataAttributes = value.dataAttributes || [];
					$.each(dataAttributes, function(key, value) {
						switch (key) {
						case 'class':
						case 'classes':
						case 'className':
							$entity.addClass(value);
							break;

						// id, style, data-*
						default:
							$entity.attr(key, value);
							break;
						}
					});

					if($el.hasClass('tree-folder-header')) {
						$parent.find('.tree-folder-content:eq(0)').append($entity);
					} else {
						$el.append($entity);
					}
				});

				// return newly populated folder
				self.$element.trigger('loaded.fu.tree', $parent);
			});
		},

		selectItem: function (el) {
			var $el = $(el);
			var $all = this.$element.find('.tree-selected');
			var data = [];

			if (this.options.multiSelect) {
				$.each($all, function(index, value) {
					var $val = $(value);
					if($val[0] !== $el[0]) {
						data.push( $(value).data() );
					}
				});
			} else if ($all[0] !== $el[0]) {
				$all.removeClass('tree-selected')
					.find('i').removeClass('glyphicon-ok').addClass('tree-dot');
				data.push($el.data());
			}

			var eventType = 'selected';
			if($el.hasClass('tree-selected')) {
				eventType = 'unselected';
				$el.removeClass('tree-selected');
				$el.find('i').removeClass('glyphicon-ok').addClass('tree-dot');
			} else {
				$el.addClass ('tree-selected');
				$el.find('i').removeClass('tree-dot').addClass('glyphicon-ok');
				if (this.options.multiSelect) {
					data.push( $el.data() );
				}
			}

			if(data.length) {
				this.$element.trigger('selected', {info: data});
			}

			// Return new list of selected items, the item
			// clicked, and the type of event:
			$el.trigger('updated.fu.tree', {
				info: data,
				item: $el,
				eventType: eventType
			});
		},

		openFolder: function (el) {
			var $el = $(el);
			var $parent = $el.parent();
			var $treeFolderContent = $parent.find('.tree-folder-content');
			var $treeFolderContentFirstChild = $treeFolderContent.eq(0);

			var eventType, classToTarget, classToAdd;
			if ($el.find('.glyphicon-folder-close').length) {
				eventType = 'opened';
				classToTarget = '.glyphicon-folder-close';
				classToAdd = 'glyphicon-folder-open';

				$treeFolderContentFirstChild.show();
				if (!$treeFolderContent.children().length) {
					this.populate($el);
				}

				if( this.options.folderSelect ){
					$el.find('.tree-triangle-right')
						.removeClass('tree-triangle-right')
						.addClass('tree-triangle-down');
				}
			} else {
				eventType = 'closed';
				classToTarget = '.glyphicon-folder-open';
				classToAdd = 'glyphicon-folder-close';

				$treeFolderContentFirstChild.hide();
				if (!this.options.cacheItems) {
					$treeFolderContentFirstChild.empty();
				}

				if( this.options.folderSelect ){
					$el.find('.tree-triangle-down')
						.removeClass('tree-triangle-down')
						.addClass('tree-triangle-right');
				}
			}

			$parent.find(classToTarget).eq(0)
				.removeClass('glyphicon-folder-close glyphicon-folder-open')
				.addClass(classToAdd);

			this.$element.trigger(eventType, $el.data());
		},

		selectFolder: function (el) {
			var $el = $(el);
			var $all = this.$element.find('.tree-folder-name.tree-selected');
			var data = [];
			var eventType = 'selected';

			if (this.options.multiSelect) {
				$.each($all, function(index, value) {
					var $val = $(value);
					if($val[0] !== $el[0]) {
						data.push( $(value).parent().find('.tree-folder-header').data() );
					}
				});
			} else if ($all[0] !== $el[0]) {
				$all.removeClass('tree-selected');
				data.push($el.parent().find('.tree-folder-header').data());
			}

			if($el.hasClass('tree-selected')) {
				eventType = 'unselected';
				$el.removeClass('tree-selected');
			} else {
				$el.addClass('tree-selected');
			}

			if(data.length) {
				this.$element.trigger('selected.fu.tree', {info: data});
			}

			// Return new list of selected items, the item
			// clicked, and the type of event:
			$el.trigger('updated.fu.tree', {
				info: data,
				item: $el,
				eventType: eventType
			});
		},

		selectedItems: function () {
			var $sel = this.$element.find('.tree-selected');
			var data = [];

			$.each($sel, function (index, value) {
				data.push($(value).data());
			});
			return data;
		},

		// collapses open folders
		collapse: function () {
			var cacheItems = this.options.cacheItems;

			// find open folders
			this.$element.find('.icon-folder-open').each(function () {
				// update icon class
				var $this = $(this)
					.removeClass('icon-folder-close icon-folder-open')
					.addClass('icon-folder-close');

				// "close" or empty folder contents
				var $parent = $this.parent().parent();
				var $folder = $parent.children('.tree-folder-content');

				$folder.hide();
				if (!cacheItems) {
					$folder.empty();
				}
			});
		}
	};


	// TREE PLUGIN DEFINITION

	$.fn.tree = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data( 'tree' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('tree', (data = new Tree( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.tree.defaults = {
		dataSource: function(options, callback){},
		multiSelect: false,
		cacheItems: true,
		folderSelect: true
	};

	$.fn.tree.Constructor = Tree;

	$.fn.tree.noConflict = function () {
		$.fn.tree = old;
		return this;
	};


	// NO DATA-API DUE TO NEED OF DATA-SOURCE

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
	// -- END UMD WRAPPER AFTERWORD --
