const lodash = require('lodash')
const ms = require('pretty-ms');
const discord = require('discord.js')

const {SlashCommandBuilder} = require('@discordjs/builders')
const User = require('../schema/profile-schema')
const Cooldowns = require('../schema/cooldowns')
const partdb = require('../partsdb.json')
const Global = require('../schema/global-schema')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("qm")
    .setDescription("Race a bot on the quarter mile")
    .addStringOption((option) => option
    .setName("tier")
    .setDescription("The bot tier to race")
    .setRequired(true)
    .addChoice('Tier 1', '1')
    .addChoice('Tier 2', '2')
    .addChoice('Tier 3', '3')
    .addChoice('Tier 4', '4')
    .addChoice('Tier 5', '5')
    .addChoice('Tier 6', '6')
    .addChoice('Tier 7', '7')

    )
    .addStringOption((option) => option
    .setName("car")
    .setDescription("The car id to use")
    .setRequired(true)
    ),
    async execute(interaction) {
        
        const db = require("quick.db");

            const cars = require('../cardb.json');
            let moneyearned = 75
            let moneyearnedtxt = 75
            let uid = interaction.user.id
            let idtoselect = interaction.options.getString("car")
            let userdata = await User.findOne({id: interaction.user.id})
            let cooldowndata = await Cooldowns.findOne({id: interaction.user.id})|| new Cooldowns({id: interaction.user.id})
            let globaldata = await Global.findOne({})

            if(!idtoselect) return interaction.reply("Specify an id! Use /ids select [id] [car] to select a car!")
            let filteredcar = userdata.cars.filter(car => car.ID == idtoselect);
            let selected = filteredcar[0] || 'No ID'
            if(selected == "No ID") {
              let errembed = new discord.MessageEmbed()
              .setTitle("Error!")
              .setColor("DARK_RED")
              .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
              return  interaction.reply({embeds: [errembed]})
          }
          
            let user = interaction.user;
            let bot = interaction.options.getString("tier")
            let botlist = ['1', '2', '3', '4', '5', '6', '7']
            let timeout 
            if(!userdata.patron || !userdata.patron.tier){
              timeout = 45000
            }
            else if(userdata.patron && userdata.patron.tier == 1){
              timeout = 30000
            }
            else if(userdata.patron && userdata.patron.tier == 2){
              timeout = 15000
            }
            else if(userdata.patron && userdata.patron.tier == 3){
              timeout = 5000
            }
            else if(userdata.patron && userdata.patron.tier == 4){
              timeout = 5000
            }
            let botcar = null
            let racing = cooldowndata.racing
            let prestige = userdata.prestige
            if(prestige < 1) return interaction.reply("You need to be prestige 1 to do this race!")
            if (racing !== null && timeout - (Date.now() - racing) > 0) {
                let time = ms(timeout - (Date.now() - racing), {compact: true});
              
                return interaction.reply(`Please wait ${time} before racing again.`)
              } 
            let user1cars = db.fetch(`cars_${user.id}`)
            let bot1cars = ['1995 mazda miata', '1991 toyota mr2', '2002 pontiac firebird', '2002 ford mustang', '2005 hyundai tiburon']
            let bot2cars = ['2014 hyundai genesis coupe', '2008 nissan 350z', '2008 nissan 350z', '2010 ford mustang']
            let bot3cars = ['2020 porsche 718 cayman', '2015 lotus exige sport', '2011 audi rs5']
            let bot4cars = ['2015 mercedes amg gts', '2016 alfa romeo giulia', '2021 porsche 911 gt3', '2017 ford gt']
            let bot5cars = ['2010 ferrari 458 italia', '2018 lamborghini aventador s', '2016 aston martin vulkan', '2021 mclaren 720s']
            let bot6cars = [
                "2021 ferrari sf90 stradale",
                "2022 aston martin valkyrie",
                "2016 bugatti chiron",
                "2008 bugatti veyron",
                "2021 mclaren 720s",
                "2016 aston martin vulkan",
                "2013 mclaren p1"
              ];
              let bot7cars = [
                "2021 bugatti bolide",
                "2013 lamborghini veneno",
                "2020 koenigsegg regera",
                "2020 bugatti divo"
              ];

            let errorembed = new discord.MessageEmbed()
            .setTitle("❌ Error!")
            .setColor("#60b0f4")
            if (!user1cars) {
                errorembed.setDescription("You dont have any cars!")
                return interaction.reply({embeds: [errorembed]})
            }
                
            if (!bot){
                errorembed.setDescription("Please specify  the tier you want to race. Tiers available: 1, 2, 3, 4, 5, and 6")
                 return interaction.reply({embeds: [errorembed]})
            }



    
 
           
    
            if(cars.Cars[selected.Name.toLowerCase()].Junked){
                return interaction.reply("This car is too junked to race, sorry!")
            }
            let ticketsearned
            let ckeysearned
            let rkeysearned
            let ekeysearned
            let range = selected.Range
            if(cars.Cars[selected.Name.toLowerCase()].Electric){
              if(range <= 0){
                return interaction.reply("Your EV is out of range! Run /charge to charge it!")
              }
            }
            switch(bot){
                case "1":{
                    botcar = lodash.sample(bot1cars)
                    ticketsearned = 1
                    ckeysearned = 2
                    break;
                }
                case "2":{
                    botcar = lodash.sample(bot2cars)
                    moneyearned+=150
                    moneyearnedtxt += 150
                    ticketsearned = 2
                    ckeysearned = 4
                    break;
                }
                case "3":{
                    botcar = lodash.sample(bot3cars)
                    moneyearned+=200
                    moneyearnedtxt += 200
                    ticketsearned = 3
                    rkeysearned = 1
                    break;
                }
                case "4":{
                    botcar = lodash.sample(bot4cars)
                    moneyearned+=300
                    moneyearnedtxt += 525
                    ticketsearned = 4
                    rkeysearned = 2
                    break;
                }
                case "5":{
                    botcar = lodash.sample(bot5cars)
                    moneyearned+=400
                    moneyearnedtxt += 400
                    ticketsearned = 5
                    rkeysearned = 3
                    break;
                }
                case "6":{
                    botcar = lodash.sample(bot6cars)
                    moneyearned+=700
                    moneyearnedtxt += 700
                    ticketsearned = 6
                    ekeysearned = 1
                    break;
                }
                case "7":{
                    botcar = lodash.sample(bot7cars)
                    moneyearned+=800
                    moneyearnedtxt += 800
                    ticketsearned = 7
                    ekeysearned = 1
                    rkeysearned = 4
                    break;
                }
            }
            if(prestige){
              let mult = require('../prestige.json')[prestige].Mult
    
              let multy = mult * moneyearned
    
              moneyearned = moneyearned += multy
             
            }
            let usables = userdata.using
      
            let energytimer = cooldowndata.energydrink
            let energydrink2
            if(usables.includes('energy drink')){
              let timeout = 600000
              if (timeout - (Date.now() - energytimer) > 0) {          
                console.log("no energy")
              } else {
                await User.findOneAndUpdate({
                  id: interaction.user.id
              }, {
                  $pull: {
                    using: "energy drink"
                  }
              })
              }
          
              userdata.save()
            }
            if(usables.includes('energy drink')){
              ticketsearned = ticketsearned * 2
            }
            let sponsortimer = cooldowndata.sponsor
            let sponsor2
            if(usables.includes('sponsor')){
              let timeout = 600000
              if (timeout - (Date.now() - sponsortimer) > 0) {          
                console.log("no sponsor")
              } else {
                await User.findOneAndUpdate({
                  id: interaction.user.id
              }, {
                  $pull: {
                    using: 'sponsor'
                  }
              })    
              userdata.save()
              }
    
    
            }
            if(usables.includes('sponsor')){
              moneyearned = moneyearned * 2
              moneyearnedtxt = moneyearnedtxt * 2
              console.log(moneyearned)
            }
      
          
            let racelevel = userdata.racerank
     
           cooldowndata.racing = Date.now()
           cooldowndata.save()
      
      

            let newrankrequired = racelevel * 100
              if(prestige >= 3){
          newrankrequired * 2
        }
       else if(prestige >= 5){
          newrankrequired * 3
        }
            console.log(botcar)
      
            let user1carspeed = selected.Speed
            let user1carzerosixty = selected.Acceleration
            let user1carhandling = selected.Handling
    
      
          
          let handling = user1carhandling
  
          let zero2sixtycar = selected.Acceleration
          let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"]
          let newhandling = handling / 20
          let othernewhandling = cars.Cars[botcar.toLowerCase()].Handling / 20
          let new60 = user1carspeed / zero2sixtycar
          let new62 = cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty
          let driftscore = selected.Drift

  
          Number(user1carspeed)
          Number(cars.Cars[botcar.toLowerCase()].Speed)
          Number(new60)
          Number(new62)
          let hp = user1carspeed + newhandling
          hp - driftscore
          let hp2 = cars.Cars[botcar.toLowerCase()].Speed + othernewhandling
          let userhelmet = userdata.helmet
          console.log(userhelmet)
          userhelmet = userhelmet.toLowerCase()
          let helmets = require('../pfpsdb.json')
          let actualhelmet = helmets.Pfps[userhelmet.toLowerCase()]
          console.log(actualhelmet)
          let semote = "<:speedemote:983963212393357322>"
          let hemote = "<:handling:983963211403505724>"
          let zemote = "<:zerosixtyemote:983963210304614410>"
          let cemote = "<:zecash:983966383408832533>"
          let rpemote = "<:rp:983968476060336168>"

          let embed = new discord.MessageEmbed()
          .setTitle("3...2...1....GO!")
          .addField(
            `${actualhelmet.Emote} ${selected.Emote} ${selected.Name}`,
            `${semote} Speed: ${user1carspeed} MPH\n\n${zemote} 0-60: ${user1carzerosixty}s\n\n${hemote} Handling: ${handling}`,
            true
          )
          .addField(
            `🤖 ${cars.Cars[botcar.toLowerCase()].Emote} ${
              cars.Cars[botcar.toLowerCase()].Name
            }`,
            `${semote} Speed: ${cars.Cars[botcar.toLowerCase()].Speed} MPH\n\n${zemote} 0-60: ${
              otherzero2sixty
            }s\n\n${hemote} Handling: ${cars.Cars[botcar.toLowerCase()].Handling}`,
            true
          )
          .setColor("#60b0f4")
          .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png")
          let msg = await interaction.reply({embeds: [embed]})
          let randomnum = randomRange(2, 4)
          let launchperc = Math.round(hp / randomnum)
          if(randomnum == 2){
              setTimeout(() => {
                  embed.setDescription("Great launch!")
                  embed.addField("Bonus", "$100")
                  moneyearnedtxt += 100
                  userdata.cash += 100
                  tracklength+=1
                  interaction.editReply({embeds: [embed]})
              }, 2000);
          }
          console.log(randomnum)
          
      
          let tracklength = 0
          let tracklength2 = 0
          tracklength += new60
          tracklength2 += new62
          
          let nitro = selected.Nitro

          if(nitro){
            row.addComponents(
             new MessageButton()
           .setCustomId("boost")
           .setEmoji("<:boost:983813400289234978>")
           .setLabel("Boost")
           .setStyle("SECONDARY")
           )
           msg.edit({components: [row]})
     
          
           let filter = (btnInt) => {
             return interaction.user.id === btnInt.user.id
         }
        
         const collector = msg.createMessageComponentCollector({
             filter: filter,
             time: 10000
         })
          
               
       
               
               collector.on('collect', async (i, user) => {
     
                 if(i.customId.includes("boost")){
                       
                   let boost = partdb.Parts[nitro.toLowerCase()].AddedBoost
                   tracklength += parseInt(boost)
                   console.log("boosted " + parseInt(boost))
                   i.update({content:'Boosting!', embeds: [embed]})
                   selected.Nitro = null
                 }
     
               })
     
               
             }
               
         let timer = 0
         let x = setInterval(() => {
            tracklength += hp
            tracklength2 += hp2
            timer++
            console.log(tracklength)
            console.log(tracklength2)
            
            if(timer >= 15){
                if(tracklength > tracklength2){
                    console.log("End")
                    clearInterval(x)
                    embed.addField("Results", "Won")
                    if(global.double == true){
                      moneyearned = moneyearned += moneyearned
                      embed.addField("Double Cash Weekend!", `\u200b`)
                      moneyearnedtxt = `${moneyearned}`
                    }
                    if(cars.Cars[selected.Name.toLowerCase()].StatTrack){
                      selected.Wins += 1
                    }
                    let earnings = []
                    
                    earnings.push(`${cemote} $${moneyearnedtxt}`)
                    earnings.push(`${rpemote} ${ticketsearned} RP`)
                    let ckemote = "<:ckey:993011409132728370>"
                    let rkemote = "<:rkey:993011407681486868>"
                    let ekemote = "<:ekey:993011410210672671>"
                    if(ckeysearned >= 1){
                      earnings.push(`${ckeysearned} ${ckemote} keys`)
                      userdata.ckeys += ckeysearned
                    }
                  if(rkeysearned >= 1){
                    earnings.push(`${rkeysearned} ${rkemote} keys`)
                    userdata.rkeys += rkeysearned
                  }
                  if(ekeysearned >= 1){
                      earnings.push(`${ekeysearned} ${ekemote} keys`)
                      userdata.ekeys += ekeysearned
                    }
                  
                    embed.addField("Earnings", `${earnings.join('\n')}`)
                    interaction.editReply({embeds: [embed]})
    
                      

                    if(range){
                        range -= 1
    
                    }
                    userdata.cash += Number(moneyearned)
                    userdata.racexp += 10
                    userdata.rp += ticketsearned
                    if(userdata.racexp >= newrankrequired){
                    
                      userdata.racerank += 1
                            interaction.channel.send(`${user}, you just ranked up your race skill to ${db.fetch(`racerank_${uid}`)}!`)
          
                        
                       }
                       userdata.save()

                    return;
                }
          
                else if(tracklength < tracklength2){
                    console.log("End")
                    embed.addField("Results", "Lost")
                    interaction.editReply({embeds: [embed]})
                    clearInterval(x)
                    if(range){
                        range -= 1
    
                    }
          
                    return;
                }
                else if(tracklength == tracklength2){
                    console.log("End")
                    embed.addField("Results", "Tie")
                    interaction.editReply({embeds: [embed]})
                    clearInterval(x)
                    if(range){
                        range -= 1
    
                    }
          
                    return;
                }
            }
            
      
          }, 1000);
        function randomRange(min, max) {
          return Math.round(Math.random() * (max - min)) + min;
      }
    }
  }  
  