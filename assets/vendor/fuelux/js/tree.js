/* global jQuery:true */

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

(function umdFactory (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function TreeWrapper ($) {
	// -- END UMD WRAPPER PREFACE --

	// -- BEGIN MODULE CODE HERE --

	var old = $.fn.tree;

	// TREE CONSTRUCTOR AND PROTOTYPE

	var Tree = function Tree(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.tree.defaults, options);

		this.$element.attr('tabindex', '0');

		if (this.options.itemSelect) {
			this.$element.on('click.fu.tree', '.tree-item', $.proxy(function callSelect (ev) {
				this.selectItem(ev.currentTarget);
			}, this));
		}

		this.$element.on('click.fu.tree', '.tree-branch-name', $.proxy(function callToggle (ev) {
			this.toggleFolder(ev.currentTarget);
		}, this));

		this.$element.on('click.fu.tree', '.tree-overflow', $.proxy(function callPopulate (ev) {
			this.populate($(ev.currentTarget));
		}, this));

		// folderSelect default is true
		if (this.options.folderSelect) {
			this.$element.addClass('tree-folder-select');
			this.$element.off('click.fu.tree', '.tree-branch-name');
			this.$element.on('click.fu.tree', '.icon-caret', $.proxy(function callToggle (ev) {
				this.toggleFolder($(ev.currentTarget).parent());
			}, this));
			this.$element.on('click.fu.tree', '.tree-branch-name', $.proxy(function callSelect (ev) {
				this.selectFolder($(ev.currentTarget));
			}, this));
		}

		this.$element.on('focus', function setFocusOnTab () {
			var $tree = $(this);
			focusIn($tree, $tree);
		});

		this.$element.on('keydown', function processKeypress (e) {
			return navigateTree($(this), e);
		});

		this.render();
	};

	Tree.prototype = {
		constructor: Tree,

		deselectAll: function deselectAll(n) {
			// clear all child tree nodes and style as deselected
			var nodes = n || this.$element;
			var $selectedElements = $(nodes).find('.tree-selected');
			$selectedElements.each(function callStyleNodeDeselected (index, element) {
				var $element = $(element);
				ariaDeselect($element);
				styleNodeDeselected( $element, $element.find( '.glyphicon' ) );
			});
			return $selectedElements;
		},

		destroy: function destroy() {
			// any external bindings [none]
			// empty elements to return to original markup
			this.$element.find('li:not([data-template])').remove();

			this.$element.remove();
			// returns string of markup
			return this.$element[0].outerHTML;
		},

		render: function render() {
			this.populate(this.$element);
		},

		populate: function populate($el, ibp) {
			var self = this;

			// populate was initiated based on clicking overflow link
			var isOverflow = $el.hasClass('tree-overflow');

			var $parent = ($el.hasClass('tree')) ? $el : $el.parent();
			var atRoot = $parent.hasClass('tree');

			if (isOverflow && !atRoot) {
				$parent = $parent.parent();
			}

			var treeData = $parent.data();
			// expose overflow data to datasource so it can be responded to appropriately.
			if (isOverflow) {
				treeData.overflow = $el.data();
			}

			var isBackgroundProcess = ibp || false;	// no user affordance needed (ex.- "loading")

			if (isOverflow) {
				if (atRoot) {
					// the loader at the root level needs to continually replace the overflow trigger
					// otherwise, when loader is shown below, it will be the loader for the last folder
					// in the tree, instead of the loader at the root level.
					$el.replaceWith($parent.find('> .tree-loader').remove());
				} else {
					$el.remove();
				}
			}

			var $loader = $parent.find('.tree-loader:last');

			if (isBackgroundProcess === false) {
				$loader.removeClass('hide hidden'); // jQuery deprecated hide in 3.0. Use hidden instead. Leaving hide here to support previous markup
			}

			this.options.dataSource(treeData ? treeData : {}, function populateNodes (items) {
				$.each(items.data, function buildNode (i, treeNode) {
					var nodeType = treeNode.type;

					// 'item' and 'overflow' remain consistent, but 'folder' maps to 'branch'
					if (treeNode.type === 'folder') {
						nodeType = 'branch';
					}

					var $entity = self.$element
						.find('[data-template=tree' + nodeType + ']:eq(0)')
						.clone()
						.removeClass('hide hidden')// jQuery deprecated hide in 3.0. Use hidden instead. Leaving hide here to support previous markup
						.removeData('template')
						.removeAttr('data-template');
					$entity.find('.tree-' + nodeType + '-name > .tree-label').html(treeNode.text || treeNode.name);
					$entity.data(treeNode);


					// Decorate $entity with data or other attributes making the
					// element easily accessible with libraries like jQuery.
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
					var attrs = treeNode.attr || treeNode.dataAttributes || [];
					$.each(attrs, function setAttribute (attr, setTo) {
						switch (attr) {
						case 'cssClass':
						case 'class':
						case 'className':
							$entity.addClass(setTo);
							break;

						// allow custom icons
						case 'data-icon':
							$entity.find('.icon-item').removeClass().addClass('icon-item ' + setTo);
							$entity.attr(attr, setTo);
							break;

						// ARIA support
						case 'id':
							$entity.attr(attr, setTo);
							$entity.attr('aria-labelledby', setTo + '-label');
							$entity.find('.tree-branch-name > .tree-label').attr('id', setTo + '-label');
							break;

						// style, data-*
						default:
							$entity.attr(attr, setTo);
							break;
						}
					});

					// add child node
					if (atRoot) {
						// For accessibility reasons, the root element is the only tab-able element (see https://github.com/ExactTarget/fuelux/issues/1964)
						$parent.append($entity);
					} else {
						$parent.find('.tree-branch-children:eq(0)').append($entity);
					}
				});

				$parent.find('.tree-loader').addClass('hidden');
				// return newly populated folder
				self.$element.trigger('loaded.fu.tree', $parent);
			});
		},

		selectTreeNode: function selectItem(clickedElement, nodeType) {
			var clicked = {};	// object for clicked element
			clicked.$element = $(clickedElement);

			var selected = {}; // object for selected elements
			selected.$elements = this.$element.find('.tree-selected');
			selected.dataForEvent = [];

			// determine clicked element and it's icon
			if (nodeType === 'folder') {
				// make the clicked.$element the container branch
				clicked.$element = clicked.$element.closest('.tree-branch');
				clicked.$icon = clicked.$element.find('.icon-folder');
			} else {
				clicked.$icon = clicked.$element.find('.icon-item');
			}
			clicked.elementData = clicked.$element.data();

			ariaSelect(clicked.$element);

			// the below functions pass objects by copy/reference and use modified object in this function
			if ( this.options.multiSelect ) {
				selected = multiSelectSyncNodes(this, clicked, selected);
			} else {
				selected = singleSelectSyncNodes(this, clicked, selected);
			}

			setFocus(this.$element, clicked.$element);

			// all done with the DOM, now fire events
			this.$element.trigger(selected.eventType + '.fu.tree', {
				target: clicked.elementData,
				selected: selected.dataForEvent
			});

			clicked.$element.trigger('updated.fu.tree', {
				selected: selected.dataForEvent,
				item: clicked.$element,
				eventType: selected.eventType
			});
		},

		discloseFolder: function discloseFolder(folder) {
			var $folder = $(folder);

			var $branch = $folder.closest('.tree-branch');
			var $treeFolderContent = $branch.find('.tree-branch-children');
			var $treeFolderContentFirstChild = $treeFolderContent.eq(0);

			// take care of the styles
			$branch.addClass('tree-open');
			$branch.attr('aria-expanded', 'true');
			$treeFolderContentFirstChild.removeClass('hide hidden'); // jQuery deprecated hide in 3.0. Use hidden instead. Leaving hide here to support previous markup
			$branch.find('> .tree-branch-header .icon-folder').eq(0)
				.removeClass('glyphicon-folder-close')
				.addClass('glyphicon-folder-open');

			var $tree = this.$element;
			var disclosedCompleted = function disclosedCompleted () {
				$tree.trigger('disclosedFolder.fu.tree', $branch.data());
			};

			// add the children to the folder
			if (!$treeFolderContent.children().length) {
				$tree.one('loaded.fu.tree', disclosedCompleted);
				this.populate($treeFolderContent);
			} else {
				disclosedCompleted();
			}
		},

		closeFolder: function closeFolder(el) {
			var $el = $(el);
			var $branch = $el.closest('.tree-branch');
			var $treeFolderContent = $branch.find('.tree-branch-children');
			var $treeFolderContentFirstChild = $treeFolderContent.eq(0);

			// take care of the styles
			$branch.removeClass('tree-open');
			$branch.attr('aria-expanded', 'false');
			$treeFolderContentFirstChild.addClass('hidden');
			$branch.find('> .tree-branch-header .icon-folder').eq(0)
				.removeClass('glyphicon-folder-open')
				.addClass('glyphicon-folder-close');

			// remove chidren if no cache
			if (!this.options.cacheItems) {
				$treeFolderContentFirstChild.empty();
			}

			this.$element.trigger('closed.fu.tree', $branch.data());
		},

		toggleFolder: function toggleFolder(el) {
			var $el = $(el);

			if ($el.find('.glyphicon-folder-close').length) {
				this.discloseFolder(el);
			} else if ($el.find('.glyphicon-folder-open').length) {
				this.closeFolder(el);
			}
		},

		selectFolder: function selectFolder(el) {
			if (this.options.folderSelect) {
				this.selectTreeNode(el, 'folder');
			}
		},

		selectItem: function selectItem(el) {
			if (this.options.itemSelect) {
				this.selectTreeNode(el, 'item');
			}
		},

		selectedItems: function selectedItems() {
			var $sel = this.$element.find('.tree-selected');
			var selected = [];

			$.each($sel, function buildSelectedArray (i, value) {
				selected.push($(value).data());
			});
			return selected;
		},

		// collapses open folders
		collapse: function collapse() {
			var self = this;
			var reportedClosed = [];

			var closedReported = function closedReported(event, closed) {
				reportedClosed.push(closed);

				// jQuery deprecated hide in 3.0. Use hidden instead. Leaving hide here to support previous markup
				if (self.$element.find(".tree-branch.tree-open:not('.hidden, .hide')").length === 0) {
					self.$element.trigger('closedAll.fu.tree', {
						tree: self.$element,
						reportedClosed: reportedClosed
					});
					self.$element.off('loaded.fu.tree', self.$element, closedReported);
				}
			};

			// trigger callback when all folders have reported closed
			self.$element.on('closed.fu.tree', closedReported);

			self.$element.find(".tree-branch.tree-open:not('.hidden, .hide')").each(function closeFolder () {
				self.closeFolder(this);
			});
		},

		// disclose visible will only disclose visible tree folders
		discloseVisible: function discloseVisible() {
			var self = this;

			var $openableFolders = self.$element.find(".tree-branch:not('.tree-open, .hidden, .hide')");
			var reportedOpened = [];

			var openReported = function openReported(event, opened) {
				reportedOpened.push(opened);

				if (reportedOpened.length === $openableFolders.length) {
					self.$element.trigger('disclosedVisible.fu.tree', {
						tree: self.$element,
						reportedOpened: reportedOpened
					});
					/*
					* Unbind the `openReported` event. `discloseAll` may be running and we want to reset this
					* method for the next iteration.
					*/
					self.$element.off('loaded.fu.tree', self.$element, openReported);
				}
			};

			// trigger callback when all folders have reported opened
			self.$element.on('loaded.fu.tree', openReported);

			// open all visible folders
			self.$element.find(".tree-branch:not('.tree-open, .hidden, .hide')").each(function triggerOpen() {
				self.discloseFolder($(this).find('.tree-branch-header'));
			});
		},

		/*
		* Disclose all will keep listening for `loaded.fu.tree` and if `$(tree-el).data('ignore-disclosures-limit')`
		* is `true` (defaults to `true`) it will attempt to disclose any new closed folders than were
		* loaded in during the last disclosure.
		*/
		discloseAll: function discloseAll() {
			var self = this;

			// first time
			if (typeof self.$element.data('disclosures') === 'undefined') {
				self.$element.data('disclosures', 0);
			}

			var isExceededLimit = (self.options.disclosuresUpperLimit >= 1 && self.$element.data('disclosures') >= self.options.disclosuresUpperLimit);
			var isAllDisclosed = self.$element.find(".tree-branch:not('.tree-open, .hidden, .hide')").length === 0;


			if (!isAllDisclosed) {
				if (isExceededLimit) {
					self.$element.trigger('exceededDisclosuresLimit.fu.tree', {
						tree: self.$element,
						disclosures: self.$element.data('disclosures')
					});

					/*
					* If you've exceeded the limit, the loop will be killed unless you
					* explicitly ignore the limit and start the loop again:
					*
					*    $tree.one('exceededDisclosuresLimit.fu.tree', function () {
					*        $tree.data('ignore-disclosures-limit', true);
					*        $tree.tree('discloseAll');
					*    });
					*/
					if (!self.$element.data('ignore-disclosures-limit')) {
						return;
					}
				}

				self.$element.data('disclosures', self.$element.data('disclosures') + 1);

				/*
				* A new branch that is closed might be loaded in, make sure those get handled too.
				* This attachment needs to occur before calling `discloseVisible` to make sure that
				* if the execution of `discloseVisible` happens _super fast_ (as it does in our QUnit tests
				* this will still be called. However, make sure this only gets called _once_, because
				* otherwise, every single time we go through this loop, _another_ event will be bound
				* and then when the trigger happens, this will fire N times, where N equals the number
				* of recursive `discloseAll` executions (instead of just one)
				*/
				self.$element.one('disclosedVisible.fu.tree', function callDiscloseAll () {
					self.discloseAll();
				});

				/*
				* If the page is very fast, calling this first will cause `disclosedVisible.fu.tree` to not
				* be bound in time to be called, so, we need to call this last so that the things bound
				* and triggered above can have time to take place before the next execution of the
				* `discloseAll` method.
				*/
				self.discloseVisible();
			} else {
				self.$element.trigger('disclosedAll.fu.tree', {
					tree: self.$element,
					disclosures: self.$element.data('disclosures')
				});

				// if `cacheItems` is false, and they call closeAll, the data is trashed and therefore
				// disclosures needs to accurately reflect that
				if (!self.options.cacheItems) {
					self.$element.one('closeAll.fu.tree', function updateDisclosuresData () {
						self.$element.data('disclosures', 0);
					});
				}
			}
		},

		// This refreshes the children of a folder. Please destroy and re-initilize for "root level" refresh.
		// The data of the refreshed folder is not updated. This control's architecture only allows updating of children.
		// Folder renames should probably be handled directly on the node.
		refreshFolder: function refreshFolder($el) {
			var $treeFolder = $el.closest('.tree-branch');
			var $treeFolderChildren = $treeFolder.find('.tree-branch-children');
			$treeFolderChildren.eq(0).empty();

			if ($treeFolder.hasClass('tree-open')) {
				this.populate($treeFolderChildren, false);
			} else {
				this.populate($treeFolderChildren, true);
			}

			this.$element.trigger('refreshedFolder.fu.tree', $treeFolder.data());
		}

	};

	// ALIASES

	// alias for collapse for consistency. "Collapse" is an ambiguous term (collapse what? All? One specific branch?)
	Tree.prototype.closeAll = Tree.prototype.collapse;
	// alias for backwards compatibility because there's no reason not to.
	Tree.prototype.openFolder = Tree.prototype.discloseFolder;
	// For library consistency
	Tree.prototype.getValue = Tree.prototype.selectedItems;

	// PRIVATE FUNCTIONS

	var fixFocusability = function fixFocusability ($tree, $branch) {
		/*
		When tree initializes on page, the `<ul>` element should have tabindex=0 and all sub-elements should have
		tabindex=-1. When focus leaves the tree, whatever the last focused on element was will keep the tabindex=0. The
		tree itself will have a tabindex=-1. The reason for this is that if you are inside of the tree and press
		shift+tab, it will try and focus on the tree you are already in, which will cause focus to shift immediately
		back to the element you are already focused on. That will make it seem like the event is getting "Swallowed up"
		by an aggressive event listener trap.

		For this reason, only one element in the entire tree, including the tree itself, should ever have tabindex=0.
		If somewhere down the line problems are being caused by this, the only further potential improvement I can
		envision at this time is listening for the tree to lose focus and reseting the tabindexes of all children to -1
		and setting the tabindex of the tree itself back to 0. This seems overly complicated with no benefit that I can
		imagine at this time, so instead I am leaving the last focused element with the tabindex of 0, even upon blur of
		the tree.

		One benefit to leaving the last focused element in a tree with a tabindex=0 is that if you accidentally tab out
		of the tree and then want to tab back in, you will be placed exactly where you left off instead of at the
		beginning of the tree.
		*/
		$tree.attr('tabindex', -1);
		$tree.find('li').attr('tabindex', -1);
		if ($branch && $branch.length > 0) {
			$branch.attr('tabindex', 0); // if tabindex is not set to 0 (or greater), node is not able to receive focus
		}
	};

	// focuses into (onto one of the children of) the provided branch
	var focusIn = function focusIn ($tree, $branch) {
		var $focusCandidate = $branch.find('.tree-selected:first');

		// if no node is selected, set focus to first visible node
		if ($focusCandidate.length <= 0) {
			$focusCandidate = $branch.find('li:not(".hidden"):first');
		}

		setFocus($tree, $focusCandidate);
	};

	// focuses on provided branch
	var setFocus = function setFocus ($tree, $branch) {
		fixFocusability($tree, $branch);

		$tree.attr('aria-activedescendant', $branch.attr('id'));

		$branch.focus();

		$tree.trigger('setFocus.fu.tree', $branch);
	};

	var navigateTree = function navigateTree ($tree, e) {
		if (e.isDefaultPrevented() || e.isPropagationStopped()) {
			return false;
		}

		var targetNode = e.originalEvent.target;
		var $targetNode = $(targetNode);
		var isOpen = $targetNode.hasClass('tree-open');
		var handled = false;
		// because es5 lacks promises and fuelux has no polyfil (and I'm not adding one just for this change)
		// I am faking up promises here through callbacks and listeners. Done will be fired immediately at the end of
		// the navigateTree method if there is no (fake) promise, but will be fired by an event listener that will
		// be triggered by another function if necessary. This way when done runs, and fires keyboardNavigated.fu.tree
		// anything listening for that event can be sure that everything tied to that event is actually completed.
		var fireDoneImmediately = true;
		var done = function done () {
			$tree.trigger('keyboardNavigated.fu.tree', e, $targetNode);
		};

		switch (e.which) {
		case 13: // enter
		case 32: // space
			// activates a node, i.e., performs its default action.
			// For parent nodes, one possible default action is to open or close the node.
			// In single-select trees where selection does not follow focus, the default action is typically to select the focused node.
			var foldersSelectable = $tree.hasClass('tree-folder-select');
			var isFolder = $targetNode.hasClass('tree-branch');
			var isItem = $targetNode.hasClass('tree-item');
			// var isOverflow = $targetNode.hasClass('tree-overflow');

			fireDoneImmediately = false;
			if (isFolder) {
				if (foldersSelectable) {
					$tree.one('selected.fu.tree deselected.fu.tree', done);
					$tree.tree('selectFolder', $targetNode.find('.tree-branch-header')[0]);
				} else {
					$tree.one('loaded.fu.tree closed.fu.tree', done);
					$tree.tree('toggleFolder', $targetNode.find('.tree-branch-header')[0]);
				}
			} else if (isItem) {
				$tree.one('selected.fu.tree', done);
				$tree.tree('selectItem', $targetNode);
			} else {
				// should be isOverflow... Try and click on it either way.
				$prev = $($targetNode.prevAll().not('.hidden')[0]);
				$targetNode.click();

				$tree.one('loaded.fu.tree', function selectFirstNewlyLoadedNode () {
					$next = $($prev.nextAll().not('.hidden')[0]);

					setFocus($tree, $next);
					done();
				});
			}

			handled = true;
			break;
		case 35: // end
			// Set focus to the last node in the tree that is focusable without opening a node.
			setFocus($tree, $tree.find('li:not(".hidden"):last'));

			handled = true;
			break;
		case 36: // home
			// set focus to the first node in the tree without opening or closing a node.
			setFocus($tree, $tree.find('li:not(".hidden"):first'));

			handled = true;
			break;
		case 37: // left
			if (isOpen) {
				fireDoneImmediately = false;
				$tree.one('closed.fu.tree', done);
				$tree.tree('closeFolder', targetNode);
			} else {
				setFocus($tree, $($targetNode.parents('li')[0]));
			}

			handled = true;
			break;

		case 38: // up
			// move focus to previous sibling
			var $prev = [];
			// move to previous li not hidden
			$prev = $($targetNode.prevAll().not('.hidden')[0]);

			// if the previous li is open, and has children, move selection to its last child so selection
			// appears to move to the next "thing" up
			if ($prev.hasClass('tree-open')) {
				var $prevChildren = $prev.find('li:not(".hidden"):last');
				if ($prevChildren.length > 0) {
					$prev = $($prevChildren[0]);
				}
			}

			// if nothing has been selected, we are presumably at the top of an open li, select the immediate parent
			if ($prev.length < 1) {
				$prev = $($targetNode.parents('li')[0]);
			}
			setFocus($tree, $prev);

			handled = true;
			break;

		case 39: // right
			if (isOpen) {
				focusIn($tree, $targetNode);
			} else {
				fireDoneImmediately = false;
				$tree.one('disclosed.fu.tree', done);
				$tree.tree('discloseFolder', targetNode);
			}

			handled = true;
			break;

		case 40: // down
			// move focus to next selectable tree node
			var $next = $($targetNode.find('li:not(".hidden"):first')[0]);
			if (!isOpen || $next.length <= 0) {
				$next = $($targetNode.nextAll().not('.hidden')[0]);
			}

			if ($next.length < 1) {
				$next = $($($targetNode.parents('li')[0]).nextAll().not('.hidden')[0]);
			}
			setFocus($tree, $next);

			handled = true;
			break;

		default:
			// console.log(e.which);
			return true; // exit this handler for other keys
		}

		// if we didn't handle the event, allow propagation to continue so something else might.
		if (handled) {
			e.preventDefault();
			e.stopPropagation();
			if (fireDoneImmediately) {
				done();
			}
		}

		return true;
	};

	var ariaSelect = function ariaSelect ($element) {
		$element.attr('aria-selected', true);
	};

	var ariaDeselect = function ariaDeselect ($element) {
		$element.attr('aria-selected', false);
	};

	function styleNodeSelected ($element, $icon) {
		$element.addClass('tree-selected');
		if ( $element.data('type') === 'item' && $icon.hasClass('fueluxicon-bullet') ) {
			$icon.removeClass('fueluxicon-bullet').addClass('glyphicon-ok'); // make checkmark
		}
	}

	function styleNodeDeselected ($element, $icon) {
		$element.removeClass('tree-selected');
		if ( $element.data('type') === 'item' && $icon.hasClass('glyphicon-ok') ) {
			$icon.removeClass('glyphicon-ok').addClass('fueluxicon-bullet'); // make bullet
		}
	}

	function multiSelectSyncNodes (self, clicked, selected) {
		// search for currently selected and add to selected data list if needed
		$.each(selected.$elements, function findCurrentlySelected (index, element) {
			var $element = $(element);

			if ($element[0] !== clicked.$element[0]) {
				selected.dataForEvent.push( $($element).data() );
			}
		});

		if (clicked.$element.hasClass('tree-selected')) {
			styleNodeDeselected(clicked.$element, clicked.$icon);
			// set event data
			selected.eventType = 'deselected';
		} else {
			styleNodeSelected(clicked.$element, clicked.$icon);
			// set event data
			selected.eventType = 'selected';
			selected.dataForEvent.push(clicked.elementData);
		}

		return selected;
	}

	function singleSelectSyncNodes(self, clicked, selected) {
		// element is not currently selected
		if (selected.$elements[0] !== clicked.$element[0]) {
			self.deselectAll(self.$element);
			styleNodeSelected(clicked.$element, clicked.$icon);
			// set event data
			selected.eventType = 'selected';
			selected.dataForEvent = [clicked.elementData];
		} else {
			styleNodeDeselected(clicked.$element, clicked.$icon);
			// set event data
			selected.eventType = 'deselected';
			selected.dataForEvent = [];
		}

		return selected;
	}

	// TREE PLUGIN DEFINITION

	$.fn.tree = function fntree (option) {
		var args = Array.prototype.slice.call(arguments, 1);
		var methodReturn;

		var $set = this.each(function eachThis () {
			var $this = $(this);
			var data = $this.data('fu.tree');
			var options = typeof option === 'object' && option;

			if (!data) {
				$this.data('fu.tree', (data = new Tree(this, options)));
				$this.trigger('initialized.fu.tree');
			}

			if (typeof option === 'string') {
				methodReturn = data[option].apply(data, args);
			}
		});

		return (methodReturn === undefined) ? $set : methodReturn;
	};

	/*
	 * Private method used only by the default dataSource for the tree, which is used to consume static
	 * tree data.
	 *
	 * Find children of supplied parent in rootData. You can pass in an entire deeply nested tree
	 * and this will look through it recursively until it finds the child data you are looking for.
	 *
	 * For extremely large trees, this could cause the browser to crash, as there is no protection
	 * or limit on the amount of branches that will be searched through.
	 */
	var findChildData = function findChildData (targetParent, rootData) {
		var isRootOfTree = $.isEmptyObject(targetParent);
		if (isRootOfTree) {
			return rootData;
		}

		if (rootData === undefined) {
			return false;
		}

		for (var i = 0; i < rootData.length; i++) {
			var potentialMatch = rootData[i];

			if (potentialMatch.attr && targetParent.attr && potentialMatch.attr.id === targetParent.attr.id) {
				return potentialMatch.children;
			} else if (potentialMatch.children) {
				var foundChild = findChildData(targetParent, potentialMatch.children);
				if (foundChild) {
					return foundChild;
				}
			}
		}

		return false;
	};

	$.fn.tree.defaults = {
		/*
		 * A static data representation of your full tree data. If you do not override the tree's
		 * default dataSource method, this will just make the tree work out of the box without
		 * you having to bring your own dataSource.
		 *
		 * Array of Objects representing tree branches (folder) and leaves (item):
			[
				{
					name: '',
					type: 'folder',
					attr: {
						id: ''
					},
					children: [
						{
							name: '',
							type: 'item',
							attr: {
								id: '',
								'data-icon': 'glyphicon glyphicon-file'
							}
						}
					]
				},
				{
					name: '',
					type: 'item',
					attr: {
						id: '',
						'data-icon': 'glyphicon glyphicon-file'
					}
				}
			];
		 */
		staticData: [],
		/*
		 * If you set the full tree data on options.staticData, you can use this default dataSource
		 * to consume that data. This allows you to just pass in a JSON array representation
		 * of your full tree data and the tree will just work out of the box.
		 */
		dataSource: function staticDataSourceConsumer (openedParentData, callback) {
			if (this.staticData.length > 0) {
				var childData = findChildData(openedParentData, this.staticData);

				callback({
					data: childData
				});
			}
		},
		multiSelect: false,
		cacheItems: true,
		folderSelect: true,
		itemSelect: true,
		/*
		* How many times `discloseAll` should be called before a stopping and firing
		* an `exceededDisclosuresLimit` event. You can force it to continue by
		* listening for this event, setting `ignore-disclosures-limit` to `true` and
		* starting `discloseAll` back up again. This lets you make more decisions
		* about if/when/how/why/how many times `discloseAll` will be started back
		* up after it exceeds the limit.
		*
		*    $tree.one('exceededDisclosuresLimit.fu.tree', function () {
		*        $tree.data('ignore-disclosures-limit', true);
		*        $tree.tree('discloseAll');
		*    });
		*
		* `disclusuresUpperLimit` defaults to `0`, so by default this trigger
		* will never fire. The true hard the upper limit is the browser's
		* ability to load new items (i.e. it will keep loading until the browser
		* falls over and dies). On the Fuel UX `index.html` page, the point at
		* which the page became super slow (enough to seem almost unresponsive)
		* was `4`, meaning 256 folders had been opened, and 1024 were attempting to open.
		*/
		disclosuresUpperLimit: 0
	};

	$.fn.tree.Constructor = Tree;

	$.fn.tree.noConflict = function noConflict () {
		$.fn.tree = old;
		return this;
	};


	// NO DATA-API DUE TO NEED OF DATA-SOURCE

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
