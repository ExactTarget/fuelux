/*

filewatcher.js
==============

This utility watches files for changes. Usage:

    var fw = new FileWatcher
    fw.add('path/to/my/file.js')
    fw.on('change', function(filename){
        console.log(filename + ' changed!')
    })
    fw.clear() // stopped watching all files

It can also take globs as the parameter.

    fw.add('path/to/my/*.js')

*/

var fs = require('fs')
  , glob = require('glob')
  , log = require('util').debug
  , path = require('path')
  , EventEmitter = require('events').EventEmitter

function FileWatcher(){
    this.fileInfo = {} // a map of file info, key by filepath
    this.emfile = false
}

FileWatcher.prototype = {
    __proto__: EventEmitter.prototype,
    clear: function(){
        for (var path in this.fileInfo){
            var info = this.fileInfo[path]
            if (info.watcher){
                info.watcher.close()
            }
            try{
                fs.unwatchFile(path)
            }catch(e){}
        }
        this.fileInfo = {}
        this.emit('clear')
    },
    printWatched: function(){
        for (var path in this.fileInfo){
            console.log(path)
        }
    },
    add: function(){
        for (var i = 0; i < arguments.length; i++){
            var glob = arguments[i]
            this.watch(glob)
            this.emit('add', 'glob')
        }
    },
    isWatching: function(path){
        return path in this.fileInfo
    },
    getFileInfo: function(path){
        if (!(path in this.fileInfo))
            this.fileInfo[path] = {}
        return this.fileInfo[path]
    },
    watch: function(globPattern){
        if (!globPattern) return
        if (this.emfile) return

        var self = this
          , dir = process.cwd()
        glob(globPattern, {silent: true}, function(err, files){
            files.forEach(function(file){
                file = path.join(dir, file)
                if (self.isWatching(file)) return
                fs.stat(file, function(err, stats){
                    if (err) return
                    var fileInfo = self.getFileInfo(file)
                    fileInfo.lastModTime = +stats.mtime
                    try{
                        fileInfo.watcher = fs.watch(
                            file
                            , function(evt){
                                self.onAccess(evt, file)
                            }
                        )
                    }catch(e){
                        self.emit('emfile', e.message)
                        self.emfile = true
                    }
                    try{
                        fs.watchFile(file, function(curr, prev){
                            if (curr.mtime !== prev.mtime){
                                self.onAccess('change', file)
                            }
                        })
                    }catch(e){}
                })
            })
        })
    },
    onAccess: function(evt, filename){
        var self = this
        fs.stat(filename, function(err, stats){
            if (err) return
            var fileInfo = self.getFileInfo(filename)
            var lastMTime = fileInfo.lastModTime
            if (!lastMTime || (stats.mtime > lastMTime)){
                // workaround for windows file access bug by delaying 100ms
                if (process.platform === 'win32'){
                    setTimeout(function(){
                        self.emit('change', filename)
                    }, 200)
                }else{
                    self.emit('change', filename)
                }
                fileInfo.lastModTime = +stats.mtime
            }
        })
    }
}

module.exports = FileWatcher