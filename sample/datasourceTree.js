/*
 * Fuel UX Data components - static data source
 * https://github.com/ExactTarget/fuelux-data
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['underscore'], factory);
	} else {
		root.TreeDataSource = factory();
	}
}(this, function () {

	var DataSourceTree = function (options) {
		this._data 	= options.data;
		this._delay = options.delay;
	};

	DataSourceTree.prototype = {

		data: function (options, callback) {
			var self = this;

			setTimeout(function () {
				var data = $.extend(true, [], self._data);

				callback({ data: data });

			}, this._delay)
		}

	};

	return DataSourceTree;
}));
