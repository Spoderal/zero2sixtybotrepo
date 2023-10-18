const User = require(`./schema/profile-schema`);
const Global = require(`./schema/global-schema`);

module.exports = (client) => {
  client.on("message", async (message) => {
    if (message.author.bot) return;

    const { member } = message;

    let usredata = await User.findOne({ id: member.id });
    if (usredata) {
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

        let requiredrp = crewrank * 1000;
        for (let i in crewmembers) {
          let user = crewmembers[i];
          let rpdata = await User.findOne({ id: user });
          let userrp = rpdata.rp2;
          totalrp += userrp;
        }
        if (parseInt(totalrp) >= parseInt(requiredrp)) {
          let rank = crew2.Rank3;

          let newrank = (rank += 1);

          await Global.findOneAndUpdate(
            {},

            {
              $set: {
                "crews.$[crew].Rank3": newrank,
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
      global.save();
    }
  });
};
