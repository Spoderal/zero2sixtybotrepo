const Global = require(`../schema/global-schema`);
const itemsdb = require("../data/items.json");
const lodash = require("lodash");
const { randomNoRepeats, randomRange } = require("../common/utils");
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
      var chooser = randomNoRepeats(filtereditems);

      let randitem1 = chooser();
      let randitem2 = chooser();
      let randitem3 = chooser();
      let randitem4 = chooser();
      let randitem5 = chooser();
      let randitem6 = chooser();

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

      global.itemshop = items;
      global.update();
      global.itemshopcooldown = Date.now();

      global.update();
      global.save();
    } else {
      items = [];
      let itemarr = [];
      for (let i in itemsdb) {
        itemarr.push(itemsdb[i]);
      }

      let filtereditems = itemarr.filter((item) => item.Shop == true);

      var chooser2 = randomNoRepeats(filtereditems);

      let randitem1 = chooser2();
      let randitem2 = chooser2();
      let randitem3 = chooser2();
      let randitem4 = chooser2();
      let randitem5 = chooser2();
      let randitem6 = chooser2();

      let item1 = randitem1.Name;

      let item2 = randitem2.Name;

      let item3 = randitem3.Name;

      let item4 = randitem4.Name;
      let item5 = randitem5.Name;
      let item6 = randitem6.Name;

      if (itemcooldown !== null && timeout - (Date.now() - itemcooldown) > 0) {
        return;
      } else {
        console.log(timeout - (Date.now() - itemcooldown));
        console.log("true");
        items.push(item1);
        items.push(item2);
        items.push(item3);
        items.push(item4);
        items.push(item5);
        items.push(item6);

        try {
          global.itemshop = items;
          global.update();
          global.itemshopcooldown = Date.now();

          global.update();
          let randomgas = lodash.sample([`up`, `down`]);
          let randomupdown = [
            0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1, 1,
          ];
          let randominc = lodash.sample(randomupdown);
          if (randomgas == `up`) {
            global.gas += randominc;
            global.update();
          } else if (randomgas == `down`) {
            global.gas -= randominc;
            global.update();
          }
          //test
          if (global.gas < 1) {
            global.gas = 6;
            global.update();
          }

          global.update();
          global.save();
        } catch (err) {
          console.log(err);
        }

        console.log(item1);
      }
    }
  }, 60000);
}

module.exports = {
  updateItemShop,
};
