const discord = require('discord.js')
const db = require('quick.db')
const seasons = require("../seasons.json")

const {SlashCommandBuilder} = require('@discordjs/builders')
const User = require('../schema/profile-schema')
const Cooldowns = require('../schema/cooldowns')
const Global = require('../schema/global-schema')
module.exports = {
  data: new SlashCommandBuilder()
  .setName('season')
  .setDescription("Check the summer season")
  .addStringOption((option) => option 
  .setName("page")
  .setDescription("View a page of the season")
  .setRequired(false)
  ),
  async execute(interaction) {
    let userdata = await User.findOne({id: interaction.user.id})

    let seasonrewards = seasons.Seasons.Summer.Rewards
    let reward = []
    let redeemed = userdata.seasonrewards

    let page = interaction.options.getString("page")
    for(var i in seasonrewards)  {
      let item = seasonrewards[i]
      reward.push(`**${item.Number}** : ${item.Item} **Required : ${numberWithCommas(item.Required)} Notoriety**`)
    }
    let itemrewards1 = reward.slice(0, 10)
    let itemrewards2 = reward.slice(10, 20)
    let itemrewards3 = reward.slice(20, 30)
    let itemrewards4 = reward.slice(30, 40)
    let itemrewards5 = reward.slice(40, 50)

    let seasonxp = db.fetch(`notoriety3_${interaction.user.id}`) || 0

    if(!page || page == "1"){
      
      let embed = new discord.MessageEmbed()
      .setTitle("Summer Season Page 1 of 5")
      .setDescription(`*Ends August 31st 2022*\n**Use \`/reward [number]\` to redeem rewards.**\n\nNext reward: ${redeemed.length += 1}`)
   .addField("Rewards", `${itemrewards1.join('\n')}`)
   .setColor("#60b0f4")
   .setThumbnail("https://i.ibb.co/C0S0bfQ/summericongif.gif")
   .setFooter("Tip: Use /season [page #] to view page numbers")
   interaction.reply({embeds: [embed]})
  }

  else if(page == "2"){
    let embed = new discord.MessageEmbed()
    .setTitle("Summer Season Page 2 of 5")
    .setDescription("*Ends August 31st 2022*\n**Use \`/reward [number]\` to redeem rewards.**")
  .setFooter(`Your notoriety: ${seasonxp}`)
  .addField("Rewards", `${itemrewards2.join('\n')}`)
  .setColor("#60b0f4")
  .setThumbnail("https://i.ibb.co/xFH9Ps9/summericongif.gif")
  .setFooter("Tip: Use /season [page #] to view page numbers")
  interaction.reply({embeds: [embed]})
  }

  else if(page == "3"){
    let embed = new discord.MessageEmbed()
    .setTitle("Summer Season Page 3 of 5")
    .setDescription("*Ends August 31st 2022*\n**Use \`/reward [number]\` to redeem rewards.**")
    .setFooter(`Your notoriety: ${seasonxp}`)
  .addField("Rewards", `${itemrewards3.join('\n')}`)
  .setColor("#60b0f4")
  .setThumbnail("https://i.ibb.co/xFH9Ps9/summericongif.gif")
  .setFooter("Tip: Use /season [page #] to view page numbers")
  interaction.reply({embeds: [embed]})
  }

  else if(page == "4"){
    let embed = new discord.MessageEmbed()
    .setTitle("Summer Season Page 4 of 5")
    .setDescription("*Ends August 31st 2022*\n**Use \`/reward [number]\` to redeem rewards.**")
    .setFooter(`Your notoriety: ${seasonxp}`)
  .addField("Rewards", `${itemrewards4.join('\n')}`)
  .setColor("#60b0f4")
  .setThumbnail("https://i.ibb.co/xFH9Ps9/summericongif.gif")
  .setFooter("Tip: Use /season [page #] to view page numbers")
  interaction.reply({embeds: [embed]})
  }

  else if(page == "5"){
    let embed = new discord.MessageEmbed()
    .setTitle("Summer Season Page 5 of 5")
    .setDescription("*Ends August 31st 2022*\n**Use \`/reward [number]\` to redeem rewards.**")
    .setFooter(`Your notoriety: ${seasonxp}`)
  .addField("Rewards", `${itemrewards5.join('\n')}`)
  .setColor("#60b0f4")
  .setThumbnail("https://i.ibb.co/xFH9Ps9/summericongif.gif")
  .setFooter("Tip: Use /season [page #] to view page numbers")
  interaction.reply({embeds: [embed]})

  }
  
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  }
    
  }