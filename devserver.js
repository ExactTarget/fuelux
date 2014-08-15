var util = require('util'),
    connect = require('connect'),
    port = 9000;

connect.createServer(connect.static(__dirname)).listen(process.env.PORT || port);
util.puts('Listening on ' + (process.env.PORT || port) + '...');
util.puts('Press Ctrl + C to stop.');