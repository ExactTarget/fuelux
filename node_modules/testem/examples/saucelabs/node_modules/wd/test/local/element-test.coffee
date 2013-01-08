# mocha test

{test} = require '../common/element-test-base'

describe "wd", ->
  describe "local", ->
    describe "element tests", ->

      describe "using chrome", ->  
        test {}, {browserName:'chrome'}
        
      describe "using firefox", ->  
        test {},{browserName:'firefox'}
                                   
