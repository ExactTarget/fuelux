/*!
 * Bootstrap Grunt task for the CommonJS module generation
 * http://getbootstrap.com
 * Copyright 2014-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict';

var fs = require('fs');
var path = require('path');

var banner = '// This file has been created by the `commonjs` Grunt task.' + 
							' You can require() this file in a CommonJS environment.\n' + 
							'require(\'jquery\');\n' +
							'require(\'bootstrap\');\n\n';
							'require(\'moment\');\n\n';

module.exports = function createBundledReferenceModule(grunt, files, destFile) {
	var destDir = path.dirname(destFile);
	var files = files || [];

	function srcPathToDestRequire(files) {
		var requirePath = path.relative(destDir, files).replace(/\\/g, '/').replace(/\.js$/g, '');
		return 'require(\'' + requirePath + '\');';
	}

	var moduleOutputJs = banner + String(files.map(srcPathToDestRequire).join('\n'));
	try {
		fs.writeFileSync(destFile, moduleOutputJs);
	} catch (err) {
		grunt.fail.warn(err);
	}
	grunt.log.writeln('CommonJS Bundled Reference file created: ' + destFile.cyan);
};