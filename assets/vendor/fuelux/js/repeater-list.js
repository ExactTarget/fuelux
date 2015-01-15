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
		$.fn.repeater.Constructor.prototype.list_clearSelectedItems = function(){
			this.$canvas.find('.repeater-list-check').remove();
			this.$canvas.find('.repeater-list table tbody tr.selected').removeClass('selected');
		};

		$.fn.repeater.Constructor.prototype.list_highlightColumn = function(index, force){
			var tbody = this.$canvas.find('.repeater-list tbody');
			if(this.viewOptions.list_highlightSortedColumn || force){
				tbody.find('td.sorted').removeClass('sorted');
				tbody.find('tr').each(function(){
					var col = $(this).find('td:nth-child(' + (index + 1) + ')');
					col.addClass('sorted');
				});
			}
		};

		$.fn.repeater.Constructor.prototype.list_getSelectedItems = function(){
			var selected = [];
			this.$canvas.find('.repeater-list table tbody tr.selected').each(function(){
				var $item = $(this);
				selected.push({ data: $item.data('item_data'), element: $item });
			});
			return selected;
		};

		$.fn.repeater.Constructor.prototype.list_positionHeadings = function(){
			var $wrapper = this.$element.find('.repeater-list-wrapper');
			var offsetLeft = $wrapper.offset().left;
			var scrollLeft = $wrapper.scrollLeft();
			if(scrollLeft>0){
				$wrapper.find('.repeater-list-heading').each(function(){
					var $heading = $(this);
					var left = ($heading.parents('th:first').offset().left - offsetLeft) + 'px';
					$heading.addClass('shifted').css('left', left);
				});
			}else{
				$wrapper.find('.repeater-list-heading').each(function(){
					$(this).removeClass('shifted').css('left', '');
				});
			}
		};

		$.fn.repeater.Constructor.prototype.list_setSelectedItems = function(items, force){
			var selectable = this.viewOptions.list_selectable;
			var self = this;
			var data, i, $item, l;

			//this function is necessary because lint yells when a function is in a loop
			var checkIfItemMatchesValue = function(){
				$item = $(this);
				data = $item.data('item_data') || {};
				if(data[items[i].property]===items[i].value){
					selectItem($item, items[i].selected);
				}
			};

			var selectItem = function($itm, select){
				select = (select!==undefined) ? select : true;
				if(select){
					if(!force && selectable!=='multi'){
						self.list_clearSelectedItems();
					}
					if(!$itm.hasClass('selected')){
						$itm.addClass('selected');
						$itm.find('td:first').prepend('<div class="repeater-list-check"><span class="glyphicon glyphicon-ok"></span></div>');
					}
				}else{
					$itm.find('.repeater-list-check').remove();
					$itm.removeClass('selected');
				}
			};

			if(!$.isArray(items)){
				items = [items];
			}
			if(force===true || selectable==='multi'){
				l = items.length;
			}else if(selectable){
				l = (items.length>0) ? 1 : 0;
			}else{
				l = 0;
			}
			for(i=0; i<l; i++){
				if(items[i].index!==undefined){
					$item = this.$canvas.find('.repeater-list table tbody tr:nth-child(' + (items[i].index + 1) + ')');
					if($item.length>0){
						selectItem($item, items[i].selected);
					}
				}else if(items[i].property!==undefined && items[i].value!==undefined){
					this.$canvas.find('.repeater-list table tbody tr').each(checkIfItemMatchesValue);
				}
			}
		};

		$.fn.repeater.Constructor.prototype.list_sizeHeadings = function(){
			var $table = this.$element.find('.repeater-list table');
			$table.find('thead th').each(function(){
				var $hr = $(this);
				var $heading = $hr.find('.repeater-list-heading');
				$heading.outerHeight($hr.outerHeight());
				$heading.outerWidth($hr.outerWidth());
			});
		};

		//ADDITIONAL DEFAULT OPTIONS
		$.fn.repeater.defaults = $.extend({}, $.fn.repeater.defaults, {
			list_columnRendered: null,
			list_columnSizing: true,
			list_columnSyncing: true,
			list_highlightSortedColumn: false,
			list_infiniteScroll: false,
			list_noItemsHTML: '',
			list_selectable: false,
			list_sortClearing: false,
			list_rowRendered: null
		});

		//EXTENSION DEFINITION
		$.fn.repeater.viewTypes.list = {
			cleared: function(helpers, callback){
				if(this.viewOptions.list_columnSyncing){
					this.list_sizeHeadings();
				}
				callback();
			},
			dataOptions: function(opts, callback){
				if(this.list_sortDirection){
					opts.sortDirection = this.list_sortDirection;
				}
				if(this.list_sortProperty){
					opts.sortProperty = this.list_sortProperty;
				}
				callback(opts);
			},
			initialize: function(helpers, callback){
				this.list_sortDirection = null;
				this.list_sortProperty = null;
				callback();
			},
			selected: function(helpers, callback){
				var infScroll = this.viewOptions.list_infiniteScroll;
				var opts;

				this.list_firstRender = true;
				this.$loader.addClass('noHeader');

				if(infScroll){
					opts = (typeof infScroll === 'object') ? infScroll : {};
					this.infiniteScrolling(true, opts);
				}

				callback();
			},
			resize: function(helpers, callback){
				if(this.viewOptions.list_columnSyncing){
					this.list_sizeHeadings();
				}
				callback();
			},
			renderer: {	//RENDERING REPEATER-LIST, REPEATER-LIST-WRAPPER, AND TABLE
				complete: function(helpers, callback){
					var $sorted;
					if(this.viewOptions.list_columnSyncing){
						this.list_sizeHeadings();
						this.list_positionHeadings();
					}
					$sorted = this.$canvas.find('.repeater-list-heading.sorted');
					if($sorted.length>0){
						this.list_highlightColumn($sorted.data('fu_item_index'));
					}
					callback();
				},
				render: function(helpers, callback){
					var $list = this.$element.find('.repeater-list');
					var self = this;
					var $item;
					if($list.length>0){
						callback({ action: 'none', item: $list });
					}else{
						$item = $('<div class="repeater-list" data-preserve="shallow"><div class="repeater-list-wrapper" data-infinite="true" data-preserve="shallow"><table aria-readonly="true" class="table" data-container="true" data-preserve="shallow" role="grid"></table></div></div>');
						$item.find('.repeater-list-wrapper').on('scroll.fu.repeaterList', function(){
							if(self.viewOptions.list_columnSyncing){
								self.list_positionHeadings();
							}
						});
						callback({ item: $item });
					}
				},
				nested: [
					{	//RENDERING THEAD
						complete: function(helpers, callback){
							var auto = [];
							var self = this;
							var i, l, newWidth, taken;

							if(!this.viewOptions.list_columnSizing || this.list_columnsSame){
								callback();
							}else{
								i = 0;
								taken = 0;
								helpers.item.find('th').each(function(){
									var $th = $(this);
									var isLast = ($th.next('th').length===0);
									var width;
									if(self.list_columns[i].width!==undefined){
										width = self.list_columns[i].width;
										$th.outerWidth(width);
										taken += $th.outerWidth();
										if(!isLast){
											self.list_columns[i]._auto_width = width;
										}else{
											$th.outerWidth('');
										}
									}else{
										auto.push({ col: $th, index: i, last: isLast });
									}
									i++;
								});

								l=auto.length;
								if(l>0){
									newWidth = Math.floor((this.$canvas.width() - taken) / l);
									for(i=0; i<l; i++){
										if(!auto[i].last){
											auto[i].col.outerWidth(newWidth);
											this.list_columns[auto[i].index]._auto_width = newWidth;
										}
									}
								}
								callback();
							}
						},
						render: function(helpers, callback){
							var differentColumns = function(oldCols, newCols){
								var i, j, l;
								if(!oldCols){ return true; }
								if(!newCols){ return false; }
								if(newCols.length!==oldCols.length){ return true; }
								for(i=0, l=newCols.length; i<l; i++){
									if(!oldCols[i]){
										return true;
									}else{
										for(j in newCols[i]){
											if(oldCols[i][j]!==newCols[i][j]){
												return true;
											}
										}
									}
								}
								return false;
							};

							if(this.list_firstRender || differentColumns(this.list_columns, helpers.data.columns)){
								this.$element.find('thead').remove();
								this.list_columns = helpers.data.columns;
								this.list_columnsSame = false;
								this.list_firstRender = false;
								this.$loader.removeClass('noHeader');
								callback({ item: '<thead data-preserve="deep"><tr data-container="true"></tr></thead>' });
							}else{
								this.list_columnsSame = true;
								callback({ skipNested: true });
							}
						},
						nested: [
							{	//RENDERING COLUMN HEADERS (TH AND REPEATER-LIST-HEADING)
								render: function(helpers, callback){
									var chevDown = 'glyphicon-chevron-down';
									var chevron = '.glyphicon.rlc:first';
									var chevUp = 'glyphicon-chevron-up';
									var $div = $('<div class="repeater-list-heading"><span class="glyphicon rlc"></span></div>');
									var index = helpers.index;
									var $item = $('<th></th>');
									var self = this;
									var subset = helpers.subset;
									var $both, className, sortable, $span, $spans;

									$div.data('fu_item_index', index);
									$div.prepend(helpers.subset[helpers.index].label);
									$item.html($div.html()).find('[id]').removeAttr('id');
									$item.append($div);

									$both = $item.add($div);
									$span = $div.find(chevron);
									$spans = $span.add($item.find(chevron));

									className = subset[index].className;
									if(className!==undefined){
										$both.addClass(className);
									}

									sortable = subset[index].sortable;
									if(sortable){
										$both.addClass('sortable');
										$div.on('click.fu.repeaterList', function(){
											self.list_sortProperty = (typeof sortable === 'string') ? sortable : subset[index].property;
											if($div.hasClass('sorted')){
												if($span.hasClass(chevUp)){
													$spans.removeClass(chevUp).addClass(chevDown);
													self.list_sortDirection = 'desc';
												}else{
													if(!self.viewOptions.list_sortClearing){
														$spans.removeClass(chevDown).addClass(chevUp);
														self.list_sortDirection = 'asc';
													}else{
														$both.removeClass('sorted');
														$spans.removeClass(chevDown);
														self.list_sortDirection = null;
														self.list_sortProperty = null;
													}
												}
											}else{
												helpers.container.find('th, .repeater-list-heading').removeClass('sorted');
												$spans.removeClass(chevDown).addClass(chevUp);
												self.list_sortDirection = 'asc';
												$both.addClass('sorted');
											}
											self.render({ clearInfinite: true, pageIncrement: null });
										});
									}

									if(subset[index].sortDirection==='asc' || subset[index].sortDirection==='desc'){
										helpers.container.find('th, .repeater-list-heading').removeClass('sorted');
										$both.addClass('sortable sorted');
										if(subset[index].sortDirection==='asc'){
											$spans.addClass(chevUp);
											this.list_sortDirection = 'asc';
										}else{
											$spans.addClass(chevDown);
											this.list_sortDirection = 'desc';
										}
										this.list_sortProperty = (typeof sortable === 'string') ? sortable : subset[index].property;
									}

									callback({ item: $item });
								},
								repeat: 'data.columns'
							}
						]
					},
					{	//RENDERING TBODY
						render: function(helpers, callback){
							var obj = {};
							var $empty, $item;

							$item = this.$canvas.find('.repeater-list table tbody');
							if($item.length>0){
								obj.action = 'none';
							}else{
								$item = $('<tbody data-container="true"></tbody>');
							}
							obj.item = $item;

							if(helpers.data.items.length<1){
								obj.skipNested = true;
								$empty = $('<tr class="empty"><td colspan="' + this.list_columns.length + '"></td></tr>');
								$empty.find('td').append(this.viewOptions.list_noItemsHTML);
								$item.append($empty);
							}

							callback(obj);
						},
						nested: [
							{	//RENDERING ROWS (TR)
								complete: function(helpers, callback){
									var obj = {
										container: helpers.container,
										rowData: helpers.subset[helpers.index]
									};
									if(helpers.item!==undefined){
										obj.item = helpers.item;
									}
									if(this.viewOptions.list_rowRendered){
										this.viewOptions.list_rowRendered(obj, function(){
											callback();
										});
									}else{
										callback();
									}
								},
								render: function(helpers, callback){
									var $item = $('<tr data-container="true"></tr>');
									var self = this;

									if(this.viewOptions.list_selectable){
										$item.addClass('selectable');
										$item.attr('tabindex', 0);	// allow items to be tabbed to / focused on
										$item.data('item_data', helpers.subset[helpers.index]);
										$item.on('click.fu.repeaterList', function() {
											var $row = $(this);
											if($row.hasClass('selected')){
												$row.removeClass('selected');
												$row.find('.repeater-list-check').remove();
												self.$element.trigger('deselected.fu.repeaterList', $row);
											}else{
												if(self.viewOptions.list_selectable!=='multi'){
													self.$canvas.find('.repeater-list-check').remove();
													self.$canvas.find('.repeater-list tbody tr.selected').each(function(){
														$(this).removeClass('selected');
														self.$element.trigger('deselected.fu.repeaterList', $(this));
													});
												}
												$row.addClass('selected');
												$row.find('td:first').prepend('<div class="repeater-list-check"><span class="glyphicon glyphicon-ok"></span></div>');
												self.$element.trigger('selected.fu.repeaterList', $row);
											}
										});
										// allow selection via enter key
										$item.keyup(function (e) {
											if (e.keyCode === 13) {
												// triggering a standard click event to be caught by the row click handler above
												$item.trigger('click.fu.repeaterList');
											}
										});
									}

									this.list_curRowIndex = helpers.index;
									callback({ item: $item });
								},
								repeat: 'data.items',
								nested: [
									{	//RENDERING COLUMNS (TD)
										after: function(helpers, callback){
											var obj = {
												container: helpers.container,
												columnAttr: helpers.subset[helpers.index].property,
												rowData: helpers.data.items[this.list_curRowIndex]
											};
											if(helpers.item!==undefined){
												obj.item = helpers.item;
											}
											if(this.viewOptions.list_columnRendered){
												this.viewOptions.list_columnRendered(obj, function(){
													callback();
												});
											}else{
												callback();
											}
										},
										render: function(helpers, callback){
											var className = helpers.subset[helpers.index].className;
											var content = helpers.data.items[this.list_curRowIndex][helpers.subset[helpers.index].property];
											var $item = $('<td></td>');
											var width = helpers.subset[helpers.index]._auto_width;

											$item.addClass(((className!==undefined) ? className : '')).append(content);
											if(width!==undefined){
												$item.outerWidth(width);
											}
											callback({ item: $item });
										},
										repeat: 'this.list_columns'
									}
								]
							}
						]
					}
				]
			}
		};

	}

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --