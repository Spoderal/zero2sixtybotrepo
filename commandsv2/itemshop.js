const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Global = require("../schema/global-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("itemshop")
    .setDescription("Check the item shop"),
  async execute(interaction) {
    let global = await Global.findOne();
    let itemshop = global.itemshop;

    let items = [];

    for (let i in itemshop) {
      let item = itemshop[i];

      items.push(
        `${item.Emote} ${item.Name} : **$${numberWithCommas(item.Price)}**`
      );
    }

    let embed = new Discord.MessageEmbed()
      .setTitle("Daily Item Shop")
      .setDescription(`${items.join("\n\n")}`)
      .setColor("#60b0f4");

    interaction.reply({ embeds: [embed] });
  },
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
