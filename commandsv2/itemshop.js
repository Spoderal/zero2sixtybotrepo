const { SlashCommandBuilder } = require('@discordjs/builders');
const Global = require('../schema/global-schema');
const { EmbedBuilder } = require('discord.js');
const { toCurrency } = require('../common/utils');
const colors = require('../common/colors');
const ITEM_SHOP_COLOR = colors.blue; // Define a constant for the color

// A function to fetch the item shop data
async function fetchItemShopData() {
  try {
    const globalData = await Global.findOne();
    return globalData.itemshop;
  } catch (error) {
    console.error('Failed to fetch item shop data:', error);
  }
}

// A function to create an embed for an item
function createItemEmbed(itemShop) {
  let embed = new EmbedBuilder()
    .setTitle('Daily Item Shop')
    .setColor(ITEM_SHOP_COLOR);

  for (const item of itemShop) {
    console.log(item)
    embed.addFields({name: `${item.Emote} ${item.Name}`, value: `**${toCurrency(item.Price)}** ${item.Action}`});
  }

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('itemshop')
    .setDescription('Displays the weekly item shop.'),

  async execute(interaction) {
    const itemshop = await fetchItemShopData();
    const embed = createItemEmbed(itemshop);
    await interaction.reply({ embeds: [embed] });
  },
};