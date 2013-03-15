var basicUl = "\
  <ul>\
    <li>Great</li>\
    <li>Awesome</li>\
    <li>Cool</li>\
  </ul>\
",
    setupBasicUl = function() {
      $("div.workspace")
        .append(basicUl)
        .find("ul").treeify();
    };

QUnit.testDone = function() { $("div.workspace").empty(); };

module("add an item to a basic list");
test("treeify creates a link to add an item", function() {
  setupBasicUl();

  ok($(".workspace ul li:first a:contains('Add an item')").length,
     "UL has a link to add an item as the first LI");
});

test("clicking 'Add an item' displays an input", function() {
  setupBasicUl();

  $(".workspace li a.add-item").trigger("click");

  ok($(".workspace li:first input.add-item").length,
     "should create an input.add-item");
});

test("clicking 'Add an item' multiple times only displays one input", function() {
  setupBasicUl();

  $(".workspace li a.add-item").trigger("click").trigger("click");

  equals($(".workspace li:first input.add-item").length, 1,
         "should create one input.add-item");
});

test("creating an item adds the item to the bottom of the list", function() {
  setupBasicUl();

  $(".workspace li a.add-item").trigger("click");
  $(".workspace input.add-item:first").val("here's a new item");
  $(".workspace input.create-button:first").trigger("click");

  ok($(".workspace ul li:last:contains(a new item)").length, "should add an item");
});

test("creating an item removes the input and submit from the LI", function() {
  setupBasicUl();

  $(".workspace li a.add-item").trigger("click");
  $(".workspace input.add-item:first").val("here's a new item");
  $(".workspace input.create-button:first").trigger("click");

  equals($(".workspace ul li input").length, 0, "should not contain any inputs");
});

test("creating an item should allow that item to be removed", function() {
  setupBasicUl();

  $(".workspace li a.add-item").trigger("click");
  $(".workspace input.add-item:first").val("here's a new item");
  $(".workspace input.create-button:first").trigger("click");

  equals($(".workspace ul li:last a.remove").length, 1, "should include a remove link");
});

module("remove an item from a basic list");
test("remove an existing LI", function() {
  setupBasicUl();
  var currentLiCount = $(".workspace li").length;

  $(".workspace li:last a.remove").trigger("click");

  equals($(".workspace li").length, currentLiCount - 1, "should modify number of LIs by 1")
  equals($(".workspace li:contains(Cool)").length, 0, "should not include last LI");
});
