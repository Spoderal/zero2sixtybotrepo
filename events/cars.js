const User = require(`../schema/profile-schema`);
const cardb = require("../data/cardb.json");
const partdb = require("../data/partsdb.json");

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

            let carspeed = carindb.Speed;
            let caracc = carindb["0-60"];

            let exhaust = cars[car].Exhaust;
            let intake = cars[car].Intake;
            let suspension = cars[car].Suspension;
            let turbo = cars[car].Turbo;
            let clutch = cars[car].Clutch;
            let ecu = cars[car].ECU;
            let tires = cars[car].Exhaust;
            let gearbox = cars[car].Gearbox;
            let intercooler = cars[car].Intercooler;
            let spoiler = cars[car].Spoiler;

            if (exhaust) {
              carspeed += parseInt(
                partdb.Parts[exhaust.toLowerCase()].AddedSpeed
              );
              let newacc = (caracc -= parseFloat(
                partdb.Parts[exhaust.toLowerCase()].AddedSixty
              ));
              if (newacc > 2) {
                caracc = newacc;
              } else {
                caracc = 2;
              }
            }
            if (intake) {
              carspeed += parseInt(
                partdb.Parts[intake.toLowerCase()].AddedSpeed
              );
              let newacc = (caracc -= parseFloat(
                partdb.Parts[intake.toLowerCase()].AddedSixty
              ));
              if (newacc > 2) {
                caracc = newacc;
              } else {
                caracc = 2;
              }
            }
            if (turbo) {
              carspeed += parseInt(
                partdb.Parts[turbo.toLowerCase()].AddedSpeed
              );
              let newacc = (caracc -= parseFloat(
                partdb.Parts[turbo.toLowerCase()].AddedSixty
              ));
              if (newacc > 2) {
                caracc = newacc;
              } else {
                caracc = 2;
              }
            }
            if (suspension) {
              carspeed += parseInt(
                partdb.Parts[suspension.toLowerCase()].AddedSpeed
              );
              let newacc = (caracc -= parseFloat(
                partdb.Parts[suspension.toLowerCase()].AddedSixty
              ));
              if (newacc > 2) {
                caracc = newacc;
              } else {
                caracc = 2;
              }
            }
            if (clutch) {
              carspeed += parseInt(
                partdb.Parts[clutch.toLowerCase()].AddedSpeed
              );
              let newacc = (caracc -= parseFloat(
                partdb.Parts[clutch.toLowerCase()].AddedSixty
              ));
              if (newacc > 2) {
                caracc = newacc;
              } else {
                caracc = 2;
              }
            }
            if (ecu) {
              carspeed += parseInt(partdb.Parts[ecu.toLowerCase()].AddedSpeed);
              let newacc = (caracc -= parseFloat(
                partdb.Parts[ecu.toLowerCase()].AddedSixty
              ));
              if (newacc > 2) {
                caracc = newacc;
              } else {
                caracc = 2;
              }
            }
            if (tires) {
              carspeed += parseInt(
                partdb.Parts[tires.toLowerCase()].AddedSpeed
              );
              let newacc = (caracc -= parseFloat(
                partdb.Parts[tires.toLowerCase()].AddedSixty
              ));
              if (newacc > 2) {
                caracc = newacc;
              } else {
                caracc = 2;
              }
            }

            if (gearbox) {
              carspeed += parseInt(
                partdb.Parts[gearbox.toLowerCase()].AddedSpeed
              );
              let newacc = (caracc -= parseFloat(
                partdb.Parts[gearbox.toLowerCase()].AddedSixty
              ));
              if (newacc > 2) {
                caracc = newacc;
              } else {
                caracc = 2;
              }
            }
            if (intercooler) {
              carspeed += parseInt(
                partdb.Parts[intercooler.toLowerCase()].AddedSpeed
              );
              let newacc = (caracc -= parseFloat(
                partdb.Parts[intercooler.toLowerCase()].AddedSixty
              ));
              if (newacc > 2) {
                caracc = newacc;
              } else {
                caracc = 2;
              }
            }
            if (spoiler) {
              carspeed += parseInt(
                partdb.Parts[spoiler.toLowerCase()].AddedSpeed
              );
              let newacc = (caracc -= parseFloat(
                partdb.Parts[spoiler.toLowerCase()].AddedSixty
              ));
              if (newacc > 2) {
                caracc = newacc;
              } else {
                caracc = 2;
              }
            }
            cars[car].Speed = carspeed;
            cars[car].Acceleration = caracc;
          }
          udata.markModified("cars");
          udata.save();
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  console.log("done");
}

module.exports = {
  carfix,
};
