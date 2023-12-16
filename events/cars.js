const User = require(`../schema/profile-schema`);
const cardb = require("../data/cardb.json");
const partdb = require("../data/partsdb.json");
const ocardb = require("../data/oldcars.json");
const parttiersdb = require("../data/parttiers.json");

async function carfix() {
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
          let cars = udata.cars;

        

            userdata.cash += (20000 * cars.length)
          
            udata.save();
        }

        

      } catch (err) {
        console.log(err);
      }
    }
  }
}

module.exports = {
  carfix,
};
