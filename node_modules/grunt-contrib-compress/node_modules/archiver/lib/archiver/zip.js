/**
 * node-archiver
 *
 * Copyright (c) 2012-2013 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/ctalkington/node-archiver/blob/master/LICENSE-MIT
 */

var inherits = require('util').inherits;
var zlib = require('zlib');

var Archiver = require('./core');
var headers = require('../headers/zip');
var util = require('../util');

var zipArchiver = module.exports = function(options) {
  var self = this;

  Archiver.call(self);

  options = self.options = util.lo.defaults(options || {}, {
    comment: '',
    forceUTC: false,
    zlib: {
      level: 6
    }
  });

  if (util.lo.isNumber(options.level)) {
    options.zlib.level = options.level;
    delete options.level;
  }
};

inherits(zipArchiver, Archiver);

// local file header
zipArchiver.prototype._pushLocalFileHeader = function(file) {
  var self = this;

  file.offset = self.fileptr;

  var fileHeaderBuffer = headers.file.toBuffer(file);

  self.queue.push(fileHeaderBuffer);
  self.fileptr += fileHeaderBuffer.length;
};

zipArchiver.prototype._pushDataDescriptor = function(file) {
  var self = this;

  var dataDescriptorBuffer = headers.descriptor.toBuffer(file);

  self.queue.push(dataDescriptorBuffer);
  self.fileptr += dataDescriptorBuffer.length;
};

zipArchiver.prototype._pushCentralDirectory = function() {
  var self = this;
  var cdoffset = self.fileptr;

  var ptr = 0;
  var cdsize = 0;

  var centralDirectoryBuffer;

  for (var i = 0; i < self.files.length; i++) {
    var file = self.files[i];

    centralDirectoryBuffer = headers.centralHeader.toBuffer(file);

    self.queue.push(centralDirectoryBuffer);
    ptr += centralDirectoryBuffer.length;
  }

  cdsize = ptr;

  var centralDirectoryFooterData = {
    directoryRecordsDisk: self.files.length,
    directoryRecords: self.files.length,
    directorySize: cdsize,
    directoryOffset: cdoffset,
    comment: self.options.comment
  };

  var centralDirectoryFooterBuffer = headers.centralFooter.toBuffer(centralDirectoryFooterData);

  self.queue.push(centralDirectoryFooterBuffer);
  ptr += centralDirectoryFooterBuffer.length;
  self.fileptr += ptr;
};

zipArchiver.prototype.addFile = function(source, data, callback) {
  var self = this;

  if (util.lo.isFunction(callback) === false) {
    callback = util.fallCall;
  }

  if (self.busy) {
    callback(new Error('Previous file not finished'));
    return;
  }

  if (util.lo.isString(source)) {
    source = new Buffer(source, 'utf-8');
  }

  var file = util.lo.defaults(data || {}, {
    name: null,
    comment: '',
    date: null,
    mode: null,
    store: false,
    lastModifiedDate: null
  });

  if (util.lo.isEmpty(file.name) || util.lo.isString(file.name) === false) {
    callback(new Error('File name is empty or not a valid string value'));
    return;
  }

  file.name = util.unixifyPath(file.name);

  if (file.name.substring(0, 1) === '/') {
    file.name = file.name.substring(1);
  }

  if (util.lo.isDate(file.date)) {
    file.date = file.date;
  } else if (util.lo.isString(file.date)) {
    file.date = new Date(file.date);
  } else if (util.lo.isNumber(file.lastModifiedDate) === false) {
    file.date = new Date();
  }

  if (util.lo.isNumber(file.lastModifiedDate) === false) {
    file.lastModifiedDate = util.dosDateTime(file.date, self.options.forceUTC);
  }

  file.versionMadeBy = 20;
  file.versionNeededToExtract = 20;
  file.flags = (1<<3) | (1<<11);
  file.compressionMethod = file.store ? 0 : 8;
  file.uncompressedSize = 0;
  file.compressedSize = 0;

  self.busy = true;
  self.file = file;
  self._pushLocalFileHeader(file);

  var checksum = util.crc32.createCRC32();

  function onEnd() {
    file.crc32 = checksum.digest();
    if (file.store) {
      file.compressedSize = file.uncompressedSize;
    }

    self.fileptr += file.compressedSize;
    self._pushDataDescriptor(file);

    self.files.push(file);
    self.busy = false;
    callback();
  }

  function update(chunk) {
    checksum.update(chunk);
    file.uncompressedSize += chunk.length;
  }

  if (file.store) {
    if (Buffer.isBuffer(source)) {
      update(source);

      self.queue.push(source);
      util.nextTick(onEnd);
    } else {
      // Assume stream
      source.on('data', function(chunk) {
        update(chunk);
        self.queue.push(chunk);
      });

      source.on('end', onEnd);
    }
  } else {
    var deflate = zlib.createDeflateRaw(self.zlib);

    deflate.on('data', function(chunk) {
      file.compressedSize += chunk.length;
      self.queue.push(chunk);
    });

    deflate.on('end', onEnd);

    if (Buffer.isBuffer(source)) {
      update(source);
      deflate.write(source);
      deflate.end();
    } else if (util.isStream(source)) {
      source.on('data', function(chunk) {
        update(chunk);
        deflate.write(chunk); //TODO check for false & wait for drain
      });

      source.on('end', function() {
        deflate.end();
      });
    } else {
      callback(new Error('A valid Stream or Buffer instance is needed as input source'));
    }
  }

  util.nextTick(function() {
    self._read();
  });
};

zipArchiver.prototype.finalize = function(callback) {
  var self = this;

  if (util.lo.isFunction(callback) === false) {
    callback = util.fallCall;
  }

  if (self.files.length === 0) {
    callback(new Error('No files in archive'));
    return;
  }

  self.callback = callback;
  self._pushCentralDirectory();
  self.eof = true;
};
