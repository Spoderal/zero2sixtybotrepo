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
      let crewrank = crew2.Rank2;
      if (!crew2.Rank2) {
        crew2.Rank2 = 1;
        global.update();
      }
      for (let i in crewmembers) {
        let user = crewmembers[i];
        let rpdata = await User.findOne({ id: user });
        let userrp = rpdata.rp2;

        totalrp += userrp;
      }
      let requiredrp = crewrank * 1000;
      if (parseInt(totalrp) >= parseInt(requiredrp)) {
        let rank = crew2.Rank2;

        let newrank = (rank += 1);

        await Global.findOneAndUpdate(
          {},

          {
            $set: {
              "crews.$[crew].Rank": newrank,
            },
          },

          {
            arrayFilters: [
              {
                "crew.name": crew2.name,
              },
            ],
          }
        );
      }
    }
    console.log("saved");
    global.save();
  }
}

module.exports = {
  updateCrew,
};
