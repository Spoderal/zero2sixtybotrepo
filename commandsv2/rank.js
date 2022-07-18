const cars = require("../cardb.json");
const Discord = require("discord.js");
const db = require("quick.db")
const moment = require("moment")
const Canvas = require("canvas")
const profilepics = require("../pfpsdb.json")
const badgedb = require("../badgedb.json")
const ms = require('pretty-ms')
const {SlashCommandBuilder} = require('@discordjs/builders')
const prestiges = require("../prestige.json")
module.exports = {
  
    data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription("See your ranks"),
    async execute(interaction) {

      let user = interaction.user


      let prestigerank = db.fetch(`prestige_${user.id}`) || 0
      let driftrank = db.fetch(`driftrank_${user.id}`) || 1
      let newprestige2 = prestigerank += 1

      let racerank = db.fetch(`racerank_${user.id}`) || 1
      if(newprestige2 >= 12){
        newprestige2 = "Max"
      }
      let patron = db.fetch(`requiredprest_${interaction.user.id}`) || prestiges[newprestige2].DriftRequired
      let patron2 = db.fetch(`requiredprest_${interaction.user.id}`) || prestiges[newprestige2].RaceRequired

      let embed = new Discord.MessageEmbed()
      .setTitle(`${user.username}'s ranks`)
      .setDescription(`
      Race Rank: ${racerank}/${patron}\n
      Drift Rank: ${driftrank}/${patron2}\n
      **Prestige**: ${prestigerank}
      
      `)
      .addField("Prestige Ranks", `*Prestige resets your cash balance and RP*
      \nPrestige 1: 0.1x cash earnings
      \nPrestige 2: 0.2x cash earnings
      \nPrestige 3: 0.3x cash earnings
      \nPrestige 4: 0.4x cash earnings
      \nPrestige 5: 0.5x cash earnings
      \nPrestige 6: 0.6x cash earnings
      \nPrestige 7: 0.7x cash earnings
      \nPrestige 8: 0.8x cash earnings
      \nPrestige 9: 0.9x cash earnings
      \nPrestige 10: 1x cash earnings
      \nPrestige 11: 1.1x cash earnings

      
      `)

      .setColor("#60b0f4")
      
      
      interaction.reply({embeds: [embed]})
        
      
      db.set(`rankdelay_${user.id}`, Date.now())

    }  
  
};      
