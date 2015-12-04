define(function ComponentTemplates(require) {
	var button = require('text!templates/component/button.html');
	var buttongroup = require('text!templates/component/buttongroup.html');
	var filebutton = require('text!templates/component/filebutton.html');
	var formname = require('text!templates/component/formname.html');
	var fueluxcheckboxes = require('text!templates/component/fueluxcheckboxes.html');
	var fueluxcheckboxesinline = require('text!templates/component/fueluxcheckboxesinline.html');
	var fueluxradios = require('text!templates/component/fueluxradios.html');
	var fueluxradiosinline = require('text!templates/component/fueluxradiosinline.html');
	var input = require('text!templates/component/input.html');
	var inputwithbuttondropdown = require('text!templates/component/inputwithbuttondropdown.html');
	var inputwithcheckbox = require('text!templates/component/inputwithcheckbox.html');
	var inputwithcombobox = require('text!templates/component/inputwithcombobox.html');
	var inputwithtext = require('text!templates/component/inputwithtext.html');
	var search = require('text!templates/component/search.html');
	var spinbox = require('text!templates/component/spinbox.html');
	var textarea = require('text!templates/component/textarea.html');

	var selectbasic = require('text!templates/component/selectbasic.html');
	var selectmultiple = require('text!templates/component/selectmultiple.html');


	return {
		/* audited */
		button: button,
		buttongroup: buttongroup,
		filebutton: filebutton,
		formname: formname,
		fueluxcheckboxes: fueluxcheckboxes,
		fueluxcheckboxesinline: fueluxcheckboxesinline,
		fueluxradios: fueluxradios,
		fueluxradiosinline: fueluxradiosinline,
		input: input,
		inputwithbuttondropdown: inputwithbuttondropdown,
		inputwithcheckbox: inputwithcheckbox,
		inputwithcombobox: inputwithcombobox,
		inputwithtext: inputwithtext,
		search: search,
		spinbox: spinbox,
		textarea: textarea,

		/* to be audited */
		selectbasic: selectbasic,
		selectmultiple: selectmultiple
	};
});
