# mocha test

{test} = require '../common/window-frame-test-base'

describe "wd", ->
  describe "local", ->

    describe "window frame test", ->
      
      describe "using chrome", ->  
        test {}, {browserName:'chrome'}
        
      describe "using firefox", ->  
        test {},{browserName:'firefox'}
                                     
