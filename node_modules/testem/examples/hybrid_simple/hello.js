function hello(name){
    return 'hello ' + (name || 'world');
}


if (typeof module !== 'undefined' && module.exports){
    module.exports = hello;
}