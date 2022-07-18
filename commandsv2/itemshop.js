const db = require("quick.db")
const Discord = require("discord.js")
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('itemshop')
    .setDescription("Check the item shop")
,
    async execute(interaction) {
        let itemshop = db.fetch(`itemshop`)
        let policeitem = itemshop.Police 
        let multi = itemshop.Multi
        let other = itemshop.Other
        let other2 = itemshop.Other2
        let other3 = itemshop.Other3

        let embed = new Discord.MessageEmbed()
        .setTitle("Daily Item Shop")
        .setDescription(`
        ${policeitem.Emote} **${policeitem.Name} : $${numberWithCommas(policeitem.Price)}** \`${policeitem.Type}\`\n${policeitem.Action}
        \n${other.Emote} **${other.Name} : $${numberWithCommas(other.Price)}**  \`${other.Type}\`\n${other.Action}
        \n${other2.Emote} **${other2.Name} : $${numberWithCommas(other2.Price)}** \`${other2.Type}\`\n${other2.Action}
        \n${other3.Emote} **${other3.Name} : $${numberWithCommas(other3.Price)}** \`${other3.Type}\`\n${other3.Action}\n

        `)
        .setColor("#60b0f4")

        interaction.reply({embeds: [embed]})
       
    }
    
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }