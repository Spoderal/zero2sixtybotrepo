module.exports = {
  name: "guildCreate",
  once: false,
  async execute(guild) {
    console.log(`Guild added: ${guild.name} (${guild.memberCount} members)`);
    try {
      let channels = guild.channels.cache
      const {ChannelType} = require("discord.js")
      let channeltosend
      let {EmbedBuilder} = require("discord.js")
      channels.forEach(channel => {
        console.log(channel)
        if(channel.type == ChannelType.GuildText && !channeltosend) channeltosend = channel
        
      });
        
      

      console.log(channeltosend)

      if(!channeltosend) return
      let embed = new EmbedBuilder()
      .setTitle("Welcome to Zero2Sixty!")
      .setDescription("Thank you for inviting the bot! There are a ton of features, so it may seem overwhelming at first, but you can run `/start` and the tutorial will go over the basics, also if its your first time running a command it'll explain the command in detail!\n\nYou can always join the support server [here](https://discord.gg/5j8SYkrf4z) as well")

      channeltosend.send({embeds:[embed]})
    }
    catch (err){
      console.log(err)
    }
  },
};
