describe('hello', function(){
    it('should say hello', function(){
        expect(hello()).toBe('hello world');
    });
    it('should say hello to person', function(){
        expect(hello('Bob')).toBe('hello Bob')
    });
});