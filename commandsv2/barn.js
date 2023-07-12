const Discord = require("discord.js");
const barns = require("../data/barns.json");
const lodash = require("lodash");
const carsdb = require("../data/cardb.json");
const ms = require(`pretty-ms`);
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency, randomRange } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("barn")
    .setDescription("Search barns for old cars to restore!"),

  async execute(interaction) {
    let userid = interaction.user.id;

    let userdata =
      (await User.findOne({ id: userid })) || new User({ id: userid });
    let cooldowns =
      (await Cooldowns.findOne({ id: userid })) ||
      new Cooldowns({ id: userid });

    let barntimer = cooldowns.barn;
    let barnmaps = userdata.barnmaps;

    if (barnmaps <= 0)
      return await interaction.reply("You don't have any common barn maps!");

    let timeout = 3600000;

    let randomRarity = randomRange(1, 100);
    let rarity;

    if (randomRarity >= 40) {
      rarity = "common";
    } else if (randomRarity < 40) {
      rarity = "rare";
    } else if (randomRarity < 10) {
      rarity = "legendary";
    } else {
      rarity = "common";
    }

    let garagelimit = userdata.garageLimit;
    let usercars = userdata.cars;
    if (usercars.length >= garagelimit)
      return await interaction.reply(
        "Your spaces are already filled. Sell a car or get more garage space!"
      );

    if (barntimer !== null && timeout - (Date.now() - barntimer) > 0) {
      let time = ms(timeout - (Date.now() - barntimer));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`Please wait ${time} before searching barns again.`);

      await interaction.reply({ embeds: [timeEmbed] });

      return;
    }

    // Create an array of 100 elements, based on the chances field
    let barnfind = lodash.sample(barns.Barns[rarity.toLowerCase()]);
    let resale;
    let namefor;
    let color;
    switch (rarity) {
      case "common":
        color = "#388eff";
        resale = 1000;
        namefor = "Common";
        break;
      case "rare":
        color = "#a80000";
        resale = 10000;
        namefor = "Rare";
        break;
      case "legendary":
        color = "#44e339";
        resale = 25000;
        namefor = "Legendary";
        break;
    }

    let cars = userdata.cars;
    let carindb = carsdb.Cars[barnfind.toLowerCase()];
    console.log(carindb)
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
    userdata.barnmaps -= 1;

    let arrByID = cars.filter((item) => item.Name == carobj.Name);
    console.log(arrByID);
    if (arrByID[0]) {
      await interaction.reply(
        `You found a ${carindb.Name} but you already have this car..`
      );
      userdata.save();

      return;
    }

    userdata.cars.push(carobj);
    userdata.save();

    cooldowns.barn = Date.now();
    cooldowns.save();

    let embed = new Discord.EmbedBuilder()
      .setTitle(`${namefor} Barn Find`)
      .addFields([
        { name: "Car", value: carobj.Name },
        { name: "ID", value: carobj.ID },
      ])
      .setImage(carobj.Livery)
      .setColor(`${color}`);

    await interaction.reply({ embeds: [embed] });
  },
};
