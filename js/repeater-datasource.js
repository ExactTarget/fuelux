(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery', 'underscore'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($, _) {

	var data = {
		repeater: {
			listData: [
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				},
				{
					appearance: 'small, usually furry, domesticated carnivorous mammal',
					commonName: 'cat',
					latinName: 'Felis catus',
					sound: 'Meow meow!'
				},
				{
					appearance: 'four-legged mammal with large head',
					commonName: 'cow',
					latinName: 'Bos primigenius taurus',
					sound: 'Moo moo!'
				},
				{
					appearance: 'four-legged, highly varied appearance based on breed',
					commonName: 'dog',
					latinName: 'Canis lupus familiaris',
					sound: 'Woof woof!'
				},
				{
					appearance: 'feathered, waddles on two webbed feet',
					commonName: 'mallard',
					latinName: 'Anas platyrhynchos',
					sound: 'Quack quack!'
				},
				{
					appearance: 'short-haired, four-legged, curly-tailed mammal',
					commonName: 'pig',
					latinName: 'Sus scrofa domesticus',
					sound: 'Oink oink!'
				},
				{
					appearance: 'large ears and big bushy tail',
					commonName: 'fox',
					latinName: 'Vulpes vulpes',
					sound: '???'
				}
			]
		}
	};

	window.data = data;

	// simulate network latency
	var loadDelays = ['300', '600', '900', '1200'];

	// list view setup
	window.repeaterListDataSource = function (options, callback) {

		// build dataSource based with options
		var resp = {
			count: data.repeater.listData.length,
			items: [],
			page: options.pageIndex
		};

		// get start and end limits for JSON
		var i, l;
		resp.pages = Math.ceil(resp.count / (options.pageSize || 50));

		i = options.pageIndex * (options.pageSize || 50);
		l = i + (options.pageSize || 50);
		l = (l <= resp.count) ? l : resp.count;
		resp.start = i + 1;
		resp.end = l;

		// setup columns for list view
		resp.columns = [
			{
				label: 'Common Name',
				property: 'commonName',
				sortable: true
			},
			{
				label: 'Latin Name',
				property: 'latinName',
				sortable: true
			},
			{
				label: 'Appearance',
				property: 'appearance',
				sortable: true
			},
			{
				label: 'Sound',
				property: 'sound',
				sortable: true
			}
		];

		// add sample items to datasource
		for (i; i < l; i++) {
			// from data.js
			resp.items.push(data.repeater.listData[i]);
		}

		//if(options.search){
		//resp.items = [];
		//}

		// call and simulate latency
		setTimeout(function () {
			callback(resp);
		}, loadDelays[Math.floor(Math.random() * 4)]);
	};

	// thumbnail view setup
	window.repeaterThumbDataSource = function (options, callback) {
		var sampleImageCategories = ['abstract', 'animals', 'business', 'cats', 'city', 'food', 'nature', 'technics', 'transport'];
		var numItems = 200;

		// build dataSource based with options
		var resp = {
			count: numItems,
			items: [],
			pages: (Math.ceil(numItems / (options.pageSize || 30))),
			page: options.pageIndex
		};

		// get start and end limits for JSON
		var i, l;
		i = options.pageIndex * (options.pageSize || 30);
		l = i + (options.pageSize || 30);
		resp.start = i + 1;
		resp.end = l;

		// add sample items to datasource
		for (i; i < l; i++) {
			resp.items.push({
				name: ('Thumbnail ' + (i + 1)),
				src: 'http://lorempixel.com/65/65/' + sampleImageCategories[Math.floor(Math.random() * 9)] + '/?_=' + i
			});
		}

		//if(options.search){
		//resp.items = [];
		//}

		// call and simulate latency
		setTimeout(function () {
			callback(resp);
		}, loadDelays[Math.floor(Math.random() * 4)]);
	};

}));