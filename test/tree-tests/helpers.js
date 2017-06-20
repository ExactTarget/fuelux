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

	var guid = function guid () {
		var s4 = function s4 () {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		};

		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	};

	var callCountData = {
		data: [
			{
				'name': 'Convex and Concave',
				'type': 'item',
				'attr': {
					'id': 'item4'
				}
			}
		]
	};

	var textData = {
		data: [
			{
				text: 'node text',
				type: 'folder',
				attr: {
					id: 'folder1'
				}
			}
		]
	};

	var treeData = function generateTreeData () {
		return {
			data: [
				{
					name: 'Ascending and Descending',
					type: 'folder',
					attr: {
						id: 'folder' + guid()
					}
				},
				{
					name: 'Sky and Water I (with custom icon)',
					type: 'item',
					attr: {
						id: 'folder' + guid(),
						'data-icon': 'glyphicon glyphicon-file'
					}
				},
				{
					name: 'Drawing Hands',
					type: 'folder',
					attr: {
						id: 'folder' + guid(),
						'data-children': false
					}
				},
				{
					name: 'Waterfall',
					type: 'item',
					attr: {
						id: 'item2'
					}
				},
				{
					name: 'Belvedere',
					type: 'folder',
					attr: {
						id: 'folder' + guid()
					}
				},
				{
					name: 'Relativity (with custom icon)',
					type: 'item',
					attr: {
						id: 'item3',
						'data-icon': 'glyphicon glyphicon-picture'
					}
				},
				{
					name: 'House of Stairs',
					type: 'folder',
					attr: {
						id: 'folder' + guid()
					}
				},
				{
					name: 'Convex and Concave',
					type: 'item',
					attr: {
						id: 'item4'
					}
				},
				{
					name: 'Load More',
					type: 'overflow',
					attr: {
						id: 'overflow1'
					}
				}
			]
		};
	};

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
