const Discord = require("discord.js")
const cars = require('../cardb.json')
const db = require('quick.db')
const ms = require('ms')
const lodash = require('lodash')
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('dailycrate')
    .setDescription("Collect your daily crate PATREON ONLY"),
    async execute(interaction) {
        let uid = interaction.user.id
        let rewards = ["3000 Cash", "1 Barn Map", "5000 Cash", "2 Barn Maps", "5 Exotic Import Keys", "15 Rare Import Keys"]
        let daily = db.fetch(`dailycrate_${uid}`)
        let patreon1 = db.fetch(`patreon_tier_1_${uid}`)
        let patreon2 = db.fetch(`patreon_tier_2_${uid}`)
        let patreon3 = db.fetch(`patreon_tier_3_${uid}`)
        let patreon4 = db.fetch(`patreon_tier_4_${uid}`)

        if(!patreon1 && !patreon2 && !patreon3 && !patreon4) return interaction.reply({content:"This command is limited to patrons, if you'd like to support us, view the patreon in the help command!", ephemeral: true})
        let timeout = 86400000;
        
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = ms(timeout - (Date.now() - daily));
            let timeEmbed = new Discord.MessageEmbed()

 .setColor("#60b0f4")            .setDescription(`You've already collected your daily crate\n\nCollect it again in ${time}.`);
            interaction.reply({embeds: [timeEmbed]})
        }
        else{
            let reward = lodash.sample(rewards)
            if(reward == "3000 Cash"){
                db.add(`cash_${uid}`, 3000)
            }
            else if(reward == "5000 Cash"){
                db.add(`cash_${uid}`, 5000)
            }
            else if(reward == "1 Barn Map"){
                db.add(`barnmaps_${uid}`, 1)
            }
            else if(reward == "2 Barn Maps"){
                db.add(`barnmaps_${uid}`, 2)
            }
            else if(reward == "5 Exotic Import Keys"){
                db.add(`exotickeys_${uid}`, 5)
            }
            else if(reward == "15 Rare Import Keys"){
                db.add(`rarekeys_${uid}`, 15)
            }
            db.set(`dailycrate_${uid}`, Date.now())
        
        let embed = new Discord.MessageEmbed()
        .setTitle(`Daily Crate ${interaction.user.username}`)
        .addField("Redeemed", `${reward}`)

embed.setColor('#60b0f4')
        interaction.reply({embeds: [embed]})
        
        }
        
          function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    
}
