define(function testXssVulnerabilitiesInJqueryMarkup (require) {
	var vulnerabilities = require('xss-tools/jquery-xss-vectors.js');

	return function createVulnarabilityTest(config) {
		return (function curryTestVulnerability() {
			var attributes = config.attributes;
			var buildControlContainer = config.buildControlContainer;
			var destroyControlContainer = config.destroyControlContainer;

			/*
			 * with all the randomness jquery does to markup
			 * how do you determine the code is safe?
			 *
			 * cleaned pattern isn't necessary to check because
			 *
			 * if dirty pattern is not found it is safe
			 * if the dirty pattern is found
			 *		but is an attibute value it is safe
			 */
			function testVulnarability(vulnerability, attribute) {
				var isSafe = false;

				var $controlContainer = buildControlContainer(vulnerability, attribute);
				var renderedHtml = $controlContainer.html();

				var escapedDirty = vulnerability.dirty.replace(/([\(\)\\])/g, '\\$1');
				var regexDirty = new RegExp(escapedDirty);
				var isDirty = regexDirty.test(renderedHtml);
				var dirtyMatches = renderedHtml.match(regexDirty) || [];

				var regexDirtyInAttributeValue = new RegExp('\\w*="'+ escapedDirty + '"');
				var isDirtyInAttributeValue = regexDirtyInAttributeValue.test(renderedHtml);
				var safeDirtyMatches = renderedHtml.match(regexDirtyInAttributeValue) || [];

				if (dirtyMatches.length === 0 || dirtyMatches.length === safeDirtyMatches.length) {
					isSafe = true;
				}

				QUnit.assert.ok(isSafe, '' +
					'safe from "' + vulnerability.item + '" attack using "' + attribute + '" attribute' +
					'\n rendered html: ' +
					'\n 	' + renderedHtml +
					'\n dirty html: ' +
					'\n 	' + vulnerability.dirty +
				'');

				destroyControlContainer($controlContainer);
			}

			return function runVulnerabilityTests(completeCallback) {
				attributes.forEach(function testAttribute(attribute) {
					vulnerabilities.forEach(function(vulnerability) {
						testVulnarability(vulnerability, attribute);
					});
				});

				if (typeof completeCallback === 'function') {
					completeCallback();
				}
			};
		}());
	};
});
