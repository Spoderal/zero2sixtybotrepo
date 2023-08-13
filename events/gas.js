const User = require(`../schema/profile-schema`);
const cardb = require("../data/cardb.json");
const partdb = require("../data/partsdb.json");
const ocardb = require("../data/oldcars.json");
const Cooldowns = require(`../schema/cooldowns`);

async function gas() {
    setInterval(async () => {
        

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
        if (udata !== null) {
                let timeout = 300000

                let cooldowns = await Cooldowns.findOne({id: userdata.id}) || new Cooldowns({id: userdata.id})
                let gascool = cooldowns.gas || 0
                let cars = udata.cars;
      
                if (gascool !== null && timeout - (Date.now() - gascool) < 0) {
                    
                                    for (let car in cars) {
                                      let carf = cars[car];
                                        
                                      if(carf.Gas < carf.MaxGas){
                                        carf.Gas += 1
                                      }
                                    
                                      cars[car] = carf;
                                }
                                console.log(cars)
                                udata.cars = cars
                                cooldowns.gas = Date.now()
                                cooldowns.save()
                }
        }
     
        udata.markModified("cars");
        udata.save();
      } catch (err) {
        console.log(err);
      }
    }
  }
}, 5000);
}

module.exports = {
  gas,
};
