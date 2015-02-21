define(function (require) {
	// load data.js containing sample datasources
	var data = require('data');
	var jquery = require('jquery');

	// helper function for browser console
	var log = function () {
		if (window.console && window.console.log) {
			var args = Array.prototype.slice.call(arguments);
			window.console.log.apply(console, args);
		}
	};

	// load fuel controls
	require('fuelux/all');


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		CHECKBOX
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// sample method buttons
	$('#btnCheckboxToggle').on('click', function () {
		$('#myCustomCheckbox1').checkbox('toggle');
	});
	$('#btnCheckboxDisable').on('click', function () {
		$('#myCustomCheckbox1').checkbox('disable');
	});
	$('#btnCheckboxEnable').on('click', function () {
		$('#myCustomCheckbox1').checkbox('enable');
	});
	$('#btnCheckboxDestroy').on('click', function () {
		var $container = $('#myCustomCheckbox1').parents('.thin-box:first');
		var markup = $('#myCustomCheckbox1').checkbox('destroy');
		log(markup);
		$container.append(markup);
	});

	// $('#myCustomCheckbox1 > input').on('change', function(){
	// 	console.log('changed');
	// });

	// $('#myCustomCheckbox1').trigger('click');
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		COMBOBOX
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// sample method buttons
	$('#btnComboboxGetSelectedItem').on('click', function () {
		var selectedItem = $('#myCombobox').combobox('selectedItem');
		log('selectedItem: ', selectedItem);
	});
	$('#btnComboboxSelectByValue').on('click', function () {
		$('#myCombobox').combobox('selectByValue', '1');
	});
	$('#btnComboboxSelectByIndex').on('click', function () {
		$('#myCombobox').combobox('selectByIndex', '1');
	});
	$('#btnComboboxSelectByText').on('click', function () {
		$('#myCombobox').combobox('selectByText', 'Four');
	});
	$('#btnComboboxSelectBySelector').on('click', function () {
		$('#myCombobox').combobox('selectBySelector', 'li[data-fizz=buzz]');
	});
	$('#btnComboboxDisable').on('click', function () {
		$('#myCombobox').combobox('disable');
	});
	$('#btnComboboxEnable').on('click', function () {
		$('#myCombobox').combobox('enable');
	});
	$('#btnComboboxDestroy').on('click', function () {
		var markup = $('#myCombobox').combobox('destroy');
		log(markup);
		$(this).closest('.section').append(markup);
	});

	// events
	$('#myCombobox').on('changed.fu.combobox', function (event, data) {
		log(data);
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		DATEPICKER
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// initialize
	$('#myDatepicker').datepicker({
		allowPastDates: true,
		restricted: [{
			from: '08/10/2014',
			to: '08/15/2014'
		}]
	});

	// sample method buttons
	$('#btnDatepickerEnable').on('click', function () {
		$('#myDatepicker').datepicker('enable');
	});
	$('#btnDatepickerDisable').on('click', function () {
		$('#myDatepicker').datepicker('disable');
	});
	$('#btnDatepickerLogFormattedDate').on('click', function () {
		log($('#myDatepicker').datepicker('getFormattedDate'));
	});
	$('#btnDatepickerLogDateObj').on('click', function () {
		log($('#myDatepicker').datepicker('getDate'));
	});
	$('#btnDatepickerSetDate').on('click', function () {
		var futureDate = new Date(+new Date() + (7 * 24 * 60 * 60 * 1000));
		$('#myDatepicker').datepicker('setDate', futureDate);
		log($('#datepicker').datepicker('getDate'));
	});
	$('#btnDatepickerDestroy').on('click', function () {
		var $container = $('#myDatepicker').parent();
		var markup = $('#myDatepicker').datepicker('destroy');
		log(markup);
		$container.append(markup);
	});

	// events
	$('#myDatepicker').on('changed.fu.datepicker', function (event, data) {
		log('datepicker change event fired');
	});
	$('#myDatepicker').on('inputParsingFailed.fu.datepicker', function () {
		log('datepicker inputParsingFailed event fired');
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		INFINITE SCROLL
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// intitialize
	function initMyInfiniteScroll1() {
		$('#myInfiniteScroll1').infinitescroll({
			dataSource: function (helpers, callback) {
				log('helpers variables', helpers);

				// call and simulate latency
				setTimeout(function () {
					// from data.js
					callback({
						content: data.infiniteScroll.content
					});
				}, data.infiniteScroll.delays[Math.floor(Math.random() * 4)]);
			}
		});

	}
	initMyInfiniteScroll1();

	var infiniteScrollCount = 0;
	$('#myInfiniteScroll2').infinitescroll({
		dataSource: function (helpers, callback) {
			log('helpers variables', helpers);

			setTimeout(function () {
				var resp = {};
				infiniteScrollCount++;
				// from data.js
				resp.content = data.infiniteScroll.content;
				if (infiniteScrollCount >= 5) {
					resp.end = true;
				}

				callback(resp);
			}, data.infiniteScroll.delays[Math.floor(Math.random() * 4)]);
		},
		hybrid: true
	});

	// sample method buttons
	$('#btnInfiniteScrollEnable').on('click', function () {
		$('#myInfiniteScroll1').infinitescroll('enable');
	});
	$('#btnInfiniteScrollDisable').on('click', function () {
		$('#myInfiniteScroll1').infinitescroll('disable');
	});
	$('#btnInfiniteScrollDestroy').on('click', function () {
		var $container = $('#myInfiniteScroll1').parent();
		var markup = $('#myInfiniteScroll1').infinitescroll('destroy');
		log(markup);
		$container.append(markup);
		$('#myInfiniteScroll1').append($('#myInfiniteScroll2').html());
		initMyInfiniteScroll1();
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		LOADER
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// sample method buttons
	$('#btnLoaderPlay').on('click', function () {
		$('#myLoader1').loader('play');
	});
	$('#btnLoaderPause').on('click', function () {
		$('#myLoader1').loader('pause');
	});
	$('#btnLoaderNext').on('click', function () {
		$('#myLoader1').loader('next');
	});
	$('#btnLoaderPrevious').on('click', function () {
		$('#myLoader1').loader('previous');
	});
	$('#btnLoaderDestroy').on('click', function () {
		var $container = $('#myLoader1').parent();
		var markup = $('#myLoader1').loader('destroy');
		log(markup);
		$container.append(markup);
		$('#myLoader1').loader();
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		PILLBOX
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// intitialize
	$('#myPillbox1').pillbox({
		edit: true,
		onKeyDown: function (inputData, callback) {
			log('inputData:', inputData);

			callback({
				data: [
					{
						"text": "African cherry orange",
						"value": "african cherry orange",
						"attr": {
							"cssClass": "example-pill-class",
							"style": "background-color: orange;",
							"data-example-attribute": "true"
						},
						"data": {
							"flora": true,
							"color": "orange"
						}
					},
					{
						"text": "Bilberry",
						"value": "bilberry",
						"attr": {
							"cssClass": "example-pill-class",
							"style": "background-color: midnightBlue;",
							"data-example-attribute": "true"
						},
						"data": {
							"flora": true,
							"color": "blue"
						}
					},
					{
						"text": "Ceylon gooseberry",
						"value": "ceylon gooseberry",
						"attr": {
							"cssClass": "example-pill-class",
							"style": "background-color: mediumBlue;",
							"data-example-attribute": "true"
						}
					},
					{
						"text": "Dead Man's Fingers",
						"value": "dead man's fingers",
						"attr": {
							"cssClass": "example-pill-class",
							"style": "background-color: darkSlateBlue;",
							"data-example-attribute": "true"
						}
					},
					{
						"text": "Governor’s Plum",
						"value": "governor’s plum",
						"attr": {
							"cssClass": "example-pill-class",
							"style": "background-color: darkViolet;",
							"data-example-attribute": "true"
						}
					},
					{
						"text": "Huckleberry",
						"value": "huckleberry",
						"attr": {
							"cssClass": "example-pill-class",
							"style": "background-color: darkBlue;",
							"data-example-attribute": "true"
						}
					},
					{
						"text": "Jackfruit",
						"value": "jackfruit",
						"attr": {
							"cssClass": "example-pill-class",
							"style": "background-color: yellow;",
							"data-example-attribute": "true"
						}
					},
					{
						"text": "Lillypilly",
						"value": "lillypilly",
						"attr": {
							"cssClass": "example-pill-class",
							"style": "background-color: pink;",
							"data-example-attribute": "true"
						}
					},
					{
						"text": "Soursop",
						"value": "soursop",
						"attr": {
							"cssClass": "example-pill-class",
							"style": "background-color: beige;",
							"data-example-attribute": "true"
						}
					},
					{
						"text": "Thimbleberry",
						"value": "thimbleberry",
						"attr": {
							"cssClass": "example-pill-class",
							"style": "background-color: Crimson;",
							"data-example-attribute": "true"
						}
					},
					{
						"text": "Wongi",
						"value": "wongi",
						"attr": {
							"cssClass": "example-pill-class",
							"style": "background-color: red;",
							"data-example-attribute": "true"
						}
					},
				]
			});
		}
	});
	$('#myPillbox2').pillbox({
		truncate: true
	});

	// sample method buttons
	$('#btnPillboxEnable').click(function () {
		$('#myPillbox1').pillbox('enable');
	});
	$('#btnPillboxDisable').click(function () {
		$('#myPillbox1').pillbox('disable');
	});
	$('#btnPillboxAdd').click(function () {
		var newItemCount = $('#myPillbox1 ul li').length + 1;
		var randomBackgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
		$('#myPillbox1').pillbox('addItems',
			{
				"text": "item " + newItemCount,
				"value": "item" + newItemCount,
				"attr": {
					"cssClass": "example-pill-class",
					"style": "background-color:" + randomBackgroundColor + ";",
					"data-example-attribute": "true"
				}
			});
	});
	$('#btnPillboxRemoveByValue').click(function () {
		$('#myPillbox1').pillbox('removeByValue', 'item 2');
	});
	$('#btnPillboxRemoveBySelector').click(function () {
		$('#myPillbox1').pillbox('removeBySelector', '.example-pill-class');
	});
	$('#btnPillboxRemoveByText').click(function () {
		$('#myPillbox1').pillbox('removeByText', 'item 3');
	});
	$('#btnPillboxItems').click(function () {
		var items = $('#myPillbox1').pillbox('items');
		log('items: ', items);
	});
	$('#btnPillboxDestroy').click(function () {
		var $container = $('#myPillbox1').parents('.thin-box:first');
		var markup = $('#myPillbox1').pillbox('destroy');
		log(markup);
		$container.append(markup);
		$('#myPillbox1').pillbox({
			edit: true
		});
	});

	// events
	$('#myPillbox1').on('added', function (event, pillData) {
		log('pillbox added', pillData);
	});
	$('#myPillbox1').on('removed', function (event, pillData) {
		log('pillbox removed', pillData);
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		PLACARD
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// sample method buttons
	$('#btnPlacardEnable').click(function () {
		$('#myPlacard1').placard('enable');
	});
	$('#btnPlacardDisable').click(function () {
		$('#myPlacard1').placard('disable');
	});
	$('#btnPlacardDestroy').click(function () {
		var $container = $('#myPlacard1').parent();
		var markup = $('#myPlacard1').placard('destroy');
		log(markup);
		$container.append(markup);
		$('#myPlacard1').placard({
			edit: true
		});
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		RADIO
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// sample method buttons
	$('#btnRadioDisable').on('click', function () {
		$('[name=radio1]').radio('disable');
	});
	$('#btnRadioEnable').on('click', function () {
		$('[name=radio1]').radio('enable');
	});
	$('#btnRadioDestroy').on('click', function () {
		var $container = $('#myCustomRadio1').parents('.thin-box:first');
		var markup = $('#myCustomRadio1').radio('destroy');
		$container.append(markup);
		$('#myRadio1').radio();
	});
	$('#btnRadioInlineDestroy').on('click', function () {
		var $container = $('#myCustomInlineRadio1').parents('.thin-box:first');
		var markup = $('#myCustomInlineRadio1').radio('destroy');
		$container.append(markup);
		$('#myCustomInlineRadio1').radio();
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		REPEATER
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// intitialize
	function initRepeater() {
		// simulate network latency
		var loadDelays = ['300', '600', '900', '1200'];

		// list view setup
		var list = function (options, callback) {
			// build dataSource based with options
			var resp = {
				count: data.repeater.listData.length,
				items: [],
				page: options.pageIndex
			};

			// get start and end limits for JSON
			var i, l;
			resp.pages = Math.ceil(resp.count / (options.pageSize || 50));

			i = options.pageIndex * (options.pageSize || 50);
			l = i + (options.pageSize || 50);
			l = (l <= resp.count) ? l : resp.count;
			resp.start = i + 1;
			resp.end = l;

			// setup columns for list view
			resp.columns = [
				{
					label: 'Common Name',
					property: 'commonName',
					sortable: true
				},
				{
					label: 'Latin Name',
					property: 'latinName',
					sortable: true
				},
				{
					label: 'Appearance',
					property: 'appearance',
					sortable: true
				},
				{
					label: 'Sound',
					property: 'sound',
					sortable: true
				}
			];

			// add sample items to datasource
			for (i; i < l; i++) {
				// from data.js
				resp.items.push(data.repeater.listData[i]);
			}

			//if(options.search){
			//resp.items = [];
			//}

			// call and simulate latency
			setTimeout(function () {
				callback(resp);
			}, loadDelays[Math.floor(Math.random() * 4)]);
		};


		// thumbnail view setup
		var thumbnail = function (options, callback) {
			var sampleImageCategories = ['abstract', 'animals', 'business', 'cats', 'city', 'food', 'nature', 'technics', 'transport'];
			var numItems = 200;

			// build dataSource based with options
			var resp = {
				count: numItems,
				items: [],
				pages: (Math.ceil(numItems / (options.pageSize || 30))),
				page: options.pageIndex
			};

			// get start and end limits for JSON
			var i, l;
			i = options.pageIndex * (options.pageSize || 30);
			l = i + (options.pageSize || 30);
			resp.start = i + 1;
			resp.end = l;

			// add sample items to datasource
			for (i; i < l; i++) {
				resp.items.push({
					name: ('Thumbnail ' + (i + 1)),
					src: 'http://lorempixel.com/65/65/' + sampleImageCategories[Math.floor(Math.random() * 9)] + '/?_=' + i
				});
			}

			//if(options.search){
			//resp.items = [];
			//}

			// call and simulate latency
			setTimeout(function () {
				callback(resp);
			}, loadDelays[Math.floor(Math.random() * 4)]);
		};

		// initialize repater
		$('#myRepeater').repeater({
			dataSource: function (options, callback) {
				if (options.view === 'list') {
					list(options, callback);
				} else if (options.view === 'thumbnail') {
					thumbnail(options, callback);
				}
			},
			list_selectable: 'multi',
			list_noItemsHTML: 'no items found',
			thumbnail_noItemsHTML: 'no items found',
			thumbnail_infiniteScroll: {
				hybrid: true
			}
		});
	}
	initRepeater();

	// sample method buttons
	$('#btnRepeaterEnable').on('click', function () {
		$('#myRepeater').repeater('enable');
	});
	$('#btnRepeaterDisable').on('click', function () {
		$('#myRepeater').repeater('disable');
	});
	$('#btnRepeaterDestroy').on('click', function () {
		var $container = $('#myRepeater').parent();
		var markup = $('#myRepeater').repeater('destroy');
		log(markup);
		$container.append(markup);

		initRepeater();
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		SCHEDULER
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// sample method buttons
	$('#btnSchedulerEnable').on('click', function () {
		$('#myScheduler').scheduler('enable');
	});
	$('#btnSchedulerDisable').on('click', function () {
		$('#myScheduler').scheduler('disable');
	});
	$('#btnSchedulerLogValue').on('click', function () {
		var val = $('#myScheduler').scheduler('value');
		log(val);
	});
	$('#btnSchedulerSetValue').on('click', function () {
		var newVal = {
			"startDateTime": "2014-03-31T03:23+02:00",
			"timeZone": {
				"name": "Namibia Standard Time",
				"offset": "+02:00"
			},
			"recurrencePattern": "FREQ=MONTHLY;INTERVAL=6;BYDAY=WE;BYSETPOS=3;UNTIL=20140919;"
		};
		log(newVal);
		$('#myScheduler').scheduler('value', newVal);
	});
	$('#btnSchedulerDestroy').on('click', function () {
		var $container = $('#myScheduler').parent();
		var markup = $('#myScheduler').scheduler('destroy');
		log(markup);
		$container.append(markup);
		$('#myScheduler').scheduler();
	});

	// events
	$('#myScheduler').on('changed.fu.scheduler', function () {
		log('scheduler changed.fu.scheduler: ', arguments);
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		SEARCH
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// sample method buttons
	$('#btnSearchDisable').on('click', function () {
		$('#mySearch').search('disable');
	});
	$('#btnSearchEnable').on('click', function () {
		$('#mySearch').search('enable');
	});
	$('#btnSearchDestroy').on('click', function () {
		var $container = $('#mySearch').parent();
		var markup = $('#mySearch').search('destroy');
		log(markup);
		$container.append(markup);
		$('#mySearch').search();
	});

	// events
	$('#mySearch').on('searched.fu.search', function (event, text) {
		log('Searched: ' + text);
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		SELECTLIST
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// sample method buttons
	$('#btnSelectlistGetSelectedItem').on('click', function () {
		log($('#mySelectlist').selectlist('selectedItem'));
	});
	$('#btnSelectlistSelectByValue').on('click', function () {
		$('#mySelectlist').selectlist('selectByValue', '2');
	});
	$('#btnSelectlistSelectBySelector').on('click', function () {
		$('#mySelectlist').selectlist('selectBySelector', 'li[data-fizz=buzz]');
	});
	$('#btnSelectlistSelectByIndex').on('click', function () {
		$('#mySelectlist').selectlist('selectByIndex', '4');
	});
	$('#btnSelectlistSelectByText').on('click', function () {
		$('#mySelectlist').selectlist('selectByText', 'One');
	});
	$('#btnSelectlistEnableSelectlist').on('click', function () {
		$('#mySelectlist').selectlist('enable');
	});
	$('#btnSelectlistDisableSelectlist').on('click', function () {
		$('#mySelectlist').selectlist('disable');
	});
	$('#btnSelectlistDestroy').on('click', function () {
		var $container = $('#mySelectlist').cont();
		var markup = $('#mySelectlist').selectlist('destroy');
		log(markup);
		$container.append(markup);
		$('#mySelectlist').selectlist();
	});

	// events
	$('#mySelectlist').on('clicked.fu.selectlist', function (event, target) {
		log('clicked', target);
	});
	$('#mySelectlist').on('changed.fu.selectlist', function (event, data) {
		log('changed', data);
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		SPINBOX
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// intitalize control
	$('#mySpinbox2').spinbox({
		value: '1,0px',
		min: 0,
		max: 10,
		step: 0.1,
		decimalMark: ',',
		units: ['px']
	});

	// events
	$('#mySpinbox1').on('changed.fu.spinbox', function (event, value) {
		log('Spinbox changed: ', value);
	});
	$('#mySpinbox2').on('changed.fu.spinbox', function (event, value) {
		log('Spinbox changed: ', value);
	});

	// sample method buttons
	$('#spinboxSetValueBtn').on('click', function () {
		$('#mySpinbox1').spinbox('value', 4);
	});
	$('#spinboxGetValueBtn').on('click', function () {
		log($('#mySpinbox1').spinbox('value'));
	});
	$('#enableSpinbox').on('click', function () {
		$('#mySpinbox1').spinbox('enable');
	});
	$('#disableSpinbox').on('click', function () {
		$('#mySpinbox1').spinbox('disable');
	});
	$('#btnSpinboxDestroy').on('click', function () {
		var $container = $('#mySpinbox1').parent();
		var markup = $('#mySpinbox1').spinbox('destroy');
		log(markup);
		$container.append(markup);
		$('#mySpinbox1').spinbox();
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		TREE
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// initialize
	function myTreeInit() {
		$('#myTree1').tree({
			dataSource: function (parentData, callback) {
				// log("Opening branch data: ", parentData);

				setTimeout(function () {
					callback({
						data: [
							{
								"name": "Ascending and Descending",
								"type": "folder",
								"attr": {
									"id": "folder1",
									"cssClass": "example-tree-class"
								}
							},
							{
								"name": "Sky and Water I (with custom icon)",
								"type": "item",
								"attr": {
									"id": "item1",
									"data-icon": "glyphicon glyphicon-file"
								}
							},
							{
								"name": "Drawing Hands",
								"type": "folder",
								"attr": {
									"id": "folder2"
								}
							},
							{
								"name": "Waterfall",
								"type": "item",
								"attr": {
									"id": "item2"
								}
							},
							{
								"name": "Belvedere",
								"type": "folder",
								"attr": {
									"id": "folder3"
								}
							},
							{
								"name": "Relativity (with custom icon)",
								"type": "item",
								"attr": {
									"id": "item3",
									"data-icon": "glyphicon glyphicon-picture"
								}
							},
							{
								"name": "House of Stairs",
								"type": "folder",
								"attr": {
									"id": "folder4"
								}
							},
							{
								"name": "Convex and Concave",
								"type": "item",
								"attr": {
									"id": "item4"
								}
							}
						]
					});
				}, 400);
			},
			folderSelect: false
		});
	}
	myTreeInit();

	$('#myTree2').tree({
		dataSource: function (parentData, callback) {
			log("Opening branch data: ", parentData);

			setTimeout(function () {
				callback({
					data: [
						{
							"name": "Ascending and Descending",
							"type": "folder",
							"attr": {
								"id": "folder1"
							}
						},
						{
							"name": "Sky and Water I (with custom icon)",
							"type": "item",
							"attr": {
								"id": "item1",
								"data-icon": "glyphicon glyphicon-file"
							}
						},
						{
							"name": "Drawing Hands",
							"type": "folder",
							"attr": {
								"id": "folder2"
							}
						},
						{
							"name": "Waterfall",
							"type": "item",
							"attr": {
								"id": "item2"
							}
						},
						{
							"name": "Belvedere",
							"type": "folder",
							"attr": {
								"id": "folder3"
							}
						},
						{
							"name": "Relativity (with custom icon)",
							"type": "item",
							"attr": {
								"id": "item3",
								"data-icon": "glyphicon glyphicon-picture"
							}
						},
						{
							"name": "House of Stairs",
							"type": "folder",
							"attr": {
								"id": "folder4"
							}
						},
						{
							"name": "Convex and Concave",
							"type": "item",
							"attr": {
								"id": "item4"
							}
						}
					]
				});
			}, 400);
		},
		cacheItems: true,
		folderSelect: true,
		multiSelect: true
	});

	// sample method buttons
	$('#btnTreeDestroy').click(function () {
		var $container = $('#myTree1').parent();
		var markup = $('#myTree1').tree('destroy');
		log(markup);
		$container.append(markup);
		myTreeInit();
	});

	$('#btnTreeDiscloseVisible').click(function () {
		$('#myTree1').tree('discloseVisible');
	});

	$('#btnTreeDiscloseAll').click(function () {
		$('#myTree1').one('exceededDisclosuresLimit.fu.tree', function () {
			$('#myTree1').data('keep-disclosing', false);
		});
		$('#myTree1').tree('discloseAll');
	});

	$('#btnTreeCloseAll').click(function () {
		$('#myTree1').tree('closeAll');
	});

	// events
	$('#myTree1').on('loaded.fu.tree', function (e) {
		log('#myTree1 Loaded');
	});
	$('#myTree1').on('selected.fu.tree', function (event, selected) {
		log('Selected Event: ', selected);
		log($('#myTree1').tree('selectedItems'));
	});
	$('#myTree1').on('deselected.fu.tree', function (e, selected) {
		log('Deselected Event: ', selected);
	});
	$('#myTree1').on('updated.fu.tree', function (event, selected) {
		log('Updated Event: ', selected);
		log($('#myTree1').tree('selectedItems'));
	});
	$('#myTree1').on('opened.fu.tree', function (event, parentData) {
		log('Opened Event, parent data: ', parentData);
	});
	$('#myTree1').on('closed.fu.tree', function (event, parentData) {
		log('Closed Event, parent data: ', parentData);
	});


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		WIZARD
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// sample markup
	var emailSetupSamplePane = '<div class="bg-warning alert">' +
	'	<h4>Setup Message</h4>' +
	'	<p>Soko radicchio bunya nuts gram dulse silver beet parsnip napa cabbage ' +
	'	lotus root sea lettuce brussels sprout cabbage. Catsear cauliflower garbanzo yarrow ' +
	'	salsify chicory garlic bell pepper napa cabbage lettuce tomato kale arugula melon ' +
	'	sierra leone bologi rutabaga tigernut. Sea lettuce gumbo grape kale kombu cauliflower ' +
	'	salsify kohlrabi okra sea lettuce broccoli celery lotus root carrot winter purslane ' +
	'	turnip greens garlic. Jacama garlic courgette coriander radicchio plantain scallion ' +
	'	cauliflower fava bean desert raisin spring onion chicory bunya nuts. Sea lettuce water ' +
	'	spinach gram fava bean leek dandelion silver beet eggplant bush tomato. </p>' +
	'	<p>Pea horseradish azuki bean lettuce avocado asparagus okra. ' +
	'	Kohlrabi radish okra azuki bean corn fava bean mustard tigernut jacama green bean ' +
	'	celtuce collard greens avocado quandong fennel gumbo black-eyed pea. Grape silver ' +
	'	beet watercress potato tigernut corn groundnut. Chickweed okra pea winter ' +
	'	purslane coriander yarrow sweet pepper radish garlic brussels sprout groundnut ' +
	'	summer purslane earthnut pea tomato spring onion azuki bean gourd. Gumbo kakadu ' +
	'	plum komatsuna black-eyed pea green bean zucchini gourd winter purslane silver ' +
	'	beet rock melon radish asparagus spinach. </p>' +
	'</div>';

	// sample method buttons
	$('#btnWizardPrev').on('click', function () {
		$('#myWizard').wizard('previous');
	});
	$('#btnWizardNext').on('click', function () {
		$('#myWizard').wizard('next', 'foo');
	});
	$('#btnWizardStep').on('click', function () {
		var item = $('#myWizard').wizard('selectedItem');
		log(item.step);
	});
	$('#btnWizardSetStep').on('click', function () {
		$('#myWizard').wizard('selectedItem', {
			step: 3
		});
	});

	$('#btnWizardAddSteps').on('click', function () {
		$('#myWizard').wizard('addSteps', 2, [{
			badge: '',
			label: 'Setup',
			pane: emailSetupSamplePane
		}]);
	});
	$('#btnWizardRemoveStep').on('click', function () {
		$('#myWizard').wizard('removeSteps', 4, 1);
	});
	$('#btnWizardDestroy').click(function () {
		var $container = $('#myWizard').parent();
		var markup = $('#myWizard').wizard('destroy');
		log(markup);
		$container.append(markup);
		$('#myWizard').wizard();
	});

	// events
	$('#myWizard').on('changed.fu.wizard', function (event, data) {
		log('changed data', data);
	});

	$('#myWizard').on('actionclicked.fu.wizard', function (event, data) {
		log('actionClicked: ', data);
	});
	$('#myWizard').on('stepclicked.fu.wizard', function (event, data) {
		log('step ' + data.step + ' clicked');
		if (data.step === 1) {
			// return event.preventDefault();
		}
	});
	$('#myWizard').on('finished', function (event, data) {
		log('finished');
	});
});
