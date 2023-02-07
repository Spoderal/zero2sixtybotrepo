const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  ButtonBuilder,
  AttachmentBuilder,
} = require("discord.js");
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
const StackBlur = require("stackblur-canvas");

const { createCanvas, loadImage } = require("canvas");
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
    let userdata = await User.findOne({ id: interaction.user.id });
    let settings = userdata.settings;
    let weightemote = emotes.weight;

    if (subcommandfetch == "car_part" && item && list[item.toLowerCase()]) {
      let initialmsg = await interaction.reply({
        content: "Please wait...",
        fetchReply: true,
      });
      let handlingemote = emotes.handling;
      let speedemote = emotes.speed;
      let accelerationemote = emotes.zero2sixty;
      let car = item.toLowerCase();
      let carindb = list[car];

      let speed = `${carindb.Speed}`;
      let acceleration = carindb["0-60"];
      let handling = `${carindb.Handling}`;
      let weight = `${carindb.Weight}`;

      if (!carindb) return await interaction.reply(`Thats not a car!`);

      let trims = carindb.Trims || ["❌ No Trims"];
      let sellprice = carindb.Price * 0.65;

      const canvas = createCanvas(1280, 720);
      const ctx = canvas.getContext("2d");
      const bg = await loadImage(carindb.Image);
      let rounded = Math.round(acceleration * 10) / 10;

      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      ctx.font = "bold 48px Ariel";
      ctx.fillStyle = "white";

      ctx.fillText(`${speed}`, 15, 110);
      ctx.fillText(`${rounded}`, 165, 110);
      ctx.fillText(`${handling}`, 300, 110);

      ctx.font = "bold 38px Ariel";
      ctx.fillText(`${weight}`, 435, 110);
      ctx.font = "bold 50px Ariel";

      ctx.fillText(`${toCurrency(carindb.Price)}`, 570, 80);

      let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
        name: "profile-image.png",
      });

      await interaction.editReply({
        content: "",
        files: [attachment],
        fetchReply: true,
      });
    } else if (subcommandfetch == "id") {
      let idtoselect = interaction.options.getString("id");

      if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

      let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
      let selected = filteredcar[0] || "No ID";

      if (selected == "No ID") {
        let errembed = new Discord.EmbedBuilder()
          .setTitle("Error!")
          .setColor(colors.discordTheme.red).setDescription(`
            That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n
            **Example: /ids Select 1 1995 mazda miata**
          `);

        return await interaction.reply({ embeds: [errembed] });
      }

      let initialmsg = await interaction.reply("Please wait...");

      let handlingemote = emotes.handling;
      let speedemote = emotes.speed;
      let accelerationemote = emotes.zero2sixty;
      let carindb = selected;
      let sellprice = selected.Resale || 0;
      let cardrift = selected.Drift || 0;
      let carweight =
        selected.WeightStat || list[selected.Name.toLowerCase()].Weight;

      if (!selected.WeightStat || selected.WeightStat == null) {
        selected.WeightStat = list[selected.Name.toLowerCase()].Weight;
        userdata.markModified();
        userdata.save();
      }
      carweight =
        selected.WeightStat || list[selected.Name.toLowerCase()].Weight || 0;
      let carimage = carindb.Livery || list[selected.Name.toLowerCase()].Image;
      let speed = `${carindb.Speed}`;
      let acceleration = carindb.Acceleration;
      let handling = `${carindb.Handling}`;
      let weight = carindb.Weight || list[selected.Name.toLowerCase()].Weight;

      speed = Math.round(speed);

      const canvas = createCanvas(1280, 720);
      const ctx = canvas.getContext("2d");
      const bg = await loadImage(cars.Cars[carindb.Name.toLowerCase()].Image);
      let rounded = Math.round(acceleration * 10) / 10;

      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      ctx.font = "bold 48px Ariel";
      ctx.fillStyle = "white";

      ctx.fillText(`${speed}`, 15, 110);
      ctx.fillText(`${rounded}`, 165, 110);
      ctx.fillText(`${handling}`, 300, 110);

      ctx.font = "bold 38px Ariel";
      ctx.fillText(`${weight}`, 435, 110);
      ctx.font = "bold 50px Ariel";

      let exhaust = selected.Exhaust || "Stock";
      let intake = selected.Intake || "Stock";
      let suspension = selected.Suspension || "Stock";
      let tires = selected.Tires || "Stock";
      let engine = selected.Engine || "Stock";
      let clutch = selected.Clutch || "Stock";
      let ecu = selected.ECU || "Stock";
      let turbo = selected.Turbo || "Stock";
      let nitro = selected.Nitro || "Stock";
      let intercooler = selected.Intercooler || "Stock";
      let gearbox = selected.Gearbox || "Stock";
      let brakes = selected.Brakes || "Stock";

      let partindb = partdb.Parts;

      let exhaustemote = partindb[exhaust.toLowerCase()].Image || undefined;
      let intakeemote = partindb[intake.toLowerCase()].Image || undefined;
      let suspensionemote =
        partindb[suspension.toLowerCase()].Image || undefined;
      let tiresemote = partindb[tires.toLowerCase()].Image || undefined;
      let clutchemote = partindb[clutch.toLowerCase()].Image || undefined;
      let ecuemote = partindb[ecu.toLowerCase()].Image || undefined;
      let engineemote = partindb[engine.toLowerCase()].Image || undefined;
      let turboemote = partindb[turbo.toLowerCase()].Image || undefined;
      let intercooleremote =
        partindb[intercooler.toLowerCase()].Image || undefined;
      let gearboxemote = partindb[gearbox.toLowerCase()].Image || undefined;
      let brakesemote = partindb[brakes.toLowerCase()].Image || undefined;

      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      ctx.font = "bold 48px Ariel";
      ctx.fillStyle = "white";

      ctx.fillText(`${speed}`, 15, 110);
      ctx.fillText(`${rounded}`, 165, 110);
      ctx.fillText(`${handling}`, 300, 110);

      ctx.font = "bold 38px Ariel";
      ctx.fillText(`${weight}`, 435, 110);
      ctx.font = "bold 50px Ariel";

      if (exhaustemote !== undefined) {
        let exhaustimg = await loadImage(exhaustemote);
        ctx.drawImage(exhaustimg, 1150, 180, 75, 75);
        ctx.font = "bold 20px Ariel";
        ctx.fillText(`${exhaust}`, 1132, 180);
      }
      if (tiresemote !== undefined) {
        let tiresimg = await loadImage(tiresemote);
        ctx.drawImage(tiresimg, 1150, 290, 75, 75);
        ctx.font = "bold 20px Ariel";
        ctx.fillText(`${tires}`, 1132, 280);
      }
      if (suspensionemote !== undefined) {
        let suspensionimg = await loadImage(suspensionemote);
        ctx.drawImage(suspensionimg, 1150, 390, 75, 75);
        ctx.font = "bold 18px Ariel";
        ctx.fillText(`${suspension}`, 1132, 390);
      }
      if (gearboxemote !== undefined) {
        let gearboximg = await loadImage(gearboxemote);
        ctx.drawImage(gearboximg, 1150, 480, 75, 75);
        ctx.font = "bold 20px Ariel";
        ctx.fillText(`${gearbox}`, 1132, 480);
      }
      if (engineemote !== undefined) {
        ctx.fillText(`Engine`, 1150, 580);
        ctx.font = "bold 18px Ariel";
        ctx.fillText(`${engine}`, 1165, 600);
      }

      if (brakesemote !== undefined) {
        let brakesimg = await loadImage(brakesemote);
        ctx.drawImage(brakesimg, 560, 20, 75, 75);
        ctx.font = "bold 15px Ariel";
        ctx.fillText(`${brakes}`, 565, 30);
      }

      if (clutchemote !== undefined) {
        let clutchimg = await loadImage(clutchemote);
        ctx.drawImage(clutchimg, 650, 35, 50, 50);
        ctx.font = "bold 15px Ariel";
        ctx.fillText(`${clutch}`, 645, 30);
      }
      if (intakeemote !== undefined) {
        let intakeimg = await loadImage(intakeemote);
        ctx.drawImage(intakeimg, 720, 35, 75, 75);
        ctx.font = "bold 15px Ariel";
        ctx.fillText(`${intake}`, 725, 30);
      }
      if (turboemote !== undefined) {
        let turboimg = await loadImage(turboemote);
        ctx.drawImage(turboimg, 800, 35, 75, 75);
        ctx.font = "bold 15px Ariel";
        ctx.fillText(`${turbo}`, 805, 30);
      }
      if (ecuemote !== undefined) {
        let ecuimg = await loadImage(ecuemote);
        ctx.drawImage(ecuimg, 875, 35, 75, 75);
        ctx.font = "bold 15px Ariel";
        ctx.fillText(`${ecu}`, 875, 30);
      }
      if (intercooleremote !== undefined) {
        let intercoolerimg = await loadImage(intercooleremote);
        ctx.drawImage(intercoolerimg, 980, 35, 75, 75);
        ctx.font = "bold 15px Ariel";
        ctx.fillText(`${intercooler}`, 975, 30);
      }

      let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
        name: "profile-image.png",
      });

      await interaction.editReply({
        content: "",
        files: [attachment],
        fetchReply: true,
      });
    } else if (
      subcommandfetch == "car_part" &&
      partdb.Parts[item.toLowerCase()]
    ) {
      let part = interaction.options.getString("item");
      part = part.toLowerCase();
      let partindb = partdb.Parts[part];

      if (!partindb) return await interaction.reply(`Thats not a part!`);
      let stats = [];

      if (partindb.AddedSpeed) {
        stats.push(`Speed: +${partindb.AddedSpeed}`);
      }
      if (partindb.AddedDrift) {
        stats.push(`Drift: +${partindb.AddedDrift}`);
      }
      if (partindb.DecreasedDrift) {
        stats.push(`Drift: -${partindb.DecreasedDrift}`);
      }
      if (partindb.AddHandling) {
        stats.push(
          `<:handling:983963211403505724> Handling: +${partindb.AddHandling}`
        );
      }
      if (partindb.DecreaseHandling) {
        stats.push(
          `<:handling:983963211403505724> Handling: -${partindb.DecreaseHandling}`
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
