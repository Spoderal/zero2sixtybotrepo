const User = require(`../schema/profile-schema`);


async function season() {
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
        console.log(`${u}`);
        if (udata !== null) {
   
            udata.crewseasonclaimed = 0
          

            udata.save();
            console.log('done')
        }


      } catch (err) {
        console.log(err);
      }
    }
  }
}

module.exports = {
  season,
};
