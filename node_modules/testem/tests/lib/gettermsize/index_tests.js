var sinon = require('sinon')
  , assert = require('assert')

describe('GetTermSize Index', function(){
    var lib = require('../../../lib/gettermsize/lib.js')

    beforeEach(function(){
        this._getStdoutSize = lib.getStdoutSize
        this._getTtySize = lib.getTtySize
        this._getSpawnSize = lib.getSpawnSize
    })
    afterEach(function(){
        lib.getStdoutSize = this._getStdoutSize
        lib.getTtySize = this._getTtySize
        lib.getSpawnSize = this._getSpawnSize
    })

    it('uses size from stdout if available', function(){
        lib.getStdoutSize = function(){ return [10, 20] }

        var getTermSize = require('../../../lib/gettermsize/index.js')

        var spy = sinon.spy()
        getTermSize(spy)
        sinon.assert.calledWith(spy, 10, 20);
    })

    it('uses size from tty if available', function(){
        lib.getStdoutSize = function(){ return null }
        lib.getTtySize = function(){ return [30, 40] }
        var getTermSize = require('../../../lib/gettermsize/index.js')

        var spy = sinon.spy()
        getTermSize(spy)
        sinon.assert.calledWith(spy, 30, 40);
    })

    it('uses size from spawn trick otherwise', function(){
        lib.getStdoutSize = function(){ return null }
        lib.getTtySize = function(){ return null }
        var spy = sinon.spy()
        lib.getSpawnSize = spy

        var getTermSize = require('../../../lib/gettermsize/index.js')

        getTermSize()
        sinon.assert.calledWith(spy)
    })
});

