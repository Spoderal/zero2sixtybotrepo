const Discord = require("discord.js");
const barns = require("../data/barns.json");
const lodash = require("lodash");
const carsdb = require("../data/cardb.json");
const ms = require(`pretty-ms`);
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("barn")
    .setDescription("Search barns for restoration cars")
    .addStringOption((option) =>
      option
        .setName("rarity")
        .setDescription("The barn you want to search")
        .addChoices(
          { name: "Common", value: "common" },
          { name: "Rare", value: "rare" },
          { name: "Legendary", value: "legendary" }
        )

        .setRequired(true)
    ),

  async execute(interaction) {
    let userid = interaction.user.id;

    let userdata =
      (await User.findOne({ id: userid })) || new User({ id: userid });
    let cooldowns =
      (await Cooldowns.findOne({ id: userid })) ||
      new Cooldowns({ id: userid });

    let barntimer = cooldowns.barn;
    let barnmaps = userdata.cmaps;
    let ubarnmaps = userdata.ucmaps;
    let rbarnmaps = userdata.rmaps;
    let lbarnmaps = userdata.lmaps;
    let rarity2 = interaction.options.getString("rarity");

    if (!barnmaps && rarity2 == "common")
      return await interaction.reply("You don't have any common barn maps!");

    if (!rbarnmaps && rarity2 == "rare")
      return await interaction.reply("You don't have any rare barn maps!");

    if (!lbarnmaps && rarity2 == "legendary")
      return await interaction.reply("You don't have any legendary barn maps!");

    let house = userdata.house;

    let timeout = 3600000;
    if (house) timeout = 300000;

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

    var rarities = [
      {
        type: "Common",
        chance: 0,
      },
      {
        type: "Legendary",
        chance: 10,
      },
      {
        type: "Rare",
        chance: 30,
      },
      {
        type: "Uncommon",
        chance: 50,
      },
    ];

    // Calculate chances for common
    var filler =
      100 -
      rarities.map((r) => r.chance).reduce((sum, current) => sum + current);

    if (filler <= 0) return;

    // Create an array of 100 elements, based on the chances field
    let barnfind = lodash.sample(barns.Barns[rarity2.toLowerCase()]);
    let resale;
    let namefor;
    let color;
    switch (rarity2) {
      case "common":
        color = "#388eff";
        resale = 1000;
        namefor = "Common";
        break;
      case "uncommon":
        color = "#f9ff3d";
        resale = 2500;
        namefor = "Uncommon";
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

    switch (rarity2) {
      case "common":
        userdata.cmaps -= 1;
        break;

      case "uncommon":
        userdata.ucmaps -= 1;
        break;

      case "rare":
        userdata.rmaps -= 1;
        break;

      case "legendary":
        userdata.lmaps -= 1;
        break;
    }

    let arrByID = cars.find(
      (item) => item.ID == carobj.ID || item.Name == carobj.Name
    );
    if (arrByID) {
      userdata.cash += resale;

      await interaction.reply(
        `You found a ${
          carindb.Name
        } but you already have this car, so you found ${toCurrency(
          resale
        )} instead.`
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
      .setColor(color);

    await interaction.reply({ embeds: [embed] });
  },
};
