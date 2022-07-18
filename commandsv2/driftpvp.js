const db = require('quick.db')
const lodash = require('lodash')
const ms = require('pretty-ms')
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("driftpvp")
    .setDescription("Drift your car against another user")
    .addUserOption((option) => option
    .setName("user")
    .setDescription("The user to race")
    .setRequired(true)
    )
    .addStringOption((option) => option
    .setName("difficulty")
    .setDescription("The track difficulty")
    .setRequired(true)
    .addChoice('Easy', 'easy')
    .addChoice('Medium', 'medium')
    .addChoice('Hard', 'hard')
    )
    .addStringOption((option) => option
    .setName("track")
    .setDescription("The track you want to drift on")
    .setRequired(true)
    .addChoice('Regular', 'regular')
    .addChoice('Mountain', 'mountain')
    .addChoice('Parking Lot', 'parking')
    )
    .addStringOption((option) => option
    .setName("car")
    .setDescription("The car id to use")
    .setRequired(true)
    ),
    async execute(interaction) {

        const discord = require("discord.js");
        const cars = require('../cardb.json');
        let tracks = ['easy', 'medium', 'hard']
        let moneyearned = 100
        let user = interaction.user;
        let track = interaction.options.getString("difficulty")
        if(!track) return interaction.reply("You need to select a track! Example: /drift [id] [difficulty]. The current difficulties are: Easy, Medium, Hard")
        if(!tracks.includes(track.toLowerCase())) return interaction.reply("You need to select a track! Example: /drift [id] [difficulty]. The current difficulties are: Easy, Medium, Hard")
        let idtoselect = interaction.options.getString("car")
            if(!idtoselect) return interaction.reply("Specify an id!")
            let selected = db.fetch(`selected_${idtoselect}_${user.id}`)
            if(!selected) {
                let errembed = new discord.MessageEmbed()
                .setTitle("Error!")
                .setColor("DARK_RED")
                .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
                return  interaction.reply({embeds: [errembed]})
            }
            let car = selected
            let driftxp = db.fetch(`driftxp_${user.id}`)
        if(!car) return interaction.reply("You need to select a car! Example: /ids select [car]")
        let user1cars = db.fetch(`cars_${user.id}`)
        if (!user1cars) returninteraction.reply("You dont have any cars!")
        if(!cars.Cars[car.toLowerCase()]) return interaction.reply("Thats not a car!")
        if (!user1cars.some(e => e.includes(car.toLowerCase()))) return interaction.reply(`You need to enter the car you want to drift with. E.g. \`drift [car]\`\nYour current cars: ${user1cars.join(' ')}`)
            let driftscore = db.fetch(`${cars.Cars[car.toLowerCase()].Name}drift_${user.id}`) 
            let usercarspeed = db.fetch(`${cars.Cars[car.toLowerCase()].Name}speed_${user.id}`)
            let handling = db.fetch(`${cars.Cars[car.toLowerCase()].Name}handling_${user.id}`) 

            if(driftscore <= 0) return interaction.reply("You try drifting but your drift rating is too low, so you swerve out and crash.")
            let timeout = db.fetch(`timeout_${interaction.user.id}`) ||  45000
            let racing = db.fetch(`drifting_${user.id}`)
            if (racing !== null && timeout - (Date.now() - racing) > 0) {
                let time = ms(timeout - (Date.now() - racing), {compact: true});
              
                return interaction.reply(`Please wait ${time} before drifting again.`)
              } 

            let user2 = interaction.options.getUser("user")
            interaction.reply(`${user2}, what car do you wish to drift with ${user} in?`)
            const filter2 = (m = discord.Message) => {
                return m.author.id === user2.id
            }
            let collector = interaction.channel.createMessageCollector({
                filter: filter2,
                max: 1,
                time: 1000 * 30
            })
            let selected2
            let user2carchoice
            let driftscore2 
            let drifttraining2
            collector.on('collect', msg => {
        
                user2carchoice = msg.content
             if(!user2carchoice) return interaction.reply("Specify an id! Use /ids select [id] [car] to select a car!")
              selected2 = db.fetch(`selected_${user2carchoice}_${msg.author.id}`)
              if(!selected2) {
               let errembed = new discord.MessageEmbed()
               .setTitle("Error!")
               .setColor("DARK_RED")
               .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
               return  msg.reply({embeds: [errembed]})
           }
               let restoration2 = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}restoration_${msg.author.id}`)
               if(cars.Cars[selected2.toLowerCase()].Junked && restoration2 < 100){
                   return msg.reply("This car is too junked to drift, sorry!")
               }
                drifttraining2 = db.fetch(`driftrank_${user2.id}`) || 0
                driftscore2 =  db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}drift_${user2.id}`) 
               user2carchoice = selected2.toLowerCase()
           })

           collector.on('end', async () => {
            if (!user2carchoice) return interaction.channel.send("They didn't answer in time!")
            if(!selected2) return interaction.channel.send("They didn't answer in time!")
      
          
           db.set(`drifting_${user.id}`, Date.now())
           db.set(`drifting2_${user.id}`, Date.now())

           let drifttraining = db.fetch(`driftrank_${user.id}`) || 0
           if(!db.fetch(`driftrank_${user.id}`)) {
            db.set(`driftrank_${user.id}`, 1)
           }
           let range = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`)
           if(cars.Cars[selected.toLowerCase()].Electric){
             if(range <= 0){
               return interaction.reply("Your EV is out of range! Run /charge to charge it!")
             }
           }
           let requiredrank = drifttraining * 150
           let requiredrank2 = drifttraining2 * 150

            let time
            let ticketsearned 
            switch(track){
                case "easy":{
                    time = 15
                    ticketsearned = 2
                    break;
                }
                case "medium":{
                    time = 10
                    moneyearned += 250
                    ticketsearned = 4
                    break;
                }
                case "hard":{
                    time = 5
                    moneyearned += 500
                    ticketsearned = 6
                    break;
                }
            }
            let parts = require('../partsdb.json')
            let tires = db.fetch(`${cars.Cars[car.toLowerCase()].Name}tires_${interaction.user.id}`) || 'Stock Tires'
            let numb = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_number`) || 0
            let tread = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`) 
            let tires2 = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}tires_${user2.id}`) || 'Stock Tires'
            let numb2 = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}_${parts.Parts[tires2.toLowerCase()].Name}tread_${user2.id}_number`) || 0
            let tread2 = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}_${parts.Parts[tires2.toLowerCase()].Name}tread_${user2.id}_${numb2}`) 
            let tirescore
            if(tires == "Stock Tires" || !tires){
                tirescore = 0
            }
            let tirescore2
            if(tires2 == "Stock Tires" || !tires2){
                tirescore2 = 0
            }
            let drifttires = ["T1DriftTires", "T2DriftTires", "T3DriftTires", "BM1DriftTires", "T4DriftTires", "T5DriftTires"]
            if(!drifttires.includes(tires)) return interaction.reply(`${user}, Your car needs drift tires to drift!`)
            if(!drifttires.includes(tires2)) return interaction.reply(`${user2}, your car needs drift tires to drift!`)
            if(drifttires.includes(tires) && !tread){
                db.set(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`, parts.Parts[tires.toLowerCase()].Tread) 
                
                tirescore = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`) 
            }
            else {
                tirescore = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`) 
            }

            if(drifttires.includes(tires2) && !tread2){
                db.set(`${cars.Cars[selected2.toLowerCase()].Name}_${parts.Parts[tires2.toLowerCase()].Name}tread_${user2.id}_${numb2}`, parts.Parts[tires2.toLowerCase()].Tread) 
                
                tirescore2 = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}_${parts.Parts[tires2.toLowerCase()].Name}tread_${user2.id}_${numb2}`) 
            }
            else {
                tirescore2 = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}_${parts.Parts[tires2.toLowerCase()].Name}tread_${user2.id}_${numb2}`) 
            }


            let newtirescore = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`) 
            let newtirescore2 = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}_${parts.Parts[tires2.toLowerCase()].Name}tread_${user2.id}_${numb2}`) 
            let handling2 = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}handling_${user2.id}`) || 0
            let usercarspeed2 = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}speed_${user2.id}`) || 0

            if(newtirescore <= 0) return interaction.reply(`${user}, your tires are out of tread!`)
            if(newtirescore2 <= 0) return interaction.reply(`${user2}, your tires are out of tread!`)

            console.log(`Score: ${tirescore}`)
            let newrank = drifttraining * 2
            let newrank2 = drifttraining2 * 2

            let formula = (driftscore * drifttraining) + handling + newtirescore
            let formula2 = (driftscore2 * drifttraining2) + handling2 + newtirescore2

            
      
             console.log(formula)
             console.log(formula2)

        
            let tracklength
            let tracklength2

            let trackname
            let trackgifs
            let trackgif
             let optiontrack = interaction.options.getString("track")
             switch(optiontrack){
                 case "regular":
                    tracklength2 = 9000
                      tracklength = 9000
                      trackname = "Regular"
                      trackgifs = ["https://media1.giphy.com/media/o6S51npJYQM48/giphy.gif", "https://c.tenor.com/BMmhBsA6GgUAAAAd/drift-drifting.gif"]
                      trackgif = lodash.sample(trackgifs)
                 break;
                 case "mountain":
                      tracklength = 10000
                      tracklength2 = 10000

                      trackname = "Mountains"
                      trackgifs = ["https://i.makeagif.com/media/3-16-2016/IAMsw-.gif", "https://c.tenor.com/NhopGWhSG0AAAAAC/mustang-drift.gif"]
                      trackgif = lodash.sample(trackgifs)

                 break;
                 case "parking":
                      tracklength = 15000
                      tracklength2 = 15000
                      trackname = "Parking Lot"
                      trackgifs = ["https://i.gifer.com/7azI.gif", "https://c.tenor.com/bxYLMS8pmqAAAAAC/dk-nissan.gif"]
                      trackgif = lodash.sample(trackgifs)

                 break;
             }
             let notorietyearned = driftscore * 5
             let notorietyearned2 = driftscore2 * 5

             let tireemote = "<:emote_tire:972679434500988969>"
             let speedemote = "<:emote_spedo:972678048707117066>"
             let driftemote = "<:emote_drift:972678055283810315>"

             let embed = new discord.MessageEmbed()
             .setTitle(`Drifting around the ${track} ${trackname} track with ${user2.username}`)
             .setDescription(`You have ${time}s to complete the track`)
             .addField(`${user.username}'s ${cars.Cars[car].Name}'s Stats`, `${speedemote} Speed: ${usercarspeed}\n${driftemote} Drift Rating: ${driftscore}\n${tireemote} Tire Tread: ${newtirescore}\nHandling: ${handling}`)
             .addField(`${user2.username}'s ${cars.Cars[selected2].Name}'s Stats`, `${speedemote} Speed: ${usercarspeed2}\n${driftemote} Drift Rating: ${driftscore2}\n${tireemote} Tire Tread: ${newtirescore2}\nHandling: ${handling2}`)

             .addField(`${user.username}'s Drift Rank`, `${drifttraining}`, true)
             .addField(`${user2.username}'s Drift Rank`, `${drifttraining2}`, true)

  .setColor("#60b0f4")
             .setImage(`${trackgif}`)
             .setThumbnail("https://i.ibb.co/XzW37RH/drifticon.png")
             
             
            interaction.editReply({embeds: [embed]})

            
            
             let y = setInterval(() => {
                time -= 1
             }, 1000);
             
             let x = setInterval(() => {
                 tracklength -= formula
                 tracklength2 -= formula2
                 console.log(`formula: ${formula}`)
                console.log(tracklength)
      
                if(tracklength <= 0 && time != 0){
                     embed.setImage("")
                     embed.addField("Results", `${user.username} Won!\n\nNotoriety Earned: 50`)
                     interaction.editReply({embeds: [embed]})
                     if(cars.Cars[selected].StatTrack){
                        db.add(`${cars.Cars[selected].Name}dpvpwins_${user.id}`, 1)
                      }
                     db.add(`notoriety3_${user.id}`, 50)
                     db.add(`driftxp_${user.id}`, 25)
                   
                     if(db.fetch(`driftxp_${user.id}`) >= requiredrank){
          
                             db.add(`driftrank_${user.id}`, 1)
                             interaction.channel.send(`${user}, you just ranked up your drift skill to ${db.fetch(`driftrank_${user.id}`)}!`)
       
                         
                     }
                    clearInterval(x)
                    clearInterval(y)
                    return;
                }
                else if(tracklength2 <= 0 && time != 0){
                    embed.setImage("")
                    embed.addField("Results", `${user2.username} Won!\n\nNotoriety Earned: 50`)
                    interaction.editReply({embeds: [embed]})
                    if(cars.Cars[selected2].StatTrack){
                        db.add(`${cars.Cars[selected2].Name}dpvpwins_${user2.id}`, 1)
                      }
                    db.add(`notoriety3_${user2.id}`, 50)
                    db.add(`driftxp_${user2.id}`, 25)
                
                    if(db.fetch(`driftxp_${user2.id}`) >= requiredrank2){
                    
                            db.add(`driftrank_${user2.id}`, 1)
                            interaction.channel.send(`${user2}, you just ranked up your drift skill to ${db.fetch(`driftrank_${user2.id}`)}!`)
      
                        
                    }
                 clearInterval(x)
                 clearInterval(y)
                 return;
                }
                else if(time == 0 && !tracklength <= 0 && !tracklength2 <= 0){
                    embed.setImage("")
                    embed.addField("Results", `Both failed`)
                    interaction.editReply({embeds: [embed]})
                    clearInterval(x)
                    clearInterval(y)
                }
      
             
                
      
              }, 1000);

            })
        
    }
    
  }  
  
  function randomRange(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  }
  