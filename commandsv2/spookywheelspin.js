const Discord = require("discord.js");
const carsdb = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const wheelspinrewards = require("../data/spookywheelspin.json");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spookywheelspin")
    .setDescription("Spin the spooky wheel for spooky prizes!"),
  async execute(interaction) {
    let uid = interaction.user.id;
    let userdata = await User.findOne({ id: uid });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let cooldowndata =
      (await Cooldowns.findOne({ id: uid })) || new Cooldowns({ id: uid });

    let wheelspincool = cooldowndata.spwheelspin || 0;
    let timeout = 5000;
    if (wheelspincool !== null && timeout - (Date.now() - wheelspincool) > 0)
      return await interaction.reply(
        "Please wait 5 seconds before using this command again."
      );
    let wheelspins = userdata.candy;
    if (wheelspins < 50)
      return await interaction.reply("Not enough candy! You need 50");
    let items = ["🏎️", "💵"];
    let item = lodash.sample(items);
    let cash = wheelspinrewards.Cash;
    let cars = wheelspinrewards.Cars;

    let garagespaces = userdata.garagelimit;

    let usercars = userdata.cars;
    userdata.candy -= 50;
    userdata.update();
    cooldowndata.spwheelspin = Date.now();
    cooldowndata.save();
    let embed = new Discord.EmbedBuilder()
      .setTitle("Spooky Wheel Spin!")
      .setDescription(`${item}`)
      .setColor(colors.blue)
      .setThumbnail("https://i.ibb.co/r64PfMQ/spookyspin.png");
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
        if (item == "🏎️") {
          let randomnum = lodash.random(20);
          let reward;
          if (randomnum == 2) {
            reward = lodash.sample(wheelspinrewards.SuperRare);
          } else {
            reward = lodash.sample(cars);
          }
          let carindb = carsdb.Cars[reward.toLowerCase()];
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
            Price: 0,
          };

          embed.setDescription(
            `You won a ${carsdb.Cars[reward].Emote} ${carsdb.Cars[reward].Name}!`
          );
          embed.setImage(carsdb.Cars[reward].Image);
          interaction.editReply({ embeds: [embed] });
          let filtered = usercars.filter(
            (car) => car.Name == carsdb.Cars[reward].Name
          );

          if (filtered[0]) {
            let sellprice = carsdb.Cars[reward.toLowerCase()].sellprice;
            userdata.cash += Number(sellprice);
            interaction.channel.send(
              `You already own this car, so you got ${toCurrency(
                sellprice
              )} instead.`
            );
            userdata.save();
            return;
          }
          if (usercars.length >= garagespaces) {
            interaction.channel.send("You garage is full!");
            return;
          } else {
            userdata.cars.push(carobj);
          }
        } else if (item == "💵") {
          let randomnum = lodash.random(10);
          let reward;
          if (randomnum == 2) {
            reward = lodash.sample(wheelspinrewards.RareCash);
          } else {
            reward = lodash.sample(cash);
          }
          userdata.cash += Number(reward);
          embed.setDescription(`You won ${toCurrency(reward)} cash!`);
          interaction.editReply({ embeds: [embed] });
        } else if (item == "❓") {
          embed.setDescription(`You won nothing lol`);
          interaction.editReply({ embeds: [embed] });
        }
        userdata.save();
      }, 500);
    }, 3000);
  },
};
