should = require 'should'
try config = require './config' catch err 

exports.getRemoteWdConfig = ->
  should.exist config, \
    """
    Missing config!
    You need to copy config-sample.coffee to config.coffee,
    and then configure your sauce username and access-key in
    config.coffee
    """
  {
    host: "ondemand.saucelabs.com"
    port: 80
    username: config.saucelabs?.username
    accessKey: config.saucelabs?.accessKey    
  }
