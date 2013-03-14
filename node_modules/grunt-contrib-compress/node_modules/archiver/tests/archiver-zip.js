var crypto = require('crypto');
var fs = require('fs');

var mkdir = require('mkdirp');
var rimraf = require('rimraf');

var archiver = require('../lib/archiver');

var fileOutput = false;

var date1 = new Date('Jan 03 2013 14:26:38 GMT');

mkdir('tmp');

module.exports = {
  featureComments: function(test) {
    test.expect(1);

    var actual;
    var expected = 'b09223a2a00d21d84fd4d9a57a3a7fa451125146';

    var hash = crypto.createHash('sha1');
    var archive = archiver.createZip({
      comment: 'this is a zip comment',
      forceUTC: true
    });

    if (fileOutput) {
      rimraf.sync('tmp/comments.zip');
      var out = fs.createWriteStream('tmp/comments.zip');
      archive.pipe(out);
    }

    var buffer = new Buffer(20000);

    for (var i = 0; i < 20000; i++) {
      buffer.writeUInt8(i&255, i);
    }

    archive.addFile(buffer, {name: 'buffer.txt', date: date1, comment: 'this is a file comment'}, function() {
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

  featureStore: function(test) {
    test.expect(1);

    var actual;
    var expected = '09305770a3272cbcd7c151ee267cb1b0075dd29e';

    var hash = crypto.createHash('sha1');
    var archive = archiver.createZip({
      forceUTC: true
    });

    if (fileOutput) {
      rimraf.sync('tmp/store.zip');
      var out = fs.createWriteStream('tmp/store.zip');
      archive.pipe(out);
    }

    // create a buffer and fill it
    var buffer = new Buffer(20000);

    for (var i = 0; i < 20000; i++) {
      buffer.writeUInt8(i&255, i);
    }

    archive.addFile(buffer, {name: 'buffer.txt', date: date1, store: true}, function() {
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

  inputBuffer: function(test) {
    test.expect(1);

    var actual;
    var expected = 'b18540ab929d83f8ed6d419e6f306fa381aa1f4e';

    var hash = crypto.createHash('sha1');
    var archive = archiver.createZip({
      zlib: {
        level: 1
      },
      forceUTC: true
    });

    if (fileOutput) {
      rimraf.sync('tmp/buffer.zip');
      var out = fs.createWriteStream('tmp/buffer.zip');
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
    test.expect(1);

    var actual;
    var expected = 'd7e3970142a06d4a87fbd6458284eeaf8f5de907';

    var hash = crypto.createHash('sha1');
    var archive = archiver.createZip({
      zlib: {
        level: 1
      },
      forceUTC: true
    });

    if (fileOutput) {
      rimraf.sync('tmp/stream.zip');
      var out = fs.createWriteStream('tmp/stream.zip');
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
    test.expect(1);

    var actual;
    var expected = '3de2c37ba3745618257f6816fe979ee565e24aa0';

    var hash = crypto.createHash('sha1');
    var archive = archiver.createZip({
      zlib: {
        level: 1
      },
      forceUTC: true
    });

    if (fileOutput) {
      rimraf.sync('tmp/string.zip');
      var out = fs.createWriteStream('tmp/string.zip');
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