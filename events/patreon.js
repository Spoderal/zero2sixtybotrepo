const User = require(`../schema/profile-schema`);


async function patreon(interaction) {
  let userdata = await User.findOne({ id: interaction.user.id });

  let role = interaction.member.roles.cache.has('976653429801885706');
  if (userdata && role && userdata.zpass == false) {
    userdata.zpass = true
    userdata.save()
  }
  else if(userdata && !role && userdata.zpass == true) {
    userdata.zpass = false
    userdata.save()
  }
}

module.exports = {
  patreon,
};
