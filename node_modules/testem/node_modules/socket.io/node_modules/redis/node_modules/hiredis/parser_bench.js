var hiredis = require("./hiredis");


function go(num) {
  var parser = new hiredis.Reader();

  var i, j;
  var n = 10, m = 0;

  var feed = "*" + n + "\r\n";
  for (i = 0; i < n; i++) {
      if (m > 1) {
          feed += "*" + m + "\r\n";
          for (j = 0; j < m; j++) {
              feed += "$10\r\nxxxxxxxxxx\r\n";
          }
      } else {
          feed += "$10\r\nxxxxxxxxxx\r\n";
      }
  }

  var t1 = new Date, t2;
  for (i = 0; i < num; i++) {
      parser.feed(feed);
      parser.get();
  }

  t2 = new Date;
  console.log("" + num + " took: " + (t2-t1) + "ms");
}


var stdin = process.openStdin();
stdin.on('data', function(chunk) {
    go(parseInt(chunk));
});

