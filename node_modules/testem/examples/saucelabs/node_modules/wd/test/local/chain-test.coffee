# mocha test

{test} = require '../common/chain-test-base'

describe "wd", ->
  describe "local", ->
    describe "chain tests", ->

      describe "using chrome", ->
        test 'chrome'

      describe "using firefox", ->
        test 'firefox'
      
