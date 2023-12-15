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

          for (let car in cars) {
            let carf = cars[car].Name;
            if(cars[car].Exhaust){
              let price = parttiersdb[`exhaust1`].Cost * cars[car].Exhaust;
              userdata.cash += price
            }
            if(cars[car].Turbo){
              let price = parttiersdb[`turbo1`].Cost * cars[car].Exhaust;
              userdata.cash += price
            }
            if(cars[car].Clutch){
              let price = parttiersdb[`clutch1`].Cost * cars[car].Exhaust;
              userdata.cash += price
            }
            if(cars[car].ECU){
              let price = parttiersdb[`ecu1`].Cost * cars[car].Exhaust;
              userdata.cash += price
            }
            if(cars[car].Gearbox){
              let price = parttiersdb[`gearbox1`].Cost * cars[car].Exhaust;
              userdata.cash += price
            }
            if(cars[car].Tires){
              let price = parttiersdb[`tires1`].Cost * cars[car].Exhaust;
              userdata.cash += price
            }
            if(cars[car].Intake){
              let price = parttiersdb[`intake1`].Cost * cars[car].Exhaust;
              userdata.cash += price
            }
            if(cars[car].Intercooler){
              let price = parttiersdb[`intercooler1`].Cost * cars[car].Exhaust;
              userdata.cash += price
            }
            if(cars[car].Suspension){
              let price = parttiersdb[`suspension1`].Cost * cars[car].Exhaust;
              userdata.cash += price
            }


            let carindb = cardb.Cars[carf.toLowerCase()];

            let carobj = {
              ID: carindb.alias,
              Name: carindb.Name,
              Speed: carindb.Speed,
              Acceleration: carindb["0-60"],
              Handling: carindb.Handling,
              Parts: [],
              Emote: carindb.Emote,
              Image: cars[car].Image,
              Miles: 0,
              Drift: 0,
              WeightStat: carindb.Weight,
              Gas: 10,
              MaxGas: 10,
            };
            cars[car] = carobj;
          }
        }

        

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
