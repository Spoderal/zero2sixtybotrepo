const { SlashCommandBuilder } = require("@discordjs/builders");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");

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
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let carsdb = require(`../data/cardb.json`);

    let idtoselect = interaction.options.getString("car");
    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";

    if (selected == "No ID")
      return await interaction.reply(`This car doesn't have an ID!`);

    let carimage = selected.Image || carsdb.Cars[selected.Name.toLowerCase()].Image;

    let showcase = {
      Speed: selected.Speed,
      Acceleration: selected.Acceleration,
      Handling: selected.Handling,
      Weight: selected.WeightStat,
      Image: carimage
    }

    userdata.showcase = showcase;

    userdata.save();

    await interaction.reply(
      `✅ Showcasing your ${carsdb.Cars[selected.Name.toLowerCase()].Name}`
    );
  },
};
