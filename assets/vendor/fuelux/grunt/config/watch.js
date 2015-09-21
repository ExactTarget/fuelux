module.exports = {
	full: {
		files: ['Gruntfile.js',
			'fonts/**',
			'grunt/**',
			'js/**',
			'less/**',
			'test/**',
			'index.html',
			'dev.html'
		],
		options: {
			livereload: true
		},
		tasks: ['jshint',
			'blanket_qunit:source',
			'qunit:noMoment',
			'qunit:globals',
			'dist',
			'qunit:dist',
			'htmllint'
		]
	},
	source: {
		files: ['Gruntfile.js',
			'fonts/**',
			'grunt/**',
			'js/**',
			'less/**',
			'test/**',
			'index.html',
			'dev.html'
		],
		options: {
			livereload: true
		},
		tasks: ['jshint',
			'connect:testServer',
			'blanket_qunit:source',
			'qunit:noMoment',
			'qunit:globals',
			'htmllint'
		]
	},
	less: {
		files: ['fonts/**', 
			'less/**'],
		options: {
			livereload: true
		},
		tasks: ['distcss']
	},
	cssdev: {
		files: ['Gruntfile.js',
			'grunt/**',
			'less/**',
			'index.html',
			'index-dev.html',
			'dev.html',
			'!less/fuelux-no-namespace.less'
		],
		options: {
			livereload: true
		},
		tasks: ['distcssdev']
	},
	dist: {
		files: ['fonts/**', 
			'grunt/**',
			'js/**', 
			'less/**'],
		options: {
			livereload: true
		},
		tasks: ['dist']
	},
	lite: {
		files: [],
		options: {
			livereload: true
		},
		tasks: []
	}
};