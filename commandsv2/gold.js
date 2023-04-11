const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const cardb = require("../data/cardb.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gold")
    .setDescription("View gold pricing and what it can buy"),

  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });

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
            Uncommon barn maps: gold * 5\n
            Rare barn maps: gold * 2\n
            Legendary barn maps: gold * 0.2\n
            Super wheel spins: gold * 0.05
          `,
        },
        {
          name: "What else?",
          value:
            "You can get exclusive cars that come with parts already installed, and you can get black market parts that don't change any other stat besides 1 stat, this means you wont lose speed or 0-60 if you buy a black market drift part.\n\nYou can also use 5 gold to clear all of your race cooldowns.",
        },
      ]);

    embed
      .setColor(`#60b0f4`)
      .setThumbnail("https://i.ibb.co/zXDct3P/goldpile.png");

    await interaction.reply({ embeds: [embed] });
  },
};
