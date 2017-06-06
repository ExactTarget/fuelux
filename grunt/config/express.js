module.exports = function () {
	return {
		referenceServer: {
			options: {
				script: 'test/regression/app.js',
				port: 8000
			}
		},
		devServer: {
			options: {
				script: 'test/regression/app.js',
				port: 8013
			}
		}
	};
};
