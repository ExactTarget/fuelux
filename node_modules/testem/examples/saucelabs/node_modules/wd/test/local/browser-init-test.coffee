# mocha test

should = require 'should'

wd = require '../common/wd-with-cov'

describe "wd", ->
  describe "local", ->
    describe "browser init tests", ->
      describe "default init", ->      
        it "should open firefox browser", (done) ->
          @timeout 15000
          browser = wd.remote()
          browser.defaultCapabilities.should.eql { 
            browserName: 'firefox',
            version: '',
            javascriptEnabled: true,
            platform: 'ANY' }
          browser.init (err) ->
            should.not.exist err
            browser.sessionCapabilities (err, capabilities) ->
              should.not.exist err
              capabilities.browserName.should.equal 'firefox'
              browser.quit (err) ->
                should.not.exist err
                done null
      
      describe "browser.defaultCapabilities", ->      
        it "should open chrome browser", (done) ->
          @timeout 15000
          browser = wd.remote()
          browser.defaultCapabilities.browserName = 'chrome'
          browser.defaultCapabilities.javascriptEnabled = false
          browser.defaultCapabilities.should.eql { 
            browserName: 'chrome',
            version: '',
            javascriptEnabled: false,
            platform: 'ANY',
          }
          browser.init (err) ->
            should.not.exist err
            browser.sessionCapabilities (err, capabilities) ->
              should.not.exist err
              capabilities.browserName.should.equal 'chrome'
              browser.quit (err) ->
                should.not.exist err
                done null
  
      describe "desired only", ->      
        it "should open chrome browser", (done) ->
          @timeout 15000
          browser = wd.remote()
          browser.defaultCapabilities.should.eql { 
            browserName: 'firefox',
            version: '',
            javascriptEnabled: true,
            platform: 'ANY' }
          browser.init {browserName: 'chrome'}, (err) ->
            should.not.exist err
            browser.sessionCapabilities (err, capabilities) ->
              should.not.exist err
              capabilities.browserName.should.equal 'chrome'
              browser.quit (err) ->
                should.not.exist err
                done null

      describe "desired overiding defaultCapabilities", ->      
        it "should open firefox browser", (done) ->
          @timeout 15000
          browser = wd.remote()
          browser.defaultCapabilities.browserName = 'chrome'
          browser.defaultCapabilities.should.eql { 
            browserName: 'chrome',
            version: '',
            javascriptEnabled: true,
            platform: 'ANY' }
          browser.init {browserName: 'firefox'}, (err) ->
            should.not.exist err
            browser.sessionCapabilities (err, capabilities) ->
              should.not.exist err
              capabilities.browserName.should.equal 'firefox'
              browser.quit (err) ->
                should.not.exist err
                done null
    
            