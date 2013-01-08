var fireworm = require('./fireworm')
var expect = require('chai').expect
var exec = require('child_process').exec
var sinon = require('sinon')
var async = require('async')

describe('fireworm', function(){
    var w
    beforeEach(function(){
        w = fireworm()
    })
    afterEach(function(){
        w.clear()
    })

    context('watching a_dir/*.txt', function(){
        beforeEach(function(done){
            w.add('a_dir/*.txt')
            w.once('ready', done)
        })
        it('watches dirs', function(){
            expect(w.watchedDirs()).to.deep.equal([
                '.', 'a_dir'
            ])
        })
        it('watches no files', function(){
            expect(w.watchedFiles()).to.deep.equal(
                ['a_dir/one.txt', 'a_dir/three.txt'])
        })
    })
    context('watching a_dir/one.txt', function(){
        beforeEach(function(done){
            w.add('a_dir/one.txt')
            w.once('ready', done)
        })
        it('watches files when added', function(){
            expect(w.watchedFiles()).to.deep.equal(['a_dir/one.txt'])
        })
        it('fires change iff when you modify the file', function(done){
            this.timeout(3000)
            setTimeout(function(){
                exec('touch -m a_dir/one.txt')
                w.once('change', function(filename){
                    var changed = sinon.spy()
                    w.once('change', changed)
                    setTimeout(function(){
                        exec('touch -a a_dir/one.txt', function(){
                            setTimeout(function(){
                                expect(changed.called).to.not.be.ok
                                done()
                            }, 10)
                        })
                    }, 1000)
                })
            }, 1000)
        })
    })
    it('watches multiple files', function(done){
        w.add('a_dir/one.txt', 'a_dir/three.txt')
        w.once('ready', function(){
            expect(w.watchedFiles()).to.deep.equal(
                ['a_dir/one.txt', 'a_dir/three.txt'])
            done()
        })
    })
    describe('file watching', function(){
        function cleanUp(done){
            async.series([                      function(next)
            { exec('rm a_dir/four.txt',         function(){ next() }) } , function(next)
            { exec('rm -fr a_dir/another_dir',  function(){ next() }) } , function(next)
            { exec('rm -fr b_dir',              function(){ next() }) }
            ], done)
        }
        afterEach(cleanUp)
        beforeEach(cleanUp)
        it('fires change on file changed', function(done){
            w.add('a_dir/one.txt')
            w.once('ready', function(){
                exec('touch -m a_dir/one.txt')
                w.once('change', function(filename){
                    expect(filename).to.equal('a_dir/one.txt')
                    done()
                })
            })
        })
        it('fires change on new file added', function(done){
            w.add('a_dir/*.txt')
            w.once('ready', function(){
                exec('touch -m a_dir/four.txt')
                w.once('change', function(filename){
                    expect(filename).to.equal('a_dir/four.txt')
                    done()
                })
            })
        })
        it('fires change on new file inside new dir', function(done){
            w.add('a_dir/another_dir/*.txt')
            w.once('ready', function(){
                exec('mkdir a_dir/another_dir', function(){
                    exec('touch a_dir/another_dir/five.txt')
                    w.once('change', function(filename){
                        expect(filename).to.equal('a_dir/another_dir/five.txt')
                        done()
                    })
                })
            })
        })
    })
    it('watches files that are recreated', function(done){
        w.add('a_dir/one.txt')
        w.once('ready', function(){
            exec('touch -m a_dir/one.txt')
            w.once('change', function(filename){
                exec('rm a_dir/one.txt', function(){
                    exec('touch -m a_dir/one.txt')
                    w.once('change', function(filename){
                        expect(filename).to.equal('a_dir/one.txt')
                        expect(w.watchedFiles()).to.deep.equal(['a_dir/one.txt'])
                        done()
                    })
                })
            })
        })
    })
    it('watches dirs that are recreated', function(done){
        exec('mkdir b_dir', function(){
            w.add('b_dir/one.txt')
            w.once('ready', function(){
                exec('touch -m b_dir/one.txt')
                w.once('change', function(filename){
                    exec('rm -rf b_dir', function(){
                        exec('mkdir b_dir && touch -m b_dir/one.txt')
                        w.once('change', function(filename){
                            expect(filename).to.equal('b_dir/one.txt')
                            done()
                        })
                        
                    })

                })
            })
        })
    })
})
