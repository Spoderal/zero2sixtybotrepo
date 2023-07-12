const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restore")
    .setDescription("View the status of the barn find you own and restore it")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car by id you want to view")
        .setRequired(true)
    ),
  async execute(interaction) {
    var idtoselect = interaction.options.getString("car");
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new Discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    let car = selected;

    var usercars = userdata.cars;
    if (!cars.Cars[selected.Name.toLowerCase()])
      return await interaction.reply("Thats not a car!");
    car = car.Name.toLowerCase();

    let requiredp =
      userdata.parts.includes("j1exhaust") &&
      userdata.parts.includes("j1engine") &&
      userdata.parts.includes("body") &&
      userdata.parts.includes("j1intake") &&
      userdata.parts.includes("j1suspension");
    let toolbox = userdata.parts.includes("toolbox");
    if (!cars.Cars[car].Junked)
      return await interaction.reply("Thats not a junk car!");
    if (!requiredp && !toolbox)
      return interaction.reply(
        "You can't restore this car without the required parts in your inventory! You'll need a j1exhaust, a j1engine, a j1body, a j1intake, and a j1suspension!"
      );

    let carindb = cars.Cars[selected.Name.toLowerCase()].restored;
    carindb = cars.Cars[carindb.toLowerCase()];
    let carobj = {
      ID: carindb.alias,
      Name: carindb.Name,
      Speed: carindb.Speed,
      Acceleration: carindb["0-60"],
      Handling: carindb.Handling,
      Weight: carindb.Weight,
      Parts: [],
      Emote: carindb.Emote,
      Livery: carindb.Image,
      Miles: 0,
      Gas: 10,
      MaxGas: 10,
    };

    for (var i = 0; i < 1; i++) usercars.splice(usercars.indexOf(selected), 1);
    userdata.cars = usercars;

    userdata.cars.push(carobj);
    let userparts = userdata.parts;
    for (var i2 = 0; i2 < 1; i2++)
      userparts.splice(userparts.indexOf("j1exhaust"), 1);
    for (var i3 = 0; i3 < 1; i3++)
      userparts.splice(userparts.indexOf("j1engine"), 1);
    for (var i4 = 0; i4 < 1; i4++)
      userparts.splice(userparts.indexOf("j1intake"), 1);
    for (var i5 = 0; i5 < 1; i5++)
      userparts.splice(userparts.indexOf("j1suspension"), 1);
    for (var i6 = 0; i6 < 1; i6++)
      userparts.splice(userparts.indexOf("j1body"), 1);

    userdata.save();

    await interaction.reply(`Restored ✅`);
  },
};
