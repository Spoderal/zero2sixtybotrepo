const db = require("quick.db");
const lodash = require("lodash");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const Global = require("../schema/global-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unbox")
    .setDescription("Unbox an import crate")
    .addStringOption((option) =>
      option
        .setName("crate")
        .setDescription("The crate you want to unbox")
        .addChoice("Common", "common")
        .addChoice("Rare", "rare")
        .addChoice("Exotic", "exotic")
        .addChoice("Drift", "drift")
        .addChoice("Z Crate 1", "z crate 1")
        .setRequired(true)
    ),
  async execute(interaction) {
    let db = require("quick.db");
    let crates = require("../imports.json");
    let cars = require("../cardb.json");
    let list = ["common", "rare", "exotic", "drift", "z crate 1"];

    let userdata = await User.findOne({ id: interaction.user.id });

    let bought = interaction.options.getString("crate");
    let carsu = userdata.cars;
    if (!bought)
      return interaction.reply(
        "**To use this command, specify the crate you want to buy. To check what crates are available check the imports shop by sending /imports.**"
      );
    if (!list.includes(bought))
      return interaction.reply("**That crate isn't available!**");
    let garagelimit = userdata.garagelimit;

    if (carsu.length >= garagelimit)
      return interaction.reply(
        `Your garage is full! Sell a car or get more garage space.`
      );

    let commonkeys = userdata.ckeys;
    let rarekeys = userdata.rkeys;
    let exotickeys = userdata.ekeys;

    let driftkeys = userdata.dkeys || 0;
    let gold = userdata.gold;

    if (bought == "common" && commonkeys < 50)
      return interaction.reply(
        `You dont have enough keys! This crate costs 50 common keys`
      );
    if (bought == "rare" && rarekeys < 25)
      return interaction.reply(
        `You dont have enough keys! This crate costs 25 rare keys`
      );
    if (bought == "exotic" && exotickeys < 20)
      return interaction.reply(
        `You dont have enough keys! This crate costs 20 exotic keys`
      );
    if (bought == "drift" && driftkeys < 5)
      return interaction.reply(
        `You dont have enough keys! This crate costs 5 drift keys`
      );
    if (bought == "z crate 1" && gold < 5)
      return interaction.reply(
        `You dont have enough gold! This crate costs 5 gold`
      );
    if (bought == "ferrari" && ferrarikeys < 100)
      return interaction.reply(
        `You dont have enough keys! This crate costs 100 ferrari keys`
      );

    if (bought == "common") {
      userdata.ckeys -= 50;
    } else if (bought == "rare") {
      userdata.rkeys -= 25;
    } else if (bought == "exotic") {
      userdata.ekeys -= 20;
    } else if (bought == "drift") {
      userdata.dkeys -= 5;
    } else if (bought == "z crate 1") {
      userdata.gold -= 20;
    }

    let result;
    let rarity;
    if (bought == "z crate 1") {
      var rarities = [
        {
          type: "Common",
          chance: 60,
        },
        {
          type: "Rare",
          chance: 5,
        },
        {
          type: "Uncommon",
          chance: 34,
        },
        {
          type: "Legendary",
          chance: 1,
        },
      ];

      function pickRandom() {
        // Calculate chances for common
        var filler =
          100 -
          rarities.map((r) => r.chance).reduce((sum, current) => sum + current);

        if (filler < 0) {
          console.log("chances sum is higher than 100!");
          return;
        }

        // Create an array of 100 elements, based on the chances field
        var probability = rarities
          .map((r, i) => Array(r.chance === 0 ? filler : r.chance).fill(i))
          .reduce((c, v) => c.concat(v), []);

        // Pick one
        var pIndex = Math.floor(Math.random() * 100);
        console.log(probability);
        rarity = rarities[probability[pIndex]];
        console.log(pIndex);
        console.log(rarity);
        result = lodash.sample(crates["z crate"][rarity.type.toLowerCase()]);
        console.log(result);
      }

      pickRandom();
      let usercars = userdata.cars;
      let car = cars.Cars[result.toLowerCase()];
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
        Wins: 0,
      };
      let filtered = usercars.filter((car) => car.Name == carobj.Name);

      if (filtered[0]) {
        userdata.cash += 500000;
        interaction.reply(
          "You already own this car, so you got $500k instead."
        );
        return;
      }

      let embed = new MessageEmbed()
        .setTitle(`${rarity.type} Car Find`)
        .addField(`Car`, `${car.Name}`)
        .setImage(`${car.Image}`)
        .setColor("#60b0f4");
      if (car.StatTrack) {
        embed.addField(`Stack Track!`, `\u200b`);
      }
      userdata.cars.push(carobj);
      interaction.reply({ embeds: [embed] });
    } else {
      let cratecontents = crates[bought].Contents;
      let randomitem = lodash.sample(cratecontents);
      let usercars = userdata.cars;
      let carindb = cars.Cars[randomitem.toLowerCase()];
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
      let filtered = usercars.filter((car) => car.Name == carobj.Name);

      if (filtered[0]) {
        userdata.cash += 3000;
        interaction.reply("You already own this car, so you got $3k instead.");
        return;
      }

      let embedfinal = new MessageEmbed()
        .setTitle(`Unboxing ${bought} crate...`)
        .setColor("#60b0f4");

      interaction.reply({ embeds: [embedfinal] });
      setTimeout(() => {
        userdata.cars.push(carobj);
        embedfinal.setTitle(`Unboxed ${bought} crate!`);
        embedfinal.addField(
          `Car`,
          `${cars.Cars[randomitem].Emote} ${cars.Cars[randomitem].Name}`
        );
        embedfinal.addField(
          `ID`,
          `${cars.Cars[randomitem].Emote} ${cars.Cars[randomitem].alias}`
        );
        embedfinal.setImage(cars.Cars[randomitem].Image);
        interaction.editReply({ embeds: [embedfinal] });
      }, 1000);
    }
  },
};
