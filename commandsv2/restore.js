const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");

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

    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    console.log(selected);
    if (selected == "No ID") {
      let errembed = new Discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return interaction.reply({ embeds: [errembed] });
    }
    let car = selected;

    var usercars = userdata.cars;
    if (!cars.Cars[selected.Name.toLowerCase()])
      return interaction.reply("Thats not a car!");
    car = car.Name.toLowerCase();
    let exhaust = selected.Exhaust;
    let tires = selected.Tires;
    let intake = selected.Intake;
    let clutch = selected.Clutch;
    let suspension = selected.Suspension;
    let gearbox = selected.Gearbox;

    let body = selected.Body;

    if (!cars.Cars[car].Junked)
      return interaction.reply("Thats not a junk car!");

    if (
      !exhaust &&
      !tires &&
      !intake &&
      !clutch &&
      !suspension &&
      !gearbox &&
      !body
    )
      return interaction.reply(
        `You haven't completed this restoration! Use /upgrade to restore it.`
      );

    let carindb = cars.Cars[selected.Name.toLowerCase()].restored;
    carindb = cars.Cars[carindb.toLowerCase()];
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

    for (var i = 0; i < 1; i++) usercars.splice(usercars.indexOf(selected), 1);
    userdata.cars = usercars;

    userdata.cars.push(carobj);

    userdata.save();

    interaction.reply(`✅`);
  },
};
