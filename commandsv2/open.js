const db = require('quick.db')
const lodash = require('lodash')
const { MessageEmbed } = require('discord.js')
const {SlashCommandBuilder} = require('@discordjs/builders')
module.exports = {
  
    data: new SlashCommandBuilder()
    .setName('open')
    .setDescription("Open a crate for profile helmets")
    .addStringOption((option) => option 
    .setName("crate")
    .setDescription("The crate you want to open")
    .addChoice("Common", "common")
    .addChoice("Rare", "rare")
    .addChoice("Seasonal", "seasonal")
    .setRequired(true)),
    async execute(interaction) {

      let db = require('quick.db')
      let pfps = require('../pfpsdb.json')
      let crates = require('../cratedb.json')
      let colors = require("../colordb.json")
     
      let list = ['common', 'rare', 'seasonal']
      
      let bought = interaction.options.getString("crate")
      let cash = db.fetch(`cash_${interaction.user.id}`)
      if(!bought) return interaction.reply("**To use this command, specify the crate you want to buy. To check what crates are available check the crates shop by sending /crates.**")
      if(!crates.Crates[bought.toLowerCase()]) return interaction.reply("**That crate isn't available yet, suggest it in the support server! In the meantime, check how to use the command by running /open.**")
      if(!crates.Crates[bought.toLowerCase()].Price) return interaction.reply("Thats not a purchasable crate!")
    
  
     
      if (cash < crates.Crates[bought.toLowerCase()].Price) return interaction.reply(`You dont have enough cash! This crate costs $${crates.Crates[bought.toLowerCase()].Price}`)
      let cratecontents = crates.Crates[bought.toLowerCase()].Contents
      let randomitem = lodash.sample(cratecontents)
      db.subtract(`cash_${interaction.user.id}`, crates.Crates[bought.toLowerCase()].Price);
      let embed = new MessageEmbed()
      
       if(pfps.Pfps[randomitem]) { 
         let helmets = db.fetch(`pfps_${interaction.user.id}`) || []
         if(helmets.includes(pfps.Pfps[randomitem].Name.toLowerCase())) {
           db.add(`cash_${interaction.user.id}`, crates.Crates[bought.toLowerCase()].Price)
           interaction.reply(`You already have the helmet you won, so you've received a full refund!`)
           return;
         }
         
         db.push(`pfps_${interaction.user.id}`, randomitem)
          embed.setTitle("Preview")
          embed.setThumbnail(pfps.Pfps[randomitem].Image)
          .setColor("#60b0f4")
          interaction.reply({content:`You opened a ${bought} and won a ${randomitem} profile image!`, embeds: [embed]});
  
         }
    }
    
  }