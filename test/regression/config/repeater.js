module.exports = {
	repeaters: [
		{
			id: 'myRepeater',
			listSelectable: false,
			filters: [
				{value: 'all', text: 'All', selected: true},
				{value: 'some', text: 'Some'},
				{value: 'others', text: 'Others'}
			],
			filtersAlt: [
				{value: 'bug', text: 'Bug'},
				{value: 'dark', text: 'Dark'},
				{value: 'dragon', text: 'Dragon'},
				{value: 'electric', text: 'Electric'},
				{value: 'fairy', text: 'Fairy'},
				{value: 'fighting', text: 'Fighting'},
				{value: 'fire', text: 'Fire'},
				{value: 'flying', text: 'Flying'},
				{value: 'ghost', text: 'Ghost'},
				{value: 'grass', text: 'Grass'},
				{value: 'ground', text: 'Ground'},
				{value: 'ice', text: 'Ice'},
				{value: 'normal', text: 'Normal'},
				{value: 'poison', text: 'Poison'},
				{value: 'psychic', text: 'Psychic'},
				{value: 'rock', text: 'Rock'},
				{value: 'steel', text: 'Steel'},
				{value: 'water', text: 'Water'}
			],
			itemsPerPage: [
				{value: 5, text: 5},
				{value: 10, text: 10, selected: true},
				{value: 20, text: 20},
				{value: 50, text: 50},
				{value: 100, text: 100}
			]
		}
	]
};
