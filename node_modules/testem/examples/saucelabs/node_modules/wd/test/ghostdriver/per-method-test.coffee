# mocha test

{desired, remoteWdConfig} = require './config'
{test} = require '../common/per-method-test-base'

describe "wd", ->
  describe "ghostdriver", ->
    describe "per method tests", ->
      
      describe "using ghostdriver", ->
        test remoteWdConfig, desired
      
