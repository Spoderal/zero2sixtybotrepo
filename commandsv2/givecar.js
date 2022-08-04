const db = require('quick.db')
const discord = require('discord.js')
const cars = require('../cardb.json')
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('givecar')
    .setDescription("Give cars to users (OWNER ONLY)")
    .addStringOption((option) => option 
    .setName("car")
    .setDescription("The car to give")
    .setRequired(true)
    )
    .addUserOption((option) => option 
    .setName("user")
    .setDescription("The user to give the car to")
    .setRequired(true)),
    async execute(interaction) {

      if(interaction.user.id !== "890390158241853470" && interaction.user.id !== "937967206652837928"){
    
          interaction.reply("You dont have permission to use this command!")
          return;
      }
        else{
      let togive = interaction.options.getString("car")
      let givingto = interaction.options.getUser("user")
          
      
      if(!togive) return
      if(!givingto) return
    
      if(!cars.Cars[togive.toLowerCase()]) return  interaction.reply("Thats not a car!")
          
      db.push(`cars_${givingto.id}`, cars.Cars[togive.toLowerCase()].Name.toLowerCase())
      db.set(`${cars.Cars[togive.toLowerCase()].Name}speed_${givingto.id}`, cars.Cars[togive.toLowerCase()].Speed)
      db.set(`${cars.Cars[togive.toLowerCase()].Name}resale_${givingto.id}`, (cars.Cars[togive.toLowerCase()].Price * 0.75))
      db.set(`${cars.Cars[togive.toLowerCase()].Name}060_${givingto.id}`, (cars.Cars[togive.toLowerCase()]["0-60"]))

      if(cars.Cars[togive.toLowerCase()].Junked){
        db.set(`${cars.Cars[togive.toLowerCase()].Name}restoration_${interaction.user.id}`, 0)
      }

      interaction.reply(`Gave <@${givingto.id}> a ${cars.Cars[togive.toLowerCase()].Name}`)
    
       
      }
      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
      
    }
 
  }