var originalAjax = $.ajax;

QUnit.testDone = function() {
  $.ajax = originalAjax;
  $(".workspace").empty();
  localStorage.clear();
};

function stubTwitterErrorResponse(status) {
  $.ajax = function(options) { options.error("xmlHTTPRequest", status); };
}

function stubTwitterSuccessResponse(data) {
  $.ajax = function(options) { options.success(data); };
}

var successData = {"results":[{"profile_image_url":"http://a3.twimg.com/profile_images/819491527/twitterProfilePhoto_normal.jpg","created_at":"Fri, 04 Jun 2010 18:32:46 +0000","from_user":"BOKALDO","metadata":{"result_type":"recent"},"to_user_id":null,"text":"RT @jquery: YouTube Chromeless Video Player jQuery Plugin - http://bit.ly/bpA9Lr","id":15434770525,"from_user_id":56827587,"geo":null,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;"},{"profile_image_url":"http://a3.twimg.com/profile_images/391232161/CSC_6632_v1_428x640_normal.JPG","created_at":"Fri, 04 Jun 2010 18:31:57 +0000","from_user":"stefanomartins","metadata":{"result_type":"recent"},"to_user_id":3262306,"text":"@vquaiato Com certeza JQuery nasceu l\u00e1 nas terras altas, menininho precoce, j\u00e1 nasceu dan\u00e7ando a virilhada e dando append() nas menininhas!","id":15434727235,"from_user_id":52625408,"to_user":"vquaiato","geo":null,"iso_language_code":"pt","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;"},{"profile_image_url":"http://a1.twimg.com/profile_images/841262858/avatar_normal.png","created_at":"Fri, 04 Jun 2010 18:31:13 +0000","from_user":"xhino","metadata":{"result_type":"recent"},"to_user_id":null,"text":"bien jugando con jquery y la sentencia IF","id":15434687931,"from_user_id":1138651,"geo":null,"iso_language_code":"es","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;"},{"profile_image_url":"http://a1.twimg.com/profile_images/663976066/avatar_normal.jpg","created_at":"Fri, 04 Jun 2010 18:30:58 +0000","from_user":"heyweb","metadata":{"result_type":"recent"},"to_user_id":null,"text":"RT @jquery: Introducing Slippy - HTML Presentations (written with jQuery) - http://bit.ly/cuCgpy","id":15434674350,"from_user_id":93601062,"geo":null,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;"},{"profile_image_url":"http://a3.twimg.com/profile_images/508553933/logo_wielandwebworks_normal.gif","created_at":"Fri, 04 Jun 2010 18:30:57 +0000","from_user":"wielandwebworks","metadata":{"result_type":"recent"},"to_user_id":null,"text":"RT @jquery: Introducing Slippy - HTML Presentations (written with jQuery) - http://bit.ly/cuCgpy","id":15434673376,"from_user_id":39063191,"geo":null,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;"},{"profile_image_url":"http://a3.twimg.com/profile_images/282622825/logo2_normal.gif","created_at":"Fri, 04 Jun 2010 18:30:07 +0000","from_user":"UltraMegaTech","metadata":{"result_type":"recent"},"to_user_id":null,"text":"RT @jquery: YouTube Chromeless Video Player jQuery Plugin - http://bit.ly/bpA9Lr","id":15434627657,"from_user_id":19091836,"geo":null,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;"},{"profile_image_url":"http://a1.twimg.com/profile_images/938880572/daniel_oculos_peb_normal.jpg","created_at":"Fri, 04 Jun 2010 18:29:52 +0000","from_user":"danielmarins","metadata":{"result_type":"recent"},"to_user_id":null,"text":"RT @tiutalk: Galeria de fotos (slideshow) com jQuery - http://bit.ly/dbKDMF","id":15434612757,"from_user_id":28264975,"geo":null,"iso_language_code":"es","source":"&lt;a href=&quot;http://www.shareaholic.com&quot; rel=&quot;nofollow&quot;&gt;Shareaholic&lt;/a&gt;"},{"profile_image_url":"http://a1.twimg.com/profile_images/933696970/eu_normal.jpg","created_at":"Fri, 04 Jun 2010 18:29:51 +0000","from_user":"vquaiato","metadata":{"result_type":"recent"},"to_user_id":52625408,"text":"@stefanomartins eu diria mais, diria que o JQuery pe muito do transudo! \\o/","id":15434611599,"from_user_id":3262306,"to_user":"stefanomartins","geo":null,"iso_language_code":"pt","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;"},{"profile_image_url":"http://a3.twimg.com/profile_images/373647745/1470netlogo_normal.png","created_at":"Fri, 04 Jun 2010 18:28:12 +0000","from_user":"recenturl","metadata":{"result_type":"recent"},"to_user_id":null,"text":"http://bit.ly/bRkrRE iPhone\u5411\u3051\u6700\u9069\u5316Web\u30b5\u30a4\u30c8\u3092\u69cb\u7bc9\u3059\u308bjQuery\u30e9\u30a4\u30d6\u30e9\u30ea\u300cjQuery iPhone UI\u300d jQuery iPhone UI\u306fHTML/JavaScript\u88fd\u306e\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30fb\u30bd\u30d5\u30c8\u30a6\u30a7\u30a2\u3002iPhone\u7528\u306eWeb\u30b5\u30a4\u30c8..","id":15434525092,"from_user_id":49764546,"geo":null,"iso_language_code":"en","source":"&lt;a href=&quot;http://apiwiki.twitter.com/&quot; rel=&quot;nofollow&quot;&gt;API&lt;/a&gt;"},{"profile_image_url":"http://a3.twimg.com/profile_images/90410047/clouds2_normal.jpg","created_at":"Fri, 04 Jun 2010 18:27:43 +0000","from_user":"del_javascript","metadata":{"result_type":"recent"},"to_user_id":null,"text":"Lazy Load Plugin for jQuery http://ow.ly/17CmOD","id":15434498591,"from_user_id":6448146,"geo":null,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.hootsuite.com&quot; rel=&quot;nofollow&quot;&gt;HootSuite&lt;/a&gt;"},{"profile_image_url":"http://a1.twimg.com/profile_images/833499030/euu_normal.jpg","created_at":"Fri, 04 Jun 2010 18:27:37 +0000","from_user":"elionaimelo","metadata":{"result_type":"recent"},"to_user_id":null,"text":"25 jQuery Animation Effects Examples Tutorials  http://ht.ly/1Uepn (via @visionwidget)","id":15434492662,"from_user_id":32919316,"geo":null,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.hootsuite.com&quot; rel=&quot;nofollow&quot;&gt;HootSuite&lt;/a&gt;"},{"profile_image_url":"http://a3.twimg.com/profile_images/859747299/Dorking_Jobs_normal.PNG","created_at":"Fri, 04 Jun 2010 18:26:50 +0000","from_user":"Dorking_Jobs","metadata":{"result_type":"recent"},"to_user_id":null,"text":"Dorking Jobs: Senior PHP Developer \u2013 PHP / LAMP / MVC / AJAX / JQuery-Croydon, Croydon: PHP Developer \u2013 PHP /... http://bit.ly/biJaAi #Jobs","id":15434449939,"from_user_id":113383563,"geo":null,"iso_language_code":"en","source":"&lt;a href=&quot;http://twitterfeed.com&quot; rel=&quot;nofollow&quot;&gt;twitterfeed&lt;/a&gt;"},{"profile_image_url":"http://a1.twimg.com/profile_images/933696970/eu_normal.jpg","created_at":"Fri, 04 Jun 2010 18:26:41 +0000","from_user":"vquaiato","metadata":{"result_type":"recent"},"to_user_id":null,"text":"JQuery is AWESOME!  RT @stefanomartins: Uia, batutinha esse tal de JQuery, huh?","id":15434442124,"from_user_id":3262306,"geo":null,"iso_language_code":"pt","source":"&lt;a href=&quot;http://www.tweetdeck.com&quot; rel=&quot;nofollow&quot;&gt;TweetDeck&lt;/a&gt;"},{"profile_image_url":"http://a3.twimg.com/profile_images/56091349/haruhi_nagato-Y_normal.jpg","created_at":"Fri, 04 Jun 2010 18:25:43 +0000","from_user":"necocen","metadata":{"result_type":"recent"},"to_user_id":null,"text":"\u30e2\u30d0\u30a4\u30eb\u5411\u3051\u306eCSS\u3092\u66f8\u3044\u305f\u3002\u3064\u304e\u306fjQuery\u3067\u3069\u3046\u3053\u3046\u3059\u308b\u306e\u3068\u3001iPhone\u307f\u305f\u3044\u306a\u5974\u306b\u500b\u5225\u306b\u5bfe\u5fdc\u3059\u3079\u304d\u304b\u3092\u8003\u3048\u308b\u3053\u3068\u304c\u5fc5\u8981\u3060\u3002\u3057\u304b\u3057\u3082\u3046\u4e09\u6642\u534a\u304b\u3002\u3042\u3057\u305f\u306f\u5341\u6642\u306b\u306f\u8d77\u304d\u305f\u3044\u306e\u3060\u304c","id":15434389399,"from_user_id":12901,"geo":null,"iso_language_code":"ja","source":"&lt;a href=&quot;http://sourceforge.jp/projects/tween/wiki/FrontPage&quot; rel=&quot;nofollow&quot;&gt;Tween&lt;/a&gt;"},{"profile_image_url":"http://a1.twimg.com/profile_images/652989080/vcard_normal.png","created_at":"Fri, 04 Jun 2010 18:25:35 +0000","from_user":"Vcardengine","metadata":{"result_type":"recent"},"to_user_id":null,"text":"jQuery Apple's HTML5 Showcase Less About Web Standards, More About Apple - Webmonkey (blog) http://ow.ly/17CnJQ","id":15434381884,"from_user_id":92533281,"geo":null,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.hootsuite.com&quot; rel=&quot;nofollow&quot;&gt;HootSuite&lt;/a&gt;"}],"max_id":15434770525,"since_id":0,"refresh_url":"?since_id=15434770525&q=jquery","next_page":"?page=2&max_id=15434770525&q=jquery","results_per_page":15,"page":1,"completed_in":0.024288,"query":"jquery"};

describe("searching JSON from twitter", function() {
  var timeOutStatus = "timeout",
      notModifiedStatus = "notmodified";

  it("should handle twitter being down", function() {
    stubTwitterErrorResponse(timeOutStatus);
    $.twitter.search("blueprint");
    $("p.error:contains(" + timeOutStatus + ")").should(beOnPage);
  });

  it("should handle when twitter hasn't been modified", function() {
    stubTwitterErrorResponse(notModifiedStatus);
    $.twitter.search("blueprint");
    $("p.error:contains(" + notModifiedStatus + ")").shouldNot(beOnPage);
  });

  asyncIt("should get results back", function() {
    $.twitter.search('blueprint', function(data) {
      ok(data.results);
      start();
    });
  });
});

describe("$.twitter", function() {
  it("should be able to search", function() {
    (typeof $.twitter.search).should(eql, "function");
  });

  it("should be able to favorite tweets", function() {
    $.twitter.addFavorite("awesome");
    $.twitter.favorites().should(include, "awesome");
  });

  it("should use local storage for favorites", function() {
    $.twitter.addFavorite("awesome");
    JSON.parse(localStorage.favorites).should(eql, ["awesome"]);
  });
});

describe("tweetify", function() {
  it("should be a function", function() {
    (typeof $(".whatever").tweetify).should(eql, "function");
  });
});

describe("handling page content", function() {
  var setupTweetifyAndSearch = function() {
    stubTwitterSuccessResponse(successData);
    $(".workspace").tweetify();
    $(".workspace input.searchTerm").val("junk");
    $(".workspace input[type=submit]").trigger("click");
  };

  it("should display tweets within the tweetified element", function() {
    setupTweetifyAndSearch();
    $(".workspace .tweet").should(beOnPage, 15);
    $(".workspace .tweet:contains(YouTube Chromeless)").should(beOnPage);
  });

  it("should allow a user to star a tweet", function() {
    setupTweetifyAndSearch();
    $(".workspace .tweet:first").trigger("click");
    $.twitter.favorites().should(include, "RT @jquery: YouTube Chromeless Video Player jQuery Plugin - http://bit.ly/bpA9Lr");
  });
});
