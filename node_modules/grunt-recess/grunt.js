module.exports = function( grunt ) {
	'use strict';

	grunt.initConfig({
		lint: {
			files: [
				'grunt.js',
				'tasks/**/*.js'
			]
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'default'
		},
		recess: {
			pass: {
				src: [
					'test/fixtures/valid.less',
					'test/fixtures/valid.css'
				]
			},
			fail: {
				src: [
					'test/fixtures/invalid.css'
				]
			}
		},
		jshint: {
			options: {
				es5: true,
				esnext: true,
				bitwise: true,
				curly: true,
				eqeqeq: true,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				regexp: true,
				undef: true,
				strict: true,
				trailing: true,
				smarttabs: true,
				node: true
			}
		}
	});

	grunt.loadTasks('tasks');

	grunt.registerTask('default', 'lint recess:pass recess:fail');

};