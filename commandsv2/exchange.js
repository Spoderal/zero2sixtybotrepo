const db = require("quick.db")
const Discord = require('discord.js')
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exchange")
    .setDescription("Exchange gold for keys, maps, and more!")
    .addStringOption((option) => option
    .setName("item")
    .setDescription("The item to exchange gold for")
    .addChoice("Cash", "cash")
    .addChoice("Rare Keys", "rkeys")
    .addChoice("Exotic Keys", "ekeys")
    .addChoice("Uncommon Barn Maps", "ubmaps")
    .addChoice("Rare Barn Maps", "rbmaps")
    .addChoice("Legendary Barn Maps", "lbmaps")
    .addChoice("Super Wheel Spins", "swspins")

    .setRequired(true))
    .addNumberOption((option) => option
    .setName("amount")
    .setDescription("How much gold you want to exchange (like 20 gold)")
    .setRequired(true)),
  async execute(interaction) {

        let uid = interaction.user.id
        let toconv = interaction.options.getString("item")
        let toturnin = interaction.options.getNumber("amount")
        let gold = db.fetch(`goldbal_${interaction.user.id}`) || 0

        if(!toturnin) return interaction.reply("Specify how much gold you'd like to exchange!")
        if(isNaN(toturnin)) return interaction.reply("Specify a number!")
        if(toturnin > gold) return interaction.reply("You don't have enough gold!")
       if(toconv == "cash"){
        let finalamount = toturnin * 10000
        db.subtract(`goldbal_${interaction.user.id}`, toturnin)
        db.add(`cash_${interaction.user.id}`, finalamount)
        interaction.reply(`Converted ${toturnin} gold into $${numberWithCommas(finalamount)}`)
       }

     else if(toconv == "rkeys"){
         let finalamount = toturnin * 2.5
         db.subtract(`goldbal_${interaction.user.id}`, toturnin)
         db.add(`rarekeys_${interaction.user.id}`, finalamount)
         interaction.reply(`Converted ${toturnin} gold into ${finalamount} rare keys`)
         
       }
       else if(toconv == "ekeys"){
        let finalamount = toturnin * 0.5
        db.subtract(`goldbal_${interaction.user.id}`, toturnin)
        db.add(`exotickeys_${interaction.user.id}`, finalamount)
        interaction.reply(`Converted ${toturnin} gold into ${finalamount} exotic keys`)

      }
      else if(toconv == "ubmaps"){
        let finalamount = toturnin * 5
        db.subtract(`goldbal_${interaction.user.id}`, toturnin)
        db.add(`ubarnmaps_${interaction.user.id}`, finalamount)
        interaction.reply(`Converted ${toturnin} gold into ${finalamount} uncommon barn maps`)
      }
      else if(toconv == "rbmaps"){
        let finalamount = toturnin * 2
        db.subtract(`goldbal_${interaction.user.id}`, toturnin)
        db.add(`rbarnmaps_${interaction.user.id}`, finalamount)
        interaction.reply(`Converted ${toturnin} gold into ${finalamount} rare barn maps`)

      }
      else if(toconv == "lbmaps"){
        let finalamount = toturnin * 0.2
        db.subtract(`goldbal_${interaction.user.id}`, toturnin)
        db.add(`lbarnmaps_${interaction.user.id}`, finalamount)
        interaction.reply(`Converted ${toturnin} gold into ${finalamount} legendary barn maps`)
      }
      else if(toconv == "swspins"){
        let finalamount = toturnin * 0.05
        db.subtract(`goldbal_${interaction.user.id}`, toturnin)
        db.add(`swheelspins_${interaction.user.id}`, finalamount)
        interaction.reply(`Converted ${toturnin} gold into ${finalamount} Super wheelspins`)
      }

    }
  }
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}