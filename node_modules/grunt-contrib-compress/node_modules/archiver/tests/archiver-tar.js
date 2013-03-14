var crypto = require('crypto');
var fs = require('fs');

var mkdir = require('mkdirp');
var rimraf = require('rimraf');

var archiver = require('../lib/archiver');

var fileOutput = false;

var date1 = new Date('Jan 03 2013 14:26:38 GMT');

mkdir('tmp');

module.exports = {
  inputBuffer: function(test) {
    test.expect(1);

    var actual;
    var expected = 'e87af3cdd4b01bb72ebab46baa97ee1eb814a1d3';

    var hash = crypto.createHash('sha1');
    var archive = archiver.createTar();

    if (fileOutput) {
      rimraf.sync('tmp/buffer.tar');
      var out = fs.createWriteStream('tmp/buffer.tar');
      archive.pipe(out);
    }

    var buffer = new Buffer(20000);

    for (var i = 0; i < 20000; i++) {
      buffer.writeUInt8(i&255, i);
    }

    archive.addFile(buffer, {name: 'buffer.txt', date: date1}, function() {
      archive.finalize();
    });

    archive.on('error', function(err) {
      throw err;
    });

    archive.on('data', function(data) {
      hash.update(data);
    });

    archive.on('end', function() {
      actual = hash.digest('hex');
      test.equals(actual, expected, 'data hex values should match.');
      test.done();
    });
  },

  inputStream: function(test) {
    var actual;
    var expected = 'da02a931d670f725c0de20ef30b112b53d149a3d';

    var hash = crypto.createHash('sha1');
    var archive = archiver.createTar();

    if (fileOutput) {
      rimraf.sync('tmp/stream.tar');
      var out = fs.createWriteStream('tmp/stream.tar');
      archive.pipe(out);
    }

    rimraf.sync('tmp/stream.txt');
    fs.writeFileSync('tmp/stream.txt', 'this is a text file');

    archive.addFile(fs.createReadStream('tmp/stream.txt'), {name: 'stream.txt', date: date1}, function() {
      archive.finalize();
    });

    archive.on('error', function(err) {
      throw err;
    });

    archive.on('data', function(data) {
      hash.update(data);
    });

    archive.on('end', function() {
      actual = hash.digest('hex');
      test.equals(actual, expected, 'data hex values should match.');
      test.done();
    });
  },

  inputString: function(test) {
    var actual;
    var expected = '333f843838ba5ee7727b3cc8afa017cab3d70d72';

    var hash = crypto.createHash('sha1');
    var archive = archiver.createTar();

    if (fileOutput) {
      rimraf.sync('tmp/string.tar');
      var out = fs.createWriteStream('tmp/string.tar');
      archive.pipe(out);
    }

    archive.addFile('string', {name: 'string.txt', date: date1}, function() {
      archive.finalize();
    });

    archive.on('error', function(err) {
      throw err;
    });

    archive.on('data', function(data) {
      hash.update(data);
    });

    archive.on('end', function() {
      actual = hash.digest('hex');
      test.equals(actual, expected, 'data hex values should match.');
      test.done();
    });
  }
};