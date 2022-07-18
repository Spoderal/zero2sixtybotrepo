const db = require("quick.db")
const Discord = require('discord.js')
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("convertbm")
    .setDescription("Convert barn maps into better barn maps")
    .addStringOption((option) => option
    .setName("rarity")
    .setDescription("The rarity of barn map you'd like to receive")
    .addChoice("Uncommon", "uncommon")
    .addChoice("Rare", "rare")
    .addChoice("Legendary", "legendary")

    .setRequired(true)),
  async execute(interaction) {

        let uid = interaction.user.id
        let toturnin = interaction.options.getString("rarity")
        let barnmaps = db.fetch(`barnmaps_${uid}`) || 0
        let ubarnmaps = db.fetch(`ubarnmaps_${uid}`) || 0
        let rbarnmaps = db.fetch(`rbarnmaps_${uid}`) || 0
        let lbarnmaps = db.fetch(`lbarnmaps_${uid}`) || 0
     
        if(toturnin == "uncommon"){
            if(barnmaps < 25) return interaction.reply("You need 25 common barn maps before you can get an uncommon barn map!")

            db.subtract(`barnmaps_${uid}`, 25)
            db.add(`ubarnmaps_${uid}`, 1)

            interaction.reply(`✅`)
        }
        else if(toturnin == "rare"){
            if(ubarnmaps < 10) return interaction.reply("You need 10 uncommon barn maps before you can get a rare barn map!")

            db.subtract(`ubarnmaps_${uid}`, 10)
            db.add(`rbarnmaps_${uid}`, 1)

            interaction.reply(`✅`)
        }
        else if(toturnin == "legendary"){
            if(rbarnmaps < 5) return interaction.reply("You need 5 rare barn maps before you can get a legendary barn map!")

            db.subtract(`rbarnmaps_${uid}`, 5)
            db.add(`lbarnmaps_${uid}`, 1)

            interaction.reply(`✅`)
        }

    }
  }