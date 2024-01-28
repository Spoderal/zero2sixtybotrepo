const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/profile-schema");
const colors = require("../common/colors");
const { randomRange } = require("../common/utils");
const ms = require(`pretty-ms`);
const lodash = require("lodash")
const BARN_TIMEOUT = 3600000;
const carsdb = require("../data/cardb.json");
const barns = require("../data/barns.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("barn")
    .setDescription("Search barns for old cars to restore!"),

  async execute(interaction) {
    const userId = interaction.user.id;

    let userdata = (await User.findOne({ id: userId })) || new User({ id: userId });
    let cooldowns = (await Cooldowns.findOne({ id: userId })) || new Cooldowns({ id: userId });

    let barntimer = cooldowns.barn;
    let barnmaps = userdata.barnmaps;

    if (barnmaps <= 0) {
      return await interaction.reply("You don't have any barn maps! You can earn them in drag races");
    }

    let randomRarity = randomRange(1, 100);
    let rarity = (randomRarity >= 40) ? "common" : (randomRarity < 10) ? "legendary" : "rare";

    let garagelimit = userdata.garageLimit;
    let usercars = userdata.cars;
    if (usercars.length >= garagelimit) {
      return await interaction.reply("Your spaces are already filled. Sell a car or get more garage space!");
    }

    if (barntimer !== null && BARN_TIMEOUT - (Date.now() - barntimer) > 0) {
      let time = ms(BARN_TIMEOUT - (Date.now() - barntimer));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`Please wait ${time} before searching barns again.`);

      await interaction.reply({ embeds: [timeEmbed] });
      return;
    }

    let barnfind = lodash.sample(barns.Barns[rarity.toLowerCase()]);
    let color, namefor;

    switch (rarity) {
      case "common":
        color = "#388eff";
        namefor = "Common";
        break;
      case "rare":
        color = "#a80000";
        namefor = "Rare";
        break;
      case "legendary":
        color = "#44e339";
        namefor = "Legendary";
        break;
      default:
        color = "#388eff";
        namefor = "Common";
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
      WeightStat: carindb.Weight,
      Gas: 10,
      MaxGas: 10,
    };

    userdata.barnmaps -= 1;

    let arrByID = cars.filter((item) => item.Name == carobj.Name);
    if (arrByID[0]) {
      await interaction.reply(`You found a ${carindb.Name} but you already have this car..`);
      userdata.save();
      return;
    }

    if (userdata.tutorial && userdata.tutorial.started) {
      userdata.tutorial.started = false;
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
      .setDescription(`You found a barn car! How do you restore it and use it? Run \`/restore\` for more information on restoring barn finds!`)
      .setImage(carobj.Livery)
      .setColor(color);

    await interaction.reply({ embeds: [embed] });

    if (userdata.tutorial && userdata.tutorial.started) {
      await interaction.channel.send(`You've finished the tutorial! If you want to see the other features run \`/help\`, have fun!`);
    }
  },
};
