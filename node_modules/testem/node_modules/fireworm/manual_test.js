
var fireworm = require('./fireworm')

var w = fireworm('.')
w.add('d/hello_tests.js')

w.on('change', function(filename){
    console.log(filename + ' changed')
    w.printInfo()
})

setInterval(function(){}, 1000)