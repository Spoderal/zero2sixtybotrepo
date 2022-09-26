const Global = require(`../schema/global-schema`);
const itemsdb = require('../data/items.json').Other
const lodash = require('lodash')
async function updateItemShop() {
 let global = await Global.findOne()
 let items = []
 setInterval(() => {
     let randitem1 = lodash.sample(itemsdb)
     let randitem2 = lodash.sample(itemsdb)
 let randitem3 = lodash.sample(itemsdb)
 let randitem4 = lodash.sample(itemsdb)
 let randitem5 = lodash.sample(itemsdb)



 let item1 = randitem1.Name
 
 let item2 = randitem2.Name
 

 let item3 = randitem3.Name
 
 let item4 = randitem4.Name
 let item5 = randitem5.Name
 
 
 items.push(item1)
 items.push(item2)
 items.push(item3)
 items.push(item4)
 items.push(item5)
 
 global.itemshop = items
 global.itemshopcooldown = Date.now()

 global.save()

 console.log(item1)
}, 86400000);
}

module.exports = {
    updateItemShop,
};
