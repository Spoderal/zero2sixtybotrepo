const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gold")
    .setDescription("View gold pricing and what it can buy"),

  async execute(interaction) {

    let embed = new Discord.EmbedBuilder()
      .setTitle("Gold Pricing")
      .setDescription(`Buy gold [here!](https://zero2sixty-store.tebex.io/)`)
      .addFields([
        {
          name: `Exchange Rate`,
          value: `
            Convert gold into the following currencies:\n

            Rare keys: gold * 2.5\n
            Exotic keys: gold * 0.5\n
            Cash: gold * 10000\n
            Barn maps: gold * 1\n
            Super wheel spins: gold * 0.05
          `,
        },
      ]);

    embed
      .setColor(`#60b0f4`)
      .setThumbnail("https://i.ibb.co/zXDct3P/goldpile.png");

    await interaction.reply({ embeds: [embed] });
  },
};
