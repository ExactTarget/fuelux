#!/usr/bin/env node

var net = require('net')
  , repl = require('repl')
  , assert = require('assert')
  , wd = require('./main')
  ;

var startRepl = function() {
  var r = repl.start('(wd): ');
  r.context.assert = assert;
  r.context.wd = wd;
  r.context.help = function() {
    console.log("WD - Shell.");
    console.log("Access the webdriver object via the object: 'wd'");
  };
  
  net.createServer(function (socket) {
    connections += 1;
    repl.start("(wd): ", socket);
  }).listen(process.platform === "win32" ? "\\\\.\\pipe\\node-repl-sock" : "/tmp/node-repl-sock");
};

if (process.argv[2] == "shell") {
  startRepl()
}