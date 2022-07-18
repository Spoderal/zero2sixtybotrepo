const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("cashcup")
    .setDescription("Race up in the tiers for more cash!")
    .addStringOption((option) => option
    .setName("car")
    .setDescription("The car id to use")
    .setRequired(true)
    ),
    async execute(interaction) {
    
        const db = require("quick.db");
        
        let user = interaction.user

        const cars = require('../cardb.json');
        let races = db.fetch(`races_${user.id}`)
        let badge1 = db.fetch(`100racebadge_${user.id}`)
        let badge2 = db.fetch(`howbadge_${user.id}`)
        let premium1 = db.fetch(`premium_${user.id}`)
        let idtoselect = interaction.options.getString("car");
        let selected = db.fetch(`selected_${idtoselect}_${interaction.user.id}`);
        if(!selected) {
          let errembed = new discord.MessageEmbed()
          .setTitle("Error!")
          .setColor("DARK_RED")
          .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
          return  interaction.reply({embeds: [errembed]})
      }


      
        let timeout = 7200000 
        let racing = db.fetch(`racingcash_${user.id}`)
        let cashcuptier = db.fetch(`cashtier_${user.id}`)

        if(!cashcuptier) {
            db.set(`cashtier_${user.id}`, 1)
        }
        let newcashcuptier = db.fetch(`cashtier_${user.id}`)
        
        let moneyearned = 75 * newcashcuptier
        
        if (racing !== null && timeout - (Date.now() - racing) > 0) {
            let time = ms(timeout - (Date.now() - racing), {compact: true});
          
            return interaction.reply(`Please wait ${time} before racing in the cash cup again.`)
          } 
        let user1cars = db.fetch(`cars_${user.id}`)
        let bot1cars = ['1995 mazda miata', '1991 toyota mr2', '2002 pontiac firebird', '1999 honda civic si', '1997 acura integra', '2002 ford mustang']
        let bot2cars = ['2014 hyundai genesis coupe', '2008 nissan 350z', '2008 nissan 350z', '2010 ford mustang', '1989 chevy camaro', '1996 nissan 300zx twin turbo', '2004 subaru wrx sti']
        let bot3cars = ['2020 porsche 718 cayman', '2015 lotus exige sport', '2011 audi rs5', '2023 nissan z', '2018 kia stinger', '2012 dodge charger srt8']
        let bot4cars = ['2015 mercedes amg gts', '2016 alfa romeo giulia', '2021 porsche 911 gt3', '2017 ford gt', '2021 nissan gtr', '2013 lexus lfa']
        let bot5cars = ['2014 lamborghini huracan', '2014 mclaren 12c', '2018 audi r8', '2020 mclaren 570s', '2020 aston martin vantage']
        let bot6cars = ['2010 ferrari 458 italia', '2018 lamborghini aventador s', '2016 aston martin vulkan', '2013 mclaren p1']
        
        let botcar
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


          
          
           if (newcashcuptier <= 5){
               botcar = lodash.sample(bot1cars)

           }
           else if(newcashcuptier <= 15){
               botcar = lodash.sample(bot2cars)

           }
           else if(newcashcuptier <= 25){
            botcar = lodash.sample(bot3cars)

        }
        else if(newcashcuptier <= 45){
            botcar = lodash.sample(bot4cars)

        }
        else if(newcashcuptier <= 60){
            botcar = lodash.sample(bot5cars)

        }
        else if(newcashcuptier >= 60){
          botcar = lodash.sample(bot5cars)

      }
        else if(newcashcuptier >= 70){
            botcar = lodash.sample(bot6cars)

        }
           


       let racelevel = db.fetch(`racerank_${interaction.user.id}`);
       if (!db.fetch(`racerank_${interaction.user.id}`)) {
         db.set(`racerank_${interaction.user.id}`, 1);
       }
       let newrankrequired = racelevel * 200;
       console.log(newrankrequired);
       console.log(botcar);
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
       let handling = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`) || cars.Cars[selected.toLowerCase()].Handling
       let botspeed = cars.Cars[botcar.toLowerCase()].Speed
       let zero2sixtycar = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)
       let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"]
       let newhandling = handling / 20
       let othernewhandling = cars.Cars[botcar.toLowerCase()].Handling / 20
       let new60 = user1carspeed / zero2sixtycar
       let new62 = cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty
       let driftscore = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}drift_${user.id}`) || 0

       Number(user1carspeed)
       Number(botspeed)
       Number(new60)
       Number(new62)
       let hp = user1carspeed + newhandling
       hp - driftscore
       let hp2 = botspeed + othernewhandling
       let tips = ["Try buying gold to support us! Starting at $0.99 for 20, and you can do so much with it!", 
       "You can upgrade cars with /upgrade", "Create a crew and get benefits such as cash bonuses!", 
       "Use /weekly, /daily, and /vote to get a small cash boost!", 
       "Notoriety is used for seasons, check the current season with /season",
       "Use keys to purchase import crates with exclusive cars", "View events with /event"]
       let tip = lodash.sample(tips)
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
       .setTitle(`Tier ${newcashcuptier} cash cup race in progress...`)
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
         `${semote} Speed: ${botspeed} MPH\n\n${zemote} 0-60: ${
           otherzero2sixty
         }s\n\n${hemote} Handling: ${cars.Cars[botcar.toLowerCase()].Handling}`,
         true
       )
       .setColor("#60b0f4")

       .setFooter(`${tip}`)
       .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
       let msg = await interaction.reply({ embeds: [embed], fetchReply: true })
       db.set(`racingcash_${user.id}`, Date.now())
       
       let randomnum = randomRange(1, 4)
       if (randomnum == 2) {
         setTimeout(() => {
           embed.setDescription("Great launch!");
           embed.addField("Bonus", "$100");
           hp+=1
           db.add(`cash_${interaction.user.id}`, 100);
           interaction.editReply({ embeds: [embed] });
         }, 2000);
       }

       let tracklength = 0;
       tracklength += new62
       let tracklength2 = 0;
       tracklength2 += new60
       if(nitro){
         interaction.channel.send(`${interaction.user}, React to boost ahead!`).then(async emb => {
           
         emb.react('🔵')
   
           const filter = (_, u) => u.id === interaction.user.id
           const collector = emb.createReactionCollector({ filter, time: 4000 })
           collector.on('collect', async (r, user) => {
             emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
             emb.reactions.cache.get(r.emoji.name).users.remove(interaction.client.user.id)
             
             if (r.emoji.name === '🔵') {
               let boost = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}boost_${interaction.user.id}`)
               tracklength += parseInt(boost)
               console.log("boosted " + parseInt(boost))
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
         tracklength += hp;
         tracklength2 += hp2;
         timer++

         db.add(`racescompleted`, 1);
         if(timer >= 10){
           console.log(tracklength)
           clearInterval(x);

           if (tracklength > tracklength2) {
             if (db.fetch(`cashgain_${interaction.user.id}`) == "10") {
               let calccash = moneyearned * 0.1;
               moneyearned += calccash;
             } else if (db.fetch(`cashgain_${interaction.user.id}`) == "15") {
               let calccash = moneyearned * 0.15;
               moneyearned += calccash;
             } else if (db.fetch(`cashgain_${interaction.user.id}`) == "20") {
               let calccash = moneyearned * 0.2;
         
               moneyearned += calccash;
             } else if (db.fetch(`cashgain_${interaction.user.id}`) == "25") {
               let calccash = moneyearned * 0.25;
               moneyearned += calccash;
             } else if (db.fetch(`cashgain_${interaction.user.id}`) == "50") {
               let calccash = moneyearned * 0.5;
               moneyearned += calccash;
             }
             if(db.fetch(`doublecash`) == true){
              moneyearned = moneyearned += moneyearned
              embed.addField("Double Cash Weekend!", `\u200b`)
              moneyearnedtxt = `$${moneyearned}`
            }
             console.log("End");
             embed.setTitle(`Tier ${newcashcuptier} cash cup race won!`);
             let earningsresult = []
              
             earningsresult.push(`$${moneyearned}`)
             earningsresult.push(`New cash cup tier: ${newcashcuptier += 1}`)
             embed.addField(
               "Earnings",
               `${cemote} ${earningsresult.join('\n')}`
             );
          
         
            
          
             interaction.editReply({ embeds: [embed] })

             db.add(`cashtier_${user.id}`, 1)
             db.add(`cash_${interaction.user.id}`, moneyearned);
             db.add(`raceswon_${interaction.user.id}`, 1);
             db.add(`racexp_${interaction.user.id}`, 25);
             if(range > 0) {
               db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)
               db.add(`batteries_${interaction.user.id}`, 1)
             }
             if(cars.Cars[selected].StatTrack){
              db.add(`${cars.Cars[selected].Name}wins_${interaction.user.id}`, 1)
            }
             if (db.fetch(`racexp_${interaction.user.id}`) >= newrankrequired) {
               if (db.fetch(`racerank_${interaction.user.id}`) < 50) {
                 db.add(`racerank_${interaction.user.id}`, 1);
                 interaction.channel.send(
                   `${interaction.user}, You just ranked up your race skill to ${db.fetch(
                     `racerank_${interaction.user.id}`
                   )}!`
                 );
               }
             }
          
             return;
           } else if (tracklength < tracklength2) {
             console.log("End");
             embed.setTitle(`Tier ${newcashcuptier} cash cup race lost!`)
             if(newcashcuptier > 1){
                 embed.setDescription(`You got set back to tier ${newcashcuptier - 1}`)
                 db.subtract(`cashtier_${user.id}`, 1)
             }

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
             embed.setTitle(`Tier ${newcashcuptier} bot race tied!`)
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

