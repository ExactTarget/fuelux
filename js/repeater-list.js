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
		define(['jquery', 'fuelux/repeater', 'fuelux/checkbox'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'), require('./repeater'), require('./checkbox'));
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
			var data, i, $item, length;

			//this function is necessary because lint yells when a function is in a loop
			function checkIfItemMatchesValue (rowIndex) {
				$item = $(this);

				data = $item.data('item_data') || {};
				if (data[items[i].property] === items[i].value) {
					selectItem($item, items[i].selected, rowIndex);
				}
			}

			function selectItem ($itm, select, index) {
				var $frozenCols;

				select = (select !== undefined) ? select : true;
				if (select) {
					if (!force && selectable !== 'multi') {
						self.list_clearSelectedItems();
					}

					if (!$itm.hasClass('selected')) {
						$itm.addClass('selected');

						if (self.viewOptions.list_frozenColumns || self.viewOptions.list_selectable === 'multi') {
							$frozenCols = self.$element.find('.frozen-column-wrapper tr:nth-child('+ (index + 1) +')');

							$frozenCols.addClass('selected');
							$frozenCols.find('.repeater-select-checkbox').addClass('checked');
						}

						if (self.viewOptions.list_actions) {
							self.$element.find('.actions-column-wrapper tr:nth-child('+ (index + 1) +')').addClass('selected');
						}

						$itm.find('td:first').prepend('<div class="repeater-list-check"><span class="glyphicon glyphicon-ok"></span></div>');
					}

				} else {
					if (self.viewOptions.list_frozenColumns) {
						$frozenCols = self.$element.find('.frozen-column-wrapper tr:nth-child('+ (index + 1) +')');

						$frozenCols.addClass('selected');
						$frozenCols.find('.repeater-select-checkbox').removeClass('checked');
					}

					if (self.viewOptions.list_actions) {
						self.$element.find('.actions-column-wrapper tr:nth-child('+ (index + 1) +')').removeClass('selected');
					}

					$itm.find('.repeater-list-check').remove();
					$itm.removeClass('selected');
				}
			}

			if (!$.isArray(items)) {
				items = [items];
			}

			if (force === true || selectable === 'multi') {
				length = items.length;
			} else if (selectable) {
				length = (items.length > 0) ? 1 : 0;
			} else {
				length = 0;
			}

			for (i = 0; i < length; i++) {
				if (items[i].index !== undefined) {
					$item = this.$canvas.find('.repeater-list .repeater-list-wrapper > table tbody tr:nth-child(' + (items[i].index + 1) + ')');
					if ($item.length > 0) {
						selectItem($item, items[i].selected, items[i].index);
					}

				} else if (items[i].property !== undefined && items[i].value !== undefined) {
					this.$canvas.find('.repeater-list .repeater-list-wrapper > table tbody tr').each(checkIfItemMatchesValue);
				}

			}
		};

		$.fn.repeater.Constructor.prototype.list_sizeHeadings = function () {
			var $table = this.$element.find('.repeater-list table');
			$table.find('thead th').each(function () {
				var $th = $(this);
				var $heading = $th.find('.repeater-list-heading');
				$heading.css({ height: $th.outerHeight() });
				$heading.outerWidth($heading.data('forced-width') || $th.outerWidth());
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

			this.list_sizeFrozenColumns();

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
					$wrapper.find('.actions-thead-wrapper').css('right', -scrollLeft);
					$wrapper.find('.actions-column-wrapper').css('right', -scrollLeft);
				}

			} else {
				if (frozenEnabled) {
					$wrapper.find('.frozen-thead-wrapper').css('left', '0');
					$wrapper.find('.frozen-column-wrapper').css('left', '0');
				}
				if (actionsEnabled) {
					$wrapper.find('.actions-thead-wrapper').css('right', '0');
					$wrapper.find('.actions-column-wrapper').css('right', '0');
				}
			}
		};

		$.fn.repeater.Constructor.prototype.list_createItemActions = function () {
			var actionsHtml = '';
			var self = this;
			var i, length;
			var $table = this.$element.find('.repeater-list .repeater-list-wrapper > table');
			var $actionsTable = this.$canvas.find('.table-actions');

			for (i = 0, length = this.viewOptions.list_actions.items.length; i < length; i++) {
				var action = this.viewOptions.list_actions.items[i];
				var html = action.html;

				actionsHtml += '<li><a href="#" data-action="'+ action.name +'" class="action-item"> ' + html + '</a></li>';
			}

			var selectlist = '<div class="btn-group">' +
				'<button type="button" class="btn btn-xs btn-default dropdown-toggle repeater-actions-button" data-toggle="dropdown" data-flip="auto" aria-expanded="false">' +
				'<span class="caret"></span>' +
				'</button>' +
				'<ul class="dropdown-menu dropdown-menu-right" role="menu">' +
				actionsHtml +
				'</ul></div>';

			if ($actionsTable.length < 1) {

				var $actionsColumnWrapper = $('<div class="actions-column-wrapper" style="width: '+ this.list_actions_width +'px"></div>').insertBefore($table);
				var $actionsColumn = $table.clone().addClass('table-actions');
				$actionsColumn.find('th:not(:last-child)').remove();
				$actionsColumn.find('tr td:not(:last-child)').remove();

				// Dont show actions dropdown in header if not multi select
				if (this.viewOptions.list_selectable === 'multi') {
					$actionsColumn.find('thead tr').html('<th><div class="repeater-list-heading">' + selectlist + '</div></th>');
					//disable the header dropdown until an item is selected
					$actionsColumn.find('thead .btn').attr('disabled', 'disabled');
				}
				else {
					var label = this.viewOptions.list_actions.label || '<span class="actions-hidden">a</span>';
					$actionsColumn.find('thead tr').addClass('empty-heading').html('<th>'+ label +'<div class="repeater-list-heading">'+ label +'</div></th>');
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

			this.list_sizeActionsTable();

			//row level actions click
			this.$element.find('.table-actions tbody .action-item').on('click', function(e) {
				if (!self.isDisabled) {
					var actionName = $(this).data('action');
					var row = $(this).data('row');
					var selected = {
						actionName: actionName,
						rows: [row]
					};
					self.list_getActionItems(selected, e);
				}
			});
			// bulk actions click
			this.$element.find('.table-actions thead .action-item').on('click', function(e) {
				if (!self.isDisabled) {
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
				}
			});
		};

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
			var $actionsTable = this.$element.find('.repeater-list table.table-actions');
			var $actionsTableHeader = $actionsTable.find('thead tr th');
			var $table = this.$element.find('.repeater-list-wrapper > table');

			$actionsTableHeader.outerHeight($table.find('thead tr th').outerHeight());
			$actionsTableHeader.find('.repeater-list-heading').outerHeight($actionsTableHeader.outerHeight());
			$actionsTable.find('tbody tr td:first-child').each(function (i, elem) {
				$(this).outerHeight($table.find('tbody tr:eq(' + i + ') td').outerHeight());
			});
		};

		$.fn.repeater.Constructor.prototype.list_sizeFrozenColumns = function () {
			var $table = this.$element.find('.repeater-list .repeater-list-wrapper > table');

			this.$element.find('.repeater-list table.table-frozen tr').each(function (i) {
				$(this).height($table.find('tr:eq(' + i + ')').height());
			});

			var columnWidth = $table.find('td:eq(0)').outerWidth();
			this.$element.find('.frozen-column-wrapper, .frozen-thead-wrapper').width(columnWidth);
		};

		$.fn.repeater.Constructor.prototype.list_frozenOptionsInitialize = function () {
			var $checkboxes = this.$element.find('.frozen-column-wrapper .checkbox-inline');
			var $everyTable = this.$element.find('.repeater-list table');
			var self = this;

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

				if (!self.list_revertingCheckbox) {
					if (self.isDisabled) {
						revertCheckbox($(e.currentTarget));
					} else {
						var row = $(this).attr('data-row');
						row = parseInt(row) + 1;
						self.$element.find('.repeater-list-wrapper > table tbody tr:nth-child('+ row +')').click();
					}
				}
			});

			this.$element.find('.frozen-thead-wrapper thead .checkbox-inline').on('change', function (e) {
				if (!self.list_revertingCheckbox) {
					if (self.isDisabled) {
						revertCheckbox($(e.currentTarget));
					} else {
						if ($(this).checkbox('isChecked')){
							self.$element.find('.repeater-list-wrapper > table tbody tr:not(.selected)').click();
							self.$element.trigger('selected.fu.repeaterList', $checkboxes);
						}
						else {
							self.$element.find('.repeater-list-wrapper > table tbody tr.selected').click();
							self.$element.trigger('deselected.fu.repeaterList', $checkboxes);
						}
					}
				}
			});

			function revertCheckbox ($checkbox) {
				self.list_revertingCheckbox = true;
				$checkbox.checkbox('toggle');
				delete self.list_revertingCheckbox;
			}
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
			enabled: function (helpers) {
				if (this.viewOptions.list_actions) {
					if (!helpers.status) {
						this.$canvas.find('.repeater-actions-button').attr('disabled', 'disabled');
					} else {
						this.$canvas.find('.repeater-actions-button').removeAttr('disabled');
						toggleActionsHeaderButton.call(this);
					}
				}
			},
			initialize: function (helpers, callback) {
				this.list_sortDirection = null;
				this.list_sortProperty = null;
				this.list_specialBrowserClass = specialBrowserClass();
				this.list_actions_width = (this.viewOptions.list_actions.width !== undefined) ? this.viewOptions.list_actions.width : 37;
				this.list_noItems = false;
				callback();
			},
			resize: function () {
				sizeColumns.call(this, this.$element.find('.repeater-list-wrapper > table thead tr'));
				if (this.viewOptions.list_actions) {
					this.list_sizeActionsTable();
				}
				if (this.viewOptions.list_frozenColumns || this.viewOptions.list_selectable === 'multi') {
					this.list_sizeFrozenColumns();
				}
				if (this.viewOptions.list_columnSyncing) {
					this.list_sizeHeadings();
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
					$listContainer = $('<div class="repeater-list ' + this.list_specialBrowserClass + '" data-preserve="shallow"><div class="repeater-list-wrapper" data-infinite="true" data-preserve="shallow"><table aria-readonly="true" class="table" data-preserve="shallow" role="grid"></table></div></div>');
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
				renderRow.call(this, helpers.container, helpers.subset, helpers.index);
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
	function areDifferentColumns (oldCols, newCols) {
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
	}

	function renderColumn ($row, rows, rowIndex, columns, columnIndex) {
		var className = columns[columnIndex].className;
		var content = rows[rowIndex][columns[columnIndex].property];
		var $col = $('<td></td>');
		var width = columns[columnIndex]._auto_width;

		var property = columns[columnIndex].property;
		if(this.viewOptions.list_actions !== false && property === '@_ACTIONS_@'){
			content = '<div class="repeater-list-actions-placeholder" style="width: ' + this.list_actions_width  + 'px"></div>';
		}

		content = (content!==undefined) ? content : '';

		$col.addClass(((className !== undefined) ? className : '')).append(content);
		if (width !== undefined) {
			$col.outerWidth(width);
		}
		$row.append($col);

		if (this.viewOptions.list_selectable === 'multi' && columns[columnIndex].property === '@_CHECKBOX_@') {
			var checkBoxMarkup = '<label data-row="'+ rowIndex +'" class="checkbox-custom checkbox-inline body-checkbox repeater-select-checkbox">' +
				'<input class="sr-only" type="checkbox"></label>';

			$col.html(checkBoxMarkup);
		}

		if (!(columns[columnIndex].property === '@_CHECKBOX_@' || columns[columnIndex].property === '@_ACTIONS_@') && this.viewOptions.list_columnRendered) {
			this.viewOptions.list_columnRendered({
				container: $row,
				columnAttr: columns[columnIndex].property,
				item: $col,
				rowData: rows[rowIndex]
			}, function () {});
		}
	}

	function renderHeader ($tr, columns, index) {
		var chevDown = 'glyphicon-chevron-down';
		var chevron = '.glyphicon.rlc:first';
		var chevUp = 'glyphicon-chevron-up';
		var $div = $('<div class="repeater-list-heading"><span class="glyphicon rlc"></span></div>');
		var checkBoxMarkup = '<div class="repeater-list-heading header-checkbox"><label class="checkbox-custom checkbox-inline repeater-select-checkbox">' +
			'<input class="sr-only" type="checkbox"></label><div class="clearfix"></div></div>';
		var $header = $('<th></th>');
		var self = this;
		var $both, className, sortable, $span, $spans;

		$div.data('fu_item_index', index);
		$div.prepend(columns[index].label);
		$header.html($div.html()).find('[id]').removeAttr('id');

		if (columns[index].property !== '@_CHECKBOX_@') {
			$header.append($div);
		}
		else {
			$header.append(checkBoxMarkup);
		}

		$both = $header.add($div);
		$span = $div.find(chevron);
		$spans = $span.add($header.find(chevron));

		if (this.viewOptions.list_actions && columns[index].property === '@_ACTIONS_@') {
			var width = this.list_actions_width;
			$header.css('width', width);
			$div.css('width', width);
		}

		className = columns[index].className;
		if (className !== undefined) {
			$both.addClass(className);
		}

		sortable = columns[index].sortable;
		if (sortable) {
			$both.addClass('sortable');
			$div.on('click.fu.repeaterList', function () {
				if (!self.isDisabled) {
					self.list_sortProperty = (typeof sortable === 'string') ? sortable : columns[index].property;
					if ($div.hasClass('sorted')) {
						if ($span.hasClass(chevUp)) {
							$spans.removeClass(chevUp).addClass(chevDown);
							self.list_sortDirection = 'desc';
						} else {
							if (!self.viewOptions.list_sortClearing) {
								$spans.removeClass(chevDown).addClass(chevUp);
								self.list_sortDirection = 'asc';
							} else {
								$both.removeClass('sorted');
								$spans.removeClass(chevDown);
								self.list_sortDirection = null;
								self.list_sortProperty = null;
							}
						}

					} else {
						$tr.find('th, .repeater-list-heading').removeClass('sorted');
						$spans.removeClass(chevDown).addClass(chevUp);
						self.list_sortDirection = 'asc';
						$both.addClass('sorted');
					}

					self.render({
						clearInfinite: true,
						pageIncrement: null
					});
				}
			});
		}

		if (columns[index].sortDirection === 'asc' || columns[index].sortDirection === 'desc') {
			$tr.find('th, .repeater-list-heading').removeClass('sorted');
			$both.addClass('sortable sorted');
			if (columns[index].sortDirection === 'asc') {
				$spans.addClass(chevUp);
				this.list_sortDirection = 'asc';
			} else {
				$spans.addClass(chevDown);
				this.list_sortDirection = 'desc';
			}

			this.list_sortProperty = (typeof sortable === 'string') ? sortable : columns[index].property;
		}

		$tr.append($header);
	}

	function renderRow ($tbody, rows, index) {
		var $row = $('<tr></tr>');
		var self = this;
		var i, length;
		var isMulti = this.viewOptions.list_selectable === 'multi';
		var isActions = this.viewOptions.list_actions;

		if (this.viewOptions.list_selectable) {
			$row.addClass('selectable');
			$row.attr('tabindex', 0);	// allow items to be tabbed to / focused on
			$row.data('item_data', rows[index]);

			$row.on('click.fu.repeaterList', function () {
				if (!self.isDisabled) {
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

					toggleActionsHeaderButton.call(self);
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
			$row.data('item_data', rows[index]);
		}

		$tbody.append($row);

		for (i = 0, length = this.list_columns.length; i < length; i++) {
			renderColumn.call(this, $row, rows, index, this.list_columns, i);
		}

		if (this.viewOptions.list_rowRendered) {
			this.viewOptions.list_rowRendered({
				container: $tbody,
				item: $row,
				rowData: rows[index]
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

	function renderThead ($table, data) {
		var columns = data.columns || [];
		var $thead = $table.find('thead');
		var i, length, $tr;

		if (this.list_firstRender || areDifferentColumns(this.list_columns, columns) || $thead.length === 0) {
			$thead.remove();

			if (data.count < 1) {
				this.list_noItems = true;
			}

			if (this.viewOptions.list_selectable === 'multi' && !this.list_noItems) {
				var checkboxColumn = {
					label: 'c',
					property: '@_CHECKBOX_@',
					sortable: false
				};
				columns.splice(0, 0, checkboxColumn);
			}

			this.list_columns = columns;
			this.list_firstRender = false;
			this.$loader.removeClass('noHeader');

			if (this.viewOptions.list_actions && !this.list_noItems){
				var actionsColumn = {
					label: this.viewOptions.list_actions.label || '<span class="actions-hidden">a</span>',
					property: '@_ACTIONS_@',
					sortable: false,
					width: this.list_actions_width
				};
				columns.push(actionsColumn);
			}


			$thead = $('<thead data-preserve="deep"><tr></tr></thead>');
			$tr = $thead.find('tr');
			for (i = 0, length = columns.length; i < length; i++) {
				renderHeader.call(this, $tr, columns, i);
			}
			$table.prepend($thead);

			if (this.viewOptions.list_selectable === 'multi' && !this.list_noItems) {
				//after checkbox column is created need to get width of checkbox column from
				//its css class
				var checkboxWidth = this.$element.find('.repeater-list-wrapper .header-checkbox').outerWidth();
				var selectColumn = $.grep(columns, function(column){
					return column.property === '@_CHECKBOX_@';
				})[0];
				selectColumn.width = checkboxWidth;
			}
			sizeColumns.call(this, $tr);
		}
	}

	function sizeColumns ($tr) {
		var automaticallyGeneratedWidths = [];
		var self = this;
		var i, length, newWidth, widthTaken;

		if (this.viewOptions.list_columnSizing) {
			i = 0;
			widthTaken = 0;
			$tr.find('th').each(function () {
				var $th = $(this);
				var width;
				if (self.list_columns[i].width !== undefined) {
					width = self.list_columns[i].width;
					$th.outerWidth(width);
					widthTaken += $th.outerWidth();
					self.list_columns[i]._auto_width = width;
				} else {
					var outerWidth = $th.find('.repeater-list-heading').outerWidth();
					automaticallyGeneratedWidths.push({
						col: $th,
						index: i,
						minWidth: outerWidth
					});
				}

				i++;
			});

			length = automaticallyGeneratedWidths.length;
			if (length > 0) {
				var canvasWidth = this.$canvas.find('.repeater-list-wrapper').outerWidth();
				newWidth = Math.floor((canvasWidth - widthTaken) / length);
				for (i = 0; i < length; i++) {
					if (automaticallyGeneratedWidths[i].minWidth > newWidth) {
						newWidth = automaticallyGeneratedWidths[i].minWidth;
					}
					automaticallyGeneratedWidths[i].col.outerWidth(newWidth);
					this.list_columns[automaticallyGeneratedWidths[i].index]._auto_width = newWidth;
				}
			}
		}
	}

	function specialBrowserClass () {
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

	function toggleActionsHeaderButton () {
		var $selected = this.$canvas.find('.repeater-list-wrapper > table .selected');
		var $actionsColumn = this.$element.find('.table-actions');
		if ($selected.length > 0) {
			$actionsColumn.find('thead .btn').removeAttr('disabled');
		} else {
			$actionsColumn.find('thead .btn').attr('disabled', 'disabled');
		}
	}

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
