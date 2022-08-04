const {MessageEmbed} = require('discord.js')
const {SlashCommandBuilder} = require('@discordjs/builders')
module.exports = {
  
    data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription("Invite the bot to your server"),
    async execute(interaction) {
      interaction.reply("https://discord.com/api/oauth2/authorize?client_id=932455367777067079&permissions=321600&scope=bot%20applications.commands")
  }

}


  