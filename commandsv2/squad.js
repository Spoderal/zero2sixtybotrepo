const db = require("quick.db")
const discord = require('discord.js')
const squads = require('../squads.json')
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('squad')
    .setDescription("Check the details of a squad")
    .addStringOption((option) =>option
    .setName("squad")
    .setDescription("The squad you want to see the details of")
    .setRequired(true)
    .addChoice("Flame House", "flamehouse")
    .addChoice("Skull Crunchers", "skullcrunchers")
    .addChoice("The Speed", "thespeed")
    .addChoice("Scrap Heads", "scrapheads")
    .addChoice("Snow Monsters", "snowmonsters")
    .addChoice("Tuner4Life", "tuner4life")
    .addChoice("BikerGang", "bikergang")
    .addChoice("ZeroRacers", "zeroracers"))
    ,
    async execute(interaction) {
        let squas = squads.Squads
        let squad = interaction.options.getString("squad")
        if(!squad) return interaction.reply("Specify a squad!")
        if(!squas[squad.toLowerCase()]) return interaction.reply("Thats not a squad!")
        
        let embed = new discord.MessageEmbed()
        .setTitle(`Squad Info for ${squas[squad.toLowerCase()].Name}`)
        .setThumbnail(squas[squad.toLowerCase()].Icon)
        .setColor(squas[squad].Color)
        .addField("Leader", squas[squad].Leader)
        .addField("Members", `${squas[squad].Members.join('\n')}`)
        .addField("Class", `${squas[squad].Class}`)
        
        interaction.reply({embeds: [embed]})

    }
}
