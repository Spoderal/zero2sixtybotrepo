const db = require('quick.db')
const Discord = require('discord.js')
const cardb = require('../cardb.json')
const {SlashCommandBuilder} = require('@discordjs/builders')
const partdb = require('../partsdb.json')
const itemdb = require('../items.json')
const item = require('../item')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('trade')
    .setDescription("Trade your cars with other users")
    .addUserOption(option => option
        .setName('target')
        .setDescription('The user you want to trade with')
        .setRequired(true)
        
    )
    .addStringOption((option) =>option
    .setName("item")
    .setDescription("The item you want to trade")
    .setRequired(true))
    .addStringOption((option) =>option
    .setName("item2")
    .setDescription("The item you want to receive")
    .setRequired(true))
    .addNumberOption((option) => option
    .setName("amount1")
    .setDescription("The item amount you want to trade")
   .setRequired(false))
   .addNumberOption((option) => option
   .setName("amount2")
   .setDescription("The item amount you want to receive")
  .setRequired(false))
   ,
    async execute(interaction) {
        
        let user1 = interaction.user
        let user2 = interaction.options.getUser("target");
        
        let trading = interaction.options.getString("item").toLowerCase()

        let trading2 = interaction.options.getString("item2").toLowerCase()
        let amount2 = interaction.options.getNumber("amount2")
        let amount1 = interaction.options.getNumber("amount1")

        let racerank = db.fetch(`racerank_${user1.id}`)
        let racerank2 = db.fetch(`racerank_${user2.id}`)

        let pre2 = db.fetch(`prestige_${user2.id}`)
        let pre = db.fetch(`prestige_${user1.id}`)

        if(pre < 2){
            return interaction.reply(`${user1}, you need to be prestige 2 before you can trade`)
        }
        if(pre2 < 2){
            return interaction.reply(`${user2}, you need to be prestige 2 before you can trade`)
        }


        let actamount
        if(amount2 > 1){
            actamount = amount2
        } else {
            actamount = 1
        }
        let actamount1
        if(amount1 > 1){
            actamount1 = amount1
        } else {
            actamount1 = 1
        }

        console.log(trading)

        if(user1 == user2) return interaction.reply(`You cant trade yourself!`)

        if(trading.endsWith("cash") && trading2.endsWith("cash")) return interaction.reply("❌ You cant trade cash for cash!")
        if(trading.endsWith("cash") && partdb.Parts[trading2.toLowerCase()]) {
            let user2parts = db.fetch(`parts_${user2.id}`)
            let amount2 = interaction.options.getNumber("amount2")
            let actamount
            if(amount2 > 1){
                actamount = amount2
            } else {
                actamount = 1
            }

            console.log(actamount)

            if(!user2parts.includes(trading2.toLowerCase())) return interaction.reply(`This user doesn't have this part!`)
            let filtereduser = user2parts.filter(function hasmany(part) {
                return part === trading2.toLowerCase()
              })
              console.log(filtereduser)
            if(actamount > filtereduser.length) return interaction.reply(`${user2} doesn't have that many of that part!`)

            let amount = trading.split(' ')[0]
            let bal = db.fetch(`cash_${user1.id}`)
            if(bal < amount) return interaction.reply("Settle down you don't have enough cash!")
            if(amount < 1500) return interaction.reply(`Minimum of $1.5k cash needed.`)

            let embed = new Discord.MessageEmbed()
            .setTitle('Trading')
            .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
            .addField(`Your Offer`, `$${numberWithCommas(amount)}`)
            .addField(`${user2.username}'s Item`, `${partdb.Parts[trading2.toLowerCase()].Name} x${actamount}`)
            .setColor("#60b0f4")

            let msg = await interaction.reply({embeds: [embed], fetchReply: true})
            msg.react('✅')
            msg.react('❌')

            const filter = (_, u) => u.id === user2.id
            const collector = msg.createReactionCollector({ filter, time: 60000 })

            collector.on('collect', (r, user) => {
                if(r.emoji.name == '✅'){
                    for (var i = 0; i < actamount; i ++) {
                        user2parts.splice(user2parts.indexOf(trading2.toLowerCase()), 1)

                    }
                    
                    db.set(`parts_${user2.id}`, user2parts)
                    
                    
                    let user1newpart = []
                    for (var i = 0; i < actamount; i ++) user1newpart.push(trading2.toLowerCase())
                    for(i in user1newpart){
                        
                        db.push(`parts_${user1.id}`, user1newpart[i])
                    }
                    console.log(amount)

                    db.subtract(`cash_${user1.id}`, amount)
                    db.add(`cash_${user2.id}`, amount)

                    embed.setTitle("Trade Accepted!")

                    collector.stop()

                    interaction.editReply({embeds: [embed]})
                }
                else if(r.emoji.name == '❌'){
                    embed.setTitle("Trade Declined!")
                    collector.stop()

                    interaction.editReply({embeds: [embed]})
                }

            })
            collector.on('end', async collected => {
                if(collected.size === 0){
                    embed.setTitle("Trade Expired")
    
                    interaction.editReply({embeds: [embed]})
                }
                
              })


        }
        else if(trading.endsWith("cash") && itemdb.Collectable[0][trading2.toLowerCase()] || trading.endsWith("cash") && itemdb.Police[trading2.toLowerCase()] || trading.endsWith("cash") && itemdb.Other[trading2.toLowerCase()]) {

            let user2parts = db.fetch(`items_${user2.id}`) || []

            let amount2 = interaction.options.getNumber("amount2")
            let actamount
            if(amount2 > 1){
                actamount = amount2
            } else {
                actamount = 1
            }

            console.log(actamount)

            if(!user2parts.includes(trading2.toLowerCase())) return interaction.reply(`This user doesn't have this item!`)
            let filtereduser = user2parts.filter(function hasmany(part) {
                return part === trading2.toLowerCase()
              })
              console.log(filtereduser)
            if(actamount > filtereduser.length) return interaction.reply(`${user2} doesn't have that many of that item!`)
            let amount = trading.split(' ')[0]
            let bal = db.fetch(`cash_${user1.id}`)
            if(bal < amount) return interaction.reply("Settle down you don't have enough cash!")
            if(amount < 1500) return interaction.reply(`Minimum of $1.5k cash needed.`)
            let itemtype

                
            if(itemdb.Collectable[0][trading2.toLowerCase()]){
                itemtype = "Collectable"

            }

            else if(itemdb.Police[trading2.toLowerCase()] ){
                itemtype = "Police"

            }
            else if(itemdb.Other[trading2.toLowerCase()] ){
              itemtype = "Other"

          }
            let embed = new Discord.MessageEmbed()
            .setTitle('Trading')
            .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
            .addField(`Your Offer`, `$${numberWithCommas(amount)}`)
            if(itemtype == "Collectable"){
                embed.addField(`${user2.username}'s Offer`, `${itemdb[itemtype][0][trading2.toLowerCase()].Emote} ${itemdb[itemtype][0][trading2.toLowerCase()].Name} x${actamount}`)

            }
            else {
                embed.addField(`${user2.username}'s Offer`, `${itemdb[itemtype][trading2.toLowerCase()].Emote} ${itemdb[itemtype][trading2.toLowerCase()].Name} x${actamount}`)

            }
            embed.setColor("#60b0f4")

            let msg = await interaction.reply({embeds: [embed], fetchReply: true})
            msg.react('✅')
            msg.react('❌')

            const filter = (_, u) => u.id === user2.id
            const collector = msg.createReactionCollector({ filter, time: 60000 })

            collector.on('collect', (r, user) => {
                if(r.emoji.name == '✅'){
                    collector.stop()
                    amount = trading.split(' ')[0]
                    console.log(amount)
                    for (var i = 0; i < actamount; i ++) user2parts.splice(user2parts.indexOf(trading2.toLowerCase()), 1)
                    db.set(`items_${user2.id}`, user2parts)


                    let user1newpart = []
                    for (var i = 0; i < actamount; i ++) user1newpart.push(trading2.toLowerCase())
                    for(i in user1newpart){
                        
                        db.push(`items_${user1.id}`, user1newpart[i])
                    }
                    console.log(amount)
                    db.subtract(`cash_${user1.id}`, amount)
                    db.add(`cash_${user2.id}`, amount)

                    embed.setTitle("Trade Accepted!")

                    interaction.editReply({embeds: [embed]})
                }
                else if(r.emoji.name == '❌'){
                    embed.setTitle("Trade Declined!")
                    collector.stop()

                    interaction.editReply({embeds: [embed]})
                }

            })
            collector.on('end', async collected => {
                if(collected.size === 0){
                    embed.setTitle("Trade Expired")
    
                    interaction.editReply({embeds: [embed]})
                }
                
              })

        }
        else if(cardb.Cars[trading.toLowerCase()] && partdb.Parts[trading2.toLowerCase()]) {
            let user1cars = db.fetch(`cars_${user1.id}`)
            let user2parts = db.fetch(`parts_${user2.id}`)
            let amount2 = interaction.options.getNumber("amount2")
            let actamount
            if(amount2 > 1){
                actamount = amount2
            } else {
                actamount = 1
            }

            let filtereduser = user2parts.filter(function hasmany(part) {
                return part === trading2.toLowerCase()
              })
            if(actamount > filtereduser.length) return interaction.reply(`${user2} doesn't have ${actamount} ${trading2}!`)


            if(!user1cars.includes(trading.toLowerCase())) return interaction.channel.send(`You don't have this car!`)
            
            let selected = db.fetch(`isselected_${cardb.Cars[trading.toLowerCase()].Name}_${user1.id}`)
            if(selected) return interaction.channel.send(`${user1}, you need to deselect this car before trading it!`)
            let embed = new Discord.MessageEmbed()
            .setTitle('Trading')
            .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
            .addField(`Your Offer`, `${cardb.Cars[trading.toLowerCase()].Name}`)
            .addField(`${user2.username}'s Offer`, `${partdb.Parts[trading2.toLowerCase()].Name} x${actamount}`)
            .setColor("#60b0f4")

            let msg = await interaction.reply({embeds: [embed], fetchReply: true})
            msg.react('✅')
            msg.react('❌')

            const filter = (_, u) => u.id === user2.id
            const collector = msg.createReactionCollector({ filter, time: 60000 })

            collector.on('collect', (r, user) => {
                if(r.emoji.name == '✅'){

                    trading = trading.toLowerCase()
                    let handling = db.fetch(`${cardb.Cars[trading.toLowerCase()].Name}handling_${user1.id}`) || 0
                    let exhaust = db.fetch(`${cardb.Cars[trading].Name}exhaust_${user1.id}`)
                    let gearbox = db.fetch(`${cardb.Cars[trading].Name}gearbox_${user1.id}`)
                    let tires = db.fetch(`${cardb.Cars[trading].Name}tires_${user1.id}`)
                    let turbo = db.fetch(`${cardb.Cars[trading].Name}turbo_${user1.id}`) 
                    let intake = db.fetch(`${cardb.Cars[trading].Name}intake_${user1.id}`)
                    let clutch = db.fetch(`${cardb.Cars[trading].Name}clutch_${user1.id}`)
                    let ecu = db.fetch(`${cardb.Cars[trading].Name}ecu_${user1.id}`)
                    let suspension = db.fetch(`${cardb.Cars[trading].Name}suspension_${user1.id}`)
                   
                    let weight = db.fetch(`${cardb.Cars[trading].Name}weight_${user1.id}`)
                    let offroad = db.fetch(`${cardb.Cars[trading].Name}offroad_${user1.id}`)
                    let drift = db.fetch(`${cardb.Cars[trading].Name}drift_${user1.id}`)
                    let speed = db.fetch(`${cardb.Cars[trading].Name}speed_${user1.id}`)
                    let zerosixty = db.fetch(`${cardb.Cars[trading].Name}060_${user1.id}`)
        
                    let nitro = db.fetch(`${cardb.Cars[trading].Name}nitro_${user1.id}`)
                    let restoration  = db.fetch(`${cardb.Cars[trading].Name}restoration_${user1.id}`)
                    let resale  = db.fetch(`${cardb.Cars[trading].Name}resale_${user1.id}`)

                    let engine = db.fetch(`${cardb.Cars[trading].Name}engine_${user1.id}`)
                    
                    let carimage = db.fetch(`${cardb.Cars[trading].Name}livery_${user1.id}`) || cardb.Cars[trading].Image
                    
                    let newcars = db.fetch(`cars_${user1.id}`)
                    if(!newcars.includes(trading)) return interaction.channel.send(`${user2} doesn't have that car!`)
                    if(exhaust){
                        db.set(`${cardb.Cars[trading].Name}exhaust_${user2.id}`, exhaust)
                        db.delete(`${cardb.Cars[trading].Name}exhaust_${user1.id}`)
                    
                    }
                    if(gearbox){
                        db.set(`${cardb.Cars[trading].Name}gearbox_${user2.id}`, gearbox)
                        db.delete(`${cardb.Cars[trading].Name}gearbox_${user1.id}`)
                    }
                    if(tires){
                        db.set(`${cardb.Cars[trading].Name}tires_${user2.id}`, tires)
                        db.delete(`${cardb.Cars[trading].Name}tires_${user1.id}`)
                    }
                    if(turbo){
                        db.set(`${cardb.Cars[trading].Name}turbo_${user2.id}`, turbo)
                        db.delete(`${cardb.Cars[trading].Name}turbo_${user1.id}`)
                    }
                    if(intake){
                        db.set(`${cardb.Cars[trading].Name}intake_${user2.id}`, intake)
                        db.delete(`${cardb.Cars[trading].Name}intake_${user1.id}`)
                    }
                    if(clutch){
                        db.set(`${cardb.Cars[trading].Name}clutch_${user2.id}`, clutch)
                        db.delete(`${cardb.Cars[trading].Name}clutch_${user1.id}`)
                    }
                    if(ecu){
                        db.set(`${cardb.Cars[trading].Name}ecu_${user2.id}`, ecu)
                        db.delete(`${cardb.Cars[trading].Name}ecu_${user1.id}`)
                    }
                    if(suspension){
                        db.set(`${cardb.Cars[trading].Name}suspension_${user2.id}`, suspension)
                        db.delete(`${cardb.Cars[trading].Name}suspension_${user1.id}`)
                    }
                    if(weight){
                        db.set(`${cardb.Cars[trading].Name}weight_${user2.id}`, weight)
                        db.delete(`${cardb.Cars[trading].Name}weight_${user1.id}`)
                    }
                    if(offroad){
                        db.set(`${cardb.Cars[trading].Name}offroad_${user2.id}`, offroad)
                        db.delete(`${cardb.Cars[trading].Name}offroad_${user1.id}`)
                    }
                    if(drift){
                        db.set(`${cardb.Cars[trading].Name}drift_${user2.id}`, drift)
                        db.delete(`${cardb.Cars[trading].Name}drift_${user1.id}`)
                    }
                    if(nitro){
                        db.set(`${cardb.Cars[trading].Name}nitro_${user2.id}`, nitro)
                        db.delete(`${cardb.Cars[trading].Name}nitro_${user1.id}`)
                    }
                    if(engine){
                        db.set(`${cardb.Cars[trading].Name}engine_${user2.id}`, engine)
                        db.delete(`${cardb.Cars[trading].Name}engine_${user1.id}`)
                    }
                    if(db.fetch(`${cardb.Cars[trading].Name}livery_${user1.id}`)){
                        db.set(`${cardb.Cars[trading].Name}livery_${user2.id}`, carimage) 
                        db.delete(`${cardb.Cars[trading].Name}livery_${user1.id}`)
                    }
                    if(db.fetch(`${cardb.Cars[trading].Name}restoration_${user1.id}`)){
                        db.set(`${cardb.Cars[trading].Name}restoration_${user2.id}`, restoration) 
                        db.delete(`${cardb.Cars[trading].Name}restoration_${user1.id}`)
                    }
                    if(db.fetch(`${cardb.Cars[trading].Name}resale_${user1.id}`)){
                        db.set(`${cardb.Cars[trading].Name}resale_${user2.id}`, resale) 
                        db.delete(`${cardb.Cars[trading].Name}resale_${user1.id}`)
                    }
        
                    db.set(`${cardb.Cars[trading.toLowerCase()].Name}speed_${user2.id}`, speed)
                    db.set(`${cardb.Cars[trading].Name}060_${user2.id}`, zerosixty)
                    db.set(`${cardb.Cars[trading].Name}handling_${user2.id}`, handling)
                    db.delete(`${cardb.Cars[trading].Name}speed_${user1.id}`)
                    db.delete(`${cardb.Cars[trading].Name}060_${user1.id}`)
                    db.delete(`${cardb.Cars[trading].Name}handling_${user1.id}`)
                    for (var i = 0; i < 1; i ++) newcars.splice(newcars.indexOf(trading.toLowerCase()), 1)
                    db.set(`cars_${user1.id}`, newcars)
                    db.push(`cars_${user2.id}`, trading.toLowerCase())
                    for (var i = 0; i < actamount; i ++) user2parts.splice(user2parts.indexOf(trading2.toLowerCase()), 1)
                    db.set(`parts_${user2.id}`, user2parts)
                    let user1newpart = []
                    for (var i = 0; i < actamount; i ++) user1newpart.push(trading2.toLowerCase())
                    for(i in user1newpart){
                        
                        db.push(`parts_${user1.id}`, user1newpart[i])
                    }
                    embed.setTitle("Trade Accepted!")
                    collector.stop()

                    interaction.editReply({embeds: [embed]})
                }
                else if(r.emoji.name == '❌'){
                    embed.setTitle("Trade Declined!")
                    collector.stop()

                    interaction.editReply({embeds: [embed]})
                }

            })
            collector.on('end', async collected => {
                if(collected.size === 0){
                    embed.setTitle("Trade Expired")
    
                    interaction.editReply({embeds: [embed]})
                }
                
              })
        

        }

        // car for item

        else if(cardb.Cars[trading.toLowerCase()] && itemdb.Collectable[0][trading2.toLowerCase()] || cardb.Cars[trading.toLowerCase()] && itemdb.Other[trading2.toLowerCase()] || cardb.Cars[trading.toLowerCase()] && itemdb.Police[trading2.toLowerCase()]) {
            let user1cars = db.fetch(`cars_${user1.id}`)
            let user2items = db.fetch(`items_${user2.id}`)
         let amount2 = interaction.options.getNumber("amount2")
            let actamount
            if(amount2 > 1){
                actamount = amount2
            } else {
                actamount = 1
            }
            let filtereduser = user2items.filter(function hasmany(part) {
                return part === trading2.toLowerCase()
              })

            if(actamount > filtereduser.length) return interaction.reply(`${user2} doesn't have ${amount2} ${trading2}!`)
            if(!user1cars.includes(trading.toLowerCase())) return interaction.channel.send(`You don't have this car!`)
            let itemtype

                
            if(itemdb.Collectable[0][trading2.toLowerCase()]){
                itemtype = "Collectable"

            }

            else if(itemdb.Police[trading2.toLowerCase()] ){
                itemtype = "Police"

            }
            else if(itemdb.Other[trading2.toLowerCase()] ){
              itemtype = "Other"

          }
            let selected = db.fetch(`isselected_${cardb.Cars[trading.toLowerCase()].Name}_${user1.id}`)
            if(selected) return interaction.channel.send(`${user1}, you need to deselect this car before trading it!`)
            let embed = new Discord.MessageEmbed()
            .setTitle('Trading')
            .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
            .addField(`Your Offer`, `${cardb.Cars[trading.toLowerCase()].Name}`)
            if(itemtype == "Collectable"){
                embed.addField(`${user2.username}'s Offer`, `${itemdb[itemtype][0][trading2.toLowerCase()].Emote} ${itemdb[itemtype][0][trading2.toLowerCase()].Name} x${actamount}`)

            }
            else {
                embed.addField(`${user2.username}'s Offer`, `${itemdb[itemtype][trading2.toLowerCase()].Emote} ${itemdb[itemtype][trading2.toLowerCase()].Name} x${actamount}`)

            }
            embed.setColor("#60b0f4")

            let msg = await interaction.reply({embeds: [embed], fetchReply: true})
            msg.react('✅')
            msg.react('❌')

            const filter = (_, u) => u.id === user2.id
            const collector = msg.createReactionCollector({ filter, time: 60000 })

            collector.on('collect', (r, user) => {
                if(r.emoji.name == '✅'){

                    trading = trading.toLowerCase()
                    let handling = db.fetch(`${cardb.Cars[trading.toLowerCase()].Name}handling_${user1.id}`) || 0
                    let exhaust = db.fetch(`${cardb.Cars[trading].Name}exhaust_${user1.id}`)
                    let gearbox = db.fetch(`${cardb.Cars[trading].Name}gearbox_${user1.id}`)
                    let tires = db.fetch(`${cardb.Cars[trading].Name}tires_${user1.id}`)
                    let turbo = db.fetch(`${cardb.Cars[trading].Name}turbo_${user1.id}`) 
                    let intake = db.fetch(`${cardb.Cars[trading].Name}intake_${user1.id}`)
                    let clutch = db.fetch(`${cardb.Cars[trading].Name}clutch_${user1.id}`)
                    let ecu = db.fetch(`${cardb.Cars[trading].Name}ecu_${user1.id}`)
                    let suspension = db.fetch(`${cardb.Cars[trading].Name}suspension_${user1.id}`)
                   
                    let weight = db.fetch(`${cardb.Cars[trading].Name}weight_${user1.id}`)
                    let offroad = db.fetch(`${cardb.Cars[trading].Name}offroad_${user1.id}`)
                    let drift = db.fetch(`${cardb.Cars[trading].Name}drift_${user1.id}`)
                    let speed = db.fetch(`${cardb.Cars[trading].Name}speed_${user1.id}`)
                    let zerosixty = db.fetch(`${cardb.Cars[trading].Name}060_${user1.id}`)
        
                    let nitro = db.fetch(`${cardb.Cars[trading].Name}nitro_${user1.id}`)
                    let restoration  = db.fetch(`${cardb.Cars[trading].Name}restoration_${user1.id}`)
        
                    let engine = db.fetch(`${cardb.Cars[trading].Name}engine_${user1.id}`)
                    
                    let carimage = db.fetch(`${cardb.Cars[trading].Name}livery_${user1.id}`) || cardb.Cars[trading].Image
                    
                    let newcars = db.fetch(`cars_${user1.id}`)
                    if(!newcars.includes(trading)) return interaction.channel.send(`${user2} doesn't have that car!`)
                    if(exhaust){
                        db.set(`${cardb.Cars[trading].Name}exhaust_${user2.id}`, exhaust)
                        db.delete(`${cardb.Cars[trading].Name}exhaust_${user1.id}`)
                    
                    }
                    if(gearbox){
                        db.set(`${cardb.Cars[trading].Name}gearbox_${user2.id}`, gearbox)
                        db.delete(`${cardb.Cars[trading].Name}gearbox_${user1.id}`)
                    }
                    if(tires){
                        db.set(`${cardb.Cars[trading].Name}tires_${user2.id}`, tires)
                        db.delete(`${cardb.Cars[trading].Name}tires_${user1.id}`)
                    }
                    if(turbo){
                        db.set(`${cardb.Cars[trading].Name}turbo_${user2.id}`, turbo)
                        db.delete(`${cardb.Cars[trading].Name}turbo_${user1.id}`)
                    }
                    if(intake){
                        db.set(`${cardb.Cars[trading].Name}intake_${user2.id}`, intake)
                        db.delete(`${cardb.Cars[trading].Name}intake_${user1.id}`)
                    }
                    if(clutch){
                        db.set(`${cardb.Cars[trading].Name}clutch_${user2.id}`, clutch)
                        db.delete(`${cardb.Cars[trading].Name}clutch_${user1.id}`)
                    }
                    if(ecu){
                        db.set(`${cardb.Cars[trading].Name}ecu_${user2.id}`, ecu)
                        db.delete(`${cardb.Cars[trading].Name}ecu_${user1.id}`)
                    }
                    if(suspension){
                        db.set(`${cardb.Cars[trading].Name}suspension_${user2.id}`, suspension)
                        db.delete(`${cardb.Cars[trading].Name}suspension_${user1.id}`)
                    }
                    if(weight){
                        db.set(`${cardb.Cars[trading].Name}weight_${user2.id}`, weight)
                        db.delete(`${cardb.Cars[trading].Name}weight_${user1.id}`)
                    }
                    if(offroad){
                        db.set(`${cardb.Cars[trading].Name}offroad_${user2.id}`, offroad)
                        db.delete(`${cardb.Cars[trading].Name}offroad_${user1.id}`)
                    }
                    if(drift){
                        db.set(`${cardb.Cars[trading].Name}drift_${user2.id}`, drift)
                        db.delete(`${cardb.Cars[trading].Name}drift_${user1.id}`)
                    }
                    if(nitro){
                        db.set(`${cardb.Cars[trading].Name}nitro_${user2.id}`, nitro)
                        db.delete(`${cardb.Cars[trading].Name}nitro_${user1.id}`)
                    }
                    if(engine){
                        db.set(`${cardb.Cars[trading].Name}engine_${user2.id}`, engine)
                        db.delete(`${cardb.Cars[trading].Name}engine_${user1.id}`)
                    }
                    if(db.fetch(`${cardb.Cars[trading].Name}livery_${user1.id}`)){
                        db.set(`${cardb.Cars[trading].Name}livery_${user2.id}`, carimage) 
                        db.delete(`${cardb.Cars[trading].Name}livery_${user1.id}`)
                    }
                    if(db.fetch(`${cardb.Cars[trading].Name}restoration_${user1.id}`)){
                        db.set(`${cardb.Cars[trading].Name}restoration_${user2.id}`, restoration) 
                        db.delete(`${cardb.Cars[trading].Name}restoration_${user1.id}`)
                    }
        
                    db.set(`${cardb.Cars[trading.toLowerCase()].Name}speed_${user2.id}`, speed)
                    db.set(`${cardb.Cars[trading].Name}060_${user2.id}`, zerosixty)
                    db.set(`${cardb.Cars[trading].Name}handling_${user2.id}`, handling)
                    db.delete(`${cardb.Cars[trading].Name}speed_${user1.id}`)
                    db.delete(`${cardb.Cars[trading].Name}060_${user1.id}`)
                    db.delete(`${cardb.Cars[trading].Name}handling_${user1.id}`)
                    for (var i = 0; i < 1; i ++) newcars.splice(newcars.indexOf(trading.toLowerCase()), 1)
                    db.set(`cars_${user1.id}`, newcars)
                    db.push(`cars_${user2.id}`, trading.toLowerCase())
                    for (var i = 0; i < actamount; i ++) user2items.splice(user2items.indexOf(trading2.toLowerCase()), 1)
                    db.set(`items_${user2.id}`, user2items)
                    let user1newpart = []
                    for (var i = 0; i < actamount; i ++) user1newpart.push(trading2.toLowerCase())
                    for(i in user1newpart){
                        
                        db.push(`items_${user1.id}`, user1newpart[i])
                    }
                    embed.setTitle("Trade Accepted!")
                    collector.stop()

                    interaction.editReply({embeds: [embed]})
                }
                else if(r.emoji.name == '❌'){
                    embed.setTitle("Trade Declined!")
                    collector.stop()

                    interaction.editReply({embeds: [embed]})
                }

            })
            collector.on('end', async collected => {
                if(collected.size === 0){
                    embed.setTitle("Trade Expired")
    
                    interaction.editReply({embeds: [embed]})
                }
                
              })
        

        }
       else if(trading.endsWith("cash") && cardb.Cars[trading2.toLowerCase()]) {
            let user2cars = db.fetch(`cars_${user2.id}`)
            let user1cars = db.fetch(`cars_${user1.id}`)

            if(!user2cars.includes(trading2)) return interaction.reply(`${user2} doesn't have that car!`)
            if(user1cars.includes(trading2)) return interaction.reply(`${user1}, you already have that car!`)

            let selected = db.fetch(`isselected_${cardb.Cars[trading2.toLowerCase()].Name}_${user2.id}`)

            if(selected) return interaction.reply(`${user2}, you need to deselect this car before trading it!`)

            let handling = db.fetch(`${cardb.Cars[trading2.toLowerCase()].Name}handling_${user2.id}`) || 0
            let exhaust = db.fetch(`${cardb.Cars[trading2].Name}exhaust_${user2.id}`)
            let gearbox = db.fetch(`${cardb.Cars[trading2].Name}gearbox_${user2.id}`)
            let tires = db.fetch(`${cardb.Cars[trading2].Name}tires_${user2.id}`)
            let turbo = db.fetch(`${cardb.Cars[trading2].Name}turbo_${user2.id}`) 
            let intake = db.fetch(`${cardb.Cars[trading2].Name}intake_${user2.id}`)
            let clutch = db.fetch(`${cardb.Cars[trading2].Name}clutch_${user2.id}`)
            let ecu = db.fetch(`${cardb.Cars[trading2].Name}ecu_${user2.id}`)
            let suspension = db.fetch(`${cardb.Cars[trading2].Name}suspension_${user2.id}`)
           
            let weight = db.fetch(`${cardb.Cars[trading2].Name}weight_${user2.id}`)
            let offroad = db.fetch(`${cardb.Cars[trading2].Name}offroad_${user2.id}`)
            let drift = db.fetch(`${cardb.Cars[trading2].Name}drift_${user2.id}`)
            let speed = db.fetch(`${cardb.Cars[trading2].Name}speed_${user2.id}`)
            let zerosixty = db.fetch(`${cardb.Cars[trading2].Name}060_${user2.id}`)

            let nitro = db.fetch(`${cardb.Cars[trading2].Name}nitro_${user2.id}`)
            let restoration  = db.fetch(`${cardb.Cars[trading2].Name}restoration_${user2.id}`)

            let engine = db.fetch(`${cardb.Cars[trading2].Name}engine_${user2.id}`)
            
            let carimage = db.fetch(`${cardb.Cars[trading2].Name}livery_${user2.id}`) || cardb.Cars[trading2].Image

            let amount = trading.split(' ')[0]
            let bal = db.fetch(`cash_${user1.id}`)
            if(bal < amount) return interaction.reply("Settle down you don't have enough cash!")
            if(amount < 1500) return interaction.reply(`Minimum of $1.5k cash needed.`)
            let embed = new Discord.MessageEmbed()
            .setTitle('Trading')
            .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
            .addField(`Your Offer`, `$${amount}`)
            .addField(`${user2.username}'s Item`, `${cardb.Cars[trading2].Name}`)
            .setColor("#60b0f4")

            let msg = await interaction.reply({embeds: [embed], fetchReply: true})
            msg.react('✅')
            msg.react('❌')

            const filter = (_, u) => u.id === user2.id
            const collector = msg.createReactionCollector({ filter, time: 60000 })

            collector.on('collect', (r, user) => {
                
                if(r.emoji.name == '✅'){
                let newcars = db.fetch(`cars_${user2.id}`)
                if(!newcars.includes(trading2)) return interaction.channel.send(`${user2} doesn't have that car!`)
                if(exhaust){
                    db.set(`${cardb.Cars[trading2].Name}exhaust_${user1.id}`, exhaust)
                    db.delete(`${cardb.Cars[trading2].Name}exhaust_${user2.id}`)
                
                }
                if(gearbox){
                    db.set(`${cardb.Cars[trading2].Name}gearbox_${user1.id}`, gearbox)
                    db.delete(`${cardb.Cars[trading2].Name}gearbox_${user2.id}`)
                }
                if(tires){
                    db.set(`${cardb.Cars[trading2].Name}tires_${user1.id}`, tires)
                    db.delete(`${cardb.Cars[trading2].Name}tires_${user2.id}`)
                }
                if(turbo){
                    db.set(`${cardb.Cars[trading2].Name}turbo_${user1.id}`, turbo)
                    db.delete(`${cardb.Cars[trading2].Name}turbo_${user2.id}`)
                }
                if(intake){
                    db.set(`${cardb.Cars[trading2].Name}intake_${user1.id}`, intake)
                    db.delete(`${cardb.Cars[trading2].Name}intake_${user2.id}`)
                }
                if(clutch){
                    db.set(`${cardb.Cars[trading2].Name}clutch_${user1.id}`, clutch)
                    db.delete(`${cardb.Cars[trading2].Name}clutch_${user2.id}`)
                }
                if(ecu){
                    db.set(`${cardb.Cars[trading2].Name}ecu_${user1.id}`, ecu)
                    db.delete(`${cardb.Cars[trading2].Name}ecu_${user2.id}`)
                }
                if(suspension){
                    db.set(`${cardb.Cars[trading2].Name}suspension_${user1.id}`, suspension)
                    db.delete(`${cardb.Cars[trading2].Name}suspension_${user2.id}`)
                }
                if(weight){
                    db.set(`${cardb.Cars[trading2].Name}weight_${user1.id}`, weight)
                    db.delete(`${cardb.Cars[trading2].Name}weight_${user2.id}`)
                }
                if(offroad){
                    db.set(`${cardb.Cars[trading2].Name}offroad_${user1.id}`, offroad)
                    db.delete(`${cardb.Cars[trading2].Name}offroad_${user2.id}`)
                }
                if(drift){
                    db.set(`${cardb.Cars[trading2].Name}drift_${user1.id}`, drift)
                    db.delete(`${cardb.Cars[trading2].Name}drift_${user2.id}`)
                }
                if(nitro){
                    db.set(`${cardb.Cars[trading2].Name}nitro_${user1.id}`, nitro)
                    db.delete(`${cardb.Cars[trading2].Name}nitro_${user2.id}`)
                }
                if(engine){
                    db.set(`${cardb.Cars[trading2].Name}engine_${user1.id}`, engine)
                    db.delete(`${cardb.Cars[trading2].Name}engine_${user2.id}`)
                }
                if(db.fetch(`${cardb.Cars[trading2].Name}livery_${user2.id}`)){
                    db.set(`${cardb.Cars[trading2].Name}livery_${user1.id}`, carimage) 
                    db.delete(`${cardb.Cars[trading2].Name}livery_${user2.id}`)
                }
                if(db.fetch(`${cardb.Cars[trading2].Name}restoration_${user2.id}`)){
                    db.set(`${cardb.Cars[trading2].Name}restoration_${user1.id}`, restoration) 
                    db.delete(`${cardb.Cars[trading2].Name}restoration_${user2.id}`)
                }
    
                db.set(`${cardb.Cars[trading2].Name}speed_${user1.id}`, speed)
                db.set(`${cardb.Cars[trading2].Name}060_${user1.id}`, zerosixty)
                db.set(`${cardb.Cars[trading2].Name}handling_${user1.id}`, handling)
                db.delete(`${cardb.Cars[trading2].Name}speed_${user2.id}`)
                db.delete(`${cardb.Cars[trading2].Name}060_${user2.id}`)
                db.delete(`${cardb.Cars[trading2].Name}handling_${user2.id}`)
                db.subtract(`cash_${user1.id}`, amount)
                db.add(`cash_${user2.id}`, amount)
                for (var i = 0; i < 1; i ++) newcars.splice(newcars.indexOf(trading2.toLowerCase()), 1)
                db.set(`cars_${user2.id}`, newcars)
                db.push(`cars_${user1.id}`, trading2.toLowerCase())
                embed.setTitle("Trade Accepted!")
                collector.stop()

                interaction.editReply({embeds: [embed]})

            } else if(r.emoji.name == '❌') {
                embed.setTitle("Trade Declined")
                collector.stop()

                interaction.editReply({embeds: [embed]})
            }
            })
            collector.on('end', async collected => {
                if(collected.size === 0){
                    embed.setTitle("Trade Expired")
    
                    interaction.editReply({embeds: [embed]})
                }
                
              })
  


        }
        else  if(trading2.endsWith("cash") && cardb.Cars[trading.toLowerCase()]) {
            let user1cars = db.fetch(`cars_${user1.id}`) || []
            let user2cars = db.fetch(`cars_${user2.id}`) || []

            if(!user1cars.includes(trading)) return interaction.reply(`${user1} doesn't have that car!`)
            if(user2cars.includes(trading)) return interaction.reply(`${user2} already has that car!`)
            let selected = db.fetch(`isselected_${cardb.Cars[trading.toLowerCase()].Name}_${user1.id}`)

            if(selected) return interaction.reply(`${user1}, you need to deselect this car before trading it!`)

            let handling = db.fetch(`${cardb.Cars[trading.toLowerCase()].Name}handling_${user1.id}`) || 0
            let exhaust = db.fetch(`${cardb.Cars[trading].Name}exhaust_${user1.id}`)
            let gearbox = db.fetch(`${cardb.Cars[trading].Name}gearbox_${user1.id}`)
            let tires = db.fetch(`${cardb.Cars[trading].Name}tires_${user1.id}`)
            let turbo = db.fetch(`${cardb.Cars[trading].Name}turbo_${user1.id}`) 
            let intake = db.fetch(`${cardb.Cars[trading].Name}intake_${user1.id}`)
            let clutch = db.fetch(`${cardb.Cars[trading].Name}clutch_${user1.id}`)
            let ecu = db.fetch(`${cardb.Cars[trading].Name}ecu_${user1.id}`)
            let suspension = db.fetch(`${cardb.Cars[trading].Name}suspension_${user1.id}`)
            let restoration  = db.fetch(`${cardb.Cars[trading].Name}restoration_${user1.id}`)

            let weight = db.fetch(`${cardb.Cars[trading].Name}weight_${user1.id}`)
            let offroad = db.fetch(`${cardb.Cars[trading].Name}offroad_${user1.id}`)
            let drift = db.fetch(`${cardb.Cars[trading].Name}drift_${user1.id}`)
            let speed = db.fetch(`${cardb.Cars[trading].Name}speed_${user1.id}`)
            let zerosixty = db.fetch(`${cardb.Cars[trading].Name}060_${user1.id}`)

            let nitro = db.fetch(`${cardb.Cars[trading].Name}nitro_${user1.id}`)
          
            let engine = db.fetch(`${cardb.Cars[trading].Name}engine_${user1.id}`)
            
            let carimage = db.fetch(`${cardb.Cars[trading].Name}livery_${user1.id}`) || cardb.Cars[trading].Image

            let amount = trading2.split(' ')[0]
            let bal = db.fetch(`cash_${user2.id}`)
            if(bal < amount) return interaction.reply("Settle down they don't have enough cash!")
            if(amount < 1500) return interaction.reply(`Minimum of $1.5k cash needed.`)

            let embed = new Discord.MessageEmbed()
            .setTitle('Trading')
            .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
            .addField(`Your Offer`, `${cardb.Cars[trading].Name}`)
            .addField(`${user2.username}'s Item`, `$${amount}`)
            .setColor("#60b0f4")

            let msg = await interaction.reply({embeds: [embed], fetchReply: true})
            msg.react('✅')
            msg.react('❌')

            const filter = (_, u) => u.id === user2.id
            const collector = msg.createReactionCollector({ filter, time: 60000 })

            collector.on('collect', (r, user) => {
                
                if(r.emoji.name == '✅'){
                let newcars = db.fetch(`cars_${user1.id}`)
                if(!newcars.includes(trading)) return interaction.channel.send(`${user2} doesn't have that car!`)
                if(exhaust){
                    db.set(`${cardb.Cars[trading].Name}exhaust_${user1.id}`, exhaust)
                    db.delete(`${cardb.Cars[trading].Name}exhaust_${user1.id}`)
                
                }
                if(gearbox){
                    db.set(`${cardb.Cars[trading].Name}gearbox_${user2.id}`, gearbox)
                    db.delete(`${cardb.Cars[trading].Name}gearbox_${user1.id}`)
                }
                if(tires){
                    db.set(`${cardb.Cars[trading].Name}tires_${user2.id}`, tires)
                    db.delete(`${cardb.Cars[trading].Name}tires_${user1.id}`)
                }
                if(turbo){
                    db.set(`${cardb.Cars[trading].Name}turbo_${user2.id}`, turbo)
                    db.delete(`${cardb.Cars[trading].Name}turbo_${user1.id}`)
                }
                if(intake){
                    db.set(`${cardb.Cars[trading].Name}intake_${user2.id}`, intake)
                    db.delete(`${cardb.Cars[trading].Name}intake_${user1.id}`)
                }
                if(clutch){
                    db.set(`${cardb.Cars[trading].Name}clutch_${user2.id}`, clutch)
                    db.delete(`${cardb.Cars[trading].Name}clutch_${user1.id}`)
                }
                if(ecu){
                    db.set(`${cardb.Cars[trading].Name}ecu_${user2.id}`, ecu)
                    db.delete(`${cardb.Cars[trading].Name}ecu_${user1.id}`)
                }
                if(suspension){
                    db.set(`${cardb.Cars[trading].Name}suspension_${user2.id}`, suspension)
                    db.delete(`${cardb.Cars[trading].Name}suspension_${user1.id}`)
                }
                if(weight){
                    db.set(`${cardb.Cars[trading].Name}weight_${user2.id}`, weight)
                    db.delete(`${cardb.Cars[trading].Name}weight_${user1.id}`)
                }
                if(offroad){
                    db.set(`${cardb.Cars[trading].Name}offroad_${user2.id}`, offroad)
                    db.delete(`${cardb.Cars[trading].Name}offroad_${user1.id}`)
                }
                if(drift){
                    db.set(`${cardb.Cars[trading].Name}drift_${user2.id}`, drift)
                    db.delete(`${cardb.Cars[trading].Name}drift_${user1.id}`)
                }
                if(nitro){
                    db.set(`${cardb.Cars[trading].Name}nitro_${user2.id}`, nitro)
                    db.delete(`${cardb.Cars[trading].Name}nitro_${user1.id}`)
                }
                if(engine){
                    db.set(`${cardb.Cars[trading].Name}engine_${user2.id}`, engine)
                    db.delete(`${cardb.Cars[trading].Name}engine_${user1.id}`)
                }
                if(db.fetch(`${cardb.Cars[trading].Name}livery_${user1.id}`)){
                    db.set(`${cardb.Cars[trading].Name}livery_${user2.id}`, carimage) 
                    db.delete(`${cardb.Cars[trading].Name}livery_${user1.id}`)
                }
                if(db.fetch(`${cardb.Cars[trading].Name}restoration_${user1.id}`)){
                    db.set(`${cardb.Cars[trading].Name}restoration_${user2.id}`, restoration) 
                    db.delete(`${cardb.Cars[trading].Name}restoration_${user1.id}`)
                }
    
                db.set(`${cardb.Cars[trading].Name}speed_${user2.id}`, speed)
                db.set(`${cardb.Cars[trading].Name}060_${user2.id}`, zerosixty)
                db.set(`${cardb.Cars[trading].Name}handling_${user2.id}`, handling)
                db.push(`cars_${user2.id}`, trading.toLowerCase())

                db.subtract(`cash_${user2.id}`, amount)
                db.add(`cash_${user1.id}`, amount)
                for (var i = 0; i < 1; i ++) newcars.splice(newcars.indexOf(trading.toLowerCase()), 1)
                db.set(`cars_${user1.id}`, newcars)
                embed.setTitle("Trade Accepted!")
                collector.stop()

                interaction.editReply({embeds: [embed]})

            } else if(r.emoji.name == '❌') {
                embed.setTitle("Trade Declined")
                collector.stop()

                interaction.editReply({embeds: [embed]})
            }
            })
            collector.on('end', async collected => {
                if(collected.size === 0){
                    embed.setTitle("Trade Expired")
    
                    interaction.editReply({embeds: [embed]})
                }
                
              })
  


        }
        else  if(cardb.Cars[trading.toLowerCase()] && cardb.Cars[trading2.toLowerCase()]) {

            let user1cars = db.fetch(`cars_${user1.id}`)
            let user2cars = db.fetch(`cars_${user2.id}`)

            if(!user1cars.includes(trading)) return interaction.reply(`${user1} doesn't have that car!`)
            if(!user2cars.includes(trading2)) return interaction.reply(`${user2} doesn't have that car!`)
            if(user1cars.includes(trading2)) return interaction.reply(`${user1} already has that car!`)
            if(user2cars.includes(trading)) return interaction.reply(`${user2} already has that car!`)

            let selected = db.fetch(`isselected_${cardb.Cars[trading.toLowerCase()].Name}_${user1.id}`)
            let selected2 = db.fetch(`isselected_${cardb.Cars[trading2.toLowerCase()].Name}_${user2.id}`)

            if(selected) return interaction.reply(`${user1}, you need to deselect this car before trading it!`)
            if(selected2) return interaction.reply(`${user2}, you need to deselect this car before trading it!`)

            let handling = db.fetch(`${cardb.Cars[trading.toLowerCase()].Name}handling_${user1.id}`) || 0
            let exhaust = db.fetch(`${cardb.Cars[trading].Name}exhaust_${user1.id}`)
            let gearbox = db.fetch(`${cardb.Cars[trading].Name}gearbox_${user1.id}`)
            let tires = db.fetch(`${cardb.Cars[trading].Name}tires_${user1.id}`)
            let turbo = db.fetch(`${cardb.Cars[trading].Name}turbo_${user1.id}`) 
            let intake = db.fetch(`${cardb.Cars[trading].Name}intake_${user1.id}`)
            let clutch = db.fetch(`${cardb.Cars[trading].Name}clutch_${user1.id}`)
            let ecu = db.fetch(`${cardb.Cars[trading].Name}ecu_${user1.id}`)
            let suspension = db.fetch(`${cardb.Cars[trading].Name}suspension_${user1.id}`)
            let restoration  = db.fetch(`${cardb.Cars[trading].Name}restoration_${user1.id}`)
            let restoration2  = db.fetch(`${cardb.Cars[trading2].Name}restoration_${user2.id}`)

            let weight = db.fetch(`${cardb.Cars[trading].Name}weight_${user1.id}`)
            let offroad = db.fetch(`${cardb.Cars[trading].Name}offroad_${user1.id}`)
            let drift = db.fetch(`${cardb.Cars[trading].Name}drift_${user1.id}`)
            let speed = db.fetch(`${cardb.Cars[trading].Name}speed_${user1.id}`)
            let zerosixty = db.fetch(`${cardb.Cars[trading].Name}060_${user1.id}`)

            let nitro = db.fetch(`${cardb.Cars[trading].Name}nitro_${user1.id}`)
          
            let engine = db.fetch(`${cardb.Cars[trading].Name}engine_${user1.id}`)
            
            let carimage = db.fetch(`${cardb.Cars[trading].Name}livery_${user1.id}`) || cardb.Cars[trading].Image

            let handling2 = db.fetch(`${cardb.Cars[trading2.toLowerCase()].Name}handling_${user2.id}`) || 0
            let exhaust2 = db.fetch(`${cardb.Cars[trading2].Name}exhaust_${user2.id}`)
            let gearbox2 = db.fetch(`${cardb.Cars[trading2].Name}gearbox_${user2.id}`)
            let tires2 = db.fetch(`${cardb.Cars[trading2].Name}tires_${user2.id}`)
            let turbo2 = db.fetch(`${cardb.Cars[trading2].Name}turbo_${user2.id}`) 
            let intake2 = db.fetch(`${cardb.Cars[trading2].Name}intake_${user2.id}`)
            let clutch2 = db.fetch(`${cardb.Cars[trading2].Name}clutch_${user2.id}`)
            let ecu2 = db.fetch(`${cardb.Cars[trading2].Name}ecu_${user2.id}`)
            let suspension2 = db.fetch(`${cardb.Cars[trading2].Name}suspension_${user2.id}`)
           
            let weight2 = db.fetch(`${cardb.Cars[trading2].Name}weight_${user2.id}`)
            let offroad2 = db.fetch(`${cardb.Cars[trading2].Name}offroad_${user2.id}`)
            let drift2 = db.fetch(`${cardb.Cars[trading2].Name}drift_${user2.id}`)
            let speed2 = db.fetch(`${cardb.Cars[trading2].Name}speed_${user2.id}`)
            let zerosixty2 = db.fetch(`${cardb.Cars[trading2].Name}060_${user2.id}`)
            let resale = db.fetch(`${cardb.Cars[trading].Name}resale_${user1.id}`)
            let resale2 = db.fetch(`${cardb.Cars[trading2].Name}resale_${user2.id}`)

            let nitro2 = db.fetch(`${cardb.Cars[trading2].Name}nitro_${user1.id}`)
          
            let engine2 = db.fetch(`${cardb.Cars[trading2].Name}engine_${user2.id}`)
            
            let carimage2 = db.fetch(`${cardb.Cars[trading2].Name}livery_${user2.id}`) || cardb.Cars[trading2].Image

            
            let embed = new Discord.MessageEmbed()
            .setTitle('Trading')
            .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
            .addField(`Your Offer`, `${cardb.Cars[trading].Name}`)
            .addField(`${user2.username}'s Offer`, `${cardb.Cars[trading2].Name}`)
            .setColor("#60b0f4")

            let msg = await interaction.reply({embeds: [embed], fetchReply: true})
            msg.react('✅')
            msg.react('❌')

            const filter = (_, u) => u.id === user2.id
            const collector = msg.createReactionCollector({ filter, time: 60000 })

            collector.on('collect', (r, user) => {
                
                if(r.emoji.name == '✅'){
                let newcars = db.fetch(`cars_${user1.id}`)
                if(!newcars.includes(trading)) return interaction.channel.send(`${user1} doesn't have that car!`)
                let newcars2 = db.fetch(`cars_${user2.id}`)
                if(!newcars2.includes(trading2)) return interaction.channel.send(`${user2} doesn't have that car!`)
                if(exhaust){
                    db.set(`${cardb.Cars[trading].Name}exhaust_${user1.id}`, exhaust)
                    db.delete(`${cardb.Cars[trading].Name}exhaust_${user1.id}`)
                
                }
                if(gearbox){
                    db.set(`${cardb.Cars[trading].Name}gearbox_${user2.id}`, gearbox)
                    db.delete(`${cardb.Cars[trading].Name}gearbox_${user1.id}`)
                }
                if(tires){
                    db.set(`${cardb.Cars[trading].Name}tires_${user2.id}`, tires)
                    db.delete(`${cardb.Cars[trading].Name}tires_${user1.id}`)
                }
                if(turbo){
                    db.set(`${cardb.Cars[trading].Name}turbo_${user2.id}`, turbo)
                    db.delete(`${cardb.Cars[trading].Name}turbo_${user1.id}`)
                }
                if(intake){
                    db.set(`${cardb.Cars[trading].Name}intake_${user2.id}`, intake)
                    db.delete(`${cardb.Cars[trading].Name}intake_${user1.id}`)
                }
                if(clutch){
                    db.set(`${cardb.Cars[trading].Name}clutch_${user2.id}`, clutch)
                    db.delete(`${cardb.Cars[trading].Name}clutch_${user1.id}`)
                }
                if(ecu){
                    db.set(`${cardb.Cars[trading].Name}ecu_${user2.id}`, ecu)
                    db.delete(`${cardb.Cars[trading].Name}ecu_${user1.id}`)
                }
                if(suspension){
                    db.set(`${cardb.Cars[trading].Name}suspension_${user2.id}`, suspension)
                    db.delete(`${cardb.Cars[trading].Name}suspension_${user1.id}`)
                }
                if(weight){
                    db.set(`${cardb.Cars[trading].Name}weight_${user2.id}`, weight)
                    db.delete(`${cardb.Cars[trading].Name}weight_${user1.id}`)
                }
                if(offroad){
                    db.set(`${cardb.Cars[trading].Name}offroad_${user2.id}`, offroad)
                    db.delete(`${cardb.Cars[trading].Name}offroad_${user1.id}`)
                }
                if(drift){
                    db.set(`${cardb.Cars[trading].Name}drift_${user2.id}`, drift)
                    db.delete(`${cardb.Cars[trading].Name}drift_${user1.id}`)
                }
                if(nitro){
                    db.set(`${cardb.Cars[trading].Name}nitro_${user2.id}`, nitro)
                    db.delete(`${cardb.Cars[trading].Name}nitro_${user1.id}`)
                }
                if(engine){
                    db.set(`${cardb.Cars[trading].Name}engine_${user2.id}`, engine)
                    db.delete(`${cardb.Cars[trading].Name}engine_${user1.id}`)
                }
                if(db.fetch(`${cardb.Cars[trading].Name}livery_${user1.id}`)){
                    db.set(`${cardb.Cars[trading].Name}livery_${user2.id}`, carimage) 
                    db.delete(`${cardb.Cars[trading].Name}livery_${user1.id}`)
                }
                if(exhaust){
                    db.set(`${cardb.Cars[trading2].Name}exhaust_${user1.id}`, exhaust)
                    db.delete(`${cardb.Cars[trading2].Name}exhaust_${user2.id}`)
                
                }
                if(gearbox2){
                    db.set(`${cardb.Cars[trading2].Name}gearbox_${user1.id}`, gearbox2)
                    db.delete(`${cardb.Cars[trading2].Name}gearbox_${user2.id}`)
                }
                if(tires2){
                    db.set(`${cardb.Cars[trading2].Name}tires_${user1.id}`, tires2)
                    db.delete(`${cardb.Cars[trading2].Name}tires_${user2.id}`)
                }
                if(turbo2){
                    db.set(`${cardb.Cars[trading2].Name}turbo_${user1.id}`, turbo2)
                    db.delete(`${cardb.Cars[trading2].Name}turbo_${user2.id}`)
                }
                if(intake2){
                    db.set(`${cardb.Cars[trading2].Name}intake_${user1.id}`, intake2)
                    db.delete(`${cardb.Cars[trading2].Name}intake_${user2.id}`)
                }
                if(clutch2){
                    db.set(`${cardb.Cars[trading2].Name}clutch_${user1.id}`, clutch2)
                    db.delete(`${cardb.Cars[trading2].Name}clutch_${user2.id}`)
                }
                if(ecu2){
                    db.set(`${cardb.Cars[trading2].Name}ecu_${user1.id}`, ecu2)
                    db.delete(`${cardb.Cars[trading2].Name}ecu_${user2.id}`)
                }
                if(suspension2){
                    db.set(`${cardb.Cars[trading2].Name}suspension_${user1.id}`, suspension2)
                    db.delete(`${cardb.Cars[trading2].Name}suspension_${user2.id}`)
                }
                if(weight2){
                    db.set(`${cardb.Cars[trading2].Name}weight_${user1.id}`, weight2)
                    db.delete(`${cardb.Cars[trading2].Name}weight_${user2.id}`)
                }
                if(offroad2){
                    db.set(`${cardb.Cars[trading2].Name}offroad_${user1.id}`, offroad2)
                    db.delete(`${cardb.Cars[trading2].Name}offroad_${user2.id}`)
                }
                if(drift2){
                    db.set(`${cardb.Cars[trading2].Name}drift_${user1.id}`, drift2)
                    db.delete(`${cardb.Cars[trading2].Name}drift_${user2.id}`)
                }
                if(nitro2){
                    db.set(`${cardb.Cars[trading2].Name}nitro_${user1.id}`, nitro2)
                    db.delete(`${cardb.Cars[trading2].Name}nitro_${user2.id}`)
                }
                if(engine2){
                    db.set(`${cardb.Cars[trading2].Name}engine_${user1.id}`, engine2)
                    db.delete(`${cardb.Cars[trading2].Name}engine_${user2.id}`)
                }
                if(db.fetch(`${cardb.Cars[trading2].Name}livery_${user2.id}`)){
                    db.set(`${cardb.Cars[trading2].Name}livery_${user1.id}`, carimage2) 
                    db.delete(`${cardb.Cars[trading2].Name}livery_${user2.id}`)
                }
    
                if(db.fetch(`${cardb.Cars[trading2].Name}restoration_${user2.id}`)){
                    db.set(`${cardb.Cars[trading2].Name}restoration_${user1.id}`, restoration2) 
                    db.delete(`${cardb.Cars[trading2].Name}restoration_${user2.id}`)
                }
    
                if(db.fetch(`${cardb.Cars[trading2].Name}restoration_${user1.id}`)){
                    db.set(`${cardb.Cars[trading2].Name}restoration_${user2.id}`, restoration) 
                    db.delete(`${cardb.Cars[trading2].Name}restoration_${user1.id}`)
                }

                db.set(`${cardb.Cars[trading2].Name}speed_${user1.id}`, speed2)
                db.set(`${cardb.Cars[trading2].Name}060_${user1.id}`, zerosixty2)
                db.set(`${cardb.Cars[trading2].Name}handling_${user1.id}`, handling2)
                db.set(`${cardb.Cars[trading].Name}speed_${user2.id}`, speed)
                db.set(`${cardb.Cars[trading].Name}060_${user2.id}`, zerosixty)
                db.set(`${cardb.Cars[trading].Name}handling_${user2.id}`, handling)
                db.set(`${cardb.Cars[trading].Name}resale_${user2.id}`, resale)
                db.set(`${cardb.Cars[trading2].Name}resale_${user1.id}`, resale2)

                db.delete(`${cardb.Cars[trading].Name}resale_${user1.id}`)
                db.delete(`${cardb.Cars[trading2].Name}resale_${user2.id}`)

                db.delete(`${cardb.Cars[trading].Name}speed_${user1.id}`)
                db.delete(`${cardb.Cars[trading].Name}060_${user1.id}`)
                db.delete(`${cardb.Cars[trading].Name}handling_${user1.id}`)
                db.delete(`${cardb.Cars[trading2].Name}speed_${user2.id}`)
                db.delete(`${cardb.Cars[trading2].Name}060_${user2.id}`)
                db.delete(`${cardb.Cars[trading2].Name}handling_${user2.id}`)
            
                for (var i = 0; i < 1; i ++) newcars.splice(newcars.indexOf(trading.toLowerCase()), 1)
                db.set(`cars_${user1.id}`, newcars)
                for (var i = 0; i < 1; i ++) newcars2.splice(newcars2.indexOf(trading2.toLowerCase()), 1)
                db.set(`cars_${user2.id}`, newcars2)
                db.push(`cars_${user1.id}`, trading2.toLowerCase())
                db.push(`cars_${user2.id}`, trading.toLowerCase())
                embed.setTitle("Trade Accepted!")
                collector.stop()

                interaction.editReply({embeds: [embed]})

            } else if(r.emoji.name == '❌') {
                embed.setTitle("Trade Declined")
                collector.stop()

                interaction.editReply({embeds: [embed]})
            }
            })
            collector.on('end', async collected => {
                if(collected.size === 0){
                    embed.setTitle("Trade Expired")
    
                    interaction.editReply({embeds: [embed]})
                }
                
              })

        }
        else  if(partdb.Parts[trading.toLowerCase()]) {

            let amount1 = interaction.options.getNumber("amount1")
            let user1parts = db.fetch(`parts_${user1.id}`)

            if(!user1parts.includes(trading.toLowerCase())) return interaction.reply(`You don't have this part!`)
            let actamount
            if(amount1 > 1){
                actamount = amount1
            } else {
                actamount = 1
            }

            let filtereduser = user1parts.filter(function hasmany(part) {
                return part === trading.toLowerCase()
              })
            if(amount2 > filtereduser.length) return interaction.reply(`${user1} doesn't have ${actamount} ${trading}!`)
            if(trading2.endsWith("cash")){
                let amount = trading2.split(' ')[0]
                let bal = db.fetch(`cash_${user2.id}`) || 0

                if(amount > bal) return interaction.reply(`The user doesn't have this much cash!`)

                let embed = new Discord.MessageEmbed()
                .setTitle('Trading')
                .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
                .addField(`Your Offer`, `${partdb.Parts[trading.toLowerCase()].Name} x${actamount}`)
                .addField(`${user2.username}'s Item`, `$${amount}`)
                .setColor("#60b0f4")
    
                let msg = await interaction.reply({embeds: [embed], fetchReply: true})
                msg.react('✅')
                msg.react('❌')
    
                const filter = (_, u) => u.id === user2.id
                const collector = msg.createReactionCollector({ filter, time: 60000 })
    
                collector.on('collect', (r, user) => {
                    if(r.emoji.name == '✅'){
                        db.subtract(`cash_${user2.id}`, amount)
                        db.add(`cash_${user1.id}`, amount)
                        for (var i = 0; i < actamount; i ++) user1parts.splice(user1parts.indexOf(trading.toLowerCase()), 1)
                        db.set(`parts_${user1.id}`, user1parts)
                        let user1newpart = []
                    for (var i = 0; i < actamount; i ++) user1newpart.push(trading.toLowerCase())
                    for(i in user1newpart){
                        
                        db.push(`parts_${user2.id}`, user1newpart[i])
                    }

                        embed.setTitle("Trade Accepted!")
                        collector.stop()

                        interaction.editReply({embeds: [embed]})
                    }
                    else if(r.emoji.name == '❌'){
                        embed.setTitle("Trade Declined!")
                        collector.stop()

                        interaction.editReply({embeds: [embed]})
                    }

                })
                collector.on('end', async collected => {
                    if(collected.size === 0){
                        embed.setTitle("Trade Expired")
        
                        interaction.editReply({embeds: [embed]})
                    }
                    
                  })
            }
            else if(partdb.Parts[trading2.toLowerCase()]){
                let user2parts = db.fetch(`parts_${user2.id}`)
                let amount2 = interaction.options.getNumber("amount2")
                let amount1 = interaction.options.getNumber("amount1")
        
                let actamount
                if(amount2 > 1){
                    actamount = amount2
                } else {
                    actamount = 1
                }
                let actamount1
                if(amount1 > 1){
                    actamount1 = amount1
                } else {
                    actamount1 = 1
                }
                let filtereduser = user2parts.filter(function hasmany(part) {
                    return part === trading2.toLowerCase()
                  })
                if(actamount > filtereduser.length) return interaction.reply(`${user2} doesn't have ${actamount} ${trading2}!`)
    
                let filtereduser2 = user1parts.filter(function hasmany(part) {
                    return part === trading.toLowerCase()
                  })
                if(amount1 > filtereduser2.length) return interaction.reply(`${user1} doesn't have ${actamount1} ${trading}!`)
    
                if(!user2parts.includes(trading2.toLowerCase())) return interaction.reply(`This user doesn't have this part!`)

                let embed = new Discord.MessageEmbed()
                .setTitle('Trading')
                .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
                .addField(`Your Offer`, `${partdb.Parts[trading.toLowerCase()].Name} x${actamount1}`)
                .addField(`${user2.username}'s Item`, `${partdb.Parts[trading2.toLowerCase()].Name} x${actamount}`)
                .setColor("#60b0f4")
    
                let msg = await interaction.reply({embeds: [embed], fetchReply: true})
                msg.react('✅')
                msg.react('❌')
    
                const filter = (_, u) => u.id === user2.id
                const collector = msg.createReactionCollector({ filter, time: 60000 })
    
                collector.on('collect', (r, user) => {
                    if(r.emoji.name == '✅'){
                        for (var i = 0; i < actamount; i ++) user2parts.splice(user2parts.indexOf(trading2.toLowerCase()), 1)
                        db.set(`parts_${user2.id}`, user2parts)
                        for (var i = 0; i < actamount1; i ++) user1parts.splice(user1parts.indexOf(trading.toLowerCase()), 1)
                        db.set(`parts_${user1.id}`, user1parts)
                        
                        let user1newpart = []
                        for (var i = 0; i < actamount; i ++) user1newpart.push(trading2.toLowerCase())
                        for(i in user1newpart){
                            
                            db.push(`parts_${user1.id}`, user1newpart[i])
                        }

                        let user1newpart2 = []
                        for (var i = 0; i < actamount1; i ++) user1newpart2.push(trading.toLowerCase())
                        for(i in user1newpart2){
                            
                            db.push(`parts_${user2.id}`, user1newpart2[i])
                        }

                        embed.setTitle("Trade Accepted!")
                        collector.stop()

                        interaction.editReply({embeds: [embed]})
                    }
                    else if(r.emoji.name == '❌'){
                        embed.setTitle("Trade Declined!")
                        collector.stop()

                        interaction.editReply({embeds: [embed]})
                    }

                })
                collector.on('end', async collected => {
                    if(collected.size === 0){
                        embed.setTitle("Trade Expired")
        
                        interaction.editReply({embeds: [embed]})
                    }
                    
                  })
            }
            // part for item
            else if(itemdb.Collectable[0][trading2.toLowerCase()] || itemdb.Police[trading2.toLowerCase()] || itemdb.Other[trading2.toLowerCase()]){
                let user1parts = db.fetch(`parts_${user1.id}`) || []
                let useritems2 = db.fetch(`items_${user2.id}`) || []
                let amount2 = interaction.options.getNumber("amount2")
                let amount1 = interaction.options.getNumber("amount1")
        
                let actamount
                if(amount2 > 1){
                    actamount = amount2
                } else {
                    actamount = 1
                }
                let actamount1
                if(amount1 > 1){
                    actamount1 = amount1
                } else {
                    actamount1 = 1
                }
                if(!user1parts.includes(trading.toLowerCase())) return interaction.reply(`You don't have this part!`)

                if(!useritems2.includes(trading2.toLowerCase())) return interaction.reply(`This user doesn't have this item!`)
                
                let filtereduser = useritems2.filter(function hasmany(part) {
                    return part === trading2.toLowerCase()
                  })
                if(amount2 > filtereduser.length) return interaction.reply(`${user2} doesn't have ${actamount} ${trading2}!`)
    
                let filtereduser2 = user1parts.filter(function hasmany(part) {
                    return part === trading.toLowerCase()
                  })
                if(amount1 > filtereduser2.length) return interaction.reply(`${user1} doesn't have ${actamount1} ${trading}!`)

                let itemtype

                
                if(itemdb.Collectable[0][trading2.toLowerCase()]){
                    itemtype = "Collectable"

                }

                else if(itemdb.Police[trading2.toLowerCase()] ){
                    itemtype = "Police"

                }
                else if(itemdb.Other[trading2.toLowerCase()] ){
                  itemtype = "Other"

              }
               
                let embed = new Discord.MessageEmbed()
                .setTitle('Trading')
                .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
                .addField(`Your Offer`, `${partdb.Parts[trading.toLowerCase()].Name} x${actamount1}`)
                if(itemtype == "Collectable"){
                    embed.addField(`${user2.username}'s Offer`, `${itemdb[itemtype][0][trading2.toLowerCase()].Emote} ${itemdb[itemtype][0][trading2.toLowerCase()].Name} x${actamount}`)

                }
                else {
                    embed.addField(`${user2.username}'s Offer`, `${itemdb[itemtype][trading2.toLowerCase()].Emote} ${itemdb[itemtype][trading2.toLowerCase()].Name} x${actamount}`)

                }
                embed.setColor("#60b0f4")
    
                let msg = await interaction.reply({embeds: [embed], fetchReply: true})
                msg.react('✅')
                msg.react('❌')
    
                const filter = (_, u) => u.id === user2.id
                const collector = msg.createReactionCollector({ filter, time: 60000 })
    
                collector.on('collect', (r, user) => {
                    if(r.emoji.name == '✅'){
                        for (var i = 0; i < actamount1; i ++) user1parts.splice(user1parts.indexOf(trading.toLowerCase()), 1)
                        db.set(`parts_${user1.id}`, user1parts)
                        for (var i = 0; i < actamount; i ++) useritems2.splice(useritems2.indexOf(trading2.toLowerCase()), 1)
                        db.set(`items_${user2.id}`, useritems2)
                        
                        let user1newpart = []
                        for (var i = 0; i < actamount1; i ++) user1newpart.push(trading.toLowerCase())
                        for(i in user1newpart){
                            
                            db.push(`parts_${user2.id}`, user1newpart[i])
                        }

                        let user1newpart2 = []
                        for (var i = 0; i < actamount; i ++) user1newpart2.push(trading2.toLowerCase())
                        for(i in user1newpart2){
                            
                            db.push(`items_${user1.id}`, user1newpart2[i])
                        }


                        embed.setTitle("Trade Accepted!")
                        collector.stop()

                        interaction.editReply({embeds: [embed]})
                    }
                    else if(r.emoji.name == '❌'){
                        embed.setTitle("Trade Declined!")
                        collector.stop()

                        interaction.editReply({embeds: [embed]})
                    }

                })
                collector.on('end', async collected => {
                    if(collected.size === 0){
                        embed.setTitle("Trade Expired")
        
                        interaction.editReply({embeds: [embed]})
                    }
                    
                  })
            }
            else if(cardb.Cars[trading2.toLowerCase()]){
                let user2cars = db.fetch(`cars_${user2.id}`)

                if(!user2cars.includes(trading2.toLowerCase())) return interaction.reply(`This user doesn't have this car!`)
                let amount2 = interaction.options.getNumber("amount2")
                let amount1 = interaction.options.getNumber("amount1")
        
                let actamount
                if(amount2 > 1){
                    actamount = amount2
                } else {
                    actamount = 1
                }
                let actamount1
                if(amount1 > 1){
                    actamount1 = amount1
                } else {
                    actamount1 = 1
                }
                let filtereduser = user1parts.filter(function hasmany(part) {
                    return part === trading.toLowerCase()
                  })
                if(actamount1 > filtereduser.length) return interaction.reply(`${user1} doesn't have ${actamount1} ${trading}!`)

                let embed = new Discord.MessageEmbed()
                .setTitle('Trading')
                .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
                .addField(`Your Offer`, `${partdb.Parts[trading.toLowerCase()].Name} x${actamount1}`)
                .addField(`${user2.username}'s Item`, `${cardb.Cars[trading2.toLowerCase()].Name}`)
                .setColor("#60b0f4")
    
                let msg = await interaction.reply({embeds: [embed], fetchReply: true})
                msg.react('✅')
                msg.react('❌')
    
                const filter = (_, u) => u.id === user2.id
                const collector = msg.createReactionCollector({ filter, time: 60000 })
    
                collector.on('collect', (r, user) => {
                    if(r.emoji.name == '✅'){
                        let selected = db.fetch(`isselected_${cardb.Cars[trading2.toLowerCase()].Name}_${user2.id}`)

                        if(selected) return interaction.reply(`${user2}, you need to deselect this car before trading it!`)
            
                        let handling = db.fetch(`${cardb.Cars[trading2.toLowerCase()].Name}handling_${user2.id}`) || 0
                        let exhaust = db.fetch(`${cardb.Cars[trading2].Name}exhaust_${user2.id}`)
                        let gearbox = db.fetch(`${cardb.Cars[trading2].Name}gearbox_${user2.id}`)
                        let tires = db.fetch(`${cardb.Cars[trading2].Name}tires_${user2.id}`)
                        let turbo = db.fetch(`${cardb.Cars[trading2].Name}turbo_${user2.id}`) 
                        let intake = db.fetch(`${cardb.Cars[trading2].Name}intake_${user2.id}`)
                        let clutch = db.fetch(`${cardb.Cars[trading2].Name}clutch_${user2.id}`)
                        let ecu = db.fetch(`${cardb.Cars[trading2].Name}ecu_${user2.id}`)
                        let suspension = db.fetch(`${cardb.Cars[trading2].Name}suspension_${user2.id}`)
                       
                        let weight = db.fetch(`${cardb.Cars[trading2].Name}weight_${user2.id}`)
                        let offroad = db.fetch(`${cardb.Cars[trading2].Name}offroad_${user2.id}`)
                        let drift = db.fetch(`${cardb.Cars[trading2].Name}drift_${user2.id}`)
                        let speed = db.fetch(`${cardb.Cars[trading2].Name}speed_${user2.id}`)
                        let zerosixty = db.fetch(`${cardb.Cars[trading2].Name}060_${user2.id}`)
            
                        let nitro = db.fetch(`${cardb.Cars[trading2].Name}nitro_${user2.id}`)
                        let restoration  = db.fetch(`${cardb.Cars[trading2].Name}restoration_${user2.id}`)
            
                        let engine = db.fetch(`${cardb.Cars[trading2].Name}engine_${user2.id}`)
                        
                        let carimage = db.fetch(`${cardb.Cars[trading2].Name}livery_${user2.id}`) || cardb.Cars[trading2].Image
                        
                        let newcars = db.fetch(`cars_${user2.id}`)
                        if(!newcars.includes(trading2)) return interaction.channel.send(`${user2} doesn't have that car!`)
                        if(exhaust){
                            db.set(`${cardb.Cars[trading2].Name}exhaust_${user1.id}`, exhaust)
                            db.delete(`${cardb.Cars[trading2].Name}exhaust_${user2.id}`)
                        
                        }
                        if(gearbox){
                            db.set(`${cardb.Cars[trading2].Name}gearbox_${user1.id}`, gearbox)
                            db.delete(`${cardb.Cars[trading2].Name}gearbox_${user2.id}`)
                        }
                        if(tires){
                            db.set(`${cardb.Cars[trading2].Name}tires_${user1.id}`, tires)
                            db.delete(`${cardb.Cars[trading2].Name}tires_${user2.id}`)
                        }
                        if(turbo){
                            db.set(`${cardb.Cars[trading2].Name}turbo_${user1.id}`, turbo)
                            db.delete(`${cardb.Cars[trading2].Name}turbo_${user2.id}`)
                        }
                        if(intake){
                            db.set(`${cardb.Cars[trading2].Name}intake_${user1.id}`, intake)
                            db.delete(`${cardb.Cars[trading2].Name}intake_${user2.id}`)
                        }
                        if(clutch){
                            db.set(`${cardb.Cars[trading2].Name}clutch_${user1.id}`, clutch)
                            db.delete(`${cardb.Cars[trading2].Name}clutch_${user2.id}`)
                        }
                        if(ecu){
                            db.set(`${cardb.Cars[trading2].Name}ecu_${user1.id}`, ecu)
                            db.delete(`${cardb.Cars[trading2].Name}ecu_${user2.id}`)
                        }
                        if(suspension){
                            db.set(`${cardb.Cars[trading2].Name}suspension_${user1.id}`, suspension)
                            db.delete(`${cardb.Cars[trading2].Name}suspension_${user2.id}`)
                        }
                        if(weight){
                            db.set(`${cardb.Cars[trading2].Name}weight_${user1.id}`, weight)
                            db.delete(`${cardb.Cars[trading2].Name}weight_${user2.id}`)
                        }
                        if(offroad){
                            db.set(`${cardb.Cars[trading2].Name}offroad_${user1.id}`, offroad)
                            db.delete(`${cardb.Cars[trading2].Name}offroad_${user2.id}`)
                        }
                        if(drift){
                            db.set(`${cardb.Cars[trading2].Name}drift_${user1.id}`, drift)
                            db.delete(`${cardb.Cars[trading2].Name}drift_${user2.id}`)
                        }
                        if(nitro){
                            db.set(`${cardb.Cars[trading2].Name}nitro_${user1.id}`, nitro)
                            db.delete(`${cardb.Cars[trading2].Name}nitro_${user2.id}`)
                        }
                        if(engine){
                            db.set(`${cardb.Cars[trading2].Name}engine_${user1.id}`, engine)
                            db.delete(`${cardb.Cars[trading2].Name}engine_${user2.id}`)
                        }
                        if(db.fetch(`${cardb.Cars[trading2].Name}livery_${user2.id}`)){
                            db.set(`${cardb.Cars[trading2].Name}livery_${user1.id}`, carimage) 
                            db.delete(`${cardb.Cars[trading2].Name}livery_${user2.id}`)
                        }
                        if(db.fetch(`${cardb.Cars[trading2].Name}restoration_${user2.id}`)){
                            db.set(`${cardb.Cars[trading2].Name}restoration_${user1.id}`, restoration) 
                            db.delete(`${cardb.Cars[trading2].Name}restoration_${user2.id}`)
                        }
            
                        db.set(`${cardb.Cars[trading2].Name}speed_${user1.id}`, speed)
                        db.set(`${cardb.Cars[trading2].Name}060_${user1.id}`, zerosixty)
                        db.set(`${cardb.Cars[trading2].Name}handling_${user1.id}`, handling)
                        db.delete(`${cardb.Cars[trading2].Name}speed_${user2.id}`)
                        db.delete(`${cardb.Cars[trading2].Name}060_${user2.id}`)
                        db.delete(`${cardb.Cars[trading2].Name}handling_${user2.id}`)
                        for (var i = 0; i < 1; i ++) newcars.splice(newcars.indexOf(trading2.toLowerCase()), 1)
                        db.set(`cars_${user2.id}`, newcars)
                        db.push(`cars_${user1.id}`, trading2.toLowerCase())
                        for (var i = 0; i < actamount1; i ++) user1parts.splice(user1parts.indexOf(trading.toLowerCase()), 1)
                        db.set(`parts_${user1.id}`, user1parts)
                        
                        let user1newpart = []
                        for (var i = 0; i < actamount1; i ++) user1newpart.push(trading.toLowerCase())
                        for(i in user1newpart){
                            
                            db.push(`parts_${user2.id}`, user1newpart[i])
                        }
                        embed.setTitle("Trade Accepted!")
                        collector.stop()

                        interaction.editReply({embeds: [embed]})
                    }
                    else if(r.emoji.name == '❌'){
                        embed.setTitle("Trade Declined!")
                        collector.stop()

                        interaction.editReply({embeds: [embed]})
                    }

                })
                collector.on('end', async collected => {
                    if(collected.size === 0){
                        embed.setTitle("Trade Expired")
        
                        interaction.editReply({embeds: [embed]})
                    }
                    
                  })
            }
            
            
        }
            else if(itemdb.Collectable[0][trading.toLowerCase()] || itemdb.Police[trading.toLowerCase()] || itemdb.Other[trading.toLowerCase()]){
                
                let useritems = db.fetch(`items_${user1.id}`)
                let amount2 = interaction.options.getNumber("amount2")
                let amount1 = interaction.options.getNumber("amount1")
        
                let actamount
                if(amount2 > 1){
                    actamount = amount2
                } else {
                    actamount = 1
                }
                let actamount1
                if(amount1 > 1){
                    actamount1 = amount1
                } else {
                    actamount1 = 1
                }
                if(!useritems) return interaction.reply(`${user1}, you don't have any items!`)
                if(!useritems.includes(trading.toLowerCase())) return interaction.reply(`${user1}, you don't have this item`)
                let filtereduser = useritems.filter(function hasmany(part) {
                    return part === trading.toLowerCase()
                  })
                  if(actamount1 > filtereduser.length) return interaction.reply(`${user1} doesn't have ${actamount1} ${trading}!`)


                // Item for cash
                let itemtype

                
                  if(itemdb.Collectable[0][trading.toLowerCase()]){
                      itemtype = "Collectable"

                  }

                  else if(itemdb.Police[trading.toLowerCase()] ){
                      itemtype = "Police"

                  }
                  else if(itemdb.Other[trading.toLowerCase()] ){
                    itemtype = "Other"

                }
                 

                if(trading2.toLowerCase().endsWith("cash")){


                        
                    
                    console.log(itemtype)
                    trading = trading.toLowerCase()
                    let amount = trading2.split(' ')[0]
                    let bal = db.fetch(`cash_${user2.id}`)
                    if(bal < amount) return interaction.reply(`Settle down, ${user2} doesn't have enough cash!`)
                    if(amount < 1500) return interaction.reply(`Minimum of $1.5k cash needed.`)
                    let embed = new Discord.MessageEmbed()
                    .setTitle('Trading')
                    .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
                    if(itemtype == "Collectable"){
                        embed.addField(`Your Offer`, `${itemdb[itemtype][0][trading.toLowerCase()].Emote} ${itemdb[itemtype][0][trading.toLowerCase()].Name} x${actamount1}`)

                    }
                    else {
                        embed.addField(`Your Offer`, `${itemdb[itemtype][trading.toLowerCase()].Emote} ${itemdb[itemtype][trading.toLowerCase()].Name} x${actamount1}`)

                    }

                    embed.addField(`${user2.username}'s Item`, `$${numberWithCommas(amount)}`)
                    .setColor("#60b0f4")
        
                    let msg = await interaction.reply({embeds: [embed], fetchReply: true})
                    msg.react('✅')
                    msg.react('❌')
        
                    const filter = (_, u) => u.id === user2.id
                    const collector = msg.createReactionCollector({ filter, time: 60000 })
        
                    collector.on('collect', (r, user) => {
                        
                        if(r.emoji.name == '✅'){
                            db.subtract(`cash_${user2.id}`, amount)
                            let user1newpart = []
                            for (var i = 0; i < actamount1; i ++) user1newpart.push(trading.toLowerCase())
                            for(i in user1newpart){
                                
                                db.push(`items_${user2.id}`, user1newpart[i])
                            }
        

                            db.add(`cash_${user1.id}`, amount)
                            for (var i = 0; i < actamount1; i ++) useritems.splice(useritems.indexOf(trading.toLowerCase()), 1)
                            db.set(`items_${user1.id}`, useritems)
                            embed.setTitle("Trade Accepted!")
                            collector.stop()

                            interaction.editReply({embeds: [embed]})
                        }
                        else if(r.emoji.name == '❌'){
                            embed.setTitle("Trade Declined!")
                            collector.stop()

                            interaction.editReply({embeds: [embed]})
                        }
    
                    })
                    collector.on('end', async collected => {
                        if(collected.size === 0){
                            embed.setTitle("Trade Expired!")
            
                            interaction.editReply({embeds: [embed]})
                        }

                    })
                
                }
                else if(partdb.Parts[trading2.toLowerCase()]){

                    let user2parts = db.fetch(`parts_${user2.id}`)

                    let filtereduser = user2parts.filter(function hasmany(part) {
                        return part === trading2.toLowerCase()
                      })
                    if(actamount > filtereduser.length) return interaction.reply(`${user2} doesn't have ${actamount} ${trading2}!`)
        

                    if(!user2parts.includes(trading2.toLowerCase())) return interaction.reply(`This user doesn't have this part!`)
    
                    let embed = new Discord.MessageEmbed()
                    .setTitle('Trading')
                    .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
                    if(itemtype == "Collectable"){
                        embed.addField(`Your Offer`, `${itemdb[itemtype][0][trading.toLowerCase()].Emote} ${itemdb[itemtype][0][trading.toLowerCase()].Name} x${actamount1}`)

                    }
                    else {
                        embed.addField(`Your Offer`, `${itemdb[itemtype][trading.toLowerCase()].Emote} ${itemdb[itemtype][trading.toLowerCase()].Name} x${actamount1}`)

                    }
                    embed.addField(`${user2.username}'s Item`, `${partdb.Parts[trading2.toLowerCase()].Name} x${actamount}`)
                    .setColor("#60b0f4")
        
                    let msg = await interaction.reply({embeds: [embed], fetchReply: true})
                    msg.react('✅')
                    msg.react('❌')
        
                    const filter = (_, u) => u.id === user2.id
                    const collector = msg.createReactionCollector({ filter, time: 60000 })
        
                    collector.on('collect', (r, user) => {
                        if(r.emoji.name == '✅'){
                            for (var i = 0; i < actamount; i ++) user2parts.splice(user2parts.indexOf(trading2.toLowerCase()), 1)
                            db.set(`parts_${user2.id}`, user2parts)
                            for (var i = 0; i < actamount1; i ++) useritems.splice(useritems.indexOf(trading.toLowerCase()), 1)
                            db.set(`items_${user1.id}`, useritems)
                            let user1newpart = []
                            for (var i = 0; i < actamount; i ++) user1newpart.push(trading2.toLowerCase())
                            for(i in user1newpart){
                                
                                db.push(`parts_${user1.id}`, user1newpart[i])
                            }  
                            let user1newpart2 = []
                            for (var i = 0; i < actamount1; i ++) user1newpart2.push(trading.toLowerCase())
                            console.log(user1newpart)
                            console.log(user1newpart2)

                            for(i in user1newpart2){
                                
                                db.push(`items_${user2.id}`, user1newpart2[i])
                            }  
                            
                           
    
                            embed.setTitle("Trade Accepted!")
                            collector.stop()

                            interaction.editReply({embeds: [embed]})
                        }
                        else if(r.emoji.name == '❌'){
                            embed.setTitle("Trade Declined!")
                            collector.stop()

                            interaction.editReply({embeds: [embed]})
                        }
    
                    })
                    collector.on('end', async collected => {
                        if(collected.size === 0){
                            embed.setTitle("Trade Expired")
            
                            interaction.editReply({embeds: [embed]})
                        }
                        
                      })

                }

                else if(cardb.Cars[trading2.toLowerCase()]){
                    let user2cars = db.fetch(`cars_${user2.id}`)

                    if(!user2cars.includes(trading2.toLowerCase())) return interaction.reply(`This user doesn't have this car!`)
    
                    let embed = new Discord.MessageEmbed()
                    .setTitle('Trading')
                    .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
                    if(itemtype == "Collectable"){
                        embed.addField(`Your Offer`, `${itemdb[itemtype][0][trading.toLowerCase()].Emote} ${itemdb[itemtype][0][trading.toLowerCase()].Name} x${actamount1}`)

                    }
                    else {
                        embed.addField(`Your Offer`, `${itemdb[itemtype][trading.toLowerCase()].Emote} ${itemdb[itemtype][trading.toLowerCase()].Name} x${actamount1}`)

                    }
                    embed.addField(`${user2.username}'s Item`, `${cardb.Cars[trading2.toLowerCase()].Name}`)
                    .setColor("#60b0f4")
        
                    let msg = await interaction.reply({embeds: [embed], fetchReply: true})
                    msg.react('✅')
                    msg.react('❌')
        
                    const filter = (_, u) => u.id === user2.id
                    const collector = msg.createReactionCollector({ filter, time: 60000 })
        
                    collector.on('collect', (r, user) => {
                        if(r.emoji.name == '✅'){
                            let selected = db.fetch(`isselected_${cardb.Cars[trading2.toLowerCase()].Name}_${user2.id}`)
    
                            if(selected) return interaction.reply(`${user2}, you need to deselect this car before trading it!`)
                
                            let handling = db.fetch(`${cardb.Cars[trading2.toLowerCase()].Name}handling_${user2.id}`) || 0
                            let exhaust = db.fetch(`${cardb.Cars[trading2].Name}exhaust_${user2.id}`)
                            let gearbox = db.fetch(`${cardb.Cars[trading2].Name}gearbox_${user2.id}`)
                            let tires = db.fetch(`${cardb.Cars[trading2].Name}tires_${user2.id}`)
                            let turbo = db.fetch(`${cardb.Cars[trading2].Name}turbo_${user2.id}`) 
                            let intake = db.fetch(`${cardb.Cars[trading2].Name}intake_${user2.id}`)
                            let clutch = db.fetch(`${cardb.Cars[trading2].Name}clutch_${user2.id}`)
                            let ecu = db.fetch(`${cardb.Cars[trading2].Name}ecu_${user2.id}`)
                            let suspension = db.fetch(`${cardb.Cars[trading2].Name}suspension_${user2.id}`)
                           
                            let weight = db.fetch(`${cardb.Cars[trading2].Name}weight_${user2.id}`)
                            let offroad = db.fetch(`${cardb.Cars[trading2].Name}offroad_${user2.id}`)
                            let drift = db.fetch(`${cardb.Cars[trading2].Name}drift_${user2.id}`)
                            let speed = db.fetch(`${cardb.Cars[trading2].Name}speed_${user2.id}`)
                            let zerosixty = db.fetch(`${cardb.Cars[trading2].Name}060_${user2.id}`)
                            let resale = db.fetch(`${cardb.Cars[trading2].Name}resale_${user2.id}`)

                            let nitro = db.fetch(`${cardb.Cars[trading2].Name}nitro_${user2.id}`)
                            let restoration  = db.fetch(`${cardb.Cars[trading2].Name}restoration_${user2.id}`)
                
                            let engine = db.fetch(`${cardb.Cars[trading2].Name}engine_${user2.id}`)
                            
                            let carimage = db.fetch(`${cardb.Cars[trading2].Name}livery_${user2.id}`) || cardb.Cars[trading2].Image
                            
                            let newcars = db.fetch(`cars_${user2.id}`)
                            if(!newcars.includes(trading2)) return interaction.channel.send(`${user2} doesn't have that car!`)
                            if(exhaust){
                                db.set(`${cardb.Cars[trading2].Name}exhaust_${user1.id}`, exhaust)
                                db.delete(`${cardb.Cars[trading2].Name}exhaust_${user2.id}`)
                            
                            }
                            if(gearbox){
                                db.set(`${cardb.Cars[trading2].Name}gearbox_${user1.id}`, gearbox)
                                db.delete(`${cardb.Cars[trading2].Name}gearbox_${user2.id}`)
                            }
                            if(tires){
                                db.set(`${cardb.Cars[trading2].Name}tires_${user1.id}`, tires)
                                db.delete(`${cardb.Cars[trading2].Name}tires_${user2.id}`)
                            }
                            if(turbo){
                                db.set(`${cardb.Cars[trading2].Name}turbo_${user1.id}`, turbo)
                                db.delete(`${cardb.Cars[trading2].Name}turbo_${user2.id}`)
                            }
                            if(intake){
                                db.set(`${cardb.Cars[trading2].Name}intake_${user1.id}`, intake)
                                db.delete(`${cardb.Cars[trading2].Name}intake_${user2.id}`)
                            }
                            if(clutch){
                                db.set(`${cardb.Cars[trading2].Name}clutch_${user1.id}`, clutch)
                                db.delete(`${cardb.Cars[trading2].Name}clutch_${user2.id}`)
                            }
                            if(ecu){
                                db.set(`${cardb.Cars[trading2].Name}ecu_${user1.id}`, ecu)
                                db.delete(`${cardb.Cars[trading2].Name}ecu_${user2.id}`)
                            }
                            if(suspension){
                                db.set(`${cardb.Cars[trading2].Name}suspension_${user1.id}`, suspension)
                                db.delete(`${cardb.Cars[trading2].Name}suspension_${user2.id}`)
                            }
                            if(weight){
                                db.set(`${cardb.Cars[trading2].Name}weight_${user1.id}`, weight)
                                db.delete(`${cardb.Cars[trading2].Name}weight_${user2.id}`)
                            }
                            if(offroad){
                                db.set(`${cardb.Cars[trading2].Name}offroad_${user1.id}`, offroad)
                                db.delete(`${cardb.Cars[trading2].Name}offroad_${user2.id}`)
                            }
                            if(drift){
                                db.set(`${cardb.Cars[trading2].Name}drift_${user1.id}`, drift)
                                db.delete(`${cardb.Cars[trading2].Name}drift_${user2.id}`)
                            }
                            if(nitro){
                                db.set(`${cardb.Cars[trading2].Name}nitro_${user1.id}`, nitro)
                                db.delete(`${cardb.Cars[trading2].Name}nitro_${user2.id}`)
                            }
                            if(engine){
                                db.set(`${cardb.Cars[trading2].Name}engine_${user1.id}`, engine)
                                db.delete(`${cardb.Cars[trading2].Name}engine_${user2.id}`)
                            }
                            if(db.fetch(`${cardb.Cars[trading2].Name}livery_${user2.id}`)){
                                db.set(`${cardb.Cars[trading2].Name}livery_${user1.id}`, carimage) 
                                db.delete(`${cardb.Cars[trading2].Name}livery_${user2.id}`)
                            }
                            if(db.fetch(`${cardb.Cars[trading2].Name}restoration_${user2.id}`)){
                                db.set(`${cardb.Cars[trading2].Name}restoration_${user1.id}`, restoration) 
                                db.delete(`${cardb.Cars[trading2].Name}restoration_${user2.id}`)
                            }
                            if(db.fetch(`${cardb.Cars[trading2].Name}resale_${user2.id}`)){
                                db.set(`${cardb.Cars[trading2].Name}resale_${user1.id}`, resale) 
                                db.delete(`${cardb.Cars[trading2].Name}resale_${user2.id}`)
                            }

                
                            db.set(`${cardb.Cars[trading2].Name}speed_${user1.id}`, speed)
                            db.set(`${cardb.Cars[trading2].Name}060_${user1.id}`, zerosixty)
                            db.set(`${cardb.Cars[trading2].Name}handling_${user1.id}`, handling)
                            db.delete(`${cardb.Cars[trading2].Name}speed_${user2.id}`)
                            db.delete(`${cardb.Cars[trading2].Name}060_${user2.id}`)
                            db.delete(`${cardb.Cars[trading2].Name}handling_${user2.id}`)
                            for (var i = 0; i < 1; i ++) newcars.splice(newcars.indexOf(trading2.toLowerCase()), 1)
                            db.set(`cars_${user2.id}`, newcars)
                            db.push(`cars_${user1.id}`, trading2.toLowerCase())
                            for (var i = 0; i < actamount1; i ++) useritems.splice(useritems.indexOf(trading.toLowerCase()), 1)
                            db.set(`items_${user1.id}`, useritems)
                            let user1newpart = []
                            for (var i = 0; i < actamount1; i ++) user1newpart.push(trading.toLowerCase())
                            for(i in user1newpart){
                                
                                db.push(`items_${user2.id}`, user1newpart[i])
                            }
        
                            embed.setTitle("Trade Accepted!")
                            collector.stop()

                            interaction.editReply({embeds: [embed]})
                        }
                        else if(r.emoji.name == '❌'){
                            embed.setTitle("Trade Declined!")
                            collector.stop()

                            interaction.editReply({embeds: [embed]})
                        }
    
                    })
                    collector.on('end', async collected => {
                        if(collected.size === 0){
                            embed.setTitle("Trade Expired")
            
                            interaction.editReply({embeds: [embed]})
                        }
                        
                      })
                   
                }
                else if(itemdb.Collectable[0][trading2.toLowerCase()] || itemdb.Police[trading2.toLowerCase()] || itemdb.Other[trading2.toLowerCase()]){


                    let user2items = db.fetch(`items_${user2.id}`)

                    if(!user2items.includes(trading2.toLowerCase())) return interaction.reply(`This user doesn't have this item!`)

                    
            let filtereduser = user2items.filter(function hasmany(part) {
                return part === trading2.toLowerCase()
              })
            if(actamount > filtereduser.length) return interaction.reply(`${user2} doesn't have ${actamount} ${trading2}!`)

                    let itemtype2

                
                    if(itemdb.Collectable[0][trading2.toLowerCase()]){
                        itemtype2 = "Collectable"
  
                    }
  
                    else if(itemdb.Police[trading2.toLowerCase()] ){
                        itemtype2 = "Police"
  
                    }
                    else if(itemdb.Other[trading2.toLowerCase()] ){
                      itemtype2 = "Other"
  
                  }
                   
    
                    let embed = new Discord.MessageEmbed()
                    .setTitle('Trading')
                    .setDescription(`The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`)
                    if(itemtype == "Collectable"){
                        embed.addField(`Your Offer`, `${itemdb[itemtype][0][trading.toLowerCase()].Emote} ${itemdb[itemtype][0][trading.toLowerCase()].Name} x${actamount1}`)

                    }
                    else {
                        embed.addField(`Your Offer`, `${itemdb[itemtype][trading.toLowerCase()].Emote} ${itemdb[itemtype][trading.toLowerCase()].Name} x${actamount1}`)

                    }
                    if(itemtype2 == "Collectable"){
                        embed.addField(`Your Offer`, `${itemdb[itemtype2][0][trading2.toLowerCase()].Emote} ${itemdb[itemtype2][0][trading2.toLowerCase()].Name} x${actamount}`)

                    }
                    else {
                        embed.addField(`Your Offer`, `${itemdb[itemtype2][trading2.toLowerCase()].Emote} ${itemdb[itemtype2][trading2.toLowerCase()].Name} x${actamount}`)

                    }

                    embed.setColor("#60b0f4")
        
                    let msg = await interaction.reply({embeds: [embed], fetchReply: true})
                    msg.react('✅')
                    msg.react('❌')
        
                    const filter = (_, u) => u.id === user2.id
                    const collector = msg.createReactionCollector({ filter, time: 60000 })
        
                    collector.on('collect', (r, user) => {
                        if(r.emoji.name == '✅'){
                            for (var i = 0; i < actamount; i ++) user2items.splice(user2items.indexOf(trading2.toLowerCase()), 1)
                            db.set(`items_${user2.id}`, user2items)
                            for (var i = 0; i < actamount1; i ++) useritems.splice(useritems.indexOf(trading.toLowerCase()), 1)
                            db.set(`items_${user1.id}`, useritems)
                            let user1newpart = []
                            for (var i = 0; i < actamount; i ++) user1newpart.push(trading2.toLowerCase())
                            for(i in user1newpart){
                                
                                db.push(`items_${user1.id}`, user1newpart[i])
                            }
                            let user1newpart2 = []
                            for (var i = 0; i < actamount1; i ++) user1newpart2.push(trading.toLowerCase())
                            for(i in user1newpart2){
                                
                                db.push(`items_${user2.id}`, user1newpart2[i])
                            }
    
    
                            embed.setTitle("Trade Accepted!")
                            collector.stop()

                            interaction.editReply({embeds: [embed]})
                        }
                        else if(r.emoji.name == '❌'){
                            embed.setTitle("Trade Declined!")
                            collector.stop()

                            interaction.editReply({embeds: [embed]})
                        }
    
                    })
                    collector.on('end', async collected => {
                        if(collected.size === 0){
                            embed.setTitle("Trade Expired")
            
                            interaction.editReply({embeds: [embed]})
                        }
                        
                      })


                }

                // Item for Item

                //Item for car

                
            }
        else {
            interaction.reply(`Error! Did you make sure to specify cash, a car, or a part on the bot?`)
        }


    
      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    function removeA(item) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && item.length) {
            what = a[--L];
            while ((ax= item.indexOf(what)) !== -1) {
                item.splice(ax, 1);
            }
        }
        return item;
    }
        
    }
  }