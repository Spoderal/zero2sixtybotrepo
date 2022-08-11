const Discord = require("discord.js");
const carsdb = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const wheelspinrewards = require("../data/wheelspinrewards.json");
const partsdb = require("../data/partsdb.json");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { numberWithCommas, toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wheelspin")
    .setDescription("Spin the wheel for prizes!"),
  async execute(interaction) {
    let uid = interaction.user.id;
    let userdata = await User.findOne({ id: uid });
    let cooldowns =
      (await Cooldowns.findOne({ id: uid })) || new Cooldowns({ id: uid });

    let wheelspincool = cooldowns.wheelspin;
    let timeout = 5000;

    if (wheelspincool !== null && timeout - (Date.now() - wheelspincool) > 0)
      return await interaction.reply(
        "Please wait 5 seconds before using this command again."
      );
    let wheelspins = userdata.wheelspins || 0;
    if (wheelspins <= 0) return await interaction.reply("You're out of wheel spins!");
    let items = ["🏎️", "💵", "⚙️", "🗺️"];
    let item = lodash.sample(items);
    let cash = wheelspinrewards.Cash;
    let maps = wheelspinrewards.Maps;

    let cars = wheelspinrewards.Cars;
    let parts = wheelspinrewards.Parts;
    let garagespaces = userdata.garageLimit;

    let usercars = userdata.cars;
    userdata.wheelspins -= 1;
    cooldowns.wheelspin = Date.now();
    let embed = new Discord.EmbedBuilder()
      .setTitle("Wheel Spin!")
      .setDescription(`${item}`)
      .setColor(colors.blue)
      .setThumbnail("https://i.ibb.co/pwbLqnR/wheelimg.png");
    await interaction.reply({ embeds: [embed] });
    setTimeout(() => {
      let item = lodash.sample(items);
      embed.setDescription(`${item}`);
      interaction.editReply({ embeds: [embed] });
    }, 1000);
    setTimeout(() => {
      let item = lodash.sample(items);
      embed.setDescription(`${item}`);
      interaction.editReply({ embeds: [embed] });
    }, 2000);
    setTimeout(() => {
      let item = lodash.sample(items);
      embed.setDescription(`${item}`);
      interaction.editReply({ embeds: [embed] });
      setTimeout(() => {
        if (item == "⚙️") {
          let reward = lodash.sample(parts);
          userdata.parts.push(reward.toLowerCase());

          embed.setDescription(
            `You won a ${partsdb.Parts[reward].Emote} ${partsdb.Parts[reward].Name}!`
          );
          interaction.editReply({ embeds: [embed] });
        } else if (item == "🏎️") {
          let randomnum = lodash.random(5);
          let reward;
          if (randomnum == 2) {
            reward = lodash.sample(wheelspinrewards.SuperRare);
          } else {
            reward = lodash.sample(cars);
          }
          embed.setDescription(
            `You won a ${carsdb.Cars[reward].Emote} ${carsdb.Cars[reward].Name}!`
          );
          embed.setImage(carsdb.Cars[reward].Image);
          embed.addFields([
            { name: `ID`, value: `${carsdb.Cars[reward.toLowerCase()].alias}` },
          ]);
          interaction.editReply({ embeds: [embed] });
          if (usercars.includes(reward)) {
            let sellprice = carsdb.Cars[reward].sellprice;
            userdata.cash += sellprice;
            interaction.channel.send(
              `You already own this car, so you got ${toCurrency(
                sellprice
              )} instead.`
            );
            return;
          }
          if (usercars.length >= garagespaces) {
            interaction.channel.send("You garage is full!");
            return;
          } else {
            let carindb = carsdb.Cars[reward];

            let ecarobj = {
              ID: carindb.alias,
              Name: carindb.Name,
              Speed: carindb.Speed,
              Acceleration: carindb["0-60"],
              Handling: carindb.Handling,
              Parts: [],
              Emote: carindb.Emote,
              Livery: carindb.Image,
              Range: carindb.Range,
              MaxRange: carindb.Range,
              Miles: 0,
            };

            let carobj = {
              ID: carindb.alias,
              Name: carindb.Name,
              Speed: carindb.Speed,
              Acceleration: carindb["0-60"],
              Handling: carindb.Handling,
              Parts: [],
              Emote: carindb.Emote,
              Livery: carindb.Image,
              Miles: 0,
            };

            if (carsdb.Cars[reward.toLowerCase()].Range) {
              userdata.cars.push(ecarobj);
            } else {
              userdata.cars.push(carobj);
            }
          }
        } else if (item == "💵") {
          let reward = lodash.sample(cash);
          userdata.cash += Number(reward);
          embed.setDescription(`You won ${toCurrency(reward)} cash!`);
          interaction.editReply({ embeds: [embed] });
        } else if (item == "🗺️") {
          let reward = lodash.sample(maps);
          switch (reward) {
            case "Common":
              userdata.cmaps += 1;
              break;
            case "Uncommon":
              userdata.ucmaps += 1;
              break;
          }
          embed.setDescription(
            `You won a ${numberWithCommas(reward)} barn map!`
          );
          interaction.editReply({ embeds: [embed] });
        }

        userdata.save();
      }, 500);
    }, 3000);
  },
};
