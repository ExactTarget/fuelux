module.exports = function (grunt) {

	function getPackage() {
		return grunt.file.readJSON('./package.json');
	}

	return {
		readme: {
			src: ['DETAILS.md', 'README.md'],
			overwrite: true,
			replacements: [{
				from: /fuelux\/\d{1,2}\.\d{1,2}\.\d{1,2}/g,
				to: 'fuelux/' + getPackage().version
			}]
		},
		packageJs: {
			src: ['package.js'],
			overwrite: true,
			replacements: [{
				from: /version\:\ \'\d{1,2}\.\d{1,2}\.\d{1,2}\'/g,
				to: "version: '" + getPackage().version + "'"
			}]
		}
	}

};
