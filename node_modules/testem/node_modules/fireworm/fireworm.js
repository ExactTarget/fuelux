var fs = require('fs')
var path = require('path')
var EventEmitter = require('events').EventEmitter.prototype
var matchesStart = require('./matches_start')
var minimatch = require('minimatch')
var Set = require('set')

/* 

A file info keeper keeps the stat objects and watcher object for a collection of files (or directories).

`stats` and `watchers` are a dictionary key'ed by ino. `inos` is a dictionary key'ed by file path.

*/
function fileInfoKeeper(){
    var s = Object.create(EventEmitter)

    s.init = function(){
        s.stats = {}
        s.inos = {}
        s.watchers = {}
    }
    s.init()

    s.save = function(path, stat){
        s.inos[path] = stat.ino
        s.stats[stat.ino] = stat
    }

    s.remove = function(path){
        var ino = s.inos[path]
        delete s.stats[ino]
        delete s.inos[path]
        s.unwatch(ino)
    }

    s.watch = function(path, onAccessed){
        var ino = s.inos[path]
        if (s.watchers[ino]) return
        try{
            s.watchers[ino] = {
                path: path
                , watcher: fs.watch(path, function(evt){
                    onAccessed(evt, path)
                })
            }
        }catch(e){
            if (e.message.match(/EMFILE/)){
                s.emit('EMFILE', e.message)
            }else{
                s.emit('fw-error', e.message)
            }
        }
    }

    s.unwatch = function(ino){
        var info = s.watchers[ino]
        if (info){
            info.watcher.close()
            delete s.watchers[ino]
        }
    }

    s.clear = function(){
        for (var ino in s.watchers){
            s.watchers[ino].watcher.close()
        }
        s.init()
    }

    s.get = function(path){
        return s.stats[s.inos[path]]
    }

    s.knownPaths = function(){
        return Object.keys(s.inos)
    }

    return s
}


/*

fireworm is a file watcher - the sole export of this module.

*/
module.exports = fireworm
function fireworm(){

    var fw = Object.create(EventEmitter)

    fw.init = function(){
        fw.taskCount = 0
        fw.dirs = fileInfoKeeper()
        fw.files = fileInfoKeeper()
        fw.patterns = new Set
    }
    fw.init()

    fw.pushTask = function(){
        fw.taskCount++
    }

    fw.popTask = function(){
        fw.taskCount--
        if (fw.taskCount === 0){
            process.nextTick(function(){
                fw.emit('ready')
            })
        }
    }

    fw.printInfo = function(){
        console.log('dirs')
        console.log(fw.dirs)
        console.log('files')
        console.log(fw.files)
    }

    fw.clear = function(){
        fw.files.clear()
        fw.dirs.clear()
        fw.init()
    }

    fw.crawl = function(thing, depth, options){
        options = options || {}
        if (fw.hasEMFILE) return
        if (options.maxDepth && depth > options.maxDepth) return
        if (!fw.needToWatchDir(thing)) return
        fw.pushTask()
        fs.stat(thing, function(err, stat){
            if (err){
                fw.popTask()
                return
            }
            if (stat.isDirectory()){
                fw.crawlDir(thing, stat, depth, options, function(){
                    fw.popTask()
                })
            }else if (stat.isFile()){
                fw.crawlFile(thing, stat, options)
                fw.popTask()
            }
        })
    }

    fw.crawlDir = function(dir, stat, depth, options, callback){
        var ino = fw.dirs.get(dir)
        if (ino !== stat.ino){
            fw.dirs.remove(dir)
        }
        fw.dirs.save(dir, stat)
        fw.dirs.watch(dir, fw.onDirAccessed)
        fs.readdir(dir, function(err, files){
            if (err) return
            files.forEach(function(file){
                fw.crawl(path.join(dir, file), depth + 1, options)
            })
            if (callback) callback()
        })
    }

    fw.crawlFile = function(file, stat, options){
        var isNewFile = !fw.files.get(file)
        fw.files.save(file, stat)
        fw.files.watch(file, fw.onFileAccessed)
        if (options.notifyNewFiles && isNewFile){
            fw.emit('change', file)
        }
    }

    fw.needToWatchDir = function(dir){
        dir = path.resolve(dir)
        return fw.patterns.get().reduce(function(curr, pattern){
            pattern = path.resolve(pattern)
            return curr || matchesStart(dir, pattern)
        }, false)
    }

    fw.needToWatchFile = function(file){
        file = path.resolve(file)
        return fw.patterns.get().reduce(function(curr, pattern){
            pattern = path.resolve(pattern)
            return curr || minimatch(file, pattern)
        }, false)
    }

    fw.add = function(){
        for (var i = 0; i < arguments.length; i++){
            fw.patterns.add(arguments[i])
        }
        fw.pushTask()
        process.nextTick(function(){
            fw.crawl('.', 0)
            fw.popTask()
        })
    }

    fw.ifFileOutOfDate = function(filename, callback){
        var oldStat = fw.files.get(filename)
        fs.stat(filename, function(err, stat){
            if (err){
                fw.files.remove(filename)
                if (oldStat) callback(true)
            }else{
                var then = oldStat.mtime.getTime()
                var now = stat.mtime.getTime()
                if (then < now){
                    fw.files.save(filename, stat)
                    callback(true)
                }else{
                    callback(false)
                }
            }
        })
    }

    fw.onFileAccessed = function(evt, filename){
        fw.ifFileOutOfDate(filename, function(yes){
            if (evt === 'rename'){
                // it has been deleted, so re-crawl parent directory
                fw.crawl(path.dirname(filename), 0)
            }
            if (yes){
                fw.emit('change', filename)  
            }
        })
    }

    fw.onDirAccessed = function(evt, dir){
        process.nextTick(function(){
            fw.crawl(dir, 0, {notifyNewFiles: true})
        })
    }

    fw.watchedDirs = function(){
        return fw.dirs.knownPaths()
    }

    fw.watchedFiles = function(){
        return fw.files.knownPaths()
    }

    fw.knownDirs = function(){
        return fw.dirs.knownPaths()
    }

    fw.knownFiles = function(){
        return fw.files.knownPaths()
    }

    fw.onEMFILE = function(){
        fw.hasEMFILE = true
        fw.emit('EMFILE')
        fw.clear()
    }
    fw.dirs.on('EMFILE', fw.onEMFILE)
    fw.files.on('EMFILE', fw.onEMFILE)

    return fw
}
