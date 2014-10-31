/*
 * Fuel UX Tree
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
		this.$element.on('click.fu.tree', '.tree-branch-name', $.proxy( function(ev) { this.openFolder(ev.currentTarget); }, this));

		if( this.options.folderSelect ){
			this.$element.off('click.fu.tree', '.tree-branch-name');
			this.$element.on('click.fu.tree', '.icon-caret', $.proxy( function(ev) { this.openFolder($(ev.currentTarget).parent()); }, this));
			this.$element.on('click.fu.tree', '.tree-branch-name', $.proxy( function(ev) { this.selectFolder($(ev.currentTarget)); }, this));
		}

		this.render();
	};

	Tree.prototype = {
		constructor: Tree,

		destroy: function() {
			// any external bindings [none]
			// empty elements to return to original markup
			this.$element.find("li:not([data-template])").remove();

			this.$element.remove();
			// returns string of markup
			return this.$element[0].outerHTML;
		},

		render: function () {
			this.populate(this.$element);
		},

		populate: function ($el) {
			var self = this;
			var $parent = ($el.hasClass('tree')) ? $el : $el.parent();
			var loader = $parent.find('.tree-loader:eq(0)');
			var treeData = $parent.data();

			loader.removeClass('hide');
			this.options.dataSource( treeData ? treeData : {} , function (items) {
				loader.addClass('hide');

				$.each( items.data, function(index, value) {
					var $entity;

					if(value.type === 'folder') {
						$entity = self.$element.find('[data-template=treebranch]:eq(0)').clone().removeClass('hide').removeAttr('data-template');
						$entity.data(value);
						$entity.find('.tree-branch-name > .tree-label').html(value.text || value.name);
					} else if (value.type === 'item') {
						$entity = self.$element.find('[data-template=treeitem]:eq(0)').clone().removeClass('hide').removeAttr('data-template');
						$entity.find('.tree-item-name > .tree-label').html(value.text || value.name);
						$entity.data(value);
					}

					// Decorate $entity with data or other attributes making the
					// element easily accessable with libraries like jQuery.
					//
					// Values are contained within the object returned
					// for folders and items as attr:
					//
					// {
					//     text: "An Item",
					//     type: 'item',
					//     attr = {
					//         'classes': 'required-item red-text',
					//         'data-parent': parentId,
					//         'guid': guid,
					//         'id': guid
					//     }
					// };
					//
					// the "name" attribute is also supported but is deprecated for "text".

					// add attributes to tree-branch or tree-item
					var attr = value['attr'] || value.dataAttributes || [];
					$.each(attr, function(key, value) {
						switch (key) {
							case 'cssClass':
							case 'class':
							case 'className':
								$entity.addClass(value);
								break;

							// allow custom icons
							case 'data-icon':
								$entity.find('.icon-item').removeClass().addClass('icon-item ' + value);
								$entity.attr(key, value);
								break;

							// ARIA support
							case 'id':
								$entity.attr(key, value);
								$entity.attr('aria-labelledby', value + '-label');
								$entity.find('.tree-branch-name > .tree-label').attr('id', value + '-label');
								break;

							// id, style, data-*
							default:
								$entity.attr(key, value);
								break;
						}
					});

					// add child nodes
					if($el.hasClass('tree-branch-header')) {
						$parent.find('.tree-branch-children:eq(0)').append($entity);
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
			var selData = $el.data();
			var $all = this.$element.find('.tree-selected');
			var data = [];
			var $icon = $el.find('.icon-item');

			if (this.options.multiSelect) {
				$.each($all, function(index, value) {
					var $val = $(value);
					if($val[0] !== $el[0]) {
						data.push( $(value).data() );
					}
				});
			} else if ($all[0] !== $el[0]) {
				$all.removeClass('tree-selected')
					.find('.glyphicon').removeClass('glyphicon-ok').addClass('fueluxicon-bullet');
				data.push(selData);
			}

			var eventType = 'selected';
			if($el.hasClass('tree-selected')) {
				eventType = 'deselected';
				$el.removeClass('tree-selected');
				if($icon.hasClass('glyphicon-ok') || $icon.hasClass('fueluxicon-bullet') ) {
					$icon.removeClass('glyphicon-ok').addClass('fueluxicon-bullet');
				}
			} else {
				$el.addClass ('tree-selected');
				// add tree dot back in
				if($icon.hasClass('glyphicon-ok') || $icon.hasClass('fueluxicon-bullet') ) {
					$icon.removeClass('fueluxicon-bullet').addClass('glyphicon-ok');
				}
				if (this.options.multiSelect) {
					data.push( selData );
				}
			}

			this.$element.trigger(eventType + '.fu.tree', {target: selData, selected: data});

			// Return new list of selected items, the item
			// clicked, and the type of event:
			$el.trigger('updated.fu.tree', {
				selected: data,
				item: $el,
				eventType: eventType
			});
		},

		openFolder: function (el) {
			var $el = $(el); // tree-branch-name
			var $branch;
			var $treeFolderContent;
			var $treeFolderContentFirstChild;

			// if item select only
			if (!this.options.folderSelect) {
				$el = $(el).parent(); // tree-branch, if tree-branch-name clicked
			}

			$branch = $el.closest('.tree-branch'); // tree branch
			$treeFolderContent = $branch.find('.tree-branch-children');
			$treeFolderContentFirstChild = $treeFolderContent.eq(0);

			// manipulate branch/folder
			var eventType, classToTarget, classToAdd;
			if ($el.find('.glyphicon-folder-close').length) {
				eventType = 'opened';
				classToTarget = '.glyphicon-folder-close';
				classToAdd = 'glyphicon-folder-open';

				$branch.addClass('tree-open');
				$branch.attr('aria-expanded', 'true');

				$treeFolderContentFirstChild.removeClass('hide');
				if (!$treeFolderContent.children().length) {
					this.populate($treeFolderContent);
				}

			} else if($el.find('.glyphicon-folder-open')) {
				eventType = 'closed';
				classToTarget = '.glyphicon-folder-open';
				classToAdd = 'glyphicon-folder-close';

				$branch.removeClass('tree-open');
				$branch.attr('aria-expanded', 'false');
				$treeFolderContentFirstChild.addClass('hide');

				// remove if no cache
				if (!this.options.cacheItems) {
					$treeFolderContentFirstChild.empty();
				}

			}

			$branch.find('> .tree-branch-header .icon-folder').eq(0)
				.removeClass('glyphicon-folder-close glyphicon-folder-open')
				.addClass(classToAdd);

			this.$element.trigger(eventType + '.fu.tree', $branch.data());
		},

		selectFolder: function (clickedElement) {
			var $clickedElement = $(clickedElement);
			var $clickedBranch = $clickedElement.closest('.tree-branch');
			var $selectedBranch = this.$element.find('.tree-branch.tree-selected');
			var clickedData = $clickedBranch.data();
			var selectedData = [];
			var eventType = 'selected';

			// select clicked item
			if($clickedBranch.hasClass('tree-selected')) {
				eventType = 'deselected';
				$clickedBranch.removeClass('tree-selected');
			} else {
				$clickedBranch.addClass('tree-selected');
			}

			if (this.options.multiSelect) {

			// get currently selected
				$selectedBranch = this.$element.find('.tree-branch.tree-selected');

				$.each($selectedBranch, function(index, value) {
					var $value = $(value);
					if($value[0] !== $clickedElement[0]) {
						selectedData.push( $(value).data() );
					}
				});

			} else if ($selectedBranch[0] !== $clickedElement[0]) {
				$selectedBranch.removeClass('tree-selected');

				selectedData.push(clickedData);
			}

			this.$element.trigger(eventType + '.fu.tree', {target: clickedData, selected: selectedData});

			// Return new list of selected items, the item
			// clicked, and the type of event:
			$clickedElement.trigger('updated.fu.tree', {
				selected: selectedData,
				item: $clickedElement,
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
				var $folder = $parent.children('.tree-branch-children');

				$folder.addClass('hide');
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
			var data    = $this.data( 'fu.tree' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('fu.tree', (data = new Tree( this, options ) ) );
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
