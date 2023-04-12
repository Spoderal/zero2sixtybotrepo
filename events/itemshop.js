const Global = require(`../schema/global-schema`);
const itemsdb = require("../data/items.json").Other;
const lodash = require("lodash");
async function updateItemShop() {
  let global = await Global.findOne();
  let itemcooldown = global.itemshopcooldown;
  let items = [];
  let timeout = 604800000;
  let itemshopalr = global.itemshop;
  setInterval(async () => {
  if (itemshopalr.length == 0) {
    items = [];
    let itemarr = [];
    for (let i in itemsdb) {
      itemarr.push(itemsdb[i]);
    }

    let filtereditems = itemarr.filter((item) => item.Shop == true);

    let randitem1 = lodash.sample(filtereditems);
    let randitem2 = lodash.sample(filtereditems);
    let randitem3 = lodash.sample(filtereditems);
    let randitem4 = lodash.sample(filtereditems);
    let randitem5 = lodash.sample(filtereditems);

    let item1 = randitem1.Name;

    let item2 = randitem2.Name;

    let item3 = randitem3.Name;

    let item4 = randitem4.Name;
    let item5 = randitem5.Name;

    items.push(item1);
    items.push(item2);
    items.push(item3);
    items.push(item4);
    items.push(item5);

    global.itemshop = items;
    global.itemshopcooldown = Date.now();

    global.save();
  } else {
  
      items = [];
      let itemarr = [];
      for (let i in itemsdb) {
        itemarr.push(itemsdb[i]);
      }

      let filtereditems = itemarr.filter((item) => item.Shop == true);

      let randitem1 = lodash.sample(filtereditems);
      let randitem2 = lodash.sample(filtereditems);
      let randitem3 = lodash.sample(filtereditems);
      let randitem4 = lodash.sample(filtereditems);
      let randitem5 = lodash.sample(filtereditems);

      let item1 = randitem1.Name;

      let item2 = randitem2.Name;

      let item3 = randitem3.Name;

      let item4 = randitem4.Name;
      let item5 = randitem5.Name;

      if (itemcooldown !== null && timeout - (Date.now() - itemcooldown) < 0) {
        items.push(item1);
        items.push(item2);
        items.push(item3);
        items.push(item4);
        items.push(item5);

        global.itemshop = items;
        global.itemshopcooldown = Date.now();

        global.save();

        console.log(item1);
      }
    }
  }, 300000);
  }

module.exports = {
  updateItemShop,
};
