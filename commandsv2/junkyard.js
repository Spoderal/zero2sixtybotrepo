

const cars = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require("discord.js");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { toCurrency, numberWithCommas } = require("../common/utils");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const ms = require("pretty-ms")
const Global = require("../schema/global-schema");
const partdb = require("../data/partsdb.json").Parts
module.exports = {
  data: new SlashCommandBuilder()
    .setName("junkyard")
    .setDescription("The junkyard to find junk parts"),
  async execute(interaction) {

    let userdata = await User.findOne({ id: interaction.user.id });
    let cooldowndata = await Cooldowns.findOne({ id: interaction.user.id });
    let junk = cooldowndata.junk
    let timeout = 3600000
    if (junk !== null && timeout - (Date.now() - junk) > 0) {
        console.log('false')
        let time = ms(timeout - (Date.now() - junk));
        let timeEmbed = new EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(
            `You've already collected your hourly junk part\n\nCollect it again in ${time}.`
          );
       return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
      } 

          let restparts = [
            "j1exhaust",
            "j1engine",
            "j1suspension",
            "j1intake",
            "body",
          ];

          let randomrest = lodash.sample(restparts);

          
          cooldowndata.junk = Date.now()
          cooldowndata.save()
          userdata.parts.push(randomrest);
          if(userdata.tutorial && userdata.tutorial.started == true && userdata.tutorial.stage == 3 && userdata.tutorial.type == "restore" ){
            let tut = userdata.tutorial
            tut.stage += 1
            await User.findOneAndUpdate(
              {
                id: interaction.user.id,
              },
              {
                $set: {
                  "tutorial": tut,
                },
              },
        
            );
            userdata.parts.push(`j1exhaust`)
            userdata.parts.push(`j1engine`)
            userdata.parts.push(`j1suspension`)
            userdata.parts.push(`j1intake`)
            userdata.parts.push(`body`)
            interaction.channel.send(`**TUTORIAL:** Great! We found a part! Since we want this tutorial to go faster, I've given you all the parts you need to restore this classic car. Go ahead and run \`/restore [car id]\`!`)
          }
          userdata.save()
          interaction.reply(`You found a ${partdb[randomrest].Emote} ${partdb[randomrest].Name}!`)


  },
};
