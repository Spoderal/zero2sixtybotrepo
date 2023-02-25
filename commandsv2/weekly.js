const Discord = require("discord.js");
const ms = require("ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weekly")
    .setDescription("Collect your weekly cash"),
  async execute(interaction) {
    let cash = 750;
    let uid = interaction.user.id;
    let userdata = await User.findOne({ id: uid });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let cooldowns =
      (await Cooldowns.findOne({ id: uid })) || new Cooldowns({ id: uid });

    let daily = cooldowns.weekly;
    let patron = userdata.patron;
    let gold;
    if (patron && patron.tier == "1") {
      cash *= 2;
      gold = 20;
    }
    if (patron && patron.tier == "2") {
      cash *= 3;
      gold = 50;
    }
    if (patron && patron.tier == "3") {
      cash *= 5;
      gold = 100;
    }
    if (patron && patron.tier == "4") {
      cash *= 6;
      gold = 250;
    }
    let timeout = 604800000;
    let prestige = userdata.prestige;
    if (prestige) {
      let mult = prestige * 0.05;

      let multy = mult * cash;

      cash = cash += multy;
    }
    if (daily !== null && timeout - (Date.now() - daily) > 0) {
      let time = ms(timeout - (Date.now() - daily));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(
          `You've already collected your weekly cash\n\nCollect it again in ${time}.`
        );
      await interaction.reply({ embeds: [timeEmbed] });
    } else {
      userdata.cash += Number(cash);
      cooldowns.weekly = Date.now();

      let embed = new Discord.EmbedBuilder()
        .setTitle(`Weekly Cash for ${interaction.user.username}`)
        .addFields([{ name: "Earned Cash", value: `${toCurrency(cash)}` }])
        .setColor(colors.blue);
      if (gold) {
        userdata.gold += Number(gold);
        embed.addFields([
          {
            name: `Earned Gold`,
            value: `<:z_gold:933929482518167552> ${gold}`,
          },
        ]);
      }
      cooldowns.save();
      userdata.save();
      await interaction.reply({ embeds: [embed] });
    }
  },
};
