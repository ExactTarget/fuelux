module.exports = function (grunt) {

	return {
		readme: {
			src: ['DETAILS.md', 'README.md'],
			overwrite: true,
			replacements: [{
				from: /fuelux\/\d\.\d\.\d/g,
				to: 'fuelux/' + grunt.config('pkg.version')
			}]
		}
	}

};