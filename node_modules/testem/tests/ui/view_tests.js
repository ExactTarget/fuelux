var expect = require('chai').expect
var sandbox = require('sandboxed-module')
var spy = require('sinon').spy
var View = sandbox.require('../../lib/ui/view', {
    requires: {
        './screen': {}
    }
})
var Backbone = require('backbone')

describe('view', function(){
    var view
    var MyView
    var model
    before(function(){
        model = new Backbone.Model
        MyView = View.extend({
            render: function(){}
        })
        view = new MyView()
    })
    
    it('can subclass', function(){})

    it('can observe and then destroy', function(){
        var onNameChange = spy()
        view.observe(model, 'change:name', onNameChange)
        model.set('name', 'Bob')
        expect(onNameChange.called).to.be.ok

        // destroy and remove handlers
        onNameChange.reset()
        view.destroy()
        model.set('name', 'Alice')
        expect(onNameChange.called).not.to.be.ok        
    })

    it('can use alternate observe syntax', function(){
        var onNameChange = spy()
        var onAgeChange = spy()
        view.observe(model, {
            'change:name': onNameChange
            , 'change:age': onAgeChange
        })
        model.set({name: 'Bob', age: 10})
        expect(onNameChange.called && onAgeChange.called).to.be.ok
        view.destroy()
        onNameChange.reset()
        onAgeChange.reset()
        model.set({name: 'Alice', age: 12})
        expect(onNameChange.called || onAgeChange.called).not.to.be.ok
    })

})