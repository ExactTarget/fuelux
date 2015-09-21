module.exports = {
	options: {
		files: ['package.json'],
		updateConfigs: ['pkg'],
		commit: false,
		createTag: false,
		tagName: '%VERSION%',
		tagMessage: '%VERSION%',
		push: false,
		gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
	}
};