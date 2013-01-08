describe('hello', function(){
    it('should say hello world', function(){
        expect(hello()).toBe('hello world');
    });
    it('should say hello to person', function(){
        expect(hello('Bob')).toBe('hello Bob');
    });
});