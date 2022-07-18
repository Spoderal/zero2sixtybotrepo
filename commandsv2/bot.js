const db = require('quick.db')
const Discord = require('discord.js')
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('bot')
  .setDescription("Check the bot information"),
  async execute(interaction) {
       let bot = interaction.client.user
       let totalSeconds = (interaction.client.uptime / 1000);
let days = Math.floor(totalSeconds / 86400);
totalSeconds %= 86400;
let hours = Math.floor(totalSeconds / 3600);
totalSeconds %= 3600;
let minutes = Math.floor(totalSeconds / 60);
let seconds = Math.floor(totalSeconds % 60);

       let embed = new Discord.MessageEmbed()

       .setTitle(`Info for ${bot.username}`)
       .setThumbnail(bot.displayAvatarURL())
       .addField("Stats", `🌎 ${interaction.client.guilds.cache.size} servers\n\n💙 ${numberWithCommas(interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))} users\n\n🏓 Ping: ${Math.round(interaction.client.ws.ping)}ms\n\n📈 Uptime\n${days} days\n${hours} hours\n${minutes} minutes\n${seconds} seconds`, true)
       .addField("Links", `[DONATE](https://www.buymeacoffee.com/zero2sixty)\n\n[SERVER](https://discord.gg/bHwqpxJnJk)\n\n[INVITE](https://discord.com/api/oauth2/authorize?client_id=932455367777067079&permissions=59392&scope=bot%20applications.commands)`, true)
       .setFooter("Created at " + bot.createdAt)
        .setColor("#60b0f4")


        interaction.reply({embeds: [embed]})
    }
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}