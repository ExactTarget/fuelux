describe 'hello', ->
    it 'should say hello to person', ->
        expect(hello 'Bob').toBe 'hello Bob'

    it 'should say "hello world" if no provided', ->
        expect(hello()).toBe 'hello world'