define(function checkboxDestroyModule () {
	return function checkboxDestroy (QUnit) {
		QUnit.test('should destroy checkbox', function testDestroy (assert) {
			assert.ok(this.$fixture.find('#CheckboxCheckedEnabled').length, 'checkbox exists in DOM by default');

			var originalMarkup = this.$checkedEnabled.parent('.checkbox').html().trim();
			var returnedMarkup = this.$checkedEnabled.checkbox('destroy');

			assert.equal(originalMarkup, returnedMarkup, 'returned original markup');
			assert.notOk(this.$fixture.find('#CheckboxCheckedEnabled').length, 'checkbox removed from DOM');
		});
	};
});
