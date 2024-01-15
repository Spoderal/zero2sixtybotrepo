

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
          userdata.save()
          interaction.reply(`You found a ${partdb[randomrest].Emote} ${partdb[randomrest].Name}!`)


  },
};
