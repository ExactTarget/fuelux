/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
define( function ( require ) {
	var QUnit = require('qunit');
	var $ = require( "jquery" );
	var html = require( "text!test/markup/tree-markup.html!strip" );

	$( "body" ).append( html );

	require( "bootstrap" );
	require( "fuelux/tree" );

	QUnit.module( "Fuel UX Tree", {
		beforeEach: function( assert ) {
			var callLimit = 50;
			var callCount = 0;

			function guid () {
				function s4 () {
					return Math.floor( ( 1 + Math.random() ) * 0x10000 )
						.toString( 16 )
						.substring( 1 );
				}
				return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
			}

			this.dataSource = function( options, callback ) {
				if ( callCount >= callLimit ) {
					callback( {
						data: [
							{
								"name": "Convex and Concave",
								"type": "item",
								"attr": {
									"id": "item4"
								}
							}
						]
					}, 400 );
					return;
				}

				callCount++;

				callback( {
					data: [
						{
							name: "Ascending and Descending",
							type: "folder",
							attr: {
								id: "folder" + guid()
							}
						},
						{
							name: "Sky and Water I (with custom icon)",
							type: "item",
							attr: {
								id: "folder" + guid(),
								"data-icon": "glyphicon glyphicon-file"
							}
						},
						{
							name: "Drawing Hands",
							type: "folder",
							attr: {
								id: "folder" + guid(),
								"data-children": false
							}
						},
						{
							name: "Waterfall",
							type: "item",
							attr: {
								id: "item2"
							}
						},
						{
							name: "Belvedere",
							type: "folder",
							attr: {
								id: "folder" + guid()
							}
						},
						{
							name: "Relativity (with custom icon)",
							type: "item",
							attr: {
								id: "item3",
								"data-icon": "glyphicon glyphicon-picture"
							}
						},
						{
							name: "House of Stairs",
							type: "folder",
							attr: {
								id: "folder" + guid()
							}
						},
						{
							name: "Convex and Concave",
							type: "item",
							attr: {
								id: "item4"
							}
						},
						{
							name: "Load More",
							type: "overflow",
							attr: {
								id: "overflow1"
							}
						}
					]
				} );
			};

			this.textDataSource = function( options, callback ) {
				callback( {
					data: [
						{
							text: "node text",
							type: "folder",
							attr: {
								id: "folder1"
							}
						}
					]
				} );
			};

		}
	} );

	var NUM_CHILDREN = 9;
	var NUM_FOLDERS = 4;
	var NUM_ITEMS = 4;
	var NUM_OVERFLOWS = 1;

	QUnit.test( "should be defined on jquery object", function( assert ) {
		assert.ok( $().tree, "tree method is defined" );
	} );

	QUnit.test( "should return element", function( assert ) {
		var $tree = $( html );
		assert.ok( $tree.tree() === $tree, "tree should be initialized" );
	} );

	QUnit.test( "should have correct defaults", function correctDefaults( assert ) {
		var $tree = $( html );

		var defaults = $tree.tree.defaults;

		assert.equal( defaults.multiSelect, false, "multiSelect defaults to false" );
		assert.equal( defaults.cacheItems, true, "cacheItems defaults to true" );
		assert.equal( defaults.folderSelect, true, "folderSelect defaults to true" );
		assert.equal( defaults.itemSelect, true, "itemSelect defaults to true" );
		assert.equal( defaults.disclosuresUpperLimit, 0, "disclosuresUpperLimit defaults to 0" );
		assert.ok( defaults.dataSource, "dataSource exists by default" );
	} );

	QUnit.test( "should call dataSource correctly", function( assert ) {
		var $tree = $( html );
		$tree.tree( {
			dataSource: function( options, callback ) {
				assert.ok( 1 === 1, "dataSource function called prior to rendering" );
				assert.equal( typeof options, "object", "dataSource provided options object" );
				assert.equal( typeof callback, "function", "dataSource provided callback function" );
				callback( {
					data: []
				} );
			}
		} );
	} );

	QUnit.test( "Tree should be populated by items on initialization", function( assert ) {
		var $tree = $( html ).find( "#MyTree" );

		$tree.tree( {
			dataSource: this.dataSource
		} );

		assert.equal( $tree.find( ".tree-branch:not([data-template])" ).length, NUM_FOLDERS, "Initial set of folders have been added" );
		assert.equal( $tree.find( ".tree-item:not([data-template])" ).length, NUM_ITEMS, "Initial set of items have been added" );
		assert.equal( $tree.find( ".tree-overflow:not([data-template])" ).length, NUM_OVERFLOWS, "Initial overflow has been added" );
	} );

	QUnit.test( "Folder should populate when opened", function( assert ) {
		var $tree = $( html ).find( "#MyTree" );
		var $selNode;

		$tree.tree( {
			dataSource: this.dataSource
		} );

		$selNode = $tree.find( ".tree-branch:eq(1)" );
		$tree.tree( "discloseFolder", $selNode.find( ".tree-branch-name" ) );
		assert.equal( $selNode.find( ".tree-branch-children > li" ).length, NUM_CHILDREN, "Folder has been populated with items/sub-folders" );

		$tree = $( html ).find( "#MyTreeSelectableFolder" );

		$tree.tree( {
			dataSource: this.dataSource,
			folderSelect: true
		} );

		$selNode = $tree.find( ".tree-branch:eq(1)" );
		$tree.tree( "discloseFolder", $selNode.find( ".tree-branch-header" ) );
		assert.equal( $selNode.find( ".tree-branch-children > li" ).length, NUM_CHILDREN, "Folder has been populated with sub-folders and items" );
	} );

	QUnit.test( "getValue alias should function", function( assert ) {
		var $tree = $( html ).find( "#MyTree" );

		// MultiSelect: false is the default
		$tree.tree( {
			dataSource: this.dataSource
		} );

		$tree.tree( "selectItem", $tree.find( ".tree-item:eq(1)" ) );
		assert.deepEqual( $tree.tree( "selectedItems" ), $tree.tree( "getValue" ), "getValue aliases selectedItems" );
	} );

	QUnit.test( "Single item/folder selection works as designed", function( assert ) {
		var $tree = $( html ).find( "#MyTree" );

		// MultiSelect: false is the default
		$tree.tree( {
			dataSource: this.dataSource
		} );

		$tree.tree( "selectItem", $tree.find( ".tree-item:eq(1)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 1, "Return single selected value" );
		$tree.tree( "selectItem", $tree.find( ".tree-item:eq(2)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 1, "Return new single selected value" );

		$tree = $( html ).find( "#MyTreeSelectableFolder" );

		$tree.tree( {
			dataSource: this.dataSource,
			folderSelect: true
		} );

		$tree.tree( "selectItem", $tree.find( ".tree-item:eq(1)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 1, "Return single selected item (none previously selected, 1st programatic selection)" );

		$tree.tree( "selectFolder", $tree.find( ".tree-branch-name:eq(1)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 1, "Return single selected folder (item previously selected, 2nd programatic selection)" );

		$tree.tree( "selectItem", $tree.find( ".tree-item:eq(2)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 1, "Return single selected item (folder previously selected, 3rd programatic selection)" );

		$tree.find( ".tree-item:eq(1)" ).click();
		assert.equal( $tree.tree( "selectedItems" ).length, 1, "Return single selected item (item previously selected, 1st click selection)" );

		$tree.find( ".tree-branch-name:eq(1)" ).click();
		assert.equal( $tree.tree( "selectedItems" ).length, 1, "Return single selected folder (item previously selected, 2nd click selection)" );

		$tree.find( ".tree-item:eq(2)" ).click();
		assert.equal( $tree.tree( "selectedItems" ).length, 1, "Return single selected item (folder previously selected, 3rd click selection)" );

	} );

	// Test("Overflow click works as designed", function () {
	// 	var $tree = $(html).find('#MyTree');

	// 	$tree.tree({
	// 		dataSource: this.dataSource
	// 	});

	// 	Equal($tree.find('> li:not([data-template])').length, NUM_CHILDREN, 'Initial set of folders (' + NUM_CHILDREN + ' children) have been added');
	// 	$tree.find('.tree-overflow:eq(0)').click();
	// 	//Once overflow is clicked, all original contents is loaded again, and original overflow is actually REMOVED from tree contents.
	// 	var NUM_AFTER_OVERFLOW_CLICK = (NUM_CHILDREN * 2) - 1;
	// 	equal($tree.find('> li:not([data-template])').length, NUM_AFTER_OVERFLOW_CLICK, 'Overflow contents (now ' + NUM_AFTER_OVERFLOW_CLICK + ' children) have loaded');

	// });

	QUnit.test( "Multiple item/folder selection works as designed", function( assert ) {
		var $tree = $( html ).find( "#MyTree" );

		$tree.tree( {
			dataSource: this.dataSource,
			multiSelect: true
		} );

		$tree.tree( "selectItem", $tree.find( ".tree-item:eq(1)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 1, "Return single selected value" );
		$tree.tree( "selectItem", $tree.find( ".tree-item:eq(2)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 2, "Return multiple selected values" );
		$tree.tree( "selectItem", $tree.find( ".tree-item:eq(1)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 1, "Return single selected value" );

		$tree = $( html ).find( "#MyTreeSelectableFolder" );

		$tree.tree( {
			dataSource: this.dataSource,
			multiSelect: true,
			folderSelect: true
		} );

		$tree.tree( "selectFolder", $tree.find( ".tree-branch-name:eq(1)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 1, "Return single selected value" );
		$tree.tree( "selectFolder", $tree.find( ".tree-branch-name:eq(2)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 2, "Return multiple selected values" );
		$tree.tree( "selectFolder", $tree.find( ".tree-branch-name:eq(1)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 1, "Return single selected value" );
	} );

	QUnit.test( "should not allow selecting items if disabled", function( assert ) {
		var $tree = $( html ).find( "#MyTree" );

		$tree.tree( {
			dataSource: this.dataSource,
			itemSelect: false
		} );

		$tree.tree( "selectItem", $tree.find( ".tree-item:eq(1)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 0, "Return no value" );
	} );

	QUnit.test( "should not allow selecting folders if disabled", function( assert ) {
		var $tree = $( html ).find( "#MyTree" );

		$tree.tree( {
			dataSource: this.dataSource,
			folderSelect: false
		} );

		$tree.tree( "selectFolder", $tree.find( ".tree-branch-name:eq(1)" ) );
		assert.equal( $tree.tree( "selectedItems" ).length, 0, "Return no value" );
	} );

	QUnit.test( "folders should open and close correctly", function( assert ) {
		var $tree = $( html ).find( "#MyTree" );

		$tree.tree( {
			dataSource: this.dataSource
		} );

		var $targetBranch = $( $tree.find( ".tree-branch" )[ 0 ] );

		assert.equal( $targetBranch.hasClass( "tree-open" ), false, "Branch starts closed" );
		$tree.tree( "discloseFolder", $targetBranch );
		assert.equal( $targetBranch.hasClass( "tree-open" ), true, "discloseFolder opens folder" );
		$tree.tree( "discloseFolder", $targetBranch );
		assert.equal( $targetBranch.hasClass( "tree-open" ), true, "redundant discloseFolder calls leaves folder open" );
		$tree.tree( "closeFolder", $targetBranch );
		assert.equal( $targetBranch.hasClass( "tree-open" ), false, "closeFolder closes folder" );
		$tree.tree( "closeFolder", $targetBranch );
		assert.equal( $targetBranch.hasClass( "tree-open" ), false, "redundant closeFolder calls leaves folder closed" );
		$tree.tree( "toggleFolder", $targetBranch );
		assert.equal( $targetBranch.hasClass( "tree-open" ), true, "toggleFolder on closed folder opens folder" );
		$tree.tree( "toggleFolder", $targetBranch );
		assert.equal( $targetBranch.hasClass( "tree-open" ), false, "toggleFolder on open folder closes folder" );
	} );

	QUnit.test( "should disclose visible folders", function( assert ) {
        var ready = assert.async();
        var $tree = $( "body" ).find( "#MyTree" );

        $tree.tree( {
			dataSource: this.dataSource
		} );

        var toBeOpened = $tree.find( ".tree-branch:not('.tree-open, .hidden')" ).length;
        assert.equal( $tree.find( ".tree-branch.tree-open:not('.hidden')" ).length, 0, "0 folders open" );

        $tree.one( "disclosedVisible.fu.tree", function() {
			assert.equal( $tree.find( ".tree-branch.tree-open:not('.hidden')" ).length, toBeOpened, toBeOpened + " folders open" );
			ready();
		} );

        $tree.tree( "discloseVisible" );
    } );

	QUnit.test( "should disclose all folders up to limit, and then close them, then open them all", function( assert ) {
        var ready = assert.async();
        var $tree = $( "body" ).find( "#MyTree2" );

        $tree.tree( {
			dataSource: this.dataSource,
			disclosuresUpperLimit: 2
		} );

        assert.equal( $tree.find( ".tree-branch.tree-open:not('.hidden')" ).length, 0, "0 folders open" );
        $tree.one( "exceededDisclosuresLimit.fu.tree", function exceededDisclosuresLimit() {
			assert.equal( $tree.find( ".tree-branch.tree-open:not('.hidden')" ).length, 20, "20 folders open" );

			$tree.one( "closedAll.fu.tree", function closedAll() {
				assert.equal( $tree.find( ".tree-branch.tree-open:not('.hidden')" ).length, 0, "0 folders open" );

				$tree.data( "ignore-disclosures-limit", true );

				$tree.one( "disclosedAll.fu.tree", function exceededDisclosuresLimit() {
					assert.equal( $tree.find( ".tree-branch.tree-open:not('.hidden')" ).length, 200, "200 folders open" );
					ready();
				} );

				$tree.tree( "discloseAll" );
			} );

			$tree.tree( "closeAll" );
		} );

        $tree.tree( "discloseAll" );
    } );

	QUnit.test( "should refresh an already opened/cached folder with new nodes", function( assert ) {
		var $tree = $( html ).find( "#MyTree" );
		var $folderToRefresh;
		var initialLoadedFolderId, refreshedLoadedFolderId;
		var selector = ".tree-branch-children > li:eq(0)";

		$tree.tree( {
			dataSource: this.dataSource
		} );
		$folderToRefresh = $tree.find( ".tree-branch:eq(1)" );

		// Open folder
		$tree.tree( "discloseFolder", $folderToRefresh.find( ".tree-branch-name" ) );
		assert.equal( $folderToRefresh.find( ".tree-branch-children > li" ).length, NUM_CHILDREN, "Folder has been populated with items/sub-folders" );
		initialLoadedFolderId = $folderToRefresh.find( selector ).attr( "id" );

		// Refresh and see if it's the same ID
		$tree.tree( "refreshFolder", $folderToRefresh );
		refreshedLoadedFolderId = $folderToRefresh.find( ".tree-branch-children > li:eq(0)" ).attr( "id" );
		assert.notEqual( refreshedLoadedFolderId, initialLoadedFolderId, "Folder has been refreshed and populated with different items/sub-folders" );
	} );

	QUnit.test( "should destroy control", function( assert ) {
		var $tree = $( html ).find( "#MyTree" );

		$tree.tree( {
			dataSource: this.dataSource
		} );

		assert.equal( typeof ( $tree.tree( "destroy" ) ), "string", "returns string (markup)" );
		assert.equal( $tree.parent().length, false, "control has been removed from DOM" );
	} );

	QUnit.test( "Tree should accept TEXT as the NAME property in the datasource", function( assert ) {
		var $tree = $( html ).find( "#MyTree" );

		$tree.tree( {
			dataSource: this.textDataSource
		} );

		$tree.tree( "selectFolder", $tree.find( ".tree-branch-name:eq(1)" ) );
		assert.equal( $tree.tree( "selectedItems" )[ 0 ].text, "node text", "Param TEXT used in the datasource" );
	} );
} );
