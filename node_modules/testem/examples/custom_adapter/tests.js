/*global test, assert, hello*/

test('say hello', function() {
    assert(hello() === 'hello world', 'should equal hello world');
});

test('says hello to person', function() {
    assert(hello('Bob') === 'hello Bob', 'should equal hello Bob');
});