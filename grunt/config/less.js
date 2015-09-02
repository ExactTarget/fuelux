module.exports = function (grunt) {

	var minifiedOutput = 'dist/css/' + '<%= pkg.name %>' + '.min.css';

	var minifyFiles = function() {
		var minifyFiles = {};
		var output = 'dist/css/' + '<%= pkg.name %>' + '.min.css'
		minifyFiles[output] = 'dist/css/' + '<%= pkg.name %>' + '.css'
		return minifyFiles
	};

	return {
		dev: {
			options: {
				strictMath: true,
				sourceMap: true,
				outputSourceFiles: true,
				sourceMapURL: grunt.config('pkg.name') + '-dev.css.map',
				sourceMapFilename: 'dist/css/' + '<%= pkg.name %>' + '-dev.css.map'
			},
			files: {
				'dist/css/fuelux-dev.css': 'less/fuelux.less'
			}
		},
		dist: {
			options: {
				strictMath: true,
				sourceMap: true,
				outputSourceFiles: true,
				sourceMapURL: '<%= pkg.name %>' + '.css.map',
				sourceMapFilename: 'dist/css/' + '<%= pkg.name %>' + '.css.map'
			},
			files: {
				'dist/css/fuelux.css': 'less/fuelux.less'
			}
		},
		minify: {
			options: {
				cleancss: true,
				compress: true,
				report: 'min'
			},
			files: minifyFiles()
		}
	}

};