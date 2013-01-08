var sinon = require('sinon')
  , test = require('../../testutils.js')
  , expect = test.expect

describe('GetTermSize Lib', function(){
    var lib = require('../../../lib/gettermsize/lib.js')

    describe('getStdoutSize', function(){
        beforeEach(function(){
            this._getWindowSize = process.stdout.getWindowSize
        })
        afterEach(function(){
            process.stdout.getWindowSize = this._getWindowSize
        })
        it('returns getWindowSize if available', function(){
            process.stdout.getWindowSize = null
            var result = lib.getStdoutSize()
            expect(result).to.equal(null)
        })
        it('returns null otherwise', function(){
            process.stdout.getWindowSize = function(){ return [10, 20] }
            var result = lib.getStdoutSize()
            expect(result[0]).to.equal(10)
            expect(result[1]).to.equal(20)
        })
    })

    describe('getTtySize', function(){
        var tty = require('tty')

        beforeEach(function(){
            this._getWindowSize = tty.getWindowSize
        })
        afterEach(function(){
            tty.getWindowSize = this._getWindowSize
        })

        it('returns getWindowSize if available', function(){
            tty.getWindowSize = function(){ return [30, 40] }
            var result = lib.getTtySize()
            expect(result[0]).to.equal(30)
            expect(result[1]).to.equal(40)
        })
        it('returns null if the tty bug shows up', function(){
            tty.getWindowSize = function(){ return 80 }
            var result = lib.getTtySize()
            expect(result).to.equal(null)
        })
        it('returns null otherwise', function(){
            tty.getWindowSize = null
            var result = lib.getTtySize()
            expect(result).to.equal(null)
        })
    })
})

