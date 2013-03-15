(function($) {
  $(document).bind("item-add.treeify", function(event, info) {
    var $ul = info.ul,
        $newLi = $("<li>").text(info.text);

    $ul.append($newLi);
    addRemoveLinkToLiCollection($newLi);
    $ul.find("input").remove();
    $(document).trigger("item-added.treeify", info);
  });

  $(document).bind("item-remove.treeify", function(event, info) {
    var $li = info.li;
    $li.remove();
    $(document).trigger("item-removed.treeify", info);
  });

  var addRemoveLinkToLiCollection = function(collection) {
    collection.append("<a href='#' class='remove'>-</a>");
  };

  $.fn.treeify = function() {
    return this.each(function() {
      $("a.add-item", this).live("click", function() {
        if(!$(this).parents("li").find("input.add-item").length) {
          $(this).parents("li").append("<input class='add-item' type='text'/>\
                                        <input class='create-button' type='submit' value='Create' />");
        }
      });

      $("a.remove", this).live("click", function() {
        var $li = $(this).parents("li");
        $(document).trigger("item-remove", {text: $li.text(), li: $li})
      });

      $("input.create-button", this).live("click", function(event) {
        var newLiText = $(this).siblings("input.add-item").val();
        $(document).trigger("item-add", {text: newLiText, ul: $(this).parents("ul")});
      });

      $(this)
        .addClass("treeified")
        .find("li:first")
          .before("<li class='item-manager'><a class='add-item'>Add an item</a></li>");

      addRemoveLinkToLiCollection($(this).find("li:not(.item-manager)"));
    });
  };
})(jQuery);
