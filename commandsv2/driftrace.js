const db = require('quick.db')
const lodash = require('lodash')
const ms = require('pretty-ms')
const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageActionRow, MessageButton} = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drift")
    .setDescription("Drift your car")
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
        let moneyearned = 200
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

            
      
          
           db.set(`drifting_${user.id}`, Date.now())
           let drifttraining = db.fetch(`driftrank_${user.id}`) || 1
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
            let time
            let ticketsearned 
            let notearned 
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
            let energydrink = db.fetch(`energydrink_${interaction.user.id}`)
            let energytimer = db.fetch(`energytimer_${interaction.user.id}`)
            let energydrink2
            if(energydrink){
              let timeout = 600000
              if (timeout - (Date.now() - energytimer) > 0) {          
                console.log("no energy")
              } else {
                  db.set(`energydrink_${interaction.user.id}`, false)
              }
               energydrink2 = db.fetch(`energydrink_${interaction.user.id}`)
    
            }
            if(energydrink2 == true){
              ticketsearned = ticketsearned * 2
            }
            let sponsor = db.fetch(`sponsor_${interaction.user.id}`)
            let sponsortimer = db.fetch(`sponsortimer_${interaction.user.id}`)
            let sponsor2
            if(sponsor){
              let timeout = 600000
              if (timeout - (Date.now() - sponsortimer) > 0) {          
                console.log("no energy")
              } else {
                  db.set(`sponsor_${interaction.user.id}`, false)
              }
              sponsor2 = db.fetch(`sponsor_${interaction.user.id}`)
    
            }
            if(sponsor2 == true){
              moneyearned = moneyearned * 2
            }
    
            let parts = require('../partsdb.json')
            let tires = db.fetch(`${cars.Cars[car.toLowerCase()].Name}tires_${interaction.user.id}`) || 'Stock Tires'
            let numb = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_number`) || 0
            let tread = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`) 
            let tirescore
            if(tires == "Stock Tires" || !tires){
                tirescore = 0
            }
            let drifttires = ["T1DriftTires", "T2DriftTires", "T3DriftTires", "BM1DriftTires", "T4DriftTires", "T5DriftTires"]
            if(!drifttires.includes(tires)) return interaction.reply("Your car needs drift tires to drift!")
            if(drifttires.includes(tires) && !tread){
                db.set(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`, parts.Parts[tires.toLowerCase()].Tread) 
                
                tirescore = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`) 
            }
            else {
                tirescore = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`) 
            }

            
            let newtirescore = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`) 
            if(newtirescore <= 0) return interaction.reply(`Your tires are out of tread!`)
            console.log(`Score: ${tirescore}`)
            let newrank = drifttraining * 2

            let formula = (driftscore* drifttraining)
            formula += handling
            formula += newtirescore
            
      
             console.log(formula)
               
        
            let tracklength
            let trackname
            let trackgifs
            let trackgif
             let optiontrack = interaction.options.getString("track")
             switch(optiontrack){
                 case "regular":
                      tracklength = 9000
                      trackname = "Regular"
                      trackgifs = ["https://media1.giphy.com/media/o6S51npJYQM48/giphy.gif", "https://c.tenor.com/BMmhBsA6GgUAAAAd/drift-drifting.gif"]
                      trackgif = lodash.sample(trackgifs)
                 break;
                 case "mountain":
                      tracklength = 10000
                      trackname = "Mountains"
                      trackgifs = ["https://i.makeagif.com/media/3-16-2016/IAMsw-.gif", "https://c.tenor.com/NhopGWhSG0AAAAAC/mustang-drift.gif"]
                      trackgif = lodash.sample(trackgifs)

                 break;
                 case "parking":
                      tracklength = 15000
                      trackname = "Parking Lot"
                      trackgifs = ["https://i.gifer.com/7azI.gif", "https://c.tenor.com/bxYLMS8pmqAAAAAC/dk-nissan.gif"]
                      trackgif = lodash.sample(trackgifs)

                 break;
             }
             let notorietyearned = (driftscore * 5) - time
         
      
      
             let embed = new discord.MessageEmbed()
             .setTitle(`Drifting around the ${track} ${trackname} track`)
             .setDescription(`You have ${time}s to complete the track`)
             .addField(`Your ${cars.Cars[car].Name}'s Stats`, `Speed: ${usercarspeed}\n\nDrift Rating: ${driftscore}\n\nTire Tread: ${newtirescore}`)
             .addField("Your Drift Rank", `${drifttraining}`)
           
  .setColor("#60b0f4")            
   .setImage(`${trackgif}`)
             .setThumbnail("https://i.ibb.co/XzW37RH/drifticon.png")
             
             
             let row = new MessageActionRow()
             .addComponents(
                 new MessageButton()
                 .setCustomId("ebrake")
                 .setEmoji("<:ebrake:969671303961387050>")
                 .setLabel("Handbrake")
                 .setStyle("SECONDARY"),
            
                 
                 )
                 const filter = (btnInt) => {
                   return interaction.user.id === btnInt.user.id
               }
       
               
               let rns = [1000, 2000, 3000, 4000, 5000]
               
               let randomnum = lodash.sample(rns)
               let canshift = false
               const collector = interaction.channel.createMessageComponentCollector({
                   filter,
                   time: 10000,
               })
               setTimeout(() => {
                   embed.addField("\u200b", "Shift now!")
                   interaction.editReply({embeds: [embed]})
                   canshift = true
                   setTimeout(() => {
                       canshift = false
                       
                   }, 3000);
                   
                  
                  
                     let userid = user.id
       
       
               
       
                     collector.on('end', async collected => {
                        if(collected.size == 0 && canshift == false){
                          formula = formula / 2
                        }
                    })
                    
               }, randomnum);
        interaction.reply({ embeds: [embed], components: [row]}).then(async emb => {
       
          collector.on('collect', async (i) => {
            if(i.customId.includes("ebrake")){
             if(canshift == false) {
                interaction.channel.send(`You pulled the handbrake at the wrong time!`)
                formula = formula / 2
            }
           
            else if(canshift == true){
                embed.setDescription("Drifting!!!")

                await i.update({embeds: [embed]})
                
                
            }
 
       
            }
        
          })

          collector.on('end', async collected => {

          })
       
          
        
       
        })
             
        
           
            
            
             let y = setInterval(() => {
                time -= 1
             }, 1000);
             
             let x = setInterval(() => {
                 tracklength -= formula
                 console.log(`formula: ${formula}`)
                console.log(tracklength)
      
                if(time == 0 && tracklength >= 0){
                    let randomsub = randomRange(2, 10)
                    db.subtract(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`, randomsub) 
                    let newtread = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`)
                    embed.addField("Results", `Failed\n\nTread: ${newtread}`)
                    interaction.editReply({embeds: [embed]})
                    if(range){
                        db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)

                    }
                    db.add(`driftxp_${user.id}`, 10)
                    if(range){
                        db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)
                        db.add(`batteries_${user.id}`, 1)

                    }
                    let driftxp = db.fetch(`driftxp_${user.id}`)
                    if(driftxp >= requiredrank){
                        if(db.fetch(`driftrank_${user.id}`) < 50){
                            db.add(`driftrank_${user.id}`, 1)
                            interaction.channel.send(`${user}, you just ranked up your drift skill to ${db.fetch(`driftrank_${user.id}`)}!`)
      
                        }
                    }
                    clearInterval(x)
                    clearInterval(y)
                    
                    return;
                } 
                if(tracklength <= 0){
                    let randomsub = randomRange(2, 10)
                    db.subtract(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`, randomsub) 
                    let newtread = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${parts.Parts[tires.toLowerCase()].Name}tread_${interaction.user.id}_${numb}`)
                    embed.addField("Results", `Success\n\nTread: ${newtread}`)
                    if(db.fetch(`doublecash`) == true){
                        moneyearned = moneyearned += moneyearned
                        embed.addField("Double Cash Weekend!", `\u200b`)
                    }
                    embed.addField("Earnings", `$${moneyearned}\n${notorietyearned} Notoriety`)
                    if(cars.Cars[selected].StatTrack){
                      db.add(`${cars.Cars[selected].Name}driftwins_${interaction.user.id}`, 1)
                    }
                    interaction.editReply({embeds: [embed]})
                    db.add(`cash_${user.id}`, moneyearned)
                    db.add(`rp_${user.id}`, ticketsearned)
                    db.add(`notoriety3_${interaction.user.id}`, notorietyearned)

                    db.add(`driftxp_${user.id}`, 25)

                    let driftxp = db.fetch(`driftxp_${user.id}`)
                    if(driftxp >= requiredrank){
              
                            db.add(`driftrank_${user.id}`, 1)
                            interaction.channel.send(`${user}, you just ranked up your drift skill to ${db.fetch(`driftrank_${user.id}`)}!`)
      
                        
                    }
                    
                    clearInterval(x)
                    clearInterval(y)

                    return;
                }
      
             
                
      
              }, 1000);
        
    }
    
  }  
  
  function randomRange(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  }
  