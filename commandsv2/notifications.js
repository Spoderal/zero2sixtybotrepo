const Discord = require("discord.js");
const db = require("quick.db");

const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notifications")
    .setDescription("View your notifications"),
  async execute(interaction) {
    let uid = interaction.user.id;
    let daily = db.fetch(`daily_${uid}`);
    let weekly = db.fetch(`weekly_${uid}`);
    let weeklytimeout = 604800000;
    let dailytimeout = 86400000;
    let votetimer = 43200000;
    let vote = db.fetch(`votetimer_${uid}`);

    let emote = "✅";
    let emote2 = "✅";
    let emote3 = "✅";
    if (daily !== null && dailytimeout - (Date.now() - daily) > 0) {
      emote = "❌";
    }
    if (weekly !== null && weeklytimeout - (Date.now() - weekly) > 0) {
      emote2 = "❌";
    }
    if (vote !== null && votetimer - (Date.now() - vote) > 0) {
      emote3 = "❌";
    }

    let embed = new Discord.EmbedBuilder()
      .setTitle(`Notification Panel`)
      .addFields([
        { name: "Daily", value: `${emote}` },
        { name: `Weekly`, value: `${emote2}` },
        { name: `Top.gg Vote`, value: `${emote3}` },
      ])
      .setColor(colors.blue);

    interaction.reply({ embeds: [embed] });
  },
};
