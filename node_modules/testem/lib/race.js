function race(racers, done){

    var raceOver = false
    function finishLine(){
        if (raceOver) return

        raceOver = true
        done.apply(null, arguments)
    }

    racers.forEach(function(racer){
        racer(finishLine)
    })

}

module.exports = race