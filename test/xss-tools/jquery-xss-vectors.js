define(function jqueryVectors (require) {
	var vectors = require('xss-tools/xss-vectors.js');

	var jqueryVectors = [];
	var vectorsToMap = [].concat(vectors);

	function mapVectorsForJquery(vector) {
		var newVector = Object.create(vector);

		// exclude vectors known to be safe in jquery
		var jquerySafeVecortsDirtyCode = {
			'foo=': 1
		};
		if (jquerySafeVecortsDirtyCode[newVector.dirty]) {
			return;
		}

		/*
		 * jquery encodes tag attributes differntly from markup
		 * looking for clean is less consistent/feasible
		 * opting to look for dirty instead therefor these vector attribues are not needed
		 */
		newVector.clean = undefined;
		newVector.regexClean = undefined;

		jqueryVectors.push(newVector);
	}

	vectorsToMap.forEach(mapVectorsForJquery);

	jqueryVectors = jqueryVectors.concat([
		{ item: '[w-3766576] Store XSS', dirty: 'TestTriggerSe"name="txtName"><script>alert(1)</script>"' },
		{ item: 'break attribute', dirty: '"><script>alert(1)</script>' }
	]);


	return jqueryVectors;
});
