var fs = require('fs')
  , spawn = require('child_process').spawn
  , dataDir = __dirname + '/data'
  , chai = require('chai')
  , sinon = require('sinon')
  , util = require('util')

exports.expect = chai.expect

exports.sinon = sinon

exports.spy = sinon.spy

exports.stub = sinon.stub

exports.dataDir = dataDir

exports.log = util.debug

function filePath(filename){
    return dataDir + '/' + filename
}
exports.filePath = filePath

function system(args, cb){
    var process = spawn.apply(this, args)
    process.on('exit', cb)
}
exports.system = system

function refreshDataDir(done){
    function mkdir(){
        fs.mkdir(dataDir, function(){
          setTimeout(done, 200)
        })
    }
    fs.stat(dataDir, function(err, stat){
        if (err)
            mkdir()
        else
            system(['rm', ['-fr', dataDir]], function(code){
                mkdir()
            })
    })
}
exports.refreshDataDir = refreshDataDir

function touchFile(file, cb){
    system(['touch', [filePath(file)]], cb)
}
exports.touchFile = touchFile

exports.accessFile = function(file, cb){
    system(['touch', ['-a', filePath(file)]], cb)
}

exports.breath = function(done){
    setTimeout(done, 200)
}

exports.mkdir = function(f, cb){
    fs.mkdir(filePath(f), cb)
}