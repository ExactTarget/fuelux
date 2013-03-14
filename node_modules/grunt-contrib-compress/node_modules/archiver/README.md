# Archiver v0.3.0 [![Build Status](https://secure.travis-ci.org/ctalkington/node-archiver.png?branch=master)](http://travis-ci.org/ctalkington/node-archiver)

Creates Archives (Zip, Tar) via Node Streams. Depends on Node's build-in zlib module for compression available since version 0.6.3.

## Install

```bash
npm install archiver --save
```

You can also use `npm install https://github.com/ctalkington/node-archiver/archive/master.tar.gz` to test upcoming versions.

## Core

### Methods

#### create(type, options)

Creates an Archiver instance based on the type (ie zip/tar) passed.

#### createZip(options)

Creates an Archiver Zip instance.

#### createTar(options)

Creates an Archiver Tar instance.

### Instance Methods

#### addFile(input, data, callback(err))

Adds a file to the instance. Input can be in the form of a text string, buffer, or stream. When the instance has received, processed, and emitted the input, the callback is fired.

#### finalize(callback(err, bytesWritten))

Finalizes the instance. When the instance's stream has finished emitting, the callback is fired.

## Zip

### Options

#### comment `string`

Sets the zip comment.

#### forceUTC `boolean`

If true, forces the file date and time to UTC. Helps with testing across timezones.

#### zlib `object`

Passed to node's [zlib](http://nodejs.org/api/zlib.html#zlib_options) module to control compression. Options may vary by node version.

### File Data

#### name `string` `required`

Sets the file name including internal path.

#### date `string|Date`

Sets the file date. This can be any valid date string or object. Defaults to current time in locale.

#### store `boolean`

If true, file contents will be stored without compression.

#### comment `string`

Sets the file comment.

## Tar (beta)

### Options

#### recordSize `number`

Sets the size (in bytes) of each record in a block, default is 512 (for advanced users only).

#### recordsPerBlock `number`

Sets the number of records in a block, default is 20 (for advanced users only).

### File Data

#### name `string` `required`

Sets the file name including internal path.

#### date `string|Date`

Sets the file date. This can be any valid date string or object. Defaults to current time in locale.

## Examples

Here are a few examples to get you started. All examples use the [async module](https://github.com/caolan/async) to avoid deep nesting of callbacks.

* [basic packing](https://github.com/ctalkington/node-archiver/blob/master/examples/pack.js)
* [tar packing with gzip](https://github.com/ctalkington/node-archiver/blob/master/examples/pack-tgz.js)

Take a peek at the [examples](https://github.com/ctalkington/node-archiver/blob/master/examples) folder for a complete listing.

## Contributing

see [CONTRIBUTING](https://github.com/ctalkington/node-archiver/blob/master/CONTRIBUTING.md).

## Changelog

see [CHANGELOG](https://github.com/ctalkington/node-archiver/blob/master/CHANGELOG).

## Credits

Originally inspired by Antoine van Wel's [node-zipstream](https://github.com/wellawaretech/node-zipstream).

## Licensing

This project's code is licensed under the MIT license. see [LICENSE-MIT](https://github.com/ctalkington/node-archiver/blob/master/LICENSE-MIT).