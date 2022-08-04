const Discord = require("discord.js")
const cars = require('../cardb.json')
const db = require('quick.db')
const ms = require('ms')
const {SlashCommandBuilder} = require('@discordjs/builders')
const User = require('../schema/profile-schema')
const Cooldowns = require('../schema/cooldowns')
const Global = require('../schema/global-schema')
const Car = require('../schema/car')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('weekly')
    .setDescription("Collect your weekly cash"),
    async execute(interaction) {

        let cash = 750
        let uid = interaction.user.id
        let cooldowns = await Cooldowns.findOne({id: uid}) || new Cooldowns({id: uid})
        let userdata = await User.findOne({id: uid})
        let daily = cooldowns.weekly
        let patron = userdata.patron
        let gold
     if(patron && patron.tier == 1){
            cash *= 2
        }
        if(patron && patron.tier == 2){
            cash *= 3
        }
        if(patron && patron.tier == 3){
            cash *= 5
        }
        if(patron && patron.tier == 4){
            cash *= 6
            gold = patron.gold
        }
        let timeout = 604800000;
        let prestige = userdata.prestige
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
            userdata.cash += Number(cash)
            cooldowns.weekly = Date.now()
            
            let embed = new Discord.MessageEmbed()
            .setTitle(`Weekly Cash for ${interaction.user.username}`)
            .addField("Earned Cash", `$${numberWithCommas(cash)}`)
            .setColor("#60b0f4")
            if(gold){
                userdata.gold += Number(gold)
                embed.addField(`Earned Gold`, `<:z_gold:933929482518167552> ${gold}`)
            }
            cooldowns.save()
            userdata.save()
        interaction.reply({embeds: [embed]})
      
        }
      
      
        function numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
  }

