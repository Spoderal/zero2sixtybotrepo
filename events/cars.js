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
              caracc -= parseFloat(
                partdb.Parts[exhaust.toLowerCase()].AddedSixty
              );
            }
            if (intake) {
              carspeed += parseInt(
                partdb.Parts[intake.toLowerCase()].AddedSpeed
              );
              caracc -= parseFloat(
                partdb.Parts[intake.toLowerCase()].AddedSixty
              );
            }
            if (turbo) {
              carspeed += parseInt(
                partdb.Parts[turbo.toLowerCase()].AddedSpeed
              );
              caracc -= parseFloat(
                partdb.Parts[turbo.toLowerCase()].AddedSixty
              );
            }
            if (suspension) {
              carspeed += parseInt(
                partdb.Parts[suspension.toLowerCase()].AddedSpeed
              );
              caracc -= parseFloat(
                partdb.Parts[suspension.toLowerCase()].AddedSixty
              );
            }
            if (clutch) {
              carspeed += parseInt(
                partdb.Parts[clutch.toLowerCase()].AddedSpeed
              );
              caracc -= parseFloat(
                partdb.Parts[clutch.toLowerCase()].AddedSixty
              );
            }
            if (ecu) {
              carspeed += parseInt(partdb.Parts[ecu.toLowerCase()].AddedSpeed);
              caracc -= parseFloat(partdb.Parts[ecu.toLowerCase()].AddedSixty);
            }
            if (tires) {
              carspeed += parseInt(
                partdb.Parts[tires.toLowerCase()].AddedSpeed
              );
              caracc -= parseFloat(
                partdb.Parts[tires.toLowerCase()].AddedSixty
              );
            }

            if (gearbox) {
              carspeed += parseInt(
                partdb.Parts[gearbox.toLowerCase()].AddedSpeed
              );
              caracc -= parseFloat(
                partdb.Parts[gearbox.toLowerCase()].AddedSixty
              );
            }
            if (intercooler) {
              carspeed += parseInt(
                partdb.Parts[intercooler.toLowerCase()].AddedSpeed
              );
              caracc -= parseFloat(
                partdb.Parts[intercooler.toLowerCase()].AddedSixty
              );
            }
            if (spoiler) {
              carspeed += parseInt(
                partdb.Parts[spoiler.toLowerCase()].AddedSpeed
              );
              caracc -= parseFloat(
                partdb.Parts[spoiler.toLowerCase()].AddedSixty
              );
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
}

module.exports = {
  carfix,
};
