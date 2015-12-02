define(function (require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var AvailableComponents = require('collections/available-components');
	var PlacedComponents = require('collections/placed-components');
	var TabView = require('views/tab');
	var MyFormView = require('views/my-form');
	var inputJSON = require('text!data/input.json');
	var compoundInputJSON = require('text!data/compound-input.json');
	var radioJSON = require('text!data/radio.json');
	var selectJSON = require('text!data/select.json');
	var buttonsJSON = require('text!data/buttons.json');
	var renderTab = require('text!templates/app/render.html');

	var myForm = require('models/my-form');
	require('fuelux');

	return {
		initialize: function initialize() {
			//Bootstrap tabs from json.
			new TabView({
				title: 'Input',
				collection: new AvailableComponents(JSON.parse(inputJSON))
			});
			new TabView({
				title: 'Compound',
				collection: new AvailableComponents(JSON.parse(compoundInputJSON))
			});
			new TabView({
				title: 'Radio & Check',
				collection: new AvailableComponents(JSON.parse(radioJSON))
			});
			new TabView({
				title: 'Select',
				collection: new AvailableComponents(JSON.parse(selectJSON))
			});
			new TabView({
				title: "Buttons",
				collection: new AvailableComponents(JSON.parse(buttonsJSON))
			});
			new TabView({
				title: 'HTML',
				content: renderTab
			});

			//Make the first tab active!
			$('#components .tab-pane').first().addClass('active');
			$('#formtabs li').first().addClass('active');
			// Bootstrap "My Form" with 'Form Name' component.
			new MyFormView({
				title: 'Original',
				collection: new PlacedComponents([
					{
						'title': 'Form Name',
						'fields': {
							'name': {
								'label': 'Form Name',
								'type': 'input',
								'value': 'Form Name'
							}
						}
					}
				]),
				model: myForm
			});

			$('#theme-toggle').on('change', function (e) {
				if ($(e.target).is(':checked')) {
					$('head').append('<link rel="stylesheet" href="http://www.fuelcdn.com/fuelux-mctheme/1.1.0/css/fuelux-mctheme.min.css" type="text/css" id="mctheme"/>');
				} else {
					$('#mctheme').remove();
				}
			});
		}
	};
});
