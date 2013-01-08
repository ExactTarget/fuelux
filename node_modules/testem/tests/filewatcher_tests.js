var FileWatcher = require('../lib/filewatcher.js')
  , test = require('./testutils.js')
  , async = require('async')
  , expect = test.expect
  

describe('FileWatcher', function(){
    var watcher
      , changed
    beforeEach(function(done){
        watcher = new FileWatcher
        changed = test.spy()
        watcher.on('change', changed)
        test.refreshDataDir(done)
    })
    
    it('should add', function(){
        watcher.add(test.dataDir)
    })
    
    /*
    it('should watch for directory changes', function(done){
        watcher.add(test.dataDir)
        async.series([function(next)
        
        { setTimeout(next, 1000) }, function(next)
        { test.touchFile('blah.txt', next) }, function(next)
        { setTimeout(next, 750) }, function(next)
        { expect(changed.calledWith(test.dataDir)).to.be.ok; done() }
        
        ])
    })
    */
    
    it('should ignore(not blow up) if watched file does not exist' , function(){
        watcher.add('thisfiledoesnotexist')
    })
    it('should watch for file changes', function(done){
        async.series([function(next)
        
        { test.touchFile('blah.txt', next) }, function(next)
        { setTimeout(next, 500) }, function(next)
        { watcher.add(test.filePath('blah.txt')), next() }, function(next)
        { setTimeout(next, 500) }, function(next)
        { test.touchFile('blah.txt', next) }, function(next)
        { setTimeout(next, 500) }, function(next)
        { expect(changed.calledWith(test.filePath('blah.txt'))).to.be.ok, done()}
        
        ])
    })
    it('should not trigger changed when only accessed', function(done){
        async.series([function(next)
        
        { test.touchFile('blah.txt', next) }, function(next)
        { watcher.add(test.filePath('blah.txt')), next() }, function(next)
        { setTimeout(next, 200) }, function(next)
        { test.accessFile('blah.txt', next) }, function(next)
        { setTimeout(next, 200) }, function(next)
        { expect(changed.called).to.not.be.ok; done() }
        
        ])        
    })
    it('stops watching once you clear', function(done){
        async.series([function(next)
        
        { test.touchFile('blah.txt', next) }, function(next)
        { setTimeout(next, 500) }, function(next)
        { watcher.add(test.filePath('blah.txt')), next() }, function(next)
        { setTimeout(next, 500) }, function(next)
        { watcher.clear(), next() }, function(next)
        { test.touchFile('blah.txt', next) }, function(next)
        { setTimeout(next, 500) }, function(next)
        { expect(changed.calledWith(test.filePath('blah.txt'))).to.not.be.ok, done()}
        
        ])
    })
    
})