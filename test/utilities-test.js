define( function utilitiesTestModule(require) {
	var QUnit = require('qunit');
	var $ = require('jquery');

	require('fuelux/utilities');

	QUnit.module( 'Fuel UX Utilities', function utilitiesTests() {
		QUnit.test( 'should be defined on jquery object', function utilitiesObjectDefinedTest( assert ) {
			assert.equal(typeof $().utilities,  'object', 'utilities object is defined' );
		});

		QUnit.module( 'cleanInput Method', {
			beforeEach: function beforeEachUtilitiesCleanInputTests() {
				this.utilities = $().utilities;
				this.cleanInput = this.utilities.cleanInput;
			}
		}, function utilitiesCleanInputTests() {
			QUnit.test( 'should be defined on utilities object', function cleanInputMethodDefinedTest( assert ) {
				assert.equal(typeof this.utilities.cleanInput,  'function', 'cleanInput function is defined' );
			});

			QUnit.test( 'should encode strings', function cleanInputMethodEncodeTest( assert ) {
				var dirtyString = '<script>';
				var cleanString = '&lt;script&gt;';
				assert.equal(this.cleanInput(dirtyString),  cleanString, 'string should be encoded' );
			});

			QUnit.test( 'should not double encode strings', function cleanInputMethodEncodeTest( assert ) {
				var variants = [
					{dirtyString: '&lt;&gt;', cleanString: '&lt;&gt;'},
					{dirtyString: '&lt;script&gt;', cleanString: '&lt;script&gt;'},
					{dirtyString: '<&lt;&gt;>', cleanString: '&lt;&lt;&gt;&gt;'}
				];

				variants.forEach(function forEachDoubleEncodeVariant(variant, index) {
					assert.equal(this.cleanInput(variant.dirtyString), variant.cleanString, 'variant ' + (index + 1) + ' string should be encoded' );
				}, this);
			});
		});
	});
});
