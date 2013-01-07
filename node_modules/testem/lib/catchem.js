var Catchem = {
    __proto__: require('events').EventEmitter.prototype
}

Function.prototype.catchem = function(){
    var func = this
    return function(){
        try{
            return func.apply(this, arguments)
        }catch(e){
            Catchem.emit('err', e)
        }
    }
}

module.exports = Catchem