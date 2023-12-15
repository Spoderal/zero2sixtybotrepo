const cardb = require("../data/cardb.json");
const itemdb = require("../data/items.json");
const partdb = require("../data/partsdb.json").Parts;
const Global = require("../schema/global-schema");
const lodash = require("lodash")
let array = [];
let array2 = [];

async function itemshop() {
    setInterval(async () => {
        

  let global;
  try {
    global = await Global.findOne({});
  } catch (err) {
    console.log(err);
  }

  let daily = global.itemshopcooldown

  let timeout = 604800000

  if (daily !== null && timeout - (Date.now() - daily) > 0) {
    
   return 
  } else {
    let itemshops = []
    let itemshop = []
    for(let item in itemdb){
        if(itemdb[item].Shop == true && itemdb[item].Price > 0){
            itemshops.push(itemdb[item])

        }
    }
    console.log(itemshops[0])
    for (let i = 0; i < 5; i++) {
        var random_item = lodash.sample(itemshops);
        itemshop.push(random_item);
        itemshops.splice(itemshops.indexOf(random_item), 1);
     }
     global.itemshop = itemshop
     global.itemshopcooldown = Date.now()
     console.log(global.shopitems)


}
  try {
    global.save();
  } catch (err) {
    console.log(err);
  }
}, 5000);
}


module.exports = {
    itemshop,
  };
  
