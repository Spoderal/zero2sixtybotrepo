const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Global = require("../schema/global-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const itemsdb = require("../data/items.json");
const ms = require("pretty-ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("itemshop")
    .setDescription("Check the item shop"),
  async execute(interaction) {
    let global = await Global.findOne();

    let items = [];
    for (let i in itemsdb.Other) {
      i = itemsdb.Other[i];
      let item = i;
      console.log(item);

      items.push(`${item.Emote} ${item.Name} : **${toCurrency(item.Price)}**`);
    }

    let embed = new Discord.EmbedBuilder()
      .setTitle("Daily Item Shop")
      .setDescription(`${items.join("\n\n")}`)
      .setColor(colors.blue);

    await interaction.reply({ embeds: [embed] });
  },
};
