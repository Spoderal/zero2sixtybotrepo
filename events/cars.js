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

              if(carinfo.Speed !== car.Speed){
                car.Speed = carinfo.Speed;
              }
              if(carinfo["0-60"] !== car.Acceleration){
                car.Acceleration = carinfo["0-60"];
              }
              if(carinfo.Handling !== car.Handling){
                car.Handling = carinfo.Handling;
              }
              if(carinfo.Weight !== car.WeightStat){
                car.WeightStat = carinfo.Weight;
              }
              let parts = []
              if(car.engine && car.engine.toLowerCase() !== carinfo.Engine.toLowerCase()){
                
                if(partdb.Parts[car.engine.toLowerCase()].Acceleration && partdb.Parts[car.engine.toLowerCase()].Acceleration > 0){
                  car.Acceleration -= partdb.Parts[car.engine.toLowerCase()].Acceleration

                }
                if(partdb.Parts[car.engine.toLowerCase()].Weight && partdb.Parts[car.engine.toLowerCase()].Weight > 0){
                  car.WeightStat += partdb.Parts[car.engine.toLowerCase()].Weight
                  
                }
                if(partdb.Parts[carinfo.Engine.toLowerCase()].Weight && partdb.Parts[carinfo.Engine.toLowerCase()].Weight > 0){
                  car.WeightStat -= partdb.Parts[carinfo.Engine.toLowerCase()].Weight
                  
                }
                car.Speed -= partdb.Parts[carinfo.Engine.toLowerCase()].Power
                car.Speed += partdb.Parts[car.engine.toLowerCase()].Power
              }
              if(car.drivetrain && car.drivetrain.toLowerCase() !== carinfo.Drivetrain.toLowerCase()){
                if(partdb.Parts[car.drivetrain.toLowerCase()].Acceleration && partdb.Parts[car.drivetrain.toLowerCase()].Acceleration > 0){
                  car.Acceleration -= partdb.Parts[car.drivetrain.toLowerCase()].Acceleration

                }
                if(partdb.Parts[carinfo.Drivetrain.toLowerCase()].Acceleration && partdb.Parts[carinfo.Drivetrain.toLowerCase()].Acceleration > 0){
                  car.Acceleration += partdb.Parts[carinfo.Drivetrain.toLowerCase()].Acceleration

                }
                if(partdb.Parts[carinfo.Drivetrain.toLowerCase()].Handling && partdb.Parts[carinfo.Drivetrain.toLowerCase()].Handling > 0){
                  car.Handling -= Number(partdb.Parts[carinfo.Drivetrain.toLowerCase()].Handling)

                }
                if(partdb.Parts[car.drivetrain.toLowerCase()].Handling && partdb.Parts[car.drivetrain.toLowerCase()].Handling > 0){
                  car.Handling += Number(partdb.Parts[car.drivetrain.toLowerCase()].Handling)

                }
                if(partdb.Parts[carinfo.Drivetrain.toLowerCase()].Weight && partdb.Parts[carinfo.Drivetrain.toLowerCase()].Weight > 0){
                  car.WeightStat -= Number(partdb.Parts[carinfo.Drivetrain.toLowerCase()].Weight)

                }
                if(partdb.Parts[carinfo.Drivetrain.toLowerCase()].RemoveWeight && partdb.Parts[carinfo.Drivetrain.toLowerCase()].RemoveWeight > 0){
                  car.WeightStat += Number(partdb.Parts[carinfo.Drivetrain.toLowerCase()].RemoveWeight)

                }
                if(partdb.Parts[car.drivetrain.toLowerCase()].RemoveWeight && partdb.Parts[car.drivetrain.toLowerCase()].RemoveWeight > 0){
                  car.WeightStat -= Number(partdb.Parts[car.drivetrain.toLowerCase()].RemoveWeight)

                }
                if(partdb.Parts[car.drivetrain.toLowerCase()].Weight && partdb.Parts[car.drivetrain.toLowerCase()].Weight > 0){
                  car.WeightStat += Number(partdb.Parts[car.drivetrain.toLowerCase()].Weight)

                }
                car.Speed -= partdb.Parts[carinfo.Drivetrain.toLowerCase()].Power

                car.Speed += partdb.Parts[car.drivetrain.toLowerCase()].Power
              }
              if(car.exhaust){
                parts.push(car.exhaust.toLowerCase())
              }
              if(car.intake){
                parts.push(car.intake.toLowerCase())
              }
              if(car.turbo){
                parts.push(car.turbo.toLowerCase())
              }
              if(car.tires){
                parts.push(car.tires.toLowerCase())
              }
              if(car.clutch){
                parts.push(car.clutch.toLowerCase())
              }
              if(car.suspension){
                parts.push(car.suspension.toLowerCase())
              }
              if(car.brakes){
                parts.push(car.brakes.toLowerCase())
              }
              if(car.gearbox){
                parts.push(car.gearbox.toLowerCase())
              }
              if(car.intercooler){
                parts.push(car.intercooler.toLowerCase())
              }
              if(car.body){
                parts.push(car.body.toLowerCase())
              }
              if(car.ecu){
                parts.push(car.ecu.toLowerCase())
              }
              if(car.weight){
                parts.push(car.weight.toLowerCase())
              }
       
              if(car.spoiler){
                parts.push(car.spoiler.toLowerCase())
              }
              if(car.crankshaft){
                parts.push(car.crankshaft.toLowerCase())
              }
              if(car.springs){
                parts.push(car.springs.toLowerCase())
              }

              for(let p in parts){
                let part = parts[p]
                let partinfo = partdb.Parts[part.toLowerCase()]
                if(partinfo){
                  if(partinfo.Power && partinfo.Power > 0){
                    car.Speed += partinfo.Power
                  }
                  if(partinfo.Acceleration && partinfo.Acceleration > 0){
                    car.Acceleration -= partinfo.Acceleration
                  }
                  if(partinfo.Handling && partinfo.Handling > 0){
                    car.Handling += Number(partinfo.Handling)
                  }
                  if(partinfo.RemoveWeight && partinfo.RemoveWeight > 0){
                    car.WeightStat -= Number(partinfo.RemoveWeight)
                  }
                  if(partinfo.Weight && partinfo.Weight > 0){
                    car.WeightStat += Number(partinfo.Weight)
                  }
                  if(partinfo.RemovePower && partinfo.RemovePower > 0){
                    car.Power -= partinfo.RemovePower
                  }
                  if(partinfo.DecreaseHandling && partinfo.DecreaseHandling > 0){
                    car.Handling -= Number(partinfo.DecreaseHandling)
                  }
                  if(partinfo.RemoveAcceleration && partinfo.RemoveAcceleration > 0){
                    car.Acceleration += partinfo.RemoveAcceleration
                  }
                }
              }
              
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
