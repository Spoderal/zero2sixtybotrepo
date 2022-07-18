const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageActionRow, MessageButton} = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("betrace")
    .setDescription("Race against the odds!")
    .addNumberOption((option) => option
    .setName("bet")
    .setDescription("The amount to bet")
    .setRequired(true)
    )
    .addStringOption((option) => option
    .setName("car")
    .setDescription("The car id to use")
    .setRequired(true)
    ),
    async execute(interaction) {
    
        const db = require("quick.db");
        
        const cars = require("../cardb.json");
        let semote = "<:speedemote:983963212393357322>"
        let hemote = "<:handling:983963211403505724>"
        let zemote = "<:zerosixtyemote:983963210304614410>"
        let cemote = "<:zecash:983966383408832533>"
        let rpemote = "<:rp:983968476060336168>"
        let moneyearned = interaction.options.getNumber("bet");
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
        let bot =  randomRange(1, 7)
        let botlist = ["1", "2", "3", "4", "5", "6", "7"];
        let timeout = db.fetch(`btimeout_${interaction.user.id}`) || 18000000;
        let racing = db.fetch(`betracing_${user.id}`);
        let racingxp = db.fetch(`racexp_${user.id}`);
        let prestige = db.fetch(`prestige_${interaction.user.id}`);
        if(prestige < 5) return interaction.reply("You need to be prestige 5 to do this race!")
        if (racing !== null && timeout - (Date.now() - racing) > 0) {
          let time = ms(timeout - (Date.now() - racing), { compact: true });
        
          return interaction.reply(`Please wait ${time} before racing again.`);
        }
        let user1cars = db.fetch(`cars_${user.id}`);
        let botcar = lodash.sample(cars.Cars)
        console.log(botcar)
        let errorembed = new discord.MessageEmbed()
          .setTitle("❌ Error!")
          .setColor("#60b0f4");
        if (!user1cars) {
          errorembed.setDescription("You dont have any cars!");
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
        let weekytask1 = db.fetch(`weeklytask_${interaction.user.id}`);
        let ticketsearned;
        let barnrandom = randomRange(1, 6)
        let barnmaps
        let barnwins
        let bank = db.fetch(`bank_${user.id}`) || 0
        let banklimit = db.fetch(`banklimit_${user.id}`) || 10000
        if(banklimit > 250000000) {
          db.set(`banklimit_${interaction.user.id}`, 250000000)
        }
        if(banklimit > 250000000) {
          interaction.reply(`The bank limit cap is currently $${numberWithCommas(250000000)}, so your bank account has been set to the cap.`)
        } 
        if(moneyearned > bank) return interaction.reply(`You don't have enough money in your bank account!`)

    
        
        let racelevel = db.fetch(`racerank_${interaction.user.id}`);
        if (!db.fetch(`racerank_${interaction.user.id}`)) {
          db.set(`racerank_${interaction.user.id}`, 1);
        }
        db.set(`betracing_${interaction.user.id}`, Date.now());
        let newrankrequired = racelevel * 200;
        if(prestige >= 3){
          newrankrequired * 2
        }
       else if(prestige >= 5){
          newrankrequired * 3
        }
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
        let botspeed = cars.Cars[botcar.Name.toLowerCase()].Speed
        let rando = randomRange(1, 5)

        if(rando == 3){
          botspeed += 50
        }
        let zero2sixtycar = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)
        let otherzero2sixty = Number(cars.Cars[botcar.Name.toLowerCase()]["0-60"])
        let newhandling = handling / 20
        let othernewhandling = cars.Cars[botcar.Name.toLowerCase()].Handling / 20
        let new60 = user1carspeed / zero2sixtycar
        let new62 = cars.Cars[botcar.Name.toLowerCase()].Speed / otherzero2sixty
        let using = db.fetch(`using_${user.id}`)
        let items = db.fetch(`items_${user.id}`)
        Number(user1carspeed)
        Number(botspeed)
        Number(new60)
        new62 = Number(new62)
        let hp = user1carspeed + newhandling
        let hp2 = botspeed + othernewhandling
        let tips = ["Try buying gold to support us! Starting at $0.99 for 20, and you can do so much with it!", 
          "You can upgrade cars with /upgrade", "Create a crew and get benefits such as cash bonuses!", 
          "Use /weekly, /daily, and /vote to get a small cash boost!", 
          "Notoriety is used for seasons, check the current season with /season",
          "Use keys to purchase import crates with exclusive cars", "View events with /event"]
        let tip = lodash.sample(tips)
        let y
        let policeuser
       let policelen
       let salary
       let userhelmet = db.fetch(`currentpfp_${user.id}`) || 'Default'
       console.log(userhelmet)
       userhelmet = userhelmet.toLowerCase()
       let helmets = require('../pfpsdb.json')
       let actualhelmet = helmets.Pfps[userhelmet.toLowerCase()]
       console.log(actualhelmet)

       db.subtract(`bank_${user.id}`, moneyearned)
        let embed = new discord.MessageEmbed()
          .setTitle(`Bet race in progress...`)
          .addField(`Your bet`, `$${numberWithCommas(moneyearned)}`)
          .addField(
            `${actualhelmet.Emote} ${cars.Cars[selected.toLowerCase()].Emote} ${
              cars.Cars[selected.toLowerCase()].Name
            }`,
            `${semote} Speed: ${db.fetch(`${cars.Cars[selected.toLowerCase()].Name}speed_${user.id}`)} MPH\n\n${zemote} 0-60: ${db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)}s\n\n${hemote} Handling: ${handling}`,
            true
          )
          .addField(
            `🤖 ${cars.Cars[botcar.Name.toLowerCase()].Emote} ${
              cars.Cars[botcar.Name.toLowerCase()].Name
            }`,
            `${semote} Speed: ${botspeed} MPH\n\n${zemote} 0-60: ${
              otherzero2sixty
            }s\n\n${hemote} Handling: ${cars.Cars[botcar.Name.toLowerCase()].Handling}`,
            true
          )
          .setColor("#60b0f4")
          .setFooter(`${tip}`)
          .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
        let msg = await interaction.reply({ embeds: [embed], fetchReply: true })

    

        let randomnum = randomRange(1, 4)
        if (randomnum == 2) {
          setTimeout(() => {
            embed.setDescription("Great launch!");
            hp+=1
            interaction.editReply({ embeds: [embed] });
          }, 2000);
        }

        let tracklength = 0;
        tracklength += new62
        let tracklength2 = 0;
        tracklength2 += new60
        if(nitro){
          let row = new MessageActionRow()

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
           
              console.log(moneyearned)
              console.log("End");
              let multi = db.fetch(`usingmulti_${user.id}`)

              embed.setTitle(`Bet race won!`);
              
              
              
              let finalamount = moneyearned + (moneyearned * 0.35)
              embed.addField(
                  "Earnings",
                  `${cemote} $${numberWithCommas(finalamount)}`
                  );
                  interaction.editReply({ embeds: [embed] });
              db.add(`cash_${interaction.user.id}`, finalamount);
              db.add(`raceswon_${interaction.user.id}`, 1);
              db.add(`racexp_${interaction.user.id}`, 25);
              if(cars.Cars[selected].StatTrack){
                db.add(`${cars.Cars[selected].Name}wins_${interaction.user.id}`, 1)
              }
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
              embed.setTitle(`Bet race lost!`)

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
              embed.setTitle(`Bet race tied, you still lost your earnings!`)
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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
