const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("wanted")
    .setDescription("Get away from the cops! (PRESTIGE 2)")
    .addStringOption((option) => option
    .setName("tier")
    .setDescription("The police tier to run from")
    .setRequired(true)
    .addChoice('Tier 1', '1')
    .addChoice('Tier 2', '2')
    .addChoice('Tier 3', '3')

    )
    .addStringOption((option) => option
    .setName("car")
    .setDescription("The car id to use")
    .setRequired(true)
    )
    .addStringOption((option) => option
    .setName("options")
    .setDescription("Optional")
    .setRequired(false)
    .addChoice('Chase', 'chase')

    ),
    async execute(interaction) {
    
        const db = require("quick.db");
        
        const cars = require("../cardb.json");
        
        let moneyearned = 400;
        let moneyearnedtxt = 400;
        
        let idtoselect = interaction.options.getString("car");
        let selected = db.fetch(`selected_${idtoselect}_${interaction.user.id}`);
        if (!selected)
          return interaction.reply(
            "That id doesn't have a car! Use /ids select [id] [car] to select it!"
          );
        let user = interaction.user;
        let bot =  interaction.options.getString("tier");
        let chase =  interaction.options.getString("options");

        let prestige = db.fetch(`prestige_${interaction.user.id}`);
        if(prestige < 2) return interaction.reply("You need to be prestige 2 to do this race!")
        let botlist = ["1", "2", "3"];
        let timeout = db.fetch(`timeout_${interaction.user.id}`) || 45000;
        let botcar = null;
        let racing = db.fetch(`racing_${user.id}`);
        let racingxp = db.fetch(`racexp_${user.id}`);
        
        if (racing !== null && timeout - (Date.now() - racing) > 0) {
          let time = ms(timeout - (Date.now() - racing), { compact: true });
        
          return interaction.reply(`Please wait ${time} before racing again.`);
        }
        let user1cars = db.fetch(`cars_${user.id}`);
        let bot1cars = [
          "police 2009 corvette c6",
          "police 2012 dodge charger srt8"
        ];
        let bot2cars = [
          "police 2020 porsche 718 cayman",
          "police 2011 bmw m3"
        ];
        let bot3cars = [
            "police 2008 bugatti veyron"
        ];
        let job
        if(chase == "chase"){
            job = db.fetch(`job_${interaction.user.id}`)
       
            if(job.Job !== "police" || !job) return interaction.reply(`You're not a cop!`)
            let worked = db.fetch(`worked_${interaction.user.id}`)
            let timeoutj = job.Timeout
            if (worked !== null && timeoutj - (Date.now() - worked) > 0) {
                let time = ms(timeoutj - (Date.now() - worked));
                let timeEmbed = new discord.MessageEmbed()
                .setColor("#60b0f4")
                .setDescription(`You've already worked!\n\nWork again in ${time}.`);
                return interaction.reply({embeds: [timeEmbed]})
            }
           bot1cars = [
            "2014 hyundai genesis coupe",
            "2008 nissan 350z"
          ];
           bot2cars = [
            "2020 porsche 718 cayman",
            "2011 bmw m3"
          ];
           bot3cars = [
              "2008 bugatti veyron"
          ];
        }
        
        let errorembed = new discord.MessageEmbed()
          .setTitle("❌ Error!")
          .setColor("#60b0f4");
        if (!user1cars) {
          errorembed.setDescription("You dont have any cars!");
          return interaction.reply({ embeds: [errorembed] });
        }
        
     
        if (!botlist.includes(bot.toLowerCase())) {
          errorembed.setDescription(
            "Thats not a tier! The available tiers are: 1, 2, and 3"
          );
          return interaction.reply({ embeds: [errorembed] });
        }
        if (!botlist.includes(bot.toLowerCase()) && !cars.Cars[selected]) {
          errorembed.setDescription(
            "Thats not a tier! The available tiers are: 1, 2, and 3"
          );
          return interaction.reply({ embeds: [errorembed] });
        }
        if (!botlist.includes(bot.toLowerCase()) && user1cars.includes(selected)) {
          errorembed.setDescription(
            "Thats not a tier! The available tiers are: 1, 2, and 3"
          );
          return interaction.reply({ embeds: [errorembed] });
        }
        if (!botlist.includes(bot.toLowerCase()) && !selected) {
          errorembed.setDescription(
            "Thats not a tier! The available tiers are: 1, 2, and 3"
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
        if (cars.Cars[selected.toLowerCase()].Junked && restoration < 100) {
          return interaction.reply("This car is too junked to race, sorry!");
        }
        let weekytask1 = db.fetch(`weeklytask_${interaction.user.id}`);
        let barnrandom = randomRange(1, 4)
        console.log(`random ${barnrandom}`)
        let barnmaps
        switch (bot) {
          case "1": {
            botcar = lodash.sample(bot1cars);
            break;
          }
          case "2": {
            botcar = lodash.sample(bot2cars);
            moneyearned += 300;
            moneyearnedtxt += 300;
            break;
          }
          case "3": {
            botcar = lodash.sample(bot3cars);
            moneyearned += 600;
            moneyearnedtxt += 600;
            break;
          }
         
        }
        
        let range = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`)
        if(cars.Cars[selected.toLowerCase()].Electric){
          if(range <= 0){
            return interaction.reply("Your EV is out of range! Run /charge to charge it!")
          }
        }
        
        let racelevel = db.fetch(`racerank_${interaction.user.id}`);
        if (!db.fetch(`racerank_${interaction.user.id}`)) {
          db.set(`racerank_${interaction.user.id}`, 1);
        }
        db.set(`racing_${user.id}`, Date.now());
        let newrankrequired = racelevel * 200;
        if(prestige >= 3){
          newrankrequired * 2
        }
       else if(prestige >= 5){
          newrankrequired * 3
        }
        console.log(newrankrequired);
        console.log(botcar);
        
        let user1carspeed = db.fetch(
          `${cars.Cars[selected.toLowerCase()].Name}speed_${user.id}`
        );
        let user1carzerosixty =
          db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`) ||
          cars.Cars[selected.toLowerCase()]["0-60"];
        if (user1carzerosixty < 2) {
          db.set(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`, 2);
        }
        if (!user1carzerosixty) {
          db.set(
            `${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`,
            parseFloat(cars.Cars[selected.toLowerCase()]["0-60"])
          );
        }
       
        let handling = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`) || cars.Cars[selected.toLowerCase()].Handling

        let zero2sixtycar = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)
        let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"]
        let newhandling = handling / 20
        let othernewhandling = cars.Cars[botcar.toLowerCase()].Handling / 20
        let new60 = user1carspeed / zero2sixtycar
        let new62 = cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty


        Number(user1carspeed)
        Number(cars.Cars[botcar.toLowerCase()].Speed)
        Number(new60)
        Number(new62)
        let hp = user1carspeed + newhandling
        let hp2 = cars.Cars[botcar.toLowerCase()].Speed + othernewhandling

        let embed = new discord.MessageEmbed()
          .setTitle(`🚨Tier ${bot} chase in progress...🚨`)
          .addField(
            `Your ${cars.Cars[selected.toLowerCase()].Emote} ${
              cars.Cars[selected.toLowerCase()].Name
            }`,
            `Speed: ${user1carspeed}\n\n0-60: ${db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)}`
          )
          .addField(
            `🚨${cars.Cars[botcar.toLowerCase()].Emote} ${
              cars.Cars[botcar.toLowerCase()].Name
            }`,
            `Speed: ${cars.Cars[botcar.toLowerCase()].Speed}\n\n0-60: ${
              cars.Cars[botcar.toLowerCase()]["0-60"]
            }`
          )
          .setColor("#60b0f4")
          .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
          let randomobstacle = randomRange(1, 3)
        let msg = await interaction.reply({ embeds: [embed] });
        let randomnum = randomRange(2, 4);
        let timeobs = randomobstacle * 1000
        let launchperc = Math.round(hp / randomnum);
        if (randomnum == 2) {
          setTimeout(() => {
            embed.setDescription("Great launch!");
            embed.addField("Bonus", "$100");
            moneyearnedtxt += 100;
            db.add(`cash_${interaction.user.id}`, 100);
            hp+=1
            interaction.editReply({ embeds: [embed] });
          }, 2000);
        }
        console.log(randomnum);
        setTimeout(() => {
          interaction.channel.send("⛔ Obstacle! ⛔").then(async emb => {
            emb.react('🟢')
            emb.react('🚧') 
            const filter = (_, u) => u.id === interaction.user.id
            const collector = emb.createReactionCollector({ filter, time: 4000 })
            let gifs = ["https://c.tenor.com/foyTc4YBDWwAAAAC/ray-donovan-showtime.gif", "https://c.tenor.com/vBzDM0XpZVEAAAAC/crash-flip.gif", "https://bestanimations.com/media/police/1287902099police-animated-gif-21.gif"]
            collector.on('collect', async (r, user) => {
              emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
              emb.reactions.cache.get(r.emoji.name).users.remove(interaction.client.user.id)
              if (r.emoji.name === '🚧') {
                if(chase == "chase"){
                  return emb.edit('Crashed!')
                }
                 emb.edit('🚨Busted!🚨')
              }
              if (r.emoji.name === '🟢') {
                embed.setImage(lodash.sample(gifs))
                emb.edit('✅ Avoided obstacle!')
                interaction.editReply({embeds: [embed]})
              }

            })
            collector.on('end', async collected => {
              if(collected.size === 0){
                if(chase == "chase"){
                  return emb.edit('Crashed!')
                }
                return emb.edit('Busted!')

              }
            })

       
          })
          
        }, timeobs);
        let tracklength = 0
        let tracklength2 = 0
        tracklength += new60
        tracklength2 += new62

        let timer = 0
        
        let x = setInterval(() => {
          tracklength += hp;
          tracklength2 += hp2;
          timer++
          db.add(`racescompleted`, 1);
          if(timer >= 10){

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
              if(chase == "chase"){
                moneyearned = job.Salary
                moneyearnedtxt = job.Salary
                db.set(`worked_${interaction.user.id}`, Date.now())
              }
              
              console.log("End");
              clearInterval(x);
              embed.setTitle(`Got away from Tier ${bot} police!`);
              if(chase == "chase"){
                db.set(`worked_${interaction.user.id}`, Date.now())
                embed.setTitle(`Caught Tier ${bot} racer!`);
                let job = db.fetch(`job_${interaction.user.id}`)
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
                  db.add(`job_${interaction.user.id}.EXP`, xp2)

              }

              if(requiredxp !== "MAX" && db.fetch(`job_${interaction.user.id}.EXP`) >= requiredxp){
                interaction.channel.send(`You just ranked up to ${jobsdb.Jobs[actjob].Ranks[addednum].Name}!`)
                  db.set(`job_${interaction.user.id}`, {Number: addednum, Rank: jobdb.Ranks[`${addednum}`].Name, EXP: 0, Salary: jobdb.Ranks[`${addednum}`].Salary, Timeout: jobdb.Ranks[`${addednum}`].Time, Job: actjob})

              }
              db.add(`cash_${interaction.user.id}`, salary)
              interaction.channel.send(`You've completed your job duties and earned yourself $${salary}, and ${xp2} XP`)
              return interaction.editReply({ embeds: [embed] });
              }
              embed.addField(`Earnings`, `$${moneyearnedtxt}`)
            
              interaction.editReply({ embeds: [embed] });
              db.add(`cash_${interaction.user.id}`, moneyearned);
              db.add(`raceswon_${interaction.user.id}`, 1);
              db.add(`racexp_${interaction.user.id}`, 30);
              if(range){
                db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)
                db.add(`batteries_${user.id}`, 1)
  
            }
              if (db.fetch(`racexp_${interaction.user.id}`) >= newrankrequired) {
            
                  db.add(`racerank_${interaction.user.id}`, 1);
                  interaction.channel.send(
                    `${interaction.user}, You just ranked up your race skill to ${db.fetch(
                      `racerank_${interaction.user.id}`
                    )}!`
                  );
                
              }
              if (
                weekytask1 &&
                !weekytask1.completed &&
                weekytask1.task == "Win a tier 3 bot race" &&
                bot.toLowerCase() == "tier3"
              ) {
                  interaction.channel.send(
                  `${interaction.user}, you've completed your weekly task "${weekytask1.task}"!`
                );
                db.set(`weeklytask_${interaction.user.id}.completed`, true);
                db.add(`cash_${interaction.user.id}`, weekytask1.reward);
              }
              return;
            } else if (tracklength < tracklength2) {
              console.log("End");
              embed.setTitle(`Busted!`)
               if(chase == "chase"){
                embed.setTitle("They got away!")
              }
              embed.addField(`Lost Cash`, `$200`)
              clearInterval(x);
              if(range){
                db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)
  
            }
              db.add(`raceslost_${interaction.user.id}`, 1);
              db.subtract(`cash_${interaction.user.id}`, 200);
              interaction.editReply({embeds: [embed]})
              return;
            }
            else if (tracklength == tracklength2) {
              console.log("End");
              embed.setTitle(`Busted!`)
              if(chase == "chase"){
                embed.setTitle("They got away!")
              }
              embed.addField(`Lost Cash`, `$200`)
              clearInterval(x);
              if(range){
                db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)
  
            }
              db.subtract(`cash_${interaction.user.id}`, 200);
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

