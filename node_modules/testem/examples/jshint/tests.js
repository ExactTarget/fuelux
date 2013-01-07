/*global equal:true, hello:true, test:true */
'use strict';

test('say hello world', function () {
    equal(hello(), 'hello world', 'should equal hello world');
});

test('say hello to person', function () {
    equal(hello('Bob'), 'hello Bob', 'should equal hello Bob');
});