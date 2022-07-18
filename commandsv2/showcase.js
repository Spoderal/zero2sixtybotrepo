const db = require('quick.db')
const Discord = require('discord.js')
const pfpdb = require('../pfpsdb.json')
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("showcase")
    .setDescription("Showcase your car in your garage")
    .addStringOption((option) => option
    .setName("car")
    .setDescription("The car id you'd like to showcase")
    .setRequired(true)
  
    ),
    async execute(interaction) {
        let carsdb = require(`../cardb.json`)
        let usercars = db.fetch(`cars_${interaction.user.id}`)
        
        let idtoselect = interaction.options.getString("car");
        let selected = db.fetch(`selected_${idtoselect}_${interaction.user.id}`);
        if (!selected)
          return interaction.reply(
            "That id doesn't have a car! Use /ids select [id] [car] to select it!"
          );

          let carimage = db.fetch(`${carsdb.Cars[selected.toLowerCase()].Name}livery_${interaction.user.id}`) || carsdb.Cars[selected.toLowerCase()].Image

          db.set(`showcase_${interaction.user.id}`, carimage)
       

          interaction.reply(`✅ Showcasing your ${carsdb.Cars[selected.toLowerCase()].Name}`)

    }
}