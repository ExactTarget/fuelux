/*
 * Fuel UX Loader
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the MIT license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// NOTE: UMD wrapper is modified here because jQuery cannot be a dependency.

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define([], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory();
	}
}(function () {
// -- END UMD WRAPPER PREFACE --

// -- BEGIN MODULE CODE HERE --

	if(window && !window.fuelux_loader){
		var Loader = function(){
			var count = 0;
			var init = function(id, loader){
				var delay = (loader.hasAttribute('data-delay')) ? parseFloat(loader.getAttribute('data-delay')) : 150;
				var frame = (loader.hasAttribute('data-frame')) ? parseInt(loader.getAttribute('data-frame'), 10) : 0;
				var length = (loader.hasAttribute('data-length')) ? parseInt(loader.getAttribute('data-length'), 10) : 8;
				var start = (loader.hasAttribute('data-start')) ? parseFloat(loader.getAttribute('data-start')) : 0;
				var ieVer;

				var cycle = function(i){
					i++;
					if(i>=length){
						i = start;
					}
					loader.setAttribute('data-frame', i + '');
					setTimeout(function(){
						cycle(i);
					}, delay);
				};

				var msieVersion = function(){
					var ua = window.navigator.userAgent;
					var msie = ua.indexOf('MSIE ');
					if(msie>0){
						return parseInt(ua.substring(msie+5, ua.indexOf(".", msie )), 10);
					}else{
						return false;
					}
				};

				ieVer = msieVersion();
				if(ieVer!==false && ieVer<9){
					loader.className += ' iefix';
				}
				setTimeout(function(){
					cycle(frame);
				}, delay);
				loader.setAttribute('data-initialized', 'true');
			};

			this.scan = function(){
				var loaders = document.querySelectorAll('.loader');
				var i, l;

				for(i=0, l=loaders.length; i<l; i++){
					if(loaders[i].getAttribute('data-initialized')!=='true'){
						count++;
						init(count, loaders[i]);
					}
				}
			};
		};

		window.fuelux_loader = new Loader();
	}

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --