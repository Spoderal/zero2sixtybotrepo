const User = require(`../schema/profile-schema`);
const Cooldowns = require(`../schema/cooldowns`);
const lodash = require("lodash")
const {EmbedBuilder} = require("discord.js")

async function dailyCheck(interaction) {
  let userdata = await User.findOne({ id: interaction.user.id });
  let cooldowns = await Cooldowns.findOne({ id: interaction.user.id });

  let settings = userdata.settings
  let votetimer = userdata.votetimer
  let dailytimer = cooldowns.daily
  let tips = settings.tips

  let hours12 = 43200000
  let hours24 = 86400000

  let tipslist = [
    "You can run /parts to view a variety of parts to upgrade on your car!",
    "There is a community server with a bunch of giveaways for cash!",
    "Be sure to regularly check /updates, we update the bot often!",
    "You can run /daily and /weekly for some extra cash!",
    "Try looking at the other race types with /races!",
    "You can request to PVP other players with /pvp",
    "Try showcasing your car in your garage with /showcase!"
  ]
  let tip = lodash.sample(tipslist)

  if(tips == true){
    let embed = new EmbedBuilder()
    .setDescription(tip)
    .setFooter({text: "Disable tips with /settings"})
    try {
        await interaction.followUp({embeds: [embed], ephemeral: true})

    }catch(err){
        console.log("caught")
    }
   }

   if(settings.vote == true && hours12 - (Date.now() - votetimer) <= 0 ){
    try{
        interaction.user.send(
            `You can vote now! https://top.gg/bot/932455367777067079`
          );
    }
    catch(err){
        console.log("cant dm")
    }

   }

   if(settings.daily == true && hours24 - (Date.now() - dailytimer) <= 0 ){
    try{
        interaction.user.send(
            `You can claim your daily reward now!`
          );
    }
    catch(err){
        console.log("cant dm")
    }


   }


 
}

module.exports = {
  dailyCheck,
};
