const db = require('quick.db')
const Discord = require('discord.js')
const cars = require('../cardb.json')
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Claim vote rewards for top.gg"),
  async execute(interaction) {
    let created = db.fetch(`created_${interaction.user.id}`)
    let weekytask1 = db.fetch(`dailytask_${interaction.user.id}`);

    if(!created) return interaction.reply(`Use \`/start\` to begin!`)
      let uid = interaction.user.id
        let embed = new Discord.MessageEmbed()
        .setDescription(`You haven't voted yet! [Vote](https://top.gg/bot/932455367777067079/vote) then run the command again.`)

embed.setColor('#60b0f4')
        let voted = db.fetch(`voted_${uid}`)

        if(!voted) return interaction.reply({embeds: [embed]})

        db.add(`cash_${uid}`, 1000)
        db.add(`wheelspins_${uid}`, 1)
        db.delete(`voted_${uid}`)

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
          db.set(`dailytask_${interaction.user.id}.completed`, true);
          db.add(`cash_${interaction.user.id}`, weekytask1.reward);
        }


        interaction.reply({embeds: [embed2]})
    }
  }
