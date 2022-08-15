const db = require("quick.db");
const squads = require("../data/squads.json");
const cars = require("../data/cardb.json");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("choose")
    .setDescription("Choose a car from a squad")
    .addStringOption((option) =>
      option
        .setName("squad")
        .setDescription("The squad to choose the car from PRESTIGE 2 REQUIRED")
        .setRequired(true)
        .addChoices(
          { name: "The Speed", value: "thespeed" },
          { name: "Scrap Heads", value: "scrapheads" },
          { name: "Snow Monsters", value: "snowmonsters" },
          { name: "Biker Gang", value: "bikergang" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to choose")
        .setRequired(true)
    ),
  async execute(interaction) {
    let created = db.fetch(`created_${interaction.user.id}`);

    if (!created) return await interaction.reply(GET_STARTED_MESSAGE);
    let squadchose = interaction.options.getString("squad");
    let idchose = interaction.options.getString("car");
    if (!squadchose)
      return await interaction.reply(
        "Choose a squad! `Command example: /choose flamehouse 1`"
      );
    if (!idchose)
      return await interaction.reply(
        "Choose an id for the squad car you'd like to take, or say list to see the list of cars and ids!`Command example: /choose flamehouse 1`"
      );
    let squadlist = ["thespeed", "scrapheads", "snowmonsters", "bikergang"];
    let prestige = db.fetch(`prestige_${interaction.user.id}`);

    if (prestige < 2)
      return await interaction.reply(
        "You need to be prestige 2 to choose a squad car!"
      );

    if (idchose == "list") {
      let listcars = squads.Squads[squadchose.toLowerCase()].Carlist;

      let embed = new discord.EmbedBuilder()
        .setTitle(`List of cars for ${squads.Squads[squadchose].Name}`)
        .setDescription(`${listcars.join("\n\n")}`);

      embed.setColor(colors.blue).setThumbnail(squads.Squads[squadchose].Icon);
      await interaction.reply({ embeds: [embed] });
    } else {
      if (!squadlist.includes(squadchose.toLowerCase()))
        return await interaction.reply(
          "Thats not a squad! The available squads are: FlameHouse, SkullCrunchers, TheSpeed, Scrapheads, and SnowMonsters"
        );
      if (idchose > 3)
        return await interaction.reply(
          "You can only choose from the first 3 cars in a squad"
        );
      let squadlevel = db.fetch(
        `${squadchose.toLowerCase()}_level_${interaction.user.id}`
      );
      if (!squadlevel)
        return await interaction.reply(
          "You need to beat this squad before taking a car!"
        );

      if (squadlevel < 5)
        return await interaction.reply(
          "You need to beat this squad before taking a car!"
        );
      let carid = db.fetch(`${squadchose.toLowerCase()}_car_${idchose}`);
      let garagelimit = db.fetch(`garagelimit_${interaction.user.id}`) || 10;
      let carsu = db.fetch(`cars_${interaction.user.id}`);

      if (carsu.length >= garagelimit)
        return await interaction.reply(
          `Your garage is full! Sell a car or get more garage space.`
        );

      if (!carid)
        return await interaction.reply(
          "Thats not an id, say list to see the list of cars and ids! `Command example: /choose flamehouse 1`"
        );
      let redeemed = db.fetch(
        `redeemed_car_${squadchose.toLowerCase()}_${interaction.user.id}`
      );
      if (redeemed)
        return await interaction.reply(
          "You've already chosen a car from this squad!"
        );
      let carname = cars.Cars[carid.toLowerCase()].Name;
      db.push(`cars_${interaction.user.id}`, carid.toLowerCase());
      db.set(
        `${carname}speed_${interaction.user.id}`,
        cars.Cars[carid.toLowerCase()].Speed
      );
      db.set(
        `${carname}060_${interaction.user.id}`,
        parseFloat(cars.Cars[carid.toLowerCase()]["0-60"])
      );
      db.add(
        `${carname}drift_${interaction.user.id}`,
        parseInt(cars.Cars[carid.toLowerCase()].Drift)
      );
      db.add(
        `${carname}handling_${interaction.user.id}`,
        parseInt(cars.Cars[carid.toLowerCase()].Handling)
      );
      db.set(
        `${carname}resale_${interaction.user.id}`,
        parseInt(cars.Cars[carid.toLowerCase()].sellprice)
      );
      db.set(
        `redeemed_car_${squadchose.toLowerCase()}_${interaction.user.id}`,
        true
      );
      db.set(
        `isselected_${carname}_${interaction.user.id}`,
        cars.Cars[squadchose.toLowerCase()].alias
      );
      // db.set(
      //   `selected_${cars.Cars[reward.toLowerCase()].alias}_${
      //     interaction.user.id
      //   }`,
      //   cars.Cars[reward.toLowerCase()].Name
      // );

      let embed = new discord.EmbedBuilder()
        .setTitle(`✅ Chose ${carname}`)
        .addFields([
          { name: `ID`, value: `${cars.Cars[squadchose.toLowerCase()].alias}` },
        ])
        .setImage(`${cars.Cars[squadchose.toLowerCase()].Image}`);
      embed.setColor(colors.blue);

      await interaction.reply({ embeds: [embed] });
    }
  },
};
