const User = require(`../../schema/profile-schema`);
const Global = require(`../../schema/global-schema`);

async function newseason() {

    let global = (await Global.findOne({})) || new Global({});
    let crews = global.crews;
    let crew2;


    console.log(`crew2`)
    for (let i in crews) {
      crew2 = crews[i];
      let totalrp = 0;

      let crewmembers = crew2.members;
      let crewrank = crew2.Rank;
      if (crew2) {
        crew2.Rank = 1;
      }
      for (let i in crewmembers) {
        let user = crewmembers[i];
        console.log(user)
        let rpdata = await User.findOne({ id: user });
        let userrp = rpdata.rp;
        console.log(userrp);
        rpdata.rp = 0
        rpdata.save()
      }
      console.log(`rp: ${totalrp}`);
      let nextrank = (crewrank + 1);
      let requiredrp = nextrank * 1000;
      if (totalrp >= requiredrp) {
        let rank = crew2.Rank;

        let newrank = 1

        crew2.Rank = newrank;
        console.log("ranked");
      }
    }
    await Global.findOneAndUpdate({  "crews.$[crew]": crew2, }, {"crew.Name": crew2.name,});
    await global.markModified("crews");

    try {
      await global.save();

    } 
    catch(err){
      return console.log(err)
    }
  
}

module.exports = {
  newseason,
};
