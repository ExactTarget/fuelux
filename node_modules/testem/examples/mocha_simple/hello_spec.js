describe('hello', function(){
    it('should say hello', function(){
        expect(hello()).to.be('hello world');
    });
    it('should say hello to person', function(){
        expect(hello('Bob')).to.be('hello Bob');
    });
});