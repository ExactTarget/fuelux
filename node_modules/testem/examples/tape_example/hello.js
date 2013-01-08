module.exports = hello;
function hello(name){
    return 'hello ' + (name || 'world');
}