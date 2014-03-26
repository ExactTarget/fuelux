define(function(require){
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



	// DATAGRID
	var dataSource = new StaticDataSource({
		columns: [
			{
				property: 'toponymName',
				label: 'Name',
				sortable: true
			},
			{
				property: 'countrycode',
				label: 'Country',
				sortable: true
			},
			{
				property: 'population',
				label: 'Population',
				sortable: true
			},
			{
				property: 'fcodeName',
				label: 'Type',
				sortable: true
			}
		],
		data: sampleData.geonames,
		delay: 250
	});

	$('#MyGrid').datagrid({
		dataSource: dataSource
	});

	$('#MyStretchGrid').datagrid({
		dataSource: dataSource,
		stretchHeight: true
	});

	$('#MySelectStretchGrid').datagrid({
		dataSource: dataSource,
		stretchHeight: true,
		noDataFoundHTML: '<b>Sorry, nothing to display.</b>',
		enableSelect: true,
		primaryKey: 'geonameId',
		multiSelect: false
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



	// PILLBOX
	$('#btnAdd').click(function () {
		var newItemCount = $('#MyPillbox ul li').length + 1;
		$('#MyPillbox ul').pillbox('addItem', 'Item ' + newItemCount, 'Item ' + newItemCount );
	});

	$('#btnRemoveByValue').click(function () {
		$('#MyPillbox').pillbox('removeByValue', 'foo');
	});

	$('#btnRemoveBySelector').click(function () {
		$('#MyPillbox').pillbox('removeBySelector', '.status-warning');
	});

	$('#btnRemoveByText').click(function () {
		$('#MyPillbox').pillbox('removeByText', 'Item 6');
	});

	$('#btnItems').click(function () {
		var items = $('#MyPillbox').pillbox('items');
		console.log(items);
	});

	$('#MyPillbox').on( 'added', function( event, data ) {
		console.log( 'pillbox added', data );
	});

	$('#MyPillbox').on( 'removed', function( event, data ) {
		console.log( 'pillbox removed', data );
	});



	// RADIO
	$('#btnRadioDisable').on('click', function() {
		$('#radio1').radio('disable');
	});
	$('#btnRadioEnable').on('click', function() {
		$('#radio1').radio('enable');
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
	$('#enableSelect').on('click', function () {
		$('#MySelectlist').selectlist('enable');
	});
	$('#disableSelect').on('click', function () {
		$('#MySelectlist').selectlist('disable');
	});



	// SPINNER
	$('#ex-spinner').on('changed', function (e, value) {
		console.log('Spinner changed: ', value);
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
	$('#btnWizardSetStep4').on('click', function() {
		var step = 4;
		$('#MyWizard').wizard('selectedItem', {step:step});
	});
	$('#MyWizard').on('stepclick', function(e, data) {
		console.log('step' + data.step + ' clicked');
		if(data.step===1) {
			// return e.preventDefault();
		}
	});

});