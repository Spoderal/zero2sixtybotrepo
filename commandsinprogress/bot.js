

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { numberWithCommas } = require("../common/utils");
const Global = require("../schema/global-schema");
const { emotes } = require("../common/emotes");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot")
    .setDescription("Check the bot information"),
  async execute(interaction) {
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

    let fixed = gas.toFixed(1);

    let embed = new Discord.EmbedBuilder()
      .setTitle(`Info for ${bot.username}`)
      .setThumbnail(bot.displayAvatarURL())
      .addFields([
        {
          name: "Stats",
          value: `🌎 ${
            interaction.client.guilds.cache.size
          } servers\n\n👤 ${numberWithCommas(
            interaction.client.guilds.cache.reduce(
              (a, g) => a + g.memberCount,
              0
            )
          )} users\n\n🏓 Ping: ${Math.round(
            interaction.client.ws.ping
          )}ms\n\n📈 Uptime\n${days} days\n${hours} hours\n${minutes} minutes\n${seconds} seconds\nShard ${interaction.client.shard.ids[0]}\n\n${emotes.gas} Gas Price: ${
            emotes.cash
          } $${fixed}\n\nVoting helps us a lot! Use /vote to vote for us to get a vote crate AND refill all of your cars!\n
          ||Egg time, <:egg_zero2sixty:1219112551045140570> \`CODE: ZERO2SIXTYISTHEBEST\`||
          `,
          inline: true,
        },
        {
          name: "Links",
          value: `[Community Server](https://discord.gg/bHwqpxJnJk)\n\n[Invite Bot](https://discord.com/api/oauth2/authorize?client_id=932455367777067079&permissions=59392&scope=bot%20applications.commands)\n\n[Patreon](https://www.patreon.com/zero2sixtybot)`,
          inline: true,
        },
      ])
      .setColor(colors.blue);

    await interaction.reply({ embeds: [embed] });
  },
};
