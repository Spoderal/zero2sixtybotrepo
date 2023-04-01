const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const {
  toCurrency,
  blankInlineField,
  convertMPHtoKPH,
} = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const itemdb = require("../data/items.json");
const { createCanvas, loadImage } = require("canvas");
const brands = require("../data/brands.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View the default stats of a car or part")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("car_part")
        .setDescription("Get the default stats of a car")
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription("The item you want to see the stats for")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("id")
        .setDescription("Get the stats and parts of your car by ID")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The car you want to see the stats for")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("If you'd like to see the stats of a users car")
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    let subcommandfetch = interaction.options.getSubcommand();
    var list = cars.Cars;
    var item = interaction.options.getString("item");
    let id = interaction.options.getString("id");
    let user = interaction.options.getString("user") || interaction.user
    let userdata = await User.findOne({ id: user.id });
    let settings = userdata.settings;
    let brandsarr = []
    for(let b in brands){
      brandsarr.push(brands[b])
    }
    let weightemote = emotes.weight;


    if (subcommandfetch == "car_part" && item && list[item.toLowerCase()]) {
      let canvas = createCanvas(1280, 720);
      let ctx = canvas.getContext("2d");
      await interaction.deferReply();
      let carindb = list[item.toLowerCase()]

      let carbg = await loadImage("https://i.ibb.co/MN2rTZ7/newcardblue-1.png"); 
      let carimg = await loadImage(carindb.Image)
      let brand = brandsarr.filter((br) => br.emote == carindb.Emote)
      let brimg = await loadImage(brand[0].image)
      let flag = await loadImage(brand[0].country)
      ctx.drawImage(carimg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(carbg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(brimg, 15, 620, 100, 100);
      ctx.drawImage(flag, 1120, 620, 180, 100);

      ctx.font = "bold 54px sans-serif";
      ctx.fillStyle = "#ffffff";
      
  
      ctx.fillText(carindb.Name, 125, 690);

      ctx.font = "bold 45px sans-serif";

      ctx.fillText(carindb.Speed, 15, 105);
      ctx.fillText(carindb["0-60"], 170, 105);
      ctx.fillText(carindb.Handling, 300, 105);
      
      ctx.font = "bold 35px sans-serif";
      ctx.fillText(carindb.Weight, 435, 105);

      ctx.font = "bold 110px sans-serif";

      ctx.fillText(carindb.Class, 1160, 110);

      ctx.font = "bold 30px sans-serif";
      let price = `${toCurrency(carindb.Price)}` 

      if(carindb.Price <= 0){
        price = `Obtained: ${carindb.Obtained}`
      }
      else if(carindb.Squad){
        price = `Obtained: Squad`
      }

      ctx.fillText(price, 760, 680);

      let attachment = new Discord.AttachmentBuilder(await canvas.toBuffer(), {
        name: "stats-image.png",
      });


     await interaction.editReply({
        files: [attachment],
        fetchReply: true,
      });
      
    } else if (subcommandfetch == "id") {
      let canvas = createCanvas(1280, 720);
      let ctx = canvas.getContext("2d");
      await interaction.reply("Please wait...");
      let ucars = userdata.cars
      let carindb = ucars.filter((c) => c.ID == id)
      if(carindb.length == 0){
        return interaction.reply("Thats not an ID!")
      }

      console.log(carindb)
      let ogcar = cars.Cars[carindb[0].Name.toLowerCase()].Image
      let weight = carindb[0].WeightStat
      if (!weight) {
        weight = cars.Cars[carindb[0].Name.toLowerCase()].Weight;
      }
      
      let exhaust = carindb[0].Exhaust
      let intake = carindb[0].Intake
      let tires = carindb[0].Tires
      let turbo = carindb[0].Turbo
      let suspension = carindb[0].Suspension
      let engine = carindb[0].Engine
      let gearbox = carindb[0].Gearbox
      let clutch = carindb[0].Clutch
      let ecu = carindb[0].ECU
      let brakes = carindb[0].Brakes
      let spoiler = carindb[0].Spoiler
      let intercooler = carindb[0].Intercooler
      

     
      

      // let suspensionimg = await loadImage(partdb.Parts[suspension.toLowerCase()].Image)
      // let engineimg = await loadImage(partdb.Parts[engine.toLowerCase()].Image)
      // let gearboximg = await loadImage(partdb.Parts[gearbox.toLowerCase()].Image)
      // let intercoolerimg = await loadImage(partdb.Parts[intercooler.toLowerCase()].Image)

      let carbg = await loadImage("https://i.ibb.co/MN2rTZ7/newcardblue-1.png"); 
      let carimg = await loadImage(ogcar)
      let brand = brandsarr.filter((br) => br.emote == carindb[0].Emote)
      let brimg = await loadImage(brand[0].image)
      let flag = await loadImage(brand[0].country)
      ctx.drawImage(carimg, 0, 0, canvas.width, canvas.height);
      console.log("car done")
      ctx.drawImage(carbg, 0, 0, canvas.width, canvas.height);
      console.log("bg done")
      ctx.drawImage(brimg, 15, 620, 100, 100);
      console.log("br done")
      ctx.drawImage(flag, 1120, 620, 180, 100);
      console.log("flag done")



      ctx.font = "bold 54px sans-serif";
      ctx.fillStyle = "#ffffff";
      
  
      ctx.fillText(carindb[0].Name, 125, 690);
      console.log("name done")

      ctx.font = "bold 45px sans-serif";

      ctx.fillText(carindb[0].Speed, 15, 105);
      console.log("speed done")
      ctx.fillText(`${carindb[0].Acceleration.toFixed(1)}`, 170, 105);
      console.log("acc done")
      ctx.fillText(carindb[0].Handling, 300, 105);
      console.log("hand done")
      
      ctx.font = "bold 35px sans-serif";
      console.log("done")
      ctx.fillText(weight, 435, 105);
      
      ctx.font = "bold 20px sans-serif";
      
      if(exhaust){
        let exhaustimg = await loadImage(partdb.Parts[exhaust.toLowerCase()].Image)
        ctx.drawImage(exhaustimg, 595, 10, 75, 75)
        ctx.fillText(exhaust, 585, 105);
      }
      
      if(intake){
        let intakeimg = await loadImage(partdb.Parts[intake.toLowerCase()].Image)
        ctx.drawImage(intakeimg, 710, 10, 75, 75)
        ctx.fillText(intake, 700, 105);
      }

      if(tires){
        let tiresimg = await loadImage(partdb.Parts[tires.toLowerCase()].Image)
        ctx.drawImage(tiresimg, 815, 10, 75, 75)
        ctx.fillText(tires, 815, 105);
      }

      if(turbo){
        let turboimg = await loadImage(partdb.Parts[turbo.toLowerCase()].Image)
        ctx.drawImage(turboimg, 930, 10, 75, 75)
        ctx.fillText(turbo, 930, 105);
      }

      if(clutch){
        let clutchimg = await loadImage(partdb.Parts[clutch.toLowerCase()].Image)
        ctx.drawImage(clutchimg, 1045, 10, 75, 75)
        ctx.fillText(clutch, 1045, 105);
      }

      if(ecu){
        let ecuimg = await loadImage(partdb.Parts[ecu.toLowerCase()].Image)
        ctx.drawImage(ecuimg, 1160, 10, 75, 75)
        ctx.fillText(ecu, 1160, 105);
      }

      if(brakes){
        let brakesimg = await loadImage(partdb.Parts[brakes.toLowerCase()].Image)
        ctx.drawImage(brakesimg, 1160, 115, 75, 75)
        ctx.fillText(brakes, 1160, 215);
      }

      if(spoiler){
        let spoilerimg = await loadImage(partdb.Parts[spoiler.toLowerCase()].Image)
        ctx.drawImage(spoilerimg, 1160, 215, 75, 75)
        ctx.fillText(spoiler, 1160, 315);
      }
      if(intercooler){
        let intercoolerimg = await loadImage(partdb.Parts[intercooler.toLowerCase()].Image)
        ctx.drawImage(intercoolerimg, 1160, 315, 75, 75)
        ctx.fillText(intercooler, 1140, 415);
      }

      if(suspension){
        let suspensionimg = await loadImage(partdb.Parts[suspension.toLowerCase()].Image)
        ctx.drawImage(suspensionimg, 1160, 415, 75, 75)
        ctx.fillText(suspension, 1140, 515);
      }

      if(engine){
        let engineimg = await loadImage(partdb.Parts[engine.toLowerCase()].Image)
        ctx.drawImage(engineimg, 790, 640, 75, 75)
        ctx.fillText("Engine", 800, 650);
      }

      if(gearbox){
        let gearboximg = await loadImage(partdb.Parts[gearbox.toLowerCase()].Image)
        ctx.drawImage(gearboximg, 890, 640, 75, 75)
        ctx.fillText(gearbox, 900, 650);
      }
   
   
      console.log("done")
      let attachment = new Discord.AttachmentBuilder(await canvas.toBuffer(), {
        name: "car-image.png",
      });




     await interaction.channel.send({
        files: [attachment],
        fetchReply: true,
      });
      }
     else if (
      subcommandfetch == "car_part" &&
      partdb.Parts[item.toLowerCase()]
    ) {
      let part = interaction.options.getString("item");
      part = part.toLowerCase();
      let partindb = partdb.Parts[part];

      if (!partindb) return await interaction.reply(`Thats not a part!`);
      let stats = [];

      if (partindb.AddedSpeed > 0) {
        stats.push(`${emotes.speed} Speed: +${partindb.AddedSpeed}`);
      }
      if (partindb.DecreaseWeight > 0) {
        stats.push(`${emotes.weight} Weight: -${partindb.DecreaseWeight}`);
      }

      if (partindb.AddWeight > 0) {
        stats.push(`${emotes.weight} Weight: +${partindb.AddWeight}`);
      }

      if (partindb.DecreaseHandling > 0) {
        stats.push(
          `<:handling:983963211403505724> Handling: -${partindb.DecreaseHandling}`
        );
      }

      if (partindb.AddedHandling > 0) {
        stats.push(
          `<:handling:983963211403505724> Handling: +${partindb.AddedHandling}`
        );
      }

      if (partindb.AddedSixty > 0) {
        stats.push(
          `${emotes.zero2sixty} Acceleration: -${partindb.AddedSixty}`
        );
      }
      if (partindb.DecreasedSixty > 0) {
        stats.push(
          `${emotes.zero2sixty} Acceleration: +${partindb.DecreasedSixty}`
        );
      }

      let embed = new Discord.EmbedBuilder()
        .setTitle(`Stats for ${partindb.Emote} ${partindb.Name}`)
        .setDescription(`${stats.join("\n")}`)
        .setColor(colors.blue);

      await interaction.reply({ embeds: [embed] });
    } else if (
      subcommandfetch == "car_part" &&
      itemdb.Other[item.toLowerCase()]
    ) {
      let itemindb = itemdb.Other[item.toLowerCase()];
      let embed = new Discord.EmbedBuilder()
        .setTitle(`Information for ${itemindb.Emote} ${itemindb.Name}`)
        .setDescription(itemindb.Action)
        .addFields({
          name: "Type",
          value: `${itemindb.Type}`,
        })
        .setColor(colors.blue);

      interaction.reply({ embeds: [embed] });
    }
  },
};