# mocha test

{desired, remoteWdConfig} = require './config'
{test} = require '../common/window-frame-test-base'

describe "wd", ->
  describe "ghostdriver", ->

    describe "window frame test", ->
      
      describe "using ghostdriver", ->
        test remoteWdConfig, desired
        
