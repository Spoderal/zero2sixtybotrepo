const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Global = require("../schema/global-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("itemshop")
    .setDescription("Check the item shop"),
  async execute(interaction) {
    let global = await Global.findOne();
    let itemshop = global.itemshop;

    if (!itemshop?.length) {
      await interaction.reply({
        content: "There are no items in the item shop.",
      });
      return;
    }

    let items = [];
    for (let i in itemshop) {
      let item = itemshop[i];

      items.push(`${item.Emote} ${item.Name} : **${toCurrency(item.Price)}**`);
    }

    let embed = new Discord.EmbedBuilder()
      .setTitle("Daily Item Shop")
      .setDescription(`${items.join("\n\n")}`)
      .setColor(colors.blue);

    await interaction.reply({ embeds: [embed] });
  },
};
