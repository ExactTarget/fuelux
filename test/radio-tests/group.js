define(function radioGroupModule () {
	return function radioGroup (QUnit) {
		QUnit.module('groups', {}, function testInitialization () {
			QUnit.test('should initialize with only one element checked (if any)', function testGroupInitialization (assert) {
				this.initializeGroup(0);

				assert.ok(this.radioGroup[0].hasClass('checked'), 'index 0 label has "checked" class when input is checked');
				assert.notOk(this.radioGroup[1].hasClass('checked'), 'index 1 label does not have "checked" class');
				assert.notOk(this.radioGroup[2].hasClass('checked'), 'index 2 label does not have "checked" class');
			});

			QUnit.test('should set 2nd item checked and 1st item unchecked after selecting 2nd item in group', function testGroupCheckedChange (assert) {
				assert.expect(3);
				this.initializeGroup(0);

				var fixture = this;
				this.$radioGroup.one('changed.fu.radio', function testChecked () {
					assert.notOk(fixture.radioGroup[0].hasClass('checked'), 'index 0 label does not have "checked" class when input is checked');
					assert.ok(fixture.radioGroup[1].hasClass('checked'), 'index 1 label has "checked" class');
					assert.notOk(fixture.radioGroup[2].hasClass('checked'), 'index 2 label does not have "checked" class');
				});

				this.radioGroup[1].find('input').click();
			});

			QUnit.test('should set initial state to checked for middle item in group', function testMiddleInit (assert) {
				this.initializeGroup(1);

				assert.notOk(this.radioGroup[0].hasClass('checked'), 'index 0 label does not have "checked" class when input is checked');
				assert.ok(this.radioGroup[1].hasClass('checked'), 'index 1 label has "checked" class');
				assert.notOk(this.radioGroup[2].hasClass('checked'), 'index 2 label does not have "checked" class');
			});

			QUnit.test('should set initial state to checked for last item in group', function testLastInit (assert) {
				this.initializeGroup(2);

				assert.notOk(this.radioGroup[0].hasClass('checked'), 'index 0 label does not have "checked" class when input is checked');
				assert.notOk(this.radioGroup[1].hasClass('checked'), 'index 1 label does not have "checked" class');
				assert.ok(this.radioGroup[2].hasClass('checked'), 'index 2 label has "checked" class');
			});
		});
	};
});
