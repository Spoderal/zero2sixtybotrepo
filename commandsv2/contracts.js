const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("contracts")
    .setDescription("Get a contract to complete tasks for big rewards"),
  async execute(interaction) {
    let embed = new Discord.EmbedBuilder()
      .setTitle("Contracts")
      .setColor(colors.blue)
      .setDescription(
        "Contracts are available tasks you can complete for rewards, they are repeatable, and can be completed at any time depending on your prestige rank."
      )
      .addFields([
        { name: "Prestige 3", value: "__Tasks__\nWin 10 PVP races : $50,000" },
      ])
      .setThumbnail("https://i.ibb.co/BjJ1YFw/contract.png");

    interaction.reply({ embeds: [embed] });
  },
};
