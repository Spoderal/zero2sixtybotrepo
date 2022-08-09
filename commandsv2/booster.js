const db = require("quick.db");
const ms = require("ms");

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("boost")
    .setDescription("Get rewards from boosting the community server"),
  async execute(interaction) {
    let cash = 1000;
    let daily = db.fetch(`boost_${interaction.user.id}`);
    let patreon1 = db.fetch(`patreon_tier_1_${interaction.user.id}`);
    let patreon2 = db.fetch(`patreon_tier_2_${interaction.user.id}`);
    let patreon3 = db.fetch(`patreon_tier_3_${interaction.user.id}`);
    let booster = db.fetch(`patreon_tier_b_${interaction.user.id}`);
    if (!booster)
      return interaction.reply("You're not a community server booster!");
    if (patreon1) {
      cash *= 2;
    }
    if (patreon2) {
      cash *= 3;
    }
    if (patreon3) {
      cash *= 5;
    }
    let timeout = 14400000;

    if (daily !== null && timeout - (Date.now() - daily) > 0) {
      let time = ms(timeout - (Date.now() - daily));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(
          `You've already collected your booster cash\n\nCollect it again in ${time}.`
        );
      interaction.reply({ embeds: [timeEmbed] });
    } else {
      db.add(`cash_${interaction.user.id}`, cash);
      db.set(`boost_${interaction.user.id}`, Date.now());

      let embed = new Discord.EmbedBuilder()
        .setTitle(`Booster Cash for ${interaction.user.username}`)
        .addFields([{ name: "Earned Cash", value: `${toCurrency(cash)}` }])
        .setColor(colors.blue);
      interaction.reply({ embeds: [embed] });
    }
  },
};
