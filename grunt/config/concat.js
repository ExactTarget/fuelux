module.exports = function concat () {
	return {
		fuelux: {
			src: ['js/checkbox.js',
				'js/combobox.js',
				'js/datepicker.js',
				'js/dropdown-autoflip.js',
				'js/loader.js',
				'js/placard.js',
				'js/radio.js',
				'js/search.js',
				'js/selectlist.js',
				'js/spinbox.js',
				'js/tree.js',
				'js/utilities.js',
				'js/wizard.js',
				'js/infinite-scroll.js',
				'js/pillbox.js',
				'js/repeater.js',
				'js/repeater-list.js',
				'js/repeater-thumbnail.js',
				'js/scheduler.js',
				'js/picker.js'
			],
			dest: 'dist/js/' + '<%= pkg.name %>' + '.js'
		},
		options: {
			banner: '<%= banner %>' + '\n\n// For more information on UMD visit: https://github.com/umdjs/umd/\n(function (factory) {\n\tif (typeof define === \'function\' && define.amd) {\n\t\tdefine([\'jquery\', \'bootstrap\'], factory);\n\t} else {\n\t\tfactory(jQuery);\n\t}\n}(function (jQuery) {\n\n<%= jqueryCheck %><%= bootstrapCheck %>',
			footer: '\n}));',
			process: function process (source) {
				var output = '(function ($) {\n\n' +
					source.replace(/\/\/ -- BEGIN UMD WRAPPER PREFACE --(\n|.)*\/\/ -- END UMD WRAPPER PREFACE --/g, '');
				output = output.replace(/\/\/ -- BEGIN UMD WRAPPER AFTERWORD --(\n|.)*\/\/ -- END UMD WRAPPER AFTERWORD --/g, '') + '\n})(jQuery);\n\n';
				return output;
			}
		}
	};
};
