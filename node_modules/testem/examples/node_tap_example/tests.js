var test = require('tap').test;
var hello = require('./hello');

test('it says hello world', function(t){
    t.equal(hello(), 'hello world');
    t.end();
});

test('it says hello to person', function(t){
    t.equal(hello('Bob'), 'hello Bob');
    t.end();
});