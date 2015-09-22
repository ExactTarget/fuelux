module.exports = function (grunt) {

	function getPackage() {
		return grunt.file.readJSON('./package.json');
	}

	return {
		readme: {
			src: ['DETAILS.md', 'README.md'],
			overwrite: true,
			replacements: [{
				from: /fuelux\/\d\.\d\.\d/g,
				to: 'fuelux/' + getPackage().version
			}]
		},
    packageJs: {
			src: ['package.js'],
			overwrite: true,
			replacements: [{
				from: /version: '\d\.\d\.\d'/,
				to: "version: '" + getPackage().version + "'"
			}]
    }
	}

};
