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

    if (ucrew && crew2[0]) {
      crew2 = crew2[0];
      let totalrp = 0;

      let crewmembers = crew2.members;
      let crewrank = crew2.Rank3;
      if (!crew2.Rank3) {
        crew2.Rank3 = 1;
        global.update();
      }
      for (let i in crewmembers) {
        let user = crewmembers[i];
        let rpdata = await User.findOne({ id: user });
        let userrp = rpdata.rp4;
        console.log(userrp);
        totalrp += userrp;
      }
      console.log(totalrp);
      let nextrank = crewrank += 1
      let requiredrp = nextrank * 1000;
      if (parseInt(totalrp) >= parseInt(requiredrp)) {
        let rank = crew2.Rank3;

        let newrank = (rank += 1);

        crew2.Rank3 = newrank;
        console.log("ranked");
      }
    }
    await global.update();
    await global.markModified("crews");
    await global.update();

    await global.save();
  }
}

module.exports = {
  updateCrew,
};
