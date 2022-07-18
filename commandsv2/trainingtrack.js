const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder, time } = require("@discordjs/builders");
const {MessageActionRow, MessageButton} = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trainrace")
    .setDescription("Test your car on the track")
    .addStringOption((option) => option
    .setName("tier")
    .setDescription("The bot tier to race")
    .setRequired(true)
    .addChoice('Tier 1', '1')
    .addChoice('Tier 2', '2')
    .addChoice('Tier 3', '3')
    )
    .addStringOption((option) => option
    .setName("car")
    .setDescription("The car id to use")
    .setRequired(true)
    ),
    async execute(interaction) {
    
        const db = require("quick.db");
        
        const cars = require("../cardb.json");
        
        let moneyearned = 150;
        let moneyearnedtxt = 150;
        let created = db.fetch(`created_${interaction.user.id}`)
        if(!created) return interaction.reply("You haven't started yet! Run \`/start\` to start.")
        const newplayer = db.fetch(`newplayer_${interaction.user.id}`)
        const newplayerstage = db.fetch(`newplayerstage_${interaction.user.id}`)
        let idtoselect = interaction.options.getString("car");
        let selected = db.fetch(`selected_${idtoselect}_${interaction.user.id}`);
        if(!selected) {
          let errembed = new discord.MessageEmbed()
          .setTitle("Error!")
          .setColor("DARK_RED")
          .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
          return  interaction.reply({embeds: [errembed]})
      }
        let user = interaction.user;
        let bot =  interaction.options.getString("tier");
        let botlist = ["1", "2", "3"];
        let timeout = db.fetch(`timeout_${interaction.user.id}`) || 30000;
        let botcar = null;
        let racing = db.fetch(`tracing_${user.id}`);
        let racingxp = db.fetch(`racexp_${user.id}`);
        
        if (racing !== null && timeout - (Date.now() - racing) > 0) {
          let time = ms(timeout - (Date.now() - racing), { compact: true });
        
          return interaction.reply(`Please wait ${time} before racing on the training track again.`);
        }
        let semote = "<:speedemote:983963212393357322>"
        let hemote = "<:handling:983963211403505724>"
        let zemote = "<:zerosixtyemote:983963210304614410>"
        let cemote = "<:zecash:983966383408832533>"
        let rpemote = "<:rp:983968476060336168>"
        let user1cars = db.fetch(`cars_${user.id}`);
        let bot1cars = [
          "1995 mazda miata",
          "2005 hyundai tiburon",
          "1999 honda civic si",

        ];
        let bot2cars = [
          "2014 hyundai genesis coupe",
          "2008 nissan 350z",
          "2010 chevy camaro v6",

        ];
        let bot3cars = [
          "2020 porsche 718 cayman",
          "2015 lotus exige sport",
          "2011 audi rs5",

        ];
     
        
        let botdupgrades = randomRange(5, 25)
        let dwins 
        let botemote
      

      
       
        let prestige = db.fetch(`prestige_${interaction.user.id}`);
        let errorembed = new discord.MessageEmbed()
          .setTitle("❌ Error!")
          .setColor("#60b0f4");
        if (!user1cars) {
          errorembed.setDescription("You dont have any cars!");
          return interaction.reply({ embeds: [errorembed] });
        }
        if(bot == "rust" && !cars.Cars[selected.toLowerCase()].Junked) return interaction.reply("You need a barn find that has not been restored!")
     
        if (!botlist.includes(bot.toLowerCase())) {
          errorembed.setDescription(
            "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, 6, 7 and 8"
          );
          return interaction.reply({ embeds: [errorembed] });
        }
        if (!botlist.includes(bot.toLowerCase()) && !cars.Cars[selected]) {
          errorembed.setDescription(
            "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, 6, 7 and 8"
          );
          return interaction.reply({ embeds: [errorembed] });
        }
        if (!botlist.includes(bot.toLowerCase()) && user1cars.includes(selected)) {
          errorembed.setDescription(
            "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, 6, 7 and 8"
          );
          return interaction.reply({ embeds: [errorembed] });
        }
        if (!botlist.includes(bot.toLowerCase()) && !selected) {
          errorembed.setDescription(
            "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, 6, 7 and 8"
          );
          return interaction.reply({ embeds: [errorembed] });
        }
        
        if (!cars.Cars[selected.toLowerCase()]) {
          errorembed.setDescription("Thats not an available car!");
          return interaction.reply({ embeds: [errorembed] });
        }
        
        let restoration = db.fetch(
          `${cars.Cars[selected.toLowerCase()].Name}restoration_${interaction.user.id}`
        );
        if (cars.Cars[selected.toLowerCase()].Junked && restoration < 100 && bot !== "rust") {
          return interaction.reply("This car is too junked to race, sorry!");
        }

        let range = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`)
        if(cars.Cars[selected.toLowerCase()].Electric){
          if(range <= 0){
            return interaction.reply("Your EV is out of range! Run /charge to charge it!")
          }
        }
        
        let weekytask1 = db.fetch(`dailytask_${interaction.user.id}`);
        let ticketsearned;
        let classd
        let barnrandom = randomRange(1, 6)
        let barnmaps
        let barnwins
        let ubarnmaps
        let tracklength = 0;
        switch (bot) {
          case "1": {
            botcar = lodash.sample(bot1cars);
            ticketsearned = 1;
            console.log(botcar)
            classd = "1"
            botemote = "<:bottier1:983973330921074739>"
            break;
          }
          case "dclass": {
            botcar = lodash.sample(bot1cars);
            ticketsearned = 1;
            console.log(botcar)
            classd = "D"
            botemote = "<:bottier1:983973330921074739>"

            break;
          }
          case "2": {
            botcar = lodash.sample(bot2cars);
            moneyearned += 100;
            moneyearnedtxt += 100;
            ticketsearned = 2;
            console.log(botcar)
            classd = "2"
            botemote = "<:bottier2:983973332175183932>"

            break;
          }
          case "3": {
            botcar = lodash.sample(bot3cars);
            moneyearned += 200;
            moneyearnedtxt += 200;
            ticketsearned = 3;
            console.log(botcar)
            classd = "3"
            botemote = "<:tier3b:983974923661869056>"

            break;
          }
          case "4": {
            botcar = lodash.sample(bot4cars);
            moneyearned += 400;
            moneyearnedtxt += 400;
            ticketsearned = 4;
            classd = "4"
            botemote = "<:bottier4:983973327389483008>"

            console.log(botcar)
            break;
          }
          case "5": {
            botcar = lodash.sample(bot5cars);
            moneyearned += 500;
            moneyearnedtxt += 500;
            ticketsearned = 5;  
            console.log(botcar)
            classd = "5"
            botemote = "<:bottier5:983973327892795393>"

              
            
            break;
          }
          case "6": {
            botcar = lodash.sample(bot6cars);
            moneyearned += 700;
            moneyearnedtxt += 700;
            ticketsearned = 10;
            console.log(botcar)
            classd = "6"
            botemote = "<:bottier6:983973329155268648>"


            break;
          }
          case "7": {
            botcar = lodash.sample(bot7cars);
            moneyearned += 1000;
            moneyearnedtxt += 1000;
            ticketsearned = 20;
            console.log(botcar)
            classd = "7"
            botemote = "<:bottier7:983973330010927154>"

            break;
          }
          case "8": {
            botcar = lodash.sample(bot8cars);
            moneyearned += 1300;
            moneyearnedtxt += 1300;
            ticketsearned = 30;
            console.log(botcar)
            classd = "8"
            botemote = "<:tier8:983974081844088862>"

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
        console.log(sponsor)
        if(sponsor){
          let timeout = 600000
          if (timeout - (Date.now() - sponsortimer) > 0) {          
            console.log("no sponsor")
          } else {
              db.set(`sponsor_${interaction.user.id}`, false)
          }
          sponsor2 = db.fetch(`sponsor_${interaction.user.id}`)

        }
        if(sponsor2 == true){
          moneyearned = moneyearned * 2
          moneyearnedtxt = moneyearnedtxt * 2
          console.log(moneyearned)
        }

        let racelevel = db.fetch(`racerank_${interaction.user.id}`);
        if (!db.fetch(`racerank_${interaction.user.id}`)) {
          db.set(`racerank_${interaction.user.id}`, 1);
        }
        db.set(`tracing_${user.id}`, Date.now());
        let newrankrequired = racelevel * 200;
        if(prestige >= 3){
          newrankrequired * 2
        }
       else if(prestige >= 5){
          newrankrequired * 3
        }

        let nitro = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}nitro_${interaction.user.id}`);
       
        let user1carspeed = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}speed_${user.id}`);
        let user1carzerosixty =
          db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`) ||
          cars.Cars[selected.toLowerCase()]["0-60"];
        if (user1carzerosixty < 2) {
          db.set(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`, 2);
        }
        if (!user1carzerosixty || user1carzerosixty == null || user1carzerosixty == "null") {
          db.set(
            `${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`,
            parseFloat(cars.Cars[selected.toLowerCase()]["0-60"])
          );
        }

        if(!db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`)) {
          db.set(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`, cars.Cars[selected.toLowerCase()].Handling)
        }
        let userhelmet = db.fetch(`currentpfp_${user.id}`) || 'Default'
        console.log(userhelmet)
        userhelmet = userhelmet.toLowerCase()
        let helmets = require('../pfpsdb.json')
        let actualhelmet = helmets.Pfps[userhelmet.toLowerCase()]
        console.log(actualhelmet)
        let handling = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`) || cars.Cars[selected.toLowerCase()].Handling
        let driftscore = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}drift_${user.id}`) || 0
        let botspeed = cars.Cars[botcar.toLowerCase()].Speed
        let zero2sixtycar = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)
        let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"]
        let newhandling = handling / 20
        let othernewhandling = cars.Cars[botcar.toLowerCase()].Handling / 20
        let new60 = user1carspeed / zero2sixtycar
        let new62 = cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty
        let using = db.fetch(`using_${user.id}`)
        let items = db.fetch(`items_${user.id}`)
        if(user1carspeed > 190) return interaction.reply(`Your car is too fast for this race! Max speed is 190.`)
        Number(user1carspeed)
        Number(botspeed)
        Number(new60)
        Number(new62)
        if(bot == "dclass"){
          botspeed += botdupgrades
          console.log(botspeed)
        }
        let hp = user1carspeed + newhandling
        hp - driftscore
        let hp2 = botspeed + othernewhandling
        let tips = ["Try buying gold to support us! Starting at $0.99 for 20, and you can do so much with it!", 
          "You can upgrade cars with /upgrade", "Create a crew and get benefits such as cash bonuses!", 
          "Use /weekly, /daily, and /vote to get a small cash boost!", 
          "Notoriety is used for seasons, check the current season with /season",
          "Use keys to purchase import crates with exclusive cars", "View events with /event"]
        let tip = lodash.sample(tips)
        let y
        let policeuser
        let rcollector
       let policelen
       let salary
       let itemusedp
        let embed = new discord.MessageEmbed()
          .setTitle(`Tier ${classd} training race in progress...`)
          .addField(
            `${actualhelmet.Emote} ${cars.Cars[selected.toLowerCase()].Emote} ${
              cars.Cars[selected.toLowerCase()].Name
            }`,
            `${semote} Speed: ${db.fetch(`${cars.Cars[selected.toLowerCase()].Name}speed_${user.id}`)} MPH\n\n${zemote} 0-60: ${db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)}s\n\n${hemote} Handling: ${handling}`,
            true
          )
          .addField(
            `${botemote} ${cars.Cars[botcar.toLowerCase()].Emote} ${
              cars.Cars[botcar.toLowerCase()].Name
            }`,
            `${semote} Speed: ${botspeed} MPH\n\n${zemote} 0-60: ${
              otherzero2sixty
            }s\n\n${hemote} Handling: ${cars.Cars[botcar.toLowerCase()].Handling}`,
            true
          )
          .setColor("#60b0f4")

          .setFooter(`${tip}`)
          .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
          let row = new MessageActionRow()
          .addComponents(
          new MessageButton()
          .setCustomId("chase")
          .setEmoji("🚔")
          .setLabel("Chase")
          .setStyle("SECONDARY")
          
          )
          let msg = await interaction.reply({ embeds: [embed], fetchReply: true, components: [row] })
          let filter2 = (btnInt) => {
            return interaction.user.id !== btnInt.user.id
        }
          const collector2 = msg.createMessageComponentCollector({
            filter: filter2,
            time: 10000
        })
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
                    let boost = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}boost_${i.user.id}`)
                    if(!boost){
                      i.update(`No boost remaining!`)
                    }
                    else {
                      
                      tracklength += parseInt(boost)
                      console.log("boosted " + parseInt(boost))
                      i.update({content:'Boosting!', embeds: [embed]})
                      db.delete(`${cars.Cars[selected.toLowerCase()].Name}nitro_${i.user.id}`)
                      db.delete(`${cars.Cars[selected.toLowerCase()].Name}boost_${i.user.id}`)
                    }
    
                  } 
    
                })

                
                
                
              }
              collector2.on('collect', async (r, user) => {

                user = r.user

                if(r.customId.includes("chase")){
                  console.log("police")

                  let userid = r.user.id

                  let job = db.fetch(`job_${userid}`)
      
                  if(!job || job.Job !== "police") { 
                    
      
                  r.user.send(`You're not a cop!`).catch(() => console.log("Dms off"));
                  
                  }
                  let policejobs = db.fetch(`availablejobs_${user.id}`)
                  let timeout2 = 10800000
                  let ispolice = false
                  await r.deferUpdate()
                  if (policejobs !== null && timeout2 - (Date.now() - policejobs) > 0) {
                      let time = ms(timeout2 - (Date.now() - policejobs), { compact: true });
                      ispolice = false
                       user.send({content: `Please wait ${time} before chasing users again`}).catch(() => console.log("DMs Off"))
                    
                  }
                  else {
                    msg.channel.send(`🚨${user}, what car via id would you like to chase ${interaction.user.username} in?🚨`)

                    
                    let filter2 = (m = discord.Message) => {
                    return m.author.id === user.id
                  }
                let collectorp = interaction.channel.createMessageCollector({
                    filter: filter2,
                    max: 1,
                    time: 1000 * 10
                  })
                  let idtoselectcop
                  let selected2
                  collectorp.on('collect', msg => {
                    if(job){
      
                    
                    salary = job.Salary
                 
                    idtoselectcop = msg.content
                    console.log(idtoselectcop)
                    selected2 = db.fetch(`selected_${idtoselectcop}_${user.id}`);
                    if (!selected2) {
                      ispolice = false
      
                      return msg.reply("That id doesn't have a car! Use /ids select [id] [car] to select it!");
                    }
                      if(!cars.Cars[selected2.toLowerCase()].Police){
                        ispolice = false
                        return msg.reply(
                          "Thats not a police car!"
                          );
      
                        }
                        
                        if(bot < cars.Cars[selected2.toLowerCase()].Police){
                          ispolice = false
      
                          return msg.reply(`${user}, you cant use this police car for this low of a tier!`)
                        }
                        ispolice = true
                        
                        if(ispolice = true){
      
                          embed.addField(`🚨${user.username}'s ${cars.Cars[selected2.toLowerCase()].Emote} ${
                            cars.Cars[selected2.toLowerCase()].Name
                    }`,
                    `Speed: ${db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}speed_${user.id}`)}\n\n0-60: ${db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}060_${user.id}`)}s`, true
                  )
                  interaction.editReply({ embeds: [embed] });
              
                  let policespeed = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}Speed_${user.id}`) || cars.Cars[selected2.toLowerCase()].Speed
      
                  let policehandling = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}handling_${user.id}`) || cars.Cars[selected2.toLowerCase()].Handling
                  let police60 = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}060_${user.id}`)
                  let newhandlingp = policehandling / 20
                  let poice060 = policespeed / police60
                    
                  Number(user1carspeed)
      
                  Number(poice060)
                  let php = policespeed + newhandlingp
                  let policelength = 600
                  policelength += poice060 
                  let using2 = db.fetch(`using_${user.id}`)
                  let items2 = db.fetch(`items_${user.id}`)
      
                  if(items2 && items2.includes("roadblock")){
                    embed.addField("Item Used!","The police set up a roadblock! Your car has been slowed down.")
                    itemusedp = true
                    for (var i = 0; i < 1; i ++) items.splice(items.indexOf("roadblock"), 1)
                    db.set(`items_${user.id}`, items)
                  }
      
                  if(using == "emp"){
                    db.delete(`using_${interaction.user.id}`)
                    embed.setDescription("This user had an EMP! Your police car has been stopped.")
                    interaction.editReply({ embeds: [embed] });
                    policelength = 0
                    php = 0
                  }
                  if(items.includes("spikes") && using !== "emp"){
                    
                    embed.setDescription("This user has spikes! Your police car has been slowed down.")
                    interaction.editReply({ embeds: [embed] });
                    policelength = 0
                    php / 1.5
                    for (var i = 0; i < 1; i ++) items.splice(items.indexOf("spikes"), 1)
                    db.set(`items_${interaction.user.id}`, items)
                  }
                  policelen = policelength
                  policeuser = user
                  db.set(`availablejobs_${user.id}`, Date.now())
                  y = setInterval(() => {
                    policelength += php
                    policelen = policelength
                    
                    console.log(`Police: ${policelen}`)
                    
                  }, 1000);
                }
              }
            })
          }

                }  


              })

           

    
  

      

        let randomnum = randomRange(1, 4)
        if (randomnum == 2) {
          setTimeout(() => {
            embed.setDescription("Great launch!");
            embed.addField("Bonus", "$100");
            hp+=1
            moneyearnedtxt += 100;
            db.add(`cash_${interaction.user.id}`, 100);
            interaction.editReply({ embeds: [embed] });
          }, 2000);
        }

        tracklength += new62
        let tracklength2 = 0;
        tracklength2 += new60
        if(itemusedp == true){
          itemusedp = false
          tracklength - 20
        }
   
        let timer = 0
        let x = setInterval(() => {
          tracklength += hp;
          tracklength2 += hp2;
          timer++

          db.add(`racescompleted`, 1);
          if(timer >= 12){
            console.log(tracklength)
            clearInterval(x);
              clearInterval(y);
              collector2.stop()
            if(policelen){
              if (tracklength > policelen) {
                clearInterval(y)
                embed.addField(`Escaped from the cops!`, `Bonus: $200`)

                db.add(`cash_${interaction.user.id}`, 200)
                interaction.editReply({ embeds: [embed] });

              }
              else if (policelen > tracklength) {
                let job = db.fetch(`job_${policeuser.id}`)
                let jobsdb = require('../jobs.json')
                let jobrank = job.Rank
                let num = job.Number 
                let salary = job.Salary
                let exp = job.EXP
                let timeout = job.Timeout
                let actjob = job.Job
                let addednum = num += 1
                let requiredxp
                let jobdb = jobsdb.Jobs[actjob.toLowerCase()]
                if(jobsdb.Jobs[actjob].Ranks[addednum]){
                 requiredxp = jobsdb.Jobs[actjob].Ranks[addednum].XP
    
                }
                else {
                    requiredxp = "MAX"
    
                }
                let xp2 = randomRange(15, 25)

                embed.addField(`Busted!`, `No earnings from this race`)
                
                if(requiredxp !== "MAX"){
                  db.add(`job_${policeuser.id}.EXP`, xp2)

              }

              if(requiredxp !== "MAX" && db.fetch(`job_${policeuser.id}.EXP`) >= requiredxp){
                  msg.channel.send(`You just ranked up to ${jobsdb.Jobs[actjob].Ranks[addednum].Name}!`)
                  db.set(`job_${policeuser.id}`, {Number: addednum, Rank: jobdb.Ranks[`${addednum}`].Name, EXP: 0, Salary: jobdb.Ranks[`${addednum}`].Salary, Timeout: jobdb.Ranks[`${addednum}`].Time, Job: actjob})

              }
              db.add(`cash_${policeuser.id}`, salary)
              msg.reply(`You've completed your job duties and earned yourself $${salary}, and ${xp2} XP`)
              return interaction.editReply({ embeds: [embed] });
              
              }

            }
         
            if (tracklength > tracklength2) {
              if (db.fetch(`cashgain_${interaction.user.id}`) == "10") {
                let calccash = moneyearned * 0.1;
                moneyearnedtxt += calccash;
                moneyearned += calccash;
              } else if (db.fetch(`cashgain_${interaction.user.id}`) == "15") {
                let calccash = moneyearned * 0.15;
                moneyearnedtxt += calccash;
                moneyearned += calccash;
              } else if (db.fetch(`cashgain_${interaction.user.id}`) == "20") {
                let calccash = moneyearned * 0.2;
                moneyearnedtxt += calccash;
                moneyearned += calccash;
              } else if (db.fetch(`cashgain_${interaction.user.id}`) == "25") {
                let calccash = moneyearned * 0.25;
                moneyearnedtxt += calccash;
                moneyearned += calccash;
              } else if (db.fetch(`cashgain_${interaction.user.id}`) == "50") {
                let calccash = moneyearned * 0.5;
                moneyearnedtxt += calccash;
                moneyearned += calccash;
              }
              console.log(`before: ${moneyearned}`)
              console.log("End");
              let multi = db.fetch(`usingmulti_${user.id}`)
              if (multi == "trophy") {
                moneyearned = moneyearned * 2
                moneyearnedtxt = `${moneyearned} *with x2 multiplier*`
                console.log(moneyearned)

              }
      
              embed.setTitle(`Tier ${classd} training race completed!`);
              
              let earningsresult = []
              
              earningsresult.push(`$${moneyearned}`)
              earningsresult.push(`${rpemote} ${ticketsearned} RP`)
              if(barnmaps){
                earningsresult.push(`${barnmaps} Common Barn Maps`)
                db.add(`barnmaps_${interaction.user.id}`, barnmaps)
              }
              if(ubarnmaps){
                earningsresult.push(`${ubarnmaps} Uncommon Barn Maps`)

                db.add(`ubarnmaps_${interaction.user.id}`, ubarnmaps)
              }
              if (
                weekytask1 &&
                !weekytask1.completed &&
                weekytask1.task == "Win a tier 1 training track race" &&
                bot == "1"
              ) {
                 earningsresult.push(`${interaction.user}, you've completed your weekly task "${weekytask1.task}"!`);
                db.set(`dailytask_${interaction.user.id}.completed`, true);
                db.add(`cash_${interaction.user.id}`, weekytask1.reward);
              }

              embed.addField(
                "Earnings",
                `${cemote} ${earningsresult.join('\n')}`
              );
           
             
        

              if(db.fetch(`doublecash`) == true){
                moneyearned = moneyearned += moneyearned
                embed.addField("Double Cash Weekend!", `\u200b`)
                moneyearnedtxt = `$${moneyearned}`
              }
              interaction.editReply({ embeds: [embed] });
             
              if(barnwins){
                db.add(`barnwins_${interaction.user.id}`, barnwins);

              }
              db.add(`cash_${interaction.user.id}`, moneyearned);
              db.add(`raceswon_${interaction.user.id}`, 1);
              db.add(`racexp_${interaction.user.id}`, 25);
              db.add(`rp_${interaction.user.id}`, ticketsearned);
              if(range > 0) {
                db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)
                db.add(`batteries_${interaction.user.id}`, 1)
              }
              if (db.fetch(`racexp_${interaction.user.id}`) >= newrankrequired) {
                  db.add(`racerank_${interaction.user.id}`, 1);
                  interaction.channel.send(
                    `${interaction.user}, You just ranked up your race skill to ${db.fetch(
                      `racerank_${interaction.user.id}`
                    )}!`
                  );
                
              }
            
              return;
            } else if (tracklength < tracklength2) {
              console.log("End");
              embed.setTitle(`Tier ${classd} training race failed!`)
            

              clearInterval(x);
              db.add(`raceslost_${interaction.user.id}`, 1);
              if(range > 0) {
                db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)
              }
              interaction.editReply({embeds: [embed]})
              return;
            }
            else if (tracklength == tracklength2) {
              console.log("End");
              embed.setTitle(`Tier ${classd} training race tied!`)
              clearInterval(x);
              if(range > 0) {
                db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)
              }
            
              interaction.editReply({embeds: [embed]})
              return;
            }
          }

        }, 1000);
        
        function randomRange(min, max) {
          return Math.round(Math.random() * (max - min)) + min;
        }
        
    }
    
    
};

