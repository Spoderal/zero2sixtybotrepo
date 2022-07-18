const Discord = require("discord.js")
const cars = require('../cardb.json')
const db = require('quick.db')
const ms = require('ms')
const {SlashCommandBuilder} = require('@discordjs/builders')


module.exports = {
    data: new SlashCommandBuilder()
    .setName('weekly')
    .setDescription("Collect your weekly cash"),
    async execute(interaction) {

        let cash = 750
        let uid = interaction.user.id
        let daily = db.fetch(`weekly_${uid}`)
        let patreon1 = db.fetch(`patreon_tier_1_${uid}`)
        let patreon2 = db.fetch(`patreon_tier_2_${uid}`)
        let patreon3 = db.fetch(`patreon_tier_3_${uid}`)
        let patreon4 = db.fetch(`patreon_tier_4_${uid}`)
        let gold
            if(patreon1){
            cash *= 2
        }
        else  if(patreon2){
            cash *= 3
        }
        else if(patreon3){
            cash *= 5
        }
      else  if(patreon4){
            cash *= 6
            gold = db.fetch(`givegold_${uid}`)
        }
        let timeout = 604800000;
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
            .setDescription(`You've already collected your weekly cash\n\nCollect it again in ${time}.`);
            interaction.reply({embeds: [timeEmbed]})
        }
        else{
            db.add(`cash_${uid}`, cash)
            db.set(`weekly_${uid}`, Date.now())
            
            let embed = new Discord.MessageEmbed()
            .setTitle(`Weekly Cash for ${interaction.user.username}`)
            .addField("Earned Cash", `$${numberWithCommas(cash)}`)
            .setColor("#60b0f4")
            if(gold){
                db.add(`goldbal_${uid}`, gold)
                embed.addField(`Earned Gold`, `<:z_gold:933929482518167552> ${gold}`)
            }
        interaction.reply({embeds: [embed]})
      
        }
      
      
        function numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
  }

