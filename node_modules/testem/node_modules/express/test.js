
var express = require('./');
var app = express.createServer();

app.get('/', function(req, res){
  res.send('hello');
});

app.listen(3000);
