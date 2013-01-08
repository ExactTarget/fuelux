var catchem = require('../lib/catchem')

var expect = require('chai').expect
var spy = require('sinon').spy

describe('catchem', function(){
    
    it('should return a function', function(){
        var f = function(){}.catchem()
        expect(typeof f).to.equal('function')
    })
    it('should call original function', function(){
        var called 
        var f = function(){
            called = true
        }.catchem()
        f()
        expect(called).to.be.ok
    })
    it('should call original with the right params and return the right output', function(){
        var args
        var f = function(){
            args = arguments
            return 'xxx'
        }.catchem()
        expect(f(1,2)).to.equal('xxx')
        expect(Array.prototype.slice.apply(args)).to.deep.equal([1,2])
    })

    it('should catch errors thrown from the original function', function(){
        var f = function(){
            throw new Error('bah')
        }.catchem()
        expect(f).not.to.throw()
    })
    
    it('should allow registering an error handler', function(){
        var onError = spy()
        var error
        catchem.on('err', onError)
        var f = function(){
            error = new Error('bah')
            throw error
        }.catchem()
        f()
        expect(onError.calledWith(error)).to.be.ok
        catchem.removeAllListeners()
    })

})