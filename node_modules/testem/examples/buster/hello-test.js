buster.testCase("hello", {

    "says hello": function(){
        assert.equals(hello(), 'hello world');
    },

    "says hello to bob": function(){
        assert.equals(hello('bob'), 'hello bob');
    }

})