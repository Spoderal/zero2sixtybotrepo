const ms = require('pretty-ms');
const discord = require('discord.js')
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timetrial')
    .setDescription("Race against the clock")
    .addStringOption((option) => option
    .setName("car")
    .setDescription("The car id to use")
    .setRequired(true)
    ),
    async execute(interaction) {
        const db = require("quick.db");
    
            const cars = require('../cardb.json');
            let moneyearnedtxt = 300
            let moneyearned = 300
            let idtoselect = interaction.options.getString("car")
            let user = interaction.user;
            let selected = db.fetch(`selected_${idtoselect}_${user.id}`)
            if(!idtoselect) return interaction.reply("Specify an id! Use /ids select [id] [car] to select a car!")
            if(!selected) {
                let errembed = new discord.MessageEmbed()
                .setTitle("Error!")
                .setColor("DARK_RED")
                .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
                return  interaction.reply({embeds: [errembed]})
            }
            let timeout = db.fetch(`timeout_${interaction.user.id}`) || 120000
            let racing = db.fetch(`timetrial_${user.id}`)
            let badges = db.fetch(`badges_${interaction.user.id}`) || ['None']

            if (racing !== null && timeout - (Date.now() - racing) > 0) {
                let time = ms(timeout - (Date.now() - racing), {compact: true});
              
                return interaction.reply(`Please wait ${time} before doing the timetrial again.`)
              } 
            let user1cars = db.fetch(`cars_${user.id}`)
         
        
            let errorembed = new discord.MessageEmbed()
            .setTitle("❌ Error!")
            .setColor("#60b0f4")
            if (!user1cars) {
                errorembed.setDescription("You dont have any cars!")
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
                errorembed.setDescription(`You need to enter the car you want to verse with. E.g. \`race [bot] [car]\`\nYour current cars: ${user1cars.join('\n')}`)
        
                return interaction.reply({embeds: [errorembed]})
            }
           
            let restoration = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}restoration_${user.id}`)
            if(cars.Cars[selected.toLowerCase()].Junked && restoration < 100){
                return interaction.reply("This car is too junked to race, sorry!")
            }
        
            let range = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`)
            if(cars.Cars[selected.toLowerCase()].Electric){
              if(range <= 0){
               return interaction.reply(`Your EV is out of range! Run /charge to charge it!`)
             }
            }

            if(range){
             db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)

         }
        
         
        
          
           db.set(`timetrial_${user.id}`, Date.now())
            
        
          let user1carspeed = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}speed_${user.id}`);
          let user1carzerosixty = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`) || cars.Cars[selected.toLowerCase()]["0-60"]
          let handling = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`) || cars.Cars[selected.toLowerCase()].Handling

          let dailytask = db.fetch(`dailytask_${user.id}`)
          let zero2sixtycar = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)
          let newhandling = handling / 20
          let new60 = user1carspeed / zero2sixtycar

          let driftscore = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}drift_${user.id}`) || 0
          let hp = user1carspeed + newhandling
          hp - driftscore
        
         let timernum = 0
        
         let timer = setInterval(() => {
            timernum++
         }, 1000);
         let semote = "<:speedemote:983963212393357322>"
         let hemote = "<:handling:983963211403505724>"
         let zemote = "<:zerosixtyemote:983963210304614410>"
         let cemote = "<:zecash:983966383408832533>"
         let rpemote = "<:rp:983968476060336168>"
          let embed = new discord.MessageEmbed()
          .setTitle("Going around the track!")
          .addField(`Your ${cars.Cars[selected.toLowerCase()].Emote} ${cars.Cars[selected.toLowerCase()].Name}`, `${semote} Speed: ${user1carspeed} MPH\n${zemote} 0-60: ${user1carzerosixty}s\n${hemote} Handling:${handling}`)
          .setColor("#60b0f4")
          .setThumbnail("https://i.ibb.co/Wfk7s36/timer1.png")
          let msg = await interaction.reply({embeds: [embed]})
          let randomnum = randomRange(2, 4)
          let launchperc = Math.round(hp / randomnum)
          if(randomnum == 2){
              setTimeout(() => {
                  embed.setDescription("Great launch!")
                  embed.addField("Bonus", "$100")
                  moneyearnedtxt += 100
                  db.add(`cash_${user.id}`, 100)
                  interaction.editReply({embeds: [embed]})
              }, 2000);
          }
          console.log(randomnum)
          
        
          let tracklength = 5000 - launchperc
        
        
         let x = setInterval(() => {
            tracklength -= hp
        
            console.log(tracklength)
           
        
            if(tracklength <= 0){
                console.log(timernum)
                moneyearned -= timernum
                moneyearnedtxt + moneyearned
                console.log("End")
                clearInterval(x, timer)
                embed.addField("Results", `Finished in ${timernum}s`)
                if(db.fetch(`doublecash`) == true){
                    moneyearned = moneyearned += moneyearned
                    embed.addField("Double Cash Weekend!", `\u200b`)
                    moneyearnedtxt = `$${moneyearned}`
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
                  console.log(sponsor2)
                  if(sponsor2 == true){
                    moneyearned = moneyearned * 2
                  }
                embed.addField("Earnings", `${cemote} $${moneyearned}`)
                interaction.editReply({embeds: [embed]})
                db.add(`cash_${user.id}`, moneyearned)
                if(dailytask && dailytask.task == "Complete the time trial in under 15 seconds" && timernum < 15 && !dailytask.completed ){
                    interaction.channel.send(`${user}, you completed your daily task, "${dailytask.task}"!`)
                    db.set(`dailytask_${user.id}.completed`, true)
                    db.add(`cash_${user.id}`, dailytask.reward)
                }
                if(timernum < 20 && !badges.includes("timemaster")) {
                    db.push(`badges_${user.id}`, "timemaster")
                    interaction.channel.send(`${user}, you've earned the time master badge!`)

                    
                }
                let oldtime = db.fetch(`timetrialtime_${interaction.user.id}`)

                if(timernum < oldtime && oldtime !== null) {
                    db.set(`timetrialtime_${interaction.user.id}`, timernum)

                }
                if (oldtime == null){
                    db.set(`timetrialtime_${interaction.user.id}`, timernum)

                }
                if(cars.Cars[selected.toLowerCase()].StatTrack){
                    let oldtime = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}timetrial_${interaction.user.id}`)

                    if(timernum < oldtime && oldtime !== null) {
                        db.set(`${cars.Cars[selected.toLowerCase()].Name}timetrial_${interaction.user.id}`, timernum)

                    }
                    if (oldtime == null){
                        db.set(`${cars.Cars[selected.toLowerCase()].Name}timetrial_${interaction.user.id}`, timernum)

                    }
                  }
                return;
            }
        
        
            
        
          }, 1000);
          
          function randomRange(min, max) {
            return Math.round(Math.random() * (max - min)) + min;
        }
    }
}  