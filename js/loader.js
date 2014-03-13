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
			var start = function(id, loader){
				var bTag, cycle;

				cycle = function(i, item){
					item.className = 'fueluxicon-loader-' + i;
					i++;
					if(i===9){
						i = 1;
					}
					setTimeout(function(){
						cycle(i, item);
					},125);
				};

				loader.className += " iefix";

				bTag = "loader_" + id;
				loader.innerHTML = '<span>0</span><b id="' + bTag + '"></b>' + loader.innerHTML;

				bTag = document.getElementById(bTag);
				cycle(1, bTag);
				loader.setAttribute('data-initialized', 'true');
			};

			this.scan = function(){
				var loaders = document.querySelectorAll('.loader');
				var i, l;

				for(i=0, l=loaders.length; i<l; i++){
					if(loaders[i].getAttribute('data-initialized')!=='true'){
						count++;
						start(count, loaders[i]);
					}
				}
			};
		};

		window.fuelux_loader = new Loader();
	}

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --