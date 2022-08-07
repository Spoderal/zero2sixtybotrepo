const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("contracts")
    .setDescription("Get a contract to complete tasks for big rewards"),
  async execute(interaction) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Contracts")
      .setColor("#60b0f4")
      .setDescription(
        "Contracts are available tasks you can complete for rewards, they are repeatable, and can be completed at any time depending on your prestige rank."
      )
      .addField("Prestige 3", "__Tasks__\nWin 10 PVP races : $50,000")
      .setThumbnail("https://i.ibb.co/BjJ1YFw/contract.png");

    interaction.reply({ embeds: [embed] });
  },
};
