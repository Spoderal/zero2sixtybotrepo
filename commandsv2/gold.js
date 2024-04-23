const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gold")
    .setDescription("View gold pricing and what it can buy"),

  async execute(interaction) {

    let embed = new Discord.EmbedBuilder()
      .setTitle("Gold")
      .setDescription(`**__Buy gold__**\nBuy gold [here](https://zero2sixty-store.tebex.io/)`)
      .addFields([
        {
          name: `Exchange Rate`,
          value: `
            Convert gold into the following currencies:\n

            Cash: 1 Gold = $10,000
            Rare Keys: 1 Gold = 1 Rare Key
            Exotic Keys: 2 Gold = 1 Exotic Key
            Barn maps: 5 Gold = 1 Barn Map
            Super Wheel Spins: 10 Gold = 1 Super Wheel Spin
            T5 Voucher: 5 Gold = 1 T5 Voucher
            Garage Space: 10 Gold = 1 Garage Space
          `,
        },
        {
          name: `Features`,
          value: `
            - Exclusive Car Packs in /dealer
            - Reduce cooldowns for 5 gold each
          `,
        }
      ]);

    embed
      .setColor(`#60b0f4`)
      .setThumbnail("https://i.ibb.co/zXDct3P/goldpile.png");

    await interaction.reply({ embeds: [embed] });
  },
};
