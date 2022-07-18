const lodash = require('lodash')
const ms = require('pretty-ms');
const discord = require('discord.js')

const {SlashCommandBuilder} = require('@discordjs/builders')

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
            if(!idtoselect) return interaction.reply("Specify an id! Use /ids select [id] [car] to select a car!")
            let selected = db.fetch(`selected_${idtoselect}_${uid}`)
            if(!selected) {
                let errembed = new discord.MessageEmbed()
                .setTitle("Error!")
                .setColor("DARK_RED")
                .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
                return  interaction.reply({embeds: [errembed]})
            }
            let user = interaction.user;
            let bot = interaction.options.getString("tier")
            let botlist = ['1', '2', '3', '4', '5', '6', '7']
            let timeout = db.fetch(`timeout_${interaction.user.id}`) || 45000
            let botcar = null
            let racing = db.fetch(`racing_${user.id}`)
            let prestige = db.fetch(`prestige_${uid}`)
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

            if(prestige < 1) return interaction.reply("You need to be prestige 1 to do this race!")
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
        if(!botlist.includes(bot.toLowerCase()))  {
            errorembed.setDescription("Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, and 6")
            return interaction.reply({embeds: [errorembed]})
            }
            if(!botlist.includes(bot.toLowerCase()) && !cars.Cars[selected])  {
                errorembed.setDescription("Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, and 6")
                return interaction.reply({embeds: [errorembed]})
            }
            if(!botlist.includes(bot.toLowerCase()) && user1cars.includes(selected))  {
                errorembed.setDescription("Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, and 6")
                return interaction.reply({embeds: [errorembed]})
            }
            if(!botlist.includes(bot.toLowerCase()) && !selected)  {
                errorembed.setDescription("Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, and 6")
                return interaction.reply({embeds: [errorembed]})
            }
            
            if(!selected) {
                errorembed.setDescription("Select a car you want to use")
                return interaction.reply({embeds: [errorembed]})
            }
            if(!cars.Cars[selected.toLowerCase()]){
                errorembed.setDescription("Thats not an available car!")
                return interaction.reply({embeds: [errorembed]})
            }
            if (!user1cars.includes(selected.toLowerCase())) {
                errorembed.setDescription(`You don't own that car!`)
      
                return interaction.reply({embeds: [errorembed]})
            }
           
            let restoration = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}restoration_${uid}`)
            if(cars.Cars[selected.toLowerCase()].Junked && restoration < 100){
                return interaction.reply("This car is too junked to race, sorry!")
            }
            let ticketsearned
            let ckeysearned
            let rkeysearned
            let ekeysearned
            let range = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`)
            if(cars.Cars[selected.toLowerCase()].Electric){
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
               energydrink2 = db.fetch(`sponsor_${interaction.user.id}`)
    
            }
            if(sponsor2 == true){
              moneyearned = moneyearned * 2
            }
      
         
      
          
            let racelevel = db.fetch(`racerank_${uid}`)
            if(!db.fetch(`racerank_${uid}`)) {
             db.set(`racerank_${uid}`, 1)
            }
            db.set(`racing_${user.id}`, Date.now())
            if(cars.Cars[selected.toLowerCase()].Electric){
              if(range <= 0){
                return interaction.reply("Your EV is out of range! Run /charge to charge it!")
              }
            }
      
          
            if(!db.fetch(`racerank_${uid}`)) {
             db.set(`racerank_${uid}`, 1)
            }
            db.set(`racing_${user.id}`, Date.now())
            let newrankrequired = racelevel * 100
              if(prestige >= 3){
          newrankrequired * 2
        }
       else if(prestige >= 5){
          newrankrequired * 3
        }
            console.log(botcar)
      
          let user1carspeed = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}speed_${user.id}`);
          let user1carzerosixty = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`) || cars.Cars[selected.toLowerCase()]["0-60"]
          let dailytask1 = db.fetch(`dailytask_${uid}`)
      
          if(!db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`)) {
            db.set(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`, cars.Cars[selected.toLowerCase()].Handling)
          }
          let handling = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`) || cars.Cars[selected.toLowerCase()].Handling

          let zero2sixtycar = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)
          let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"]
          let newhandling = handling / 20
          let othernewhandling = cars.Cars[botcar.toLowerCase()].Handling / 20
          let new60 = user1carspeed / zero2sixtycar
          let new62 = cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty
          let driftscore = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}drift_${user.id}`) || 0

  
          Number(user1carspeed)
          Number(cars.Cars[botcar.toLowerCase()].Speed)
          Number(new60)
          Number(new62)
          let hp = user1carspeed + newhandling
          hp - driftscore
          let hp2 = cars.Cars[botcar.toLowerCase()].Speed + othernewhandling
          let userhelmet = db.fetch(`currentpfp_${user.id}`) || 'Default'
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
            `${actualhelmet.Emote} ${cars.Cars[selected.toLowerCase()].Emote} ${
              cars.Cars[selected.toLowerCase()].Name
            }`,
            `${semote} Speed: ${db.fetch(`${cars.Cars[selected.toLowerCase()].Name}speed_${user.id}`)} MPH\n\n${zemote} 0-60: ${db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)}s\n\n${hemote} Handling: ${handling}`,
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
                  db.add(`cash_${uid}`, 100)
                  tracklength+=1
                  interaction.editReply({embeds: [embed]})
              }, 2000);
          }
          console.log(randomnum)
          
      
          let tracklength = 0
          let tracklength2 = 0
          tracklength += new60
          tracklength2 += new62
          
          let nitro = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}nitro_${interaction.user.id}`)
          if(nitro){
           let boost = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}boost_${interaction.user.id}`)
           interaction.channel.send(`${interaction.user}, React to boost ahead!`).then(async emb => {
 
           emb.react('🔵')
     
             const filter = (_, u) => u.id === interaction.user.id
             const collector = emb.createReactionCollector({ filter, time: 4000 })
             collector.on('collect', async (r, user) => {
               emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
               emb.reactions.cache.get(r.emoji.name).users.remove(interaction.client.user.id)
 
               if (r.emoji.name === '🔵') {
                 tracklength += parseInt(boost)
                 console.log(tracklength)
                 interaction.channel.send('Boosting!')
                 db.delete(`${cars.Cars[selected.toLowerCase()].Name}nitro_${interaction.user.id}`)
                 db.delete(`${cars.Cars[selected.toLowerCase()].Name}boost_${interaction.user.id}`)
 
               } 
 
             })
             collector.on('end', async collected => {
               if(collected.size === 0){
                 return 
 
               }
             })
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
                    if(db.fetch(`doublecash`) == true){
                      moneyearned = moneyearned += moneyearned
                      embed.addField("Double Cash Weekend!", `\u200b`)
                      moneyearnedtxt = `${moneyearned}`
                    }
                    if(cars.Cars[selected].StatTrack){
                      db.add(`${cars.Cars[selected].Name}wins_${interaction.user.id}`, 1)
                    }
                    let earnings = []
                    
                    earnings.push(`${cemote} $${moneyearnedtxt}`)
                    earnings.push(`${rpemote} ${ticketsearned} RP`)
                    let ckemote = "<:ckey:993011409132728370>"
                    let rkemote = "<:rkey:993011407681486868>"
                    let ekemote = "<:ekey:993011410210672671>"
                    if(ckeysearned >= 1){
                      earnings.push(`${ckeysearned} ${ckemote} keys`)
                      db.add(`commonkeys_${uid}`, ckeysearned)
                    }
                  if(rkeysearned >= 1){
                    earnings.push(`${rkeysearned} ${rkemote} keys`)
                    db.add(`rarekeys_${uid}`, rkeysearned)
                    }
                  if(ekeysearned >= 1){
                      earnings.push(`${ekeysearned} ${ekemote} keys`)
                        db.add(`exotickeys_${uid}`, ekeysearned)
                    }
                    if(dailytask1 && dailytask1.task == "Win a quarter mile race" && !dailytask1.completed){
                      db.set(`dailytask_${user.id}.completed`, true)
                      db.add(`cash_${user.id}`, dailytask1.reward)
                      earnings.push(`${user}, you just completed your daily task "${dailytask1.task}"!`)
                    }
                    embed.addField("Earnings", `${earnings.join('\n')}`)
                    interaction.editReply({embeds: [embed]})
    
                      

                    if(range){
                        db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)
                        db.add(`batteries_${user.id}`, 1)
    
                    }
                    db.add(`cash_${uid}`, moneyearned)
                    db.add(`racexp_${uid}`, 25)
                    db.add(`rp_${uid}`, ticketsearned)
                    if(db.fetch(`racexp_${uid}`) >= newrankrequired){
                    
                            db.add(`racerank_${uid}`, 1)
                            interaction.channel.send(`${user}, you just ranked up your race skill to ${db.fetch(`racerank_${uid}`)}!`)
          
                        
                       }
                     
                    return;
                }
          
                else if(tracklength < tracklength2){
                    console.log("End")
                    embed.addField("Results", "Lost")
                    interaction.editReply({embeds: [embed]})
                    clearInterval(x)
                    if(range){
                        db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)
    
                    }
          
                    return;
                }
                else if(tracklength == tracklength2){
                    console.log("End")
                    embed.addField("Results", "Tie")
                    interaction.editReply({embeds: [embed]})
                    clearInterval(x)
                    if(range){
                        db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)
    
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
  