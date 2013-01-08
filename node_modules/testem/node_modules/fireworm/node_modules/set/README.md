# Set.js  
  
I created this because I noticed that there were no actual set object implementations in JavaScript and also to learn a bit more about creating node modules.  
  
## Usage  
  
Create an array of items and then pass it to Set.  
`var Set = require('./set')`  
`var set = new Set([0,1,1])`  
And then when we get it  
`set.get() // [0,1]`  
  
## API  
There are various Set functions available  
  
### Static functions  
`Set#unique` given an array, return an array with all duplicates removed.  
  
### Instance functions  
`Set#contains` return whether a given property is available.  
`Set#empty` return whether the set in empty.  
`Set#size` return the size of the Set.  
`Set#get` return the set as an Array.  
  
`Set#add` add an item to the Set.  
`Set#remove` remove an item from the set.  
`Set#clear` remove all items from the set.  
  
`Set#union` return a new set that is the union of the set with another one.  
`Set#intersect` return a new set that is the intersection of the set with another one.  
`Set#difference` return a new set that is the difference of the set with another one.  
  
`Set#find` return an array with all items that match the predicate.  
