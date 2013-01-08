define(function(){
    function hello(name){
        return 'hello ' + (name || 'world');
    }
    return hello;
});