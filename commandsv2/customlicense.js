const Discord = require("discord.js")
const cars = require('../cardb.json')
const db = require('quick.db')
let list = cars.Cars
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlicense')
    .setDescription("Set your license plate")
    .addStringOption(option => option
        .setName('car')
        .setDescription('The car you want to set a license number to')
        .setRequired(true)
        
    )
    .addStringOption((option) =>option
    .setName("plate")
    .setDescription("The plate number to set")
    .setRequired(true)),
   
    async execute(interaction) {

        let numbersandletters = interaction.options.getString("plate")
        let car = interaction.options.getString("car")
        if(!list[car.toLowerCase()]) return interaction.reply("Thats not a car!")
        let usercars = db.fetch(`cars_${interaction.user.id}`)
        if(!usercars.includes(`${cars.Cars[car.toLowerCase()].Name.toLowerCase()}`)) return interaction.reply("You dont have that car!")
        if(!numbersandletters) return interaction.reply("Specify a plate number!") 
    
        let letterCount = numbersandletters.replace(/\s+/g, '').length;
        console.log(letterCount)
        if(letterCount > 6) return interaction.reply("Max characters 6")
    
        db.set(`${cars.Cars[car.toLowerCase()].Name}license_plate_${interaction.user.id}`, numbersandletters)
        interaction.reply(`Set plate number for ${car} to ${numbersandletters}`)

    }
    
  }