expect = require('chai').expect
hello = require '../src/hello'

describe 'hello', ->
    it 'says hello', ->
        expect(hello()).to.equal 'hello world'

    it 'says hello to person', ->
        expect(hello('bob')).to.equal 'hello bob'
