describe('setTimeout', function(){
	for (var i = 0; i < 100; i++){
		it('should wait for some time (' + (i+1) + ')', function(){
			waits(50);
		});
	}
});