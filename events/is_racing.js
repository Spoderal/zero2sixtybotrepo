const Cooldowns = require(`../schema/cooldowns`);
const cardb = require("../data/cardb.json");
const partdb = require("../data/partsdb.json");
const ocardb = require("../data/oldcars.json");
const User = require(`../schema/profile-schema`);
const Global = require("../schema/global-schema");

async function isracing() {
  let users = await Cooldowns.find();
  let global = await Global.findOne({});
  for (let u in users) {
    let userdata = users[u];
    if (
      userdata !== undefined &&
      userdata !== null &&
      userdata.id &&
      userdata.id !== null
    ) {
      try {
        let bountycool = global.clearbounty;
        let udata = await User.findOne({ id: userdata.id });
        let cooldowns = await Cooldowns.findOne({ id: userdata.id });
        let timeout = 4320000;

        if (bountycool !== null && timeout - (Date.now() - bountycool) < 0) {
          udata.bounty = 0;
          global.clearbounty = Date.now();

          udata.update();
          global.update();
          global.save();
          udata.save();
        }
        cooldowns.save();
      } catch (err) {
        console.log(err);
      }
    }
  }
}

module.exports = {
  isracing,
};
