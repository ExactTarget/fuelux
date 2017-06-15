module.exports = {
	getServer: function getServer (P) {
		var PORT = P || process.env.PORT || 8000;
		var isReference = (PORT === 8000);
		var partialsDir = isReference ? './reference/dist/templates/handlebars/fuelux' : './templates/handlebars/fuelux';

		process.title = (isReference) ? 'referenceServer' : 'devServer';

		var express = require('express');
		var app = express();
		var exphbs  = require('express-handlebars');

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

		var path = require('path');
		app.use(express.static(path.join(__dirname, '../../')));

		app.get('/checkbox', function renderCheckboxPage (req, res) {
			var checkboxData = require('./config/checkbox.js');
			checkboxData.isReference = isReference;
			res.render('./checkbox', checkboxData);
		});

		var server = app.listen(PORT, function listen () {
			console.log('info', 'Regression test server listening on port ' + server.address().port + '. isReference: ' + isReference);
		});

		return server;
	}
};

