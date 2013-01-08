if (typeof require !== 'undefined'){
    var hello = require('./hello');
    var expect = require('chai').expect;
}else{
    var expect = chai.expect;
}


describe('hello', function(){

    it('should say hello', function(){
        expect(hello()).to.equal('hello world');
    });

    it('should say hello to person', function(){
        expect(hello('Bob')).to.equal('hello Bob');
    });
    
});