const Global = require(`../schema/global-schema`);
const itemsdb = require("../data/items.json");
const lodash = require("lodash");
async function updateItemShop() {
  let global;
  try {
    global = await Global.findOne();
  } catch (err) {
    console.log(err);
  }
  let itemcooldown = global.itemshopcooldown;
  let items = [];
  let timeout = 86400000;
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
      let randitem6 = lodash.sample(filtereditems);

      let item1 = randitem1.Name;

      let item2 = randitem2.Name;

      let item3 = randitem3.Name;

      let item4 = randitem4.Name;
      let item5 = randitem5.Name;

      let item6 = randitem6.Name;

      items.push(item1);
      items.push(item2);
      items.push(item3);
      items.push(item4);
      items.push(item5);
      items.push(item6);

      await Global.findOneAndUpdate(
        {},
        {
          $set: {
            itemshop: items,
            itemshopcooldown: Date.now(),
          },
        }
      );
      global.update()
      global.markModified("itemshop");
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
      let randitem6 = lodash.sample(filtereditems);

      let item1 = randitem1.Name;

      let item2 = randitem2.Name;

      let item3 = randitem3.Name;

      let item4 = randitem4.Name;
      let item5 = randitem5.Name;
      let item6 = randitem6.Name;

      if (itemcooldown !== null && timeout - (Date.now() - itemcooldown) < 0) {
        console.log(timeout - (Date.now() - itemcooldown) < 0);
        console.log("true");
        items.push(item1);
        items.push(item2);
        items.push(item3);
        items.push(item4);
        items.push(item5);
        items.push(item6);

        await Global.findOneAndUpdate(
          {},
          {
            $set: {
              itemshop: items,
              itemshopcooldown: Date.now(),
            },
          }
        );
        try {

          global.updateOne()
          global.markModified("itemshop");
          global.save();
        }
        catch(err){
          console.log(err)
        }

        console.log(item1);
      } else {
        return;
      }
    }
  }, 600000);
}

module.exports = {
  updateItemShop,
};
