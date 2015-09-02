module.exports = {
	options: {
		ignore:[
			'Section lacks heading. Consider using “h2”-“h6” elements to add identifying headings to all sections.',
			'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
			'Element head is missing a required instance of child element title.'
		],
		force: true
	},
	src: ['index.html', 'markup/*.html', 'test/markup/*.html']
};