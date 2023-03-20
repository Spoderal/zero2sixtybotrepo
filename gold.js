const User = require(`./schema/profile-schema`);
const Global = require(`./schema/global-schema`);

module.exports = (client) => {
  client.on("messageCreate", async (message) => {

    if(message.channelId == "965774602829701140" && message.author.id == "695664615534755850"){
    
        const args = message.content.slice().trim().split(/ +/);
        let user = args[0]
        console.log(args)

        console.log(user)

        let userdata = await User.findOne({ id: user });

        userdata.gold += Number(args[3])

        userdata.save()
    }



})

}