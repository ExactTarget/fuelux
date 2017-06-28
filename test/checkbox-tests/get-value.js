define(function checkboxGetValueModule () {
	return function checkboxGetValue (QUnit) {
		QUnit.test('should support getValue alias', function testGetValue (assert) {
			var $chk = this.$checkedEnabled;

			assert.equal($chk.checkbox('isChecked'), $chk.checkbox('getValue'), 'getValue alias matches isChecked');
			$chk.checkbox('toggle');
			assert.equal($chk.checkbox('isChecked'), $chk.checkbox('getValue'), 'getValue alias matches isChecked');
			$chk.checkbox('toggle');
			assert.equal($chk.checkbox('isChecked'), $chk.checkbox('getValue'), 'getValue alias matches isChecked');
		});
	};
});
