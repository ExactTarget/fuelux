(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define([], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory();
	}
}(function () {

	var data = {
		infiniteScroll: {
			content:	'<p>Hodor, hodor. Hodor. Hodor, hodor hodor hodor hodor, hodor. Hodor hodor, hodor, hodor hodor. Hodor! Hodor hodor, hodor - hodor hodor hodor? Hodor hodor HODOR! Hodor hodor, hodor. Hodor hodor... Hodor hodor hodor hodor?! Hodor hodor HODOR! Hodor hodor - hodor, hodor. Hodor hodor hodor! Hodor hodor - hodor... Hodor hodor hodor, hodor, hodor hodor. Hodor hodor - hodor; hodor hodor hodor hodor?! Hodor, HODOR hodor, hodor hodor? Hodor! Hodor hodor, hodor, hodor. Hodor hodor? </p>' +
						'<p>Hodor hodor HODOR! Hodor hodor hodor - hodor, hodor, hodor hodor. Hodor. Hodor hodor - hodor?! Hodor HODOR hodor, hodor hodor. Hodor. Hodor hodor - hodor HODOR hodor, hodor hodor hodor! Hodor. Hodor hodor hodor hodor hodor?! Hodor hodor HODOR! Hodor hodor hodor hodor, hodor, hodor hodor. Hodor! Hodor hodor, hodor; hodor hodor hodor, hodor, hodor hodor. </p>' +
						'<p>Hodor hodor hodor - hodor? Hodor hodor hodor hodor hodor hodor! Hodor! Hodor hodor, hodor, hodor. Hodor hodor; hodor hodor - hodor. Hodor. Hodor hodor hodor. Hodor! Hodor hodor, hodor - hodor? </p>' +
						'<p>Hodor hodor HODOR! Hodor hodor hodor; hodor hodor hodor! Hodor. Hodor hodor... Hodor hodor hodor hodor. Hodor, hodor, hodor. Hodor hodor - HODOR hodor, hodor hodor? Hodor, hodor. Hodor. Hodor, hodor - HODOR hodor, hodor hodor - hodor. Hodor hodor, hodor. Hodor hodor?! Hodor hodor... Hodor hodor hodor - hodor. Hodor. </p>' +
						'<p>Hodor, hodor. Hodor. Hodor, HODOR hodor, hodor HODOR hodor, hodor hodor hodor, hodor. Hodor hodor. Hodor. Hodor hodor - hodor... Hodor hodor hodor, hodor, hodor hodor. Hodor, hodor. Hodor. Hodor, hodor hodor hodor? Hodor hodor - hodor... Hodor hodor hodor?! Hodor, hodor hodor hodor; hodor hodor; hodor hodor hodor! </p>',
			delays: ['300', '600', '900', '1200']
		},
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
		},
		tree: [
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
		]
	};

	window.data = data;
	return data;

}));