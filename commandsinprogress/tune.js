const {
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder
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

      let carindb = cardb.Cars[caroption]

        // player's car
let car = {
  name: carindb.Name,
  power: carindb.Speed,
  accel: carindb["0-60"],
  handling: carindb.Handling,
  weight: carindb.Weight
};

// player's input
const powerPoints = 10;
const accelPoints = 0;
const handlingPoints = 0;
const weightPoints = 0;

function hash(seed) {
  const min = -10;
  const max = 10;

  const sine = Math.sin(seed) + 1;
  const offset = 1_000_000_000_000_000;

  const hash = Math.floor(sine * offset);
  const range = (max - min) + 1;

  return ((((hash - min) % range) + range) % range) + min;
}

const seed = Array
  .from(car.name)
  .reduce((seed, char) => seed + char.charCodeAt(0), 0);

const powerTune = hash(seed + powerPoints + accelPoints + handlingPoints + weightPoints);
const accelTune = hash(powerTune);
const handlingTune = hash(accelTune);
const weightTune = hash(handlingTune);

function total(stock, tune) {
  const percentage = (stock * tune) / 100;
  return stock + percentage;
}

const tunedCar = {
  name: car.name,
  power: Math.round(total(car.power, powerTune)),
  accel: Math.round(total(car.accel, accelTune) * 10) / 10,
  handling: Math.round(total(car.handling, handlingTune)),
  weight: Math.round(total(car.weight, weightTune))
};

console.log(powerTune, accelTune, handlingTune, weightTune);
// 7 -5 6 1
interaction.reply(`__OG__\n${carindb.Speed} HP\n${carindb["0-60"]} Acceleration\n${carindb.Handling} Handling\n${carindb.Weight} Weight\n__Tuned__${tunedCar.name}\n${tunedCar.power} hp\n${tunedCar.accel} Acceleration\n${tunedCar.handling} Handling\n${tunedCar.weight}`)
console.log(tunedCar);
/*
{
name: '2023 GMC Hummer EV',
power: 1052,
accel: 2.9,
handling: 663,
weight: 9154
}
*/
      

    },
  };
  