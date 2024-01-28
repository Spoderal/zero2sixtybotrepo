const User = require(`../../schema/profile-schema`);
const Global = require(`../../schema/global-schema`);

async function updateCrew(interaction) {
  let usredata = await User.findOne({ id: interaction.user.id });
  if (usredata && usredata.crew) {
    let global = (await Global.findOne({})) || new Global({});
    let ucrew = usredata.crew;
    let crews = global.crews;
    let crew2;
    if (ucrew) {
      crew2 = crews.filter((crew) => crew.name == ucrew.name);
    }

    console.log(`crew2`)
    if (ucrew && crew2[0]) {
      crew2 = crew2[0];
      let totalrp = 0;

      let crewmembers = crew2.members;
      let crewrank = crew2.Rank;
      if (!crew2.Rank) {
        crew2.Rank = 1;
        global.update();
      }
      for (let i in crewmembers) {
        let user = crewmembers[i];
        let rpdata = await User.findOne({ id: user });
        let userrp = rpdata.rp;
        console.log(userrp);
        totalrp += userrp;
      }
      console.log(`rp: ${totalrp}`);
      let nextrank = (crewrank + 1);
      let requiredrp = nextrank * 1000;
      if (totalrp >= requiredrp) {
        let rank = crew2.Rank;

        let newrank = nextrank

        crew2.Rank = newrank;
        console.log("ranked");
      }
    }
    await global.updateOne();
    await global.markModified("crews");
    await global.update();

    try {
      await global.save();

    } 
    catch(err){
      return console.log(err)
    }
  }
}

module.exports = {
  updateCrew,
};
