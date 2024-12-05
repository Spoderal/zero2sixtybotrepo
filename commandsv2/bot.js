

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { numberWithCommas } = require("../common/utils");
const Global = require("../schema/global-schema");
const { emotes } = require("../common/emotes");
const cardb = require("../data/cardb.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot")
    .setDescription("Check the bot information"),
  async execute(interaction) {
    let cars = []

    for(let car in cardb.Cars){
        cars.push(cardb.Cars[car])
    }
    let global = await Global.findOne({});
    let bot = interaction.client.user;
    let totalSeconds = interaction.client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let gas = global.gas;

    let fixed = gas.toFixed(2);

    let embed = new Discord.EmbedBuilder()
      .setTitle(`Info for ${bot.username}`)
      .setThumbnail(bot.displayAvatarURL())
      .addFields([
        {
          name: "Stats",
          value: `🌎 ${
            interaction.client.guilds.cache.size
          } servers\n
          👤 ${numberWithCommas(interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))} users\n
          🏓 Ping: ${Math.round(interaction.client.ws.ping)}ms\n
          📈 Uptime\n${days} days\n${hours} hours\n${minutes} minutes\n${seconds} seconds\n\n${emotes.gas} Gas Price: ${emotes.cash} $${fixed}
          🚗 Car Count: ${cars.length}
          `,
          inline: true,
        },
        {
          name: "Links",
          value: `[Community Server](https://discord.gg/bHwqpxJnJk)\n\n[Invite Bot](https://discord.com/api/oauth2/authorize?client_id=932455367777067079&permissions=321600&scope=bot%20applications.commands)\n\n[Patreon](https://www.patreon.com/zero2sixtybot)`,
          inline: true,
        },
      ])
      .setColor(colors.blue)
      .setDescription("This bot is no longer being maintained. Please join the community server for more information.")

      console.log("test log")

    await interaction.reply({ embeds: [embed] });
  },
};
