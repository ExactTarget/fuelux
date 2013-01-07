var matches = require('./matches_start')
require('chai').should()
describe('matchesBeginning', function(){
    it('should match globs', function(){
        matches('foo/', 'foo/*.js').should.be.ok
        matches('foo/', 'foo/bar/*.js').should.be.ok
        matches('foo/', 'bar/*.js').should.not.be.ok
        matches('foo/', 'foobar/*.js').should.not.be.ok
    })
    it('should match regexes', function(){
        matches('foo/', /foo\/.*\.js/).should.be.ok
        matches('foo/', /foo\/bar\/.*\.js/).should.be.ok
        matches('foo/', /bar\/.*\.js/).should.not.be.ok
        matches('foo/', /foobar\/.*\.js/).should.not.be.ok
        matches('foo/bar/', /foo\/[^\/]*\.js/).should.not.be.ok
    })
    it('should handle or expressions', function(){
        matches('abc', /(abc|def)/).should.be.ok
        matches('ghi', /(abc|def)/).should.not.be.ok
    })
})