const partdb = require('../data/partsdb.json')


const perk_rocket = function(speed) {
    let speedboost = speed * 1.1
    return speedboost
}

const perk_nitrous = function(speed, perk) {
    let boost

    if(perk == "nitro boost 1"){
        boost = speed * 1.05
    }
   else if(perk == "nitro boost 2"){
        boost = speed * 1.1
    }
    else  if(perk == "nitro boost 3"){
        boost = speed * 1.15
    }
    else  if(perk == "nitro boost 4"){
        boost = speed * 1.2
    }
    else  if(perk == "nitro boost 5"){
        boost = speed * 1.25
    }

  
    return boost
}
    

module.exports = {
    perk_rocket,
    perk_nitrous
};
