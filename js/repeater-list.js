/*
 * Fuel UX Repeater - List View Plugin
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
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {
	// -- END UMD WRAPPER PREFACE --

	// -- BEGIN MODULE CODE HERE --

	if($.fn.repeater){
		//ADDITIONAL METHODS
		$.fn.repeater.Constructor.prototype.list_clearSelectedItems = function () {
			this.$canvas.find('.repeater-list-check').remove();
			this.$canvas.find('.repeater-list table tbody tr.selected').removeClass('selected');
		};

		$.fn.repeater.Constructor.prototype.list_highlightColumn = function (index, force) {
			var tbody = this.$canvas.find('.repeater-list-wrapper > table tbody');
			if (this.viewOptions.list_highlightSortedColumn || force) {
				tbody.find('td.sorted').removeClass('sorted');
				tbody.find('tr').each(function () {
					var col = $(this).find('td:nth-child(' + (index + 1) + ')').filter(function(){return !$(this).parent().hasClass('empty');});
					col.addClass('sorted');
				});
			}
		};

		$.fn.repeater.Constructor.prototype.list_getSelectedItems = function () {
			var selected = [];
			this.$canvas.find('.repeater-list .repeater-list-wrapper > table tbody tr.selected').each(function () {
				var $item = $(this);
				selected.push({
					data: $item.data('item_data'),
					element: $item
				});
			});
			return selected;
		};

		$.fn.repeater.Constructor.prototype.getValue = $.fn.repeater.Constructor.prototype.list_getSelectedItems;

		$.fn.repeater.Constructor.prototype.list_positionHeadings = function () {
			var $wrapper = this.$element.find('.repeater-list-wrapper');
			var offsetLeft = $wrapper.offset().left;
			var scrollLeft = $wrapper.scrollLeft();
			if (scrollLeft > 0) {
				$wrapper.find('.repeater-list-heading').each(function () {
					var $heading = $(this);
					var left = ($heading.parents('th:first').offset().left - offsetLeft) + 'px';
					$heading.addClass('shifted').css('left', left);
				});
			} else {
				$wrapper.find('.repeater-list-heading').each(function () {
					$(this).removeClass('shifted').css('left', '');
				});
			}
		};

		$.fn.repeater.Constructor.prototype.list_setSelectedItems = function (items, force) {
			var selectable = this.viewOptions.list_selectable;
			var self = this;
			var data, i, $item, l;

			//this function is necessary because lint yells when a function is in a loop
			function checkIfItemMatchesValue () {
				$item = $(this);
				data = $item.data('item_data') || {};
				if (data[items[i].property] === items[i].value) {
					selectItem($item, items[i].selected);
				}
			}

			function selectItem ($itm, select) {
				select = (select !== undefined) ? select : true;
				if (select) {
					if (!force && selectable !== 'multi') {
						self.list_clearSelectedItems();
					}

					if (!$itm.hasClass('selected')) {
						$itm.addClass('selected');
						$itm.find('td:first').prepend('<div class="repeater-list-check"><span class="glyphicon glyphicon-ok"></span></div>');
					}

				} else {
					$itm.find('.repeater-list-check').remove();
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
					$item = this.$canvas.find('.repeater-list table tbody tr:nth-child(' + (items[i].index + 1) + ')');
					if ($item.length > 0) {
						selectItem($item, items[i].selected);
					}

				} else if (items[i].property !== undefined && items[i].value !== undefined) {
					this.$canvas.find('.repeater-list table tbody tr').each(checkIfItemMatchesValue);
				}

			}
		};

		$.fn.repeater.Constructor.prototype.list_sizeHeadings = function () {
			var $table = this.$element.find('.repeater-list table');
			$table.find('thead th').each(function () {
				var $hr = $(this);
				var $heading = $hr.find('.repeater-list-heading');
				$heading.outerHeight($hr.outerHeight());
				// outerWidth isn't always appropriate or desirable. Allow an explicit value to be set if needed
				$heading.outerWidth($heading.data('forced-width') || $hr.outerWidth());
			});
		};

		$.fn.repeater.Constructor.prototype.list_setFrozenColumns = function () {
			var frozenTable = this.$canvas.find('.table-frozen');
			var $wrapper = this.$element.find('.repeater-canvas');
			var $table = this.$element.find('.repeater-list .repeater-list-wrapper > table');
			var repeaterWrapper = this.$element.find('.repeater-list');
			var numFrozenColumns = this.viewOptions.list_frozenColumns;
			var self = this;

			if (this.viewOptions.list_selectable === 'multi') {
				numFrozenColumns = numFrozenColumns + 1;
				$wrapper.addClass('multi-select-enabled');
			}

			if (frozenTable.length < 1) {
				//setup frozen column markup
				//main wrapper and remove unneeded columns
				var $frozenColumnWrapper = $('<div class="frozen-column-wrapper"></div>').insertBefore($table);
				var $frozenColumn = $table.clone().addClass('table-frozen');
				$frozenColumn.find('th:not(:lt('+ numFrozenColumns +'))').remove();
				$frozenColumn.find('td:not(:nth-child(n+0):nth-child(-n+'+ numFrozenColumns +'))').remove();

				//need to set absolute heading for vertical scrolling
				var $frozenThead = $frozenColumn.clone().removeClass('table-frozen');
				$frozenThead.find('tbody').remove();
				var $frozenTheadWrapper = $('<div class="frozen-thead-wrapper"></div>').append($frozenThead);

				$frozenColumnWrapper.append($frozenColumn);
				repeaterWrapper.append($frozenTheadWrapper);
				this.$canvas.addClass('frozen-enabled');
			}

			this.$element.find('.repeater-list table.table-frozen tr').each(function (i, elem) {
				$(this).height($table.find('tr:eq(' + i + ')').height());
			});

			var columnWidth = $table.find('td:eq(0)').outerWidth();
			this.$element.find('.frozen-column-wrapper, .frozen-thead-wrapper').width(columnWidth);

			$('.frozen-thead-wrapper .repeater-list-heading').on('click', function() {
				var index = $(this).parent('th').index();
				index = index + 1;
				self.$element.find('.repeater-list-wrapper > table thead th:nth-child('+ index +') .repeater-list-heading')[0].click();
			});


		};

		$.fn.repeater.Constructor.prototype.list_positionColumns = function () {
			var $wrapper = this.$element.find('.repeater-canvas');
			var scrollTop = $wrapper.scrollTop();
			var scrollLeft = $wrapper.scrollLeft();
			var frozenEnabled = this.viewOptions.list_frozenColumns || this.viewOptions.list_selectable === 'multi';
			var actionsEnabled = this.viewOptions.list_actions;

			var canvasWidth = this.$element.find('.repeater-canvas').outerWidth();
			var tableWidth = this.$element.find('.repeater-list .repeater-list-wrapper > table').outerWidth();

			var actionsWidth = this.$element.find('.table-actions') ? this.$element.find('.table-actions').outerWidth() : 0;

			var shouldScroll = (tableWidth - (canvasWidth - actionsWidth)) >= scrollLeft;


			if (scrollTop > 0) {
				$wrapper.find('.repeater-list-heading').css('top', scrollTop);
			}
			else {
				$wrapper.find('.repeater-list-heading').css('top','0');
			}
			if (scrollLeft > 0) {
				if (frozenEnabled) {
					$wrapper.find('.frozen-thead-wrapper').css('left', scrollLeft);
					$wrapper.find('.frozen-column-wrapper').css('left', scrollLeft);
				}
				if (actionsEnabled && shouldScroll) {
					$wrapper.find('.actions-column-wrapper').css('right', -scrollLeft);
				}

			} else {
				if (frozenEnabled) {
					$wrapper.find('.frozen-thead-wrapper').css('left', '0');
					$wrapper.find('.frozen-column-wrapper').css('left', '0');
				}
				if (actionsEnabled) {
					$wrapper.find('.actions-column-wrapper').css('right', '0');
				}
			}
		};

		$.fn.repeater.Constructor.prototype.list_createItemActions = function () {
			var actionsHtml = '';
			var self = this;
			var i, l;
			var $table = this.$element.find('.repeater-list .repeater-list-wrapper > table');
			var $actionsTable = this.$canvas.find('.table-actions');

			for (i = 0, l = this.viewOptions.list_actions.items.length; i < l; i++) {
				var action = this.viewOptions.list_actions.items[i];
				var html = action.html;

				actionsHtml += '<li><a href="#" data-action="'+ action.name +'" class="action-item"> ' + html + '</a></li>';
			}

			if ($actionsTable.length < 1) {
				var selectlist = '<div class="btn-group">' +
					'<button type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" data-flip="auto" aria-expanded="false">' +
					'<span class="caret"></span>' +
					'</button>' +
					'<ul class="dropdown-menu dropdown-menu-right" role="menu">' +
					actionsHtml +
					'</ul></div>';

				// The width set here is overwritten in `list_sizeHeadings`. This is used for sizing the subsequent rows.
				var $actionsColumnWrapper = $('<div class="actions-column-wrapper" style="width: ' + this.list_actions_width + 'px"></div>').insertBefore($table);
				var $actionsColumn = $table.clone().addClass('table-actions');
				$actionsColumn.find('th:not(:last-child)').remove();
				$actionsColumn.find('tr td:not(:last-child)').remove();

				// Dont show actions dropdown in header if not multi select
				if (this.viewOptions.list_selectable === 'multi') {
					$actionsColumn.find('thead tr').html('<th><div class="repeater-list-heading">' + selectlist + '</div></th>');
					//disable the header dropdown until an item is selected
					$actionsColumn.find('thead .btn').attr('disabled', 'disabled');
				} else {
					var labelText = this.viewOptions.list_actions.label || '';

					var $labelOverlay = $('<div class="repeater-list-heading empty">' + labelText + '</div>');

					// repeater-list.less:302 has `margin-left: -9px;` which shifts this over and makes it not actually cover what it is supposed to cover. Make it wider to compensate.
					var negative_maring_accomodation = 9;
					$labelOverlay.data('forced-width', this.list_actions_width + negative_maring_accomodation);

					var $th = $('<th>' + labelText + '</th>');
					$th.append($labelOverlay);

					$actionsColumn.find('thead tr').addClass('empty-heading').append($th);
				}

				// Create Actions dropdown for each cell in actions table
				var $actionsCells = $actionsColumn.find('td');

				$actionsCells.each(function(i) {
					$(this).html(selectlist);
					$(this).find('a').attr('data-row', parseInt([i]) + 1);
				});

				$actionsColumnWrapper.append($actionsColumn);

				this.$canvas.addClass('actions-enabled');
			}

			this.$element.find('.repeater-list table.table-actions thead tr th').outerHeight($table.find('thead tr th').outerHeight());
			this.$element.find('.repeater-list table.table-actions tbody tr td:first-child').each(function (i, elem) {
				$(this).outerHeight($table.find('tbody tr:eq(' + i + ') td').outerHeight());
			});


			//row level actions click
			this.$element.find('.table-actions tbody .action-item').on('click', function(e) {
				var actionName = $(this).data('action');
				var row = $(this).data('row');
				var selected = {
					actionName: actionName,
					rows: [row]
				};
				self.list_getActionItems(selected, e);
			});
			// bulk actions click
			this.$element.find('.table-actions thead .action-item').on('click', function(e) {
				var actionName = $(this).data('action');
				var selected = {
					actionName: actionName,
					rows: []
				};
				self.$element.find('.repeater-list-wrapper > table .selected').each(function() {
					var index = $(this).index();
					index = index + 1;
					selected.rows.push(index);
				});

				self.list_getActionItems(selected, e);
			});
		};

		/*
		 * list_getActionItems
		 *
		 * Called when user clicks on an "action item".
		 *
		 * Object selected - object containing `actionName`, string value of the `data-action` attribute of the clicked
		 *					"action item", and `rows` Array of jQuery objects of selected rows
		 * Object e - jQuery event of triggering event
		 *
		 * Calls implementor's clickAction function if provided. Passes `selectedObj`, `callback` and `e`.
		 *		Object selectedObj - Object containing jQuery object `item` for selected row, and Object `rowData` for
		 *							selected row's data-attributes, or Array of such Objects if multiple selections were made
		 *		Function callback - ¯\_(ツ)_/¯
		 *		Object e - jQuery event object representing the triggering event
		 */
		$.fn.repeater.Constructor.prototype.list_getActionItems = function (selected, e) {
			var i;
			var selectedObj = [];
			var actionObj = $.grep(this.viewOptions.list_actions.items, function(actions){
				return actions.name === selected.actionName;
			})[0];
			for (i = 0; i < selected.rows.length; i++) {
				var clickedRow = this.$canvas.find('.repeater-list-wrapper > table tbody tr:nth-child('+ selected.rows[i] +')');
				selectedObj.push({
					item: clickedRow,
					rowData: clickedRow.data('item_data')
				});
			}
			if (selectedObj.length === 1) {
				selectedObj = selectedObj[0];
			}

			if (actionObj.clickAction) {
				var callback = function callback () {};// for backwards compatibility. No idea why this was originally here...
				actionObj.clickAction(selectedObj, callback, e);
			}
		};

		$.fn.repeater.Constructor.prototype.list_sizeActionsTable = function () {
			var $table = this.$element.find('.repeater-list-wrapper > table');
			var $actionsTableHeading = this.$element.find('.repeater-list-wrapper .actions-column-wrapper thead th .repeater-list-heading');
			$actionsTableHeading.outerHeight($table.find('thead th .repeater-list-heading').outerHeight());
		};

		$.fn.repeater.Constructor.prototype.list_frozenOptionsInitialize = function () {
			var self = this;
			var isFrozen = this.viewOptions.list_frozenColumns;
			var isActions = this.viewOptions.list_actions;
			var isMulti = this.viewOptions.list_selectable === 'multi';

			var $checkboxes = this.$element.find('.frozen-column-wrapper .checkbox-inline');

			var $everyTable = this.$element.find('.repeater-list table');



			//Make sure if row is hovered that it is shown in frozen column as well
			this.$element.find('tr.selectable').on('mouseover mouseleave', function(e) {
				var index = $(this).index();
				index = index + 1;
				if (e.type === 'mouseover'){
					$everyTable.find('tbody tr:nth-child('+ index +')').addClass('hovered');
				}
				else {
					$everyTable.find('tbody tr:nth-child('+ index +')').removeClass('hovered');
				}
			});

			$checkboxes.checkbox();

			this.$element.find('.table-frozen tbody .checkbox-inline').on('change', function(e) {
				e.preventDefault();
				var row = $(this).attr('data-row');
				row = parseInt(row) + 1;
				self.$element.find('.repeater-list-wrapper > table tbody tr:nth-child('+ row +')').click();
			});

			this.$element.find('.frozen-thead-wrapper thead .checkbox-inline').on('change', function () {
				if ($(this).checkbox('isChecked')){
					self.$element.find('.repeater-list-wrapper > table tbody tr:not(.selected)').click();
					self.$element.trigger('selected.fu.repeaterList', $checkboxes);
				}
				else {
					self.$element.find('.repeater-list-wrapper > table tbody tr.selected').click();
					self.$element.trigger('deselected.fu.repeaterList', $checkboxes);
				}
			});
		};

		//ADDITIONAL DEFAULT OPTIONS
		$.fn.repeater.defaults = $.extend({}, $.fn.repeater.defaults, {
			list_columnRendered: null,
			list_columnSizing: true,
			list_columnSyncing: true,
			list_highlightSortedColumn: true,
			list_infiniteScroll: false,
			list_noItemsHTML: 'no items found',
			list_selectable: false,
			list_sortClearing: false,
			list_rowRendered: null,
			list_frozenColumns: 0,
			list_actions: false
		});

		//EXTENSION DEFINITION
		$.fn.repeater.viewTypes.list = {
			cleared: function () {
				if (this.viewOptions.list_columnSyncing) {
					this.list_sizeHeadings();
				}
			},
			dataOptions: function (options) {
				if (this.list_sortDirection) {
					options.sortDirection = this.list_sortDirection;
				}
				if (this.list_sortProperty) {
					options.sortProperty = this.list_sortProperty;
				}
				return options;
			},
			initialize: function (helpers, callback) {
				this.list_sortDirection = null;
				this.list_sortProperty = null;
				this.list_actions_width = (this.viewOptions.list_actions.width !== undefined) ? this.viewOptions.list_actions.width : 37;
				this.list_noItems = false;
				callback();
			},
			resize: function () {
				if (this.viewOptions.list_frozenColumns || this.viewOptions.list_actions){
					this.render();
				}else{
					if (this.viewOptions.list_columnSyncing) {
						this.list_sizeHeadings();
					}
				}
			},
			selected: function () {
				var infScroll = this.viewOptions.list_infiniteScroll;
				var opts;

				this.list_firstRender = true;
				this.$loader.addClass('noHeader');

				if (infScroll) {
					opts = (typeof infScroll === 'object') ? infScroll : {};
					this.infiniteScrolling(true, opts);
				}
			},
			before: function(helpers){
				var $listContainer = helpers.container.find('.repeater-list');
				var self = this;
				var $table;

				if ($listContainer.length < 1) {
					$listContainer = $('<div class="repeater-list ' + specialBrowserClass() + '" data-preserve="shallow"><div class="repeater-list-wrapper" data-infinite="true" data-preserve="shallow"><table aria-readonly="true" class="table" data-preserve="shallow" role="grid"></table></div></div>');
					$listContainer.find('.repeater-list-wrapper').on('scroll.fu.repeaterList', function () {
						if (self.viewOptions.list_columnSyncing) {
							self.list_positionHeadings();
						}
					});
					if (self.viewOptions.list_frozenColumns || self.viewOptions.list_actions || self.viewOptions.list_selectable === 'multi') {
						helpers.container.on('scroll.fu.repeaterList', function () {
							self.list_positionColumns();
						});
					}

					helpers.container.append($listContainer);
				}
				helpers.container.removeClass('actions-enabled actions-enabled multi-select-enabled');

				$table = $listContainer.find('table');
				renderThead.call(this, $table, helpers.data);
				renderTbody.call(this, $table, helpers.data);

				return false;
			},
			renderItem: function(helpers){
				renderRow.call(this, helpers.container, helpers.subset[helpers.index], helpers.index);
				return false;
			},
			after: function(){
				var $sorted;

				if ((this.viewOptions.list_frozenColumns || this.viewOptions.list_selectable === 'multi') && !this.list_noItems) {
					this.list_setFrozenColumns();
				}

				if (this.viewOptions.list_actions && !this.list_noItems) {
					this.list_createItemActions();
					this.list_sizeActionsTable();
				}

				if ((this.viewOptions.list_frozenColumns || this.viewOptions.list_actions || this.viewOptions.list_selectable === 'multi') && !this.list_noItems) {
					this.list_positionColumns();
					this.list_frozenOptionsInitialize();
				}

				if (this.viewOptions.list_columnSyncing) {
					this.list_sizeHeadings();
					this.list_positionHeadings();
				}

				$sorted = this.$canvas.find('.repeater-list-wrapper > table .repeater-list-heading.sorted');
				if ($sorted.length > 0) {
					this.list_highlightColumn($sorted.data('fu_item_index'));
				}

				return false;
			}
		};
	}

	//ADDITIONAL METHODS
	function renderColumn ($tr, row, rowIndex, column) {
		var content = row[column.property];
		var $col = $('<td></td>');

		$col.addClass(column.className);

		if(this.viewOptions.list_actions !== false && column.property === '@_ACTIONS_@'){
			$col.addClass('repeater-list-actions-placeholder-column');
			content = '';
		}

		content = (content !== undefined) ? content : '';
		$col.append(content);

		// excludes checkbox and actions columns, as well as columns with user set widths
		if (column._auto_width !== undefined) {
			$col.outerWidth(column._auto_width);
		}

		$tr.append($col);

		if (this.viewOptions.list_selectable === 'multi' && column.property === '@_CHECKBOX_@') {
			var checkBoxMarkup = '<label data-row="'+ rowIndex +'" class="checkbox-custom checkbox-inline body-checkbox">' +
				'<input class="sr-only" type="checkbox"></label>';

			$col.html(checkBoxMarkup);
		}

		if (!(column.property === '@_CHECKBOX_@' || column.property === '@_ACTIONS_@') && this.viewOptions.list_columnRendered) {
			this.viewOptions.list_columnRendered({
				container: $tr,
				columnAttr: column.property,
				item: $col,
				rowData: row
			}, function () {});
		}
	}

	/*
	 * Handle column header click to do sort.
	 *
	 * This function was extracted from the renderHeader function in this file
	 *
	 * Expects:
	 * e.data.$headerOverlay - visible/clickable header overlay
	 * e.data.$headerBase - sizer `<th>` element
	 * e.data.column - object representing raw data for clicked column
	 * e.data.$tr - `<tr>` from `<thead>`
	 * e.data.self - `this` context of the `renderHeader` function
	 */
	var handleColumnSort = function handleColumnSort (e) {
		var self = e.data.self;
		// Create a new jQuery object as set of both elements.
		var $headers = e.data.$headerOverlay.add(e.data.$headerBase);
		var $chevron = e.data.$headerOverlay.find('.glyphicon.rlc:first');
		var $tr = e.data.$tr;
		var column = e.data.column;

		self.list_sortProperty = (typeof column.sortable === 'string') ? column.sortable : column.property;

		var chevDown = 'glyphicon-chevron-down';
		var chevUp = 'glyphicon-chevron-up';
		if ($headers.hasClass('sorted')) {
			if ($chevron.hasClass(chevUp)) {
				$chevron.removeClass(chevUp).addClass(chevDown);
				self.list_sortDirection = 'desc';
			} else {
				if (!self.viewOptions.list_sortClearing) {
					$chevron.removeClass(chevDown).addClass(chevUp);
					self.list_sortDirection = 'asc';
				} else {
					$headers.removeClass('sorted');
					$chevron.removeClass(chevDown);
					self.list_sortDirection = null;
					self.list_sortProperty = null;
				}
			}
		} else {
			$tr.find('th, .repeater-list-heading').removeClass('sorted');
			$chevron.removeClass(chevDown).addClass(chevUp);
			self.list_sortDirection = 'asc';
			$headers.addClass('sorted');
		}

		self.render({
			clearInfinite: true,
			pageIncrement: null
		});
	};

	var renderHeader = function renderHeader ($tr, column, columnIndex) {
		var self = this;

		// visible portion (top layer) of header
		var $headerOverlay = $('<div class="repeater-list-heading"><span class="glyphicon rlc"></span></div>');
		$headerOverlay.data('fu_item_index', columnIndex);
		$headerOverlay.prepend(column.label);

		// header underlayment
		var $headerBase = $('<th></th>');

		// actions column is _always_ hidden underneath absolute positioned actions table.
		// Neither headerBase nor headerOverlay will ever be visible for actions column.
		// This is here strictly for sizing purposes for the benefit of the other columns'
		// sizing calculations.
		if (this.viewOptions.list_actions && column.property === '@_ACTIONS_@') {
			var width = this.list_actions_width;
			$headerBase.css('width', width);
			$headerOverlay.css('width', width);
		}

		var headerClasses = [];
		headerClasses.push(column.className);

		var sortable = column.sortable;
		if (sortable) {
			headerClasses.push('sortable');

			$headerOverlay.on(
				'click.fu.repeaterList',
				{
					'self': self,
					'$tr': $tr,
					'$headerBase': $headerBase,
					'$headerOverlay': $headerOverlay,
					'column': column
				},
				handleColumnSort
			);
		}

		var $chevron = $headerOverlay.find('.glyphicon.rlc:first');

		if (column.sortDirection === 'asc' || column.sortDirection === 'desc') {
			$tr.find('th, .repeater-list-heading').removeClass('sorted');

			headerClasses.push('sortable sorted');

			if (column.sortDirection === 'asc') {
				$chevron.addClass('glyphicon-chevron-up');
				this.list_sortDirection = 'asc';
			} else {
				$chevron.addClass('glyphicon-chevron-down');
				this.list_sortDirection = 'desc';
			}

			this.list_sortProperty = (typeof sortable === 'string') ? sortable : column.property;
		}

		// duplicate the header's overlay content into the header if appropriate (possibly for dimensional styling???)
		$headerBase.html($headerOverlay.html());

		// place visible content into header for display to user
		if (column.property !== '@_CHECKBOX_@') {
			$headerBase.append($headerOverlay);
		} else {
			var checkBoxMarkup = '<div class="repeater-list-heading header-checkbox"><label class="checkbox-custom checkbox-inline"><input class="sr-only" type="checkbox"></label><div class="clearfix"></div></div>';
			$headerBase.append(checkBoxMarkup);
		}

		headerClasses = headerClasses.join(' ');
		$headerBase.addClass(headerClasses);
		$headerOverlay.addClass(headerClasses);

		$tr.append($headerBase);
	};

	function renderRow ($tbody, row, rowIndex) {
		var $row = $('<tr></tr>');
		var self = this;
		var i, l;
		var isMulti = this.viewOptions.list_selectable === 'multi';
		var isActions = this.viewOptions.list_actions;

		if (this.viewOptions.list_selectable) {
			$row.addClass('selectable');
			$row.attr('tabindex', 0);	// allow items to be tabbed to / focused on
			$row.data('item_data', row);

			$row.on('click.fu.repeaterList', function () {
				var $item = $(this);
				var index = $(this).index();
				index = index + 1;
				var $frozenRow = self.$element.find('.frozen-column-wrapper tr:nth-child('+ index +')');
				var $actionsRow = self.$element.find('.actions-column-wrapper tr:nth-child('+ index +')');
				var $checkBox = self.$element.find('.frozen-column-wrapper tr:nth-child('+ index +') .checkbox-inline');

				if ($item.is('.selected')) {
					$item.removeClass('selected');
					if (isMulti){
						$checkBox.checkbox('uncheck');
						$frozenRow.removeClass('selected');
						if (isActions) {
							$actionsRow.removeClass('selected');
						}
					}
					else {
						$item.find('.repeater-list-check').remove();
					}

					self.$element.trigger('deselected.fu.repeaterList', $item);
				} else {
					if (!isMulti) {
						self.$canvas.find('.repeater-list-check').remove();
						self.$canvas.find('.repeater-list tbody tr.selected').each(function () {
							$(this).removeClass('selected');
							self.$element.trigger('deselected.fu.repeaterList', $(this));
						});
						$item.find('td:first').prepend('<div class="repeater-list-check"><span class="glyphicon glyphicon-ok"></span></div>');
						$item.addClass('selected');
						$frozenRow.addClass('selected');
					}
					else {
						$checkBox.checkbox('check');
						$item.addClass('selected');
						$frozenRow.addClass('selected');
						if (isActions) {
							$actionsRow.addClass('selected');
						}
					}
					self.$element.trigger('selected.fu.repeaterList', $item);
				}
				var $selected = self.$canvas.find('.repeater-list-wrapper > table .selected');
				var $actionsColumn = self.$element.find('.table-actions');

				if ($selected.length > 0) {
					$actionsColumn.find('thead .btn').removeAttr('disabled');
				}
				else {
					$actionsColumn.find('thead .btn').attr('disabled', 'disabled');
				}
			});

			// allow selection via enter key
			$row.keyup(function (e) {
				if (e.keyCode === 13) {
					// triggering a standard click event to be caught by the row click handler above
					$row.trigger('click.fu.repeaterList');
				}
			});
		}

		if (this.viewOptions.list_actions && !this.viewOptions.list_selectable) {
			$row.data('item_data', row);
		}

		$tbody.append($row);

		for (i = 0; i < this.list_columns.length; i++) {
			renderColumn.call(this, $row, row, rowIndex, this.list_columns[i]);
		}

		if (this.viewOptions.list_rowRendered) {
			this.viewOptions.list_rowRendered({
				container: $tbody,
				item: $row,
				rowData: row
			}, function () {});
		}
	}

	function renderTbody ($table, data) {
		var $tbody = $table.find('tbody');
		var $empty;

		if ($tbody.length < 1) {
			$tbody = $('<tbody data-container="true"></tbody>');
			$table.append($tbody);
		}

		if (typeof data.error === 'string' && data.error.length > 0) {
			$empty = $('<tr class="empty text-danger"><td colspan="' + this.list_columns.length + '"></td></tr>');
			$empty.find('td').append(data.error);
			$tbody.append($empty);
		}
		else if (data.items && data.items.length < 1) {
			$empty = $('<tr class="empty"><td colspan="' + this.list_columns.length + '"></td></tr>');
			$empty.find('td').append(this.viewOptions.list_noItemsHTML);
			$tbody.append($empty);
		}
	}

	var areDifferentColumns = function areDifferentColumns (oldCols, newCols) {
		if (!newCols) {
			return false;
		}
		if (!oldCols || (newCols.length !== oldCols.length)) {
			return true;
		}
		for (var i = 0; i < newCols.length; i++) {
			if (!oldCols[i]) {
				return true;
			} else {
				for (var j in newCols[i]) {
					if (oldCols[i][j] !== newCols[i][j]) {
						return true;
					}

				}
			}

		}
		return false;
	};

	var renderThead = function renderThead ($table, data) {
		var columns = data.columns || [];
		var $thead = $table.find('thead');

		if (this.list_firstRender || areDifferentColumns(this.list_columns, columns) || $thead.length === 0) {
			$thead.remove();

			this.list_firstRender = false;
			this.$loader.removeClass('noHeader');

			if (data.count < 1) {
				this.list_noItems = true;
			}

			// insert checkbox column, if applicable
			if (this.viewOptions.list_selectable === 'multi' && !this.list_noItems) {
				var checkboxColumn = {
					label: 'c',
					property: '@_CHECKBOX_@',
					sortable: false
				};
				columns.unshift(checkboxColumn);
			}

			// insert actions column, if applicable
			if (this.viewOptions.list_actions && !this.list_noItems){
				var actionsColumn = {
					label: this.viewOptions.list_actions.label || '',
					property: '@_ACTIONS_@',
					sortable: false,
					width: this.list_actions_width
				};
				columns.push(actionsColumn);
			}

			this.list_columns = columns;

			var $headerRow = $('<tr></tr>');
			for (var i = 0; i < columns.length; i++) {
				renderHeader.call(this, $headerRow, columns[i], i);
			}

			$thead = $('<thead data-preserve="deep"></thead>');
			$thead.append($headerRow);
			$table.prepend($thead);

			// after checkbox column is created need to get width of checkbox column from its css class
			if (this.viewOptions.list_selectable === 'multi' && !this.list_noItems) {
				var checkboxWidth = this.$element.find('.repeater-list-wrapper .header-checkbox').outerWidth();
				columns[0].width = checkboxWidth;
			}

			sizeColumns.call(this, $headerRow);
		}
	};

	var sizeColumns = function sizeColumns ($tr) {
		var autoGauge = [];
		var self = this;
		var takenWidth = 0;
		var totalWidth = 0;

		if (self.viewOptions.list_columnSizing) {
			$tr.find('th').each(function (i, th) {
				var $th = $(th);
				var isLast = ($(this).next('th').length === 0);

				if (self.list_columns[i].width !== undefined) {
					var width = self.list_columns[i].width;

					takenWidth += width;
					totalWidth += width;

					if (!isLast) {
						$th.outerWidth(width);
						self.list_columns[i]._auto_width = width;
					}else{
						$th.outerWidth('');// why does this work? This is invalid jQuery.
					}
				} else {
					totalWidth += $th.outerWidth();

					autoGauge.push({
						col: $th,
						index: i,
						last: isLast,
						minWidth: $th.find('.repeater-list-heading').outerWidth()
					});
				}
			});

			var canvasWidth = self.$canvas.find('.repeater-list-wrapper').outerWidth();
			var newWidth = Math.floor((canvasWidth - takenWidth) / autoGauge.length);

			for (var i = 0; i < autoGauge.length; i++) {
				var th = autoGauge[i];

				if (newWidth < th.minWidth) {
					newWidth = th.minWidth;
				}

				if (!th.last || canvasWidth < totalWidth) {
					th.col.outerWidth(newWidth);
					self.list_columns[th.index]._auto_width = newWidth;
				}
			}
		}
	};

	function specialBrowserClass() {
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
		var firefox = ua.indexOf('Firefox');

		if (msie > 0 ) {
			return 'ie-' + parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
		} else if (firefox > 0) {
			return 'firefox';
		} else {
			return '';
		}
	}

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
