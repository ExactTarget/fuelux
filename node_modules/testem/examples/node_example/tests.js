var assert = require('assert');
var hello = require('./hello');

describe('hello', function(){
    it('says hello world', function(){
        assert.equal(hello(), 'hello world');
    });
    it('says hello to person', function(){
        assert.equal(hello('Bob'), 'hello Bob');
    });
});