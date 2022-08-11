const Discord = require("discord.js");
const db = require("quick.db")
const Canvas = require("canvas")
const profilepics = require("../pfpsdb.json")
const badgedb = require("../badgedb.json")
const cardb = require("../cardb.json")
const ms = require('pretty-ms')
const {SlashCommandBuilder} = require('@discordjs/builders')
const User = require('../schema/profile-schema')
const Cooldowns = require('../schema/cooldowns')
const Global = require('../schema/global-schema')
const Car = require('../schema/car')
const prestigedb = require(`../prestige.json`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription("View a profile")
    .addUserOption((option) => option
    .setName("user")
    .setDescription("View the profile of another user")
    .setRequired(false)
    )
   ,
    async execute(interaction) {

      let user = interaction.options.getUser("user") || interaction.user

      let userdata = await User.findOne({id: user.id})


      let prestige = userdata.prestige || 0
      let racerank = userdata.racerank
      let driftrank = userdata.driftrank
      let networth = 0

      let helmet = userdata.helmet
      console.log(helmet)
      let acthelmet = profilepics.Pfps[helmet.toLowerCase()].Image

      let title = userdata.title

      if(prestige == 0){
        title = "Noob Racer"
      }

     else if(prestige > 0){
        title = prestigedb[`${prestige}`].Title
      }

      let cars = userdata.cars
      cars = cars.sort(function (b, a) {
        return a.Speed - b.Speed
      })

      let finalprice = 0

      for(car in cars){
        let car2 = cars[car]

        let price = Number(cardb.Cars[car2.Name.toLowerCase()].Price)

        finalprice += price
      }
      
      let cash = userdata.cash
      finalprice += cash

      console.log(cars[0])
      let bestcar = cars[0]

      let embed = new Discord.MessageEmbed()
      .setTitle(`${title}`)
      .setAuthor(`${user.username} - Profile`)
      .setColor("#60b0f4")
      .setThumbnail(acthelmet)
      .addField(`Progress`, `Race Rank: ${racerank}\nDrift Rank: ${driftrank}\nPrestige: ${prestige}\nTier: ${userdata.tier}`)
      .addField(`Best Car`, `${bestcar.Emote} ${bestcar.Name}\n\nSpeed: ${bestcar.Speed}MPH\n0-60: ${bestcar.Acceleration}s\nHandling: ${bestcar.Handling}`, true)
      .addField(`Networth`, `$${numberWithCommas(finalprice)}`, true)



      interaction.reply({embeds: [embed]})





      
      
 
    }
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}