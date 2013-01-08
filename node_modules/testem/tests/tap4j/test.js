describe('do a timeout', function(){

    it('times out', function(){
        waitsFor(function(){ return false })
    })
})