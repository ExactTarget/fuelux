# mocha test

{desired, remoteWdConfig} = require './config'
{test} = require '../common/element-test-base'

describe "wd", ->
  describe "ghostdriver", ->
    describe "element tests", ->

      describe "using ghostdriver", ->
        test remoteWdConfig, desired

