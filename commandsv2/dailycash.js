const Discord = require("discord.js")
const cars = require('../cardb.json')
const db = require('quick.db')
const ms = require('ms')

const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription("Collect your daily cash"),
    async execute(interaction) {
        let uid = interaction.user.id
        let cash = 250
        let daily = db.fetch(`daily_${uid}`)
        let patreon1 = db.fetch(`patreon_tier_1_${uid}`)
        let patreon2 = db.fetch(`patreon_tier_2_${uid}`)
        let patreon3 = db.fetch(`patreon_tier_3_${uid}`)
        
        let house = db.fetch(`house_${uid}`)
        if(house && house.Perks.includes("Daily $300")){
            cash += 300
        }
        if(house && house.Perks.includes("Daily $500")){
            cash += 500
        }
        if(house && house.Perks.includes("Daily $1000")){
            cash += 1000
        }
        if(house && house.Perks.includes("Daily $1500")){
            cash += 1500
        }
        if(patreon1){
            cash *= 2
        }
        if(patreon2){
            cash *= 3
        }
        if(patreon3){
            cash *= 5
        }
        if(interaction.guild.id == "931004190149460048") {
            cash += 500
            console.log("guild")
        }
        let timeout = 86400000;
        let prestige = db.fetch(`prestige_${interaction.user.id}`)
        if(prestige){
            let mult = require('../prestige.json')[prestige].Mult
  
            let multy = mult * cash
  
            cash = cash += multy
           
          }
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = ms(timeout - (Date.now() - daily));
            let timeEmbed = new Discord.MessageEmbed()
            .setColor("#60b0f4")            
            .setDescription(`You've already collected your daily cash\n\nCollect it again in ${time}.`);
            interaction.reply({embeds: [timeEmbed]})
        }
        else{
            let time = ms(timeout - (Date.now() - daily));
        db.add(`cash_${uid}`, cash)
        db.set(`daily_${uid}`, Date.now())
        
        let embed = new Discord.MessageEmbed()
        .setTitle(`Daily Cash ${interaction.user.username}`)
        .addField("Earned Cash", `$${numberWithCommas(cash)}`)
embed.setColor('#60b0f4')

        interaction.reply({embeds: [embed]})
        
        }
        
          function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    
}
