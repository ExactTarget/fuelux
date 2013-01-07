# mocha test

{test} = require '../common/typing-test-base'

describe "wd", ->
  describe "local", ->

    describe "typing test", ->
      
      describe "using chrome", ->  
        test {}, {browserName:'chrome'}
        
      describe "using firefox", ->  
        test {},{browserName:'firefox'}
                                     
