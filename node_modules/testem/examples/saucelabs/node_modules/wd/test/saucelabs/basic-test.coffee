# mocha test

{test} = require '../common/basic-test-base'
configHelper = require './config-helper' 

remoteWdConfig= configHelper.getRemoteWdConfig()

nameBase = "saucelabs basic test - ";

chromeDesired =
  name: nameBase + 'chrome' 
  browserName:'chrome'
  
firefoxDesired =
  name: nameBase + 'firefox' 
  browserName:'firefox'

explorerDesired =
  name: nameBase + 'explorer' 
  browserName:'iexplore' 
  version:'9'
  platform:'Windows 2008'
  
describe "wd", ->
  describe "saucelabs", ->
    describe "basic tests", ->
    
      describe "using chrome", ->
        test remoteWdConfig , chromeDesired
    
      describe "using firefox", ->
        test remoteWdConfig , firefoxDesired
    
      describe "using explorer", ->
        test remoteWdConfig , explorerDesired

