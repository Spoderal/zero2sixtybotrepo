const User = require(`../schema/profile-schema`);


async function patreon(interaction, client) {
  let userdata = await User.findOne({ id: interaction.user.id });

  function hasrole(guildid, roleid) {
    // get second guild
    const guild = client.guilds.cache.get(guildid);
  
    // get member in that guild, by id
    const member = guild.members.cache.get(interaction.user.id);
  
    // if member is in that guild,
    if (member) {
        // return whether they have this role
        return member.roles.cache.has(roleid);
    }
  }

  let role = hasrole("931004190149460048", "976653429801885706")
  console.log(`role: ${role}`)
  if(userdata){
    if (role == true && userdata.zpass == false) {
      userdata.zpass = true
      userdata.save()
    }
    else if(role == false && userdata.zpass == true) {
      userdata.zpass = false
      userdata.save()
    }

    

  }
}

module.exports = {
  patreon,
};

