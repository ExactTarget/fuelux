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
		}
	};

	window.data = data;
	return data;

}));