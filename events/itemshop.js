const Global = require(`../schema/global-schema`);
const lodash = require("lodash");
async function updateItemShop() {
  let global = await Global.findOne();  

  console.log(global)
  let itemcooldown = global.itemshopcooldown;
  let timeout = 86400000;
  setInterval(async () => {
    try {
      global = await Global.findOne();
      if (itemcooldown !== null && timeout - (Date.now() - itemcooldown) < 0) {
        global = await Global.findOne();
        let randomgas = lodash.sample([`up`, `down`]);
        let randomupdown = [
          0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1, 1,
        ];

        global.update();
        let randominc = lodash.sample(randomupdown);
        let gas = global.gas;
        if (randomgas == `up`) {
          gas += randominc;
          global.update();
        } else if (randomgas == `down`) {
          gas -= randominc;
          global.update();
        }
        //test
        if (gas < 1) {
          gas = 6;
          global.update();
        }
        if (gas > 15) {
          gas = 6;
          global.update();
        }

        await Global.findOneAndUpdate(
          {},
          {
            $set: {
              gas: gas,
            },
          }
        );

        global.save();
      } else {
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }, 5000);
}

module.exports = {
  updateItemShop,
};
