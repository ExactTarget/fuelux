# zipstream

Creates ZIP output streams.  Depends on Node's build-in zlib module for compression
available since version 0.6.

This version could use some proper testing. Give me a bump if you experience problems.

Written by Antoine van Wel ([website](http://wellawaretech.com)).

# Install

        npm install zipstream


## API

        createZip(options)

Creates a ZipStream object. Options are passed to Zlib.

        ZipStream.addFile(inputStream, options, callback)

Adds a file to the ZIP stream. At his moment, options must contain "name". If the "store" option is set to 
true, the file will be added uncompressed.

        ZipStream.finalize(callback(bytes written))

Finalizes the ZIP. When everything is done, callback is called with the total number of bytes in the ZIP archive.


## Example

        var zipstream = require('zipstream');
        var fs = require('fs');

        var out = fs.createWriteStream('out.zip');
        var zip = zipstream.createZip({ level: 1 });

        zip.pipe(out);

        zip.addFile(fs.createReadStream('README.md'), { name: 'README.md' }, function() {
          zip.addFile(fs.createReadStream('example.js'), { name: 'example.js' }, function() {
            zip.finalize(function(written) { console.log(written + ' total bytes written'); });
          });
        });
