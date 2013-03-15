(function($) {
  $.twitter = {
    search: function(term) {
      var callback = arguments[1] || function(data) {};
      $.ajax({
        url: "http://search.twitter.com/search.json?q=" + term,
        dataType: "jsonp",
        success: callback,
        error: function(xmlRequest, textStatus, errorThrown) {
          if(textStatus !== 'notmodified') {
            $("body").append("<p class='error'>" + textStatus + "</p>");
          }
        }
      });
    },
    favorites: function() {
      return JSON.parse(localStorage.favorites || "[]");
    },
    addFavorite: function(tweet) {
      var currentFavorites = $.twitter.favorites();
      currentFavorites.push(tweet);
      localStorage.setItem("favorites", JSON.stringify(currentFavorites));
    }
  };

  function displayTweetsOnPage($tweetifiedElement) {
    return function(results) {
      var $tweetsUl = $tweetifiedElement.find("ul.tweets");
      $.each(results.results, function(i, tweet) {
        $("<li/>", {text: tweet.text, class: 'tweet'}).appendTo($tweetsUl);
      });
    };
  }

  $.fn.tweetify = function() {
    var $ul = $(this);
    $("input[type=submit]").live("click", function() {
      $.twitter.search($("input.searchTerm").val(),
                       displayTweetsOnPage($ul));
    });
    $(".tweet").live("click", function() {
      $.twitter.addFavorite($(this).text());
    });
    $(this).append("\
      <input type='text' class='searchTerm' />\
      <input type='submit' value='Search' />\
      <ul class='tweets'></ul>\
    ");
    return this;
  };
})(jQuery);
