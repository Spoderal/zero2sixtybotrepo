const User = require(`../schema/profile-schema`);
const cardb = require("../data/cardb.json");
const partdb = require("../data/partsdb.json");
const ocardb = require("../data/oldcars.json");
const parttiersdb = require("../data/parttiers.json");

async function carfix() {
  let users = await User.find();
  let cars = []
  for(let car in cardb.Cars){
    cars.push(cardb.Cars[car])
  }
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

        if (udata !== null) {
         
          for(let c in udata.cars){
            let car = udata.cars[c];
            let carname = car.Name;
            let carinfo = cars.filter((car) => car.Name.toLowerCase() === carname.toLowerCase())[0]
            console.log(carinfo.Name)
            if(carinfo){
              if(carinfo.Tier !== car.Tier){
                car.Tier = carinfo.Tier;
              }
              if(carinfo.Speed !== car.Speed){
                car.Speed = carinfo.Speed;
              }
              if(carinfo["0-60"] !== car.Acceleration){
                car.Acceleration = carinfo["0-60"];
              }
              if(carinfo.Handling !== car.Handling){
                car.Handling = carinfo.Handling;
              }
              if(carinfo.Weight!== car.WeightStat){
                car.WeightStat = carinfo.Weight;
              }
              if(carinfo.Price !== car.Resale){
                car.Resale = carinfo.Price * 0.75
              }
      
              if(carinfo.Drivetrain !== car.drivetrain){
                car.drivetrain = carinfo.Drivetrain;
              }
              if(carinfo.Engine !== car.engine){
                udata.parts.push(car.engine)
                car.engine = carinfo.Engine;
              }

              if(car.turbo !== null){
                udata.parts.push(car.turbo.toLowerCase())
              }
              if(car.tires !== null){
                udata.parts.push(car.tires.toLowerCase())
              }
              if(car.intake !== null){
                udata.parts.push(car.intake.toLowerCase())
              }
              if(car.exhaust !== null){
                udata.parts.push(car.exhaust.toLowerCase())
              }
              if(car.gearbox !== null){
                udata.parts.push(car.gearbox.toLowerCase())
              }
              if(car.suspension !== null){
                udata.parts.push(car.suspension.toLowerCase())
              }
              if(car.intercooler !== null){
                udata.parts.push(car.intercooler.toLowerCase())
              }
              if(car.springs !== null){
                udata.parts.push(car.springs.toLowerCase())
              }
              if(car.weight !== null){
                udata.parts.push(car.weight.toLowerCase())
              }
              if(car.ecu !== null){
                udata.parts.push(car.ecu.toLowerCase())
              }
              if(car.brakes !== null){
                udata.parts.push(car.brakes.toLowerCase())
              }
              if(car.spoiler !== null){
                udata.parts.push(car.spoiler.toLowerCase())
              }


              car.turbo = null
              car.tires = null
              car.intake = null
              car.exhaust = null
              car.gearbox = null
              car.suspension = null
              car.intercooler = null
              car.springs = null
              car.weight = null
              car.bodykit = null
              car.ecu = null
              car.brakes = null
              car.spoiler = null
              
              await User.findOneAndUpdate(
                {
                  id: udata.id
                },
                {
                  $set: {
                    "cars.$[car]": car
                  },
                },
          
                {
                  arrayFilters: [
                    {
                      "car.Name": car.Name,
                    },
                  ],
                }
              );
              
            }
            
          }

            
          
            udata.save();
            console.log("saved")
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
