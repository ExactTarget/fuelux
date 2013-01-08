var value = true
  , unique = function(iset){
      var set = {}
        , i = 0
        , l = iset.length

      for(; i < l; i++) {
        set[iset[i]] = value
      }

      return set
  }

var Set = function(input){
  var set

  this.contains = function(prop){
    return !!set[prop]
  }

  this.empty = function(){
    return Object.keys(set).length == 0
  }

  this.size = function(){
    return Object.keys(set).length
  }

  this.get = function(){
    return Object.keys(set)
  }

  this.add = function(prop){
    set[prop] = value
  }

  this.remove = function(prop){
    delete set[prop]
  }

  this.union = function(iset){
    return new Set(this.get().concat(iset.get()))
  }


  this.intersect = function(iset){
    var items = iset.get()
      , i = 0
      , l = items.length
      , oset = new Set()
      , prop

    for(; i < l; i++){
      prop = items[i]
      if(this.contains(prop)){
        oset.add(prop)
      }
    }

    items = this.get()

    for(i = 0, l = items.length; i < l; i++){
      prop = items[i]
      if(iset.contains(prop)){
        oset.add(prop)
      }
    }

    return oset
  }

  this.difference = function(iset){
    var items = iset.get()
      , i = 0
      , l = items.length
      , oset = this.union(iset)
      , prop

    for(; i < l; i++){
      prop = items[i]
      if(this.contains(prop)){
        oset.remove(prop)
      }
    }

    return oset
  }

  this.subset = function(iset){
    var items = iset.get()
      , subset = false
      , i = 0
      , l = items.length

    for(; i < l; i++){
      prop = items[i]
      if(this.contains(prop)){
        subset = true
      }
      else{
        subset = false
        break
      }
    }

    return subset
  }

  this.find = function(pred){
    return this.get().filter(pred)
  }

  this.clear = function(){
    set = {}
  }

  set = unique(input || []) || {}
}

Set.unique = function(iset){
  return Object.keys(unique(iset))
}



module.exports = Set;
