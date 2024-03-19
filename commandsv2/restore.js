const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const partdb = require("../data/partsdb.json")

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
    let required = []
    if(!userdata.parts.includes("j1exhaust")){
      required.push(`${partdb.Parts.j1exhaust.Emote} ${partdb.Parts.j1exhaust.Name}`)
    }
    if(!userdata.parts.includes("j1engine")){
      required.push(`${partdb.Parts.j1engine.Emote} ${partdb.Parts.j1engine.Name}`)
    }
    if(!userdata.parts.includes("body")){
      required.push(`${partdb.Parts.body.Emote} ${partdb.Parts.body.Name}`)
    }
    if(!userdata.parts.includes("j1intake")){
      required.push(`${partdb.Parts.j1intake.Emote} ${partdb.Parts.j1intake.Name}`)
    }
    if(!userdata.parts.includes("j1suspension")){
      required.push(`${partdb.Parts.j1suspension.Emote} ${partdb.Parts.j1suspension.Name}`)
    }
    let requiredp =
      userdata.parts.includes("j1exhaust") &&
      userdata.parts.includes("j1engine") &&
      userdata.parts.includes("body") &&
      userdata.parts.includes("j1intake") &&
      userdata.parts.includes("j1suspension")
    let toolbox = userdata.items.includes("toolbox");
    let tool = false
    let wrench = false

    console.log(userdata.items.filter(item => item === "wrench").length)

    if(userdata.items.filter(item => item === "wrench").length >= 5){
      wrench = true
    }
    if(toolbox) {
      tool = true
    }
    if (!cars.Cars[car].Junked)
      return await interaction.reply("Thats not a junk car!");
    if (!requiredp && tool == false && wrench == false){
     interaction.reply(
        `You can't restore this car without the required parts in your inventory! **DON'T UPGRADE YOUR CAR WITH THEM**\nThe parts you need are: ${required.join(', ')}\n\nYou can find these parts by racing your barn find in **junk race**, wheelspins, or \`/junkyard\``
      );
      if(userdata.tutorial && userdata.tutorial.started == true && userdata.tutorial.stage == 2 && userdata.tutorial.type == "restore" ){
        let tut = userdata.tutorial
        tut.stage += 1
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "tutorial": tut,
            },
          },
    
        );
    
        interaction.channel.send(`**TUTORIAL:** Now that we know where to find parts and what we need to restore this classic, lets run \`/junkyard\` to find some parts!`)
      }

      return

    }



    let carindb = cars.Cars[selected.Name.toLowerCase()].restored;
    carindb = cars.Cars[carindb.toLowerCase()];
    let carobj = {
      ID: carindb.alias,
      Name: carindb.Name,
      Speed: carindb.Speed,
      Acceleration: carindb["0-60"],
      Handling: carindb.Handling,
      WeightStat: carindb.Weight,
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
    if (tool == true) {
      for (var i7 = 0; i7 < 1; i7++)
        userdata.items.splice(userdata.items.indexOf("toolbox"), 1);
    }
   else if(wrench == true){
      for (var i8 = 0; i8 < 5; i8++)
      userdata.items.splice(userdata.items.indexOf("toolbox"), 1);
    }
    else {
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

    }

    if(userdata.tutorial && userdata.tutorial.started == true && userdata.tutorial.stage == 4 && userdata.tutorial.type == "restore"){
      let tut = userdata.tutorial
      tut.restorefinished = true
      tut.started = false
      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            "tutorial": tut,
          },
        },
  
      );

      userdata.cash += 5000
  
      interaction.channel.send(`**TUTORIAL:** Enjoy your newly aquired classic! Race with it with \`/race [street race] [${carobj.ID}] [tier 1]\`\n\nThanks for completing the restoration tutorial! You've received $5K`)
    }

    userdata.save();

    await interaction.reply(`Restored ✅`);
  },
};
