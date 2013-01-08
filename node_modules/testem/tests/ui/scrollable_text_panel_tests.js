var expect = require('chai').expect
var sandbox = require('sandboxed-module')
var spy = require('sinon').spy
var libDir = '../../lib/'
var screen = require('./fake_screen')
var ScrollableTextPanel = sandbox.require(libDir + 'ui/scrollable_text_panel', {
    requires: {
        './screen': screen
    }
})

describe('ScrollableTextPanel', function(){
    
    var panel


    context('10x2 screen', function(){

        beforeEach(function(){
            screen.$setSize(10, 3)
            panel = new ScrollableTextPanel({
                line: 0
                , col: 0
                , width: 10
                , height: 2
            })
        })
        it('renders stuff', function(){
            panel.set('text', 'hello') // triggers render
            expect(panel.get('textLines')).to.deep.equal(['hello'])
            expect(screen.buffer[0]).to.equal('hello     ')
        })
        it('wraps text', function(){
            panel.set('text', 'hello there tommy')
            expect(screen.buffer[0]).to.equal('hello ther')
            expect(screen.buffer[1]).to.equal('e tommy   ')
        })
        it('does not render if not visible', function(){
            panel.set('visible', false)
            panel.set('text', 'hello')
            expect(screen.buffer).to.deep.equal([ '          ', '          ', '          ' ])
        })

        context('with paragraph text', function(){
            beforeEach(function(){
                panel.set('text', 'Charm objects pass along the data events from their input stream except for events generated from querying the terminal device.')
            })
            it('scrolls', function(){
                expect(screen.buffer[0]).to.equal('Charm obje')
                panel.scrollDown()
                expect(screen.buffer[0]).to.equal('cts pass a')
                panel.scrollUp()
                expect(screen.buffer[0]).to.equal('Charm obje')
            })
            it('pages up and down', function(){
                expect(screen.buffer).to.deep.equal([ 'Charm obje',
                    'cts pass a',
                    '          '])
                panel.pageDown()
                expect(screen.buffer).to.deep.equal([ 'long the d',
                    'ata events',
                    '          '])
                panel.pageUp()
                expect(screen.buffer).to.deep.equal([ 'Charm obje',
                    'cts pass a',
                    '          '])
            })
            it('half pages up and down', function(){
                panel.halfPageDown()
                expect(screen.buffer).to.deep.equal([ 'cts pass a', 'long the d', '          ' ])
                panel.halfPageUp()
                expect(screen.buffer).to.deep.equal([ 'Charm obje', 'cts pass a', '          '])
            })
            it('properly erases existing text', function(){
                panel.set('text', 'hello')
                
            })
        })

        

    })


    context('6x6 with 2 char padding', function(){
        beforeEach(function(){
            screen.$setSize(10, 10)
            panel = new ScrollableTextPanel({
                line: 2
                , col: 2
                , width: 6
                , height: 6
                , text: 'Charm objects pass along the data events from their input stream except for events generated from querying the terminal device.'
            })
        })

        it('writes and wraps correctly', function(){
            expect(screen.buffer).to.deep.equal([ 
                '          ',
                '          ',
                '  Charm   ',
                '  object  ',
                '  s pass  ',
                '   along  ',
                '   the d  ',
                '  ata ev  ',
                '          ',
                '          ' ])
        })
    })
})