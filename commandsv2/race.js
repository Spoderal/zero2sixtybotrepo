

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
    .addSubcommand((subcommand) => subcommand
      .setName("street")
      .setDescription("Start a street race")
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
  )
    )
      
    .addSubcommand((subcommand) => subcommand
    .setName("drag")
    .setDescription("Start a drag race")
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
)
  )
  .addSubcommand((subcommand) => subcommand
  .setName("track")
  .setDescription("Start a track race")
  .addStringOption((option) =>
  option
    .setName("track")
    .setDescription("The track to race on")
    .addChoices(
      {name: "Spa-Francorchamps (EASY)", value: "spafrancorchamps"},
      {name: "Suzuka (MEDIUM)", value: "suzuka"},
      {name: "Nürburgring (HARD)", value: "nurburgring"},
      {name: "Silverstone (EXTREME)", value: "silverstone"}
    )
    .setRequired(true)
  )
.addStringOption((option) =>
option
  .setName("car")
  .setDescription("The car ID to race with")
  .setRequired(true)
)
)
.addSubcommand((subcommand) => subcommand
.setName("crosscountry")
.setDescription("Start a cross country race")
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
)
)
.addSubcommand((subcommand) => subcommand
.setName("offroad")
.setDescription("Start a offroad race")
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
)
)
.addSubcommand((subcommand) => subcommand
.setName("series")
.setDescription("Start a car series race")
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
)
)
.addSubcommand((subcommand) => subcommand
.setName("junk")
.setDescription("Start a junk race to earn junk parts")
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
)
)
.addSubcommand((subcommand) => subcommand
.setName("spacerace")
.setDescription("Start a space race (EVENT)")
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
)
)
.addSubcommand((subcommand) => subcommand
.setName("motorcycle")
.setDescription("Start a motorcycle race")
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
.setName("motorcycle")
.setDescription("The motorcycle ID to race with")
.setRequired(true)
)
)
.addSubcommand((subcommand) => subcommand
.setName("dyno")
.setDescription("View your car's dyno stats")
.addStringOption((option) =>
option
.setName("car")
.setDescription("The car ID to check the dyno of")
.setRequired(true)
)
.addStringOption((option) => option
.setName("surface")
.setDescription("The surface to check the dyno on")
.addChoices(
  {name: "Asphalt", value: "asphalt"},
  {name: "Dirt", value: "dirt"},
  {name: "Snow", value: "snow"},
  {name: "Ice", value: "ice"},
  {name: "Wet", value: "wet"}
)
.setRequired(true)
)
)
,
  async execute(interaction) {
    let carsarray = [];
    let raceoption = interaction.options.getSubcommand();
    let playerrace
    let opponentrace
    const dorace = function(speed, acceleration, handling, weight, surface, tires) {
      let sspeed = surface.Speed
      let shandling = surface.Handling
      if(tires && tires !== null && tires !== undefined){
        let tiresindb = partdb.Parts[tires.toLowerCase()]

        if(tiresindb && tiresindb.Name.includes("allsurfacetires") && surface.Name.toLowerCase() !== "asphalt"){
          sspeed += 0.2
          shandling += 0.2
        }
        if(tiresindb && tiresindb.Name.includes("slicks") && surface.Name.toLowerCase() !== "asphalt"){
          sspeed -= 0.2
          shandling -= 0.2
        }
        if(tiresindb && tiresindb.Name.includes("offroadtires") && surface.Name.toLowerCase() == "dirt" || surface.Name.toLowerCase() == "snow" || surface.Name.toLowerCase() == "ice"){
          sspeed -= 0.2
          shandling -= 0.2
        }
        if(tiresindb && tiresindb.Name.includes("offroadtires") && surface.Name.toLowerCase() !== "dirt" || surface.Name.toLowerCase() !== "snow" || surface.Name.toLowerCase() !== "ice"){
          sspeed += 0.2
          shandling += 0.2
        }
       else {
        sspeed += 0
        shandling += 0
       }
      }

      // Define the importance of each factor
      var speedImportance = 0.30;
      var accelerationImportance = 0.25;
      var handlingImportance = 0.20;
      var weightImportance = 0.25;
      let surfacespeed = sspeed
      let surfacehandling = shandling
  

  
      var normalizedSpeed = speed * surfacespeed
      var normalizedAcceleration = acceleration  // Lower acceleration is better
      var normalizedHandling = handling * surfacehandling
      var normalizedWeight = weight / 100  // Lower weight is better
  
      // Calculate the final score
      var score = (speedImportance * normalizedSpeed +
                   accelerationImportance * normalizedAcceleration +
                   handlingImportance * normalizedHandling -
                   weightImportance - normalizedWeight);
  
      return score;
  }
  const dospace = function(speed, acceleration, handling, weight) {

    // Define the importance of each factor
    var speedImportance = 0.30;
    var accelerationImportance = 0.10;
    var handlingImportance = 0.60;
    var weightImportance = 0;



    var normalizedSpeed = speed
    var normalizedHandling = handling 
    var normalizedAcceleration = acceleration  // Lower acceleration is better
    var normalizedWeight = weight / 100  // Lower weight is better

    // Calculate the final score
    var score = (speedImportance * normalizedSpeed +
                 accelerationImportance * normalizedAcceleration +
                 handlingImportance * normalizedHandling -
                 weightImportance - normalizedWeight);

    return score;
}

  const dotrack = function(speed, acceleration, handling, weight, tires) {

    if(tires.toLowerCase().includes("tracktires")){
     handling += 100
    }
 
  
    // Define the importance of each factor
    var speedImportance = 0.10;
    var accelerationImportance = 0.20;
    var handlingImportance = 0.40;
    var weightImportance = 0.30;



    var normalizedSpeed = speed
    var normalizedHandling = handling 
    var normalizedAcceleration = acceleration  // Lower acceleration is better
    var normalizedWeight = weight / 100  // Lower weight is better

    // Calculate the final score
    var score = (speedImportance * normalizedSpeed +
                 accelerationImportance * normalizedAcceleration +
                 handlingImportance * normalizedHandling -
                 weightImportance - normalizedWeight);

    return score;
}
const dooffroad = function(speed, acceleration, handling, weight, surface, tires) {
  let tiresindb = partdb.Parts[tires]
  let sspeed = surface.Speed
  let shandling = surface.Handling
  if(tires && tires !== null && tires !== undefined){

  if(tiresindb && tiresindb.Name.includes("allsurfacetires") && surface.Name.toLowerCase() !== "asphalt"){
    sspeed += 0.25
    shandling += 0.25
  }
  if(tiresindb && tiresindb.Name.includes("slicks") && surface.Name.toLowerCase() == "asphalt"){
    sspeed += 0.2
    shandling += 0.2
  }
  if(tiresindb && tiresindb.Name.includes("slicks") && surface.Name.toLowerCase() !== "asphalt"){
    sspeed -= 0.2
    shandling -= 0.2
  }
  if(tiresindb && tiresindb.Name.includes("offroadtires")){
    sspeed += 0.4
    shandling += 0.4
  }
 else {
  sspeed += 0
  shandling += 0
 }}
  // Define the importance of each factor
  var speedImportance = 0.10;
  var accelerationImportance = 0.10;
  var handlingImportance = 0.30;
  var weightImportance = 0.50;
  let surfacespeed = sspeed
  let surfacehandling = shandling



  var normalizedSpeed = speed * surfacespeed
  var normalizedHandling = handling * surfacehandling 



  var normalizedAcceleration = acceleration  // Lower acceleration is better

  var normalizedWeight = weight / 100  // Lower weight is better

  // Calculate the final score
  var score = (speedImportance * normalizedSpeed +
               accelerationImportance * normalizedAcceleration +
               handlingImportance * normalizedHandling +
               weightImportance + normalizedWeight);

  console.log(score)

  return score;
}
const dodrag = function(speed, acceleration, handling, weight, surface, tires) {
  let tiresindb = partdb.Parts[tires]
  let sspeed = surface.Speed
  let shandling = surface.Handling
  if(tires && tires !== null && tires !== undefined){

  if(tiresindb && tiresindb.Name.includes("allsurfacetires") && surface.Name.toLowerCase() !== "asphalt"){
    sspeed += 0.1
    shandling += 0.1
  }
  if(tiresindb && tiresindb.Name.includes("slicks") && surface.Name.toLowerCase() == "asphalt"){
    sspeed += 0.5
    shandling += 0.5
  }
  if(tiresindb && tiresindb.Name.includes("slicks") && surface.Name.toLowerCase() !== "asphalt"){
    sspeed += 0.2
    shandling += 0.2
  }
  if(tiresindb && tiresindb.Name.includes("offroadtires")){
    sspeed -= 0.2
    shandling -= 0.2
  }
 else {
  sspeed += 0
  shandling += 0
 }
}
  var speedImportance = 0.30;
  var accelerationImportance = 0.50;
  var handlingImportance = 0.05;
  var weightImportance = 0.15;
  let surfacespeed = sspeed
  let surfacehandling = shandling

  

  var normalizedSpeed = speed * surfacespeed
  var normalizedHandling = surfacehandling 

  var normalizedAcceleration = acceleration  // Lower acceleration is better
  var normalizedWeight = weight / 100  // Lower weight is better

  // Calculate the final score
  var score = (speedImportance * normalizedSpeed +
    accelerationImportance * normalizedAcceleration +
    handlingImportance * normalizedHandling -
    weightImportance * normalizedWeight);

  return score;
}
let surfacerandom = lodash.sample(["wet", "dirt", "snow", "asphalt", "ice"])
let surface = racedb.Surface[surfacerandom];
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
    let idtoselect 

    if(raceoption == "motorcycle"){
      idtoselect = interaction.options.getString("motorcycle").toLowerCase();
    }
    else {
      idtoselect = interaction.options.getString("car").toLowerCase();
    }

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
    if(cardb.Cars[selected.Name.toLowerCase()].Motorcycle && raceoption !== "motorcycle") return interaction.reply("You cant use a motorcycle for this race!")
    if (raceoption == "motorcycle" &&  !cardb.Cars[selected.Name.toLowerCase()].Motorcycle || raceoption == "motorcycle" && cardb.Cars[selected.Name.toLowerCase()].Motorcycle == null || raceoption == "motorcycle" && cardb.Cars[selected.Name.toLowerCase()].Motorcycle == undefined ) return interaction.reply("You need a motorcycle for this race!");

    if(raceoption == "dyno"){
      let surface = interaction.options.getString("surface")
      let surfaceindb = racedb.Surface[surface]
      let speed = selected.Speed
      let acceleration = selected.Acceleration
      let handling = selected.Handling
      let weight = selected.WeightStat
      let image = selected.Image || selected.Livery || cardb.Cars[selected.Name.toLowerCase()].Image
      let tires = selected.tires || "t1tires"

      console.log(tires)

      let dyno = dorace(speed, acceleration, handling, weight, surfaceindb, tires)
      let dyno2 = dotrack(speed, acceleration, handling, weight, tires)
      let dyno3 = dodrag(speed, acceleration, handling, weight, surfaceindb, tires)

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
      timeout = 10 * 1000
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
        .setDescription(`You can race again in ${time}\n\nYou can clear this cooldown for 5 gold!`);
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
          if(userdata.gold < 5){
            let errembed = new EmbedBuilder()
            .setTitle("Error!")
            .setColor(colors.discordTheme.red)
            .setDescription(
              `You need 5 gold to clear this cooldown!`
            );
          return await interaction.editReply({ embeds: [errembed] });
          }
          userdata.gold -= 5
          cooldowndata.racing = null
          await cooldowndata.save()
          await userdata.save()
          let successembed = new EmbedBuilder()
          .setTitle("Success!")
          .setColor(colors.discordTheme.green)
          .setDescription(
            `Cleared the cooldown for 5 gold!`
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

    
    if (cardb.Cars[selected.Name.toLowerCase()].Junked == true && raceoption !== "junk") {
      let errembed = new EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `You need to restore this car before you can race with it in races other than junk race! Use \`/restore\``
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    if (cardb.Cars[selected.Name.toLowerCase()].F1 == true && raceoption !== "track") {
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
  if(!tieroption && raceoption !== "track") return interaction.reply("You need to select a tier!")

    cooldowndata.racing = Date.now();
    cooldowndata.is_racing = Date.now();
    await cooldowndata.save();
    let msg =  await interaction.reply({content: `Revving engines...`, fetchReply: true})

    let image = selected.Image || cardb.Cars[selected.Name.toLowerCase()].Image
    if(raceoption == "track"){
      cooldowndata.racing = Date.now()
      await cooldowndata.save()
      let newtrack = trackdb[interaction.options.getString("track")]
      
      let trackembed = new EmbedBuilder()
      .setTitle(`Racing on ${newtrack.Name}`)
      .setImage(newtrack.Image)
      .setColor(colors.blue)
              
        

          let cashwinnings = 0
          selected.Miles += 20
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
      
          let oppcount = newtrack.Racers
          trackembed.setImage(newtrack.Image)
          trackembed.data.fields = []
          let racers = []
          trackembed.addFields( {name: "Your car", value: `${selected.Emote} ${selected.Name}\n${emotes.speed}${selected.Speed}\n${emotes.acceleration}${selected.Acceleration}\n${emotes.handling}${selected.Handling}\n${emotes.weight}${selected.WeightStat}`, inline: true})
           for (let i = 0; i < oppcount; i++) {
            cashwinnings += 250
            let carstopick = carsarray.filter((car) => car.Class == newtrack.Class && car.Handling >= newtrack.Handling)
            if(cardb.Cars[selected.Name.toLowerCase()].F1){
              carstopick = carsarray.filter((car) => car.F1 == true)
            }
            let randcar = lodash.sample(carstopick)
            trackembed.addFields(
              {name: `Opponent ${i + 1}`, 
              value: `${randcar.Emote} ${randcar.Name}\n${emotes.speed}${Math.floor(randcar.Speed)}\n${emotes.acceleration}${randcar["0-60"]}\n${emotes.handling}${randcar.Handling}\n${emotes.weight}${randcar.Weight}`, 
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
          let tires = selected.tires || "t1tires"

          let formulauser = dotrack(selected.Speed, selected.Acceleration, selected.Handling, selected.WeightStat, tires)
         let racersformulas = []
          racersformulas.push({User: interaction.user.username, Score: formulauser, Image: `${image}`})
          for(let car in racers){
            let racercar = racers[car]
            let formulabot= dotrack(racercar.Speed, racercar.Acceleration, racercar.Handling, racercar.Weight, "t1tracktires")
            racersformulas.push({User: `Opponent ${racercar.Owner}`, Score: formulabot, Image: `${racercar.Image}`})

          }

        const winner = racersformulas.reduce((prev, curr) => {
          console.log(prev.Score, curr.Score)
          return prev.Score > curr.Score ? prev : curr;
        });

        console.log(`The winner is ${winner.User}`);


          setTimeout(async () => {
            trackembed.setTitle(`${winner.User} won!`)
            trackembed.setThumbnail(`${winner.Image}`)


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
              } 
            }

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
              }
            }

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
              } 
            }

            if(winner.User == interaction.user.username){
              let rewards = []
              if(isWeekend()){
                cashwinnings = cashwinnings * 2
              }
              let randomChance = randomRange(1, 100)
              if(newtrack.Name == "Spa-Francorchamps" && randomChance <= 50){
                let amount = 5
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
                    amount = amount * 2;
                  }
                }
                rewards.push(`${emotes.commonKey} ${amount}`)
                userdata.ckeys += amount
              }
              if(newtrack.Name == "Suzuka" && randomChance <= 25){
                let amount = 3
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
                    amount = amount * 2;
                  }
                }
                rewards.push(`${emotes.rareKey} ${amount}`)
                userdata.rkeys += amount
              }
              if(newtrack.Name == "Nürburgring" && randomChance <= 10){
                let amount = 1
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
                    amount = amount * 3;
                  }
                }
                rewards.push(`${emotes.exoticKey} ${amount}`)
                userdata.ekeys += amount
              }
              if(newtrack.Name == "Silverstone" && randomChance <= 25){
                let amount = 3
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
                    amount = amount * 3;
                  }
                }
                rewards.push(`${emotes.exoticKey} ${amount}`)
                userdata.ekeys += amount
              }
              if(zpass == true) {
                cashwinnings = cashwinnings * 2
              }
              
         
              let xpwon = 10 * oppcount;
              console.log(`XP won: ${xpwon}`)
              if(isWeekend()){
                xpwon = xpwon * 2
                cashwinnings = cashwinnings * 2
                rewards.push("Double Cash & XP Weekend")
              }
              if(userdata.items.includes("fake id")){
                xpwon = xpwon * 2
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
                  cashwinnings *= amounthead
                  xpwon *= amounthead
                }
              }
              if (userdata.items.includes("record")) {
                xpwon *= 2
                
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
                  cashwinnings = cashwinnings * 5;
                
                }
              }
              console.log(`before ${cashwinnings}`)

              let leteam = globals.leteams.filter((team) => team.members.includes(interaction.user.id))[0]
               if(leteam && leteam.name == "Porsche" && cardb.Cars[selected.Name.toLowerCase()].Emote == "<:porsche:931011550880338011>"){
                cashwinnings += 5000
    
              }
              console.log(`after ${cashwinnings}`)
              let skill = userdata.skill
              let requiredxp = 100 * skill
              userdata.cash += cashwinnings
              userdata.xp += xpwon
              rewards.push(`${emotes.xp} ${xpwon}`)

              if(userdata.xp >= requiredxp){
                  userdata.skill += 1;
                  userdata.xp = 0;
                  rewards.push(`${emotes.rank} x1 Skill Level Up!`);
                }
              
              rewards.push(`${toCurrency(cashwinnings)}`)
              userdata.trackwins += 1

              let team1 = globals.leteams.filter((team) => team.members.includes(interaction.user.id))[0]

              if(team1){
                let randomkeys = randomRange(1, 5)
                let teams = globals.leteams
               teams.filter((team) => team.name == team1.name)[0].wins += 1
        
               try {
                 await Globals.findOneAndUpdate(
                   {},
                   {
                     $set: {
                       "leteams": teams
                     },
                   },
                 );
                 globals.update()
                 globals.markModified("leteams")
                 globals.update()
                 globals.save()
                 console.log(globals.leteams)

               }
               catch (err) {
                 console.log(err)
               }
                rewards.push(`${emotes.lekey} ${randomkeys} Le Mans Keys`)
                userdata.lekeys += randomkeys
              }

              let ach1 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["1k miles"].Name)
      if (selected.Miles && selected.Miles >= 1000 && ach1.length <= 0) {
        interaction.channel.send(
          'You just earned the "1K Miles" achievement!'
        );
        userdata.achievements.push({
          name: achievementdb.Achievements["1k miles"].Name,
          id: achievementdb.Achievements["1k miles"].Name.toLowerCase(),
          completed: true,
        });
      }
      let ach2 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["10k miles"].Name)
      if (selected.Miles && selected.Miles >= 10000 && ach2.length <= 0) {
        interaction.channel.send(
          'You just earned the "1K Miles" achievement!'
        );
        userdata.achievements.push({
          name: achievementdb.Achievements["10k miles"].Name,
          id: achievementdb.Achievements["10k miles"].Name.toLowerCase(),
          completed: true,
        });
      }
      let ach3 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["100k miles"].Name)
      if (selected.Miles && selected.Miles >= 100000 && ach3.length <= 0) {
        interaction.channel.send(
          'You just earned the "1K Miles" achievement!'
        );
        userdata.achievements.push({
          name: achievementdb.Achievements["100k miles"].Name,
          id: achievementdb.Achievements["100k miles"].Name.toLowerCase(),
          completed: true,
        });
      }

              trackembed.setDescription(`${rewards.join('\n')}`)
            }
            else {
              userdata.trackloss += 1
            }
            
            userdata.racetime += 5000
            userdata.save()

            await interaction.editReply({embeds: [trackembed]})
          }, 5000);

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
 


    if (tieroption == 1 && raceoption == "junk") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 200 && car.Junked
      );
    } else if (tieroption == 2 && raceoption == "junk") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 200 && car.Junked
      );
    } else if (tieroption == 3 && raceoption == "junk") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 300 && car.Junked
      );
    } else if (tieroption == 4 && raceoption == "junk") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 400 && car.Junked
      );
    } else if (tieroption == 5 && raceoption == "junk") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 450 && car.Junked
      );
    } else if (tieroption == 6 && raceoption == "junk") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 500 && car.Junked
      );
    } else if (tieroption == 7 && raceoption == "junk") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 600 && car.Junked
      );
    } else if (tieroption == 8 && raceoption == "junk") {
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

    if (tieroption == 1 && raceoption == "motorcycle") {
      cartofilter = carsarray.filter(
        (car) => car.Motorcycle && car.Speed <= 150
      );
    } else if (tieroption == 2 && raceoption == "motorcycle") {
      cartofilter = carsarray.filter(
        (car) => car.Motorcycle && car.Speed <= 200
      );
    } else if (tieroption == 3 && raceoption == "motorcycle") {
      cartofilter = carsarray.filter(
        (car) => car.Motorcycle && car.Speed <= 300
      );
    } else if (tieroption > 3 && raceoption == "motorcycle")
      return interaction.editReply("The max tier for this race is 3!");

      car2 = lodash.sample(cartofilter);

      let apollochance = randomRange(1, 100)

      if(apollochance <= 5 && raceoption == "spacerace"){
        car2 = carsarray.filter((car) => car.Name == "2019 Apollo IE")[0]
      }

      let speed2 = car2.Speed
      let handling2 = car2.Handling
      let prestige = userdata.prestige
  
      let winner;
    let rewards = [];
    if (raceoption == "street" ) {

   

      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];


      let tires = selected.tires || "t1tires"
       playerrace = dorace(speed, acceleration, handling, weight, surface, tires);
       opponentrace = dorace(speed2, acceleration2, handling2, weight2, surface, "t1tires");

      console.log(playerrace)
      console.log(opponentrace)

      winner = playerrace > opponentrace;


    } 
    else if(raceoption == "spacerace"){
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];

       playerrace = dospace(speed, acceleration, handling, weight);
       opponentrace = dospace(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;
    }
    else if (raceoption == "offroad") {
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
      let tires = selected.tires || "t1tires"
       playerrace = dooffroad(speedscore, acceleration, weight, handscore, surface, tires);
       opponentrace = dooffroad(
        speedscore2,
        acceleration2,
        weight2,
        handscore2,surface,
        "t1tires"
      );

      winner = playerrace > opponentrace;


    } else if (raceoption == "drag") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];

      
      let tires = selected.tires || "t1tires"
       playerrace = dodrag(speed, acceleration, handling, weight, surface, tires);
       opponentrace = dodrag(speed2, acceleration2, handling2, weight2, surface, tires);

      winner = playerrace > opponentrace;

    } else if (raceoption == "track") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];

      let tires = selected.tires || "t1tires"
       playerrace = dotrack(speed, acceleration, handling, weight, surface, tires);
       opponentrace = dotrack(speed2, acceleration2, handling2, weight2, surface, "t1tires");

      winner = playerrace > opponentrace;

    } else if (raceoption == "trackraceevent") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];

    

       playerrace = dotrack(speed, acceleration, handling, weight, surface);
       opponentrace = dotrack(speed2, acceleration2, handling2, weight2, surface);

      winner = playerrace > opponentrace;


    }
    //test
    else if (raceoption == "motorcycle") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];

       playerrace = domotor(speed, acceleration, handling, weight, surface, "t1tires");
       opponentrace = domotor(speed2, acceleration2, handling2, weight2, surface, "t1tires");

      winner = playerrace > opponentrace;

    } else if (raceoption == "series") {

      if (userdata.seriestickets <= 0) return interaction.editReply("You need a series ticket to race!");

      if (!cardb.Cars[selected.Name.toLowerCase()].Series)  return interaction.channel.send("You need to use a series car!");

      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;

  
      let tires = selected.tires || "t1tires"

       playerrace = dorace(speed, acceleration, handling, weight, surface, tires);
       opponentrace = dorace(speed2, acceleration2, handling2, weight2, surface, "t1tires");

      winner = playerrace > opponentrace;


    } else if (raceoption == "crosscountry") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let acceleration2 = car2["0-60"];

      let tires = selected.tires || "t1tires"
       playerrace = dorace(speed, acceleration, handling, weight, surface, tires);
       opponentrace = dorace(speed2, acceleration2, handling2, weight2, surface, "t1tires");

      winner = playerrace > opponentrace;


    } else if (raceoption == "junk") {
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


let tires = selected.tires || "t1tires"
     playerrace = dorace(speed, acceleration, handling, weight, surface, tires);
     opponentrace = dorace(speed2, acceleration2, handling2, weight2, surface, "t1tires");

      winner = playerrace > opponentrace;


    }
    let randombarn = randomRange(1, 20);


    let randcar = randomRange(1, 10);
    let possiblekey = randomRange(1, 15);
    let raceindb = racedb.Races[raceoption.toLowerCase()];
    let cashwon = tieroption * raceindb.Reward;
    if(userdata.premium == true) {
      cashwon = cashwon * 1.5
    }
    cashwon = cashwon * 2
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

    let speedpercent = surface.Speed * 100;
    let handlingpercent = surface.Handling * 100;


    let embed = new EmbedBuilder()
      .setTitle(`Racing tier ${tieroption} ${raceindb.Name} on ${surface.Emote} ${surface.Name}`)
      .setImage(`${carimg}`)
      .setThumbnail(`${car2.Image}`)
      .setColor(colors.blue)
      .setFooter(tipFooterRandom)
      .setFields(
        {
          name: `${outfits.Helmets[userpfp.toLowerCase()].Emote} Your ${
            selected.Emote
          } ${selected.Name}`,
          value: `${emotes.speed} HP: ${(Math.floor(selected.Speed * surface.Speed))} (${speedpercent}%)\n${emotes.acceleration} Acceleration: ${selected.Acceleration}s\n${emotes.handling} Handling: ${Math.floor(selected.Handling * surface.Handling)}(${handlingpercent}%)\n${emotes.weight} Weight: ${selected.WeightStat}`,
          inline: true,
        },
        {
          name: `${car2.Emote} ${car2.Name}`,
          value: `${emotes.speed} HP: ${Math.floor(speed2 * surface.Speed)}\n${
            emotes.acceleration
          } Acceleration: ${car2[`0-60`]}s\n${emotes.handling} Handling: ${
            Math.floor(handling2 * surface.Handling)
          }\n${emotes.weight} Weight: ${car2.Weight}`,
          inline: true,
        }
      )

      if(raceoption == "spacerace"){
        embed.setFields(
          {
            name: `${outfits.Helmets[userpfp.toLowerCase()].Emote} Your ${
              selected.Emote
            } ${selected.Name}`,
            value: `${emotes.speed} HP: ${(Math.floor(selected.Speed))}\n${emotes.acceleration} Acceleration: ${selected.Acceleration}s\n${emotes.handling} Handling: ${Math.floor(selected.Handling)}\n${emotes.weight} Weight: 0 (You're in space)`,
            inline: true,
          },
          {
            name: `${car2.Emote} ${car2.Name}`,
            value: `${emotes.speed} HP: ${Math.floor(speed2)}\n${
              emotes.acceleration
            } Acceleration: ${car2[`0-60`]}s\n${emotes.handling} Handling: ${
              Math.floor(handling2)
            }\n${emotes.weight} Weight: 0 (You're in space)`,
            inline: true,
          }
        )
        .setTitle(`Racing tier ${tieroption} ${raceindb.Name} in space`)

      }

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
    if(userdata.items.includes("fake id")){
      xpwon = xpwon * 2
    }
    if (userdata.using.includes("fruit punch")) {

      xpwon * 2
      
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
          let rando = randomRange(1, 100)
          if(rando <= 20){
            rewards.push(`${emotes.lockpicks} 1 Lockpick`)
            userdata.lockpicks += 1

          }
        }
        if(house3[0] && raceoption == "drag"){
          cashwon = cashwon += (cashwon * 0.05)
        }
        if(house4[0] && raceoption == "street"){
          cashwon = cashwon += (cashwon * 0.05)
        }
        if(house5[0]){
          rpwon = rpwon * 2
        }
        if(house6[0] && raceoption == "crosscountry"){
          cashwon = cashwon += (cashwon * 0.10)
        }
        if(house7[0] && raceoption == "street"){
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





        if (raceoption == "junk") {
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
          let randomr = randomRange(1, 100);
         
          if (tieroption < 5) {
          if(randomr <= 20){
  
              rewards.push(`${emotes.wheelSpin} Wheelspin`);
              userdata.wheelspins += 1
  
            }
          }
            else if(tieroption >= 5) {
              if(randomr <= 20){
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
          if (userdata.using.includes("apple")) {
            let itemcooldown = cooldowndata.apple;

            let timeout = 120000;
            if (
              itemcooldown !== null &&
              timeout - (Date.now() - itemcooldown) < 0
            ) {
              userdata.using.pull("apple");
              userdata.update();
              interaction.channel.send("Your apple ran out!");
            } else {
              notorietywon = notorietywon * 1.5;
            }
          }

          if (userdata.using.includes("applepie")) {
            let itemcooldown = cooldowndata.apple;

            let timeout = 120000;
            if (
              itemcooldown !== null &&
              timeout - (Date.now() - itemcooldown) < 0
            ) {
              userdata.using.pull("applepie");
              userdata.update();
              interaction.channel.send("Your apple pie ran out!");
            } else {
              notorietywon = notorietywon * 5;
            }
          }


          rewards.push(`${emotes.notoriety} ${notorietywon}`);

          userdata.notoriety += notorietywon;
        }


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
        if (raceoption == "track" && possiblekey == 10 && tieroption <= 2) {
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
          raceoption == "track" &&
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
          raceoption == "track" &&
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
        if (raceoption == "drag") {
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
        if (raceoption == "drag" && randombarn == 10) {
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
        if (raceoption == "series") {
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
       
        let itemchance = randomRange(1, 100)
        let tiers = {
            Tier1: {
              Tier: 1,
              Chance: 60,
            },
            Tier2: {
              Tier: 2,
              Chance: 30,
            },
            Tier3: {
              Tier: 3,
              Chance: 10,
            },
      }
          console.log(`chance: ${itemchance}`)
          let itemtier
          if (itemchance >= tiers.Tier1.Chance) {
            itemtier = 1
          } else if (itemchance >= tiers.Tier2.Chance) {
            itemtier =2
          } else if (itemchance >= tiers.Tier3.Chance) {
            itemtier = 3
          } else {
            itemtier = 3
          }
      

          let itemchance2 = randomRange(1, 10)
          console.log(itemchance2)
          console.log(itemtier)
          if (itemchance2 >= 5) {
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


          if (taskstreet[0] && raceoption == "street") {
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
          } else if (tasktrack[0] && raceoption == "track") {
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
          } else if (taskdrag[0] && raceoption == "drag") {
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

          if (taskstreet[0] && raceoption == "street") {
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
          } else if (tasktrack[0] && raceoption == "track") {
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
          if(car2.Name == "2019 Apollo IE"){
            rewards.push(`${cardb.Cars["2019apolloie"].Emote} 2019 Apollo IE Won!`)
           
            let carobj = {
              ID: cardb.Cars["2019apolloie"].alias,
              Name: "2019 Apollo IE",
              Speed: cardb.Cars["2019apolloie"].Speed,
              Acceleration: cardb.Cars["2019apolloie"]["0-60"],
              Handling: cardb.Cars["2019apolloie"].Handling,
              Emote: cardb.Cars["2019apolloie"].Emote,
              Livery: cardb.Cars["2019apolloie"].Image,
              Miles: 0,
              WeightStat: cardb.Cars["2019apolloie"].Weight,
              Gas: 10,
              MaxGas: 10,
            };
            userdata.cars.push(carobj);
          }

          let randompart = ["alien oil", "nuclear core", "metal frame", "zionite pistons", "car hook", "heat panels"]
          let partchance = randomRange(1, 10)

          if(partchance >= 5){
            let randompart2 = lodash.sample(randompart);
            rewards.push(`${partdb.Parts[randompart2].Emote} ${partdb.Parts[randompart2].Name}`)
            userdata.parts.push(randompart2);
          }
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
        if(zpass == true){
          cashwon = cashwon * 2
        }

        rewards.push(`${emotes.cash} ${toCurrency(cashwon)}`);
        rewards.push(`${emotes.xp} ${xpwon}`);
        
        userdata.cash += cashwon;
        userdata.xp += xpwon
        let skill = userdata.skill

        let requiredxp  = skill * 100
        if(userdata.xp >= requiredxp){
            userdata.skill += 1;
            userdata.xp = 0;
            rewards.push(`${emotes.rank} x1 Skill Level Up!`);
          }
        

        let xessence = randomRange(1, 5);

        let carclass = selected.Class || cardb.Cars[selected.Name.toLowerCase()].Class;
        if (selected.Xessence && prestige >= 2 && tieroption >= 7 && carclass !== "X") {
          if (userdata.using.includes("pills")) {
            let itemcooldown = cooldowndata.pills;

            let timeout = 300000;
            if (
              itemcooldown !== null &&
              timeout - (Date.now() - itemcooldown) < 0
            ) {
              userdata.using.pull("pills");
              userdata.update();
              interaction.channel.send("Your pills ran out!");
            } else {
              xessence = xessence * 2;
            }
          }
          console.log("xessence")
          selected.Xessence += xessence;
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
          rewards.push(`${emotes.xessence} ${xessence} Xessence`);

        }
        else if(!selected.Xessence && prestige >= 2 && tieroption >= 7){ 
          console.log("xessence")

          selected.Xessence = xessence

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

          rewards.push(`${emotes.xessence} ${xessence} Xessence`);

          
        }

        if(userdata.items.includes("xessence detector")){
          let randompartxessence = randomRange(1, 10);

          if(randompartxessence >= 5){
            let randomamount = randomRange(1, 3);
            rewards.push(`${emotes.xessence} ${randomamount} Part Xessence`);
            userdata.xessence += randomamount;
          }
        }
        let leteam = globals.leteams.filter((team) => team.members.includes(interaction.user.id))[0]


         if(leteam && leteam.name == "Ferrari" && raceoption == "street" && cardb.Cars[selected.Name.toLowerCase()].Emote == "<:ferrari:931011838374727730>"){
          cashwon += 5000

        }
         if(leteam && leteam.name == "Audi" && raceoption == "drag" && cardb.Cars[selected.Name.toLowerCase()].Emote == "<:audi:931011548758048828>"){
          cashwon += 5000

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

        embed.data.fields[0].value = `${emotes.speed} HP: ${Math.floor(selected.Speed * surface.Speed)}\n${emotes.acceleration} Acceleration: ${selected.Acceleration}s\n${emotes.handling} Handling: ${Math.floor(selected.Handling * surface.Handling)}\n${emotes.weight} Weight: ${selected.WeightStat}\n${emotes.OVR} Score: ${Math.round(playerrace)}`
        embed.data.fields[1].value = `${emotes.speed} HP: ${Math.floor(speed2) * surface.Speed}\n${emotes.acceleration} Acceleration: ${car2["0-60"]}s\n${emotes.handling} Handling: ${Math.floor(handling2 * surface.Handling)}\n${emotes.weight} Weight: ${car2.Weight}\n${emotes.OVR} Score: ${Math.round(opponentrace)}`;

        embed.setTitle(`Tier ${tieroption} ${raceindb.Name} on ${surface.Emote} ${surface.Name} won!`);
      
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
        embed.data.fields[0].value = `${emotes.speed} HP: ${selected.Speed}\n${emotes.acceleration} Acceleration: ${selected.Acceleration}s\n${emotes.handling} Handling: ${Math.floor(selected.Handling * surface.Handling)}\n${emotes.weight} Weight: ${selected.WeightStat}\n${emotes.OVR} Score: ${Math.round(playerrace)}`
        embed.data.fields[1].value = `${emotes.speed} HP: ${Math.floor(speed2 * surface.Handling)}\n${emotes.acceleration} Acceleration: ${car2["0-60"]}s\n${emotes.handling} Handling: ${Math.floor(handling2 * surface.Handling)}\n${emotes.weight} Weight: ${car2.Weight}\n${emotes.OVR} Score: ${Math.round(opponentrace)}`;
        embed.setTitle(`Tier ${tieroption} ${raceindb.Name} on ${surface.Emote} ${surface.Name} lost!`);
      }

      
      selected.Miles += 15;
      let ach1 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["1k miles"].Name)
      if (selected.Miles && selected.Miles >= 1000 && ach1.length <= 0) {
        interaction.channel.send(
          'You just earned the "1K Miles" achievement!'
        );
        userdata.achievements.push({
          name: achievementdb.Achievements["1k miles"].Name,
          id: achievementdb.Achievements["1k miles"].Name.toLowerCase(),
          completed: true,
        });
      }
      let ach2 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["10k miles"].Name)
      if (selected.Miles && selected.Miles >= 10000 && ach2.length <= 0) {
        interaction.channel.send(
          'You just earned the "1K Miles" achievement!'
        );
        userdata.achievements.push({
          name: achievementdb.Achievements["10k miles"].Name,
          id: achievementdb.Achievements["10k miles"].Name.toLowerCase(),
          completed: true,
        });
      }
      let ach3 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["100k miles"].Name)
      if (selected.Miles && selected.Miles >= 100000 && ach3.length <= 0) {
        interaction.channel.send(
          'You just earned the "1K Miles" achievement!'
        );
        userdata.achievements.push({
          name: achievementdb.Achievements["100k miles"].Name,
          id: achievementdb.Achievements["100k miles"].Name.toLowerCase(),
          completed: true,
        });
      }
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


      userdata.racetime += 5000
      userdata.save();



      await interaction.editReply({ embeds: [embed] });



    }, 5000);

  }
  }
  },
};
