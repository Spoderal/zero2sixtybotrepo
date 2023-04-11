const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const itemsdb = require("../data/items.json");
const Global = require("../schema/global-schema");
const ms = require("pretty-ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("itemshop")
    .setDescription("Check the item shop"),
  async execute(interaction) {
    let items = [];
    let global = await Global.findOne();
    let itemshop = global.itemshop;
    let itemcooldown = global.itemshopcooldown;
    let timeout = 604800000;
    let cool = timeout - (Date.now() - itemcooldown);
    cool = ms(cool);
    for (let i in itemshop) {
      i = itemshop[i];
      let item = itemsdb.Other[i.toLowerCase()];
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
      .setColor(colors.blue)
      .setFooter({ text: `${cool} until the shop resets` });

    await interaction.reply({ embeds: [embed] });
  },
};
