(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery','underscore'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($, _) {

	var treeData =  [
			{
				"name": "Aquire",
				"type": "folder",
				"dataAttributes": { "id": "aquire-folder" },
				"children": [
					{
						"name": "POS Receipt",
						"type": "item"
					},
					{
						"name": "Confirm Subscription",
						"type": "item"
					},
					{
						"name": "Thanks for Signing Up",
						"type": "item"
					}
				]
			},
			{
				"name": "Onboard",
				"type": "folder"
			},
			{
				"name": "Engage",
				"type": "folder",
				"dataAttributes": { "id": "engage-folder" },
				"children":[
					{
						"name": "Abandoned Cart",
						"type": "folder",
						"children": [
							{
								"name": "Archive",
								"type": "folder"
							}
						]
					},
					{
						"name": "Transactional",
						"type": "folder",
						"children": [
							{
								"name": "Archive",
								"type": "folder"
							}
						]
					}
				]
			},
			{
				"name": "Retain",
				"type": "folder"
			}
		];

	window.treeData = treeData;

	var rootNodesRendered = false;
	var nodeId = 0;

	window.treeDataSource = function(options, callback) {
		var nodes = [];

		if(options.children) {
			nodes = options.children;
		}
		else if(!rootNodesRendered) {
			// render root nodes
			nodes = window.treeData;
			rootNodesRendered = true;
		}

		_.each(nodes, function(node, index) {
			if(!node.dataAttributes) {
				node.dataAttributes = {};
			}
			if(!node.dataAttributes.id) {
				// ensure each node has an identifier
				node.dataAttributes.id = 'node' + (nodeId += 1);
			}
			if(!node.value) {
				// ensure each node has a value (sync with id if needed)
				node.value = node.dataAttributes.id;
			}

			// determine whether the node has children
			// note: this will be used to hide the caret if necessary
			node.dataAttributes.hasChildren = (node.children && node.children.length > 0) ? true : false;
		});

		var dataSource = {
			data: nodes
		};

		// simulate delay
		window.setTimeout(function() {
			callback(dataSource);
		}, 500);
	};

}));