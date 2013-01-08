# mocha test

should = require 'should'
async = require 'async'

{Express} = require './express'

wd = require './wd-with-cov'

test = (remoteWdConfig, desired) ->  
  browser = null
  handles = {}
  browserName = desired?.browserName

  express = new Express

  before (done) ->
    express.start()
    done null
        
  after (done) ->
    express.stop()          
    done null
  
  describe "wd.remote", -> 
    it "should create browser", (done) ->   
      browser = wd.remote remoteWdConfig
      unless process.env.WD_COV?
        browser.on "status", (info) ->
          console.log "\u001b[36m%s\u001b[0m", info
        browser.on "command", (meth, path) ->
          console.log " > \u001b[33m%s\u001b[0m: %s", meth, path   
      done null
    
  describe "init", ->
    it "should initialize browserinit", (done) ->
      @timeout 30000
      browser.init desired, (err) ->
        should.not.exist err
        done null
  
  describe "opening first window", ->
    it "should open the first window", (done) ->
      @timeout 10000
      browser.get "http://127.0.0.1:8181/window-test-page.html?window_num=1", (err) ->
        should.not.exist err
        done null  
  
  describe "setting first window name", ->
    it "should set the window name", (done) ->
      browser.execute "window.name='window-1'", (err) ->
        should.not.exist err
        done null  

  describe "retrieving first window name", ->
    it "should be window-1", (done) ->
      browser.windowName (err, name) ->
        should.not.exist err
        name.should.equal 'window-1'
        done null  


  describe "retrieving first window handle", ->
    it "should retrieve handle", (done) ->
      browser.windowHandle (err, handle) ->
        should.not.exist err
        should.exist handle
        handle.length.should.be.above 0
        handles['window-1'] = handle
        done null  
           
  describe "opening second window", ->
    it "should open the second window", (done) ->
      @timeout 10000
      browser.newWindow 'http://127.0.0.1:8181/window-test-page.html?window_num=2','window-2', (err) ->
        should.not.exist err
        done null  
  
  describe "change focus to second window", ->
    it "should focus on second window", (done) ->
      browser.window 'window-2', (err) ->
        should.not.exist err
        browser.windowName (err, name) ->
          should.not.exist err
          name.should.equal 'window-2'
          done null  

  describe "retrieving second window handle", ->
    it "should retrieve handle", (done) ->
      browser.windowHandle (err, handle) ->
        should.not.exist err
        should.exist handle
        handle.length.should.be.above 0
        handle.should.not.equal handles['window-1']
        handles['window-2'] = handle        
        done null  

  describe "opening third window", ->
    it "should open the third window", (done) ->
      @timeout 10000
      browser.newWindow 'http://127.0.0.1:8181/window-test-page.html?window_num=3','window-3', (err) ->
        should.not.exist err
        done null  

  describe "change focus to third window", ->
    it "should focus on third window", (done) ->
      browser.window 'window-3', (err) ->
        should.not.exist err
        browser.windowName (err, name) ->
          should.not.exist err
          name.should.equal 'window-3'
          done null  

  describe "retrieving third window handle", ->
    it "should retrieve handle", (done) ->
      browser.windowHandle (err, handle) ->
        should.not.exist err
        should.exist handle
        handle.length.should.be.above 0
        handle.should.not.equal handles['window-1']
        handle.should.not.equal handles['window-2']
        handles['window-3'] = handle        
        done null  
  
  
  describe "windowHandles", ->
    it "should retrieve 2 window handles", (done) ->
      browser.windowHandles (err, _handles) ->
        should.not.exist err
        _handles.should.have.length 3
        for k,v in handles
          _handles.should.include v
        done null  

  describe "change focus to second window using window handle", ->
    it "should focus on second window", (done) ->
      browser.window handles['window-2'], (err) ->
        should.not.exist err
        browser.windowName (err, name) ->
          should.not.exist err
          name.should.equal 'window-2'
          done null      

  describe "closing second window", ->
    it "should close the second window", (done) ->
      browser.close (err) ->
        should.not.exist err
        browser.windowHandles (err, _handles) ->
          should.not.exist err
          _handles.should.have.length 2
          done null

  describe "change focus to third window", ->
    it "should focus on third window", (done) ->
      browser.window 'window-3', (err) ->
        should.not.exist err
        browser.windowName (err, name) ->
          should.not.exist err
          name.should.equal 'window-3'
          done null  

  describe "closing third window", ->
    it "should close the third window", (done) ->
      browser.close (err) ->
        should.not.exist err
        browser.windowHandles (err, _handles) ->
          should.not.exist err
          _handles.should.have.length 1
          done null

  describe "change focus to first window", ->
    it "should focus on first window", (done) ->
      browser.window 'window-1', (err) ->
        should.not.exist err
        browser.windowName (err, name) ->
          should.not.exist err
          name.should.equal 'window-1'
          done null  
  
  describe "opening window with no name", ->
    it "should open the third window", (done) ->
      @timeout 10000
      browser.newWindow 'http://127.0.0.1:8181/window-test-page.html?window_num=4', (err) ->
        should.not.exist err
        done null  
  
  describe "focusing on window with no name handle", ->
    it "last handle should correspond to latest opened window", (done) ->  
      browser.windowHandles (err, _handles) ->
        should.not.exist err
        _handles.should.have.length 2
        browser.window _handles[1], (err) ->
          should.not.exist err
          browser.url (err, url) ->
            url.should.include "num=4"
            done null  

  describe "closing window with no name", ->
    it "should close the window with no name", (done) ->
      browser.close (err) ->
        should.not.exist err
        browser.windowHandles (err, _handles) ->
          should.not.exist err
          _handles.should.have.length 1
          done null
  
  describe "change focus to first window", ->
    it "should focus on first window", (done) ->
      browser.window 'window-1', (err) ->
        should.not.exist err
        browser.windowName (err, name) ->
          should.not.exist err
          name.should.equal 'window-1'
          done null  
  
  describe "opening frame test page", ->
    it "should open the first window", (done) ->
      @timeout 10000
      browser.get "http://127.0.0.1:8181/frames/index.html", (err) ->
        should.not.exist err
        done null  

  frames = []
  
  describe "looking for frame elements", ->
    it "should find frame elements", (done) ->      
      browser.elementsByTagName  'frame', (err, _frames) ->
        should.not.exist err
        _frames.should.have.length 3
        async.forEachSeries _frames, (frame, done) ->
          frameInfo = {el:frame.toString()}
          async.series [            
            (done) ->
              frame.getAttribute 'name', (err, name) ->
                should.not.exist err
                frameInfo.name = name                
                done null 
            (done) ->
              frame.getAttribute 'id', (err, id) ->
                should.not.exist err
                frameInfo.id = id
                done null             
          ], (err) ->
            should.not.exist err
            frames.push frameInfo
            done null
        , (err) ->
          should.not.exist err
          frames.should.have.length 3
          (i.name for i in frames).should.eql ['menu','main','bottom']
          done null
  
  refreshPage = ->      
    # selenium is very buggy, so having to refresh between each
    # frame switch
    describe "refreshing page", ->    
      it "should refresh the page", (done) ->      
        browser.refresh (err) ->
          should.not.exist err
          done null

  describe "selecting default frame", ->    
     it "should select frame menu", (done) ->      
       browser.frame (err) ->
         should.not.exist err
         done null
       
   refreshPage();  
  
   describe "selecting frame by number", ->    
     it "should select frame menu", (done) ->      
       browser.frame 0, (err) ->
         should.not.exist err
         done null
         
   refreshPage();
   unless browserName is 'chrome'
     describe "selecting frame by id", ->    
       it "should select frame main", (done) ->      
         browser.frame frames[1].id, (err) ->
           should.not.exist err
           done null

   refreshPage();
   
   unless browserName is 'chrome'
     describe "selecting frame by name", ->    
       it "should select frame main", (done) ->      
         browser.frame frames[2].name, (err) ->
           should.not.exist err
           done null
  
  describe "quit", ->  
    it "should destroy browser", (done) ->
      browser.quit (err) ->
        should.not.exist err
        done null

exports.test = test
  
