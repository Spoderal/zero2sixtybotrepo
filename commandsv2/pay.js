const db = require('quick.db')
const discord = require('discord.js')
const cars = require('../cardb.json')
const {SlashCommandBuilder} = require('@discordjs/builders')
module.exports = {
  
    data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription("BOT OWNER ONLY")
    .addUserOption(option => option
      .setName('target')
      .setDescription('The user you want to give something to')
      .setRequired(true))
    .addStringOption((option) => option
    .setName("amount")
    .setDescription("The amount")
    .setRequired(true))
  
    .addStringOption((option) => option
    .setName("item")
    .setDescription("The amount")
    .addChoice("Cash", "cash")
    .addChoice("Rare Keys", "rarekeys")
    .addChoice("Common Keys", "commonkeys")
    .addChoice("Exotic Keys", "exotickeys")
    .addChoice("Common Barn Maps", "barnmaps")
    .addChoice("Uncommon Barn Maps", "ubarnmaps")
    .addChoice("Rare Barn Maps", "rbarnmaps")
    .addChoice("Legendary Barn Maps", "lbarnmaps")
    .addChoice("Wheel spins", "wheelspins")
    .addChoice("Super wheel spins", "swheelspins")
    .setRequired(true)),
    async execute(interaction) {
      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
      
        if(interaction.user.id !== "937967206652837928" && interaction.user.id !== "890390158241853470" && interaction.user.id !== "670895157016657920"){
    
          interaction.reply({content:"You dont have permission to use this command!", ephemeral: true})
            return;
        }
          else{
        let togive = interaction.options.getString("amount")
        let givingto = interaction.options.getUser("target")
            let itemtogive = interaction.options.getString("item")
        
        if(!togive) return
        if(!givingto) return
      
    
        db.add(`${itemtogive}_${givingto.id}`, togive)
    
        interaction.reply(`Gave ${givingto} ${numberWithCommas(togive)} ${itemtogive}`)
    
         
        }

    }
    
  }