const db = require("quick.db");
const Discord = require("discord.js");
const pfpdb = require("../pfpsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const Global = require("../schema/global-schema");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("showcase")
    .setDescription("Showcase your car in your garage")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id you'd like to showcase")
        .setRequired(true)
    ),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });

    let carsdb = require(`../cardb.json`);
    let usercars = userdata.cars;

    let idtoselect = interaction.options.getString("car");
    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";

    if (selected == "No ID")
      return interaction.reply(`This car doesn't have an ID!`);

    let carimage =
      selected.Image || carsdb.Cars[selected.Name.toLowerCase()].Image;

    userdata.showcase = carimage;

    userdata.save();

    interaction.reply(
      `✅ Showcasing your ${carsdb.Cars[selected.Name.toLowerCase()].Name}`
    );
  },
};
