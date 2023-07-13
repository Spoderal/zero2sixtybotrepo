const User = require(`../schema/profile-schema`);
const cardb = require("../data/cardb.json");
const partdb = require("../data/partsdb.json");
const ocardb = require("../data/oldcars.json");

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

          for (let car in cars) {
            let carf = cars[car].Name;

            let carindb = cardb.Cars[carf.toLowerCase()];

            let carobj = {
              ID: carindb.alias,
              Name: carindb.Name,
              Speed: carindb.Speed,
              Acceleration: carindb["0-60"],
              Handling: carindb.Handling,
              Parts: [],
              Emote: carindb.Emote,
              Image: carindb.Image,
              Miles: 0,
              Drift: 0,
              WeightStat: carindb.Weight,
              Gas: 10,
              MaxGas: 10,
            };
            cars[car] = carobj;
          }
        }
        udata.cash += 50000;
        udata.markModified("cars");
        udata.save();
      } catch (err) {
        console.log(err);
      }
    }
  }
}

module.exports = {
  carfix,
};
