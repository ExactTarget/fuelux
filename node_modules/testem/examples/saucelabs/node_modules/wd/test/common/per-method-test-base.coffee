# mocha test

CoffeeScript = require 'coffee-script'

should = require 'should'
async = require 'async'      
imageinfo = require 'imageinfo'

{Express} = require './express'

wd = require './wd-with-cov'

TIMEOUT_BASE = 1000
TIMEOUT_BASE = 250 if process.env.GHOSTDRIVER_TEST?

evalShouldEqual = (browser,formula,expected) ->  
  (done) ->  browser.eval formula, (err,res) ->
    should.not.exist err
    res.should.equal expected
    done(null)      

safeEvalShouldEqual = (browser,formula,expected) ->  
  (done) ->  browser.safeEval formula, (err,res) ->
    should.not.exist err
    res.should.equal expected
    done(null)      

executeCoffee = (browser, script) ->  
  scriptAsJs = CoffeeScript.compile script, bare:'on'      
  (done) ->  browser.execute scriptAsJs, (err) ->
    should.not.exist err
    done(null)      

elementByCss = (browser,env,css,name) ->
  (done) -> browser.elementByCss css, (err, res) ->
    should.not.exist err
    env[name] = res
    done null     

textShouldEqual = (browser,element,expected, done) ->  
  browser.text element, (err,res) ->
    should.not.exist err
    res.should.equal expected
    done null

valueShouldEqual = (browser,element,expected, done) ->  
  browser.getValue element, (err,res) ->
    should.not.exist err
    res.should.equal expected
    done null      
    
test = (remoteWdConfig, desired) -> 
  
  browser = null;  
  
  express = new Express
  
  before (done) ->
    express.start()
    done null
      
  after (done) ->
    express.stop()          
    done null

  elementFunctionTests = () ->

    describe "element", ->
      it "should retrieve element", (done) ->
        async.series [
          (done) ->
            browser.element "name", "elementByName", (err,res) ->
              should.not.exist err
              should.exist res
              done null
          (done) ->
            browser.element "name", "elementByName2", (err,res) ->
              should.exist err
              err.status.should.equal 7
              done null
        ], (err) ->
          should.not.exist err
          done null   

    describe "elementOrNull", ->
      it "should retrieve element or return null", (done) ->
        async.series [
          (done) ->
            browser.elementOrNull "name", "elementByName", (err,res) ->
              should.not.exist err
              should.exist res
              done null
          (done) ->
            browser.elementOrNull "name", "elementByName2", (err,res) ->
              should.not.exist err
              (res is null).should.be.true
              done null
        ], (err) ->
          should.not.exist err
          done null      
    
    describe "elementIfExists", ->
      it "should retrieve element or return undefined", (done) ->
        async.series [
          (done) ->
            browser.elementIfExists "name", "elementByName", (err,res) ->
              should.not.exist err
              should.exist res
              done null
          (done) ->
            browser.elementIfExists "name", "elementByName2", (err,res) ->
              should.not.exist err
              (res is undefined).should.be.true
              done null
        ], (err) ->
          should.not.exist err
          done null      
    
    describe "hasElement", ->
      it "should check if element exist", (done) ->
        async.series [
          (done) ->
            browser.hasElement "name", "elementByName", (err,res) ->
              should.not.exist err
              res.should.be.true
              done null
          (done) ->
            browser.hasElement "name", "elementByName2", (err,res) ->
              should.not.exist err
              res.should.be.false
              done null
        ], (err) ->
          should.not.exist err
          done null        
    
    describe "waitForElement", ->
      it "should wait for element", (done) ->
        @timeout 10000
        async.series [        
          executeCoffee browser,   
            """
              setTimeout ->
                $('#waitForElement').append '<div class="child">a waitForElement child</div>'
              , #{0.75*TIMEOUT_BASE}
            """  
          (done) ->
            browser.elementByCss "#waitForElement .child", (err,res) ->            
              should.exist err
              err.status.should.equal 7
              done(null)
          (done) ->
            browser.waitForElement "css selector", "#waitForElement .child", 2*TIMEOUT_BASE, (err) ->            
              should.not.exist err
              done(err)
          (done) ->
            browser.waitForElement "css selector", "#wrongsel .child", 2*TIMEOUT_BASE, (err) ->            
              should.exist err
              done(null)            
        ], (err) ->
          should.not.exist err
          done null
    
    describe "waitForVisible", ->
      it "should wait until element is visible", (done) ->
        @timeout 10000
        async.series [        
          executeCoffee browser,   
            """
              $('#waitForVisible').append '<div class="child">a waitForVisible child</div>'              
              $('#waitForVisible .child').hide()
              setTimeout ->
                $('#waitForVisible .child').show()
              , #{0.75*TIMEOUT_BASE}
            """  
          (done) ->
            browser.elementByCss "#waitForVisible .child", (err,res) ->            
              should.not.exist
              done(null)
          (done) ->
            browser.waitForVisible "css selector", "#waitForVisible .child", 2*TIMEOUT_BASE, (err) ->            
              should.not.exist err
              done(err)
          (done) ->
            browser.waitForVisible "css selector", "#wrongsel .child", 2*TIMEOUT_BASE, (err) ->            
              should.exist err
              done(null)            
        ], (err) ->
          should.not.exist err
          done null
    
    describe "elements", ->
      it "should retrieve several elements", (done) ->
        async.series [
          (done) ->
            browser.elements "name", "elementsByName", (err,res) ->
              should.not.exist err
              res.should.have.length 3
              done null
          (done) ->
            browser.elements "name", "elementsByName2", (err,res) ->
              should.not.exist err
              res.should.eql []
              done null
        ], (err) ->
          should.not.exist err
          done null        
    
    for _funcSuffix in [
      'ByClassName'
      , 'ByCssSelector' 
      , 'ById'
      , 'ByName' 
      , 'ByLinkText'
      , 'ByPartialLinkText'
      , 'ByTagName' 
      , 'ByXPath' 
      , 'ByCss'
    ]     
      do ->
        funcSuffix = _funcSuffix
        elementFuncName = 'element' + funcSuffix
        hasElementFuncName = 'hasElement' + funcSuffix
        elementsFuncName = 'elements' + funcSuffix
        waitForElementFuncName = 'waitForElement' + funcSuffix
        waitForVisibleFuncName = 'waitForVisible' + funcSuffix
        
        searchText = elementFuncName;
        searchText = "click #{searchText}" if searchText.match /ByLinkText/
        searchText = ".#{searchText}" if searchText.match /ByCss/
        searchText = "//div[@id='elementByXPath']/input" if searchText.match /ByXPath/
        searchText = "span" if searchText.match /ByTagName/
          
        searchText2 = searchText + '2';
        searchText2 = "//div[@id='elementByXPath2']/input" if searchText.match /ByXPath/
        searchText2 = "span2" if searchText.match /ByTagName/
        
        searchSeveralText = searchText.replace('element','elements') 
        searchSeveralText2 = searchText2.replace('element','elements') 
            
        
        
        describe elementFuncName, ->
          it "should retrieve element", (done) ->
            async.series [
              (done) ->
                browser[elementFuncName] searchText, (err,res) ->
                  should.not.exist err
                  should.exist res
                  done null
              (done) ->
                browser[elementFuncName] searchText2  , (err,res) ->
                  should.exist err
                  err.status.should.equal 7
                  done null
            ], (err) ->
              should.not.exist err
              done null        
        
        describe  "#{elementFuncName}OrNull", ->
          it "should retrieve element or null", (done) ->
            async.series [
              (done) ->
                browser[elementFuncName + 'OrNull'] searchText, (err,res) ->
                  should.not.exist err
                  should.exist res
                  done null
              (done) ->
                browser[elementFuncName + 'OrNull'] searchText2  , (err,res) ->
                  should.not.exist err
                  (res is null).should.be.true
                  done null
            ], (err) ->
              should.not.exist err
              done null        
        
        describe  "#{elementFuncName}IfExists", ->
          it "should retrieve element or undefined", (done) ->
            async.series [
              (done) ->
                browser[elementFuncName + 'IfExists'] searchText, (err,res) ->
                  should.not.exist err
                  should.exist res
                  done null
              (done) ->
                browser[elementFuncName + 'IfExists'] searchText2  , (err,res) ->
                  should.not.exist err
                  (res is undefined).should.be.true
                  done null
            ], (err) ->
              should.not.exist err
              done null        
                      
        describe  hasElementFuncName, ->
          it "should check if element exists", (done) ->
            async.series [
              (done) ->
                browser[hasElementFuncName] searchText, (err,res) ->
                  should.not.exist err
                  res.should.be.true
                  done null
              (done) ->
                browser[hasElementFuncName] searchText2  , (err,res) ->
                  should.not.exist err
                  res.should.be.false
                  done null
            ], (err) ->
              should.not.exist err
              done null  
          
        describe waitForElementFuncName, ->
          it "should wait for element (#{funcSuffix})", (done) ->
            @timeout 10000
            
            childHtml = "<div class='child child_#{waitForElementFuncName }'>a #{waitForElementFuncName } child</div>"          
            if funcSuffix.match /ById/
              childHtml = "<div class='child' id='child_#{waitForElementFuncName }'>a #{waitForElementFuncName } child</div>"          
            if funcSuffix.match /ByName/
              childHtml = "<div class='child' name='child_#{waitForElementFuncName }'>a #{waitForElementFuncName } child</div>"          
            if funcSuffix.match /ByLinkText/
              childHtml = "<a class='child'>child_#{waitForElementFuncName }</a>"          
            if funcSuffix.match /ByPartialLinkText/
              childHtml = "<a class='child'>hello child_#{waitForElementFuncName }</a>"          
            if funcSuffix.match /ByTagName/
              childHtml = "<hr class='child'>"          
                              
            searchChild = "child_#{waitForElementFuncName }"
            searchChild = ".#{searchChild}" if funcSuffix.match /ByCss/
            searchChild = "hr" if funcSuffix.match /ByTagName/
            searchChild = "//div[@class='child child_#{waitForElementFuncName}']" if funcSuffix.match /ByXPath/         
          
            async.series [                                        
              executeCoffee browser,   
                """
                  $('hr').remove()                
                  setTimeout ->
                    $('##{waitForElementFuncName}').append "#{childHtml}"
                  , #{0.75*TIMEOUT_BASE}
                """                  
              (done) ->
                browser[elementFuncName] searchChild, (err,res) ->            
                  should.exist err
                  err.status.should.equal 7
                  done(null)                    
              (done) ->
                browser[waitForElementFuncName] searchChild, 2*TIMEOUT_BASE, (err) ->            
                  should.not.exist err
                  done(err)
              (done) ->
                if funcSuffix is 'ByClassName'                
                  browser[waitForElementFuncName] "__wrongsel", 2*TIMEOUT_BASE, (err) ->            
                    should.exist err
                    done(null)
                else
                  done(null)
            ], (err) ->
              should.not.exist err
              done null
        
        describe waitForVisibleFuncName, ->
          it "should wait until element is visible", (done) ->
            @timeout 10000
              
            childHtml = "<div class='child child_#{waitForVisibleFuncName}'>a #{waitForVisibleFuncName} child</div>"          
            if funcSuffix.match /ById/
              childHtml = "<div class='child' id='child_#{waitForVisibleFuncName}'>a #{waitForVisibleFuncName} child</div>"          
            if funcSuffix.match /ByName/
              childHtml = "<div class='child' name='child_#{waitForVisibleFuncName}'>a #{waitForVisibleFuncName} child</div>"          
            if funcSuffix.match /ByLinkText/
              childHtml = "<a class='child'>child_#{waitForVisibleFuncName}</a>"          
            if funcSuffix.match /ByPartialLinkText/
              childHtml = "<a class='child'>hello child_#{waitForVisibleFuncName}</a>"          
            if funcSuffix.match /ByTagName/
              childHtml = "<hr class='child'>"          
                              
            searchChild = "child_#{waitForVisibleFuncName}"
            searchChild = ".#{searchChild}" if funcSuffix.match /ByCss/
            searchChild = "hr" if funcSuffix.match /ByTagName/
            searchChild = "//div[@class='child child_#{waitForVisibleFuncName}']" if funcSuffix.match /ByXPath/         
              
            async.series [                                        
              executeCoffee browser,   
                """
                  $('hr').remove()
                  $('##{waitForVisibleFuncName}').append "#{childHtml}"
                  $('##{waitForVisibleFuncName} .child').hide()
                  setTimeout ->
                    $('##{waitForVisibleFuncName} .child').show()
                  , #{0.75*TIMEOUT_BASE}
                """                  
              (done) ->
                unless funcSuffix in ['ByLinkText','ByPartialLinkText']
                  browser[elementFuncName] searchChild, (err,res) ->            
                    should.not.exist err
                    done(null)  
                else
                  done(null)     
              (done) ->
                browser[waitForVisibleFuncName] searchChild, 2*TIMEOUT_BASE, (err) ->            
                  should.not.exist err
                  done(err)
              (done) ->
                if funcSuffix is 'ByClassName'                              
                  browser[waitForVisibleFuncName] "__wrongsel", 2*TIMEOUT_BASE, (err) ->            
                    should.exist err
                    done(null)
                else
                  done(null)
            ], (err) ->
              should.not.exist err
              done null
        
        describe  elementsFuncName, ->
          it "should retrieve several elements", (done) ->
            async.series [
              (done) ->
                browser[elementsFuncName] searchSeveralText, (err,res) ->
                  should.not.exist err
                  if (elementsFuncName.match /ById/)
                    res.should.have.length 1
                  else if (elementsFuncName.match /ByTagName/)
                    (res.length > 1).should.be.true
                  else
                    res.should.have.length 3
                  done null
              (done) ->
                browser[elementsFuncName] searchSeveralText2, (err,res) ->
                  should.not.exist err
                  res.should.eql []
                  done null
            ], (err) ->
              should.not.exist err
              done null                      
         
  describe "wd.remote<COMP>", ->
    it "should create browser object", (done) ->
      browser = wd.remote remoteWdConfig
      unless process.env.WD_COV?
        browser.on "status", (info) ->
          console.log "\u001b[36m%s\u001b[0m", info
        browser.on "command", (meth, path) ->
          console.log " > \u001b[33m%s\u001b[0m: %s", meth, path
      done null

  describe "status", ->    
    it "should retrieve selenium server status", (done) ->
      browser.status (err,status) ->        
        should.not.exist err
        should.exist status
        done null
  
  describe "sessions", ->
    it "should retrieve selenium server sessions", (done) ->
      browser.sessions (err,sessions) ->        
        should.not.exist err
        should.exist sessions
        done null
  
  describe "init<COMP>", ->
    it "should initialize browser and open browser window", (done)  ->
      @timeout 20000
      browser.init desired, (err) ->
        should.not.exist err
        done null

  describe "sessionCapabilities", ->
    it "should retrieve the session capabilities", (done) ->
      browser.sessionCapabilities (err,capabilities) ->
        should.not.exist err
        should.exist capabilities
        should.exist capabilities.browserName
        should.exist capabilities.platform
        done null
  
        
  describe "altSessionCapabilities", ->
    it "should retrieve the session capabilities using alt method", (done) ->
      browser.altSessionCapabilities (err,capabilities) ->
        should.not.exist err
        should.exist capabilities
        should.exist capabilities.browserName
        should.exist capabilities.platform
        done null
  
  describe "get<COMP>", ->
    it "should navigate to the test page", (done)  ->
      @timeout 20000
      browser.get "http://127.0.0.1:8181/test-page.html", (err) ->
        should.not.exist err
        done null
  
  # would do with better test, but can't be bothered
  
  unless desired?.browserName is 'chrome'
    # not working on chrome
    describe "setPageLoadTimeout", ->
      it "should set the page load timeout, test get, and unset it", (done) ->
        @timeout 10000
        async.series [
          (done) -> 
            browser.setPageLoadTimeout TIMEOUT_BASE/2, (err) ->
              should.not.exist err
              done null
          (done) -> 
            browser.setPageLoadTimeout TIMEOUT_BASE/2, (err) ->
              should.not.exist err
              done null
          (done) -> 
            # testing get
            browser.get "http://127.0.0.1:8181/test-page.html", (err) ->
              should.not.exist err
              done null
          (done) -> 
            # not working on chrome
            defaultTimeout = if desired?.browserName is 'firefox' -1 else 10000
            browser.setPageLoadTimeout defaultTimeout, (err) ->
              should.not.exist err
              done null
        ], (err) ->
          should.not.exist err
          done null
        
  
  describe "refresh", ->
    it "should refresh page", (done) ->
      @timeout 10000
      browser.refresh (err) ->
        should.not.exist err
        done null
  
  describe "back forward", ->
    it "urls should be correct when navigating back/forward", (done) ->
      @timeout 45000
      async.series [                  
        (done) ->
          setTimeout =>
            browser.get "http://127.0.0.1:8181/test-page.html?p=2", (err) ->
              should.not.exist err
              done null
          , 1000
          
        (done) ->
          browser.url (err, url) ->
            should.not.exist err
            url.should.include "?p=2"
            done null
        (done) ->
          browser.back  (err) ->
            should.not.exist err
            done null
        (done) ->
          browser.url (err, url) ->
            should.not.exist err
            url.should.not.include "?p=2"
            done null
        (done) ->
          browser.forward  (err) ->
            should.not.exist err
            done null
        (done) ->
          browser.url (err, url) ->
            should.not.exist err            
            url.should.include "?p=2"
            done null
        (done) ->
          browser.get "http://127.0.0.1:8181/test-page.html", (err) ->
            should.not.exist err
            done null
            
      ], (err) ->
        should.not.exist err
        done null
  
  describe "eval", ->
    it "should correctly evaluate various formulas", (done) ->
      async.series [
        evalShouldEqual browser, "1+2", 3
        evalShouldEqual browser, "document.title", "TEST PAGE"
        evalShouldEqual browser, "$('#eval').length", 1
        evalShouldEqual browser, "$('#eval li').length", 2     
      ], (err) ->
        should.not.exist err
        done null    
    
    describe "safeEval", ->
      it "should correctly evaluate (with safeEval) various formulas", (done) ->
        async.series [
          safeEvalShouldEqual browser, "1+2", 3
          safeEvalShouldEqual browser, "document.title", "TEST PAGE"
          safeEvalShouldEqual browser, "$('#eval').length", 1
          safeEvalShouldEqual browser, "$('#eval li').length", 2     
          (done) ->  browser.safeEval 'wrong formula +', (err,res) ->
            should.exist err
            (err instanceof Error).should.be.true          
            done(null)                 
        ], (err) ->
          should.not.exist err
          done null
    
  describe "execute (no args)", ->
    it "should execute script", (done) ->
      async.series [
        (done) ->  browser.execute "window.wd_sync_execute_test = 'It worked!'", (err) ->
          should.not.exist err
          done(null)      
        evalShouldEqual browser, "window.wd_sync_execute_test", 'It worked!'             
      ], (err) ->
        should.not.exist err
        done null

                
  describe "execute (with args)", ->
    it "should execute script", (done) ->
      jsScript = 
        '''
        var a = arguments[0], b = arguments[1];
        window.wd_sync_execute_test = 'It worked! ' + (a+b)
        '''
      async.series [
        (done) ->  browser.execute jsScript, [6,4], (err) ->
          should.not.exist err
          done(null)      
        evalShouldEqual browser, "window.wd_sync_execute_test", 'It worked! 10'             
      ], (err) ->
        should.not.exist err
        done null
  
  describe "safeExecute (no args)", ->
    it "should execute script (with safeExecute)", (done) ->
      async.series [
        (done) ->  browser.safeExecute "window.wd_sync_execute_test = 'It worked!'", (err) ->
          should.not.exist err
          done(null)      
        evalShouldEqual browser, "window.wd_sync_execute_test", 'It worked!'             
        (done) ->  browser.safeExecute "invalid-code> here", (err) ->
          should.exist err
          (err instanceof Error).should.be.true
          done(null)      
      ], (err) ->
        should.not.exist err
        done null
  
  
  describe "safeExecute (with args)", ->
    it "should execute script (with safeExecute)", (done) ->
      jsScript = 
        '''
        var a = arguments[0], b = arguments[1];
        window.wd_sync_execute_test = 'It worked! ' + (a+b)
        '''
      async.series [
        (done) ->  browser.safeExecute jsScript, [6,4], (err) ->
          should.not.exist err
          done(null)      
        evalShouldEqual browser, "window.wd_sync_execute_test", 'It worked! 10'             
        (done) ->  browser.safeExecute "invalid-code> here", [6,4], (err) ->
          should.exist err
          (err instanceof Error).should.be.true
          done(null)      
      ], (err) ->
        should.not.exist err
        done null
    
  describe "executeAsync (no args)", ->
    it "should execute async script", (done) ->
      scriptAsCoffee =
        """
          [args...,done] = arguments
          done "OK"              
        """
      scriptAsJs = CoffeeScript.compile scriptAsCoffee, bare:'on'      
      browser.executeAsync scriptAsJs, (err,res) ->          
        should.not.exist err
        res.should.equal "OK"
        done null
  describe "executeAsync (with args)", ->
    it "should execute async script", (done) ->
      scriptAsCoffee =
        """
          [a,b,done] = arguments
          done("OK " + (a+b))              
        """
      scriptAsJs = CoffeeScript.compile scriptAsCoffee, bare:'on'      
      browser.executeAsync scriptAsJs, [10, 5], (err,res) ->          
        should.not.exist err
        res.should.equal "OK 15"
        done null
    
    describe "safeExecuteAsync (no args)", ->
      it "should execute async script (using safeExecuteAsync)", (done) ->
        async.series [
          (done) ->  
            scriptAsCoffee =
              """
                [args...,done] = arguments
                done "OK"              
              """
            scriptAsJs = CoffeeScript.compile scriptAsCoffee, bare:'on'      
            browser.safeExecuteAsync scriptAsJs, (err,res) ->          
              should.not.exist err
              res.should.equal "OK"
              done(null)      
          (done) ->  
            browser.safeExecuteAsync "123 invalid<script", (err,res) ->          
              should.exist err
              (err instanceof Error).should.be.true
              done(null)      
        ], (err) ->
          should.not.exist err
          done null
    
    describe "safeExecuteAsync (with args)", ->
      it "should execute async script (using safeExecuteAsync)", (done) ->
        async.series [
          (done) ->  
            scriptAsCoffee =
              """
                [a,b,done] = arguments
                done("OK " + (a+b))              
              """
            scriptAsJs = CoffeeScript.compile scriptAsCoffee, bare:'on'      
            browser.safeExecuteAsync scriptAsJs, [10, 5], (err,res) ->          
              should.not.exist err
              res.should.equal "OK 15"
              done(null)      
          (done) ->  
            browser.safeExecuteAsync "123 invalid<script", [10, 5], (err,res) ->          
              should.exist err
              (err instanceof Error).should.be.true
              done(null)      
        ], (err) ->
          should.not.exist err
          done null        
  
  describe "setImplicitWaitTimeout", ->
    it  "should set the wait timeout and implicit wait timeout, " + \
        "run scripts to check functionality, " + \
        "and unset them", (done) ->
      @timeout 5000    
      async.series [
        # using old name
        (done) -> browser.setImplicitWaitTimeout 0, (err) ->
          should.not.exist err
          done null     
        executeCoffee browser,   
          """
            setTimeout ->
              $('#setWaitTimeout').html '<div class="child">a child</div>'
            , #{TIMEOUT_BASE}
          """
        (done) ->
          browser.elementByCss "#setWaitTimeout .child", (err,res) ->            
            should.exist err
            err.status.should.equal 7
            done(null)
        (done) -> browser.setImplicitWaitTimeout 2*TIMEOUT_BASE, (err) ->
          should.not.exist err
          done null
        (done) ->
          browser.elementByCss "#setWaitTimeout .child", (err,res) ->            
            # now it works
            should.not.exist err
            should.exist res
            done(null)
        (done) -> browser.setImplicitWaitTimeout 0, (err) ->
          should.not.exist err
          done null             
      ], (err) ->
        should.not.exist err
        done null
  
    describe "setAsyncScriptTimeout", ->
      it  "should set the async script timeout, " + \
          "run scripts to check functionality, " + \
          "and unset it", (done) ->
        @timeout 5000
        async.series [
          (done) -> browser.setAsyncScriptTimeout TIMEOUT_BASE/2, (err) ->
            should.not.exist err
            done null     
          (done) -> 
            scriptAsCoffee =
              """
                [args...,done] = arguments
                setTimeout ->
                  done "OK"
                , #{2*TIMEOUT_BASE}
              """
            scriptAsJs = CoffeeScript.compile scriptAsCoffee, bare:'on'
            browser.executeAsync scriptAsJs, (err,res) ->          
              should.exist err
              err.status.should.equal 28
              done null
          (done) -> browser.setAsyncScriptTimeout 2*TIMEOUT_BASE, (err) ->
            should.not.exist err
            done null     
          (done) -> 
            scriptAsCoffee =
              """
                [args...,done] = arguments
                setTimeout ->
                  done "OK"
                , #{TIMEOUT_BASE/2}
              """
            scriptAsJs = CoffeeScript.compile scriptAsCoffee, bare:'on'
            browser.executeAsync scriptAsJs, (err,res) ->          
              should.not.exist err
              res.should.equal "OK"
              done null
          (done) -> browser.setAsyncScriptTimeout 0, (err) ->
            should.not.exist err
            done null     
        ], (err) ->
          should.not.exist err
          done null
  
  elementFunctionTests()
  
  describe "getAttribute", -> 
    it "should get correct attribute value", (done) -> 
      browser.elementById "getAttribute", (err,testDiv) ->
        should.not.exist err
        should.exist testDiv
        async.series [
          (done) ->
            browser.getAttribute testDiv, "weather", (err,res) ->
              should.not.exist err
              res.should.equal "sunny"
              done null
          (done) ->
            browser.getAttribute testDiv, "timezone", (err,res) ->
              should.not.exist err
              should.not.exist res
              done null
        ], (err) ->
          should.not.exist err
          done null
  
  describe "getTagName", -> 
    it "should get correct tag name", (done) -> 
      async.series [
        (done) ->
          browser.elementByCss "#getTagName input", (err, field) ->
            should.not.exist err
            should.exist field
            browser.getTagName field, (err,res) ->
              should.not.exist err
              res.should.equal "input"
              done null
        (done) ->
          browser.elementByCss "#getTagName a", (err, field) ->
            should.not.exist err
            should.exist field
            browser.getTagName field, (err,res) ->
              should.not.exist err
              res.should.equal "a"
              done null
      ], (err) ->
        should.not.exist err
        done null
  
  describe "getValue (input)", -> 
    it "should get correct value", (done) -> 
      browser.elementByCss "#getValue input", (err,inputField) ->
        should.not.exist err
        should.exist inputField
        browser.getValue inputField, (err,res) ->
          should.not.exist err
          res.should.equal "Hello getValueTest!"
          done null
  
  describe "getValue (textarea)", -> 
    it "should get correct value", (done) -> 
      browser.elementByCss "#getValue textarea", (err,inputField) ->
        should.not.exist err
        should.exist inputField
        browser.getValue inputField, (err,res) ->
          should.not.exist err
          res.should.equal "Hello getValueTest2!"
          done null
  
  describe "isDisplayed", -> 
    it "should check if elemnt is displayed", (done) -> 
      async.series [
        (done) ->
          browser.elementByCss "#isDisplayed .displayed", (err, field) ->
            should.not.exist err
            should.exist field
            browser.isDisplayed field, (err,res) ->
              should.not.exist err
              res.should.be.true
              done null
        (done) ->
          browser.elementByCss "#isDisplayed .hidden", (err, field) ->
            should.not.exist err
            should.exist field
            browser.isDisplayed field, (err,res) ->
              should.not.exist err
              res.should.be.false
              done null
        (done) ->
          browser.elementByCss "#isDisplayed .displayed", (err, field) ->
            should.not.exist err
            should.exist field
            browser.displayed field, (err,res) ->
              should.not.exist err
              res.should.be.true
              done null
      ], (err) ->
        should.not.exist err
        done null
  
  describe "getComputedCss", -> 
    it "should retrieve the element computed css", (done) -> 
      async.series [
        (done) ->
          browser.elementByCss "#getComputedCss a", (err, field) ->
            should.not.exist err
            should.exist field
            browser.getComputedCss field, 'color', (err,res) ->
              should.not.exist err
              should.exist res
              res.length.should.be.above 0
              done null
        (done) ->
          browser.elementByCss "#getComputedCss a", (err, field) ->
            should.not.exist err
            should.exist field
            browser.getComputedCSS field, 'color', (err,res) ->
              should.not.exist err
              should.exist res
              res.length.should.be.above 0
              done null
      ], (err) ->
        should.not.exist err
        done null
                  
  describe "clickElement", -> 
    it "element should be clicked", (done) -> 
      browser.elementByCss "#clickElement a", (err,anchor) ->
        should.not.exist err
        should.exist anchor
        async.series [
          executeCoffee browser,
            '''
              jQuery ->
                a = $('#clickElement a')
                a.click ->
                  a.html 'clicked'
                  false              
            '''
          (done) -> textShouldEqual browser, anchor, "not clicked", done
          (done) ->
            browser.clickElement anchor, (err) ->
              should.not.exist err
              done null
          (done) -> textShouldEqual browser, anchor, "clicked", done
        ], (err) ->
          should.not.exist err
          done null
  
  describe "moveTo", -> 
    it "should move to correct element", (done) -> 
      env = {}
      _textShouldEqual = textShouldEqual
      # hover does not trigger in phantomjs, so disabling test
      textShouldEqual = (browser,element,expected, done) ->
        unless process.env.GHOSTDRIVER_TEST?
          _textShouldEqual browser,element,expected, done
        else
          done null
      async.series [
        elementByCss browser, env, "#moveTo .a1", 'a1'
        elementByCss browser, env, "#moveTo .a2", 'a2'
        elementByCss browser, env, "#moveTo .current", 'current'        
        (done) -> textShouldEqual browser, env.current, '', done
        executeCoffee browser, 
          '''
            jQuery ->
              a1 = $('#moveTo .a1')
              a2 = $('#moveTo .a2')
              current = $('#moveTo .current')
              a1.hover ->
                current.html 'a1'
              a2.hover ->
                current.html 'a2'
          '''
        (done) -> textShouldEqual browser, env.current, '', done
        (done) ->
          browser.moveTo env.a1, 5, 5, (err) ->            
            should.not.exist err
            done null
        (done) -> textShouldEqual browser, env.current, 'a1', done
        (done) -> 
          done null
        (done) ->
          browser.moveTo env.a2, undefined, undefined, (err) ->
            should.not.exist err
            done null
        (done) -> textShouldEqual browser, env.current, 'a2', done
        (done) ->
          browser.moveTo env.a1, (err) ->            
            should.not.exist err
            done null
        (done) -> textShouldEqual browser, env.current, 'a1', done
      ], (err) ->
        should.not.exist err
        done null
        
  # @todo waiting for implementation
  # it "scroll", (test) ->  
  describe "buttonDown / buttonUp", -> 
    it "should press/unpress button", (done) -> 
      env = {}
      async.series [
        elementByCss browser, env, "#mouseButton a", 'a'
        elementByCss browser, env, "#mouseButton div", 'resDiv'
        executeCoffee browser, 
          '''
            jQuery ->
              a = $('#mouseButton a')
              resDiv = $('#mouseButton div')
              a.mousedown ->
                resDiv.html 'button down'
              a.mouseup ->
                resDiv.html 'button up'
          '''          
        (done) -> textShouldEqual browser, env.resDiv, '', done
        (done) ->
          browser.moveTo env.a, (err) ->            
            should.not.exist err
            done null
        (done) ->
          browser.buttonDown (err) ->            
            should.not.exist err
            done null
        (done) -> textShouldEqual browser, env.resDiv, 'button down', done
        (done) ->
          browser.buttonUp (err) ->            
            should.not.exist err
            done null
        (done) -> textShouldEqual browser, env.resDiv, 'button up', done
      ], (err) ->
        should.not.exist err
        done null

  describe "click", -> 
    it "should move to then click element", (done) -> 
      env = {}
      async.series [
        elementByCss browser, env, "#click .numOfClicks", 'numOfClicksDiv'
        elementByCss browser, env, "#click .buttonNumber", 'buttonNumberDiv'
        executeCoffee browser,
          '''
            jQuery ->
              window.numOfClick = 0
              numOfClicksDiv = $('#click .numOfClicks')
              buttonNumberDiv = $('#click .buttonNumber')
              numOfClicksDiv.mousedown (eventObj) ->
                button = eventObj.button
                button = 'default' unless button?
                window.numOfClick = window.numOfClick + 1
                numOfClicksDiv.html "clicked #{window.numOfClick}"
                buttonNumberDiv.html "#{button}"    
                false                                         
          '''
        (done) -> textShouldEqual browser, env.numOfClicksDiv , "not clicked", done
        (done) ->
          browser.moveTo env.numOfClicksDiv, (err) ->
            should.not.exist err
            done null
        (done) ->
          browser.click 0, (err) ->
            should.not.exist err
            done null
        (done) -> textShouldEqual browser, env.numOfClicksDiv, "clicked 1", done
        (done) -> textShouldEqual browser, env.buttonNumberDiv, "0", done
        (done) ->
          browser.moveTo env.numOfClicksDiv, (err) ->
            should.not.exist err
            done null
        (done) ->
          browser.click (err) ->
            should.not.exist err
            done null
        (done) -> textShouldEqual browser, env.numOfClicksDiv, "clicked 2", done
        (done) -> textShouldEqual browser, env.buttonNumberDiv, "0", done
        # not testing right click, cause not sure how to dismiss the right 
        # click menu in chrome and firefox
      ], (err) ->
        should.not.exist err
        done null
  
  describe "doubleclick", -> 
    it "should move to then doubleclick element", (done) -> 
      env = {}
      async.series [ 
        elementByCss browser, env, "#doubleclick div", 'div'       
        executeCoffee browser,
          '''
            jQuery ->
              div = $('#doubleclick div')
              div.dblclick ->
                div.html 'doubleclicked'                                 
          '''
        (done) -> textShouldEqual browser, env.div, "not clicked", done
        (done) ->
          browser.moveTo env.div, (err) ->
            should.not.exist err
            done null
        (done) ->
          browser.doubleclick (err) ->
            should.not.exist err
            done null
        (done) -> textShouldEqual browser, env.div, "doubleclicked", done            
      ], (err) ->
        should.not.exist err
        done null
    
  describe "type", -> 
    it "should correctly input text", (done) -> 
      altKey = wd.SPECIAL_KEYS['Alt']
      nullKey = wd.SPECIAL_KEYS['NULL']
      browser.elementByCss "#type input", (err,inputField) ->
        should.not.exist err
        should.exist inputField
        async.series [
          (done) -> valueShouldEqual browser, inputField, "", done
          (done) ->
            browser.type inputField, "Hello" , (err) ->
              should.not.exist err
              done null
          (done) -> valueShouldEqual browser, inputField, "Hello", done
          (done) ->
            browser.type inputField, [altKey, nullKey, " World"] , (err) ->
              should.not.exist err
              done null
          (done) -> valueShouldEqual browser, inputField, "Hello World", done
          (done) ->
            browser.type inputField, "\n" , (err) -> # no effect
              should.not.exist err
              done null
          (done) -> valueShouldEqual browser, inputField, "Hello World", done
        ], (err) ->
          should.not.exist err
          done null
    
  describe "keys", -> 
    it "should press keys to input text", (done) -> 
      altKey = wd.SPECIAL_KEYS['Alt']
      nullKey = wd.SPECIAL_KEYS['NULL']
      browser.elementByCss "#keys input", (err,inputField) ->
        should.not.exist err
        should.exist inputField
        async.series [
          (done) -> valueShouldEqual browser, inputField, "", done
          (done) ->
            browser.clickElement inputField, (err) ->
              should.not.exist err
              done null
          (done) ->
            browser.keys "Hello" , (err) ->
              should.not.exist err
              done null
          (done) -> valueShouldEqual browser, inputField, "Hello", done
          (done) ->
            browser.keys [altKey, nullKey, " World"] , (err) ->
              should.not.exist err
              done null
          (done) -> valueShouldEqual browser, inputField, "Hello World", done
          (done) ->
            browser.keys "\n" , (err) -> # no effect
              should.not.exist err
              done null
          (done) -> valueShouldEqual browser, inputField, "Hello World", done
        ], (err) ->
          should.not.exist err
          done null
    
  describe "clear", -> 
    it "should clear input field", (done) -> 
      browser.elementByCss "#clear input", (err,inputField) ->
        should.not.exist err
        should.exist inputField
        async.series [
          (done) -> valueShouldEqual browser, inputField, "not cleared", done
          (done) ->
            browser.clear inputField , (err) ->
              should.not.exist err
              done null
          (done) -> valueShouldEqual browser, inputField, "", done
        ], (err) ->
          should.not.exist err
          done null
  
  describe "title", -> 
    it "should retrieve title", (done) -> 
      browser.title (err,title) ->
        should.not.exist err
        title.should.equal "TEST PAGE"
        done null
  
  describe "text (passing element)", -> 
    it "should retrieve text", (done) -> 
      browser.elementByCss "#text", (err,textDiv) ->
        should.not.exist err
        should.exist textDiv
        browser.text textDiv, (err, res) ->
          should.not.exist err
          res.should.include "text content" 
          res.should.not.include "div"
          done null 

  describe "text (passing undefined)", -> 
    it "should retrieve text", (done) -> 
      browser.text undefined, (err, res) ->
        should.not.exist err
        # the whole page text is returned
        res.should.include "text content" 
        res.should.include "sunny" 
        res.should.include "click elementsByLinkText"
        res.should.not.include "div" 
        done null
        
  describe "text (passing body)", -> 
    it "should retrieve text", (done) -> 
      browser.text 'body', (err, res) ->
        should.not.exist err
        # the whole page text is returned
        res.should.include "text content" 
        res.should.include "sunny" 
        res.should.include "click elementsByLinkText"
        res.should.not.include "div" 
        done null
        
  describe "text (passing null)", -> 
    it "should retrieve text", (done) -> 
      browser.text null, (err, res) ->
        should.not.exist err
        # the whole page text is returned
        res.should.include "text content" 
        res.should.include "sunny" 
        res.should.include "click elementsByLinkText"
        res.should.not.include "div" 
        done null
        
  describe "textPresent", -> 
    it "should check if text is present", (done) -> 
      browser.elementByCss "#textPresent", (err,textDiv) ->
        should.not.exist err
        should.exist textDiv
        async.series [
          (done) -> 
            browser.textPresent 'sunny', textDiv , (err, res) ->
              should.not.exist err
              res.should.be.true
              done null
          (done) -> 
            browser.textPresent 'raining', textDiv , (err, res) ->
              should.not.exist err
              res.should.be.false
              done null
        ], (err) ->
          should.not.exist err
          done null
  
  # not yet implemented in ghostdriver
  unless process.env.GHOSTDRIVER_TEST?        
    describe "acceptAlert", -> 
      it "should accept alert", (done) -> 
        browser.elementByCss "#acceptAlert a", (err,a) ->
          should.not.exist err
          should.exist a
          async.series [
            executeCoffee browser,
              """
                jQuery ->            
                  a = $('#acceptAlert a')
                  a.click ->
                    alert "coffee is running out"
                    false
              """          
            (done) -> 
              browser.clickElement a, (err) ->
                should.not.exist err
                done null
            (done) -> 
              browser.acceptAlert (err) ->
                should.not.exist err
                done null
          ], (err) ->
            should.not.exist err
            done null

  # not yet implemented in ghostdriver
  unless process.env.GHOSTDRIVER_TEST?        
    describe "dismissAlert", ->       
      it "should dismiss alert", (done) ->       
        browser.elementByCss "#dismissAlert a", (err,a) ->
          should.not.exist err
          should.exist a
          capabilities = null
          async.series [
            (done) -> 
              browser.sessionCapabilities (err,res) ->
                should.not.exist err
                capabilities = res
                done null              
            executeCoffee browser,
              """
                jQuery ->                        
                  a = $('#dismissAlert a')
                  a.click ->
                    alert "coffee is running out"
                    false
              """          
            (done) -> 
              browser.clickElement a, (err) ->
                should.not.exist err
                done null
            (done) -> 
              # known bug on chrome/mac, need to use acceptAlert instead
              unless (capabilities.platform is 'MAC' and capabilities.browserName is 'chrome')
                browser.dismissAlert (err) ->
                  should.not.exist err
                  done null
              else
                browser.acceptAlert (err) ->
                  should.not.exist err
                  done null            
          ], (err) ->
            should.not.exist err
            done null
      
  describe "active", -> 
    it "should check if element is active", (done) -> 
      env = {}
      async.series [
        elementByCss browser, env, "#active .i1", 'i1'
        elementByCss browser, env, "#active .i2", 'i2'
        (done) ->
          browser.clickElement env.i1, (err) ->            
            should.not.exist err
            done null
        (done) ->
          browser.active (err,res) ->            
            should.not.exist err
            (res.should.equal env.i1[k]; env.i1.should.have.property k) for k in res
            done null
        (done) ->
          browser.clickElement env.i2, (err) ->            
            should.not.exist err
            done null
        (done) ->
          browser.active (err,res) ->            
            should.not.exist err
            (res.should.equal env.i2[k]; env.i2.should.have.property k) for k in res
            done null
      ], (err) ->
        should.not.exist err
        done null
        
  describe "url", ->
    it "should retrieve url", (done) ->
      browser.url (err,res) ->
        res.should.include "test-page.html"
        res.should.include "http://"
        done null
  
  describe "takeScreenshot", ->
    it "should take a screenshot", (done) ->
      browser.takeScreenshot (err,res) ->
        should.not.exist err
        data = new Buffer res, 'base64'
        img = imageinfo data
        img.should.not.be.false
        img.format.should.equal 'PNG'
        img.width.should.not.equal 0
        img.height.should.not.equal 0
        done null
   
  describe "allCookies / setCookies / deleteAllCookies / deleteCookie", -> 
    it "cookies should work", (done) -> 
      async.series [
        (done) ->
          browser.deleteAllCookies (err) ->            
            should.not.exist err
            done null            
        (done) ->
          browser.allCookies (err, res) ->            
            should.not.exist err
            res.should.eql []
            done null            
        (done) ->
          browser.setCookie \
            name: 'fruit1'
            , value: 'apple'
          , (err) ->
            should.not.exist err
            done null
        (done) ->
          browser.allCookies (err, res) ->            
            should.not.exist err
            res.should.have.length 1
            (res.filter (c) -> c.name is 'fruit1' and c.value is 'apple')\
               .should.have.length 1
            done null            
        (done) ->
          browser.setCookie \
            name: 'fruit2'
            , value: 'pear'
          , (err) ->
            should.not.exist err
            done null
        (done) ->
          browser.allCookies (err, res) ->            
            should.not.exist err
            res.should.have.length 2
            (res.filter (c) -> c.name is 'fruit2' and c.value is 'pear')\
               .should.have.length 1
            done null            
        (done) ->
          browser.setCookie \
            name: 'fruit3'
            , value: 'orange'
          , (err) ->
            should.not.exist err
            done null
        (done) ->
          browser.allCookies (err, res) ->            
            should.not.exist err
            res.should.have.length 3
            done null            
        (done) ->
          browser.deleteCookie 'fruit2', (err) ->
            should.not.exist err
            done null
        (done) ->
          browser.allCookies (err, res) ->            
            should.not.exist err
            res.should.have.length 2
            (res.filter (c) -> c.name is 'fruit2' and c.value is 'pear')\
               .should.have.length 0
            done null            
        (done) ->
          browser.deleteAllCookies (err) ->            
            should.not.exist err
            done null            
        (done) ->
          browser.allCookies (err, res) ->            
            should.not.exist err
            res.should.eql []
            done null            
        (done) ->
          # not too sure how to test this case this one, so just making sure 
          # that it does not throw
          browser.setCookie \
            name: 'fruit3'
            , value: 'orange'
            , secure: true
          , (err) ->
            should.not.exist err
            done null
      ], (err) ->
        should.not.exist err
        done null
  
  describe "isVisible", -> 
    it "should check if element is visible", (done) -> 
      async.series [
        (done) ->
          browser.elementByCss "#isVisible a", (err, field) ->
            should.not.exist err
            should.exist field
            browser.isVisible field, (err,res) ->
              should.not.exist err
              res.should.be.true
              done null
        (done) ->
          browser.isVisible "css selector", "#isVisible a", (err,res) ->
            should.not.exist err
            res.should.be.true
            done null
        (done) ->
          browser.execute "$('#isVisible a').hide();", (err,res) ->
            should.not.exist err
            done null
        (done) ->
          browser.elementByCss "#isVisible a", (err, field) ->
            should.not.exist err
            should.exist field
            browser.isVisible field, (err,res) ->
              should.not.exist err
              res.should.be.false
              done null
        (done) ->
          browser.isVisible "css selector", "#isVisible a", (err,res) ->
            should.not.exist err
            res.should.be.false
            done null
      ], (err) ->
        should.not.exist err
        done null

  describe "waitForCondition", ->
    it "should wait for condition", (done) ->
      @timeout 10000
      exprCond = "$('#waitForCondition .child').length > 0"
      async.series [        
        executeCoffee browser,   
          """
            setTimeout ->
              $('#waitForCondition').html '<div class="child">a waitForCondition child</div>'
            , #{1.5*TIMEOUT_BASE}
          """  
        (done) ->
          browser.elementByCss "#waitForCondition .child", (err,res) ->            
            should.exist err
            err.status.should.equal 7
            done(null)
        (done) ->
          browser.waitForCondition exprCond, 2*TIMEOUT_BASE, 200, (err,res) ->            
            should.not.exist err
            res.should.be.true
            done(err)
        (done) ->
          browser.waitForCondition exprCond, 2*TIMEOUT_BASE, (err,res) ->            
            should.not.exist err
            res.should.be.true
            done(err)
        (done) ->
          browser.waitForCondition exprCond, (err,res) ->            
            should.not.exist err
            res.should.be.true
            done(err)                    
        (done) ->
          browser.waitForCondition '$wrong expr!!!', (err,res) ->            
            should.exist err
            done(null)            
      ], (err) ->
        should.not.exist err
        done null
      
  describe "waitForConditionInBrowser", ->
    it "should wait for condition within the browser", (done) ->
      @timeout 10000
      exprCond = "$('#waitForConditionInBrowser .child').length > 0"
      async.series [
        executeCoffee browser,   
          """
            setTimeout ->
              $('#waitForConditionInBrowser').html '<div class="child">a waitForCondition child</div>'
            , #{1.5*TIMEOUT_BASE}
          """
        (done) ->
          browser.elementByCss "#waitForConditionInBrowser .child", (err,res) ->            
            should.exist err
            err.status.should.equal 7
            done(null)
        (done) ->
          browser.setAsyncScriptTimeout 5*TIMEOUT_BASE, (err,res) ->            
            should.not.exist err
            done(null)
        (done) ->
          browser.waitForConditionInBrowser exprCond, 2*TIMEOUT_BASE, 0.2*TIMEOUT_BASE, (err,res) ->            
            should.not.exist err
            res.should.be.true
            done(err)
        (done) ->
          browser.waitForConditionInBrowser exprCond, 2*TIMEOUT_BASE, (err,res) ->            
            should.not.exist err
            res.should.be.true
            done(err)
        (done) ->
          browser.waitForConditionInBrowser exprCond, (err,res) ->            
            should.not.exist err
            res.should.be.true
            done(err)
        (done) ->
          browser.waitForConditionInBrowser "totally #} wrong == expr", (err,res) ->            
            should.exist err
            done(null)
        (done) ->
          browser.setAsyncScriptTimeout 0, (err,res) ->            
            should.not.exist err
            done(null)
      ], (err) ->
        should.not.exist err
        done null
        
  unless process.env.GHOSTDRIVER_TEST?        
    describe "err.inspect", ->
      it "error output should be clean", (done) ->
        browser.safeExecute "invalid-code> here", (err) ->
          should.exist err
          (err instanceof Error).should.be.true        
          should.exist err['jsonwire-error']
          err.inspect().should.include '"screen": "[hidden]"'
          err.inspect().should.include 'browser-error:'
          done null
        
  
    
  describe "close", ->        
    it "should close current window", (done) ->        
      browser.close (err) ->
        should.not.exist err
        done null
        
  describe "quit<COMP>", ->        
    it "should destroy browser", (done) ->
      browser.quit (err) ->        
        should.not.exist err
        done(null)
  
exports.test = test
