var fs = require('fs');
var zlib = require('zlib');

var archiver = require('archiver');
var async = require('async');

var out = fs.createWriteStream('out.tar.gz');
var gzipper = zlib.createGzip();
var archive = archiver.createTar();

archive.on('error', function(err) {
  throw err;
});

archive.pipe(gzipper).pipe(out);

async.forEach(['file1.js', 'file2.js'], function(file, next) {
  archive.addFile(fs.createReadStream(file), { name: file }, next);
}, function(err) {
  if (err) {
    throw err;
  }

  archive.finalize(function(err, written) {
    if (err) {
      throw err;
    }

    console.log(written + ' total bytes written');
  });
});