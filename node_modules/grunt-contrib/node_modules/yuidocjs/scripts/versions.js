#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    package = require(path.join(__dirname, '../', 'package.json')),
    version = package.version,
    api = path.join(__dirname, '../', 'conf', 'yuidoc.json'),
    doc = path.join(__dirname, '../', 'conf', 'docs', 'project.json');

console.log('[version]', version);
console.log('[api]', api);
console.log('[doc]', doc);

var apiJSON = require(api),
    docJSON = require(doc);

apiJSON.version = version;
docJSON.version = version;

fs.writeFileSync(api, JSON.stringify(apiJSON, null, 2));
fs.writeFileSync(doc, JSON.stringify(docJSON, null, 2));
console.log('[done]');
