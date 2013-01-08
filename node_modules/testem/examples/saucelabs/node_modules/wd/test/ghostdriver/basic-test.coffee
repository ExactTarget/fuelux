# mocha test

{desired, remoteWdConfig} = require './config'
{test} = require '../common/basic-test-base'

describe "wd", ->
  describe "ghostdriver", ->

    describe "basic test", ->
      
      describe "using ghostdriver", ->
        test remoteWdConfig, desired
      
        
