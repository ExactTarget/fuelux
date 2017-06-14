module.exports = {
	checkboxen: [
		{checkboxes: [
			{id: 'checkbox1', label: 'Custom checkbox unchecked on page load'},
			{id: 'checkbox2', label: 'Custom checkbox checked on page load', checked: true},
			{id: 'checkbox3', label: 'Disabled custom checkbox unchecked on page load', disabled: true},
			{id: 'checkbox4', label: 'Disabled custom checkbox checked on page load', checked: true, disabled: true}
		]}
	],
	inlinecheckboxen: [
		{
			id: 'checkboxes-inline',
			inline: true,
			checkboxes: [
				{id: 'myCustomInlineCheckbox1', label: '1, 2, buckle my shoe', checked: true},
				{id: 'myCustomInlineCheckbox2', label: '3, 4, shut the door'},
				{id: 'myCustomInlineCheckbox3', label: '5, 6, pick up sticks', disabled: true},
				{id: 'myCustomInlineCheckbox4', label: '7, 8, lay them straight', checked: true, disabled: true}
			]
		}
	]
};
