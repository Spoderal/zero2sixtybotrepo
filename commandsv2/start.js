const db = require("quick.db")
const discord = require('discord.js')
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('start')
    .setDescription("Begin your racing career"),
    async execute(interaction) {
        let userid = interaction.user.id
        let created = db.fetch(`created_${userid}`)
        if(created) return interaction.reply("You have an account!")
        let embed = new discord.MessageEmbed()
        .setTitle("You've started your journey!")
        .setDescription("The bot will guide you through the commands so you can get started, the tutorial will cover buying a car, racing, and upgrading. Run \`/dealer\` to begin!\n\nAny Questions? Join our [community server](https://discord.gg/bHwqpxJnJk)!\n\nHave fun!\n[YouTube tutorial on Zero2Sixty](https://www.youtube.com/watch?v=HA5lm8UImWo&ab_channel=Zero2Sixty)")
        .setColor("#60b0f4")
        .setThumbnail("https://i.ibb.co/5n1ts36/newlogoshadow.png")
        interaction.reply({embeds: [embed]})
        db.set(`created_${userid}`, true)
        db.add(`cash_${userid}`, 500)
        db.set(`cars_${userid}`, [])
        db.set(`parts_${userid}`, [])
        db.set(`badges_${userid}`, [])
        db.set(`newplayer_${userid}`, true)
        db.set(`newplayerstage_${userid}`, 1)

    }
}