const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const emotes = require("../common/emotes").emotes;
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require("discord.js");
const locationdb = require("../data/locations.json")
const Cooldowns = require("../schema/cooldowns");
const cardb = require("../data/cardb.json")
const lodash = require("lodash");
const colors = require("../common/colors");
const { toCurrency, randomRange } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("location")
    .setDescription("View your location")
    .addSubcommand((cmd) =>
      cmd
        .setName("view")
        .setDescription("View a location")
      
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("relocate")
        .setDescription("Change your location")
    )
    .addSubcommand((cmd) =>
    cmd
      .setName("drive")
      .setDescription("Drive in your location")
      .addStringOption((option) => option
      .setName("car")
      .setRequired(true)
      .setDescription("The car to drive")
      )
  )
    ,
  async execute(interaction) {
    let command = interaction.options.getSubcommand();
    let user =  interaction.user;
    let userdata = await User.findOne({ id: user.id });
    let cooldowndata = await Cooldowns.findOne({ id: user.id });
    let driven = cooldowndata.driven
    let items = userdata.items || []
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let location = userdata.location || "USA";
    
    let locationindb = locationdb.Locations[location.toLowerCase()]

    if (command == "view") {


      let embed = new EmbedBuilder()
      .setTitle(`${locationindb.Name}`)
      .setImage(`${locationindb.Image}`)
      .setDescription(`${locationindb.Perks}`)
      .setColor(colors.blue)

      await interaction.reply({embeds: [embed]})
    }

    else if(command == "relocate"){


       if (userdata.items.includes("airplane")) {
  
        let embed = new EmbedBuilder()
        .setTitle(`Where do you want to travel to?`)
        let row2 = new ActionRowBuilder()
        .setComponents(
          new StringSelectMenuBuilder()
          .setCustomId("location")
          .setPlaceholder("Location")
          .setOptions(
            {label: "USA", value: "usa"},
            {label: "Peru", value: "peru"},
            {label: "India", value: "india"},
            {label: "Spain", value: "spain"},
            {label: "Italy", value: "italy"},
            {label: "Japan", value: "japan"},
            {label: "Germany", value: "germany"}
          )
        )
      
        let msg = await interaction.reply({embeds: [embed], components: [row2], fetchReply: true})
  
        const filter = (interaction2) =>
        interaction2.isSelectMenu() &&
        interaction2.user.id === interaction.user.id;
  
      const collector = msg.createMessageComponentCollector({
        filter,
      });
  
      collector.on('collect', async (i) => {
        let locationchosen = i.values[0].toLowerCase()
  
        userdata.location = locationchosen
        for (var i5 = 0; i5 < 1; i5++) userdata.items.splice(userdata.items.indexOf("airplane"), 1);
        userdata.save()
        return
      })
    }
    else {

      let cash = userdata.cash
  
      if(cash < 10000) return interaction.reply("You need $10k to cover the trip expenses, you don't have enough!")
  
      let locationsarr = []
  
      for(let loc in locationdb.Locations){
        locationsarr.push(locationdb.Locations[loc].Name.toLowerCase())
      }
  
      let newloc = lodash.sample(locationsarr)
  
      userdata.location = newloc.toLowerCase()
  
      userdata.save()
  
      await interaction.reply(`You relocated to **${newloc}**`)
    }


    }

    else if(command == "drive"){
      let caroption = interaction.options.getString("car")
      let cartodrive = userdata.cars.filter((car) => car.ID.toLowerCase() == caroption.toLowerCase())[0]

      let embed = new EmbedBuilder()
      .setTitle(`Driving in ${locationindb.Name} with your ${cartodrive.Name}`)
      .setImage(cartodrive.Image)
      .setColor(colors.blue)

      let msg = await interaction.reply({embeds: [embed], fetchReply: true})

      let events = locationindb.Events

      let event = lodash.sample(events)
      setTimeout(async () => {
      console.log(event)

      if(event == "Service"){
        let service = lodash.sample(locationindb.Services)
        let actionrow = new ActionRowBuilder()
        .setComponents(
          new ButtonBuilder()
          .setCustomId("1")
          .setLabel("Buy item 1")
          .setStyle("Primary")
        )
        if(service == "Gas Station"){
          let fill = 5
          let gas = cartodrive.gas
          if(userdata.location.toLowerCase() == "usa"){
            fill = fill * 2
          }
            if((gas += fill) > 10){
              cartodrive.gas = 10 
            }
            else {
              cartodrive.gas += fill

            }
      
          
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car]": cartodrive,
              },
            },
    
            {
              arrayFilters: [
                {
                  "car.Name": cartodrive.Name,
                },
              ],
            }
          );
          embed.setDescription("You've arrived at a Gas Station! You filled your tank by **5**")
          interaction.editReply({embeds: [embed], fetchReply: true})
          userdata.save()
        }
        else if(service == "Shop"){
          let shop = locationindb.ForSale

          let shoparr = []

          for(let it in shop){
            shoparr.push(`${shop[it].emote} ${shop[it].name} : **${toCurrency(shop[it].price)}**`)
          }

          embed.setDescription(`You've arrived at a Tire Shop! Would you like to buy anything?\n\n${shoparr.join('\n')}`)
          interaction.editReply({embeds: [embed], fetchReply: true, components: [actionrow]})
        }
      }
    
    else if(event == "Market"){
      let shop = locationindb.BlackMarket
      let actionrow = new ActionRowBuilder()
      .setComponents(
        new ButtonBuilder()
        .setCustomId("1")
        .setLabel("Buy car 1")
        .setStyle("Primary"),
        new ButtonBuilder()
        .setCustomId("2")
        .setLabel("Buy car 2")
        .setStyle("Primary"),
        new ButtonBuilder()
        .setCustomId("3")
        .setLabel("Buy car 3")
        .setStyle("Primary"),
        new ButtonBuilder()
        .setCustomId("4")
        .setLabel("Buy car 4")
        .setStyle("Primary")
      )
      let shoparr = []

      for(let it in shop){
        shoparr.push(`${shop[it].Emote} ${shop[it].Name} : **${toCurrency(shop[it].Price)}**`)
      }

      embed.setDescription(`You've arrived at a Black Market Would you like to buy anything?\n\n${shoparr.join('\n')}`)
      interaction.editReply({embeds: [embed], fetchReply: true, components: [actionrow]})

      let filter3 = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };

      const collector3 = msg.createMessageComponentCollector({
        filter: filter3,
        time: 30000,
      });

      collector3.on('collect', async (i) => {
        if(i.customId == "1"){
          let carindb = cardb.Cars[`${shop[0].Name.toLowerCase()}`]
          let carobj = {
            ID: carindb.alias,
            Name: carindb.Name,
            Speed: carindb.Speed,
            Acceleration: carindb["0-60"],
            Handling: carindb.Handling,
            Parts: [],
            Emote: carindb.Emote,
            Image: carindb.Image,
            Miles: 0,
            Drift: 0,
            WeightStat: carindb.Weight,
            Gas: 10,
            MaxGas: 10,
          };

          let carprice = shop[0].Price

          if(carprice > userdata.cash) return interaction.editReply("You can't afford this car!")

          userdata.cars.push(carobj)
          
          userdata.cash -= carprice

          userdata.save()

          interaction.editReply("✅")
        }
        else if(i.customId == "2"){
          let carindb = cardb.Cars[`${shop[1].Name.toLowerCase()}`]
          let carobj = {
            ID: carindb.alias,
            Name: carindb.Name,
            Speed: carindb.Speed,
            Acceleration: carindb["0-60"],
            Handling: carindb.Handling,
            Parts: [],
            Emote: carindb.Emote,
            Image: carindb.Image,
            Miles: 0,
            Drift: 0,
            WeightStat: carindb.Weight,
            Gas: 10,
            MaxGas: 10,
          };

          let carprice = shop[0].Price

          if(carprice > userdata.cash) return interaction.editReply("You can't afford this car!")

          userdata.cars.push(carobj)
          
          userdata.cash -= carprice

          userdata.save()

          interaction.editReply("✅")
        }
        else if(i.customId == "3"){
          let carindb = cardb.Cars[`${shop[2].Name.toLowerCase()}`]
          let carobj = {
            ID: carindb.alias,
            Name: carindb.Name,
            Speed: carindb.Speed,
            Acceleration: carindb["0-60"],
            Handling: carindb.Handling,
            Parts: [],
            Emote: carindb.Emote,
            Image: carindb.Image,
            Miles: 0,
            Drift: 0,
            WeightStat: carindb.Weight,
            Gas: 10,
            MaxGas: 10,
          };

          let carprice = shop[0].Price

          if(carprice > userdata.cash) return interaction.editReply("You can't afford this car!")

          userdata.cars.push(carobj)
          
          userdata.cash -= carprice

          userdata.save()

          interaction.editReply("✅")
        }
        if(i.customId == "4"){
          let carindb = cardb.Cars[`${shop[3].Name.toLowerCase()}`]
          let carobj = {
            ID: carindb.alias,
            Name: carindb.Name,
            Speed: carindb.Speed,
            Acceleration: carindb["0-60"],
            Handling: carindb.Handling,
            Parts: [],
            Emote: carindb.Emote,
            Image: carindb.Image,
            Miles: 0,
            Drift: 0,
            WeightStat: carindb.Weight,
            Gas: 10,
            MaxGas: 10,
          };

          let carprice = shop[0].Price

          if(carprice > userdata.cash) return interaction.editReply("You can't afford this car!")

          userdata.cars.push(carobj)
          
          userdata.cash -= carprice

          userdata.save()

          interaction.editReply("✅")
        }
      })
    }
      else if(event == "Nothing"){
        let nothing = lodash.sample(locationindb.NoEvents)
        embed.setDescription(`${nothing}`)
          interaction.editReply({embeds: [embed], fetchReply: true})
      }
      else if(event == "Fine"){
        let fine = randomRange(1, 500)

        embed.setDescription(`You were fined $${fine} for speeding!`)
        let cash3 = userdata.cash
        let oldcash3 = cash3 -= fine

        if(oldcash3 < 0){
          userdata.cash = 0
        }
        else {
          userdata.cash -= fine
        }
        interaction.editReply({embeds: [embed], fetchReply: true})
        userdata.save()
      }
      else if(event == "Landmark"){
        let reward = randomRange(1, locationindb.Landmark.Reward)

        embed.setDescription(`You found **${locationindb.Name}'s** Landmark **${locationindb.Landmark.Name}*** and earned ${reward}!`)
        embed.setImage(`${locationindb.Landmark.Image}`)
        userdata.cash += reward
        userdata.landmarks.push(locationindb.Landmark.Name.toLowerCase())
        interaction.editReply({embeds: [embed], fetchReply: true})
        userdata.save()
      }
      else if(event == "Speedometer"){
        let speed3 = cartodrive.Speed / 2
        let topspeed = randomRange(1, speed3)

        embed.setDescription(`You found **${locationindb.Name}'s** <:location_speedometer:1175570810740682843> Speedometer! You achieved ${topspeed} MPH and earned $${topspeed}`)
        
        userdata.cash += topspeed
        if(topspeed > userdata.speedometer) {
          userdata.speedometer = topspeed

        }
        interaction.editReply({embeds: [embed], fetchReply: true})
        userdata.save()
      }
      else if(event == "NPC Job"){
        let actionrow = new ActionRowBuilder()
        .setComponents(
          new ButtonBuilder()
          .setCustomId("yesjob")
          .setLabel("Yes")
          .setStyle("Success"),
          new ButtonBuilder()
          .setCustomId("nojob")
          .setLabel("No")
          .setStyle("Danger")
        )
        let job = lodash.sample(locationindb.Jobs)
        console.log(job)
        embed.setDescription(`${job.Job}`)
        embed.setImage(`${job.Image}`)
        interaction.editReply({embeds: [embed], fetchReply: true, components: [actionrow]})
          

        let filter2 = (btnInt) => {
          return interaction.user.id === btnInt.user.id;
        };
  
        const collector2 = msg.createMessageComponentCollector({
          filter: filter2,
          time: 30000,
        });

        collector2.on('collect', async (i) => {
          if(i.customId =="yesjob"){
            let chance = job.chance
            let randomnum = randomRange(1, 100)

            if(randomnum <= chance){
              userdata.cash += job.Reward
              
              embed.setDescription(`You helped the NPC with their issue and succeeded! You earn $${job.Reward}`)
            }
            else {
              let cash2 = userdata.cash
              let oldcash2 = cash2 -= job.Reward

              if(oldcash2 < 0){
                userdata.cash = 0
              }
              else {
                userdata.cash -= job.Reward
              }
              embed.setDescription(`You helped the NPC with their issue and failed! You lost $${job.Reward}`)
            }
            interaction.editReply({embeds: [embed], components: []})
            userdata.save()


          }
          else if(i.customId =="nojob"){
            embed.setDescription(`NPC: Well fine then! Go away!`)
            interaction.editReply({embeds: [embed], components: []})

          }

        })
        

      }

      else if(event == "NPC Race"){
        let actionrow = new ActionRowBuilder()
        .setComponents(
          new ButtonBuilder()
          .setCustomId("yesrace")
          .setLabel("Yes")
          .setStyle("Success"),
          new ButtonBuilder()
          .setCustomId("norace")
          .setLabel("No")
          .setStyle("Danger")
        )
        let npcs = lodash.sample(locationindb.Racers)

        let npc = locationdb.NPCs.filter((npc1) => npc1.Name.toLowerCase() == npcs.toLowerCase())
        embed.setDescription(`${npc[0].Prompt}`)
        embed.setTitle(`${npc[0].Name} wants to race in their ${npc[0].Car.Logo} ${npc[0].Car.Name}`)
        embed.setImage(`${npc[0].Car.Image}`)
        embed.addFields(
          {
            name: `Speed`,
            value: `${npc[0].Car.Speed}`,
            inline: true
          },
          {
            name: `Acceleration`,
            value: `${npc[0].Car.Acceleration}s`,
            inline: true
          },
          {
            name: `Handling`,
            value: `${npc[0].Car.Handling}`,
            inline: true
          },
          {
            name: `Weight`,
            value: `${npc[0].Car.Weight}`,
            inline: true
          }

        )
         interaction.editReply({embeds: [embed], fetchReply: true, components: [actionrow]})

        let filter = (btnInt) => {
          return interaction.user.id === btnInt.user.id;
        };
  
        const collector = msg.createMessageComponentCollector({
          filter: filter,
          time: 10000,
        });

        collector.on('collect', async (i) => {
          interaction.editReply({embeds: [embed], components: [], fetchReply: true})
          if(i.customId =="yesrace"){
            embed.setThumbnail(`${cartodrive.Image}`)
            setTimeout(async () => {

              let hp = cartodrive.Speed
              let a = cartodrive.Acceleration
              let w = cartodrive.Weight
              let h = cartodrive.Handling

              let hp2 = npc[0].Car.Speed
              let a2 = npc[0].Car.Acceleration
              let w2 = npc[0].Car.Weight
              let h2 = npc[0].Car.Handling
              
              let sum = hp + hp / a + h + w / 100;

              let sum2 = hp2 + hp2 / a2 + h2 + w2 / 100;

              if(sum > sum2){
                embed.setTitle(`You won!`)
                embed.setDescription(`${npc[0].Lost}`)
                let cashwon = npc[0].Reward
                if(userdata.location == "peru" ){
                  cashwon = cashwon * 2
                }
               
                  userdata.cash += cashwon
                
              }
              else {
                embed.setTitle(`You lost!`)
                embed.setDescription(`${npc[0].Win}`)
                let cash = userdata.cash
                let oldcash = cash -= npc[0].Reward

                if(oldcash < 0){
                  userdata.cash = 0
                }
                else {
                  userdata.cash -= npc[0].Reward
                }
              }
              userdata.save()
              await i.editReply({embeds: [embed], fetchReply: true})
            }, 3000);
          }
        })
          
      }
    }, 5000);
    }
  },
};
