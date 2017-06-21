define(function radioDestroyModule () {
	return function radioDestroy (QUnit) {
		QUnit.test('should destroy radio', function testDestroy (assert) {
			assert.ok(this.$fixture.find('#RadioCheckedEnabled').length, 'radio exists in DOM by default');

			var originalMarkup = this.$checkedEnabled.parent('.radio').html().trim();
			var returnedMarkup = this.$checkedEnabled.radio('destroy');

			assert.equal(originalMarkup, returnedMarkup, 'returned original markup');
			assert.notOk(this.$fixture.find('#RadioCheckedEnabled').length, 'radio removed from DOM');
		});
	};
});
