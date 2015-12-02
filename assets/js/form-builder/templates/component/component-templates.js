define(function ComponentTemplates(require) {
	var formname = require('text!templates/component/formname.html');
	var input = require('text!templates/component/input.html');
	var pendedtext = require('text!templates/component/pendedtext.html');
	var spinbox = require('text!templates/component/spinbox.html');

	var appendedcheckbox = require('text!templates/component/appendedcheckbox.html');
	var filebutton = require('text!templates/component/filebutton.html');
	var button = require('text!templates/component/button.html');
	var buttondouble = require('text!templates/component/buttondouble.html');
	var prependbuttondropdown = require('text!templates/component/prependbuttondropdown.html');
	var appendbuttondropdown = require('text!templates/component/appendbuttondropdown.html');
	var prependcombobox = require('text!templates/component/prependcombobox.html');
	var appendcombobox = require('text!templates/component/appendcombobox.html');
	var multiplecheckboxes = require('text!templates/component/multiplecheckboxes.html');
	var multiplecheckboxesinline = require('text!templates/component/multiplecheckboxesinline.html');
	var multipleradios = require('text!templates/component/multipleradios.html');
	var multipleradiosinline = require('text!templates/component/multipleradiosinline.html');
	var prependedcheckbox = require('text!templates/component/prependedcheckbox.html');
	var selectbasic = require('text!templates/component/selectbasic.html');
	var selectmultiple = require('text!templates/component/selectmultiple.html');
	var textarea = require('text!templates/component/textarea.html');
	var prependedsearch = require('text!templates/component/prependedsearch.html');
	var appendedsearch = require('text!templates/component/appendedsearch.html');

	return {
		/* audited */
		formname: formname,
		input: input,
		pendedtext: pendedtext,
		spinbox: spinbox,

		/* to be audited */
		appendedcheckbox: appendedcheckbox,
		filebutton: filebutton,
		singlebutton: button,
		doublebutton: buttondouble,
		prependbuttondropdown: prependbuttondropdown,
		appendbuttondropdown: appendbuttondropdown,
		prependcombobox: prependcombobox,
		appendcombobox: appendcombobox,
		multiplecheckboxes: multiplecheckboxes,
		multiplecheckboxesinline: multiplecheckboxesinline,
		multipleradios: multipleradios,
		multipleradiosinline: multipleradiosinline,
		prependedcheckbox: prependedcheckbox,
		selectbasic: selectbasic,
		selectmultiple: selectmultiple,
		textarea: textarea,
		prependedsearch: prependedsearch,
		appendedsearch: appendedsearch
	};
});
