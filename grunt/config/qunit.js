module.exports = function (grunt) {

	return {
		release: {
			options: {
				urls: grunt.config('allTestUrls'),
				screenshot: true,
				page: {
					viewportSize: {
						width: 1280,
						height: 1024
					}
				}
			}
		},
		globals: {
			options: {
				urls: ['http://localhost:' + '<%= connectTestServerOptionsPort %>' + '/test/browser-globals.html']
			}
		},
		noMoment: {
			options: {
				urls: ['http://localhost:' + '<%= connectTestServerOptionsPort %>' + '/test/?no-moment=true']
			}
		},
		source: {
			options: {
				urls: ['http://localhost:'  + '<%= connectTestServerOptionsPort %>' + '/test/']
			}
		},
		dist: {
			options: {
				urls: ['http://localhost:'  + '<%= connectTestServerOptionsPort %>' + '/test/?testdist=true',
					'http://localhost:'  + '<%= connectTestServerOptionsPort %>' +  '/test/commonjs.html'
				]
			}
		}
	}

};