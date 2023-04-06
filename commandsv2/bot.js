const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { numberWithCommas } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot")
    .setDescription("Check the bot information"),
  async execute(interaction) {
    let bot = interaction.client.user;
    let totalSeconds = interaction.client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let embed = new Discord.EmbedBuilder()
      .setTitle(`Info for ${bot.username}`)
      .setThumbnail(bot.displayAvatarURL())
      .addFields([
        {
          name: "Stats",
          value: `🌎 ${
            interaction.client.guilds.cache.size
          } servers\n\n💙 ${numberWithCommas(
            interaction.client.guilds.cache.reduce(
              (a, g) => a + g.memberCount,
              0
            )
          )} users\n\n🏓 Ping: ${Math.round(
            interaction.client.ws.ping
          )}ms\n\n📈 Uptime\n${days} days\n${hours} hours\n${minutes} minutes\n${seconds} seconds\n
          🥚 SPACE EGG MOBILE: ONESMALLSTEPFOREGGS`,
          inline: true,
        },
        {
          name: "Links",
          value: `[DONATE](https://www.buymeacoffee.com/zero2sixty)\n\n[SERVER](https://discord.gg/bHwqpxJnJk)\n\n[INVITE](https://discord.com/api/oauth2/authorize?client_id=932455367777067079&permissions=59392&scope=bot%20applications.commands)`,
          inline: true,
        },
      ])
      .setFooter({ text: "Created at " + bot.createdAt })
      .setColor(colors.blue);

    await interaction.reply({ embeds: [embed] });
  },
};
