module.exports = function (grunt) {

	return {
			source: {
			options: {
				urls: ['http://localhost:' + '<%= connectTestServerOptionsPort %>' + '/test/?coverage=true&gruntReport'],
				threshold: 1,
				globalThreshold: 1
			}
		}
	}

};