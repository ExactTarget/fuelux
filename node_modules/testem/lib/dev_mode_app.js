/*

dev_mode_app.js
===============

This is the entry point for development(TDD) mode.

*/

var Server = require('./server')
var fs = require('fs')
var log = require('winston')
var AppView = require('./ui/appview')
var Path = require('path')
var yaml = require('js-yaml')
var FileWatcher = require('./filewatcher')
var Config = require('./config')
var browser_launcher = require('./browser_launcher')
var Launcher = require('./launcher')
var BaseApp = require('./base_app')
var StyledString = require('styled_string')

function App(config){
    var self = this
    BaseApp.call(this, config)
    this.fileWatcher = new FileWatcher
    this.fileWatcher.on('change', this.onFileChanged.bind(this))
    this.fileWatcher.on('emfile', this.onEMFILE.bind(this))
    this.fileWatcher.on('fw-error', this.onGeneralWatcherError.bind(this))

    // a list of connected browser clients
    this.runners.on('remove', function(runner){
        runner.unbind()
    })

    this.configure(function(){
        this.server = new Server(this)
        with(this.server){
            on('server-start', this.initView.bind(this))
            on('file-requested', this.onFileRequested.bind(this))
        }
        this.server.start()

    })

    process.on('uncaughtException', function(err){
        self.quit(1, err)
    })

}

App.prototype = {
    __proto__: BaseApp.prototype
    , initView: function(){
        var self = this
        var view = this.view = new AppView({
            app: this
        })
        if (this.view.on)
            this.view.on('inputChar', this.onInputChar.bind(this))
        
        this.on('all-runners-complete', function(){
            self.runPostprocessors() 
        })

        self.startOnStartHook(function(){
            self.startTests(function(){
                self.initLaunchers()
            })
        })
        
    }
    , initLaunchers: function(){
        var config = this.config
        var launch_in_dev = config.get('launch_in_dev')
        var self = this
        
        config.getLaunchers(this, function(launchers){
            self.launchers = launchers
            launchers.forEach(function(launcher){
                log.info('Launching ' + launcher.name)
                self.on('exit', function(){
                    launcher.kill()
                })
                launcher.start()
            })
        })
    }
    , configure: function(cb){
        var self = this
          , fileWatcher = self.fileWatcher
          , config = self.config
        config.read(function(){
            var watch_files = config.get('watch_files')
            var src_files = config.get('src_files')
            fileWatcher.clear()
            fileWatcher.add(config.get('file'))
            if (config.isCwdMode()){
                fileWatcher.add(process.cwd())
                fs.readdir(process.cwd(), function(err, files){
                    files = files.filter(function(file){
                        return !!file.match(/\.js$/)
                    })
                    fileWatcher.add.apply(fileWatcher, files)
                })
            }
            if (watch_files) {
                self.watchFiles(watch_files)
            }
            if (src_files) {
                self.watchFiles(src_files)
            }
            if (cb) cb.call(self)
        })
    }
    , watchFiles: function(files){
        var fileWatcher = this.fileWatcher
        if (Array.isArray(files)) {
            fileWatcher.add.apply(fileWatcher, files)
        } else {
            fileWatcher.add(files)
        }
    }
    , onFileRequested: function(filepath){
        this.fileWatcher.add(filepath)
    }
    , onFileChanged: function(filepath){
        if (this.disableFileWatch) return
        log.info(filepath + ' changed.')
        if (filepath === Path.resolve(this.config.get('file')) ||
            (this.config.isCwdMode() && filepath === process.cwd())){
            // config changed
            this.configure(this.startTests.bind(this))
        }else{
            var self = this
            this.startTests()
        }
    }
    , onEMFILE: function(){
        var view = this.view
        var text = [
            'The file watcher received a EMFILE system error, which means that ',
            'it has hit the maximum number of files that can be open at a time. ',
            'Luckily, you can increase this limit as a workaround. See the directions below \n \n',
            'Linux: http://stackoverflow.com/a/34645/5304\n',
            'Mac OS: http://serverfault.com/a/15575/47234'
        ].join('')
        view.setErrorPopupMessage(StyledString(text + '\n ').foreground('megenta'))
    }
    , onGeneralWatcherError: function(message){
        log.error('Error from fireworm: ' + message)
    }
    , quit: function(code, err){
        var self = this
        this.emit('exit')
        this.cleanUpLaunchers(function(){
            self.runExitHook(function(){
                self.view.cleanup(function(){
                    if (err) console.error(err.stack)
                    process.exit(code)
                })
            })
        })
    } 
    , onInputChar: function(chr, i) {
        var self = this
        if (chr === 'q')
            this.quit()
        else if (i === 13){ // ENTER
            this.startTests()
        }
    }
    , startTests: function(callback){
        try{
            var view = this.view
            var runners = this.runners
            this.runPreprocessors(function(err, stdout, stderr, command){
                if (err){
                    var titleText = 'Error running before_tests hook: ' + command
                    var title = StyledString(titleText + '\n ').foreground('red')
                    var errMsgs = StyledString('\n' + stdout).foreground('yellow')
                        .concat(StyledString('\n' + stderr).foreground('red'))
                    view.setErrorPopupMessage(title.concat(errMsgs))
                    return
                }else{
                    view.clearErrorPopupMessage()
                    runners.forEach(function(runner){
                        runner.startTests()
                    })
                    if (callback) callback()
                }
            })
        }catch(e){
            log.info(e.message)
            log.info(e.stack)
        }
    }
}

module.exports = App