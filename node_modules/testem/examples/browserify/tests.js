var hello = require('./hello');
var assert = require('assert');

describe('hello', function(){
    it('should return hello', function(){
        assert.equal(hello(), 'hello world');
    });

    it('should say hello to subject', function(){
        assert.equal(hello('Bob'), 'hello Bob');
    });
});
