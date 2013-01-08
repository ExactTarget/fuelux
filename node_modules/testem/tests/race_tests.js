var race = require('../lib/race')
var expect = require('chai').expect

describe('race', function(){
    it('faster should win', function(done){
        var one, two
        race([
            function(finish){
                setTimeout(function(){
                    one = true
                    finish()
                }, 1)
            }
            , function(finish){
                setTimeout(function(){
                    two = true
                    finish()
                }, 10)
            }
        ], function(){
            expect(one).to.be.ok
            expect(two).not.to.be.ok
            done()
        })
    })
    it('should pass the results', function(done){
        race([
            function(finish){
                finish(1, 2)
            }
        ], function(one, two){
            expect(one).to.equal(1)
            expect(two).to.equal(2)
            done()
        })
    })
    it('second call should have no effect', function(done){
        var one, two
        var callCount = 0
        race([
            function(finish){
                setTimeout(function(){
                    finish(1)
                }, 1)
            }
            , function(finish){
                setTimeout(function(){
                    two = true
                    finish()
                }, 10)
            }
        ], function(result){
            callCount++
            
        })
        setTimeout(function(){
            expect(two).to.be.ok
            expect(callCount).to.equal(1)
            done()
        }, 20)
    })
})