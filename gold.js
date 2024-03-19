const User = require(`./schema/profile-schema`);

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (
      message.channelId == "965774602829701140" &&
      message.author.id == "695664615534755850"
    ) {
      const args = message.content.slice().trim().split(/ +/);
      let user = args[0];
      

      let userdata = await User.findOne({ id: user });


      userdata.gold += Number(args[3]);
   

        userdata.zpass = true
        userdata.zpasstimer = Date.now();
      


      userdata.save();
    }
  });
};
