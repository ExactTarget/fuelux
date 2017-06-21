define(function radioGetValueModule () {
	return function radioGetValue (QUnit) {
		QUnit.test('should support getValue alias', function testGetValue (assert) {
			var $radio = this.$checkedEnabled;

			assert.equal($radio.radio('isChecked'), $radio.radio('getValue'), 'getValue alias matches isChecked');
			$radio.radio('check');
			assert.equal($radio.radio('isChecked'), $radio.radio('getValue'), 'getValue alias matches isChecked');
			$radio.radio('uncheck');
			assert.equal($radio.radio('isChecked'), $radio.radio('getValue'), 'getValue alias matches isChecked');
		});
	};
});
