/**
 * node-archiver
 *
 * Copyright (c) 2012-2013 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/ctalkington/node-archiver/blob/master/LICENSE-MIT
 */

var inherits = require('util').inherits;

var Archiver = require('./core');
var headers = require('../headers/tar');
var util = require('../util');

var tarArchiver = module.exports = function(options) {
  var self = this;

  Archiver.call(self);

  options = options || {};

  options = self.options = util.lo.defaults(options, {
    recordSize: 512,
    recordsPerBlock: 20
  });

  self.recordSize = options.recordSize;
  self.blockSize = options.recordsPerBlock * self.recordSize;
};

inherits(tarArchiver, Archiver);

tarArchiver.prototype._writeData = function(file, sourceBuffer) {
  var self = this;

  var fileSize = file.size;

  file.mode = util.padNumber(file.mode, 7);
  file.uid = util.padNumber(file.uid, 7);
  file.gid = util.padNumber(file.gid, 7);
  file.size = util.padNumber(fileSize, 11);
  file.mtime = util.padNumber(file.mtime, 11);

  var headerBuffer = headers.file.toBuffer(file);

  self.queue.push(headerBuffer);
  self.fileptr += headerBuffer.length;

  self.queue.push(sourceBuffer);
  self.fileptr += sourceBuffer.length;

  var extraBytes = self.recordSize - (fileSize % self.recordSize || self.recordSize);
  var extraBytesBuffer = util.cleanBuffer(extraBytes);
  self.queue.push(extraBytesBuffer);
  self.fileptr += extraBytesBuffer.length;

  self.files.push(file);

  self.busy = false;
};

tarArchiver.prototype.addFile = function(source, data, callback) {
  var self = this;

  if (util.lo.isFunction(callback) === false) {
    callback = util.fallCall;
  }

  if (self.busy) {
    callback(new Error('Previous file not finished'));
    return;
  }

  if (util.lo.isString(source)) {
    source = new Buffer(source, 'utf8');
  }

  var file = util.lo.defaults(data || {}, {
    name: null,
    comment: '',
    date: null,
    gid: 0,
    mode: null,
    mtime: null,
    uid: 0
  });

  if (util.lo.isEmpty(file.name) || util.lo.isString(file.name) === false) {
    callback(new Error('File name is empty or not a valid string value'));
    return;
  }

  file.name = util.unixifyPath(file.name);

  if (file.name.substring(0, 1) === '/') {
    file.name = file.name.substring(1);
  }

  file.type = '0';
  file.size = 0;

  if (util.lo.isDate(file.date)) {
    file.date = file.date;
  } else if (util.lo.isString(file.date)) {
    file.date = new Date(file.date);
  } else if (util.lo.isNumber(file.mtime) === false) {
    file.date = new Date();
  }

  if (util.lo.isNumber(file.mtime) === false) {
    file.mtime = util.octalDateTime(file.date);
  }

  file.gid = util.lo.isNumber(file.gid) ? file.gid : 0;
  file.mode = util.lo.isNumber(file.mode) ? file.mode : parseInt('777', 8) & 0xfff;
  file.uid = util.lo.isNumber(file.uid) ? file.uid : 0;

  self.busy = true;
  self.file = file;

  function onEnd() {
    self._writeData(file, source);

    callback();
  }

  function update(chunk) {
    file.size += chunk.length;
  }

  if (Buffer.isBuffer(source)) {
    update(source);

    util.nextTick(onEnd);
  } else if (util.isStream(source)) {
    util.collectStream(source, function(err, buffer) {
      if (err) {
        self.emit('error', new Error('Stream collection failed'));
        return;
      }

      update(buffer);
      source = buffer;

      util.nextTick(onEnd);
    });
  } else {
    callback(new Error('A valid Stream or Buffer instance is needed as input source'));
  }

  util.nextTick(function() {
    self._read();
  });
};

tarArchiver.prototype.finalize = function(callback) {
  var self = this;

  if (util.lo.isFunction(callback) === false) {
    callback = util.fallCall;
  }

  if (self.files.length === 0) {
    callback(new Error('No files in archive'));
    return;
  }

  var endBytes = self.blockSize - (self.fileptr % self.blockSize);
  var endBytesBuffer = util.cleanBuffer(endBytes);

  self.queue.push(endBytesBuffer);
  self.fileptr += endBytesBuffer.length;

  self.callback = callback;
  self.eof = true;
};
