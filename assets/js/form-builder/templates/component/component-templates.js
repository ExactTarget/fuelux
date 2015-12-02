define(function ComponentTemplates(require) {
	var formname = require('text!templates/component/formname.html');
	var input = require('text!templates/component/input.html');
	var pendedbuttondropdown = require('text!templates/component/pendedbuttondropdown.html');
	var pendedcheckbox = require('text!templates/component/pendedcheckbox.html');
	var pendedcombobox = require('text!templates/component/pendedcombobox.html');
	var pendedsearch = require('text!templates/component/pendedsearch.html');
	var pendedtext = require('text!templates/component/pendedtext.html');
	var spinbox = require('text!templates/component/spinbox.html');
	var textarea = require('text!templates/component/textarea.html');


	var filebutton = require('text!templates/component/filebutton.html');
	var button = require('text!templates/component/button.html');
	var buttondouble = require('text!templates/component/buttondouble.html');
	var multiplecheckboxes = require('text!templates/component/multiplecheckboxes.html');
	var multiplecheckboxesinline = require('text!templates/component/multiplecheckboxesinline.html');
	var multipleradios = require('text!templates/component/multipleradios.html');
	var multipleradiosinline = require('text!templates/component/multipleradiosinline.html');
	var selectbasic = require('text!templates/component/selectbasic.html');
	var selectmultiple = require('text!templates/component/selectmultiple.html');


	return {
		/* audited */
		formname: formname,
		input: input,
		pendedbuttondropdown: pendedbuttondropdown,
		pendedcheckbox: pendedcheckbox,
		pendedcombobox: pendedcombobox,
		pendedsearch: pendedsearch,
		pendedtext: pendedtext,
		spinbox: spinbox,
		textarea: textarea,

		/* to be audited */
		filebutton: filebutton,
		singlebutton: button,
		doublebutton: buttondouble,
		multiplecheckboxes: multiplecheckboxes,
		multiplecheckboxesinline: multiplecheckboxesinline,
		multipleradios: multipleradios,
		multipleradiosinline: multipleradiosinline,
		selectbasic: selectbasic,
		selectmultiple: selectmultiple
	};
});
