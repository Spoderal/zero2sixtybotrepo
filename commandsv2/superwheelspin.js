const Discord = require("discord.js")
const carsdb = require('../cardb.json')
const db = require('quick.db')
const ms = require('ms')
const {SlashCommandBuilder} = require('@discordjs/builders')
const lodash = require("lodash")
const wheelspinrewards = require('../superwheelspinrewards.json')
const partsdb = require('../partsdb.json')
const User = require('../schema/profile-schema')
const Cooldowns = require('../schema/cooldowns')
const Global = require('../schema/global-schema')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('superwheelspin')
    .setDescription("Spin the super wheel for super prizes!"),
    async execute(interaction) {

        let uid = interaction.user.id
        let userdata = await User.findOne({id: uid})
        let cooldowndata = await Cooldowns.findOne({id: uid}) || new Cooldowns({id: uid})

        let wheelspincool = cooldowndata.swheelspin || 0
        let timeout = 5000;
        if (wheelspincool !== null && timeout - (Date.now() - wheelspincool) > 0) return interaction.reply("Please wait 5 seconds before using this command again.")
         let wheelspins = userdata.swheelspins
         if(wheelspins <= 0) return interaction.reply("You're out of super wheel spins!")
        let items = ['🏎️', '💵', '⚙️', '❓']
      let item =   lodash.sample(items)
      let cash = wheelspinrewards.Cash
      let cars = wheelspinrewards.Cars
      let bad = wheelspinrewards.BadRewards

      let parts = wheelspinrewards.Parts
     let garagespaces =  userdata.garagelimit

      let usercars = userdata.cars
    userdata.swheelspins -= 1
    userdata.update()
    cooldowndata.swheelspin = Date.now()
    cooldowndata.save()
        let embed = new Discord.MessageEmbed()
        .setTitle("Super Wheel Spin!")
        .setDescription(`${item}`)
        .setColor("#60b0f4")
        .setThumbnail("https://i.ibb.co/pwbLqnR/wheelimg.png")
        interaction.reply({embeds: [embed]})
        setTimeout(() => {
            let item =   lodash.sample(items)
            embed.setDescription(`${item}`)
            interaction.editReply({embeds: [embed]})

        }, 1000);
        setTimeout(() => {
            let item =   lodash.sample(items)
            embed.setDescription(`${item}`)
            interaction.editReply({embeds: [embed]})

        }, 2000);
        setTimeout(() => {
            let item =   lodash.sample(items)
            embed.setDescription(`${item}`)
            interaction.editReply({embeds: [embed]})
            setTimeout(() => {

              
                 if(item == "⚙️"){
                    let reward = lodash.sample(parts)
                    userdata.parts.push(reward.toLowerCase())

                    embed.setDescription(`You won a ${partsdb.Parts[reward].Name}!`)
                    interaction.editReply({embeds: [embed]})
                }
                else if(item == "🏎️"){
                    let randomnum = lodash.random(20)
                    let reward
                    console.log(randomnum)
                    if(randomnum == 2){
                     reward = lodash.sample(wheelspinrewards.SuperRare)
                    }
                    else {
                        reward = lodash.sample(cars)

                    }
                    let carindb = carsdb.Cars[reward.toLowerCase()]
                    let carobj = {
                        ID: carindb.alias,
                        Name: carindb.Name,
                        Speed: carindb.Speed,
                        Acceleration: carindb["0-60"],
                        Handling: carindb.Handling,
                        Parts: [],
                        Emote: carindb.Emote,
                        Livery: carindb.Image,
                        Miles: 0,
                        Price: 0
                    }

                    embed.setDescription(`You won a ${carsdb.Cars[reward].Emote} ${carsdb.Cars[reward].Name}!`)
                    embed.setImage(carsdb.Cars[reward].Image)
                    interaction.editReply({embeds: [embed]})
                    let filtered = usercars.filter(car => car.Name == carsdb.Cars[reward].Name)

                    if(filtered[0]) {
                        let sellprice = carsdb.Cars[reward.toLowerCase()].sellprice
                    userdata.cash += Number(sellprice)
                    interaction.channel.send(`You already own this car, so you got $${numberWithCommas(sellprice)} instead.`)
                  
                } 
                if(usercars.length >= garagespaces){
                    interaction.channel.send("You garage is full!")
                    return
                }
                else {
                    let sellprice = carsdb.Cars[reward].Price * 0.75

                    
                    userdata.cars.push(carobj)

                }
                }
                else if(item == "💵"){
                    let randomnum = lodash.random(10)
                    let reward
                    console.log(randomnum)
                    if(randomnum == 2){
                     reward = lodash.sample(wheelspinrewards.RareCash)
                    }
                    else {
                        reward = lodash.sample(cash)

                    }
                    userdata.cash += Number(reward)
                    embed.setDescription(`You won $${numberWithCommas(reward)} cash!`)
                    interaction.editReply({embeds: [embed]})
                }
                else if(item == "❓"){
                    embed.setDescription(`You won nothing lol`)
                    interaction.editReply({embeds: [embed]})
                }
                userdata.save()
            }, 500);
        }, 3000);


        function numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
  }

