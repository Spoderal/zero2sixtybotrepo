

const cars = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require("discord.js");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { toCurrency, numberWithCommas } = require("../common/utils");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");
const partdb = require("../data/partsdb.json").Parts
module.exports = {
  data: new SlashCommandBuilder()
    .setName("itemshop")
    .setDescription("The weekly item store"),
  async execute(interaction) {

    let globals = (await Global.findOne())
    let itemshop = globals.itemshop
    


    let embed = new EmbedBuilder()
    .setTitle(`Weekly Item Shop`)
    .setColor(colors.blue)
    for(let i in itemshop){
        let item = itemshop[i]
        embed.addFields({name: `${item.Emote} ${item.Name}`, value: `${toCurrency(item.Price)}\n${item.Action}`})
    }

   await interaction.reply({embeds: [embed]})
    
   

  },
};
