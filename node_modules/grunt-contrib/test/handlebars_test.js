var grunt = require("grunt");

exports.handlebars = {
  main: function(test) {
    test.expect(1);

    var expectA = "this['JST'] = this['JST'] || {};\n\nthis['JST']['fixtures/handlebars/one.handlebar'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {\n  helpers = helpers || Handlebars.helpers;\n  var buffer = \"\", stack1, foundHelper, self=this, functionType=\"function\", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;\n\n\n  buffer += \"<p>Hello, my name is \";\n  foundHelper = helpers.name;\n  stack1 = foundHelper || depth0.name;\n  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }\n  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, \"name\", { hash: {} }); }\n  buffer += escapeExpression(stack1) + \".</p>\";\n  return buffer;});";
    var resultA = grunt.file.read("fixtures/output/handlebars.js");

    test.equal(expectA, resultA, "should compile handlebars template into JST");

    test.done();
  }
};