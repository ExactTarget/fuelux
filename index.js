define(function(require){
	var data = require('data');
	var jquery = require('jquery');
	var sampleData = require('sample/data');
	var StaticDataSource = require('sample/datasource');

	require('fuelux/all');

	// CHECKBOX
	$('#btnCheckboxToggle').on('click', function() {
		$('#MyCheckbox1').checkbox('toggle');
	});
	$('#btnCheckboxDisable').on('click', function() {
		$('#MyCheckbox1').checkbox('disable');
	});
	$('#btnCheckboxEnable').on('click', function() {
		$('#MyCheckbox1').checkbox('enable');
	});

	$('#btnCheckboxDestroy').on('click', function() {
		$('#MyCheckbox1').checkbox();
		var markup = $('#MyCheckbox1').checkbox('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
	});


	// COMBOBOX
	$('#btnComboboxGetSelectedItem').on('click', function () {
		console.log($('#MyComboboxWithSelected').combobox('selectedItem'));
	});
	$('#btnComboboxSelectByValue').on('click', function () {
		$('#MyComboboxWithSelected').combobox('selectByValue', '1');
	});
	$('#btnComboboxSelectByIndex').on('click', function () {
		$('#MyComboboxWithSelected').combobox('selectByIndex', '1');
	});
	$('#btnComboboxSelectByText').on('click', function () {
		$('#MyComboboxWithSelected').combobox('selectByText', 'Four');
	});
	$('#btnComboboxSelectBySelector').on('click', function () {
		$('#MyComboboxWithSelected').combobox('selectBySelector', 'li[data-fizz=buzz]');
	});
	$('#MyComboBoxWithSelectedInput').on('changed.fu.combobox', function (evt, data) {
		console.log(data);
	});
	$('#btnComboboxDisable').on('click', function () {
		$('#MyComboboxWithSelected').combobox('disable');
	});
	$('#btnComboboxEnable').on('click', function () {
		$('#MyComboboxWithSelected').combobox('enable');
	});
	$('#btnComboboxDestroy').on('click', function () {
		var markup = $('#MyComboboxWithSelected').combobox('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
	});



	// DATEPICKER

	$('#MyDatepicker').on('changed.fu.datepicker', function( event, data ) {
		console.log( 'datepicker change event fired' );
	});

	$('#MyDatepicker').on('inputParsingFailed.fu.datepicker', function() {
		console.log( 'datepicker inputParsingFailed event fired' );
	});

	$('#btnDatepickerEnable').on('click', function() {
		$('#MyDatepicker').datepicker('enable');
	});

	$('#btnDatepickerDisable').on('click', function() {
		$('#MyDatepicker').datepicker('disable');
	});

	$('#btnDatepickerLogFormattedDate').on('click', function() {
		console.log( $('#MyDatepicker').datepicker('getFormattedDate') );
	});

	$('#btnDatepickerLogDateObj').on('click', function() {
		console.log( $('#MyDatepicker').datepicker('getDate') );
	});

	$('#btnDatepickerSetDate').on('click', function() {
		var futureDate = new Date(+new Date() + ( 7 * 24 * 60 * 60 * 1000 ) );
		$('#MyDatepicker').datepicker('setDate', futureDate );
		console.log( $('#datepicker').datepicker('getDate') );
	});

	$('#btnDatepickerDestroy').on('click', function() {
		var markup = $('#MyDatepicker').datepicker('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
	});

	$('#MyDatepicker').datepicker();

	// $('#MyDatepicker').datepicker({
	// 	allowPastDates: true,
	// 	momentConfig: {
	// 		culture: 'en',
	// 		format: 'MM-DD-YYYY'
	// 	},
	// 	restricted: [{ from: '08-04-2014', to: '08-15-2014' }, { from: '08-25-2014', to: '08-28-2014' }, { from: '10-01-2014', to: '10-31-2014' }]
	// });



	// INFINITE SCROLL
	function initMyInfiniteScroll1() {
		$('#MyInfiniteScroll1').infinitescroll({
			dataSource: function(helpers, callback){
				setTimeout(function(){
					callback({ content: data.infiniteScroll.content });
				}, data.infiniteScroll.delays[Math.floor(Math.random() * 4)]);
			}
		});

	}

	initMyInfiniteScroll1();

	var infiniteScrollCount = 0;
	$('#MyInfiniteScroll2').infinitescroll({
		dataSource: function(helpers, callback){
			setTimeout(function(){
				var resp = {};
				infiniteScrollCount++;
				resp.content = data.infiniteScroll.content;
				if(infiniteScrollCount>=5){
					resp.end = true;
				}
				callback(resp);
			}, data.infiniteScroll.delays[Math.floor(Math.random() * 4)]);
		},
		hybrid: true
	});

	$('#btnInfiniteScrollEnable').on('click', function() {
		$('#MyInfiniteScroll1').infinitescroll('enable');
	});

	$('#btnInfiniteScrollDisable').on('click', function() {
		$('#MyInfiniteScroll1').infinitescroll('disable');
	});

	$('#btnInfiniteScrollDestroy').on('click', function() {
		var markup = $('#MyInfiniteScroll1').infinitescroll('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MyInfiniteScroll1').append( $('#MyInfiniteScroll2').html() );
		initMyInfiniteScroll1();
	});


	// LOADER
	$('#btnLoaderPlay').on('click', function() {
		$('#MyLoader1').loader('play');
	});

	$('#btnLoaderPause').on('click', function() {
		$('#MyLoader1').loader('pause');
	});

	$('#btnLoaderNext').on('click', function() {
		$('#MyLoader1').loader('next');
	});

	$('#btnLoaderPrevious').on('click', function() {
		$('#MyLoader1').loader('previous');
	});

	$('#btnLoaderDestroy').on('click', function() {
		var markup = $('#MyLoader1').loader('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MyLoader1').loader();
	});



	// PILLBOX
	$('#MyPillbox').pillbox({
		edit: true,
		onKeyDown: function( data, callback ){
			callback({data:[
				{ text: 'Acai', value:  'acai' },
				{ text: 'African cherry orange', value:  'african cherry orange' },
				{ text: 'Banana', value:  'banana' },
				{ text: 'Bilberry', value:  'bilberry' },
				{ text: 'Cantaloupe', value:  'cantaloupe' },
				{ text: 'Ceylon gooseberry', value:  'ceylon gooseberry' },
				{ text: 'Dragonfruit', value:  'dragonfruit' },
				{ text: 'Dead Man\'s Fingers', value:  'dead man\'s fingers' },
				{ text: 'Fig', value:  'fig' },
				{ text: 'Forest strawberries', value:  'forest strawberries' },
				{ text: 'Governor’s Plum', value:  'governor’s plum' },
				{ text: 'Grapefruit', value:  'grapefruit' },
				{ text: 'Guava', value:  'guava' },
				{ text: 'Honeysuckle', value:  'honeysuckle' },
				{ text: 'Huckleberry', value:  'huckleberry' },
				{ text: 'Jackfruit', value:  'jackfruit' },
				{ text: 'Japanese Persimmon', value:  'japanese persimmon' },
				{ text: 'Key Lime', value:  'key lime' },
				{ text: 'Kiwi', value:  'kiwi' },
				{ text: 'Lemon', value:  'lemon' },
				{ text: 'Lillypilly', value:  'lillypilly' },
				{ text: 'Mandarin', value:  'mandarin' },
				{ text: 'Miracle Fruit', value:  'miracle fruit' },
				{ text: 'Orange', value:  'orange' },
				{ text: 'Oregon grape', value:  'oregon grape' },
				{ text: 'Persimmon', value:  'persimmon' },
				{ text: 'Pomegranate', value:  'pomegranate' },
				{ text: 'Rhubarb', value:  'rhubarb' },
				{ text: 'Rose hip', value:  'rose hip' },
				{ text: 'Soursop', value:  'soursop' },
				{ text: 'Starfruit', value:  'starfruit' },
				{ text: 'Tamarind', value:  'tamarind' },
				{ text: 'Thimbleberry', value:  'thimbleberry' },
				{ text: 'Wineberry', value:  'wineberry' },
				{ text: 'Wongi', value:  'wongi' },
				{ text: 'Youngberry', value: 'youngberry' }
			]});
		}
	});

	$('#MyPillboxEmpty').pillbox({
		edit: true,
		onKeyDown: function( data, callback ){
			callback({data:[
				{ text: 'Acai', value:  'acai' },
				{ text: 'African cherry orange', value:  'african cherry orange' },
				{ text: 'Banana', value:  'banana' },
				{ text: 'Bilberry', value:  'bilberry' },
				{ text: 'Cantaloupe', value:  'cantaloupe' },
				{ text: 'Ceylon gooseberry', value:  'ceylon gooseberry' }
			]});
		}
	});

	$('#MyPillboxTruncateReadOnly').pillbox({
		truncate: true
	});

	$('#MyPillbox').on( 'added', function( event, data ) {
		console.log( 'pillbox added', data );
	});

	$('#MyPillbox').on( 'removed', function( event, data ) {
		console.log( 'pillbox removed', data );
	});

	// buttons
	$('#btnPillboxEnable').click(function () {
		$('#MyPillbox').pillbox('enable');
	});

	$('#btnPillboxDisable').click(function () {
		$('#MyPillbox').pillbox('disable');
	});

	$('#btnPillboxAdd').click(function () {
		var newItemCount = $('#MyPillbox ul li').length + 1;
		$('#MyPillbox').pillbox('addItems', {text: 'item ' + newItemCount, value: 'item ' + newItemCount} );
	});

	$('#btnPillboxRemoveByValue').click(function () {
		$('#MyPillbox').pillbox('removeByValue', 'foo');
	});

	$('#btnPillboxRemoveBySelector').click(function () {
		$('#MyPillbox').pillbox('removeBySelector', '.status-success');
	});

	$('#btnPillboxRemoveByText').click(function () {
		$('#MyPillbox').pillbox('removeByText', 'Item 6');
	});

	$('#btnPillboxItems').click(function () {
		var items = $('#MyPillbox').pillbox('items');
		console.log(items);
	});

	$('#btnPillboxDestroy').click(function () {
		var markup = $('#MyPillbox').pillbox('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MyPillbox').pillbox( { edit: true } );
	});



	// PLACARD
	$('#btnPlacardDestroy').click(function () {
		var markup = $('#MyPlacard1').placard('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MyPlacard1').placard( { edit: true } );
	});


	// RADIO
	$('#btnRadioDisable').on('click', function() {
		$('[name=radio1a]').radio('disable');
	});

	$('#btnRadioEnable').on('click', function() {
		$('[name=radio1a]').radio('enable');
	});

	$('#btnRadioDisableAll').on('click', function() {
		$('.radio-container [type=radio]').radio('disable');
	});

	$('#btnRadioEnableAll').on('click', function() {
		$('.radio-container [type=radio]').radio('enable');
	});

	$('#btnRadioDestroy').on('click', function() {
		var markup = $('#MyRadio1').radio('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MyRadio1').radio();
	});


	function initRepeater() {

		// REPEATER
		var delays = ['300', '600', '900', '1200'];
		var myRepeater = $('#MyRepeater');

		var list = function(options, callback){
			var resp = {
				count: data.repeater.listData.length,
				items: [],
				page: options.pageIndex
			};
			var i, l;

			resp.pages = Math.ceil(resp.count/(options.pageSize || 50));

			i = options.pageIndex * (options.pageSize || 50);
			l = i + (options.pageSize || 50);
			l = (l <= resp.count) ? l : resp.count;
			resp.start = i + 1;
			resp.end = l;

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

			for(i; i<l; i++){
				resp.items.push(data.repeater.listData[i]);
			}

			//if(options.search){
			//resp.items = [];
			//}

			if(window.console && window.console.log){
				console.log('Repeater Options:');
				console.log(options);
			}
			setTimeout(function(){
				callback(resp);
			}, delays[Math.floor(Math.random() * 4)]);
		};

		var thumbnail = function(options, callback){
			var categories = ['abstract', 'animals', 'business', 'cats', 'city', 'food', 'nature', 'technics', 'transport'];
			var colors = ['#D9EDF7', '#F2DEDE', '#FCF8E3', '#DFF0D8'];
			var numItems = 200;
			var resp = {
				count: numItems,
				items: [],
				pages: (Math.ceil(numItems/(options.pageSize || 30))),
				page: options.pageIndex
			};
			var i, l;

			i = options.pageIndex * (options.pageSize || 30);
			l = i + (options.pageSize || 30);
			resp.start = i + 1;
			resp.end = l;

			for(i; i<l; i++){
				resp.items.push({
					color: colors[Math.floor(Math.random() * 4)],
					name: ('Thumbnail ' + (i + 1)),
					src: 'http://lorempixel.com/65/75/' + categories[Math.floor(Math.random() * 9)] + '/?_=' + i
				});
			}

			//if(options.search){
			//resp.items = [];
			//}

			if(window.console && window.console.log){
				//console.log(options);
			}
			setTimeout(function(){
				callback(resp);
			}, delays[Math.floor(Math.random() * 4)]);
		};

		myRepeater.repeater({
			dataSource: function(options, callback){
				if(options.view==='list'){
					list(options, callback);
				}else if(options.view==='thumbnail'){
					thumbnail(options, callback);
				}
			},
			list_selectable: 'multi',
			list_noItemsHTML: 'no items found',
			thumbnail_noItemsHTML: 'no items found',
			thumbnail_infiniteScroll: { hybrid: true }
		});

		// add event after repeater init
		$('#MyRepeater').on('resized.fu.repeater', function(){
			console.log('resized');
		});

	}

	initRepeater();

	// buttons
	$('#btnRepeaterEnable').on('click', function(){
		$('#MyRepeater').repeater('enable');
	});

	$('#btnRepeaterDisable').on('click', function(){
		$('#MyRepeater').repeater('disable');
	});

	$('#btnRepeaterDestroy').on('click', function() {
		var markup = $('#MyRepeater').repeater('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);

		initRepeater();
	});


	// SCHEDULER

	// set custom format with moment.js
	// $('#MyScheduler').find('.scheduler-start .datepicker').datepicker({ momentConfig: {
	// 	culture: 'en',
	// 	formatCode: 'dddd, MMMM D, YYYY'
	// }});

$('#MyScheduler').on('changed.fu.scheduler', function(){
	if(window.console && window.console.log){
		window.console.log('scheduler changed.fu.scheduler: ', arguments);
	}
});

	// buttons
	$('#btnSchedulerEnable').on('click', function(){
		$('#MyScheduler').scheduler('enable');
	});

	$('#btnSchedulerDisable').on('click', function(){
		$('#MyScheduler').scheduler('disable');
	});

	$('#btnSchedulerLogValue').on('click', function(){
		var val = $('#MyScheduler').scheduler('value');
		if(window.console && window.console.log){
			window.console.log(val);
		}
	});

	$('#btnSchedulerSetValue').on('click', function(){
		var json = $.parseJSON( $('#MySchedule').val() );

		console.log(json);

		$('#MyScheduler').scheduler('value', json);
	});

	$('#btnSchedulerDestroy').on('click', function() {
		var markup = $('#MyScheduler').scheduler('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MyScheduler').scheduler();
	});



	// SEARCH
	$('#MySearch').on('searched', function (e, text) {
		alert('Searched: ' + text);
	});

	$('#btnSearchDisable').on('click', function () {
		$('#MySearch').search('disable');
	});

	$('#btnSearchEnable').on('click', function () {
		$('#MySearch').search('enable');
	});

	$('#btnSearchDestroy').on('click', function () {
		var markup = $('#MySearch').search('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MySearch').search();
	});



	// SELECTLIST
	$('#MySelectlist').on('clicked.fu.selectlist', function (evt, target) {
		console.log('clicked');
		console.log(target);
	});

	$('#MySelectlist').on('changed.fu.selectlist', function (evt, data) {
		console.log('changed');
		console.log(data);
	});

	$('#btnSelectlistSelectedItem').on('click', function () {
		console.log($('#MySelectlist2').selectlist('selectedItem'));
	});

	$('#btnSelectlistSelectByValue').on('click', function () {
		$('#MySelectlist').selectlist('selectByValue', '3');
	});

	$('#btnSelectlistSelectBySelector').on('click', function () {
		$('#MySelectlist').selectlist('selectBySelector', 'li[data-fizz=buzz]');
	});

	$('#btnSelectlistSelectByIndex').on('click', function () {
		$('#MySelectlist').selectlist('selectByIndex', '4');
	});

	$('#btnSelectlistSelectByText').on('click', function () {
		$('#MySelectlist').selectlist('selectByText', 'One');
	});

	$('#btnSelectlistEnableSelectlist').on('click', function () {
		$('#MySelectlist').selectlist('enable');
	});

	$('#btnSelectlistDisableSelectlist').on('click', function () {
		$('#MySelectlist').selectlist('disable');
	});

	$('#btnSelectlistDestroy').on('click', function () {
		var markup = $('#MySelectlist').selectlist('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MySelectlist').selectlist();
	});



	// SPINBOX
	$('#MySpinboxDecimal').spinbox({
		value: '1,0px',
		min: 0,
		max: 10,
		step: 0.1,
		decimalMark: ',',
		units: ['px']
		});

	$('#MySpinboxWithDefault').on('changed.fu.spinbox', function (e, value) {
		console.log('Spinbox changed: ', value);
	});

	$('#MySpinboxDecimal').on('changed.fu.spinbox', function (e, value) {
		console.log('Spinbox changed: ', value);
	});

	// buttons
	$('#spinboxGetValueBtn').on('click', function(){
		console.log( $('#MySpinboxDecimal').spinbox('value') );
	});

	$('#enableSpinbox').on('click', function () {
		$('#MySpinboxWithDefault').spinbox('enable');
	});

	$('#enableSpinbox').on('click', function () {
		$('#MySpinboxWithDefault').spinbox('enable');
	});

	$('#disableSpinbox').on('click', function () {
		$('#MySpinboxWithDefault').spinbox('disable');
	});

	$('#btnSpinboxDestroy').on('click', function () {
		var markup = $('#MySpinboxWithDefault').spinbox('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MySpinboxWithDefault').spinbox();
	});


	// TREE

	$('#MyTree').on('loaded.fu.tree', function (e) {
		console.log('Loaded');
	});

	function myTreeInit() {

		$('#MyTree').tree({
			dataSource: function(options, callback){
				setTimeout(function () {
					callback({ data: [
						{ name: 'Ascending and Descending', type: 'folder', dataAttributes: { id: 'folder1' } },
						{ name: 'Sky and Water I (with custom icon)', type: 'item', dataAttributes: { id: 'item1', 'data-icon': 'glyphicon glyphicon-file' } },
						{ name: 'Drawing Hands', type: 'folder', dataAttributes: { id: 'folder2' } },
						{ name: 'Waterfall', type: 'item', dataAttributes: { id: 'item2' } },
						{ name: 'Belvedere', type: 'folder', dataAttributes: { id: 'folder3' } },
						{ name: 'Relativity (with custom icon)', type: 'item', dataAttributes: { id: 'item3', 'data-icon': 'glyphicon glyphicon-picture' } },
						{ name: 'House of Stairs', type: 'folder', dataAttributes: { id: 'folder4' } },
						{ name: 'Convex and Concave', type: 'item', dataAttributes: { id: 'item4' } }
					]});

				}, 400);
			},
			multiSelect: true,
			cacheItems: true,
			folderSelect: false,
		});

	}

	myTreeInit();

	$('#MyTree').on('selected.fu.tree', function (e, selected) {
		console.log('Select Event: ', selected);
		console.log($('#MyTree').tree('selectedItems'));
	});

	$('#MyTree').on('updated.fu.tree', function (e, selected) {
		console.log('Updated Event: ', selected);
		console.log($('#MyTree').tree('selectedItems'));
	});

	$('#MyTree').on('opened.fu.tree', function (e, info) {
		console.log('Open Event: ', info);
	});

	$('#MyTree').on('closed.fu.tree', function (e, info) {
		console.log('Close Event: ', info);
	});

	$('#MyTreeSelectableFolder').tree({
		dataSource: function(options, callback){
			setTimeout(function () {
				callback({ data: [
					{ name: 'Ascending and Descending', type: 'folder', dataAttributes: { id: 'F1' } },
					{ name: 'Drawing Hands', type: 'folder', dataAttributes: { id: 'F2' } },
					{ name: 'Belvedere', type: 'folder', dataAttributes: { id: 'F3' } },
					{ name: 'House of Stairs', type: 'folder', dataAttributes: { id: 'F4' } },
					{ name: 'Belvedere', type: 'folder', dataAttributes: { id: 'F5' } }
				]});
			}, 400);
		},
		cacheItems: true,
		folderSelect: true,
		multiSelect: true
	});

	$('#MyTreeDefault').tree({
		dataSource: function(options, callback){
			setTimeout(function () {
				callback({ data: [
				{ name: 'Ascending and Descending', type: 'folder', dataAttributes: { id: 'folder1' } },
				{ name: 'Sky and Water I (with custom icon)', type: 'item', dataAttributes: { id: 'item1', 'data-icon': 'glyphicon glyphicon-file' } },
				{ name: 'Drawing Hands', type: 'folder', dataAttributes: { id: 'folder2', 'data-children': false } },
				{ name: 'Waterfall', type: 'item', dataAttributes: { id: 'item2' } },
				{ name: 'Belvedere', type: 'folder', dataAttributes: { id: 'folder3' } },
				{ name: 'Relativity (with custom icon)', type: 'item', dataAttributes: { id: 'item3', 'data-icon': 'glyphicon glyphicon-picture' } },
				{ name: 'House of Stairs', type: 'folder', dataAttributes: { id: 'folder4' } },
				{ name: 'Convex and Concave', type: 'item', dataAttributes: { id: 'item4' } }
				]});
			}, 400);
		}
	});

	$('#MyTree').on('selected.fu.tree', function (e, info) {
		console.log('Select Event: ', info);
	});

	$('#MyTreeSelectableFolder').on('selected.fu.tree', function (e, info) {
		console.log('Select Event: ', info);
	});


	$('#MyTreeDefault').on('selected.fu.tree', function (e, selected) {
		console.log('Select Event: ', selected);
		console.log($('#MyTree').tree('selectedItems'));
	});

	$('#MyTreeDefault').on('updated.fu.tree', function (e, selected) {
		console.log('Updated Event: ', selected);
		console.log($('#MyTree').tree('selectedItems'));
	});

	$('#MyTreeDefault').on('opened.fu.tree', function (e, info) {
		console.log('Open Event: ', info);
	});

	$('#MyTreeDefault').on('closed.fu.tree', function (e, info) {
		console.log('Close Event: ', info);
	});

	$('#btnTreeDestroy').click(function () {
		var markup = $('#MyTree').tree('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		myTreeInit();
	});


	// WIZARD
	$('#MyWizard').on('changed.fu.wizard', function(e, data) {
		console.log('changed');
		console.log(data);
	});

	$('#MyWizard').on('actionclicked.fu.wizard', function(e, data) {
		console.log('action clicked');
		console.log(data);
	});
	$('#MyWizard').on('stepclicked.fu.wizard', function(e, data) {
		console.log('step ' + data.step + ' clicked');
		if(data.step===1) {
			// return e.preventDefault();
		}
	});

	//buttons
	$('#MyWizard').on('finished', function(e, data) {
		console.log('finished');
	});
	$('#btnWizardPrev').on('click', function() {
		$('#MyWizard').wizard('previous');
	});
	$('#btnWizardNext').on('click', function() {
		$('#MyWizard').wizard('next','foo');
	});
	$('#btnWizardStep').on('click', function() {
		var item = $('#MyWizard').wizard('selectedItem');
		console.log(item.step);
	});
	$('#btnWizardSetStep').on('click', function() {
		$('#MyWizard').wizard('selectedItem', {
			step: 3
		});
	});

	var emailSetupSamplePane = '<div class="bg-warning alert">' +
								'	<h4>Setup Message</h4>' +
								'	<p>Soko radicchio bunya nuts gram dulse silver beet parsnip napa cabbage ' +
								'	lotus root sea lettuce brussels sprout cabbage. Catsear cauliflower garbanzo yarrow ' +
								'	salsify chicory garlic bell pepper napa cabbage lettuce tomato kale arugula melon ' +
								'	sierra leone bologi rutabaga tigernut. Sea lettuce gumbo grape kale kombu cauliflower ' +
								'	salsify kohlrabi okra sea lettuce broccoli celery lotus root carrot winter purslane ' +
								'	turnip greens garlic. JÃ­cama garlic courgette coriander radicchio plantain scallion ' +
								'	cauliflower fava bean desert raisin spring onion chicory bunya nuts. Sea lettuce water ' +
								'	spinach gram fava bean leek dandelion silver beet eggplant bush tomato. </p>' +
								'	<p>Pea horseradish azuki bean lettuce avocado asparagus okra. ' +
								'	Kohlrabi radish okra azuki bean corn fava bean mustard tigernut jÃ­cama green bean ' +
								'	celtuce collard greens avocado quandong fennel gumbo black-eyed pea. Grape silver ' +
								'	beet watercress potato tigernut corn groundnut. Chickweed okra pea winter ' +
								'	purslane coriander yarrow sweet pepper radish garlic brussels sprout groundnut ' +
								'	summer purslane earthnut pea tomato spring onion azuki bean gourd. Gumbo kakadu ' +
								'	plum komatsuna black-eyed pea green bean zucchini gourd winter purslane silver ' +
								'	beet rock melon radish asparagus spinach. </p>' +
								'</div>';

	$('#btnWizardAddSteps').on('click', function() {
		$('#MyWizard').wizard('addSteps', 2, 0, 
			[
			{
				badge: '',
				label: 'Setup',
				pane: emailSetupSamplePane
			}
		]);
	});

	$('#btnWizardRemoveStep').on('click', function() {
		$('#MyWizard').wizard('removeSteps', 4, 1);
	});

	$('#btnWizardDestroy').click(function () {
		var markup = $('#MyWizard').wizard('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MyWizard').wizard();
	});

});
