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

          for(let car in cars){
            let car1 = cars[car]
            car1.Speed = cardb.Cars[car1.Name.toLowerCase()].Speed
            if( car1.engine && car1.engine !== null){
              let engine = car1.engine
                          
              if(partdb.Parts[engine.toLowerCase()]){
                car1.Speed += partdb.Parts[engine.toLowerCase()].Power
              }

            }

            if(car1.exhaust && car1.exhaust !== null){
              let engine = car1.exhaust
              
              
              if(partdb.Parts[engine.toLowerCase()]){
                car1.Speed += partdb.Parts[engine.toLowerCase()].Power
              }

            }


            if(car1.exhaust && car1.exhaust !== null){
              let engine = car1.exhaust
              
              
              if(partdb.Parts[engine.toLowerCase()]){
                car1.Speed += partdb.Parts[engine.toLowerCase()].Power
              }

            }


            if(car1.turbo && car1.turbo !== null){
              let engine = car1.turbo
              
              
              if(partdb.Parts[engine.toLowerCase()]){
                car1.Speed += partdb.Parts[engine.toLowerCase()].Power
              }

            }


            if(car1.intake && car1.intake !== null){
              let engine = car1.intake
              
              
              if(partdb.Parts[engine.toLowerCase()]){
                car1.Speed += partdb.Parts[engine.toLowerCase()].Power
              }

            }


            if(car1.intake && car1.intake !== null){
              let engine = car1.intake
              
              
              if(partdb.Parts[engine.toLowerCase()]){
                car1.Speed += partdb.Parts[engine.toLowerCase()].Power
              }

            }


            if(car1.tires && car1.tires !== null){
              let engine = car1.tires
              
              
              if(partdb.Parts[engine.toLowerCase()]){
                car1.Speed += partdb.Parts[engine.toLowerCase()].Power
              }

            }


            if(car1.clutch && car1.clutch !== null){
              let engine = car1.clutch
              
              
              if(partdb.Parts[engine.toLowerCase()]){
                car1.Speed += partdb.Parts[engine.toLowerCase()].Power
              }

            }


            if(car1.suspension && car1.suspension !== null){
              let engine = car1.suspension
              
              
              if(partdb.Parts[engine.toLowerCase()]){
                car1.Speed += partdb.Parts[engine.toLowerCase()].Power
              }

            }





            
            
            await User.findOneAndUpdate(
              {
                id: udata.id,
              },
              {
                $set: {
                  "cars.$[car]": car1,
                },
              },
        
              {
                arrayFilters: [
                  {
                    "car.Name": car1.Name,
                  },
                ],
              }
            );

          }

            
          
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
