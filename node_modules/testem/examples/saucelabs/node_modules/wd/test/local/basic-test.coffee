# mocha test

{test} = require '../common/basic-test-base'

describe "wd", ->
  describe "local", ->

    describe "basic test", ->
      
      describe "using chrome", ->
        test {}, {browserName:'chrome'}
      
      describe "using firefox", ->
        test {}, {browserName:'firefox'}
        
