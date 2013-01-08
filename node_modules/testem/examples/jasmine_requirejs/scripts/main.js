require(
['specs/hello_spec'], 
function(){
    var env = jasmine.getEnv();
    env.addReporter(new jasmine.HtmlReporter);
    env.execute();
});