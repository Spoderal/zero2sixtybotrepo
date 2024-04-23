const {
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder
  } = require("discord.js");
  const { SlashCommandBuilder } = require("@discordjs/builders");
  const colors = require("../common/colors");
  const User = require("../schema/profile-schema")
  const partdb = require("../data/partsdb.json").Parts
  const emotes = require("../common/emotes").emotes
  const cardb = require('../data/cardb.json')
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("tune")
      .setDescription("Tune a car!")
      .addStringOption((option) => option
      .setName("car")
      .setRequired(true)
      .setDescription("The car to tune")
      ),
    async execute(interaction) {

      let caroption = interaction.options.getString("car")

      let userdata = await User.findOne({ id: interaction.user.id });
      let cars = userdata.cars

      let usercar = cars.find(c => c.Name.toLowerCase() == caroption.toLowerCase() || c.ID.toLowerCase() == caroption.toLowerCase())

      if (!usercar) return interaction.reply("You don't have that car!")

      let ogcar = cars.find(c => c.Name.toLowerCase() == caroption.toLowerCase() || c.ID.toLowerCase() == caroption.toLowerCase())


      let row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId("tune")
        .setPlaceholder("Select a stat to tune")
        .addOptions([
          {
            label: "Power",
            value: "power"
          },
          {
            label: "Acceleration",
            value: "accel"
          },
          {
            label: "Handling",
            value: "handling"
          },
          {
            label: "Weight",
            value: "weight"
          }
        ])
      )

      let row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId("min5")
        .setEmoji(`➖`)
        .setLabel("5")
        .setStyle("Primary"),
        new ButtonBuilder()
        .setCustomId("min1")
        .setEmoji(`➖`)
        .setLabel("1")
        .setStyle("Primary"),
        new ButtonBuilder()
        .setCustomId("plus1")
        .setEmoji(`➕`)
        .setLabel("1")
        .setStyle("Primary"),
        new ButtonBuilder()
        .setCustomId("plus5")
        .setEmoji(`➕`)
        .setLabel("5")
        .setStyle("Primary")
      )
      
await interaction.reply({content: `__OG__\n${ogcar.Speed} HP\n${ogcar.Acceleration} Acceleration\n${ogcar.Handling} Handling\n${ogcar.WeightStat} Weight`, components: [row]})

let filter = i => i.user.id === interaction.user.id
let collector = interaction.channel.createMessageComponentCollector({filter})

collector.on("collect", async (i) => {
  let stat
  if(i.values) stat = i.values[0]
  await interaction.editReply({components: [row, row2]})

    if(stat && i.customId === "min5") {
    const powerPoints = -5;
    console.log("test")
    const seed = Array
      .from(usercar.Name)
      .reduce((seed, char) => seed + char.charCodeAt(0), 0);
    
    const powerTune = hash(seed + powerPoints + accelPoints + handlingPoints + weightPoints);
    const accelTune = hash(powerTune);
    const handlingTune = hash(accelTune);
    const weightTune = hash(handlingTune);
    

    
    const tunedCar = {
      name: usercar.Name,
      power: Math.round(total(usercar.Speed, powerTune)),
      accel: Math.round(total(usercar.Acceleration, accelTune) * 10) / 10,
      handling: Math.round(total(usercar.Handling, handlingTune)),
      weight: Math.round(total(usercar.WeightStat, weightTune))
    };
    await i.update({content: `__Tuned__\n${tunedCar.speed} HP\n${tunedCar.acceleration} Acceleration\n${tunedCar.handling} Handling\n${tunedCar.weight} Weight`, components: [row, row2]})
  }
  else if(stat && i.customId === "min1") {
    const powerPoints = -1;
    
    const seed = Array
      .from(usercar.Name)
      .reduce((seed, char) => seed + char.charCodeAt(0), 0);
    
    const powerTune = hash(seed + powerPoints + accelPoints + handlingPoints + weightPoints);
    const accelTune = hash(powerTune);
    const handlingTune = hash(accelTune);
    const weightTune = hash(handlingTune);
    

    
    const tunedCar = {
      name: usercar.Name,
      power: Math.round(total(usercar.Speed, powerTune)),
      accel: Math.round(total(usercar.Acceleration, accelTune) * 10) / 10,
      handling: Math.round(total(usercar.Handling, handlingTune)),
      weight: Math.round(total(usercar.WeightStat, weightTune))
    };
    await i.update({content: `__Tuned__\n${tunedCar.speed} HP\n${tunedCar.acceleration} Acceleration\n${tunedCar.handling} Handling\n${tunedCar.weight} Weight`, components: [row, row2]})
  }


  const accelPoints = 0;
  const handlingPoints = 0;
  const weightPoints = 0;
  
})

// player's input


      

    },
  };
  function hash(seed) {
    const min = -10;
    const max = 10;
  
    const sine = Math.sin(seed) + 1;
    const offset = 1_000_000_000_000_000;
  
    const hash = Math.floor(sine * offset);
    const range = (max - min) + 1;
  
    return ((((hash - min) % range) + range) % range) + min;
  }
  function total(stock, tune) {
    const percentage = (stock * tune) / 100;
    return stock + percentage;
  }