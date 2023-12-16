const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const {
  toCurrency
} = require("../common/utils");
const itemdb = require("../data/items.json");
const { createCanvas, loadImage } = require("canvas");
const brands = require("../data/brands.json");
const lodash = require("lodash");

const { ImgurClient } = require("imgur");

let currencies = require("../data/currencydb.json");
const houses = require("../data/houses.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View the default stats of a car or part")
    .addStringOption((option) =>
      option
        .setName("item")
        .setRequired(true)
        .setDescription("The item to see the stats for")
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setRequired(false)
        .setDescription("See the stats of a users car")
    ),

  async execute(interaction) {
    var list = cars.Cars;
    var list2 = houses;
    var item = interaction.options.getString("item");
    let user = interaction.options.getUser("user") || interaction.user;
    let userdata = (await User.findOne({ id: user.id })) || [];
    let global = await Global.findOne({});
    let brandsarr = [];
    let housesarr = [];
    for (let b in brands) {
      brandsarr.push(brands[b]);
    }
    for (let h in list2) {
      housesarr.push(list2[h]);
    }
    let ucars = userdata.cars || [];
    let carindb = ucars.filter((c) => c.ID == item);
    let houseindb = housesarr.filter((h) => h.id == item);
    if (
      !list[item.toLowerCase()] &&
      !carindb[0] &&
      !houseindb[0] &&
      !itemdb[item.toLowerCase()] &&
      !partdb.Parts[item.toLowerCase()]
    )
      return interaction.reply(
        `I couldn't find that car! If you're checking default stats, put the full name, and if you want your stats, put the ID.`
      );
    let embedl = new Discord.EmbedBuilder()
      .setTitle(`${emotes.loading} Loading`)
      .setDescription("Fetching data, this wont take too long!")
      .setColor(colors.blue);
    await interaction.reply({ embeds: [embedl], fetchReply: true });
    if (list[item.toLowerCase()]) {
      let canvas = createCanvas(1280, 720);
      let ctx = canvas.getContext("2d");
      let carindb = list[item.toLowerCase()];
      let carbg = await loadImage(cars.Tiers[carindb.Class.toLowerCase()].Image);
      let carimg = await loadImage(carindb.Image);
      let brand = brandsarr.filter((br) => br.emote == carindb.Emote);
      console.log(brand);
      if (!brand[0]) {
        brand[0] = brands["no brand"];
      }
      console.log(brand);
      let brimg = await loadImage(brand[0].image);
      let flag = await loadImage(brand[0].country);
      let policeimg = await loadImage("https://i.ibb.co/cwr7WLB/police.png");
      ctx.drawImage(carimg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(carbg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(brimg, 250, 0, 60, 60);
      ctx.drawImage(flag, 1020, 565, 250, 150);
      if (carindb.Police) {
        ctx.drawImage(policeimg, 920, 600, 150, 150);
      }
     

      let spe = carindb.Speed;
      let acc = Math.floor(carindb["0-60"]);
      let weigh = Math.floor(carindb.Weight);
      let hand = Math.floor(carindb.Handling);
      let ovr = ((spe / acc) + ((hand / 10) - (weigh / 100))) / 4

      ovr = Math.round(ovr)

      ctx.font = "bold 30px sans-serif";
      ctx.fillStyle = "#ffffff";

      let nametxt = `${carindb.Name} (ID: ${carindb.alias})`
      ctx.fillText(nametxt, 320, 40);

      ctx.font = "bold 65px sans-serif";

      
      ctx.fillText(Math.round(carindb.Speed), 60, 150);
      ctx.fillText(carindb["0-60"], 60, 260);
      ctx.fillText(carindb.Handling, 60, 380);
      ctx.fillText(carindb.Weight, 60, 500);
      let ovrimg = await loadImage("https://i.ibb.co/TvHngT2/ovricon.png");
      ctx.drawImage(ovrimg, 1120, 20, 150, 150);

      ctx.fillText(ovr, 1130, 200);

      ctx.font = "regular 35px sans-serif";
      ctx.fillText("Horsepower", 30, 80);
      ctx.fillText("Acceleration", 30, 200);
      ctx.fillText("Handling", 50, 320);
      ctx.fillText("Weight", 60, 440);


      ctx.font = "bold 25px sans-serif";
      let price = `${toCurrency(carindb.Price)}`;

      if (carindb.Drivetrain) {
        let drivetrain = carindb.Drivetrain;
        ctx.fillText(drivetrain, 1150, 40);
      }

      if (carindb.Engine) {
        let engine = carindb.Engine;
        let engineimg = await loadImage("https://i.ibb.co/5LCbWbd/engineicon.png")
        ctx.drawImage(engineimg, 1000, 70, 40, 40);
        ctx.fillText(engine, 1220, 40);
      }

      ctx.font = "bold 30px sans-serif";
      if (carindb.Price <= 0) {
        let obtained = carindb.Obtained || "Not Obtainable";
        price = `${obtained}`;
      } else if (carindb.Squad) {
        price = `Squad Car`;
      }

      ctx.fillText(price, 30, 40);

      let attachment = new Discord.AttachmentBuilder(await canvas.toBuffer(), {
        name: "stats-image.png",
      });



      let msg = await interaction.editReply({
        embeds: [],
        files: [attachment],
      });


      
    } else if (carindb[0]) {
      let canvas = createCanvas(1280, 720);
      let ctx = canvas.getContext("2d");

      if (carindb.length == 0) {
        return interaction.editReply("Thats not an ID!");
      }

      console.log(carindb);
      let ogcar = cars.Cars[carindb[0].Name.toLowerCase()].Image;
      new ImgurClient({ accessToken: process.env.imgur });
      let carim = carindb[0].Image || ogcar;
      console.log(carim);
      let weight = carindb[0].WeightStat;
      if (!weight) {
        weight = cars.Cars[carindb[0].Name.toLowerCase()].Weight;
      }

      let exhaust = carindb[0].exhaust || 0;
      let intake = carindb[0].intake || 0;
      let tires = carindb[0].tires || 0;
      let turbo = carindb[0].turbo || 0;
      let suspension = carindb[0].suspension || 0;
      let engine = carindb[0].engine || 0;
      let gearbox = carindb[0].gearbox || 0;
      let clutch = carindb[0].clutch || 0;
      let ecu = carindb[0].ecu || 0;
      let intercooler = carindb[0].intercooler || 0;


      // let suspensionimg = await loadImage(partdb.Parts[suspension.toLowerCase()].Image)
      // let engineimg = await loadImage(partdb.Parts[engine.toLowerCase()].Image)
      // let gearboximg = await loadImage(partdb.Parts[gearbox.toLowerCase()].Image)
      // let intercoolerimg = await loadImage(partdb.Parts[intercooler.toLowerCase()].Image)
      let carbg = await loadImage("https://i.ibb.co/SNWzQ7X/statcard.png");
      let carimg = await loadImage(carim);
      console.log(carim);
      let brand =
        brandsarr.filter((br) => br.emote == carindb[0].Emote) || "no brand";
      if (brand.length == 0) {
        brand[0] = "no brand";
      }
      let brimg = await loadImage(brand[0].image);
      let flag = await loadImage(brand[0].country);
      ctx.drawImage(carimg, 0, 0, canvas.width, canvas.height);
      console.log("car done");
      ctx.drawImage(carbg, 0, 0, canvas.width, canvas.height);
      console.log("bg done");

      ctx.drawImage(brimg, 15, 600, 100, 100);
      ctx.drawImage(flag, 1050, 573, 250, 150);

      ctx.font = "bold 54px sans-serif";
      ctx.fillStyle = "#ffffff";

      ctx.fillText(carindb[0].Name, 125, 670);

      ctx.font = "bold 55px sans-serif";
      let acceleration = Math.round(carindb[0].Acceleration * 10) / 10;
      let speed = Math.round(carindb[0].Speed);
      let handling = Math.round(carindb[0].Handling);

      ctx.fillText(speed, 15, 120);
      ctx.fillText(acceleration, 215, 120);
      ctx.fillText(handling, 400, 120);

      ctx.font = "bold 35px sans-serif";
      ctx.fillText(carindb[0].WeightStat, 595, 120);

      ctx.font = "bold 20px sans-serif";

      if (exhaust) {
        let exhaustimg = await loadImage(
          partdb.Parts[`${exhaust}`].Image
        );
        ctx.drawImage(exhaustimg, 815, 30, 50, 50);
        ctx.fillText(exhaust, 810, 29);
      }

      if (intake) {
        let intakeimg = await loadImage(partdb.Parts[`${intake}`].Image);
        ctx.drawImage(intakeimg, 875, 30, 50, 50);
        ctx.fillText(intake, 870, 29);
      }

      if (tires) {
        let tiresimg = await loadImage(partdb.Parts[`${tires}`].Image);
        ctx.drawImage(tiresimg, 935, 30, 50, 50);
        ctx.fillText(tires, 930, 29);
      }

      if (turbo) {
        let turboimg = await loadImage(partdb.Parts[`${turbo}`].Image);
        ctx.drawImage(turboimg, 995, 30, 50, 50);
        ctx.fillText(turbo, 990, 29);
      }

      if (clutch) {
        let clutchimg = await loadImage(partdb.Parts[`${clutch}`].Image);
        ctx.drawImage(clutchimg, 1045, 30, 50, 50);
        ctx.fillText(clutch, 1045, 29);
      }

      if (ecu) {
        let ecuimg = await loadImage(partdb.Parts[`${ecu}`].Image);
        ctx.drawImage(ecuimg, 1105, 30, 50, 50);
        ctx.fillText(ecu, 1100, 29);
      }

      if (intercooler) {
        let intercoolerimg = await loadImage(
          partdb.Parts[`${intercooler}`].Image
        );
        ctx.drawImage(intercoolerimg, 1165, 30, 50, 50);
        ctx.fillText(intercooler, 1160, 29);
      }

      if (suspension) {
        let suspensionimg = await loadImage(
          partdb.Parts[`${suspension}`].Image
        );
        ctx.drawImage(suspensionimg, 1225, 30, 50, 50);
        ctx.fillText(suspension, 1220, 29);
      }

      if (engine) {
        let engineimg = await loadImage(partdb.Parts[`no engine`].Image);
        ctx.drawImage(engineimg, 815, 100, 50, 50);
        ctx.fillText(engine, 810, 99);
      }

      if (gearbox) {
        let gearboximg = await loadImage(
          partdb.Parts[`${gearbox}`].Image
        );
        ctx.drawImage(gearboximg, 875, 100, 50, 50);
        ctx.fillText(gearbox, 870, 99);
      }

      console.log("done");
      let attachment = new Discord.AttachmentBuilder(await canvas.toBuffer(), {
        name: "car-image.png",
      });

      let row = new ActionRowBuilder()
      .setComponents(
        new ButtonBuilder()
        .setCustomId("parts")
        .setLabel("Parts")
        .setEmoji("⚙️")
        .setStyle("Secondary")
      )

      let msg = await interaction.editReply({
        embeds: [],
        files: [attachment],
        components:[row],
        fetchReply: true,
      });

      let filter = (btnInt) => {
        return interaction.user.id == btnInt.user.id;
      };
      const collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 15000,
      });
      
      collector.on('collect', async (i) => {
        if(i.customId == "parts"){
          let partsarr = []

          if(exhaust){
            partsarr.push(`Exhaust: ${partdb.Parts[exhaust].Emote} ${partdb.Parts[exhaust].Name}`)
          }
          if(turbo){
            partsarr.push(`Turbo: ${partdb.Parts[turbo].Emote} ${partdb.Parts[turbo].Name}`)
          }
          if(intake){
            partsarr.push(`Intake: ${partdb.Parts[intake].Emote} ${partdb.Parts[intake].Name}`)
          }
          if(engine){
            partsarr.push(`Engine: ${partdb.Parts[engine].Emote} ${partdb.Parts[engine].Name}`)
          }
          if(tires){
            partsarr.push(`Tires: ${partdb.Parts[tires].Emote} ${partdb.Parts[tires].Name}`)
          }
          if(suspension){
            partsarr.push(`Suspension: ${partdb.Parts[suspension].Emote} ${partdb.Parts[suspension].Name}`)
          }
          if(gearbox){
            partsarr.push(`Gearbox: ${partdb.Parts[gearbox].Emote} ${partdb.Parts[gearbox].Name}`)
          }
          if(clutch){
            partsarr.push(`Clutch: ${partdb.Parts[clutch].Emote} ${partdb.Parts[clutch].Name}`)
          }
          if(intercooler){
            partsarr.push(`Intercooler: ${partdb.Parts[intercooler].Emote} ${partdb.Parts[intercooler].Name}`)
          }
          if(ecu){
            partsarr.push(`ECU: ${partdb.Parts[ecu].Emote} ${partdb.Parts[ecu].Name}`)
          }

          let embed = new Discord.EmbedBuilder()
          .setTitle(`Your ${carindb[0].Emote} ${carindb[0].Name}'s parts`)
          .setDescription(`${partsarr.join('\n')}`)
          .setColor(colors.blue)

          await interaction.editReply({embeds: [embed]})

        }
      })

    } else if (partdb.Parts[item.toLowerCase()]) {
      let part = interaction.options.getString("item");
      part = part.toLowerCase();
      let partindb = partdb.Parts[part];

      if (!partindb) return await interaction.editReply(`Thats not a part!`);
      let stats = [];

      if (partindb.Power > 0) {
        stats.push(`${emotes.speed} Power: +${partindb.Power}`);
      }

      if (partindb.Weight > 0) {
        stats.push(`${emotes.weight} Weight: +${partindb.Weight}`);
      }
      if (partindb.RemoveWeight > 0) {
        stats.push(`${emotes.weight} Weight: -${partindb.RemoveWeight}`);
      }

      if (partindb.Handling > 0) {
        stats.push(
          `<:handling:983963211403505724> Handling: +${partindb.Handling}`
        );
      }

      if (partindb.Acceleration > 0) {
        stats.push(
          `${emotes.acceleration} Acceleration: -${partindb.Acceleration}`
        );
      }
      if (partindb.RemoveAcceleration > 0) {
        stats.push(
          `${emotes.acceleration} Acceleration: +${partindb.RemoveAcceleration}`
        );
      }
      if (partindb.RemovePower > 0) {
        stats.push(
          `${emotes.speed} Power: -${partindb.RemovePower}`
        );
      }
      if (partindb.RemoveHandling > 0) {
        stats.push(
          `<:handling:983963211403505724> Handling: -${partindb.RemoveHandling}`
        );
      }
      if (partindb.Stars > 0) {
        stats.push(`⭐ Rating: +${partindb.Stars}`);
      }
      
     
      let embed = new Discord.EmbedBuilder()
        .setTitle(`Stats for ${partindb.Emote} ${partindb.Name}`)
        .setDescription(`${emotes.cash} Store Price: ${toCurrency(partindb.Price)}\n${stats.join('\n')}`)
        .setColor(colors.blue);

      if (partindb.Image) {
        embed.setThumbnail(`${partindb.Image}`);
      }

 await interaction.editReply({
        embeds: [embed],
      });



    } else if (itemdb[item.toLowerCase()]) {
      let itemindb = itemdb[item.toLowerCase()];
      let price = itemindb.Price;

      if (price == 0 && itemindb.Findable == true) {
        price = `Findable only`;
      } else {
        price = toCurrency(itemindb.Price);
      }
      let tier = itemindb.Tier || 0;
      let embed = new Discord.EmbedBuilder()
        .setAuthor({
          name: `Information for ${itemindb.Name}`,
          iconURL: itemindb.Image,
        })
        .setDescription(`${itemindb.Action}\n${price}`)
        .addFields(
          {
            name: "Type",
            value: `${itemindb.Type}`,
          },
          { name: "Item Tier", value: `${tier}` }
        )
        .setColor(colors.blue);

      if(itemindb.Skins){
        let skinarr = []
        let skins = itemindb.Skins
        for(let skin in skins){
          console.log(skins)
          skinarr.push(`${skins[skin].Emote} ${skins[skin].Name} **${skins[skin].Action}**`)
        }
        embed.addFields(
          {
            name: "Skins",
            value: `${skinarr.join('\n')}`
          }
        )
      }

      if (itemindb.Image) {
        embed.setThumbnail(`${itemindb.Image}`);
      }

      

      let msg = await interaction.editReply({
        embeds: [embed],
      });


    } else if (houseindb[0]) {
      let house = houseindb[0];

      let embed1 = new Discord.EmbedBuilder()
        .setTitle(`Stats for ${house.Name}`)
        .setImage(house.Image)
        .setDescription(
          `Price: ${toCurrency(house.Price)}\n\nPerk: ${
            house.Perk
          }\n\nGarage Space: ${house.Space}\n\nUnlocks at prestige: ${
            house.Prestige
          }`
        )
        .setColor(colors.blue);

      await interaction.editReply({ embeds: [embed1] });
    }
  },
};
