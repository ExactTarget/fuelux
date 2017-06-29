module.exports = {
	getServer: function getServer (P) {
		var PORT = P || process.env.PORT || 8000;
		var isReference = (PORT === 8000);
		var partialsDir = isReference ? './reference/dist/templates/handlebars/fuelux' : './templates/handlebars/fuelux';

		process.title = (isReference) ? 'referenceServer' : 'devServer';

		var express = require('express');
		var app = express();
		var exphbs  = require('express-handlebars');

		app.disable('view cache');

		app.engine('.hbs',
			exphbs({
				extname: '.hbs',
				defaultLayout: 'main',
				layoutsDir: './test/regression/',
				partialsDir: [partialsDir, {namespace: 'lt', dir: './test/regression/components/'}]
			})
		);

		app.set('view engine', '.hbs');
		app.set('views', './test/regression/');

		var path = require('path');
		app.use(express.static(path.join(__dirname, '../../')));

		app.get('/component/:component', function renderCheckboxPage (req, res) {
			var component = req.params.component;
			var data = require('./config/' + component + '.js');
			data.isReference = isReference;
			data.components = [
				'checkbox',
				'combobox',
				'datepicker',
				'loader',
				'pillbox',
				'placard',
				'radio',
				'repeater',
				'repeater-single',
				'repeater-multi',
				'scheduler',
				'search',
				'selectlist',
				'spinbox',
				'tree',
				'wizard'
			];
			res.render('./components/' + component, data);
		});

		var server = app.listen(PORT, function listen () {
			console.log('info', 'Regression test server listening on port ' + server.address().port + '. isReference: ' + isReference);
		});

		return server;
	}
};

