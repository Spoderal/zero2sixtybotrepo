const Discord = require("discord.js");
const ms = require("ms");

const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Collect your daily cash"),
  async execute(interaction) {
    let uid = interaction.user.id;
    let dcash = 250;
    let userdata = (await User.findOne({ id: uid })) || new User({ id: uid });
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: uid });

    let daily = cooldowndata.daily;
    let patreon = userdata.patron;

    let house = userdata.house;
    if (house && house.perks.includes("Daily $300")) {
      dcash += 300;
    }
    if (house && house.perks.includes("Daily $500")) {
      dcash += 500;
    }
    if (house && house.perks.includes("Daily $1000")) {
      dcash += 1000;
    }
    if (house && house.perks.includes("Daily $1500")) {
      dcash += 1500;
    }
    if (patreon && patreon.tier == 1) {
      dcash *= 2;
    }
    if (patreon && patreon.tier == 2) {
      dcash *= 3;
    }
    if (patreon && patreon.tier == 3) {
      dcash *= 5;
    }
    if (patreon && patreon.tier == 4) {
      dcash *= 5;
    }
    if (interaction.guild.id == "931004190149460048") {
      dcash += 500;
    }
    let timeout = 86400000;
    let prestige = userdata.prestige;
    if (prestige) {
      let mult = require("../data/prestige.json")[prestige].Mult;

      let multy = mult * dcash;

      dcash = dcash += multy;
    }
    if (daily !== null && timeout - (Date.now() - daily) > 0) {
      let time = ms(timeout - (Date.now() - daily));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(
          `You've already collected your daily cash\n\nCollect it again in ${time}.`
        );
      interaction.reply({ embeds: [timeEmbed] });
    } else {
      userdata.cash += dcash;
      cooldowndata.daily = Date.now();
      userdata.save();
      cooldowndata.save();

      let embed = new Discord.EmbedBuilder()
        .setTitle(`Daily Cash ${interaction.user.username}`)
        .addFields([{ name: "Earned Cash", value: `${toCurrency(dcash)}` }]);
      embed.setColor(colors.blue);

      interaction.reply({ embeds: [embed] });
    }
  },
};
