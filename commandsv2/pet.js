const Discord = require("discord.js")
const cars = require('../cardb.json')
const ms = require('ms')
const db = require("quick.db")
const {SlashCommandBuilder} = require('@discordjs/builders')
const {MessageActionRow, MessageButton} = require("discord.js")
const lodash = require('lodash')
const partdb = require('../partsdb.json')
const itemdb = require('../items.json')
const petdb = require('../pets.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pet')
    .setDescription("View your mini miata"),
    async execute(interaction) {

        let pet = db.fetch(`pet_${interaction.user.id}`)
        if(!pet) return interaction.reply(`You don't have a pet!`)
        let condition = db.fetch(`pet_${interaction.user.id}.Condition`)
        let gas = db.fetch(`pet_${interaction.user.id}.Gas`)
        let oil = db.fetch(`pet_${interaction.user.id}.Oil`)
        let love = db.fetch(`pet_${interaction.user.id}.Love`)
        let color = db.fetch(`pet_${interaction.user.id}.Color`) || 'Red'
        let spoiler = db.fetch(`pet_${interaction.user.id}.Spoiler`)
        let name = db.fetch(`pet_${interaction.user.id}.Name`) || "N/A"

        let petimage 

        if(color == "Black"){
            petimage = petdb.Pets["mini miata"].Black

            if(spoiler){
                petimage = petdb.Pets["mini miata"].BlackSpoiler

            }
        }
        else if(color == "Blue"){
            petimage = petdb.Pets["mini miata"].Blue

            if(spoiler){
                petimage = petdb.Pets["mini miata"].BlueSpoiler

            }
        }
        else if(color == "Red"){
            petimage = petdb.Pets["mini miata"].Red

            if(spoiler){
                petimage = petdb.Pets["mini miata"].RedSpoiler

            }
        }
        else if(color == "White"){
            petimage = petdb.Pets["mini miata"].White

            if(spoiler){
                petimage = petdb.Pets["mini miata"].WhiteSpoiler

            }
        }
 
        let embed = new Discord.MessageEmbed()
        .setTitle(`Your Pet`)
        .addField("Name", `${name}`, true)
        .addField("Status", "Looking for items", true)

        .addField("Condition", `${condition}`, true)
        .addField("Gas", `${gas}`, true)
        .addField("Oil", `${oil}`, true)
        .addField("Love", `${love}`, true)
        .setThumbnail(petimage)
        .setColor("#60b0f4")

        let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel("Drive")
            .setEmoji("🚗")
            .setCustomId("drive")
            .setStyle("SECONDARY"),
            new MessageButton()
            .setLabel("Change Oil")
            .setEmoji("🛢️")
            .setCustomId("oil")
            .setStyle("SECONDARY"),
            new MessageButton()
            .setLabel("Fill Gas")
            .setEmoji("⛽")
            .setCustomId("gas")
            .setStyle("SECONDARY"),
            new MessageButton()
            .setLabel("Wash")
            .setEmoji("🧼")
            .setCustomId("wash")
            .setStyle("SECONDARY"),
            new MessageButton()
            .setLabel("Change Name")
            .setEmoji("📝")
            .setCustomId("name")
            .setStyle("SECONDARY"),
            )
            
            let row2 = new MessageActionRow()
            .addComponents(
                
                new MessageButton()
                .setLabel("Paint")
                .setEmoji("🖌️")
                .setCustomId("paint")
                .setStyle("SECONDARY"),
            new MessageButton()
            .setLabel("Send Racing")
            .setEmoji("🏁")
            .setCustomId("race")
            .setStyle("SECONDARY")
        )
       
        let msg = await interaction.reply({embeds: [embed], components: [row, row2], fetchReply: true})

     
    
        let filter = (btnInt) => {
          return interaction.user.id === btnInt.user.id
      }
     
      let collector = msg.createMessageComponentCollector({
          filter: filter
      })
      
      collector.on('collect', async (i, user) => {
        
        if(i.customId.includes("drive")){

            let pet = db.fetch(`pet_${interaction.user.id}`)
            let condition = db.fetch(`pet_${interaction.user.id}.Condition`)
        let gas = db.fetch(`pet_${interaction.user.id}.Gas`)
        let oil = db.fetch(`pet_${interaction.user.id}.Oil`)
        let love = db.fetch(`pet_${interaction.user.id}.Love`)

        
        if(love < 100){
                db.add(`pet_${interaction.user.id}.Love`, 10)
                if(db.fetch(`pet_${interaction.user.id}.Love`) >= 100){
                    db.set(`pet_${interaction.user.id}.Love`, 100)
                }
                
            }
         love = db.fetch(`pet_${interaction.user.id}.Love`)

            let embed = new Discord.MessageEmbed()
            .setTitle(`Your Pet`)
            .addField("Name", `${name}`, true)
            .addField("Status", "Looking for items", true)
    
            .addField("Condition", `${condition}`, true)
            .addField("Gas", `${gas}`, true)
            .addField("Oil", `${oil}`, true)
            .addField("Love", `${love}`, true)
            .setThumbnail(petimage)
            .setColor("#60b0f4")
                i.update({content: `You drove your pet car and gave it love!`, embeds: [embed]})

        }
        else if(i.customId.includes("gas")){

            let pet = db.fetch(`pet_${interaction.user.id}`)
            let condition = db.fetch(`pet_${interaction.user.id}.Condition`)
        let gas = db.fetch(`pet_${interaction.user.id}.Gas`)
        let oil = db.fetch(`pet_${interaction.user.id}.Oil`)
        let love = db.fetch(`pet_${interaction.user.id}.Love`)

        if(gas < 100){
            db.set(`pet_${interaction.user.id}.Gas`, 100)
              
                
            }
         gas = db.fetch(`pet_${interaction.user.id}.Gas`)

         let embed = new Discord.MessageEmbed()
         .setTitle(`Your Pet`)
            .addField("Name", `${name}`, true)
            .addField("Status", "Looking for items", true)
    
            .addField("Condition", `${condition}`, true)
            .addField("Gas", `${gas}`, true)
            .addField("Oil", `${oil}`, true)
            .addField("Love", `${love}`, true)
            .setThumbnail(petimage)
            .setColor("#60b0f4")
            i.update({content: `You filled your pets gas costing you $2000`, embeds: [embed]})
            db.subtract(`cash_${i.user.id}`, 2000)

        }
        else if(i.customId.includes("oil")){

            let pet = db.fetch(`pet_${interaction.user.id}`)
            let condition = db.fetch(`pet_${interaction.user.id}.Condition`)
        let gas = db.fetch(`pet_${interaction.user.id}.Gas`)
        let oil = db.fetch(`pet_${interaction.user.id}.Oil`)
        let love = db.fetch(`pet_${interaction.user.id}.Love`)

        
        if(oil < 100){
                db.set(`pet_${interaction.user.id}.Oil`, 100)
              
                
            }
            oil = db.fetch(`pet_${interaction.user.id}.Oil`)

            let embed = new Discord.MessageEmbed()
            .setTitle(`Your Pet`)
            
        .addField("Name", `${name}`, true)
            .addField("Status", "Looking for items", true)
    
            .addField("Condition", `${condition}`, true)
            .addField("Gas", `${gas}`, true)
            .addField("Oil", `${oil}`, true)
            .addField("Love", `${love}`, true)
            .setThumbnail(petimage)
            .setColor("#60b0f4")
                i.update({content: `You changed your pets oil costing you $500`, embeds: [embed]})

                db.subtract(`cash_${i.user.id}`, 500)

        }
        else if(i.customId.includes("wash")){

            let pet = db.fetch(`pet_${interaction.user.id}`)
            let condition = db.fetch(`pet_${interaction.user.id}.Condition`)
        let gas = db.fetch(`pet_${interaction.user.id}.Gas`)
        let oil = db.fetch(`pet_${interaction.user.id}.Oil`)
        let love = db.fetch(`pet_${interaction.user.id}.Love`)

          
        if(condition < 100){
            db.add(`pet_${interaction.user.id}.Condition`, 25)
            if(db.fetch(`pet_${interaction.user.id}.Condition`) >= 100){
                db.set(`pet_${interaction.user.id}.Condition`, 100)
            }
            
        }
            condition = db.fetch(`pet_${interaction.user.id}.Condition`)

            let embed = new Discord.MessageEmbed()
            .setTitle(`Your Pet`)
            
        .addField("Name", `${name}`, true)
            .addField("Status", "Looking for items", true)
    
            .addField("Condition", `${condition}`, true)
            .addField("Gas", `${gas}`, true)
            .addField("Oil", `${oil}`, true)
            .addField("Love", `${love}`, true)
            .setThumbnail(petimage)
            .setColor("#60b0f4")
                i.update({content: `You washed your pet`, embeds: [embed]})

        }
        else if(i.customId.includes("name")){

            let pet = db.fetch(`pet_${interaction.user.id}`)
            let name = db.fetch(`pet_${interaction.user.id}.Name`)

            i.channel.send(`Type the name you want to set`)
        
            const filter2 = (m = discord.Message) => {
                return m.author.id === interaction.user.id
            }
            let collector2 = interaction.channel.createMessageCollector({
                filter: filter2,
                max: 1,
                time: 1000 * 20
            })
            let nametoset
            collector2.on('collect', msg => {
             nametoset = msg.content

             db.set(`pet_${interaction.user.id}.Name`, nametoset)

             name = db.fetch(`pet_${interaction.user.id}.Name`)
             let embed = new Discord.MessageEmbed()
             .setTitle(`Your Pet`)
             .addField("Name", `${name}`, true)
             .addField("Status", "Looking for items", true)
     
             .addField("Condition", `${condition}`, true)
             .addField("Gas", `${gas}`, true)
             .addField("Oil", `${oil}`, true)
             .addField("Love", `${love}`, true)
             .setThumbnail(petimage)
             .setColor("#60b0f4")
                 i.update({content: `You changed your pets name`, embeds: [embed]})
            })


        }

        else if(i.customId.includes("paint")){

            let row3 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("black")
                .setEmoji("⚫")
                .setStyle("SECONDARY"),
                new MessageButton()
                .setCustomId("red")
                .setEmoji("🔴")
                .setStyle("SECONDARY"),
                new MessageButton()
                .setCustomId("white")
                .setEmoji("⚪")
                .setStyle("SECONDARY"),
                new MessageButton()
                .setCustomId("blue")
                .setEmoji("🔵")
                .setStyle("SECONDARY"),
            )

           let msg = await i.update({components: [row, row3], fetchReply: true})

           let filter3 = (btnInt) => {
            return interaction.user.id === btnInt.user.id
        }
       
        let collector3 = msg.createMessageComponentCollector({
            filter: filter3
        })

        collector3.on('collect', async(i, user) => {
            if(i.customId.includes("black")){
                db.set(`pet_${i.user.id}.Color`, "Black")
                let spoiler = db.fetch(`pet_${i.user.id}.Spoiler`)
                if(!spoiler){
                    embed.setThumbnail(petdb.Pets["mini miata"].Black)

                }
                else{
                    embed.setThumbnail(petdb.Pets["mini miata"].BlackSpoiler)

                }
                i.update({embeds: [embed]})
            }
            else if(i.customId.includes("red")){
                db.set(`pet_${i.user.id}.Color`, "Red")
                let spoiler = db.fetch(`pet_${i.user.id}.Spoiler`)
                if(!spoiler){
                    embed.setThumbnail(petdb.Pets["mini miata"].Red)

                }
                else{
                    embed.setThumbnail(petdb.Pets["mini miata"].RedSpoiler)

                }
                i.update({embeds: [embed]})
            }
            else if(i.customId.includes("blue")){
                db.set(`pet_${i.user.id}.Color`, "Blue")
                let spoiler = db.fetch(`pet_${i.user.id}.Spoiler`)
                if(!spoiler){
                    embed.setThumbnail(petdb.Pets["mini miata"].Blue)

                }
                else{
                    embed.setThumbnail(petdb.Pets["mini miata"].BlueSpoiler)

                }
                i.update({embeds: [embed]})
            }
            else if(i.customId.includes("white")){
                db.set(`pet_${i.user.id}.Color`, "White")
                let spoiler = db.fetch(`pet_${i.user.id}.Spoiler`)
                if(!spoiler){
                    embed.setThumbnail(petdb.Pets["mini miata"].White)

                }
                else{
                    embed.setThumbnail(petdb.Pets["mini miata"].WhiteSpoiler)

                }
                i.update({embeds: [embed]})
            }
        })
        }

        else if(i.customId.includes("race")){
            let timetorace = db.fetch(`pet_${interaction.user.id}.Racing`)
            let timeout = 600000
            if (timetorace !== null && timeout - (Date.now() - timetorace) > 0) {
                let time = ms(timeout - (Date.now() - timetorace));
    
                i.update({content: `You've already sent your pet racing\n\nRace again in ${time}.`})
            }
            else{
                let gas = db.fetch(`pet_${interaction.user.id}.Gas`)
                if(gas <= 0) return interaction.reply(`Your pet is out of gas!`)
            db.subtract(`pet_${interaction.user.id}.Gas`, 10)
            db.set(`pet_${interaction.user.id}.Racing`, Date.now())
            db.set(`pet_${interaction.user.id}.RacingItems`, [])

            let rewardrange = randomRange(0, 5)
            let rewards = ["t2tires", "pet spoiler", "bank increase", "water bottle"]

            
            let ranreward = lodash.sample(rewards)
            
            
            i.update({content: `You sent your pet racing for 10 minutes`})
            
            setTimeout(() => {
                     
                                 db.push(`pet_${interaction.user.id}.RacingItems`, ranreward)
                                 db.push(`pet_${interaction.user.id}.RacingItems`, `${rewardrange} Xessence`)
                                 i.channel.send({content: `${i.user}, Your pet returned with ${rewardrange} Xessence, and a ${ranreward}`})
                                 db.add(`xessence_${i.user.id}`, rewardrange)
                                 
                                 if(partdb.Parts[ranreward.toLowerCase()]){
                                    db.push(`parts_${i.user.id}`, ranreward)
                                 }
                                 else if(itemdb.Other[ranreward.toLowerCase()]){
                                    db.push(`items_${i.user.id}`, ranreward)
                                 }
                                 else if(itemdb.Multiplier[ranreward.toLowerCase()]){
                                    db.push(`items_${i.user.id}`, ranreward)
                                 }
                                 else if(itemdb.Collectable[ranreward.toLowerCase()]){
                                    db.push(`items_${i.user.id}`, ranreward)
                                 }

                 }, 10000);
                }

        }


    })
        
        
        
          function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    
}


function randomRange(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  }