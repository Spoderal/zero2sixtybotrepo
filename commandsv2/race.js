

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
const { toCurrency, randomRange } = require("../common/utils");
const helmetdb = require("../data/pfpsdb.json");
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
          { name: "🌨️ Snow Race", value: "snow" },
          { name: "🚀 Car Series", value: "carseries" },
          { name: "🔧 Junk Race", value: "junkrace" },
          { name: "🚲 Motorcycle Madness", value: "motorcyclemad" },
          { name: "🚀 Space Race (EVENT)", value: "spacerace" },
          { name: "🏙️ City Race (EVENT)", value: "cityrace" }
        )
        .setRequired(true)
        .setDescription(`The race to start`)
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
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car ID to race with")
        .setRequired(true)
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
    let user = interaction.user;
    let carsarray = [];

    for (let car1 in cardb.Cars) {
      let caroj = cardb.Cars[car1];
      carsarray.push(caroj);
    }
    let globals = await Globals.findOne({});
    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let cooldowndata =
      (await Cooldowns.findOne({ id: user.id })) ||
      new Cooldowns({ id: user.id });
    let timeout = 45 * 1000;

    if(userdata.premium == true) {
      timeout = 15 * 1000
    }

    if (
      cooldowndata.racing !== null &&
      timeout - (Date.now() - cooldowndata.racing) > 0
    ) {
      let time = ms(timeout - (Date.now() - cooldowndata.racing));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`You can race again in ${time}`);
      return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }
    let timeout2 = 600000
    
    if (
      cooldowndata.racedisabled !== null &&
      timeout2 - (Date.now() - cooldowndata.racedisabled) > 0
    ) {
      let time = ms(timeout2 - (Date.now() - cooldowndata.racedisabled));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`You can race again in ${time}`);
      return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }

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
    if (cardb.Cars[selected.Name.toLowerCase()].Junked == true) {
      let errembed = new EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `You need to restore this car before you can race with it! Use \`/restore\``
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    if (selected.Impounded && selected.Impounded == true) {
      return interaction.reply(
        "This car is impounded! Use /impound to unimpound it."
      );
    }
    let raceoption = interaction.options.getString("race");
    let tieroption = interaction.options.getNumber("tier");
    let msg =  await interaction.reply({content: `Revving engines...`, fetchReply: true})

    if(raceoption == "spacerace"){
      let tires = selected.tires || "none"
      if(tires.toLowerCase() !== "t1spacetires"){
        return interaction.editReply("You need to use space tires for this race!")
      }
    }
    if(raceoption == "cityrace"){
      if(selected.Speed > 350) return interaction.editReply("Your car needs to be under 350 Power to do this race!")
    }
    let image = selected.Image || cardb.Cars[selected.Name.toLowerCase()].Image
    if(raceoption == "trackrace"){
      cooldowndata.racing = Date.now()
      cooldowndata.save()
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
            let carstopick = carsarray.filter((car) => car.Class == newtrack.Class)
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
          console.log(formulauser)
          racersformulas.push({User: interaction.user.username, Score: formulauser, Image: `${image}`})
          for(let car in racers){
            let racercar = racers[car]
            let formulabot= (((racercar.Speed / 20) / racercar.Acceleration) + (racercar.Handling) - (racercar.Weight / 100) ) / weath.Control
            racersformulas.push({User: `Opponent ${racercar.Owner}`, Score: formulabot, Image: `${racercar.Image}`})

          }

          racersformulas.sort(function(a, b){return b.Score - a.Score});


          console.log(racersformulas)

          setTimeout(async () => {
            trackembed.setTitle(`${racersformulas[0].User} won!`)
            trackembed.setThumbnail(`${racersformulas[0].Image}`)

            

            if(racersformulas[0].User == interaction.user.username){
              let rewards = []

              rewards.push(`${toCurrency(cashwinnings)}`)

              if(newtrack.Name == "Spa-Francorchamps"){
                rewards.push(`${emotes.commonKey} 10`)
                userdata.ckeys += 10
              }
              if(newtrack.Name == "Suzuka"){
                rewards.push(`${emotes.rareKey} 10`)
                userdata.rkeys += 10
              }
              if(newtrack.Name == "Nürburgring"){
                rewards.push(`${emotes.exoticKey} 10`)
                userdata.ekeys += 10
              }

              userdata.cash += cashwinnings
              userdata.save()
              trackembed.setDescription(`${rewards.join('\n')}`)
            }

            await interaction.editReply({embeds: [trackembed]})
          }, 5000);
          
        }
      })


    }
    else if(raceoption == "cityrace"){
      cooldowndata.racing = Date.now()
      cooldowndata.save()

      let obstacles = ["a civilian", "traffic", "jump"]

      let ob1 = lodash.sample(obstacles)
      let ob2 = lodash.sample(obstacles)

      let cararraym = carsarray.filter((car) => car.Speed <= 350 && car.Handling <= 700)
      
      let car2 = lodash.sample(cararraym)


      let carimg = selected.Image || cardb.Cars[selected.Name.toLowerCase()].Image;
      let userpfp = userdata.helmet || "default";

      let embed = new EmbedBuilder()
      .setTitle(`Racing City Carvers`)
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
          value: `${emotes.speed} HP: ${car2.Speed}\n${
            emotes.acceleration
          } Acceleration: ${car2[`0-60`]}s\n${emotes.handling} Handling: ${
            car2.Handling
          }\n${emotes.weight} Weight: ${car2.Weight}`,
          inline: true,
        }
      )

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

      await interaction.editReply({embeds: [embed], fetchReply: true})

      let filter = (btnInt) => {
        return interaction.user.id == btnInt.user.id;
      };
      const collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 30000,
      });

      let obstaclebutton1 = new ButtonBuilder()
      .setCustomId("dodge")
      .setEmoji("↗️")
      .setLabel("Dodge")
      .setStyle("Secondary")

      let obstaclebutton2 = new ButtonBuilder()
      .setCustomId("Jump")
      .setEmoji("⬆️")
      .setLabel("jump")
      .setStyle("Secondary")

      let obstacle2button1 = new ButtonBuilder()
      .setCustomId("dodge2")
      .setEmoji("↗️")
      .setLabel("Dodge")
      .setStyle("Secondary")

      let obstacle2button2 = new ButtonBuilder()
      .setCustomId("jump2")
      .setEmoji("⬆️")
      .setLabel("Jump")
      .setStyle("Secondary")

      let row = new ActionRowBuilder()

      setTimeout(async () => {

        if(ob1 == "a civilian" || ob1 == "traffic"){
          row.components[0] = obstaclebutton1
          embed.setDescription(`There's ${ob1}!`)
        }
        else if(ob1 == "jump"){
          row.components[0] = obstaclebutton2
          embed.setDescription(`There's a huge jump!`)
        }

        await interaction.editReply({embeds: [embed], components: [row], fetchReply: true})

 
        
      }, 2000);

      setTimeout(async () => {
        if(ob2 == "a civilian" || ob2 == "traffic"){
          row.components[0] = obstacle2button1
          embed.setDescription(`There's ${ob1}!`)
        }
        else if(ob2 == "jump"){
          row.components[0] = obstacle2button2
          embed.setDescription(`There's a huge jump!`)
        }
        await interaction.editReply({embeds: [embed], components: [row], fetchReply: true})

      }, 6000);
   
      let ob1dodge = false
      let ob2dodge = false

      
      collector.on('collect', async (i) => {
        
        if(i.customId == "dodge" || i.customId == "jump"){
          ob1dodge = true

          await interaction.editReply({embed: [embed]})
        }
        if(i.customId == "dodge2" || i.customId == "jump2"){
          ob2dodge = true

          await interaction.editReply({embed: [embed]})
        }

        
        

      })

      setTimeout(async () => {

        if(ob1dodge == false && ob1 == "a civilian" || ob1 == "traffic"){
          embed.setDescription("Failed to dodge!")
          
        } 
          
        await interaction.editReply({embeds: [embed], components: [], fetchReply: true})

      }, 4000);

      setTimeout(async () => {
        if(ob2dodge == false && ob2 == "a civilian" || ob2dodge == false && ob2 == "traffic"){
          embed.setDescription("Failed to dodge!")
          
        } 

        

        await interaction.editReply({embeds: [embed], components: []})



      }, 8000);


      setTimeout(async () => {
        
        let formulauser = (((selected.Speed / 20) / selected.Acceleration) + (selected.Handling * 2) - (selected.WeightStat / 1000) )
        let formulacar = (((car2.Speed / 20) / car2["0-60"]) + (car2.Handling * 2) - (car2.Weight / 1000) )
        
        if(ob2dodge == true){
          formulauser += 10
        }
        if(ob1dodge == true){
          formulauser += 10
        }
        console.log(formulauser)
        console.log(formulacar)

        if(formulauser > formulacar) {
          embed.setDescription("You won!")
        } else {
          embed.setDescription("You lost! Try improving your handling")
        }

        await interaction.editReply({embeds: [embed]})

      }, 10000);


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

    if (selected.Gas <= 0)
      return interaction.editReply(
        `You're out of gas! Use \`/gas\` to fill up for the price of gas today! Check the daily price of gas with \`/bot\``
      );
    let car2;


    const dorace = function (hp, a, h, w) {
      
      let sum = hp + hp / a + h + w / 100;
      return sum / 4;
    };
    const dodrag = function (hp, a, h, w) {
      
      let sum = hp + hp / a + w / 100;
      return sum / 4;
    };

    const dotrack = function (hp, a, h, w) {
      

      let sum = hp + hp / a + h + w / 100;
      return sum / 4;
    };
    const domotor = function (hp, a, h, w) {
      
      let sum = hp + hp / a + h + w / 100;
      return sum / 4;
    };
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
      return interaction.reply("The max tier for this race is 3!");
    else if (
      raceoption == "motorcyclemad" &&
      !cardb.Cars[selected.Name.toLowerCase()].Motorcycle
    )
      return interaction.reply("You need a motorcycle for this race!");

    car2 = lodash.sample(cartofilter);
    let winner;
    let rewards = [];
    if (raceoption == "streetrace" || raceoption == "spacerace") {
   

      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;


      let playerrace = dorace(speed, acceleration, handling, weight);
      let opponentrace = dorace(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;


    } else if (raceoption == "snow") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;

      let handscore = Math.floor(handling * 10);
      let handscore2 = Math.floor(handling2 * 10);

      let speedscore = speed / 10;
      let speedscore2 = speed2 / 10;

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

      let playerrace = dorace(speedscore, acceleration, weight, handscore);
      let opponentrace = dorace(
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
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;

      

      let playerrace = dodrag(speed, acceleration, handling, weight);
      let opponentrace = dodrag(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

    } else if (raceoption == "trackrace") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;


      let playerrace = dotrack(speed, acceleration, handling, weight);
      let opponentrace = dotrack(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

    } else if (raceoption == "trackraceevent") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;

    

      let playerrace = dotrack(speed, acceleration, handling, weight);
      let opponentrace = dotrack(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;


    }
    //test
    else if (raceoption == "motorcyclemad") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;

      let playerrace = domotor(speed, acceleration, handling, weight);
      let opponentrace = domotor(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

    } else if (raceoption == "carseries") {
      let ticketscool = cooldowndata.series1tickets;
      let timeoutfor = 86400000
      if (
        userdata.perfectengineeringcomplete !== true &&
        userdata.perfectengineering == true &&
        userdata.seriestickets < 10 &&
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

  

      let playerrace = dorace(speed, acceleration, handling, weight);
      let opponentrace = dorace(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;


    } else if (raceoption == "crosscountry") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;


      let playerrace = dorace(speed, acceleration, handling, weight);
      let opponentrace = dorace(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;


    } else if (raceoption == "junkrace") {
      if (
        !cardb.Cars[selected.Name.toLowerCase()].RestoreOnly &&
        !cardb.Cars[selected.Name.toLowerCase()].restored
      )
        return interaction.reply("You need to use a barn find!");

      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;



      let playerrace = dorace(speed, acceleration, handling, weight);
      let opponentrace = dorace(speed2, acceleration2, handling2, weight2);

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
    if (userdata.prestige) {
      let prestige = userdata.prestige;
      let prestigebonus = prestige * 0.1;

      cashwon = cashwon += cashwon * prestigebonus;
    }
    let carimg = selected.Image || cardb.Cars[selected.Name.toLowerCase()].Image;
    let userpfp = userdata.helmet || "default";

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
          value: `${emotes.speed} HP: ${car2.Speed}\n${
            emotes.acceleration
          } Acceleration: ${car2[`0-60`]}s\n${emotes.handling} Handling: ${
            car2.Handling
          }\n${emotes.weight} Weight: ${car2.Weight}`,
          inline: true,
        }
      )

    cooldowndata.racing = Date.now();
    cooldowndata.is_racing = Date.now();
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

    cooldowndata.save();
     await interaction.editReply({ embeds: [embed], fetchReply: true });

   let xt =  setTimeout(async () => {
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

        console.log(house1)
        if(house1[0]){
          notorietywon = notorietywon * 2
        }
        if(house2[0]){
          rewards.push(`${emotes.lockpicks} 1 Lockpick`)
          userdata.lockpicks += 1
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
        let rankwon = 1;
        let rating = selected.Rating;
        if (userdata.items.includes("camera")) {
          rating += 1;
        }

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
        console.log(`before ${cashwon}`)
        if (userdata.using.includes("tequila shot")) {
          let itemcooldown = cooldowndata.tequilla;
          console.log("true")
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
        console.log(`after ${cashwon}`)

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
            cashwon = cashwon * 2;
            rpwon = rpwon * 2;
            rankwon = rankwon * 2;
          }
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

        if (rating && rating >= 1) {
          rankwon = rankwon += rankwon * rating;
        }

        if (raceoption == "snow") {
          notorietywon = notorietywon * 2;
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
          let wins = userdata.rustwins;

       
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

        rewards.push(`<:rank_race:1103913420320944198> +${rankwon} Rank`);
        rewards.push(`${emotes.notoriety} ${notorietywon}`);
        userdata.cash += cashwon;
        userdata.notoriety += notorietywon;
        userdata.racerank += rankwon;
        let cratechance = randomRange(1, 20);
        if (cratechance > 10) {
          rewards.push(`<:supplydrop:1044404467119960085> Common Crate`);
          userdata.items.push("common crate");
        } else if (cratechance == 5) {
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
        if (userdata.prestige > 0) {
          let prestige = userdata.prestige;
          rpwon = rpwon += rpwon * (prestige * 0.1);
        }
        rewards.push(`${emotes.rp} + ${rpwon} RP`);
        userdata.rp4 += 10;
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
        let pet = userdata.newpet
        if (pet && pet.length > 0) {
          let itemchance = randomRange(1, 5);
          if (itemchance <= 3) {
            let itemarr = [];
            for (let i in itemdb) {
              if (
                itemdb[i].Findable == true &&
                itemdb[i].Tier &&
                itemdb[i].Tier <= userdata.newpet.tier
              ) {
                itemarr.push(itemdb[i]);
              }
            }
            let randomItem = lodash.sample(itemarr);
            rewards.push(`${randomItem.Emote} ${randomItem.Name}`);
            userdata.items.push(randomItem.Name.toLowerCase());
          }
        }

        let peteggdrop = randomRange(1, 10);

        if (peteggdrop == 2) {
          rewards.push(`${itemdb["pet egg"].Emote} ${itemdb["pet egg"].Name}`);
          userdata.items.push(`pet egg`);
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
              userdata.updateOne('rp4')
              userdata.updateOne('items')
              userdata.updateOne('tasks')
              interaction.channel.send(
                `Task completed! You earned ${toCurrency(taskdrag[0].Reward)}`
              );
            }
          }
        }
        userdata.update()


        if(raceoption == "streetrace" && cardb.Cars[selected.Name.toLowerCase()].Electric == true){
          userdata.items.push("swan note")
          rewards.push(`${itemdb["swan note"].Emote} ${itemdb["swan note"].Name}`)
        }
       
        
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
        
     

        if(raceoption == "streetrace"){
          let fictionkeys = 5 * tieroption

          rewards.push(`<:key_limited:1103923572063354880> ${fictionkeys}`)
          userdata.evkeys += fictionkeys
        }

 
       
        rewards.push(`${emotes.cash} ${toCurrency(cashwon)}`);


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

      if(userdata.tutorial && userdata.tutorial.started == true && userdata.tutorial.stage == 1){
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
        userdata.parts.push(`t1exhaust`)
        interaction.channel.send(`Now that you've finished your first race, here's a ${partdb.Parts.t1exhaust.Emote} T1Exhaust! Run \`/upgrade car: ${selected.ID} part: t1exhaust\` to upgrade your car with this part!`)
      }
      userdata.save();



      await interaction.editReply({ embeds: [embed] });



    }, 5000);

  }
  },
};
