var fs = require('fs')
  , assert = require('assert')
  , colors = require('colors')
  , RECESS = require('../../lib')

fs.readdirSync('test/fixtures').forEach(function (file, index) {

  RECESS('test/fixtures/' + file, { compile: true  }, function (err, fat) {
    file = file.replace(/less$/, 'css')
    assert.ok(err == null)
    assert.ok(fat.output[0] == fs.readFileSync('test/compiled/' + file, 'utf-8'))
  })

})

console.log("✓ compiling".green)