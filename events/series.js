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
       
          let ticketscool = cooldowns.series1tickets;
          let udata = await User.findOne({ id: user.id })
          if (udata) {
            let timeout2 = 600000;
            if (
              udata.seriestickets < 10 &&
              timeout2 - (Date.now() - ticketscool) < 0
            ) {
              udata.seriestickets += 1;
              cooldowns.series1tickets = Date.now();
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
