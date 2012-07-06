var zipstream = require('./zipstream');
var fs = require('fs');

var out = fs.createWriteStream('out.zip');
var zip = zipstream.createZip({ level: 1 });


zip.addFile(fs.createReadStream('README.md'), { name: 'README.md' }, function() {
  zip.addFile(fs.createReadStream('example.js'), { name: 'example.js'  }, function() {
    zip.finalize(function(written) { console.log(written + ' total bytes written'); });
  });
});

zip.pipe(out);
