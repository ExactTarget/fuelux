/*! FuelUX - v2.0.0 - 2012-07-06
* https://github.com/ExactTarget/fuelux
* Copyright (c) 2012 ExactTarget; Licensed Apache */

(function($) {

  // Collection method.
  $.fn.awesome = function() {
    return this.each(function() {
      $(this).html('awesome');
    });
  };

  // Static method.
  $.awesome = function() {
    return 'awesome';
  };

  // Custom selector.
  $.expr[':'].awesome = function(elem) {
    return elem.textContent.indexOf('awesome') >= 0;
  };

}(jQuery));
