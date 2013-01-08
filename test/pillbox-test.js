/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/pillbox'], function($) {

	module("Fuel UX pillbox", {
		setup: function(){
			this.pillboxHTML = '<div><ul>' +
				'<li data-value="foo">one</li><li>two</li>' +
			'</ul></div>';
		}
	});

	test("should be defined on jquery object", function () {
		ok($(this.pillboxHTML).pillbox, 'pillbox method is defined');
	});
	test("should return element", function () {
		var $pillbox = $(this.pillboxHTML);
		ok($pillbox.pillbox() === $pillbox, 'pillbox should be initialized');
	});
	test("should behave as designed", function () {
		var $pillbox = $(this.pillboxHTML).pillbox();

		equal($pillbox.pillbox('items').length, 2, 'pillbox returns both items');

		$pillbox.find('li').eq(1).click();

		equal($pillbox.pillbox('items').length, 1, 'pillbox removed an item');
		deepEqual($pillbox.pillbox('items')[0], {text: 'one', value: 'foo'}, 'pillbox returns item data');
	});

});