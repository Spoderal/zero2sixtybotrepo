const User = require(`../schema/profile-schema`);
const cardb = require("../data/cardb.json");

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

        udata.cash = 0;
        udata.items = [];
        udata.parts = [];
        udata.racerank = 0;
        udata.driftrank = 0;
        udata.prestige = 0;
        udata.work = null;
        udata.crew = {};
        udata.rp4 = 0;
        udata.ckeys = 0;
        udata.ekeys = 0;
        udata.rkeys = 0;
        udata.barnmaps = 0;
        udata.blueprints = 0;
        udata.lockpicks = 0;
        udata.garageLimit = 10;
        udata.houses = [];
        udata.squads = [];
        udata.tier = 1;
        udata.crewseason = [];
        udata.business = {};

        udata.markModified("cars");
        udata.markModified("items");
        udata.markModified("parts");
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
