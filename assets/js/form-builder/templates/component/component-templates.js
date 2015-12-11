define(function ComponentTemplates(require) {
	var bootstrap_select = require('text!templates/component/bootstrap-select.html');
	var button = require('text!templates/component/button.html');
	var button_group = require('text!templates/component/button-group.html');
	var file_button = require('text!templates/component/file-button.html');
	var form_name = require('text!templates/component/form-name.html');
	var fuel_ux_checkboxes = require('text!templates/component/fuelux-checkboxes.html');
	var fuel_ux_checkboxes_inline = require('text!templates/component/fuelux-checkboxes-inline.html');
	var fuel_ux_radios = require('text!templates/component/fuelux-radios.html');
	var fuel_ux_radios_inline = require('text!templates/component/fuelux-radios-inline.html');
	var input = require('text!templates/component/input.html');
	var input_with_button_dropdown = require('text!templates/component/input-with-button-dropdown.html');
	var input_with_checkbox = require('text!templates/component/input-with-checkbox.html');
	var input_with_combobox = require('text!templates/component/input-with-combobox.html');
	var input_with_text = require('text!templates/component/input-with-text.html');
	var search = require('text!templates/component/search.html');
	var selectlist = require('text!templates/component/selectlist.html');
	var spinbox = require('text!templates/component/spinbox.html');
	var textarea = require('text!templates/component/textarea.html');

	return {
		bootstrap_select: bootstrap_select,
		button: button,
		button_group: button_group,
		file_button: file_button,
		form_name: form_name,
		fuel_ux_checkboxes: fuel_ux_checkboxes,
		fuel_ux_checkboxes_inline: fuel_ux_checkboxes_inline,
		fuel_ux_radios: fuel_ux_radios,
		fuel_ux_radios_inline: fuel_ux_radios_inline,
		input: input,
		input_with_button_dropdown: input_with_button_dropdown,
		input_with_checkbox: input_with_checkbox,
		input_with_combobox: input_with_combobox,
		input_with_text: input_with_text,
		search: search,
		selectlist: selectlist,
		spinbox: spinbox,
		textarea: textarea,
	};
});
