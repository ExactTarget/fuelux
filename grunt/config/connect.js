module.exports = function (grunt) {

	return {
		server: {
			options: {
				hostname: '*',
				base: {
					path: '.',
					options: {
						index: ['index.html', 'tests.html']
					}
				},
				port: 8000,
				useAvailablePort: true
			}
		},
		testServer: {
			options: {
				base: {
					path: '.',
					options: {
						index: ['index.html', 'tests.html']
					}
				},
				hostname: '*',
				port: '<%= connectTestServerOptionsPort %>',
				useAvailablePort: true
			}
		}
	};
};
