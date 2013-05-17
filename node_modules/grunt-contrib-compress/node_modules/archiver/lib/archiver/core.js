/**
 * node-archiver
 *
 * Copyright (c) 2012-2013 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/ctalkington/node-archiver/blob/master/LICENSE-MIT
 */

require('../compat/buffer');

var inherits = require('util').inherits;
var Transform = require('stream').Transform || require('readable-stream/transform');

var util = require('../util');

var Archiver = module.exports = function(options) {
  options = util.defaults(options, {
    highWaterMark: 64 * 1024
  });

  Transform.call(this, options);

  this.archiver = {
    processing: false,
    finalize: false,
    finalized: false,
    writableEndCalled: false,
    pointer: 0,
    file: {},
    files: [],
    queue: []
  };

  var catchEarlyExit = function() {
    if (this._readableState.endEmitted === false) {
      throw new Error('Process exited before Archiver could finish emitting data');
    }
  }.bind(this);

  process.once('exit', catchEarlyExit);

  this.once('end', function() {
    process.removeListener('exit', catchEarlyExit);
  });
};

inherits(Archiver, Transform);

Archiver.prototype._transform = function(chunk, encoding, callback) {
  callback(null, chunk);
};

Archiver.prototype._push = function(data) {
  if (data) {
    this.archiver.pointer += data.length;
  }

  return this.push(data);
};

Archiver.prototype._emitErrorCallback = function(err, data) {
  if (err) {
    this.emit('error', err);
  }
};

Archiver.prototype._processFile = function(source, data, callback) {
  callback(new Error('method not implemented'));
};

Archiver.prototype._processQueue = function() {
  if (this.archiver.processing) {
    return;
  }

  if (this.archiver.queue.length > 0) {
    var next = this.archiver.queue.shift();

    this._processFile(next.source, next.data, next.callback);
  } else if (this.archiver.finalized && this.archiver.writableEndCalled === false) {
    this.archiver.writableEndCalled = true;
    this.end();
  } else if (this.archiver.finalize && this.archiver.queue.length === 0) {
    this._finalize();
  }
};

Archiver.prototype._finalize = function() {
  this.archiver.finalize = false;
  this.archiver.finalized = true;

  this._processQueue();
};

Archiver.prototype.append = function(source, data, callback) {
  if (typeof source === 'string') {
    source = new Buffer(source, 'utf-8');
  } else if (source && typeof source.pause === 'function' && !source._readableState) {
    source.pause();
  }

  if (typeof callback !== 'function') {
    callback = this._emitErrorCallback.bind(this);
  }

  if (this.archiver.processing || this.archiver.queue.length) {
    this.archiver.queue.push({
      data: data,
      source: source,
      callback: callback
    });
  } else {
    this._processFile(source, data, callback);
  }

  return this;
};

Archiver.prototype.addFile = Archiver.prototype.append;

Archiver.prototype.finalize = function(callback) {
  if (typeof callback === 'function') {
    this.once('end', function() {
      callback(null, this.archiver.pointer);
    }.bind(this));
  }

  this.archiver.finalize = true;

  this._processQueue();

  return this;
};