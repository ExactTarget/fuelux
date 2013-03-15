/*global describe,before,it,after */
var Express, async, should, test, wd;

should = require('should');

async = require('async');

Express = require('./express').Express;

wd = require('./wd-with-cov');

test = function(remoteWdConfig, desired) {
  var browser, browserName, express, frames, handles, refreshPage;
  browser = null;
  handles = {};
  browserName = desired? desired.browserName : undefined;
  express = new Express();
  before(function(done) {
    express.start();
    done(null);
  });
  after(function(done) {
    express.stop();
    done(null);
  });
  describe("wd.remote", function() {
    it("should create browser", function(done) {
      browser = wd.remote(remoteWdConfig);
      if (!process.env.WD_COV) {
        browser.on("status", function(info) {
          console.log("\u001b[36m%s\u001b[0m", info);
        });
        browser.on("command", function(meth, path) {
          console.log(" > \u001b[33m%s\u001b[0m: %s", meth, path);
        });
      }
      done(null);
    });
  });
  describe("init", function() {
    it("should initialize browserinit", function(done) {
      this.timeout(30000);
      browser.init(desired, function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("opening first window", function() {
    it("should open the first window", function(done) {
      this.timeout(10000);
      browser.get("http://127.0.0.1:8181/window-test-page.html?window_num=1", function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("setting first window name", function() {
    it("should set the window name", function(done) {
      browser.execute("window.name='window-1'", function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("retrieving first window name", function() {
    it("should be window-1", function(done) {
      browser.windowName(function(err, name) {
        should.not.exist(err);
        name.should.equal('window-1');
        done(null);
      });
    });
  });
  describe("retrieving first window handle", function() {
    it("should retrieve handle", function(done) {
      browser.windowHandle(function(err, handle) {
        should.not.exist(err);
        should.exist(handle);
        handle.length.should.be.above(0);
        handles['window-1'] = handle;
        done(null);
      });
    });
  });
  describe("opening second window", function() {
    it("should open the second window", function(done) {
      this.timeout(10000);
      browser.newWindow('http://127.0.0.1:8181/window-test-page.html?window_num=2', 'window-2', function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("change focus to second window", function() {
    it("should focus on second window", function(done) {
      browser.window('window-2', function(err) {
        should.not.exist(err);
        browser.windowName(function(err, name) {
          should.not.exist(err);
          name.should.equal('window-2');
          done(null);
        });
      });
    });
  });
  describe("retrieving second window handle", function() {
    it("should retrieve handle", function(done) {
      browser.windowHandle(function(err, handle) {
        should.not.exist(err);
        should.exist(handle);
        handle.length.should.be.above(0);
        handle.should.not.equal(handles['window-1']);
        handles['window-2'] = handle;
        done(null);
      });
    });
  });
  describe("opening third window", function() {
    it("should open the third window", function(done) {
      this.timeout(10000);
      browser.newWindow('http://127.0.0.1:8181/window-test-page.html?window_num=3', 'window-3', function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("change focus to third window", function() {
    it("should focus on third window", function(done) {
      browser.window('window-3', function(err) {
        should.not.exist(err);
        browser.windowName(function(err, name) {
          should.not.exist(err);
          name.should.equal('window-3');
          done(null);
        });
      });
    });
  });
  describe("retrieving third window handle", function() {
    it("should retrieve handle", function(done) {
      browser.windowHandle(function(err, handle) {
        should.not.exist(err);
        should.exist(handle);
        handle.length.should.be.above(0);
        handle.should.not.equal(handles['window-1']);
        handle.should.not.equal(handles['window-2']);
        handles['window-3'] = handle;
        done(null);
      });
    });
  });
  describe("windowHandles", function() {
    it("should retrieve 2 window handles", function(done) {
      browser.windowHandles(function(err, _handles) {
        var k, v, _i, _len;
        should.not.exist(err);
        _handles.should.have.length(3);
        for (v = _i = 0, _len = handles.length; _i < _len; v = ++_i) {
          k = handles[v];
          _handles.should.include(v);
        }
        done(null);
      });
    });
  });
  describe("change focus to second window using window handle", function() {
    it("should focus on second window", function(done) {
      browser.window(handles['window-2'], function(err) {
        should.not.exist(err);
        browser.windowName(function(err, name) {
          should.not.exist(err);
          name.should.equal('window-2');
          done(null);
        });
      });
    });
  });
  describe("closing second window", function() {
    it("should close the second window", function(done) {
      browser.close(function(err) {
        should.not.exist(err);
        browser.windowHandles(function(err, _handles) {
          should.not.exist(err);
          _handles.should.have.length(2);
          done(null);
        });
      });
    });
  });
  describe("change focus to third window", function() {
    it("should focus on third window", function(done) {
      browser.window('window-3', function(err) {
        should.not.exist(err);
        browser.windowName(function(err, name) {
          should.not.exist(err);
          name.should.equal('window-3');
          done(null);
        });
      });
    });
  });
  describe("closing third window", function() {
    it("should close the third window", function(done) {
      browser.close(function(err) {
        should.not.exist(err);
        browser.windowHandles(function(err, _handles) {
          should.not.exist(err);
          _handles.should.have.length(1);
          done(null);
        });
      });
    });
  });
  describe("change focus to first window", function() {
    it("should focus on first window", function(done) {
      browser.window('window-1', function(err) {
        should.not.exist(err);
        browser.windowName(function(err, name) {
          should.not.exist(err);
          name.should.equal('window-1');
          done(null);
        });
      });
    });
  });
  describe("opening window with no name", function() {
    it("should open the third window", function(done) {
      this.timeout(10000);
      browser.newWindow('http://127.0.0.1:8181/window-test-page.html?window_num=4', function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  describe("focusing on window with no name handle", function() {
    it("last handle should correspond to latest opened window", function(done) {
      browser.windowHandles(function(err, _handles) {
        should.not.exist(err);
        _handles.should.have.length(2);
        browser.window(_handles[1], function(err) {
          should.not.exist(err);
          browser.url(function(err, url) {
            url.should.include("num=4");
            done(null);
          });
        });
      });
    });
  });
  describe("closing window with no name", function() {
    it("should close the window with no name", function(done) {
      browser.close(function(err) {
        should.not.exist(err);
        browser.windowHandles(function(err, _handles) {
          should.not.exist(err);
          _handles.should.have.length(1);
          done(null);
        });
      });
    });
  });
  describe("change focus to first window", function() {
    it("should focus on first window", function(done) {
      browser.window('window-1', function(err) {
        should.not.exist(err);
        browser.windowName(function(err, name) {
          should.not.exist(err);
          name.should.equal('window-1');
          done(null);
        });
      });
    });
  });
  describe("opening frame test page", function() {
    it("should open the first window", function(done) {
      this.timeout(10000);
      browser.get("http://127.0.0.1:8181/frames/index.html", function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  frames = [];
  describe("looking for frame elements", function() {
    it("should find frame elements", function(done) {
      browser.elementsByTagName('frame', function(err, _frames) {
        should.not.exist(err);
        _frames.should.have.length(3);
        async.forEachSeries(_frames, function(frame, done) {
          var frameInfo;
          frameInfo = {
            el: frame.toString()
          };
          async.series([
            function(done) {
              frame.getAttribute('name', function(err, name) {
                should.not.exist(err);
                frameInfo.name = name;
                done(null);
              });
            }, function(done) {
              frame.getAttribute('id', function(err, id) {
                should.not.exist(err);
                frameInfo.id = id;
                done(null);
              });
            }
          ], function(err) {
            should.not.exist(err);
            frames.push(frameInfo);
            done(null);
          });
        }, function(err) {
          var i;
          should.not.exist(err);
          frames.should.have.length(3);
          ((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = frames.length; _i < _len; _i++) {
              i = frames[_i];
              _results.push(i.name);
            }
            return _results;
          })()).should.eql(['menu', 'main', 'bottom']);
          done(null);
        });
      });
    });
  });
  refreshPage = function() {
    // selenium is very buggy, so having to refresh between each
    // frame switch
    describe("refreshing page", function() {
      it("should refresh the page", function(done) {
        browser.refresh(function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  };
  describe("selecting default frame", function() {
    it("should select frame menu", function(done) {
      browser.frame(function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  refreshPage();
  describe("selecting frame by number", function() {
    it("should select frame menu", function(done) {
      browser.frame(0, function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
  refreshPage();
  if (browserName !== 'chrome') {
    describe("selecting frame by id", function() {
      it("should select frame main", function(done) {
        browser.frame(frames[1].id, function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  }
  refreshPage();
  if (browserName !== 'chrome') {
    describe("selecting frame by name", function() {
      it("should select frame main", function(done) {
        browser.frame(frames[2].name, function(err) {
          should.not.exist(err);
          done(null);
        });
      });
    });
  }
  describe("quit", function() {
    it("should destroy browser", function(done) {
      browser.quit(function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
};

exports.test = test;
