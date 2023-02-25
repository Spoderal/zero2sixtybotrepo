const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const itemsdb = require("../data/items.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("itemshop")
    .setDescription("Check the item shop"),
  async execute(interaction) {
    let items = [];
    for (let i in itemsdb.Other) {
      i = itemsdb.Other[i];
      let item = i;
      console.log(item);

      if (!item.Price == 0) {
        items.push(
          `${item.Emote} ${item.Name} : **${toCurrency(item.Price)}**`
        );
      }
    }

    let embed = new Discord.EmbedBuilder()
      .setTitle("Daily Item Shop")
      .setDescription(`${items.join("\n\n")}`)
      .setColor(colors.blue);

    await interaction.reply({ embeds: [embed] });
  },
};
