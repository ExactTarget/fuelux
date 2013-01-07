var libDir = '../../lib/'
var sandbox = require('sandboxed-module')
var expect = require('chai').expect
var screen = require('./fake_screen')
var ScrollableTextPanel = sandbox.require(libDir + 'ui/scrollable_text_panel', {
    requires: {
        './screen': screen
    }
})
var ErrorMessagesPanel = sandbox.require(libDir + 'ui/error_messages_panel', {
    requires: {
        './screen': screen
        , './scrollable_text_panel': ScrollableTextPanel
    }
})

describe('ErrorMessagesPanel', function(){
    var panel
    beforeEach(function(){
        screen.$setSize(12, 12)
        panel = new ErrorMessagesPanel({
            line: 1
            , col: 1
            , width: 10
            , height: 10
            , text: 'blah'
        })
    })
    it('initializes', function(){})

    it('renders', function(){
        panel.render()
        expect(screen.buffer).to.be.deep.equal([
            '┏━━━━━━━━━━┓',
            '┃blah      ┃',
            '┃          ┃',
            '┃          ┃',
            '┃          ┃',
            '┃          ┃',
            '┃          ┃',
            '┃          ┃',
            '┃          ┃',
            '┃          ┃',
            '┃          ┃',
            '┗━━━━━━━━━━┛' ])
    })
    it('wraps the text', function(){
        panel.set('text', "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?")
        panel.render()
        expect(screen.buffer).to.be.deep.equal([
            '┏━━━━━━━━━━┓',
            '┃Sed ut per┃',
            '┃spiciatis ┃',
            '┃unde omnis┃',
            '┃ iste natu┃',
            '┃s error si┃',
            '┃t voluptat┃',
            '┃em accusan┃',
            '┃tium dolor┃',
            '┃emque laud┃',
            '┃antium, to┃',
            '┗━━━━━━━━━━┛' ])
    })
    it('does not render if not visible', function(){
        screen.$setSize(12, 12)
        panel.set('visible', false)
        panel.render()
        expect(screen.buffer).to.be.deep.equal([ 
            '            ',
            '            ',
            '            ',
            '            ',
            '            ',
            '            ',
            '            ',
            '            ',
            '            ',
            '            ',
            '            ',
            '            ' ])
    })
})