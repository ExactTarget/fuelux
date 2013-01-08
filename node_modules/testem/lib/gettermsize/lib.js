function getStdoutSize(){
    if (process.stdout.getWindowSize)
        return process.stdout.getWindowSize()
    return null
}

function getTtySize(){
    var tty = require('tty')
    if (tty && tty.getWindowSize) {
        var size = tty.getWindowSize(process.stdout)
        if (size === 80) //tty bug; should be [cols, lines]
            return null
        return size
    }
    return null
}

function getSpawnSize(cb){
    var spawn = require('child_process').spawn
    var proc = spawn('resize')
    proc.stdout.on('data', function(data){
        data = String(data)
        var lines = data.split('\n'),
            cols = Number(lines[0].match(/^COLUMNS=([0-9]+);$/)[1]),
            lines = Number(lines[1].match(/^LINES=([0-9]+);$/)[1])
        cb(cols, lines)
    })
}

module.exports = {
    getStdoutSize: getStdoutSize,
    getTtySize: getTtySize,
    getSpawnSize: getSpawnSize
}
