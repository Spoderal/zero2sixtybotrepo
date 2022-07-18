const db = require('quick.db')
const Discord = require('discord.js')
const cars = require('../cardb.json')
const codes = require('../codes.json')
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("code")
    .setDescription("Redeem a code")
    .addStringOption((option) => option
    .setName("code")
    .setDescription("The code to redeem")
    .setRequired(true)),
  async execute(interaction) {
        let code = interaction.options.getString("code")
        let uid = interaction.user.id
        if(!code) return interaction.reply({content:"Specify a code to redeem! You can find codes in the Discord server, or on the Twitter page!", ephemeral: true})
        
        if(codes.Discord[code]){
            let redeemed = db.fetch(`redeemed_${code}_${uid}`)
            if(redeemed) return interaction.reply("You've already redeemed this code!")
            if(codes.Discord[code].Gold){
                interaction.reply(`Redeemed code ${code} and earned ${numberWithCommas(codes.Discord[code].Reward)} gold`)
                db.add(`gold_${uid}`, codes.Discord[code].Reward)

            }
            else {
                interaction.reply(`Redeemed code ${code} and earned $${numberWithCommas(codes.Discord[code].Reward)}`)
                db.add(`cash_${uid}`, codes.Discord[code].Reward)
            }
            db.set(`redeemed_${code}_${uid}`, true)
        }
        else if(codes.Twitter[code]){
            let redeemed = db.fetch(`redeemed_${code}_${uid}`)
            if(redeemed) return interaction.reply("You've already redeemed this code!")
            if(codes.Twitter[code].Gold){
                interaction.reply(`Redeemed code ${code} and earned ${numberWithCommas(codes.Twitter[code].Reward)} gold`)
                db.add(`gold_${uid}`, codes.Twitter[code].Reward)

            }
          
            else {
                interaction.reply(`Redeemed code ${code} and earned $${numberWithCommas(codes.Twitter[code].Reward)}`)
                db.add(`cash_${uid}`, codes.Twitter[code].Reward)
            }
            db.set(`redeemed_${code}_${uid}`, true)
        }
      
        
        else if(codes.Patreon[code]){
            let patreontier1 = db.fetch(`patreon_tier_1_${uid}`)
            let patreontier2 = db.fetch(`patreon_tier_2_${uid}`)
            let patreontier3 = db.fetch(`patreon_tier_3_${uid}`)
            let patreontier4 = db.fetch(`patreon_tier_4_${uid}`)

            if(!patreontier1 && !patreontier2 && !patreontier3 && !patreontier4) return interaction.reply("You need to purchase a patreon tier to redeem this code!")

            let redeemed = db.fetch(`redeemed_${code}_${uid}`)
            if(redeemed) return interaction.reply("You've already redeemed this code!")
            if(codes.Patreon[code].Gold){
                interaction.reply(`Redeemed code ${code} and earned ${numberWithCommas(codes.Patreon[code].Reward)} gold`)
                db.add(`gold_${uid}`, codes.Patreon[code].Reward)

            }
          
            else {
                interaction.reply(`Redeemed code ${code} and earned $${numberWithCommas(codes.Patreon[code].Reward)}`)
                db.add(`cash_${uid}`, codes.Patreon[code].Reward)
            }
            db.set(`redeemed_${code}_${uid}`, true)
        }
        else {
            interaction.reply({content:"Thats not a valid code!", ephemeral: true})
        }
    }
  }


  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
