var expect = require('chai').expect
var spy = require('sinon').spy
var screen = require('./fake_screen')

describe('FakeScreen', function(){
    beforeEach(function(){
        screen.$setSize(10, 10)
    })
    it('has initially', function(){
        expect(screen.buffer).to.deep.equal(
            [ '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ' ])
    })
    it('does stuff', function(){
        screen.position(0, 1)
        screen.write('hello')
        expect(screen.buffer[0]).to.equal('hello     ')
        screen.position(5, 1)
        screen.write('world')
        expect(screen.buffer[0]).to.equal('helloworld')
    })
    it('moves cursor when write', function(){
        screen.position(0, 1)
        screen.write('hello').write('world')
        expect(screen.buffer[0]).to.equal('helloworld')
    })
    it('does colors but has no effect', function(){
        screen.foreground('red')
        screen.background('black')
        screen.position(3, 1)
        screen.write('hello')
        screen.display('reset')
        expect(screen.buffer[0]).to.equal('   hello  ')
    })
    it('erases to end', function(){
        screen.position(0, 1)
        screen.write('helloworld')
        screen.position(5, 1)
        screen.erase('end')
        expect(screen.buffer[0]).to.equal('hello     ')
    })
    it('throws if drawing out of bounds vertically', function(){
        screen.position(11, 0)
        expect(function(){ screen.write('hello') }).to.throw(/out of bounds/)
        expect(screen.buffer).to.deep.equal([ 
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ' ])
    })
    it('throws if drawing out of bounds horizontally', function(){
        screen.position(0, 1)
        expect(function(){ screen.write('hello world') }).to.throw(/out of bounds/)
        expect(screen.buffer).to.deep.equal([ 
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ',
            '          ' ])
    })

    context('has 3 lines of text', function(){
        beforeEach(function(){
            screen.position(0, 1)
            screen.write('hello')
            screen.position(0, 2)
            screen.write('there')
            screen.position(0, 3)
            screen.write('world')
        })
        it('gives lines', function(){
            expect(screen.$lines(3)).to.deep.equal(['hello     ', 'there     ', 'world     '])
        })
        it('gives lines (start, end)', function(){
            expect(screen.$lines(1, 3)).to.deep.equal(['there     ', 'world     '])
        })
    })
})