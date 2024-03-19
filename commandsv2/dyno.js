const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json");
const colors = require("../common/colors");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dyno")
    .setDescription("Run your car on the dyno to see its stats")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car you'd like to run the dyno on")
        .setRequired(true)
    ),
  async execute(interaction) {
    let option = interaction.options.getString("car");
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let selected = userdata.cars.filter(car => car.Name.toLowerCase() == option.toLowerCase() || car.ID.toLowerCase() == option.toLowerCase())[0]

    if(!selected) {
        selected = cardb.Cars[option.toLowerCase()]
    }


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
    let speed = selected.Speed || selected.Power
    let acceleration = selected.Acceleration || selected["0-60"]
    let handling = selected.Handling
    let weight = selected.WeightStat || selected.Weight
    let image = selected.Image || selected.Livery || cardb.Cars[selected.Name.toLowerCase()].Image

    let dyno = dorace(speed, acceleration, handling, weight)
    let dyno2 = dotrack(speed, acceleration, handling, weight)
    let dyno3 = dodrag(speed, acceleration, handling, weight)
    let average = Math.round(dyno + dyno2 + dyno3) / 3

    let dynoembed = new EmbedBuilder()
    .setTitle("Dyno")
    .setDescription(`The dyno is a tool to measure your car's performance in races according to the formula.\n\nYour cars performance on\n\n**Street Races:** ${Math.floor(dyno)}\n**Track Races:** ${Math.round(dyno2)}\n**Drag Races:** ${Math.round(dyno3)}\n\nAverage: ${average}`)
    .setColor(colors.blue)
    .setThumbnail("https://i.ibb.co/86Gq9Cs/icon-dyno.png")
    .setImage(`${image}`)
    .setFields(
      {name: "Power", value: `${speed} HP`, inline: true},
      {name: "Acceleration", value: `${acceleration}s`, inline: true},
      {name: "Weight", value: `${weight} lbs`, inline: true},
      {name: "Handling", value: `${handling}`, inline: true},
    )

    return interaction.reply({embeds: [dynoembed]})

  },
};
