/*

browser_launcher.js
===================

This file more or less figures out how to launch any browser on any platform.

*/

var path = require('path')
  , rimraf = require('rimraf')
  , async = require('async')
  , exec = require('child_process').exec
  , fs = require('fs')

var fileExists = fs.exists || path.exists

// Find the temporary directory for the system
var tempDir = function(){
    var platform = process.platform
    if (platform === 'win32')
        return 'C:\\Windows\\Temp'
    else
        return '/tmp'
}()

var userHomeDir = process.env.HOME || process.env.USERPROFILE

// Async function that tells whether the executable specified for said browser exists on the system
function browserExeExists(cb){
    var browser = this
    if (browser.exe instanceof Array)
        async.filter(browser.exe, fileExists, function(exes){
            cb(exes.length > 0)
        })
    else
        fileExists(browser.exe, cb)
}

// Async function that tells whether an executable is findable by the `where` command on Windows
function findableByWhere(cb){
    exec('where ' + this.exe, function(err, exePath){
        cb(!!exePath)
    })
}

// Async function that tells whether an executable is findable by the `which` command on Unix
function findableByWhich(cb){
    exec('which ' + this.exe, function(err, exePath){
        cb(!!exePath)
    })
}

// Return the catalogue of the browsers that Testem supports for the platform. Each "browser object"
// will contain these fields:
//
// * `name` - the display name of the browser
// * `exe` - path to the executable to use to launch the browser
// * `setup(app, done)` - any initial setup needed before launching the executable(this is async, 
//        the second parameter `done()` must be invoked when done).
// * `supported(cb)` - an async function which tells us whether the browser is supported by the current machine.
function browsersForPlatform(){
    var platform = process.platform
    if (platform === 'win32'){
        return  [
            {
                name: "IE7",
                exe: "C:\\Program Files\\Internet Explorer\\iexplore.exe",
                setup: function(app, done){
                    app.server.ieCompatMode = 'EmulateIE7'
                    done()
                },
                supported: browserExeExists
            },
            {
                name: "IE8",
                exe: "C:\\Program Files\\Internet Explorer\\iexplore.exe",
                setup: function(app, done){
                    app.server.ieCompatMode = 'EmulateIE8'
                    done()
                },
                supported: browserExeExists
            },
            {
                name: "IE9",
                exe: "C:\\Program Files\\Internet Explorer\\iexplore.exe",
                setup: function(app, done){
                    app.server.ieCompatMode = '9'
                    done()
                },
                supported: browserExeExists
            },
            {
                name: "Firefox",
                exe: [
                    "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
                    "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe"
                ],
                args: ["-profile", tempDir + "\\testem.firefox"],
                setup: function(app, done){
                    rimraf(tempDir + '\\testem.firefox', done)
                },
                supported: browserExeExists
            },
            {
                name: "Chrome",
                exe: [
                    userHomeDir + "\\Local Settings\\Application Data\\Google\\Chrome\\Application\\chrome.exe",
                    userHomeDir + "\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
                    "C:\\Program Files\\Google\\Chrome\\Application\\Chrome.exe",
                    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe"
                ],
                args: ["--user-data-dir=" + tempDir + "\\testem.chrome", "--no-default-browser-check", "--no-first-run"],
                setup: function(app, done){
                    rimraf(tempDir + '\\testem.chrome', done)
                },
                supported: browserExeExists
            },
            {
                name: "Safari",
                exe: [
                    "C:\\Program Files\\Safari\\safari.exe",
                    "C:\\Program Files (x86)\\Safari\\safari.exe"
                ],
                supported: browserExeExists
            },
            {
                name: "Opera",
                exe: [
                    "C:\\Program Files\\Opera\\opera.exe",
                    "C:\\Program Files (x86)\\Opera\\opera.exe"
                ],
                args: ["-pd", tempDir + "\\testem.opera"],
                setup: function(app, done){
                    rimraf(tempDir + '\\testem.opera', done)
                },
                supported: browserExeExists
            },
            {
                name: 'PhantomJS',
                exe: 'phantomjs',
                args: function(app){
                    return [path.dirname(__dirname) + '/assets/phantom.js', app.config.get('port')]
                },
                supported: findableByWhere
            }
        ]
    }else if (platform === 'darwin'){
        return [
            {
                name: "Chrome", 
                exe: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome", 
                args: ["--user-data-dir=" + tempDir + "/testem.chrome", "--no-default-browser-check", "--no-first-run"],
                setup: function(app, done){
                    rimraf(tempDir + '/testem.chrome', done)
                },
                supported: browserExeExists
            },
            {
                name: "Firefox", 
                exe: "/Applications/Firefox.app/Contents/MacOS/firefox",
                args: ["-profile", tempDir + "/testem.firefox"],
                setup: function(app, done){
                    var profileDir = tempDir + '/testem.firefox'
                    rimraf(profileDir, function(){
                        // using prefs.js to suppress the check default browser popup
                        // and the welcome start page
                        var prefs = [
                            'user_pref("browser.shell.checkDefaultBrowser", false);'
                            , 'user_pref("browser.cache.disk.smart_size.first_run", false);'
                        ]
                        fs.mkdir(profileDir, function(){
                            fs.writeFile(profileDir + '/prefs.js', prefs.join('\n'), function(){
                                done()
                            })
                        })
                    })
                },
                supported: browserExeExists
            },
            {
                name: "Safari",
                exe: "/Applications/Safari.app/Contents/MacOS/Safari",
                setup: function(app, done){
                    fs.writeFile(tempDir + '/testem.safari.html', "<script>window.location = 'http://localhost:" + app.config.get('port') + "/'</script>", done)
                },
                args: function(app){
                    return [tempDir + '/testem.safari.html']
                },
                supported: browserExeExists
            },
            {
                name: "Opera",
                exe: "/Applications/Opera.app/Contents/MacOS/Opera",
                args: ["-pd", tempDir + "/testem.opera"],
                setup: function(app, done){
                    rimraf(tempDir + '/testem.opera', done)
                },
                supported: browserExeExists
            },
            {
                name: 'PhantomJS',
                exe: 'phantomjs',
                args: function(app){
                    return [path.dirname(__dirname) + '/assets/phantom.js', app.config.get('port')]
                },
                supported: findableByWhich
            }
        ]
    }else if (platform === 'linux'){
        return [
            {
                name: 'Firefox',
                exe: 'firefox',
                args: ["-profile", tempDir + "/testem.firefox"],
                setup: function(app, done){
                    rimraf(tempDir + '/testem.firefox', function(err){
                        if (!err){
                            fs.mkdir(tempDir + '/testem.firefox', done)
                        }else{
                            done()
                        }
                    })
                },
                supported: findableByWhich
            },
            {
                name: 'Chrome',
                exe: 'google-chrome',
                args: ["--user-data-dir=" + tempDir + "/testem.chrome", 
                    "--no-default-browser-check", "--no-first-run"],
                setup: function(app, done){
                    rimraf(tempDir + '/testem.chrome', done)
                },
                supported: findableByWhich
            },
            {
                name: 'PhantomJS',
                exe: 'phantomjs',
                args: function(app){
                    return [path.dirname(__dirname) + '/assets/phantom.js', app.config.get('port')]
                },
                supported: findableByWhich
            }
        ]
    }else{
        return []
    }
}

// Returns the avaliable browsers on the current machine.
function getAvailableBrowsers(cb){
    var browsers = browsersForPlatform()
    browsers.forEach(function(b){
        b.protocol = 'browser'
    })
    async.filter(browsers, function(browser, cb){
        browser.supported(cb)
    }, function(available){
        cb(available)
    })
}

exports.getAvailableBrowsers = getAvailableBrowsers
