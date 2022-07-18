const discord = require('discord.js')
const db = require('quick.db')
const {SlashCommandBuilder} = require('@discordjs/builders')
const prestiges = require('../prestige.json')
module.exports = {
  
    data: new SlashCommandBuilder()
    .setName('prestige')
    .setDescription("Prestige your rank, this will reset your cash."),
    
    async execute(interaction) {
        let driftrank = db.fetch(`driftrank_${interaction.user.id}`) || 1
        let racerank = db.fetch(`racerank_${interaction.user.id}`) || 1
        let prestigerank = db.fetch(`prestige_${interaction.user.id}`) || 0
        if(prestigerank == 11) return interaction.reply("Your prestige is currently maxed! The current max prestige is 11.")
        let newprestige2 = prestigerank += 1

        let patron = db.fetch(`requiredprest_${interaction.user.id}`) || prestiges[newprestige2].DriftRequired
        let patron2 = db.fetch(`requiredprest_${interaction.user.id}`) || prestiges[newprestige2].RaceRequired

        if(driftrank < patron) return  interaction.reply(`Your drift rank needs to be ${patron}!`)
        if(racerank < patron2) return  interaction.reply(`Your race rank needs to be ${patron2}!`)
    
        db.add(`prestige_${interaction.user.id}`, 1)
        db.set(`racerank_${interaction.user.id}`, 1)
        db.set(`driftrank_${interaction.user.id}`, 1)
        let vault = db.fetch(`vault_${interaction.user.id}`)
         if(vault && vault == "small vault"){
          db.delete(`vault_${interaction.user.id}`)
          db.set(`cash_${interaction.user.id}`, 25000)
        }
        else if(vault && vault == "medium vault"){
          db.delete(`vault_${interaction.user.id}`)
          db.set(`cash_${interaction.user.id}`, 50000)
        }
        else if(vault && vault == "large vault"){
          db.delete(`vault_${interaction.user.id}`)
          db.set(`cash_${interaction.user.id}`, 100000)
        }
        else {
          db.set(`cash_${interaction.user.id}`, 0)

        }
        db.set(`rp_${interaction.user.id}`, 0)

        db.add(`swheelspins_${interaction.user.id}`, 1)
        
        let banklimit = db.fetch(`banklimit_${interaction.user.id}`) || 10000
        let upgrade = prestigerank * 1000
      
       
        let bankincrease = banklimit += upgrade
 
        db.add(`banklimit_${interaction.user.id}`, bankincrease)
        let newprestige = db.fetch(`prestige_${interaction.user.id}`)

        interaction.reply(`Prestiged to rank ${newprestige}! Your bank limit is now increased to $${numberWithCommas(bankincrease)} and you've unlocked the following: ${prestiges[newprestige].Unlocks.join(', ')}`)

    }
    
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}