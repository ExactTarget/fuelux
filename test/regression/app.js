var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');

var app = express();

var PORT = process.env.PORT || "8000";
var isReference = (PORT === "8000");
var partialsDir = isReference ? './reference/dist/templates/handlebars/fuelux' : './templates/handlebars/fuelux';

app.engine('.hbs',
	exphbs({
		extname: '.hbs',
		defaultLayout: 'main',
		layoutsDir: './test/regression/',
		partialsDir: partialsDir
	})
);

app.set('view engine', '.hbs');
app.set('views', './test/regression/');
app.use(express.static(path.join(__dirname, '../../')));

app.get('/checkbox', function (req, res) {
	res.render('./checkbox', {
		isReference: isReference,
		checkboxen: [
			{checkboxes: [
				{id: 'checkbox1', label: 'Custom checkbox unchecked on page load'},
				{id: 'checkbox2', label: 'Custom checkbox checked on page load', checked: true},
				{id: 'checkbox3', label: 'Disabled custom checkbox unchecked on page load', disabled: true},
				{id: 'checkbox4', label: 'Disabled custom checkbox checked on page load', checked: true, disabled: true}
			]}
		]
	});
});

var server = app.listen(PORT, function listen () {
	console.log('info', 'Regression test server listening on port ' + server.address().port);
});
