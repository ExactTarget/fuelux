define(function(require){
	var data = require('data');
	var jquery = require('jquery');
	var DataSourceTree = require('sample/datasourceTree');
	var sampleData = require('sample/data');
	var StaticDataSource = require('sample/datasource');

	require('fuelux/all');



	// CHECKBOX
	$('#btnChkToggle').on('click', function() {
		$('#chk1').checkbox('toggle');
	});
	$('#btnChkDisable').on('click', function() {
		$('#chk1').checkbox('disable');
	});
	$('#btnChkEnable').on('click', function() {
		$('#chk1').checkbox('enable');
	});



	// COMBOBOX
	$('#btnComboboxGetSelectedItem').on('click', function () {
		console.log($('#MyCombobox').combobox('selectedItem'));
	});
	$('#btnComboboxSelectByValue').on('click', function () {
		$('#MyCombobox').combobox('selectByValue', '1');
	});
	$('#btnComboboxSelectByIndex').on('click', function () {
		$('#MyCombobox').combobox('selectByIndex', '1');
	});
	$('#btnComboboxSelectByText').on('click', function () {
		$('#MyCombobox').combobox('selectByText', 'Four');
	});
	$('#btnComboboxSelectBySelector').on('click', function () {
		$('#MyCombobox').combobox('selectBySelector', 'li[data-fizz=buzz]');
	});
	$('#MyCombobox').on('changed', function (evt, data) {
		console.log(data);
	});
	$('#btnComboboxDisable').on('click', function () {
		$('#MyCombobox').combobox('disable');
	});
	$('#btnComboboxEnable').on('click', function () {
		$('#MyCombobox').combobox('enable');
	});



	// DATEPICKER
	$('#datepicker1').datepicker();

	$('#datepicker1').on('changed', function( event, data ) {
		console.log( 'datepicker change event fired' );
	});

	$('#datepicker1').on('inputParsingFailed', function() {
		console.log( 'datepicker inputParsingFailed event fired' );
	});

	$('#datepicker-enable').on('click', function() {
		$('#datepicker1').datepicker('enable');
	});

	$('#datepicker-disabled').on('click', function() {
		$('#datepicker1').datepicker('disable');
	});

	$('#datepicker-logFormattedDate').on('click', function() {
		console.log( $('#datepicker1').datepicker('getFormattedDate') );
	});

	$('#datepicker-logDateUnix').on('click', function() {
		console.log( $('#datepicker1').datepicker('getDate', { unix: true } ) );
	});

	$('#datepicker-logDateObj').on('click', function() {
		console.log( $('#datepicker1').datepicker('getDate') );
	});

	$('#datepicker-setDate').on('click', function() {
		var futureDate = new Date(+new Date() + ( 7 * 24 * 60 * 60 * 1000 ) );
		$('#datepicker1').datepicker('setDate', futureDate );
		console.log( $('#datepicker1').datepicker('getDate') );
	});



	// INFINITE SCROLL
	$('#MyInfiniteScroll1').infinitescroll({
		dataSource: function(helpers, callback){
			setTimeout(function(){
				callback({ content: data.infiniteScroll.content });
			}, data.infiniteScroll.delays[Math.floor(Math.random() * 4)]);
		}
	});

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



	// PILLBOX
	$('#btnAdd').click(function () {
		var newItemCount = $('#MyPillbox ul li').length + 1;
		$('#MyPillbox').pillbox('addItems', {text: 'item ' + newItemCount, value: 'item ' + newItemCount} );
	});

	$('#btnRemoveByValue').click(function () {
		$('#MyPillbox').pillbox('removeByValue', 'foo');
	});

	$('#btnRemoveBySelector').click(function () {
		$('#MyPillbox').pillbox('removeBySelector', '.status-success');
	});

	$('#btnRemoveByText').click(function () {
		$('#MyPillbox').pillbox('removeByText', 'Item 6');
	});

	$('#btnItems').click(function () {
		var items = $('#MyPillbox').pillbox('items');
		console.log(items);
	});

	$('#MyPillbox').pillbox({
		onKeyDown: function( e, data, callback ){
			callback(e, {data:[
				{text: Math.random(),value:'sdfsdfsdf'},
				{text: Math.random(),value:'sdfsdfsdf'}
			]});
		}
	});

	$('#MyPillbox').on( 'added', function( event, data ) {
		console.log( 'pillbox added', data );
	});

	$('#MyPillbox').on( 'removed', function( event, data ) {
		console.log( 'pillbox removed', data );
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


	// SCHEDULER
	$('#schedulerEnableBtn').on('click', function(){
		$('#MyScheduler').scheduler('enable');
	});

	$('#schedulerDisableBtn').on('click', function(){
		$('#MyScheduler').scheduler('disable');
	});

	$('#schedulerLogValueBtn').on('click', function(){
		var val = $('#MyScheduler').scheduler('value');
		if(window.console && window.console.log){
			window.console.log(val);
		}
	});

	$('#schedulerSetValueBtn').on('click', function(){
		$('#MyScheduler').scheduler('value', {
			startDateTime: '2014-03-31T03:23+02:00',
			timeZone: {
				name: 'Namibia Standard Time',
				offset: '+02:00'
			},
			recurrencePattern: 'FREQ=MONTHLY;INTERVAL=6;BYDAY=WE;BYSETPOS=3;UNTIL=20140919;'
		});
	});

	$('#MyScheduler').on('changed', function(){
		if(window.console && window.console.log){
			window.console.log('scheduler changed: ', arguments);
		}
	});

	$('#MyScheduler').scheduler();



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



	// SELECTLIST
	$('#MySelectlist').on('changed', function (evt, data) {
		console.log(data);
	});
	$('#getSelectedItem').on('click', function () {
		console.log($('#MySelectlist').selectlist('selectedItem'));
	});
	$('#selectByValue').on('click', function () {
		$('#MySelectlist').selectlist('selectByValue', '3');
	});
	$('#selectBySelector').on('click', function () {
		$('#MySelectlist').selectlist('selectBySelector', 'li[data-fizz=buzz]');
	});
	$('#selectByIndex').on('click', function () {
		$('#MySelectlist').selectlist('selectByIndex', '4');
	});
	$('#selectByText').on('click', function () {
		$('#MySelectlist').selectlist('selectByText', 'One');
	});
	$('#enableSelectlist').on('click', function () {
		$('#MySelectlist').selectlist('enable');
	});
	$('#disableSelectlist').on('click', function () {
		$('#MySelectlist').selectlist('disable');
	});



	// SPINBOX
	$('#enableSpinbox').on('click', function () {
		$('#MySpinbox').spinbox('enable');
	});
	$('#disableSpinbox').on('click', function () {
		$('#MySpinbox').spinbox('disable');
	});
	$('#MySpinbox').on('changed', function (e, value) {
		console.log('Spinbox changed: ', value);
	});



	// TREE
	var dataSourceTree = new DataSourceTree({
		data: [
			{ name: 'Test Folder 1', type: 'folder', additionalParameters: { id: 'F1' } },
			{ name: 'Test Folder 2', type: 'folder', additionalParameters: { id: 'F2' } },
			{ name: 'Test Item 1', type: 'item', additionalParameters: { id: 'I1' } },
			{ name: 'Test Item 2', type: 'item', additionalParameters: { id: 'I2' } }
		],
		delay: 400
	});

	$('#ex-tree').on('loaded', function (e) {
		console.log('Loaded');
	});

	$('#ex-tree').tree({
		dataSource: dataSourceTree,
		loadingHTML: '<div class="static-loader">Loading...</div>',
		multiSelect: true,
		cacheItems: true
	});

	$('#ex-tree').on('selected', function (e, info) {
		console.log('Select Event: ', info);
	});

	$('#ex-tree').on('opened', function (e, info) {
		console.log('Open Event: ', info);
	});

	$('#ex-tree').on('closed', function (e, info) {
		console.log('Close Event: ', info);
	});



	// WIZARD
	$('#MyWizard').on('change', function(e, data) {
		console.log('change');
		if(data.step===3 && data.direction==='next') {
			// return e.preventDefault();
		}
	});
	$('#MyWizard').on('changed', function(e, data) {
		console.log('changed');
	});
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
	$('#MyWizard').on('stepclick', function(e, data) {
		console.log('step ' + data.step + ' clicked');
		if(data.step===1) {
			// return e.preventDefault();
		}
	});

});