const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const ms = require("pretty-ms");
const globalSchema = require("../schema/global-schema");
const emotes = require("../common/emotes").emotes;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("See your ranks"),
  async execute(interaction) {
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let prestigerank = userdata.prestige;
    let driftrank = userdata.driftrank;
    let newprestige2 = prestigerank + 1;
    let bountycooldown = prestigerank * 1000;
    let bonus = prestigerank * 0.05;
    let rpbonus = 0
    let globals = await globalSchema.findOne();
    let crews = globals.crews

    let usercrew = userdata.crew

    if(usercrew){
      let crew = crews.filter((cre) => cre.name == usercrew.name)

      let timeout = 14400000;
      let timeout2 = 7200000;
      let timeout3 = 3600000;
          
          if (
            crew[0].Cards[0].time !== null  &&
            timeout - (Date.now() - crew[0].Cards[0].time) < 0
          ) {
            console.log("no card")
          } else {
            rpbonus += 0.20
          }

          if (
            crew[0].Cards[1].time !== null && 
            timeout2 - (Date.now() - crew[0].Cards[1].time) < 0
          ) {
            console.log("no card")
          } else {
            rpbonus += 0.50
          }

          if (
            crew[0].Cards[2].time !== null && 
            timeout3 - (Date.now() - crew[0].Cards[2].time) < 0
          ) {
            console.log("no card")
          } else {
            rpbonus += 1.20
          }

    }

    if(userdata.using.includes("radio")){
      rpbonus += 0.50
    }

     if(userdata.using.includes("energy drink")){
      rpbonus += 0.10
    }

    if(userdata.using.includes("energy drink")){
      rpbonus += 0.10
    }

    console.log(rpbonus)

    rpbonus += (prestigerank / 100)
    console.log(rpbonus)
    let crew2 = userdata.crew
    let rounded = rpbonus * 100
   

    let racerank = userdata.racerank;

    let required1 = newprestige2 * 30;
    let required2 = newprestige2 * 20;

    let embed = new Discord.EmbedBuilder()
      .setTitle(`${user.username}'s ranks`)
      .setDescription(
        `
        ${emotes.prestige} **Prestige**: ${prestigerank}\n
        ${emotes.race} Race Rank: ${racerank}/${required1}\n
        ${emotes.drift} Drift Rank: ${driftrank}/${required2}\n
        ${emotes.rp} RP Bonus: ${rounded}%\n
        `
      )

      .setColor(colors.blue);

    await interaction.reply({ embeds: [embed] });
  },
};
