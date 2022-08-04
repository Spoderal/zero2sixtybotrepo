const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const {MessageEmbed} = require('discord.js')
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('quick.db')
const cardb = require('../newcars.json')
module.exports = {
  data: new SlashCommandBuilder()
    .setName("testrace")
    .setDescription("Testing the new system")
    .addStringOption((option) => option
    .setName("tier")
    .setDescription("The bot tier to race")
    .setRequired(true)
    .addChoice('Tier 1', '1')

    )
    .addStringOption((option) => option
    .setName("car")
    .setDescription("The car id to use")
    .setRequired(true)
    ),
    async execute(interaction) {
    
        let user = interaction.user

        let idtoselect = interaction.options.getString("car");
        let selected = db.fetch(`selected_${idtoselect}_${user.id}`);
        if (!selected) return interaction.reply({content: `The id, "${idtoselect}" doesn't have a car! Use /ids select [id of your choice] [car] to select a car to it!`, ephemeral: true})

        let usercar = cardb[selected.toLowerCase()]

        console.log(selected)

        let carstats = db.fetch(`stats_${selected}_${user.id}`) 

        if(!carstats) {
            db.set(`stats_${selected}_${user.id}`, {
                Car: selected, 
                Speed: cardb[selected.toLowerCase()].Speed, 
                Acceleration: cardb[selected.toLowerCase()].Acceleration, 
                Handling: cardb[selected.toLowerCase()].Handling, 
                Grip: cardb[selected.toLowerCase()].Grip, 
                HP: cardb[selected.toLowerCase()].HP,
                Weight: cardb[selected.toLowerCase()].Weight

            
            }) 
             interaction.reply({content: `There was an error loading the stats for your car, so its been set back to default. Please join the support server and open a ticket if this was a mistake.`, ephemeral: true})
            return
        }


        function formula(speed, acceleration, handling, weight, grip) {
            
        }
        
    }
    
    
};

