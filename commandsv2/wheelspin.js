const Discord = require("discord.js")
const carsdb = require('../cardb.json')
const db = require('quick.db')
const ms = require('ms')
const {SlashCommandBuilder} = require('@discordjs/builders')
const lodash = require("lodash")
const wheelspinrewards = require('../wheelspinrewards.json')
const partsdb = require('../partsdb.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('wheelspin')
    .setDescription("Spin the wheel for prizes!"),
    async execute(interaction) {

        let uid = interaction.user.id
        let wheelspincool = db.fetch(`wheelspincool_${uid}`)
        let timeout = 5000;
        
        if (wheelspincool !== null && timeout - (Date.now() - wheelspincool) > 0) return interaction.reply("Please wait 5 seconds before using this command again.")
         let wheelspins = db.fetch(`wheelspins_${uid}`)
         if(wheelspins <= 0) return interaction.reply("You're out of wheel spins!")
        let items = ['🏎️', '💵', '⚙️', '🗺️']
      let item =   lodash.sample(items)
      let cash = wheelspinrewards.Cash
      let maps = wheelspinrewards.Maps

      let cars = wheelspinrewards.Cars
      let helmets = wheelspinrewards.Helmets
      let parts = wheelspinrewards.Parts
     let garagespaces =  db.fetch(`garagelimit_${interaction.user.id}`) || 10

      let usercars = db.fetch(`cars_${uid}`)
    db.subtract(`wheelspins_${uid}`, 1)
    db.set(`wheelspincool_${uid}`, Date.now())
        let embed = new Discord.MessageEmbed()
        .setTitle("Wheel Spin!")
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
                    db.push(`parts_${interaction.user.id}`, reward)

                    embed.setDescription(`You won a ${partsdb.Parts[reward].Emote} ${partsdb.Parts[reward].Name}!`)
                    interaction.editReply({embeds: [embed]})
                }
                else if(item == "🏎️"){
                    let randomnum = lodash.random(5)
                    let reward
                    console.log(randomnum)
                    if(randomnum == 2){
                        reward = lodash.sample(wheelspinrewards.SuperRare)
                       }
                       else {
                           reward = lodash.sample(cars)
   
                       }
                    embed.setDescription(`You won a ${carsdb.Cars[reward].Emote} ${carsdb.Cars[reward].Name}!`)
                    embed.setImage(carsdb.Cars[reward].Image)
                    embed.addField(`ID`, `${carsdb.Cars[reward.toLowerCase()].alias}`)
                    interaction.editReply({embeds: [embed]})
                    if(usercars.includes(reward)) {
                    let sellprice = carsdb.Cars[reward].sellprice
                    db.add(`cash_${uid}`, sellprice)
                    interaction.channel.send(`You already own this car, so you got $${numberWithCommas(sellprice)} instead.`)
                    return;
                } 
                if(usercars.length >= garagespaces){
                    interaction.channel.send("You garage is full!")
                    return
                }
                else {
                    let sellprice = carsdb.Cars[reward].Price * 0.75

                    db.push(`cars_${uid}`, carsdb.Cars[reward].Name.toLowerCase())
                    db.set(`${carsdb.Cars[reward].Name}speed_${interaction.user.id}`, parseInt(carsdb.Cars[reward].Speed))
                    db.set(`isselected_${carsdb.Cars[reward.toLowerCase()].Name}_${interaction.user.id}`, carsdb.Cars[reward.toLowerCase()].alias)
                    db.set(`selected_${carsdb.Cars[reward.toLowerCase()].alias}_${interaction.user.id}`, carsdb.Cars[reward.toLowerCase()].Name)

                    db.set(`${carsdb.Cars[reward].Name}resale_${interaction.user.id}`, sellprice)
                    db.set(`${carsdb.Cars[reward].Name}060_${interaction.user.id}`, `${carsdb.Cars[reward]["0-60"]}`)
                    db.set(`${carsdb.Cars[reward].Name}drift_${interaction.user.id}`, parseInt(carsdb.Cars[reward].Drift))
                    if(carsdb.Cars[reward.toLowerCase()].Range){
                        db.set(`${carsdb.Cars[reward].Name}range_${interaction.user.id}`, parseInt(carsdb.Cars[reward].Range))
                        db.set(`${carsdb.Cars[reward].Name}maxrange_${interaction.user.id}`, parseInt(carsdb.Cars[reward].Range))
    
                    }
                }
                }
                else if(item == "💵"){
                    let reward = lodash.sample(cash)
                    db.add(`cash_${uid}`, reward)
                    embed.setDescription(`You won $${numberWithCommas(reward)} cash!`)
                    interaction.editReply({embeds: [embed]})
                }
                else if(item == "🗺️"){
                    let reward = lodash.sample(maps)
                    switch(reward){
                        case "Common":
                            db.add(`barnmaps_${interaction.user.id}`, 1)
                        break;
                        case "Uncommon":
                            db.add(`ubarnmaps_${interaction.user.id}`, 1)
                        break;
                    }
                    embed.setDescription(`You won a ${numberWithCommas(reward)} barn map!`)
                    interaction.editReply({embeds: [embed]})
                }
             
            }, 500);
        }, 3000);


        function numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
  }

