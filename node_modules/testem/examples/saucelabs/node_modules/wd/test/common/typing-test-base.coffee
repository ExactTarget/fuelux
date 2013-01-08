# mocha test
CoffeeScript = require 'coffee-script'

should = require 'should'
async = require 'async'      

{Express} = require './express'

wd = require './wd-with-cov'

altKey = wd.SPECIAL_KEYS['Alt']
nullKey = wd.SPECIAL_KEYS['NULL']
returnKey = wd.SPECIAL_KEYS['Return']
enterKey = wd.SPECIAL_KEYS['Enter']

executeCoffee = (browser, script , done ) ->  
  scriptAsJs = CoffeeScript.compile script, bare:'on'      
  browser.execute scriptAsJs, (err) ->
    should.not.exist err
    done(null)      

valueShouldEqual = (browser,element,expected, done) ->  
  browser.getValue element, (err,res) ->
    should.not.exist err
    res.should.equal expected
    done null      

click = (browser, _sel, done) ->
  browser.elementByCss _sel, (err,inputField) ->
    should.not.exist err
    should.exist inputField
    browser.clickElement inputField , (err) ->
      should.not.exist err
      done null

typeAndCheck = (browser, _sel, chars, expected, done) ->
  browser.elementByCss _sel, (err,inputField) ->
    should.not.exist err
    should.exist inputField
    async.series [
      (done) ->
        browser.type inputField, chars , (err) ->
          should.not.exist err
          done null
      (done) -> valueShouldEqual browser, inputField, expected, done    
    ], (err) ->
      should.not.exist err
      done null

keysAndCheck = (browser, _sel, chars, expected, done) ->
  browser.elementByCss _sel, (err,inputField) ->
    should.not.exist err
    should.exist inputField
    async.series [
      (done) ->
        browser.moveTo inputField , (err) ->
          should.not.exist err
          done null
      (done) ->
        browser.keys chars , (err) ->
          should.not.exist err
          done null
      (done) -> valueShouldEqual browser, inputField, expected, done    
    ], (err) ->
      should.not.exist err
      done null

inputAndCheck = (browser, method, _sel, chars, expected, done) ->
  switch method
    when 'type'
      typeAndCheck browser, _sel, chars, expected, done
    when 'keys'
      keysAndCheck browser, _sel, chars, expected, done

clearAndCheck = (browser, _sel, done) ->
  browser.elementByCss _sel, (err,inputField) ->
    should.not.exist err
    should.exist inputField
    async.series [
      (done) ->
        browser.clear inputField, (err) ->
          should.not.exist err
          done null
      (done) -> valueShouldEqual browser, inputField, "", done    
    ], (err) ->
      should.not.exist err
      done null

preventDefault = (browser, _sel, eventType, done) ->
  script =
    """
      $('#{_sel}').#{eventType} (e) ->
        e.preventDefault()
    """
  executeCoffee browser, script , done

unbind = (browser, _sel, eventType, done) ->
  script =
    """
      $('#{_sel}').unbind '#{eventType}' 
    """
  executeCoffee browser, script , done

altKeyTracking = (browser, _sel, done) ->
  script =
    """
      f = $('#{_sel}')
      f.keydown (e) ->
        if e.altKey
          f.val 'altKey on'
        else
          f.val 'altKey off'
        e.preventDefault()
    """    
  executeCoffee browser, script , done

test = (remoteWdConfig, desired) ->
  browser = null
  browserName = desired?.browserName
  express = new Express
  before (done) ->
    express.start()
    done null
        
  after (done) ->
    express.stop()          
    done null
         
  testMethod = (method, sel) ->
    describe "method:#{method}", ->
      describe "sel:#{sel}", ->

        describe "1/ click", ->
          it "should work", (done) ->
            click browser, sel, done
        
        unless method is 'keys' and browserName in ['chrome']  
          describe "1/ typing nothing", ->
            it "should work", (done) ->
              inputAndCheck browser, method, sel, "", "", done

        unless method is 'keys' # and browserName in ['chrome']  
          describe "2/ typing []", ->
            it "should work", (done) ->
              inputAndCheck browser, method, sel, [], "", done
          
        describe "3/ typing 'Hello'", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, 'Hello', 'Hello',  done

        describe "4/ clear", ->
          it "should work", (done) ->      
            clearAndCheck browser, sel,  done

        describe "5/ typing ['Hello']", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, ['Hello'], 'Hello',  done

        describe "6/ clear", ->
          it "should work", (done) ->      
            clearAndCheck browser, sel,  done

        describe "7/ typing ['Hello',' ','World','!']", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, ['Hello',' ','World','!'], 'Hello World!',  done

        describe "8/ clear", ->
          it "should work", (done) ->      
            clearAndCheck browser, sel,  done
        
        describe "9/ typing 'Hello\\n'", ->
          it "should work", (done) ->      
            expected = (if sel.match /input/ then 'Hello' else 'Hello\n') 
            inputAndCheck browser, method, sel, 'Hello\n', expected,  done

        describe "10/ typing '\\r'", ->
          it "should work", (done) ->
            if browserName = 'chrome' or process.env.GHOSTDRIVER_TEST?
              # chrome chrashes when sent '\r', ghostdriver does not
              # seem to like it
              inputAndCheck browser, method, sel, [returnKey], (if sel.match /input/ then 'Hello' else 'Hello\n\n'), done 
            else
              inputAndCheck browser, method, sel, '\r', (if sel.match /input/ then 'Hello' else 'Hello\n\n'), done   

        describe "11/ typing [returnKey]", ->
          it "should work", (done) ->      
            expected = (if sel.match /input/ then 'Hello' else 'Hello\n\n\n') 
            inputAndCheck browser, method, sel, [returnKey], expected,  done

        describe "12/ typing [enterKey]", ->
          it "should work", (done) ->      
            expected = (if sel.match /input/ then 'Hello' else 'Hello\n\n\n\n') 
            inputAndCheck browser, method, sel, [enterKey], expected,  done

        describe "13/ typing ' World!'", ->
          it "should work", (done) ->      
            expected = (if sel.match /input/ then 'Hello World!' else 'Hello\n\n\n\n World!') 
            inputAndCheck browser, method, sel, ' World!', expected,  done

        describe "14/ clear", ->
          it "should work", (done) ->      
            clearAndCheck browser, sel,  done

        describe "15/ preventing default on keydown", ->
          it "should work", (done) ->      
            preventDefault browser, sel, 'keydown',  done      

        describe "16/ typing 'Hello'", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, 'Hello', '',  done

        describe "17/ unbinding keydown", ->
          it "should work", (done) ->      
            unbind browser, sel, 'keydown',  done      

        describe "18/ typing 'Hello'", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, 'Hello', 'Hello',  done

        describe "19/ clear", ->
          it "should work", (done) ->      
            clearAndCheck browser, sel,  done      

        describe "20/ preventing default on keypress", ->
          it "should work", (done) ->      
            preventDefault browser, sel, 'keypress',  done      

        describe "21/ typing 'Hello'", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, 'Hello', '',  done

        describe "22/ unbinding keypress", ->
          it "should work", (done) ->      
            unbind browser, sel, 'keypress',  done      

        describe "23/ typing 'Hello'", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, 'Hello', 'Hello',  done

        describe "24/ clear", ->
          it "should work", (done) ->      
            clearAndCheck browser, sel,  done      

        describe "25/ preventing default on keyup", ->
          it "should work", (done) ->      
            preventDefault browser, sel, 'keyup',  done      

        describe "26/ typing 'Hello'", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, 'Hello', 'Hello',  done

        describe "27/ unbinding keypress", ->
          it "should work", (done) ->      
            unbind browser, sel, 'keyup',  done      

        describe "28/ clear", ->
          it "should work", (done) ->      
            clearAndCheck browser, sel,  done   

        describe "29/ adding alt key tracking", ->
          it "should work", (done) ->      
            altKeyTracking browser, sel,  done   

        describe "30/ typing ['a']", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, ['a'], 'altKey off',  done

        describe "31/ typing [altKey,nullKey,'a']", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, [altKey,nullKey,'a'], 'altKey off',  done

        describe "32/ typing [altKey,'a']", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, [altKey,'a'], 'altKey on',  done

        unless process.env.GHOSTDRIVER_TEST?    
          describe "33/ typing ['a']", ->
            it "should work", (done) ->      
              expected = (if method is 'type' then 'altKey off' else 'altKey on') 
              inputAndCheck browser, method, sel, ['a'], expected,  done

        describe "34/ clear", ->
          it "should work", (done) ->      
            clearAndCheck browser, sel,  done   

        describe "35/ typing [nullKey]", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, [nullKey], '',  done

        describe "36/ typing ['a']", ->
          it "should work", (done) ->      
            inputAndCheck browser, method, sel, ['a'], 'altKey off',  done        

        describe "37/ clear", ->
          it "should work", (done) ->      
            clearAndCheck browser, sel,  done   

        describe "38/ unbinding keydown", ->
          it "should work", (done) ->      
            unbind browser, sel, 'keydown',  done     
        
  describe "wd.remote", ->
    it "should work", (done) ->
      browser = wd.remote remoteWdConfig
      unless process.env.WD_COV?
        browser.on "status", (info) ->
          console.log "\u001b[36m%s\u001b[0m", info
        browser.on "command", (meth, path) ->
          console.log " > \u001b[33m%s\u001b[0m: %s", meth, path
      done null

  describe "init", ->
    it "should work", (done) ->
      browser.init desired, (err) ->
        should.not.exist err
        done err

  describe "get", ->
    it "should work", (done) ->
      browser.get "http://127.0.0.1:8181/type-test-page.html", (err) ->
        should.not.exist err
        done null

  testMethod "type", "#type input"
  testMethod "keys", "#type input"

  testMethod "type", "#type textarea"
  testMethod "keys", "#type textarea"

  describe "quit", ->
    it "should work", (done) ->
      browser.quit (err) ->
        should.not.exist err
        done err    

exports.test = test
