const db = require('quick.db')
const Discord = require('discord.js')
const {SlashCommandBuilder} = require('@discordjs/builders')
const cars = require('../cardb.json')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('charge')
  .setDescription("Charge up your EV")
  .addStringOption((option) => option
    .setName("car")
    .setDescription("The car by id to charge")
    .setRequired(false)
  ),
  async execute(interaction) {

    let created = db.fetch(`created_${interaction.user.id}`)

    if(!created) return interaction.reply(`Use \`/start\` to begin!`)
    let car = interaction.options.getString("car");
    let selected = db.fetch(`selected_${car}_${interaction.user.id}`);
    if (!selected)
    return interaction.reply(
      "That id doesn't have a car! Use /ids select [id] [car] to select it!"
      );
      if(!cars.Cars[selected.toLowerCase()].Electric) return interaction.reply("Thats not an EV!")
      let house = db.fetch(`house_${interaction.user.id}`)
          let userid = interaction.user.id
          let cash = db.fetch(`cash_${userid}`) || 0
          let range = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`)
          let maxrange = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}maxrange_${interaction.user.id}`)


          if(range == maxrange) return interaction.reply("This EV doesn't need charged!")
          if(house && house.Perks.includes("Free EV charging")) {
            let embed = new Discord.MessageEmbed()
            .setTitle(`⚡ Charging ${cars.Cars[selected.toLowerCase()].Name}... ⚡`)
            .setImage(`${cars.Cars[selected.toLowerCase()].Image}`)
 
 .setColor("#60b0f4")            
 db.set(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, maxrange)
    
            interaction.reply({embeds: [embed]})
              setTimeout(() => {
                  embed.setTitle("🔋 Charged! 🔋")
                  embed.setDescription(`Cost: $0`)
                  interaction.editReply({embeds: [embed]})
                }, 2000);
          }
          else {

            if(cash < 500) return interaction.reply("You don't have enough cash! You need $500 to charge your vehicle.")
            
          let embed = new Discord.MessageEmbed()
          .setTitle(`⚡ Charging ${cars.Cars[selected.toLowerCase()].Name}... ⚡`)
          .setImage(`${cars.Cars[selected.toLowerCase()].Image}`)
          embed.setColor('#60b0f4')
          db.set(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, maxrange)
          db.subtract(`cash_${userid}`, 500)
  
          interaction.reply({embeds: [embed]})
            setTimeout(() => {
                embed.setTitle("🔋 Charged! 🔋")
                embed.setDescription(`Cost: $500`)
                interaction.editReply({embeds: [embed]})
              }, 2000);
              
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