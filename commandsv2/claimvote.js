const db = require('quick.db')
const Discord = require('discord.js')
const cars = require('../cardb.json')
const { SlashCommandBuilder } = require("@discordjs/builders");
const Cooldowns = require('../schema/cooldowns')
const partdb = require('../partsdb.json')
const Global = require('../schema/global-schema')
module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Claim vote rewards for top.gg"),
  async execute(interaction) {
    let created = db.fetch(`created_${interaction.user.id}`)
    
    if(!created) return interaction.reply(`Use \`/start\` to begin!`)
    let uid = interaction.user.id
    let userdata = await User.findOne({id: uid}) || new User({id: uid})
    let weekytask1 = userdata.weeklytask
        let cooldowndata = await Cooldowns.findOne({id: uid}) || new Cooldowns({id: uid})
        let embed = new Discord.MessageEmbed()
        .setDescription(`You haven't voted yet! [Vote](https://top.gg/bot/932455367777067079/vote) then run the command again.`)

embed.setColor('#60b0f4')
        let voted = userdata.hasvoted

        if(!voted) return interaction.reply({embeds: [embed]})

        userdata.cash += 1000
        userdata.wheelspins += 1
        userdata.hasvoted = null

        let embed2 = new Discord.MessageEmbed()
        .setThumbnail("https://i.ibb.co/JjrvkQs/smalllogo.png")
        .setDescription("Thank you for voting! Here's $1k cash, and a wheelspin! 💙")
        embed.setColor('#60b0f4')
        if (
          weekytask1 &&
          !weekytask1.completed &&
          weekytask1.task == "Vote for the bot"
        ) {
          embed2.addField("Task Completed", `\u200b`)
          userdata.weeklytask.completed = true
          userdata.cash += userdata.weeklytask.reward
        }
        userdata.save()


        interaction.reply({embeds: [embed2]})
    }
  }
