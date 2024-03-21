const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { numberWithCommas, toCurrency } = require("../common/utils");
const {userGetFromInteraction } = require("../common/user");
const { tipFooterRandom } = require("../common/tips");
const { emotes } = require("../common/emotes");
const colors = require("../common/colors");
const User = require("../schema/horseschema");
const horsedb = require("../data/horsedb.json")

const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("Open a horse crate to get a new horse"),

  async execute(interaction) {

    let horses = []

    for(let horse in horsedb.Horses){
        console.log(horse)
      horses.push(horsedb.Horses[horse])
      console.log(horsedb.Horses[horse])
    }
   
    const randomHorse = horses[Math.floor(Math.random() * horses.length)]
    console.log(randomHorse);
    
    await interaction.reply({content: `You've opened a horse crate and got a ${randomHorse.Name}!`, ephemeral: true})
  },
};