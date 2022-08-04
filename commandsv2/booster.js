const Discord = require("discord.js")
const cars = require('../cardb.json')
const db = require('quick.db')
const ms = require('ms')


const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('boost')
  .setDescription("Get rewards from boosting the community server"),
  async execute(interaction) {
        let cash = 1000
        let daily = db.fetch(`boost_${interaction.user.id}`)
        let patreon1 = db.fetch(`patreon_tier_1_${interaction.user.id}`)
        let patreon2 = db.fetch(`patreon_tier_2_${interaction.user.id}`)
        let patreon3 = db.fetch(`patreon_tier_3_${interaction.user.id}`)
        let booster = db.fetch(`patreon_tier_b_${interaction.user.id}`)
        if(!booster) return interaction.reply("You're not a community server booster!")
        if(patreon1){
            cash *= 2
        }
        if(patreon2){
            cash *= 3
        }
        if(patreon3){
            cash *= 5
        }
        let timeout = 14400000;
     
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = ms(timeout - (Date.now() - daily));
            let timeEmbed = new Discord.MessageEmbed()
            .setColor("#60b0f4")
            .setDescription(`You've already collected your booster cash\n\nCollect it again in ${time}.`);
            interaction.reply({embeds: [timeEmbed]})
        }
        else{
            let time = ms(timeout - (Date.now() - daily));
        db.add(`cash_${interaction.user.id}`, cash)
        db.set(`boost_${interaction.user.id}`, Date.now())

        let embed = new Discord.MessageEmbed()
        .setTitle(`Booster Cash for ${interaction.user.username}`)
        .addField("Earned Cash", `$${numberWithCommas(cash)}`)
        .setColor("#60b0f4")
        interaction.reply({embeds: [embed]})

        }

    }
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
