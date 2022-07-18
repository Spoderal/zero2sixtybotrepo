const Discord = require("discord.js")
const cars = require('../cardb.json')
const db = require('quick.db')
const ms = require('ms')

const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('notifications')
    .setDescription("View your notifications"),
    async execute(interaction) {
        let uid = interaction.user.id
        let cash = 250
        let daily = db.fetch(`daily_${uid}`)
        let weekly = db.fetch(`weekly_${uid}`)
        let weeklytimeout = 604800000
        let dailytimeout = 86400000
        let votetimer = 43200000
        let liverynotifs = db.fetch(`liverynotifs_${uid}`)
        let vote = db.fetch(`votetimer_${uid}`)

        let emote = "✅"
        let emote2 = "✅"
        let emote3 = "✅"
        if(daily !== null && dailytimeout - (Date.now() - daily) > 0){
            emote = "❌"
        }
        if(weekly !== null && weeklytimeout - (Date.now() - weekly) > 0){
            emote2 = "❌"
        }
        if(vote !== null && votetimer - (Date.now() - vote) > 0){
            emote3 = "❌"
        }


        
        let embed = new Discord.MessageEmbed()
        .setTitle(`Notification Panel`)
        .addField("Daily", `${emote}`)
        .addField(`Weekly`, `${emote2}`)
        .addField(`Top.gg Vote`, `${emote3}`)
        .setColor("#60b0f4")
       
        interaction.reply({embeds: [embed]})
        
        
        
          function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    
}
