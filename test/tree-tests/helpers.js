/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false */
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false */
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false */
define(function treeDataFactory (require) {
	var $ = require('jquery');
	var getKeyDown = require('../../helpers.js').getKeyDown;
	var KEYMAP = require('../../helpers.js').KEYMAP;

	var constants =	{
		NUM_CHILDREN: 9,
		NUM_FOLDERS: 4,
		NUM_ITEMS: 4,
		NUM_OVERFLOWS: 1
	};

	var callCountData = require('./data/callCount');
	var textData = require('./data/textData');
	var treeData = require('./data/treeData');

	var setup = function setup () {
		var callLimit = 50;
		var callCount = 0;

		this.dataSource = function genDataSource (options, callback) {
			if (callCount >= callLimit) {
				callback(callCountData, 400);
				return;
			}

			callCount++;

			callback(treeData());
		};

		this.textDataSource = function textDataSource (options, callback) {
			callback(textData);
		};

		var $fixture = $( '#qunit-fixture' );
		this.html = require('text!test/markup/tree-markup.html!strip');
		this.$html = $(this.html);
		$fixture.append(this.$html);
		this.$tree = $fixture.find('#MyTree');
		this.$tree2 = $fixture.find('#MyTree2');
		this.$selectableFolderTree = $fixture.find('#MyTreeSelectableFolder');

		this.defaultEventObject = {
			originalEvent: $.Event( 'keydown', { // eslint-disable-line new-cap
				target: this.$tree.find('li:not(".hidden"):first')
			}),
			which: KEYMAP.left
		};

		this.getKeyDown = getKeyDown;
	};

	return {
		treeData: treeData,
		callCountData: callCountData,
		textData: textData,
		constants: constants,
		setup: setup
	};
});
