const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hw')
    .setDescription("PVP highway race another user")
    .addUserOption(option => option
        .setName('target')
        .setDescription('The 1st user you want to race with')
        .setRequired(true)
        
    )
    .addUserOption(option => option
        .setName('target2')
        .setDescription('The 2nd user you want to race with')
        .setRequired(true)
        
    )
    .addUserOption(option => option
        .setName('target3')
        .setDescription('The 3rd user you want to race with')
        .setRequired(true)
        
    )
    .addUserOption(option => option
      .setName('target4')
      .setDescription('The 4th user you want to race with')
      .setRequired(true)
      
  )
    .addStringOption((option) =>option
    .setName("car")
    .setDescription("The car id you want to race with")
    .setRequired(true)),
   
    async execute(interaction) {
        
        const ms = require('pretty-ms')
        const discord = require("discord.js");
        const db = require("quick.db");
        
            const cars = require('../cardb.json');
        
            let user = interaction.user;
            let user2 = interaction.options.getUser("target")
            if(!user2) return interaction.reply("Specify a user to race!")
        
           let timeout = 45000
        
        
            let user1cars = db.fetch(`cars_${user.id}`)
            let racing = db.fetch(`racing_${user.id}`)
            let racing2 = db.fetch(`racing_${user2.id}`)
            let dailytask1 = db.fetch(`dailytask_${user.id}`)
            if (racing !== null && timeout - (Date.now() - racing) > 0) {
                let time = ms(timeout - (Date.now() - racing), {compact: true});
              
                return interaction.reply(`Please wait ${time} before racing again.`)
              } 
              if (racing2 !== null && timeout - (Date.now() - racing2) > 0) {
                let time = ms(timeout - (Date.now() - racing2), {compact: true});
              
                return interaction.reply(`The other user needs to wait ${time} before racing again.`)
              } 
        
              let idtoselect = interaction.options.getString("car")
              if(!idtoselect) return interaction.reply("Specify an id! Use /ids select [id] [car] to select a car! \`Command example: /race @test 1\`")
              let selected = db.fetch(`selected_${idtoselect}_${user.id}`)
              if(!selected) {
                let errembed = new discord.MessageEmbed()
                .setTitle("Error!")
                .setColor("DARK_RED")
                .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
                return  interaction.reply({embeds: [errembed]})
            }
        
            if (!user1cars) return interaction.reply("You dont have any cars!")
            let user1carchoice = selected.toLowerCase()
        
            if (!user1cars.some(e => e.includes(selected))) return interaction.reply(`You need to enter the car you want to verse with. E.g. \`race @user dragster\`\nYour current cars: ${user1cars.join(' ')}`)
            if(user.id === user2.id) return interaction.reply("You cant race yourself!")
        
            let user2cars = db.fetch(`cars_${user2.id}`);
            if (!user2cars) return interaction.reply("They dont have any cars!")
            if(!cars.Cars[user1carchoice]) return interaction.reply("Thats not a car!")
        
            let restoration = db.fetch(`${cars.Cars[user1carchoice.toLowerCase()].Name}restoration_${user.id}`)
            if(cars.Cars[user1carchoice.toLowerCase()].Junked && restoration < 100){
                return interaction.reply("This car is too junked to race, sorry!")
            }
            interaction.reply(`${user2}, what car do you wish to verse ${user} in?`)
            const filter = (m = discord.Message) => {
                return m.author.id === user2.id
            }
            let collector = interaction.channel.createMessageCollector({
                filter,
                max: 1,
                time: 1000 * 20
            })
            let selected2
            let user2carchoice
            let dailytask2 = db.fetch(`dailytask_${user2.id}`)
            collector.on('collect', msg => {
        
                 user2carchoice = msg.content
              if(!user2carchoice) return interaction.reply("Specify an id! Use /ids select [id] [car] to select a car! \`Command example: /race @test 1\`")
               selected2 = db.fetch(`selected_${user2carchoice}_${msg.author.id}`)
              if(!selected2) return msg.reply("That id doesn't have a car! Use /ids select [id] [car] to select it! \`Command example: /race @test 1\`");
                let restoration2 = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}restoration_${msg.author.id}`)
                if(cars.Cars[selected2.toLowerCase()].Junked && restoration2 < 100){
                    return msg.reply("This car is too junked to race, sorry!")
                }
            })
            let racelevel = db.fetch(`racerank_${user.id}`)
            if(!db.fetch(`racerank_${user.id}`)) {
             db.set(`racerank_${user.id}`, 1)
            }
            let newrankrequired = racelevel * 200
            
            let racelevel2 = db.fetch(`racerank_${user2.id}`)
            if(!db.fetch(`racerank_${user2.id}`)) {
             db.set(`racerank_${user2.id}`, 1)
            }
            let newrankrequired2 = racelevel2 * 200
            collector.on('end', async () => {
                if (!user2carchoice) return interaction.channel.send("They didn't answer in time!")
                if(!selected) return interaction.channel.send("They didn't answer in time!")
                let user2carspeed = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}speed_${user2.id}`);
                let user2car = cars.Cars[selected2].Name
                let user1car =  cars.Cars[user1carchoice].Name
                db.set(`racing_${user.id}`, Date.now())
                db.set(`racing_${user2.id}`, Date.now())
        
                 let user1carspeed = db.fetch(`${user1car}speed_${user.id}`);
                
         
        
           let user1carzerosixty = db.fetch(`${cars.Cars[user1car.toLowerCase()].Name}060_${user.id}`)
           let user2carzerosixty = db.fetch(`${cars.Cars[user2car.toLowerCase()].Name}060_${user2.id}`)
           let range = db.fetch(`${cars.Cars[user1car.toLowerCase()].Name}range_${user.id}`)
           if(cars.Cars[user1car.toLowerCase()].Electric){
             if(range <= 0){
               return interaction.editReply(`${user}, Your EV is out of range! Run /charge to charge it!`)
             }
           }
           let range2 = db.fetch(`${cars.Cars[user2car.toLowerCase()].Name}range_${user2.id}`)
           if(cars.Cars[user2car.toLowerCase()].Electric){
             if(range2 <= 0){
               return interaction.editReply(`${user2}, Your EV is out of range! Run /charge to charge it!`)
             }
           }
           if (user1carzerosixty < 2) {
            db.set(`${cars.Cars[user1car.toLowerCase()].Name}060_${user.id}`, 2);
          }
          if (user2carzerosixty < 2) {
            db.set(`${cars.Cars[user2car.toLowerCase()].Name}060_${user2.id}`, 2);
          }
          if(!db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`)) {
            db.set(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`, cars.Cars[selected.toLowerCase()].Handling)
          }
          if(!db.fetch(`${cars.Cars[user2car.toLowerCase()].Name}handling_${user2.id}`)) {
            db.set(`${cars.Cars[user2car.toLowerCase()].Name}handling_${user2.id}`, cars.Cars[user2car.toLowerCase()].Handling)
          }
          let newzero1 = db.fetch(`${cars.Cars[user1car.toLowerCase()].Name}060_${user.id}`)
          let newzero2 = db.fetch(`${cars.Cars[user2car.toLowerCase()].Name}060_${user2.id}`)

          let handling = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`) || cars.Cars[selected.toLowerCase()].Handling
          let handling2 = db.fetch(`${cars.Cars[user2car.toLowerCase()].Name}handling_${user2.id}`) || cars.Cars[user2car.toLowerCase()].Handling

          let zero2sixtycar = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)
          let otherzero2sixty = db.fetch(`${cars.Cars[user2car.toLowerCase()].Name}060_${user2.id}`)
        
          let newhandling = handling / 20
          let othernewhandling = handling2 / 20
          let new60 = user1carspeed / zero2sixtycar
          let new62 = user2carspeed / otherzero2sixty
  
  
          let hp = user1carspeed + newhandling
          let hp2 = user2carspeed + othernewhandling
        
           let weekytask1 = db.fetch(`weeklytask_${user.id}`)
           let weekytask2 = db.fetch(`weeklytask_${user2.id}`)
        
           let embed = new discord.MessageEmbed()
           .setTitle("3...2...1....GO!")
           .addField(`${user.username}'s ${cars.Cars[user1car.toLowerCase()].Emote} ${cars.Cars[user1car.toLowerCase()].Name}`, `Speed: ${user1carspeed}\n\n0-60: ${newzero1}s`)
           .addField(`${user2.username}'s ${cars.Cars[user2car.toLowerCase()].Emote} ${cars.Cars[user2car.toLowerCase()].Name}`, `Speed: ${user2carspeed}\n\n0-60: ${newzero2}s`)
           .setColor("#60b0f4")
           .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png")
           let msg2 = await interaction.editReply({embeds: [embed]})
          
           
        
           let tracklength = 0
           let tracklength2 = 0 
          
           tracklength += new60
           tracklength2 += new62

          let timer = 0
          let x = setInterval(() => {
             tracklength += hp
             tracklength2 += hp2
             timer++
             console.log(tracklength)
             console.log(tracklength2)
            
             if(timer >= 30){

               if(tracklength > tracklength2){
                   console.log("End")
                   clearInterval(x)
                   embed.addField("Results", `${user.username} Won`)
                   embed.addField("Earnings", `500`)
                 
                   msg2.edit({embeds: [embed]})
                   db.add(`cash_${user.id}`, 500)
                   db.add(`racexp_${user.id}`, 25)
                   db.add(`rp_${user.id}`, 10)
       
                  if(dailytask1 && dailytask1.task == "Win 1 pvp race" && !dailytask1.completed){
                      db.set(`dailytask_${user.id}.completed`, true)
                      db.add(`cash_${user.id}`, dailytask1.reward)
                      msg2.reply(`${user}, you just completed your daily task "${dailytask1.task}"!`)
                  }
                  if(weekytask1 && weekytask1.task == "Win a pvp race in a 1994 Porsche 911" && !weekytask1.completed && user1car.toLowerCase() == "1994 porsche 911"){
                      db.set(`weeklytask_${user.id}.completed`, true)
                      db.add(`cash_${user.id}`, weekytask1.reward)
                      msg2.reply(`${user}, you just completed your weekly task "${weekytask1.task}"!`)
                  }
                   if(db.fetch(`racexp_${user.id}`) >= newrankrequired){
                       if(db.fetch(`racerank_${user.id}`) < 20){
                           db.add(`racerank_${user.id}`, 1)
                           msg2.reply(`${user}, you just ranked up your race skill to ${db.fetch(`racerank_${user.id}`)}!`)
          
                       }
                      }
                   return;
               }
          
               else if(tracklength < tracklength2){
                  console.log("End")
                  clearInterval(x)
                  embed.addField("Results", `${user2.username} Won`)
                  embed.addField("Earnings", `500`)
           
                  msg2.edit({embeds: [embed]})
                  db.add(`cash_${user2.id}`, 500)
                  db.add(`racexp_${user2.id}`, 25)
                  db.add(`rp_${user2.id}`, 10)
         
                  if(dailytask2 && dailytask2.task == "Win 1 pvp race" && !dailytask2.completed){
                      db.set(`dailytask_${user2.id}.completed`, true)
                      db.add(`cash_${user2.id}`, dailytask2.reward)
                      msg2.reply(`${user2}, you just completed your daily task "${dailytask2.task}"!`)
          
                  }
                  if(weekytask2 && weekytask2.task == "Win a pvp race in a 1994 Porsche 911" && !weekytask2.completed && user2car.toLowerCase() == "1994 porsche 911"){
                      db.set(`weeklytask_${user2.id}.completed`, true)
                      db.add(`cash_${user2.id}`, weekytask2.reward)
                      msg2.reply(`${user2}, you just completed your weekly task "${weekytask2.task}"!`)
                  }
                  if(db.fetch(`racexp_${user2.id}`) >= newrankrequired2){
                      if(db.fetch(`racerank_${user2.id}`) < 20){
                          db.add(`racerank_${user2.id}`, 1)
                          msg2.reply(`${user2}, you just ranked up your race skill to ${db.fetch(`racerank_${user.id}`)}!`)
          
                      }
                     }
                  return;
           
               }
             }
             
        
           }, 1000);
        
        
            
        })
        
        
        function randomRange(min, max) {
            return Math.round(Math.random() * (max - min)) + min;
        }
    }
}  