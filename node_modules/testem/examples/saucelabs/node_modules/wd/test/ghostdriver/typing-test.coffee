# mocha test

{desired, remoteWdConfig} = require './config'
{test} = require '../common/typing-test-base'

describe "wd", ->
  describe "ghostdriver", ->

    describe "typing test", ->
      
      describe "using chrome", ->
        test remoteWdConfig, desired
        
