/*!
 * JavaScript for FuelUX's docs - Repeater Examples
 * Copyright 2011-2014 ExactTarget, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

define(function(require){
	var $ = require('jquery');
	var _ = require('underscore');
	var colors = {
		bug: '#A8B820',
		dark: '#705848',
		dragon: '#7038F8',
		electric: '#F8D030',
		fairy: '#EE99AC',
		fighting: '#C03028',
		fire: '#F08030',
		flying: '#A890F0',
		ghost: '#705898',
		grass: '#78C850',
		ground: '#E0C068',
		ice: '#98D8D8',
		normal: '#A8A878',
		poison: '#A040A0',
		psychic: '#F85888',
		rock: '#B8A038',
		steel: '#B8B8D0',
		water: '#6890F0'
	};
	var columns = [
		{
			label: 'Name',
			property: 'name',
			sortable: true
		},
		{
			label: 'Id',
			property: 'id',
			sortable: true
		},
		{
			label: 'Type',
			property: 'type',
			sortable: true
		},
		{
			label: 'Height (in)',
			property: 'height',
			sortable: true
		},
		{
			label: 'Weight (lbs)',
			property: 'weight',
			sortable: true
		},
		{
			label: 'Abilities',
			property: 'abilities',
			sortable: true
		},
		{
			label: 'Weakness',
			property: 'weakness',
			sortable: true
		}
	];
	var delays = ['300', '600', '900', '1200'];
	var pokemon = require('assets/js/repeater-data');
	var dataSource, filtering;

	require('bootstrap');
	require('fuelux');

	dataSource = function(options, callback){
		var items = filtering(options);
		var resp = {
			count: items.length,
			items: [],
			page: options.pageIndex,
			pages: Math.ceil(items.length/(options.pageSize || 50))
		};
		var i, items, l;

		i = options.pageIndex * (options.pageSize || 50);
		l = i + (options.pageSize || 50);
		l = (l <= resp.count) ? l : resp.count;
		resp.start = i + 1;
		resp.end = l;

		if(options.view==='list' || options.view==='thumbnail'){
			if(options.view==='list'){
				resp.columns = columns;
				for(i; i<l; i++){
					resp.items.push(items[i]);
				}
			}else{
				for(i; i<l; i++){
					resp.items.push({
						color: colors[items[i].type.split(', ')[0]],
						name: items[i].name,
						src: items[i].ThumbnailImage
					});
				}
			}

			setTimeout(function(){
				callback(resp);
			}, delays[Math.floor(Math.random() * 4)]);
		}
	};

	filtering = function(options){
		var items = $.extend([], pokemon);
		var search;

		if(options.filter.value!=='all'){
			items = _.filter(items, function(item){
				return (item.type.search(options.filter.value)>=0);
			});
		}
		if(options.search){
			search = options.search.toLowerCase();
			items = _.filter(items, function(item){
				return (
					(item.name.toLowerCase().search(options.search)>=0) ||
					(item.id.toLowerCase().search(options.search)>=0) ||
					(item.type.toLowerCase().search(options.search)>=0) ||
					(item.height.toLowerCase().search(options.search)>=0) ||
					(item.weight.toLowerCase().search(options.search)>=0) ||
					(item.abilities.toLowerCase().search(options.search)>=0) ||
					(item.weakness.toLowerCase().search(options.search)>=0)
				);
			});
		}
		if(options.sortProperty){
			items = _.sortBy(items, function(item){
				if(options.sortProperty==='id' || options.sortProperty==='height' || options.sortProperty==='weight'){
					return parseFloat(item[options.sortProperty]);
				}else{
					return item[options.sortProperty];
				}
			});
			if(options.sortDirection==='desc'){
				items.reverse();
			}
		}

		return items;
	};

	// REPEATER
	$('#myRepeater').repeater({
		dataSource: dataSource
	});

	$('#myRepeaterList').repeater({
		dataSource: dataSource
	});

	$('#myRepeaterThumbnail').repeater({
		dataSource: dataSource
	});

});