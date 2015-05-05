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
			var tbody = this.$canvas.find('.repeater-list tbody');
			if (this.viewOptions.list_highlightSortedColumn || force) {
				tbody.find('td.sorted').removeClass('sorted');
				tbody.find('tr').each(function () {
					var col = $(this).find('td:nth-child(' + (index + 1) + ')');
					col.addClass('sorted');
				});
			}
		};

		$.fn.repeater.Constructor.prototype.list_getSelectedItems = function () {
			var selected = [];
			this.$canvas.find('.repeater-list table tbody tr.selected').each(function () {
				var $item = $(this);
				selected.push({
					data: $item.data('item_data'),
					element: $item
				});
			});
			return selected;
		};

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
				$heading.outerWidth($hr.outerWidth());
			});
		};

		$.fn.repeater.Constructor.prototype.list_setFrozenColumns = function () {
			var frozenTable = this.$canvas.find('.table-frozen');
			var $table = this.$element.find('.repeater-list table');
			var repeaterWrapper = this.$element.find('.repeater-list');
			var numFrozenColumns = this.viewOptions.list_frozenColumns;

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
		};

		$.fn.repeater.Constructor.prototype.list_positionFrozenColumns = function () {
			var $wrapper = this.$element.find('.repeater-canvas');
			var scrollTop = $wrapper.scrollTop();
			var scrollLeft = $wrapper.scrollLeft();
			if (scrollTop > 0) {
				$wrapper.find('.repeater-list-heading').css('top', scrollTop);
			}
			else {
				$wrapper.find('.repeater-list-heading').css('top','0');
			}
			if (scrollLeft > 0) {
				$wrapper.find('.frozen-thead-wrapper').css('left', scrollLeft);
				$wrapper.find('.frozen-column-wrapper').css('left', scrollLeft);
			} else {
				$wrapper.find('.frozen-thead-wrapper').css('left', '0');
				$wrapper.find('.frozen-column-wrapper').css('left', '0');
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
			list_frozenColumns: 0
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
				callback();
			},
			resize: function () {
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
					$listContainer = $('<div class="repeater-list" data-preserve="shallow"><div class="repeater-list-wrapper" data-infinite="true" data-preserve="shallow"><table aria-readonly="true" class="table" data-preserve="shallow" role="grid"></table></div></div>');
					$listContainer.find('.repeater-list-wrapper').on('scroll.fu.repeaterList', function () {
						if (self.viewOptions.list_columnSyncing) {
							self.list_positionHeadings();
						}
					});
					if (self.viewOptions.list_frozenColumns) {
						helpers.container.on('scroll.fu.repeaterList', function () {
							self.list_positionFrozenColumns();
						});
					}
					helpers.container.append($listContainer);
				}

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

				if (this.viewOptions.list_columnSyncing) {
					this.list_sizeHeadings();
					this.list_positionHeadings();
				}

				if (this.viewOptions.list_frozenColumns) {
					this.list_setFrozenColumns();
					this.list_positionFrozenColumns();
				}

				$sorted = this.$canvas.find('.repeater-list-heading.sorted');
				if ($sorted.length > 0) {
					this.list_highlightColumn($sorted.data('fu_item_index'));
				}

				return false;
			}
		};
	}

	//ADDITIONAL METHODS
	function renderColumn ($row, rows, rowIndex, columns, columnIndex) {
		var className = columns[columnIndex].className;
		var content = rows[rowIndex][columns[columnIndex].property];
		var $col = $('<td></td>');
		var width = columns[columnIndex]._auto_width;

		$col.addClass(((className !== undefined) ? className : '')).append(content);
		if (width !== undefined) {
			$col.outerWidth(width);
		}
		$row.append($col);

		if (this.viewOptions.list_columnRendered) {
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
		var $header = $('<th></th>');
		var self = this;
		var $both, className, sortable, $span, $spans;

		$div.data('fu_item_index', index);
		$div.prepend(columns[index].label);
		$header.html($div.html()).find('[id]').removeAttr('id');
		$header.append($div);

		$both = $header.add($div);
		$span = $div.find(chevron);
		$spans = $span.add($header.find(chevron));

		className = columns[index].className;
		if (className !== undefined) {
			$both.addClass(className);
		}

		sortable = columns[index].sortable;
		if (sortable) {
			$both.addClass('sortable');
			$div.on('click.fu.repeaterList', function () {
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
		var i, l;

		if (this.viewOptions.list_selectable) {
			$row.addClass('selectable');
			$row.attr('tabindex', 0);	// allow items to be tabbed to / focused on
			$row.data('item_data', rows[index]);
			$row.on('click.fu.repeaterList', function () {
				var $item = $(this);
				if ($item.hasClass('selected')) {
					$item.removeClass('selected');
					$item.find('.repeater-list-check').remove();
					self.$element.trigger('deselected.fu.repeaterList', $item);
				} else {
					if (self.viewOptions.list_selectable !== 'multi') {
						self.$canvas.find('.repeater-list-check').remove();
						self.$canvas.find('.repeater-list tbody tr.selected').each(function () {
							$(this).removeClass('selected');
							self.$element.trigger('deselected.fu.repeaterList', $(this));
						});
					}

					$item.addClass('selected');
					$item.find('td:first').prepend('<div class="repeater-list-check"><span class="glyphicon glyphicon-ok"></span></div>');
					self.$element.trigger('selected.fu.repeaterList', $item);
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

		$tbody.append($row);

		for (i = 0, l = this.list_columns.length; i < l; i++) {
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

		if (data.items && data.items.length < 1) {
			$empty = $('<tr class="empty"><td colspan="' + this.list_columns.length + '"></td></tr>');
			$empty.find('td').append(this.viewOptions.list_noItemsHTML);
			$tbody.append($empty);
		}
	}

	function renderThead ($table, data) {
		var columns = data.columns || [];
		var i, j, l, $thead, $tr;

		function differentColumns (oldCols, newCols) {
			if (!newCols) {
				return false;
			}
			if (!oldCols || (newCols.length !== oldCols.length)) {
				return true;
			}
			for (i = 0, l = newCols.length; i < l; i++) {
				if (!oldCols[i]) {
					return true;
				} else {
					for (j in newCols[i]) {
						if (oldCols[i][j] !== newCols[i][j]) {
							return true;
						}

					}
				}

			}
			return false;
		}

		if (this.list_firstRender || differentColumns(this.list_columns, columns)) {
			$table.find('thead').remove();

			this.list_columns = columns;
			this.list_firstRender = false;
			this.$loader.removeClass('noHeader');

			$thead = $('<thead data-preserve="deep"><tr></tr></thead>');
			$tr = $thead.find('tr');
			for (i = 0, l = columns.length; i < l; i++) {
				renderHeader.call(this, $tr, columns, i);
			}
			$table.prepend($thead);

			sizeColumns.call(this, $tr);
		}
	}

	function sizeColumns ($tr) {
		var auto = [];
		var self = this;
		var i, l, newWidth, taken;

		if (this.viewOptions.list_columnSizing) {
			i = 0;
			taken = 0;
			$tr.find('th').each(function () {
				var $th = $(this);
				var isLast = ($th.next('th').length === 0);
				var width;
				if (self.list_columns[i].width !== undefined) {
					width = self.list_columns[i].width;
					$th.outerWidth(width);
					taken += $th.outerWidth();
					if (!isLast) {
						self.list_columns[i]._auto_width = width;
					} else {
						$th.outerWidth('');
					}

				} else {
					auto.push({
						col: $th,
						index: i,
						last: isLast
					});
				}

				i++;
			});

			l = auto.length;
			if (l > 0) {
				newWidth = Math.floor((this.$canvas.width() - taken) / l);
				for (i = 0; i < l; i++) {
					if (!auto[i].last) {
						auto[i].col.outerWidth(newWidth);
						this.list_columns[auto[i].index]._auto_width = newWidth;
					}

				}
			}
		}
	}

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
