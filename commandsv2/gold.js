const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gold")
    .setDescription("View gold pricing and what it can buy"),

  async execute(interaction) {
    let embed = new Discord.EmbedBuilder()
      .setTitle("Gold Pricing")
      .setDescription(
        `**BUY ONE GET ONE FREE SALE**\n$0.99 USD : 20 Gold\n\n$3.99 USD : 120 Gold\n\n$7.99 USD : 260 Gold + 50 Free!\n\n$14.99 USD : 500 Gold + 120 Free!\n\n$39.99 USD : 1200 Gold + 400 Free!\n\n$79.99 USD : 2000 Gold + 600 Free!\n\n**$7.99 USD : Beginner JDM Pack**\n1989 Nissan Skyline R32, 120 Gold, and $25K\n\n**$7.99 USD : Beginner American Muscle Pack**\n2010 Ford Mustang, 120 Gold, and $25K\n\n**$7.99 USD : Beginner Euro Pack**\n2002 BMW M3 GTR, 120 Gold, and $25K\n\n**$49.99 : MEGA SUPPORTER BUNDLE**\n2014 Lamborghini Huracan, 500 Gold, $100K`
      )
      .addFields([
        {
          name: `Exchange Rate`,
          value: `
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
            "You can get exclusive cars that come with parts already installed, and you can get black market parts that don't change any other stat besides 1 stat, this means you wont lose speed or 0-60 if you buy a black market drift part.",
        },
        {
          name: `How to purchase`,
          value: `You can purchase gold by joining our [community server](https://discord.gg/5j8SYkrf4z) and opening a ticket!`,
        },
      ]);

    embed
      .setColor(`#60b0f4`)
      .setThumbnail("https://i.ibb.co/zXDct3P/goldpile.png");

    await interaction.reply({ embeds: [embed] });
  },
};
