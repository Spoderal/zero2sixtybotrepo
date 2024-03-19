

const {
  EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const racedb = require("../data/races.json");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const Globals = require("../schema/global-schema");
let cardb = require("../data/cardb.json");
const lodash = require("lodash");
const { toCurrency, randomRange, isWeekend } = require("../common/utils");
const ms = require("pretty-ms");
const itemdb = require("../data/items.json");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const trackdb = require("../data/tracks.json")
const achievementdb = require("../data/achievements.json")
 const outfits = require("../data/characters.json")
 const { tipFooterRandom } = require("../common/tips");
 const partdb = require("../data/partsdb.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("race")
    .setDescription("Start a race from the menu")
    .addStringOption((option) =>
      option
        .setName("race")
        .setChoices(
          { name: `🚗 Street Race`, value: `streetrace` },
          { name: `🏁 Drag Race`, value: `dragrace` },
          { name: `🟢 Track Race`, value: `trackrace` },
          { name: `🌍 Cross Country`, value: `crosscountry` },
          { name: "🛻 Offroad Race", value: "offroad" },
          { name: "🚀 Car Series", value: "carseries" },
          { name: "🔧 Junk Race", value: "junkrace" },
          { name: "🚲 Motorcycle Madness", value: "motorcyclemad" },

        )
        .setRequired(true)
        .setDescription(`The race to start`)
    )
    .addStringOption((option) =>
    option
      .setName("car")
      .setDescription("The car ID to race with")
      .setRequired(true)
  )
    .addNumberOption((option) =>
      option
        .setName("tier")
        .setDescription("The tier to race")
        .setRequired(true)
        .setMaxValue(8)
        .setChoices(
          { name: `Tier 1`, value: 1 },
          { name: `Tier 2`, value: 2 },
          { name: `Tier 3`, value: 3 },
          { name: `Tier 4`, value: 4 },
          { name: `Tier 5`, value: 5 },
          { name: `Tier 6`, value: 6 },
          { name: `Tier 7`, value: 7 },
          { name: `Tier 8`, value: 8 }
        )
    ),

  // async autocomplete(interaction, client) {
  //   let userdata2 = await User.findOne({ id: interaction.user.id });
  //   let focusedValue = interaction.options.getFocused();
  //   let choices = userdata2.cars;
  //   let filtered = choices.filter((choice) =>
  //     choice.Name.toLowerCase().includes(focusedValue.toLowerCase())
  //   );
  //   let options;
  //   filtered = userdata2.cars;
  //   let filteredarr = [];
  //   for (let ca in filtered) {
  //     let carind = filtered[ca];
  //     filteredarr.push(carind.Name);
  //   }
  //   if (filteredarr.length > 25) {
  //     options = filteredarr.slice(0, 25);
  //   } else {
  //     options = filteredarr;
  //   }

  //   options = options.filter((option) =>
  //     option.toLowerCase().includes(focusedValue.toLowerCase())
  //   );

  //   await interaction.respond(
  //     options.map((choice) => ({ name: choice, value: choice.toLowerCase() }))
  //   );
  // },

  async execute(interaction) {
    let carsarray = [];
    let raceoption = interaction.options.getString("race");
    let playerrace
    let opponentrace
    const dorace = function(speed, acceleration, handling, weight) {
      // Define the importance of each factor
      var speedImportance = 0.30;
      var accelerationImportance = 0.25;
      var handlingImportance = 0.20;
      var weightImportance = 0.25;
  

  
      var normalizedSpeed = speed
      var normalizedAcceleration = acceleration  // Lower acceleration is better
      var normalizedHandling = handling 
      var normalizedWeight = weight / 100  // Lower weight is better
  
      // Calculate the final score
      var score = (speedImportance * normalizedSpeed +
                   accelerationImportance * normalizedAcceleration +
                   handlingImportance * normalizedHandling -
                   weightImportance - normalizedWeight);
  
      return score;
  }
  

  const dotrack = function(speed, acceleration, handling, weight) {
    // Define the importance of each factor
    var speedImportance = 0.10;
    var accelerationImportance = 0.20;
    var handlingImportance = 0.40;
    var weightImportance = 0.30;



    var normalizedSpeed = speed
    var normalizedAcceleration = acceleration  // Lower acceleration is better
    var normalizedHandling = handling 
    var normalizedWeight = weight / 100  // Lower weight is better

    // Calculate the final score
    var score = (speedImportance * normalizedSpeed +
                 accelerationImportance * normalizedAcceleration +
                 handlingImportance * normalizedHandling -
                 weightImportance - normalizedWeight);

    return score;
}
const dooffroad = function(speed, acceleration, handling, weight) {
  // Define the importance of each factor
  var speedImportance = 0.10;
  var accelerationImportance = 0.10;
  var handlingImportance = 0.30;
  var weightImportance = 0.50;



  var normalizedSpeed = speed
  var normalizedAcceleration = acceleration  // Lower acceleration is better
  var normalizedHandling = handling 
  var normalizedWeight = weight / 100  // Lower weight is better

  // Calculate the final score
  var score = (speedImportance * normalizedSpeed +
               accelerationImportance * normalizedAcceleration +
               handlingImportance * normalizedHandling +
               weightImportance + normalizedWeight);

  return score;
}
const dodrag = function(speed, acceleration, handling, weight) {
  // Define the importance of each factor
  var speedImportance = 0.30;
  var accelerationImportance = 0.50;
  var handlingImportance = 0.05;
  var weightImportance = 0.15;


  var normalizedSpeed = speed
  var normalizedAcceleration = acceleration  // Lower acceleration is better
  var normalizedHandling = handling 
  var normalizedWeight = weight / 100  // Lower weight is better

  // Calculate the final score
  var score = (speedImportance * normalizedSpeed +
    accelerationImportance * normalizedAcceleration +
    handlingImportance * normalizedHandling -
    weightImportance * normalizedWeight);

  return score;
}

    for (let car1 in cardb.Cars) {
      let caroj = cardb.Cars[car1];
      carsarray.push(caroj);
    }
    let globals = await Globals.findOne({});
    let timeout = 0
    let cooldowndata = await Cooldowns.findOne({ id: interaction.user.id })
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    userdata = await User.findOne({ id: interaction.user.id });
    let zpass =  userdata.zpass
    let usercars = userdata.cars;
    let idtoselect = interaction.options.getString("car").toLowerCase();

    let carsfiltered = [];
    for (let cr in userdata.cars) {
      let car = userdata.cars[cr];

      if (car.ID) {
        carsfiltered.push(car);
      }
    }

    let filteredcar = carsfiltered.filter(
      (car) => car.ID.toLowerCase() == idtoselect
    );

    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    if(cardb.Cars[selected.Name.toLowerCase()].Motorcycle && raceoption !== "motorcyclemad") return interaction.reply("You cant use a motorcycle for this race!")

    if(raceoption == "dyno"){
      let speed = selected.Speed
      let acceleration = selected.Acceleration
      let handling = selected.Handling
      let weight = selected.WeightStat
      let image = selected.Image || selected.Livery || cardb.Cars[selected.Name.toLowerCase()].Image

      let dyno = dorace(speed, acceleration, handling, weight)
      let dyno2 = dotrack(speed, acceleration, handling, weight)
      let dyno3 = dodrag(speed, acceleration, handling, weight)

      let dynoembed = new EmbedBuilder()
      .setTitle("Dyno")
      .setDescription(`The dyno is a tool to measure your car's performance in races according to the formula.\n\nYour cars performance on\n\n**Street Races:** ${Math.round(dyno)}\n**Track Races:** ${Math.round(dyno2)}\n**Drag Races:** ${Math.round(dyno3)}`)
      .setColor(colors.blue)
      .setThumbnail("https://i.ibb.co/86Gq9Cs/icon-dyno.png")
      .setImage(`${image}`)
      .setFields(
        {name: "Power", value: `${selected.Speed} HP`, inline: true},
        {name: "Acceleration", value: `${selected.Acceleration}s`, inline: true},
        {name: "Weight", value: `${selected.WeightStat} lbs`, inline: true},
        {name: "Handling", value: `${selected.Handling}`, inline: true},
      )

      return interaction.reply({embeds: [dynoembed]})
    }

    if(zpass == true) {
      timeout = 15 * 1000
    } else {
      timeout = 30 * 1000
    } 
    if (
      cooldowndata.racing !== null &&
      timeout - (Date.now() - cooldowndata.racing) > 0
    ) {

      let row = new ActionRowBuilder()
      .setComponents(
        new ButtonBuilder()
        .setCustomId("clearcooldown")
        .setLabel("Clear Cooldown")
        .setStyle("Secondary")
        .setEmoji("🪙")
      )


      let time = ms(timeout - (Date.now() - cooldowndata.racing));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`You can race again in ${time}\n\nYou can clear this cooldown for 10 gold!`);
      await interaction.reply({ embeds: [timeEmbed], fetchReply: true, components: [row]})

      let filter2 = (btnInt) => {
        return interaction.user.id == btnInt.user.id;
      };

      let collector2 = interaction.channel.createMessageComponentCollector({
        filter: filter2,
        time: 30000,
      });

      collector2.on('collect', async (i) => {
        if(i.customId == "clearcooldown"){
          if(userdata.gold < 10){
            let errembed = new EmbedBuilder()
            .setTitle("Error!")
            .setColor(colors.discordTheme.red)
            .setDescription(
              `You need 10 gold to clear this cooldown!`
            );
          return await interaction.editReply({ embeds: [errembed] });
          }
          userdata.gold -= 10
          cooldowndata.racing = null
          await cooldowndata.save()
          await userdata.save()
          let successembed = new EmbedBuilder()
          .setTitle("Success!")
          .setColor(colors.discordTheme.green)
          .setDescription(
            `Cleared the cooldown for 10 gold!`
          );
        return await interaction.editReply({ embeds: [successembed] });
        }
      })


      
    }
    else {

    
    let timeout2 = 600000


    
    if (
      cooldowndata.racedisabled !== null &&
      timeout2 - (Date.now() - cooldowndata.racedisabled) > 0
    ) {
      let time = ms(timeout2 - (Date.now() - cooldowndata.racedisabled));
      let timeEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription(`You can race again in ${time}`);
      return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }

    
    if (cardb.Cars[selected.Name.toLowerCase()].Junked == true && raceoption !== "junkrace") {
      let errembed = new EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `You need to restore this car before you can race with it in races other than junk race! Use \`/restore\``
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    if (cardb.Cars[selected.Name.toLowerCase()].F1 == true && raceoption !== "trackrace") {
      let errembed = new EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `You can only use F1 cars in /trackrace`
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    if (selected.Impounded && selected.Impounded == true) {
      return interaction.reply(
        "This car is impounded! Use /impound to unimpound it."
      );
    }
    if (selected.Gas <= 0)
    return interaction.reply(
      `You're out of gas! Use \`/gas\` to fill up for the price of gas today! Check the daily price of gas with \`/bot\``
    );
    let tieroption = interaction.options.getNumber("tier");
    if(raceoption == "spacerace"){
      let tires = selected.tires || "none"
      if(tires.toLowerCase() !== "t1spacetires"){
        return interaction.reply("You need to use space tires for this race!")
      }
    }
    if(raceoption == "cityrace"){
      if(selected.Speed > 350) return interaction.reply("Your car needs to be under 350 Power to do this race!")
    }
  if(!tieroption) return interaction.reply("You need to select a tier!")

    cooldowndata.racing = Date.now();
    cooldowndata.is_racing = Date.now();
    await cooldowndata.save();
    let msg =  await interaction.reply({content: `Revving engines...`, fetchReply: true})

    let image = selected.Image || cardb.Cars[selected.Name.toLowerCase()].Image
    if(raceoption == "trackrace"){
      cooldowndata.racing = Date.now()
      await cooldowndata.save()
      let trackembed = new EmbedBuilder()
      .setTitle("Select a track")
      .setFields({name: `Nürburgring`, value: `Hard`, inline: true}, {name: "Your car", value: `${selected.Emote} ${selected.Name}\n${emotes.speed}${selected.Speed}\n${emotes.acceleration}${selected.Acceleration}\n${emotes.handling}${selected.Handling}\n${emotes.weight}${selected.WeightStat}`, inline: true})
      .setImage("https://i.ibb.co/86WyCHX/image.png")
      .setColor(colors.blue)
      .setThumbnail(`${image}`)

      let row2 = new ActionRowBuilder()
        .setComponents(
          new StringSelectMenuBuilder()
          .setCustomId("track")
          .setPlaceholder("Track")
          .setOptions(
            {label: "Spa-Francorchamps", value: "spafrancorchamps"},
            {label: "Suzuka", value: "suzuka"},
            {label: "Nürburgring", value: "nurburgring"},
            {label: "Silverstone", value: "silverstone"}
          ),
        )

        let row3 = new ActionRowBuilder()
        .setComponents(
          new ButtonBuilder()
          .setCustomId("confirm")
          .setLabel("Confirm")
          .setStyle("Success")
        )

       await interaction.editReply({embeds: [trackembed], components: [row2, row3], fetchReply: true})

      let filter = (btnInt) => {
        return interaction.user.id == btnInt.user.id;
      };
      const collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 30000,
      });
      let newtrack = trackdb.nurburgring
      let weather = [
        {
          Name:"Sunny",
          Emote:"☀️",
          Control:1
        },

            {
          Name:"Snowing",
          Emote:"🌨️",
          Control:20
        },
        {
          Name:"Raining",
          Emote:"🌧️",
          Control:10
        },

      ]
      collector.on('collect', async (i) => {
     
        if(i.customId !== "confirm" && i.values[0]){
          

          
        
          
        

          newtrack = trackdb[i.values[0]]

          trackembed.setImage(newtrack.Image)
          .setFields({name: `${newtrack.Name}`, value: `${newtrack.Difficulty}`, inline: true}, {name: "Your car", value: `${selected.Emote} ${selected.Name}\n${emotes.speed}${selected.Speed}\n${emotes.acceleration}${selected.Acceleration}\n${emotes.handling}${selected.Handling}\n${emotes.weight}${selected.WeightStat}`, inline: true})

          await interaction.editReply({embeds: [trackembed], components: [row2, row3], fetchReply: true})
        }
        if(i.customId == "confirm"){

     
          let cashwinnings = 0
          let oppcount = newtrack.Racers
          let weath = lodash.sample(weather)
          trackembed.setImage(newtrack.Image)
          trackembed.data.fields = []
          let racers = []
          trackembed.addFields( {name: "Your car", value: `${selected.Emote} ${selected.Name}\n${emotes.speed}${selected.Speed}\n${emotes.acceleration}${selected.Acceleration}\n${emotes.handling}${selected.Handling}\n${emotes.weight}${selected.WeightStat}`, inline: true})
          .setTitle(`Racing on ${newtrack.Name} ${weath.Emote}`)
           for (let i = 0; i < oppcount; i++) {
            cashwinnings += 250
            let carstopick = carsarray.filter((car) => car.Class == newtrack.Class && car.Handling >= newtrack.Handling)
            if(cardb.Cars[selected.Name.toLowerCase()].F1){
              carstopick = carsarray.filter((car) => car.F1 == true)
            }
            let randcar = lodash.sample(carstopick)
            trackembed.addFields(
              {name: `Opponent ${i + 1}`, 
              value: `${randcar.Emote} ${randcar.Name}\n${emotes.speed}${randcar.Speed}\n${emotes.acceleration}${randcar["0-60"]}\n${emotes.handling}${randcar.Handling}\n${emotes.weight}${randcar.Weight}`, 
              inline: true})
            
              let carobj = {
                Emote: randcar.Emote,
                Name: randcar.Name,
                Speed: randcar.Speed,
                Acceleration: randcar["0-60"],
                Weight: randcar.Weight,
                Handling: randcar.Handling,
                Image: randcar.Image,
                Owner: i + 1
              }

              racers.push(carobj)
         }



          await interaction.editReply({embeds: [trackembed], components: [], fetchReply: true})

          let formulauser = (((selected.Speed / 20) / selected.Acceleration) + (selected.Handling) - (selected.WeightStat / 100) ) / weath.Control
         let racersformulas = []
          racersformulas.push({User: interaction.user.username, Score: formulauser, Image: `${image}`})
          for(let car in racers){
            let racercar = racers[car]
            let formulabot= (((racercar.Speed / 20) / racercar.Acceleration) + (racercar.Handling) - (racercar.Weight / 100) ) / weath.Control
            racersformulas.push({User: `Opponent ${racercar.Owner}`, Score: formulabot, Image: `${racercar.Image}`})

          }

          racersformulas.sort(function(a, b){return b.Score - a.Score});



          setTimeout(async () => {
            trackembed.setTitle(`${racersformulas[0].User} won!`)
            trackembed.setThumbnail(`${racersformulas[0].Image}`)

            

            if(racersformulas[0].User == interaction.user.username){
              let rewards = []
              if(isWeekend()){
                cashwinnings = cashwinnings * 2
              }
              rewards.push(`${toCurrency(cashwinnings)}`)

              if(newtrack.Name == "Spa-Francorchamps"){
                rewards.push(`${emotes.commonKey} 5`)
                userdata.ckeys += 5
              }
              if(newtrack.Name == "Suzuka"){
                rewards.push(`${emotes.rareKey} 3`)
                userdata.rkeys += 3
              }
              if(newtrack.Name == "Nürburgring"){
                rewards.push(`${emotes.exoticKey} 1`)
                userdata.ekeys += 1
              }
              if(newtrack.Name == "Silverstone"){
                rewards.push(`${emotes.exoticKey} 3`)
                userdata.ekeys += 3
              }
              let trackkeys = oppcount
              if(zpass == true) {
                cashwinnings = cashwinnings * 2
              }
              if (userdata.using.includes("radio")) {
                let itemcooldown = cooldowndata.radio;
      
                let timeout = 300000;
                if (
                  itemcooldown !== null &&
                  timeout - (Date.now() - itemcooldown) < 0
                ) {
                  userdata.using.pull("radio");
                  userdata.update();
                  interaction.channel.send("Your radio ran out!");
                } else {
                  let amounthead = 2
                  if(userdata.items.includes("headphones")){
                    amounthead = 4
                  }
                  cashwinnings = cashwinnings * amounthead;
                }
              }
         
              let xpwon = 10 * tieroption;
              console.log(`XP won: ${xpwon}`)
              if(isWeekend()){
                xpwon = xpwon * 2
                cashwinnings = cashwinnings * 2
                rewards.push("Double Cash & XP Weekend")
              }
              let skill = userdata.skill
              let requiredxp = 100 * skill
              rewards.push(`<:tracklegends:1072357967652995174> ${trackkeys} Track Keys`)
              cashwinnings = cashwinnings * 2
              userdata.cash += cashwinnings
              userdata.trackkeys += trackkeys
              userdata.xp += xpwon
              rewards.push(`${emotes.xp} ${xpwon}`)

              if (userdata.xp >= requiredxp) {
                userdata.skill += 1;
                userdata.xp = 0;
               rewards.push(`🆙 Skill Level Up!`)
              }
              

              userdata.save()
              trackembed.setDescription(`${rewards.join('\n')}`)
            }

            await interaction.editReply({embeds: [trackembed]})
          }, 5000);
          
        }
      })


    }
   
    else {

    

    let canrace = 600000;
    if (
      userdata.canrace !== null &&
      canrace - (Date.now() - userdata.canrace) > 0
    ) {
      let time = ms(canrace - (Date.now() - userdata.canrace));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`You can race again in ${time}`);
      return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }
    cooldowndata.bounty = Date.now();

 
    let car2;


    


    const domotor = function(speed, acceleration, handling, weight) {
      // Define the importance of each factor
      var speedImportance = 0.10;
      var accelerationImportance = 0.25;
      var handlingImportance = 0.25;
      var weightImportance = 0.10;
  
    
      var normalizedSpeed = speed
      var normalizedAcceleration = acceleration  // Lower acceleration is better
      var normalizedHandling = handling 
      var normalizedWeight = weight / 10  // Lower weight is better
  
      // Calculate the final score
      var score = (speedImportance * normalizedSpeed +
        accelerationImportance * normalizedAcceleration +
        handlingImportance * normalizedHandling -
        weightImportance * normalizedWeight);
  
      return score;
  }
    let cartofilter = [];
    if (tieroption == 1) {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 300 && car.Class == "D"
      );
    } else if (tieroption == 2) {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 400 && car.Class == "C"
      );
    } else if (tieroption == 3) {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 500 && car.Class == "B"
      );
    } else if (tieroption == 4) {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 600 && car.Class == "A"
      );
    } else if (tieroption == 5) {
      cartofilter = carsarray.filter(
        (car) =>
          (car.Speed <= 700 && car.Class == "A") ||
          (car.Speed <= 700 && car.Class == "S")
      );
    } else if (tieroption == 6) {
      cartofilter = carsarray.filter(
        (car) =>
          (car.Speed <= 800 && car.Class == "A") ||
          (car.Speed <= 800 && car.Class == "S")
      );
    } else if (tieroption == 7) {
      cartofilter = carsarray.filter(
        (car) =>
          (car.Speed <= 900 && car.Class == "A") ||
          (car.Speed <= 900 && car.Class == "S")
      );
    } else if (tieroption == 8) {
      cartofilter = carsarray.filter(
        (car) =>
          (car.Speed >= 1000 && car.Class == "A") ||
          (car.Speed >= 1000 && car.Class == "S")
      );
    }
 


    if (tieroption == 1 && raceoption == "junkrace") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 200 && car.Junked
      );
    } else if (tieroption == 2 && raceoption == "junkrace") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 200 && car.Junked
      );
    } else if (tieroption == 3 && raceoption == "junkrace") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 300 && car.Junked
      );
    } else if (tieroption == 4 && raceoption == "junkrace") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 400 && car.Junked
      );
    } else if (tieroption == 5 && raceoption == "junkrace") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 450 && car.Junked
      );
    } else if (tieroption == 6 && raceoption == "junkrace") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 500 && car.Junked
      );
    } else if (tieroption == 7 && raceoption == "junkrace") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 600 && car.Junked
      );
    } else if (tieroption == 8 && raceoption == "junkrace") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 700 && car.Junked
      );
    }

    if (tieroption == 1 && raceoption == "offroad") {
      cartofilter = carsarray.filter(
        (car) => car.Weight >= 3000
      );
    } else if (tieroption == 2 && raceoption == "offroad") {
      cartofilter = carsarray.filter(
        (car) => car.Weight >= 4000
      );
    } else if (tieroption == 3 && raceoption == "offroad") {
      cartofilter = carsarray.filter(
        (car) => car.Weight >= 4200
      );
    } else if (tieroption == 4 && raceoption == "offroad") {
      cartofilter = carsarray.filter(
        (car) => car.Weight >= 4500
      );
    } else if (tieroption == 5 && raceoption == "offroad") {
      cartofilter = carsarray.filter(
        (car) => car.Weight >= 5000
      );
    } else if (tieroption > 5 && raceoption == "offroad")
    return interaction.editReply("The max tier for this race is 5!");

    if (tieroption == 1 && raceoption == "motorcyclemad") {
      cartofilter = carsarray.filter(
        (car) => car.Motorcycle && car.Speed <= 150
      );
    } else if (tieroption == 2 && raceoption == "motorcyclemad") {
      cartofilter = carsarray.filter(
        (car) => car.Motorcycle && car.Speed <= 200
      );
    } else if (tieroption == 3 && raceoption == "motorcyclemad") {
      cartofilter = carsarray.filter(
        (car) => car.Motorcycle && car.Speed <= 300
      );
    } else if (tieroption > 3 && raceoption == "motorcyclemad")
      return interaction.editReply("The max tier for this race is 3!");
    else if (
      raceoption == "motorcyclemad" &&
      !cardb.Cars[selected.Name.toLowerCase()].Motorcycle
    )
      return interaction.editReply("You need a motorcycle for this race!");

      car2 = lodash.sample(cartofilter);
      let speed2 = car2.Speed
      let handling2 = car2.Handling
      let prestige = userdata.prestige
  
      let winner;
    let rewards = [];
      let mclarenkey = false
    if (raceoption == "streetrace" || raceoption == "spacerace") {
      let mclarenrandom = randomRange(1, 100)

      if(mclarenrandom <= 10){
        mclarenkey = true
      }
   

      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];



       playerrace = dorace(speed, acceleration, handling, weight);
       opponentrace = dorace(speed2, acceleration2, handling2, weight2);

      console.log(playerrace)
      console.log(opponentrace)

      winner = playerrace > opponentrace;


    } else if (raceoption == "offroad") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];

      let handscore = handling
      let handscore2 = handling2

      let speedscore = speed 
      let speedscore2 = speed2 

      if (
        cardb.Cars[selected.Name.toLowerCase()].Drivetrain &&
        cardb.Cars[selected.Name.toLowerCase()].Drivetrain == "AWD"
      ) {
        speedscore += 100;
      } else {
        speedscore -= 100;
      }

      if (
        cardb.Cars[car2.Name.toLowerCase()].Drivetrain &&
        cardb.Cars[car2.Name.toLowerCase()].Drivetrain == "AWD"
      ) {
        speedscore += 100;
      } else {
        speedscore -= 10;
      }

       playerrace = dooffroad(speedscore, acceleration, weight, handscore);
       opponentrace = dooffroad(
        speedscore2,
        acceleration2,
        weight2,
        handscore2
      );

      winner = playerrace > opponentrace;


    } else if (raceoption == "dragrace") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];

      

       playerrace = dodrag(speed, acceleration, handling, weight);
       opponentrace = dodrag(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

    } else if (raceoption == "trackrace") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];


       playerrace = dotrack(speed, acceleration, handling, weight);
       opponentrace = dotrack(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

    } else if (raceoption == "trackraceevent") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];

    

       playerrace = dotrack(speed, acceleration, handling, weight);
       opponentrace = dotrack(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;


    }
    //test
    else if (raceoption == "motorcyclemad") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];

       playerrace = domotor(speed, acceleration, handling, weight);
       opponentrace = domotor(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

    } else if (raceoption == "carseries") {
      let ticketscool = cooldowndata.series1tickets;
      let timeoutfor =  86400000
      if (
        userdata.seriestickets == 0 &&
        timeoutfor - (Date.now() - ticketscool) < 0
      ) {
        userdata.seriestickets = 10;
        cooldowndata.series1tickets = Date.now()
        userdata.save()
        cooldowndata.save()
        return interaction.editReply("Your series tickets have been refilled!")
      }
      if (userdata.seriestickets <= 0) return interaction.editReply("You need a series ticket to race!");

      if (!cardb.Cars[selected.Name.toLowerCase()].Series)
        return interaction.channel.send("You need to use a series car!");

      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;

  

       playerrace = dorace(speed, acceleration, handling, weight);
       opponentrace = dorace(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;


    } else if (raceoption == "crosscountry") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];


       playerrace = dorace(speed, acceleration, handling, weight);
       opponentrace = dorace(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;


    } else if (raceoption == "junkrace") {
      if (
        !cardb.Cars[selected.Name.toLowerCase()].RestoreOnly &&
        !cardb.Cars[selected.Name.toLowerCase()].restored
      )
        return interaction.editReply("You need to use a barn find!");

      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];



     playerrace = dorace(speed, acceleration, handling, weight);
     opponentrace = dorace(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;


    }
    let randombarn = randomRange(1, 20);


    let randcar = randomRange(1, 10);
    let possiblekey = randomRange(1, 15);
    let raceindb = racedb[raceoption.toLowerCase()];
    let cashwon = tieroption * raceindb.Reward;
    if(userdata.premium == true) {
      cashwon = cashwon * 1.5
    }
    let rpwon = 10;
    if (prestige) {
      let prestigebonus = prestige * 0.1;

      cashwon = cashwon += cashwon * prestigebonus;
    }
    let carimg = selected.Image || cardb.Cars[selected.Name.toLowerCase()].Image;
    let userpfp = userdata.helmet || "default";

    if(!outfits.Helmets[userpfp.toLowerCase()]){
      userdata.helmet = "default"
      userpfp = "default";
    }

    let embed = new EmbedBuilder()
      .setTitle(`Racing tier ${tieroption} ${raceindb.Name}`)
      .setImage(`${carimg}`)
      .setThumbnail(`${car2.Image}`)
      .setColor(colors.blue)
      .setFooter(tipFooterRandom)
      .addFields(
        {
          name: `${outfits.Helmets[userpfp.toLowerCase()].Emote} Your ${
            selected.Emote
          } ${selected.Name}`,
          value: `${emotes.speed} HP: ${selected.Speed}\n${emotes.acceleration} Acceleration: ${selected.Acceleration}s\n${emotes.handling} Handling: ${selected.Handling}\n${emotes.weight} Weight: ${selected.WeightStat}`,
          inline: true,
        },
        {
          name: `${car2.Emote} ${car2.Name}`,
          value: `${emotes.speed} HP: ${speed2}\n${
            emotes.acceleration
          } Acceleration: ${car2[`0-60`]}s\n${emotes.handling} Handling: ${
            handling2
          }\n${emotes.weight} Weight: ${car2.Weight}`,
          inline: true,
        }
      )

      let row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
          .setStyle("Link")
          .setEmoji("<:zpass:1200657440304283739>")
          .setLabel("Buy Z Pass")
          .setURL("https://www.patreon.com/zero2sixtybot")
      );
      
      let randor = randomRange(0, 2)


    selected.Gas -= 1;
    if (selected.Gas <= 0) {
      selected.Gas = 0;
    }
    await User.findOneAndUpdate(
      {
        id: interaction.user.id,
      },
      {
        $set: {
          "cars.$[car]": selected,
        },
      },

      {
        arrayFilters: [
          {
            "car.Name": selected.Name,
          },
        ],
      }
    );


    if(randor == 1 && zpass == false){
      
      await interaction.editReply({ embeds: [embed], fetchReply: true, components: [row] });
    }
    else {
      await interaction.editReply({ embeds: [embed], fetchReply: true });

    }

   let xt =  setTimeout(async () => {
    let xpwon = 10 * tieroption;
    console.log(`XP won: ${xpwon}`)
    console.log(`Weekend: ${isWeekend()}`)
    if(isWeekend()){
      xpwon = xpwon * 2
      cashwon = cashwon * 2
      rewards.push("Double Cash & XP Weekend")

    }

      let notorietywon = 100;
      if (userdata.using.includes("reverse card")) {
        let itemcooldown = cooldowndata.reverse;

        let timeout = 120000;
        if (
          itemcooldown !== null &&
          timeout - (Date.now() - itemcooldown) < 0
        ) {
          userdata.using.pull("reverse card");
          userdata.update();
          interaction.channel.send("Your reverse card ran out!");
        } else {
          winner = true
        }
      }
      if (winner == true) {
        let houses = userdata.houses

     
        let house1 = houses.filter((house) => house.Name == "Casa Sul Lago")
        let house2 = houses.filter((house) => house.Name == "Casa Haus")
        let house3 = houses.filter((house) => house.Name == "Casa Tranquilla")
        let house4 = houses.filter((house) => house.Name == "Buone Vedute")
        let house5 = houses.filter((house) => house.Name == "Casa Della Pace")
        let house6 = houses.filter((house) => house.Name == "Castello Verde")
        let house7 = houses.filter((house) => house.Name == "Patrimonio Dell'Appartamento")

        if(house1[0]){
          notorietywon = notorietywon * 2
        }
        if(house2[0]){
          let rando = lodash.sample(["yes", "no"])
          if(rando == "yes"){
            rewards.push(`${emotes.lockpicks} 1 Lockpick`)
            userdata.lockpicks += 1

          }
        }
        if(house3[0] && raceoption == "dragrace"){
          cashwon = cashwon += (cashwon * 0.05)
        }
        if(house4[0] && raceoption == "streetrace"){
          cashwon = cashwon += (cashwon * 0.05)
        }
        if(house5[0]){
          rpwon = rpwon * 2
        }
        if(house6[0] && raceoption == "crosscountry"){
          cashwon = cashwon += (cashwon * 0.10)
        }
        if(house7[0] && raceoption == "streetrace"){
          cashwon = cashwon += (cashwon * 0.10)
        }
        clearTimeout(xt)
        let rating = selected.Rating || 1
        if (userdata.items.includes("camera")) {
          rating += 1;
        }

        xpwon = xpwon * rating
        if (userdata.using.includes("flat tire")) {
          let itemcooldown = cooldowndata.flattire;

          let timeout = 1800000;
          if (
            itemcooldown !== null &&
            timeout - (Date.now() - itemcooldown) < 0
          ) {
            userdata.using.pull("flat tire");
            userdata.update();
            interaction.channel.send("Your flat tire ran out!");
          } else {
            cashwon += cashwon * 0.05;
          }
        }
        if (userdata.using.includes("fruit punch")) {

          xpwon * 2
          
        }
        if (userdata.using.includes("tequila shot")) {
          let itemcooldown = cooldowndata.tequilla;
          let timeout = 60000;
          if (
            itemcooldown !== null &&
            timeout - (Date.now() - itemcooldown) < 0
          ) {
            userdata.using.pull("tequila shot");
            userdata.update();
            interaction.channel.send("Your tequila shot ran out!");
          } else {
            cashwon = cashwon * 5;
          
          }
        }

        if (userdata.using.includes("radio")) {
          let itemcooldown = cooldowndata.radio;

          let timeout = 300000;
          if (
            itemcooldown !== null &&
            timeout - (Date.now() - itemcooldown) < 0
          ) {
            userdata.using.pull("radio");
            userdata.update();
            interaction.channel.send("Your radio ran out!");
          } else {
            let amounthead = 2
            if(userdata.items.includes("headphones")){
              amounthead = 4
            }
            cashwon = cashwon * amounthead;
            rpwon = rpwon * amounthead;
            xpwon *= amounthead
          }
        }
        if (userdata.items.includes("record")) {
          xpwon *= 2
          
        }
        if (userdata.using.includes("energy drink")) {
          let itemcooldown = cooldowndata.energydrink;

          let timeout = 600000;
          if (
            itemcooldown !== null &&
            timeout - (Date.now() - itemcooldown) < 0
          ) {
            userdata.using.pull("energy drink");
            userdata.update();
            interaction.channel.send("Your energy drink ran out!");
          } else {
            rpwon = rpwon * 2;
          }
        }

        if (userdata.using.includes("cookie")) {
          let itemcooldown = cooldowndata.cookie;

          let timeout = 300000;
          if (
            itemcooldown !== null &&
            timeout - (Date.now() - itemcooldown) < 0
          ) {
            userdata.using.pull("cookie");
            userdata.update();
            interaction.channel.send("Your cookie ran out!");
          } else {
            rpwon = rpwon * 3;
          }
        }

        if (userdata.using.includes("compass")) {
          let itemcooldown = cooldowndata.compass;

          let timeout = 1200000;
          if (
            itemcooldown !== null &&
            timeout - (Date.now() - itemcooldown) < 0
          ) {
            userdata.using.pull("compass");
            userdata.update();
            interaction.channel.send("Your compass ran out!");
          } else {
            let chancer = randomRange(1, 10);

            if (chancer == 5) {
              cashwon = cashwon * 2;
              notorietywon = notorietywon * 2;
            }
          }
        }

        let usercrew = userdata.crew;

        let crews = globals.crews;

        if (usercrew) {
          let rpbonus = 0;
          let crew = crews.filter((cre) => cre.name == usercrew.name);

          let timeout = 14400000;
          let timeout2 = 7200000;
          let timeout3 = 3600000;

          if (
            crew[0] && crew[0].Cards[0].time !== null &&
            timeout - (Date.now() - crew[0].Cards[0].time) < 0
          ) {
            console.log("no card");
          } else {
            rpbonus += 0.2;
          }

          if (
            crew[0] && crew[0].Cards[1].time !== null &&
            timeout2 - (Date.now() - crew[0].Cards[1].time) < 0
          ) {
            console.log("no card");
          } else {
            rpbonus += 0.5;
          }

          if (
            crew[0] && crew[0].Cards[2].time !== null &&
            timeout3 - (Date.now() - crew[0].Cards[2].time) < 0
          ) {
            console.log("no card");
          } else {
            rpbonus += 1.2;
          }

          if (rpbonus > 0) {
            rpwon = rpwon += rpwon * rpbonus;
          }
        }





        if (raceoption == "junkrace") {
          let randomr = randomRange(1, 50);
          let restparts = [
            "j1exhaust",
            "j1engine",
            "j1suspension",
            "j1intake",
            "body",
          ];

          let randomrest = lodash.sample(restparts);

          rewards.push(randomrest);

          userdata.parts.push(randomrest);

          if (randomr <= 10) {
            let parts = ["t6exhaust", "t6tires", "t6turbo"];

            let randompart = lodash.sample(parts);

            userdata.parts.push(randompart);

            rewards.push(`T6 Part!`);
          }

       
        }

        if (raceoption == "crosscountry") {
          let randomr = randomRange(1, 2);
        
         
          if(randomr == 1){
            if (tieroption < 5) {
  
              rewards.push(`${emotes.wheelSpin} Wheelspin`);
              userdata.wheelspins += 1
  
            }
            else if(tieroption >= 5) {
              rewards.push(`${emotes.superWheel} Super Wheelspin`);
  
              userdata.swheelspins +=1 
            }

          }

       
        }

        if(raceoption == "offroad"){
          notorietywon = Number(tieroption) * 50
          let houses = userdata.houses
          let house1 = houses.filter((house) => house.Name.toLowerCase() == "casa sul lago")
          if(house1[0]){
            notorietywon = notorietywon * 2
          }
          rewards.push(`${emotes.notoriety} ${notorietywon}`);

          userdata.notoriety += notorietywon;
        }
        cashwon = cashwon * 2

        userdata.cash += cashwon;

        let cratechance = randomRange(1, 30);
     
        if (cratechance >= 15) {
          rewards.push(`<:supplydrop:1044404467119960085> Common Crate`);
          userdata.items.push("common crate");
        }
        else if(cratechance <= 10){
          rewards.push(`<:supplydrop_item:1211181953982791720> Item Crate`);
          userdata.items.push("item crate");
        }
        else if (cratechance <= 5) {
          rewards.push(`<:supplydroprare:1044404466096537731> Rare Crate`);
          userdata.items.push("rare crate");
        } else {
          rewards.push("No crate");
        }
        if (raceoption == "trackrace" && possiblekey == 10 && tieroption <= 2) {
          let randomamount = randomRange(1, 3);
          if (userdata.using.includes("milk")) {
            let itemcooldown = cooldowndata.milk;

            let timeout = 600000;
            if (
              itemcooldown !== null &&
              timeout - (Date.now() - itemcooldown) < 0
            ) {
              userdata.using.pull("milk");
              userdata.update();
              interaction.channel.send("Your milk ran out!");
            } else {
              randomamount = randomamount * 2;
            }
          }
          rewards.push(`${emotes.commonKey} ${randomamount}`);
          userdata.ckeys += randomamount;
        } else if (
          raceoption == "trackrace" &&
          possiblekey == 10 &&
          tieroption <= 4
        ) {
          let randomamount = randomRange(1, 3);
          if (userdata.using.includes("strawberry milk")) {
            let itemcooldown = cooldowndata.smilk;

            let timeout = 600000;
            if (
              itemcooldown !== null &&
              timeout - (Date.now() - itemcooldown) < 0
            ) {
              userdata.using.pull("strawberry milk");
              userdata.update();
              interaction.channel.send("Your strawberry milk ran out!");
            } else {
              randomamount = randomamount * 2;
            }
          }
          rewards.push(`${emotes.rareKey} ${randomamount}`);
          userdata.rkeys += randomamount;
        } else if (
          raceoption == "trackrace" &&
          possiblekey == 10 &&
          tieroption >= 5
        ) {
          let randomamount = randomRange(1, 3);
          if (userdata.using.includes("chocolate milk")) {
            let itemcooldown = cooldowndata.cmilk;

            let timeout = 600000;
            if (
              itemcooldown !== null &&
              timeout - (Date.now() - itemcooldown) < 0
            ) {
              userdata.using.pull("chocolate milk");
              userdata.update();
              interaction.channel.send("Your chocolate milk ran out!");
            } else {
              randomamount = randomamount * 3;
            }
          }
          rewards.push(`${emotes.rareKey} ${randomamount}`);
          userdata.rkeys += randomamount;
        }
        if (raceoption == "dragrace") {
          if(tieroption <= 3){
            rewards.push(`${emotes.barnMapCommon}`)
            userdata.barnmaps += 1;
          }
          else if(tieroption >= 4){
            rewards.push(`${emotes.barnMapCommon}`)
            userdata.barnmaps += 2;
          }
          
        }
        if (prestige > 0) {
          rpwon = rpwon += rpwon * (prestige * 0.1);
        }
        rewards.push(`${emotes.rp} + ${rpwon} RP`);
        userdata.rp += rpwon;
        if (raceoption == "dragrace" && randombarn == 10) {
          let randomamount = 1;
          rewards.push(`${emotes.barnMapCommon} ${randomamount}`);
          userdata.barnmaps += randomamount;
        }

        if (raceoption == "trackraceevent" && randcar >= 6) {
          let filteredcar = usercars.filter((car) => car.Name == car2.Name);

          if (!filteredcar[0]) {
            let carobj = {
              ID: car2.alias,
              Name: car2.Name,
              Speed: car2.Speed,
              Acceleration: car2["0-60"],
              Handling: car2.Handling,
              Parts: [],
              Emote: car2.Emote,
              Livery: car2.Image,
              Miles: 0,
              WeightStat: car2.Weight,
              Gas: 10,
              MaxGas: 10,
            };
            rewards.push(`${carobj.Emote} ${carobj.Name} Won!`);
            userdata.cars.push(carobj);
          }
        }
        if (raceoption == "carseries") {
          rewards.push(`+1 Wins`);
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car].Wins": (selected.Wins += 1),
              },
            },

            {
              arrayFilters: [
                {
                  "car.Name": selected.Name,
                },
              ],
            }
          );

          userdata.seriestickets -= 1;
        }

        if (userdata.autogas == true && selected.Gas <= 0) {
          let gasprice = globals.gas;
          console.log("autogas")
          let totalprice = Math.round(gasprice * 10);

          if (userdata.cash < totalprice)
            return interaction.channel.send(
              "You have auto gas enabled, but you cant afford to fill your car!"
            );

          userdata.cash -= totalprice;

          selected.Gas = 10

          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car]": selected,
              },
            },

            {
              arrayFilters: [
                {
                  "car.Name": selected.Name,
                },
              ],
            }
          );

          console.log("gassed")

        }
       
          let itemtier = randomRange(1, 3);
          let itemchance = randomRange(1, 10)
          console.log(itemchance)
          if (itemchance >= 5) {
            let itemarr = [];
            for (let i in itemdb) {
              if (
                itemdb[i].Findable == true &&
                itemdb[i].Tier && itemdb[i].Tier == itemtier
              ) {
                itemarr.push(itemdb[i]);
              }
            }
            let randomItem = lodash.sample(itemarr);
            rewards.push(`${randomItem.Emote} ${randomItem.Name}`);
            if(userdata.items.includes("cool stick")){
              let randomItem2 = lodash.sample(itemarr);
              let items = userdata.items
              for (var i7 = 0; i7 < 1; i7++) items.splice(items.indexOf("cool stick"), 1);

              rewards.push(`${randomItem2.Emote} ${randomItem2.Name}`);
              userdata.items.push(randomItem2.Name.toLowerCase());

            }
            
            
            
            userdata.items.push(randomItem.Name.toLowerCase());
          }
        

    
        let tasks = userdata.tasks || [];
        if (tasks.length > 0) {
          let taskstreet = tasks.filter((task) => task.ID == "1");
          let tasktrack = tasks.filter((task) => task.ID == "2");
          let taskdrag = tasks.filter((task) => task.ID == "3");


          if (taskstreet[0] && raceoption == "streetrace") {
            if (taskstreet[0].Races < 10) {
              taskstreet[0].Races += 1;
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "tasks.$[task]": taskstreet[0],
                  },
                },

                {
                  arrayFilters: [
                    {
                      "task.ID": "1",
                    },
                  ],
                }
              );
            }
            if (taskstreet[0].Races >= 10) {
              userdata.cash += 10000;
              userdata.tasks.pull(taskstreet[0]);
              interaction.channel.send(
                `Task completed! You earned ${toCurrency(taskstreet[0].Reward)}`
              );
            }
          } else if (tasktrack[0] && raceoption == "trackrace") {
            if (tasktrack[0].Races < 10) {
              tasktrack[0].Races += 1;
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "tasks.$[task]": tasktrack[0],
                  },
                },

                {
                  arrayFilters: [
                    {
                      "task.ID": "2",
                    },
                  ],
                }
              );
            }
            if (tasktrack[0].Races >= 10) {
              userdata.cash += 15000;
              userdata.tasks.pull(tasktrack[0]);
              interaction.channel.send(
                `Task completed! You earned ${toCurrency(tasktrack[0].Reward)}`
              );
            }
          } else if (taskdrag[0] && raceoption == "dragrace") {
            if (taskdrag[0].Races < 10) {
              taskdrag[0].Races += 1;
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "tasks.$[task]": taskdrag[0],
                  },
                },

                {
                  arrayFilters: [
                    {
                      "task.ID": "3",
                    },
                  ],
                }
              );
            }
            if (taskdrag[0].Races >= 10) {
              userdata.cash += 12000;
              userdata.tasks.pull(taskdrag[0]);
              userdata.updateOne('cash')
              userdata.updateOne('rp')
              userdata.updateOne('items')
              userdata.updateOne('tasks')
              interaction.channel.send(
                `Task completed! You earned ${toCurrency(taskdrag[0].Reward)}`
              );
            }
          }
        }
        userdata.update()


       
        
        tasks = userdata.tasks || [];
        if (tasks.length > 0) {
          let taskstreet = tasks.filter((task) => task.ID == "1");
          let tasktrack = tasks.filter((task) => task.ID == "2");

          if (taskstreet[0] && raceoption == "streetrace") {
            if (taskstreet[0].Races < 10) {
              taskstreet[0].Races += 1;
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "tasks.$[task]": taskstreet[0],
                  },
                },

                {
                  arrayFilters: [
                    {
                      "task.ID": "1",
                    },
                  ],
                }
              );
            }
            if (taskstreet[0].Races >= 10) {
              userdata.cash += 10000;
              userdata.tasks.pull(taskstreet[0]);
              interaction.channel.send(
                `Task completed! You earned ${toCurrency(taskstreet[0].Reward)}`
              );
            }
          } else if (tasktrack[0] && raceoption == "trackrace") {
            if (tasktrack[0].Races < 10) {
              tasktrack[0].Races += 1;
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "tasks.$[task]": tasktrack[0],
                  },
                },

                {
                  arrayFilters: [
                    {
                      "task.ID": "1",
                    },
                  ],
                }
              );
            }
            if (tasktrack[0].Races >= 10) {
              userdata.cash += 15000;
              userdata.tasks.pull(tasktrack[0]);
              interaction.channel.send(
                `Task completed! You earned ${toCurrency(tasktrack[0].Reward)}`
              );
            }
          }
        }

        if(raceoption == "spacerace"){
          let moontokens = 10 * tieroption

          rewards.push(`${emotes.moontokens} ${moontokens}`)
          userdata.moontokens += moontokens
        }

        if(userdata.location == "italy" && raceindb.Name == "Street Race"){
          cashwon = cashwon * 2
        }
         if(userdata.location == "germany" && raceindb.Name == "Track Race"){
          cashwon = cashwon * 2
        }
         if(userdata.location == "india" && raceindb.Name == "Drag Race"){
          cashwon = cashwon * 2
        }

        if(userdata.items.includes("coffee bean")){
          xpwon = xpwon * 2
        }

        if(userdata.items.includes("cocktail")){
          xpwon = xpwon += (xpwon * 0.25)
          let userit = userdata.items
          for (var i2 = 0; i2 < 1; i2++)
          userit.splice(userit.indexOf("cocktail"), 1);
          userdata.items = userit;
        }
 
        if(mclarenkey == true){
          rewards.push(`<:key_mclaren:1211175403071348766> 5 McLaren Keys`)
          userdata.mKeys += 5
        }
       
        rewards.push(`${emotes.cash} ${toCurrency(cashwon)}`);
        rewards.push(`${emotes.xp} ${xpwon}`);

        userdata.xp += xpwon
        let skill = userdata.skill

        let requiredxp  =skill * 100

        if(userdata.xp >= requiredxp){
          userdata.skill += 1
          userdata.xp = 0
          rewards.push(`${emotes.rank} Skill Level Up!`)
        }



    

        embed.addFields({
          name: `Rewards`,
          value: `${rewards.join("\n")}`,
        });

        if(raceindb.Name == "Street Race"){
        
          
          userdata.streetwins += 1
        }
        if(raceindb.Name == "Drag Race"){
          userdata.dragwins += 1
        }
        if(raceindb.Name == "Track Race"){
          userdata.trackwins += 1
        }

        embed.data.fields[0].value = `${emotes.speed} HP: ${selected.Speed}\n${emotes.acceleration} Acceleration: ${selected.Acceleration}s\n${emotes.handling} Handling: ${selected.Handling}\n${emotes.weight} Weight: ${selected.WeightStat}\n${emotes.OVR} Score: ${Math.round(playerrace)}`
        embed.data.fields[1].value = `${emotes.speed} HP: ${speed2}\n${emotes.acceleration} Acceleration: ${car2["0-60"]}s\n${emotes.handling} Handling: ${handling2}\n${emotes.weight} Weight: ${car2.Weight}\n${emotes.OVR} Score: ${Math.round(opponentrace)}`;

        embed.setTitle(`Tier ${tieroption} ${raceindb.Name} won!`);
      
      } else if (winner == false) {
        
        clearTimeout(xt)
        if(raceindb.Name == "Street Race"){
    
          userdata.streetloss += 1
        }
        if(raceindb.Name == "Drag Race"){
          userdata.dragloss += 1
        }
        if(raceindb.Name == "Track Race"){
          userdata.trackloss += 1
        }
        embed.data.fields[0].value = `${emotes.speed} HP: ${selected.Speed}\n${emotes.acceleration} Acceleration: ${selected.Acceleration}s\n${emotes.handling} Handling: ${selected.Handling}\n${emotes.weight} Weight: ${selected.WeightStat}\n${emotes.OVR} Score: ${Math.round(playerrace)}`
        embed.data.fields[1].value = `${emotes.speed} HP: ${speed2}\n${emotes.acceleration} Acceleration: ${car2["0-60"]}s\n${emotes.handling} Handling: ${handling2}\n${emotes.weight} Weight: ${car2.Weight}\n${emotes.OVR} Score: ${Math.round(opponentrace)}`;
        embed.setTitle(`Tier ${tieroption} ${raceindb.Name} lost!`);
      }

      let ach1 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["rich"].Name)
      if (userdata.cash >= 100000 && ach1.length <= 0) {
        interaction.channel.send(
          'You just earned the "Rich" achievement!'
        );
        userdata.achievements.push({
          name: achievementdb.Achievements["rich"].Name,
          id: achievementdb.Achievements["rich"].Name.toLowerCase(),
          completed: true,
        });
      }
      let ach2 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["richer"].Name)
      if (userdata.cash >= 1000000 && ach2.length <= 0) {
        interaction.channel.send(
          'You just earned the "Richer" achievement!'
        );
        userdata.achievements.push({
          name: achievementdb.Achievements["richer"].Name,
          id: achievementdb.Achievements["richer"].Name.toLowerCase(),
          completed: true,
        });
      }
      let ach3 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["richest"].Name)
      if (userdata.cash >= 1000000000 && ach3.length <= 0) {
        interaction.channel.send(
          'You just earned the "Richest" achievement!'
        );
        userdata.achievements.push({
          name: achievementdb.Achievements["richest"].Name,
          id: achievementdb.Achievements["richest"].Name.toLowerCase(),
          completed: true,
        });
      }

      selected.Miles += 15;
      let dirt = selected.Dirt || 100;

      let newdirt = (dirt -= 5);

      if (dirt > 0) {
        selected.Dirt = newdirt;
      }

      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            "cars.$[car]": selected,
          },
        },

        {
          arrayFilters: [
            {
              "car.Name": selected.Name,
            },
          ],
        }
      );

      if(userdata.tutorial && userdata.tutorial.started == true && userdata.tutorial.stage == 2 && userdata.tutorial.type == "starter"){
        let tut = userdata.tutorial
        tut.stage += 1
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "tutorial": tut,
            },
          },
  
        );

        userdata.cash += 2500
        interaction.channel.send(`**TUTORIAL:** Now that you've finished your first race, won or lost, I've given you $2.5K, lets take a look at what you received! Run \`/bal\` to see your cash and other currencies`)
      }
      if(userdata.tutorial && userdata.tutorial.started == true && userdata.tutorial.stage == 8 && userdata.tutorial.type == "starter"){
        let tut = userdata.tutorial
        tut.started = false
        tut.startfinished = true
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "tutorial": tut,
            },
          },
  
        );

        
        interaction.channel.send(`**TUTORIAL:** Great! You now know the basics to the game! You can run \`/help\` to see all the commands, run \`/tutorials\` for more tutorials, or join the [community server](https://discord.gg/bHwqpxJnJk) if you need any help!`)
      }


      userdata.save();



      await interaction.editReply({ embeds: [embed] });



    }, 5000);

  }
  }
  },
};
