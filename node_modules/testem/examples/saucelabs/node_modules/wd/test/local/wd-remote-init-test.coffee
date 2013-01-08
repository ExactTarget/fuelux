# mocha test

should = require 'should'

wd = require '../common/wd-with-cov'

describe "wd", ->
  describe "local", ->
    describe "wd remote tests", ->
      
      describe "default", ->
        it "browser should be initialized with default parameters", (done) ->
          browser = wd.remote()
          browser.options.host.should.equal '127.0.0.1'
          browser.options.port.should.equal 4444
          browser.options.path.should.equal '/wd/hub/session'
          browser.basePath.should.equal '/wd/hub'
          should.not.exist browser.username 
          should.not.exist browser.accessKey
          done()
      
      describe "params", ->
        describe "host, port", ->
          it "browser should be initialized with given parameters", (done) ->
            browser = wd.remote('localhost', 8888)
            browser.options.host.should.equal 'localhost'
            browser.options.port.should.equal 8888
            browser.options.path.should.equal '/wd/hub/session'
            browser.basePath.should.equal '/wd/hub'
            should.not.exist browser.username 
            should.not.exist browser.accessKey        
            done null

        describe "host, port, username, accesskey", ->
          it "browser should be initialized with given parameters", (done) ->
            browser = wd.remote('localhost', 8888 , 'mickey', 'mouse' )
            browser.options.host.should.equal 'localhost'
            browser.options.port.should.equal 8888
            browser.options.path.should.equal '/wd/hub/session'
            browser.basePath.should.equal '/wd/hub'
            browser.username.should.equal 'mickey' 
            browser.accessKey.should.equal 'mouse'
            done null

    describe "options", ->
      describe "empty options", ->
        it "browser should be initialized with default", (done) ->
          browser = wd.remote( {} )
          browser.options.host.should.equal '127.0.0.1'
          browser.options.port.should.equal 4444
          browser.options.path.should.equal '/wd/hub/session'
          browser.basePath.should.equal '/wd/hub'
          should.not.exist browser.username 
          should.not.exist browser.accessKey
          done null

      describe "host, port", ->
        it "browser should be initialized with given options", (done) ->
          browser = wd.remote({host:'localhost', port:8888})
          browser.options.host.should.equal 'localhost'
          browser.options.port.should.equal 8888
          browser.options.path.should.equal '/wd/hub/session'
          browser.basePath.should.equal '/wd/hub'
          should.not.exist browser.username 
          should.not.exist browser.accessKey        
          done null

      describe "host, port, username, accesskey", ->
        it "browser should be initialized with given options", (done) ->
          browser = wd.remote({
            host:'localhost' 
            port:8888
            username:'mickey'
            accessKey:'mouse'        
          })
          browser.options.host.should.equal 'localhost'
          browser.options.port.should.equal 8888
          browser.options.path.should.equal '/wd/hub/session'
          browser.basePath.should.equal '/wd/hub'
          browser.username.should.equal 'mickey' 
          browser.accessKey.should.equal 'mouse'
          done null


      describe "path", ->
        it "browser should be initialized with given options", (done) ->
          browser = wd.remote( {path:'/taiwan'} )
          browser.options.host.should.equal '127.0.0.1'
          browser.options.port.should.equal 4444
          browser.options.path.should.equal '/taiwan/session'
          browser.basePath.should.equal '/taiwan'
          should.not.exist browser.username 
          should.not.exist browser.accessKey
          done null

      describe "host, port, path", ->
        it "browser should be initialized with given options", (done) ->
          browser = wd.remote({host:'localhost', port:8888, path:'/'})
          browser.options.host.should.equal 'localhost'
          browser.options.port.should.equal 8888
          browser.options.path.should.equal '/session'
          browser.basePath.should.equal '/'
          should.not.exist browser.username 
          should.not.exist browser.accessKey        
          done null
       
      describe "host, port, username, accesskey, path", ->
        it "browser should be initialized with given options", (done) ->
          browser = wd.remote({
            host:'localhost' 
            port:8888
            username:'mickey'
            accessKey:'mouse'        
            path:'/asia/taiwan'        
          })
          browser.options.host.should.equal 'localhost'
          browser.options.port.should.equal 8888
          browser.options.path.should.equal '/asia/taiwan/session'
          browser.basePath.should.equal '/asia/taiwan'
          browser.username.should.equal 'mickey' 
          browser.accessKey.should.equal 'mouse'
          done null

      



            