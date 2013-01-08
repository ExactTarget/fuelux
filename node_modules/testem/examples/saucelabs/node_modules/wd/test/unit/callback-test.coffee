# mocha test


wd = require '../common/wd-with-cov'
nock = require 'nock'
should = require 'should'

describe "wd", ->
  describe "unit", ->
    describe "callback tests", ->
      server = null;
      
      before (done) ->
        server = nock('http://127.0.0.1:5555')
          .filteringRequestBody(/.*/, '*')
        unless process.env.WD_COV?
          server.log(console.log)
        # init
        server.post( '/wd/hub/session' , '*' ).reply 303, "OK", 
          'Location': '/wd/hub/session/1234'
        done null
        

      describe "simplecallback empty returns", ->
    
        browser = null
    
        describe "browser initialization", ->
          it "should initialize browser", (done) ->    
            browser = wd.remote({port:5555})
            browser.init {}, (err) ->
              should.not.exist err
              done null  
      
        describe "simplecallback with empty return", ->
          it "should get url", (done) ->    
            server.post( '/wd/hub/session/1234/url' , '*' ).reply 200, ""          
            browser.get "www.google.com", (err) ->
              should.not.exist err
              done null

        describe "simplecallback with 200 OK", ->
          it "should get url", (done) ->    
            server.post( '/wd/hub/session/1234/url' , '*' ).reply 200, "OK"          
            browser.get "www.google.com", (err) ->
              should.not.exist err
              done null
        
        describe "simplecallback with empty JSON data", ->
          it "should get url", (done) ->    
            server.post( '/wd/hub/session/1234/url' , '*' ).reply 200, '{"sessionId":"1234","status":0,"value":{}}'
            browser.get "www.google.com", (err) ->
              should.not.exist err
              done null
