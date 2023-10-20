const partdb = require("../data/partsdb.json");
const User = require(`../schema/profile-schema`);
const Cooldown = require(`../schema/cooldowns`);

async function series(interaction) {

  let user = interaction.user

    let cooldowns = await Cooldown.findOne({id: user.id}) || new Cooldown({id: user.id})
    
      let userdata = await User.findOne({id: user.id})
      if (
        userdata !== undefined &&
        userdata !== null &&
        userdata.id &&
        userdata.id !== null
      ) {
        try {
       
          let bountycool = cooldowns.series1;
          let ticketscool = cooldowns.series1tickets;
          let udata = await User.findOne({ id: user.id }, { versionKey: '_somethingElse' });
          if (udata) {
            let timeout = 86400000;
            let timeout2 = 600000;
            if (
              udata.perfectengineeringcomplete !== true &&
              udata.perfectengineering == true &&
              udata.seriestickets < 10 &&
              ticketscool !== null &&
              timeout2 - (Date.now() - ticketscool) < 0
            ) {
              udata.seriestickets += 1;
            }
            if (
              udata.perfectengineering == true &&
              bountycool !== null &&
              timeout - (Date.now() - bountycool) < 0
            ) {
              let cartopull = udata.cars.filter(
                (car) => car.Name == "1980 Porsche 911"
              );

              if (cartopull[0] && udata.perfectengineeringcomplete == false) {
                udata.cars.pull(cartopull[0]);
                for (let p in udata.parts) {
                  let part = udata.parts[p];

                  if (
                    partdb.Parts[part].Loan &&
                    partdb.Parts[part].Loan == true
                  ) {
                    udata.parts.pull(part);
                  }
                }
              }

              cooldowns.series1 = 0;
              udata.perfectengineering = false;
            } else if (
              udata.pressure == true &&
              udata.seriestickets < 10 &&
              ticketscool !== null &&
              timeout2 - (Date.now() - ticketscool) < 0
            ) {
              udata.seriestickets += 1;
            }
            if (
              udata.pressurecomplete !== true &&
              udata.pressure == true &&
              bountycool !== null &&
              timeout - (Date.now() - bountycool) < 0
            ) {
              let cartopull = udata.cars.filter(
                (car) => car.Name == "2018 BMW M4CS"
              );

              if (cartopull[0] && udata.pressurecomplete !== true) {
                udata.cars.pull(cartopull[0]);
                for (let p in udata.parts) {
                  let part = udata.parts[p];

                  if (
                    partdb.Parts[part].Loan &&
                    partdb.Parts[part].Loan == true
                  ) {
                    udata.parts.pull(part);
                  }
                }
              }

              cooldowns.series1 = 0;
              udata.pressure = false;
            }
             udata.update()
            cooldowns.update();
            udata.save();
            cooldowns.save();
          }
        } catch (err) {
          console.log(err);
        }
      }
    
}

module.exports = {
  series,
};
