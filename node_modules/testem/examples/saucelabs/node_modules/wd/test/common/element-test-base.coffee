# mocha test
CoffeeScript = require 'coffee-script'

should = require 'should'
async = require 'async'      

{Express} = require './express'

wd = require './wd-with-cov'

textShouldEqual = (browser,element,expected, done) ->  
  browser.text element, (err,res) ->
    should.not.exist err
    res.should.equal expected
    done null      

executeCoffee = (browser, script) ->  
  scriptAsJs = CoffeeScript.compile script, bare:'on'      
  (done) ->  browser.execute scriptAsJs, (err) ->
    should.not.exist err
    done(null)      

test = (remoteWdConfig, desired) ->
  browser = null

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
      @timeout 45000
      browser.init desired, (err) ->
        should.not.exist err
        done null
  
  describe "get", ->
    it "should navigate to test page", (done) ->
      @timeout 15000
      browser.get "http://127.0.0.1:8181/element-test-page.html", (err) ->
        should.not.exist err
        done null
  
  describe "element.text", ->
    it "should retrieve the text", (done) ->
      browser.element "id", "text", (err, el) ->
        should.not.exist err
        el.should.have.property "text"
        el.text (err, res) ->
          res.should.include "I am some text"
          done null
  
  describe "element.textPresent", ->
    it "should check if text is present", (done) ->
      browser.element "id", "text", (err, el) ->
        should.not.exist err
        el.should.have.property "textPresent"
        el.textPresent "some text", (err, present) ->
          should.not.exist err
          present.should.be.true
          done null
  
  describe "element.click", -> 
    it "element should be clicked", (done) -> 
      browser.elementByCss "#click a", (err,anchor) ->
        should.not.exist err
        should.exist anchor
        async.series [
          executeCoffee browser,
            '''
              jQuery ->
                a = $('#click a')
                a.click ->
                  a.html 'clicked'
                  false              
            '''
          (done) -> textShouldEqual browser, anchor, "not clicked", done
          (done) ->
            anchor.click (err) ->
              should.not.exist err
              done null
          (done) -> textShouldEqual browser, anchor, "clicked", done
        ], (err) ->
          should.not.exist err
          done null

  describe "element.getTagName", -> 
    it "should get correct tag name", (done) -> 
      async.series [
        (done) ->
          browser.elementByCss "#getTagName input", (err, field) ->
            should.not.exist err
            should.exist field
            field.getTagName (err,res) ->
              should.not.exist err
              res.should.equal "input"
              done null
        (done) ->
          browser.elementByCss "#getTagName a", (err, field) ->
            should.not.exist err
            should.exist field
            field.getTagName (err,res) ->
              should.not.exist err
              res.should.equal "a"
              done null
      ], (err) ->
        should.not.exist err
        done null
  
  describe "element.isDisplayed", -> 
    it "should check if elemnt is displayed", (done) -> 
      async.series [
        (done) ->
          browser.elementByCss "#isDisplayed .displayed", (err, field) ->
            should.not.exist err
            should.exist field
            field.isDisplayed (err,res) ->
              should.not.exist err
              res.should.be.true
              done null
        (done) ->
          browser.elementByCss "#isDisplayed .hidden", (err, field) ->
            should.not.exist err
            should.exist field
            field.isDisplayed (err,res) ->
              should.not.exist err
              res.should.be.false
              done null
        (done) ->
          browser.elementByCss "#isDisplayed .displayed", (err, field) ->
            should.not.exist err
            should.exist field
            field.displayed (err,res) ->
              should.not.exist err
              res.should.be.true
              done null
      ], (err) ->
        should.not.exist err
        done null
  
  describe "element.getComputedCss", -> 
    it "should retrieve the element computed css", (done) -> 
      async.series [
        (done) ->
          browser.elementByCss "#getComputedCss a", (err, field) ->
            should.not.exist err
            should.exist field
            field.getComputedCss 'color', (err,res) ->
              should.not.exist err
              should.exist res
              res.length.should.be.above 0
              done null
        (done) ->
          browser.elementByCss "#getComputedCss a", (err, field) ->
            should.not.exist err
            should.exist field
            field.getComputedCSS 'color', (err,res) ->
              should.not.exist err
              should.exist res
              res.length.should.be.above 0
              done null
      ], (err) ->
        should.not.exist err
        done null
  
  describe "element.getAttribute", ->
    it "should retrieve attribute value", (done) ->
      browser.element "id", "getAttribute", (err, el) ->
        should.not.exist err
        el.should.have.property "getAttribute"
        el.getAttribute "att", (err, value) ->
          should.not.exist err
          value.should.equal "42"
          done null

  describe "element.getValue", ->
    it "should retrieve value", (done) ->
      browser.element "id", "getValue", (err, el) ->
        should.not.exist err
        el.should.have.property "getValue"
        el.getValue (err, value) ->
          should.not.exist err
          value.should.equal "value"
          done null    

  describe "element.sendKeys", ->
    it "should send keys", (done) ->
      text = "keys"
      browser.element "id", "sendKeys", (err, el) ->
        should.not.exist err
        el.should.have.property "sendKeys"
        el.sendKeys text, (err) ->
          should.not.exist err
          el.getValue (err, textReceived) ->
            should.not.exist err
            textReceived.should.equal text
            done null

  describe "element.clear", ->
    it "should clear input field", (done) ->
      browser.element "id", "clear", (err, el) ->
        should.not.exist err
        el.should.have.property "clear"
        el.clear (err) ->
          should.not.exist err
          el.getValue (err, textReceived) ->
            should.not.exist err
            textReceived.should.equal ""
            done null

  describe "close", ->
    it "should close current window", (done) ->            
      browser.close (err) ->
        should.not.exist err
        done null
  
  describe "quit", ->  
    it "should destroy browser", (done) ->
      browser.quit (err) ->
        should.not.exist err
        done null

exports.test = test
      
