const User = require(`../schema/profile-schema`);
const cardb = require("../data/cardb.json");
const partdb = require("../data/partsdb.json");
const ocardb = require("../data/oldcars.json");

async function season() {
  let users = await User.find();

  for (let u in users) {
    let userdata = users[u];
    if (
      userdata !== undefined &&
      userdata !== null &&
      userdata.id &&
      userdata.id !== null
    ) {
      try {
        let udata = await User.findOne({ id: userdata.id });
        console.log(udata);
        if (udata !== null) {
            udata.notoriety = 0;
            udata.rp4 = 0;
            udata.season1claimed = 0;
            udata.crewseason = 0;
            udata.save();
        }


      } catch (err) {
        console.log(err);
      }
    }
  }
}

module.exports = {
  season,
};
