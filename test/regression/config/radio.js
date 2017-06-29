module.exports = {
	radios: [
		{
			id: 'myRadios',
			radios: [
				{label: 'Custom radio unchecked on pageload'},
				{checked: true, label: 'Custom radio checked on pageload'}
			]
		},
		{
			id: 'myRadios2',
			radios: [
				{disabled: true, label: 'Custom radio disabled on pageload'},
				{checked: true, disabled: true, label: 'Custom radio checked and disable on pageload'}
			]
		}
	]
};
