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
    let exhaust = selected.Exhaust;
    let tires = selected.Tires;
    let intake = selected.Intake;
    let clutch = selected.Clutch;
    let suspension = selected.Suspension;
    let gearbox = selected.Gearbox;
    let uitems = userdata.items || [];
    let body = selected.Body;

    let engine = selected.Engine;
    if (!cars.Cars[car].Junked)
      return await interaction.reply("Thats not a junk car!");

    if (
      !exhaust ||
      !tires  ||
      !intake  ||
      !clutch  ||
      !suspension  ||
      !gearbox ||
      !body  ||
      
      !engine ||
      !uitems.includes("toolbox")
    )
    {

      let required = []
      if( !exhaust){
        required.push("<:exhaustrestored:941546331384717333> Exhaust")
      }
      if( !tires){
        required.push("<:tiresrestored:941546331703509132> Tires")
      }
      if( !intake){
        required.push("<:intakerestored:941546331686719558> Intake")
      }
      if( !clutch){
        required.push("<:clutchrestored:941546331590250566> Clutch")
      }
      if( !suspension){
        required.push("<:suspensionrestored:941546331367960627> Suspension")
      }
      if( !gearbox){
        required.push("<:gearboxdefault:968751095629348894> Gearbox")
      }
      if( !body){
        required.push("<:spoilerrestored:941546331716063232> Body")
      }
      if( !engine){
        required.push("<:enginerestored:941546331808333864> Engine")
      }
        let embed = new Discord.EmbedBuilder()
        .setTitle(`Parts required for restoration`)
        .setDescription(`${required.join('\n')}`)
        .setColor(colors.blue)
        return await interaction.reply({
          content: `You haven't completed this restoration! Use /upgrade to restore it, or buy a toolbox from the item shop!`,
          embeds: [embed]
        }
         
        );
    }

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

    await interaction.reply(`✅`);
  },
};
