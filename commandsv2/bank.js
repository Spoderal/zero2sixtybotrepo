const db = require('quick.db')
const Discord = require('discord.js')
const {SlashCommandBuilder} = require('@discordjs/builders')
const cars = require('../cardb.json')
const lodash = require(`lodash`)
module.exports = {
  data: new SlashCommandBuilder()
  .setName('bank')
  .setDescription("Check your bank, and deposit money")
  .addSubcommand((subcommand) => subcommand
  .setName("deposit")
  .setDescription("Deposit some cash")
  .addNumberOption((option) =>option
  .setName("amount")
  .setDescription("The amount you want to deposit")
  .setRequired(true))
  )
  .addSubcommand((subcommand) => subcommand
  .setName("withdraw")
  .setDescription("Withdraw some cash")
  .addNumberOption((option) =>option
  .setName("amount")
  .setDescription("The amount you want to withdraw")
  .setRequired(true))
  ),
  async execute(interaction) {
            let subcommand = interaction.options.getSubcommand()
              let user = interaction.user
     let userid = user.id
    let cash = db.fetch(`cash_${userid}`) || 0
    let bank = db.fetch(`bank_${userid}`) || 0
    let banklimit = db.fetch(`banklimit_${userid}`) || 10000
    let created = db.fetch(`created_${interaction.user.id}`)
    let amount = interaction.options.getNumber("amount")

    if(subcommand === "deposit"){

        if(amount > banklimit) return interaction.reply("Your bank doesn't have enough room for that much!")
        if(amount > (banklimit - bank)) return interaction.reply("Your bank doesn't have enough room for that much!")

        if(amount > cash) return interaction.reply(`You don't have enough cash!`)
        db.subtract(`cash_${userid}`, amount)
        db.add(`bank_${userid}`, amount)

        interaction.reply(`Deposited $${numberWithCommas(amount)}`)

    }
    else if(subcommand === "withdraw"){

        if(amount > bank) return interaction.reply("Your bank doesn't have enough cash to withdraw this amount!")

        db.add(`cash_${userid}`, amount)
        db.subtract(`bank_${userid}`, amount)

        interaction.reply(`Withdrawed $${numberWithCommas(amount)}`)

    }
 
   
       
        
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  function convert(val) {
    
    // thousands, millions, billions etc..
    var s = ["", "k", "m", "b", "t"];
  
    // dividing the value by 3.
    var sNum = Math.floor(("" + val).length / 3);
  
    // calculating the precised value.
    var sVal = parseFloat((
      sNum != 0 ? (val / Math.pow(1000, sNum)) : val).toPrecision(2));
    
    if (sVal % 1 != 0) {
        sVal = sVal.toFixed(1);
    }
  
    // appending the letter to precised val.
    return sVal + s[sNum];
  }
  }
  }

  function randomRange(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  }