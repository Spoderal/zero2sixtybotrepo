const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const {
  toCurrency
} = require("../common/utils");
const itemdb = require("../data/items.json");
const { createCanvas, loadImage } = require("canvas");
const brands = require("../data/brands.json");


const { ImgurClient } = require("imgur");

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
    let carlist = []
    for(let car in list){
      carlist.push(list[car])
    }
    var list2 = houses;
    var item = interaction.options.getString("item");
    let user = interaction.options.getUser("user") || interaction.user;
    let userdata = (await User.findOne({ id: user.id })) || [];
    let brandsarr = [];
    let housesarr = [];
    for (let b in brands) {
      brandsarr.push(brands[b]);
    }
    for (let h in list2) {
      housesarr.push(list2[h]);
    }
    let ucars = userdata.cars || [];
    let carindb = ucars.filter((c) => c.ID.toLowerCase() == item.toLowerCase() || c.Name.toLowerCase() == item.toLowerCase());
    let defaultcar = carlist.filter((c) => c.Name.toLowerCase() == item.toLowerCase() || c.alias.toLowerCase() == item.toLowerCase())
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
      if(defaultcar[0]){
        let canvas = createCanvas(1280, 720);
        let ctx = canvas.getContext("2d");
        let carindb = defaultcar[0]
        let carbg = await loadImage(cars.Tiers[carindb.Class.toLowerCase()].Image);
        let carimg = await loadImage(carindb.Image);
        let brand = brandsarr.filter((br) => br.emote == carindb.Emote);
        if (!brand[0]) {
          brand[0] = brands["no brand"];
        }
        let brimg = await loadImage(brand[0].image);
        let flag = await loadImage(brand[0].country);
        let policeimg = await loadImage("https://i.ibb.co/cwr7WLB/police.png");
        ctx.drawImage(carimg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(carbg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(brimg, 350, 0, 60, 60);
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
        ctx.fillText(nametxt, 420, 40);
        
        let ovrimg = await loadImage("https://i.ibb.co/TvHngT2/ovricon.png");
        ctx.drawImage(ovrimg, 1180, 130, 100, 100);
  
        ctx.fillText(ovr, 1130, 200);
        ctx.font = "bold 65px sans-serif";
  
        
        ctx.fillText(Math.round(carindb.Speed), 60, 150);
        ctx.fillText(carindb["0-60"], 60, 260);
        ctx.fillText(carindb.Handling, 60, 380);
        ctx.fillText(carindb.Weight, 60, 500);
  
        ctx.font = "regular 35px sans-serif";
        ctx.fillText("Horsepower", 30, 80);
        ctx.fillText("Acceleration", 30, 200);
        ctx.fillText("Handling", 50, 320);
        ctx.fillText("Weight", 60, 440);
  
  
        ctx.font = "bold 25px sans-serif";
        let price = `${toCurrency(carindb.Price)}`;
  
        if (carindb.Drivetrain) {
          let drivetrain = carindb.Drivetrain;
          ctx.fillText(drivetrain, 1150, 150);
        }
  
        if (carindb.Engine) {
          let engine = carindb.Engine;
  
          ctx.fillText(engine, 1220, 150);
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

        let sellprice = Math.floor(carindb.Price * 0.75)

        if(sellprice === 0){
          sellprice = carindb.sellprice * 0.35 
        }
  
        console.log(sellprice)
         await interaction.editReply({
          embeds: [],
          content: `Sells for ${toCurrency(sellprice)}`,
          files: [attachment],
        });

      }

    }

    else if (partdb.Parts[item.toLowerCase()]) {
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
      if (partindb.Gas > 0) {
        stats.push(`⛽ Max Gas: ${partindb.Gas}`);
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
      let sellprice = Math.floor(partindb.Price * 0.35)
      let price = partindb.Price

      if(price == 0 && partindb.Obtained){
        price = partindb.Obtained
      }
      else{
        price = `${emotes.cash} Store Price: ${toCurrency(price)}`
      }
     
      let embed = new Discord.EmbedBuilder()
        .setTitle(`Stats for ${partindb.Emote} ${partindb.Name}`)
        .setDescription(`${price}\nSell for: ${toCurrency(sellprice)}\n${stats.join('\n')}`)
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
      let sellprice = Math.floor(price * 0.35)
      if (price == 0 && itemindb.Findable == true) {
        price = `Findable only`;
        sellprice = ""
      } else {
        price = toCurrency(itemindb.Price);
        sellprice = toCurrency(sellprice)
      }
      
      let tier = itemindb.Tier || 0;
      let embed = new Discord.EmbedBuilder()
        .setAuthor({
          name: `Information for ${itemindb.Name}`,
          iconURL: itemindb.Image,
        })
        .setDescription(`${itemindb.Action}\n${price}\nSell for: ${sellprice}`)
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

      

      await interaction.editReply({
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
          }\n\nGarage Space: ${house.Space}`
        )
        .setColor(colors.blue);

      await interaction.editReply({ embeds: [embed1] });
    }
     else if (carindb[0]) {
      let canvas = createCanvas(1280, 720);
      let ctx = canvas.getContext("2d");

      if (carindb.length == 0) {
        return interaction.editReply("Thats not an ID!");
      }

      let ogcar = cars.Cars[carindb[0].Name.toLowerCase()].Image;
      new ImgurClient({ accessToken: process.env.imgur });
      let carim = carindb[0].Image || ogcar;
      let weight = carindb[0].WeightStat;
      if (!weight) {
        weight = cars.Cars[carindb[0].Name.toLowerCase()].Weight;
      }

      let exhaust = carindb[0].exhaust || "stock exhaust"
      let intake = carindb[0].intake || "stock intake"
      let tires = carindb[0].tires || "stock tires"
      let turbo = carindb[0].turbo || "no turbo"
      let suspension = carindb[0].suspension || "stock suspension"
      let engine = carindb[0].engine || cars.Cars[carindb[0].Name.toLowerCase()].Engine
      let gearbox = carindb[0].gearbox || "stock gearbox"
      let clutch = carindb[0].clutch || "stock clutch"
      let ecu = carindb[0].ecu || "stock ecu"
      let intercooler = carindb[0].intercooler || "no intercooler"
      let springs = carindb[0].springs || "stock springs"
      let spoiler = carindb[0].spoiler || "no spoiler"
      let weightreduction = carindb[0].weight || "no weight"
      let gastank = carindb[0].gastank || "stock gastank"

      let brakes = carindb[0].brakes || "stock brakes"
      let drivetrain = carindb[0].drivetrain || cars.Cars[carindb[0].Name.toLowerCase()].Drivetrain

      // let suspensionimg = await loadImage(partdb.Parts[suspension.toLowerCase()].Image)
      // let engineimg = await loadImage(partdb.Parts[engine.toLowerCase()].Image)
      // let gearboximg = await loadImage(partdb.Parts[gearbox.toLowerCase()].Image)
      // let intercoolerimg = await loadImage(partdb.Parts[intercooler.toLowerCase()].Image)
      let carbg = await loadImage("https://i.ibb.co/SNWzQ7X/statcard.png");
      let carimg = await loadImage(carim);
      let brand =
        brandsarr.filter((br) => br.emote == carindb[0].Emote) || "no brand";
      if (brand.length == 0) {
        brand[0] = "no brand";
      }
      let brimg = await loadImage(brand[0].image);
      let flag = await loadImage(brand[0].country);
      ctx.drawImage(carimg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(carbg, 0, 0, canvas.width, canvas.height);
  

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

      if (exhaust !== "stock exhaust") {
        let exhaustimg = await loadImage(
          partdb.Parts[`${exhaust}`].Image
        );
        ctx.drawImage(exhaustimg, 815, 30, 50, 50);
        ctx.fillText(exhaust, 810, 29);
      }

      if (intake !== "stock intake") {
        let intakeimg = await loadImage(partdb.Parts[`${intake}`].Image);
        ctx.drawImage(intakeimg, 875, 30, 50, 50);
        ctx.fillText(intake, 870, 29);
      }

      if (tires !== "stock tires") {
        let tiresimg = await loadImage(partdb.Parts[`${tires}`].Image);
        ctx.drawImage(tiresimg, 935, 30, 50, 50);
        ctx.fillText(tires, 930, 29);
      }

      if (turbo !== "no turbo") {
        let turboimg = await loadImage(partdb.Parts[`${turbo}`].Image);
        ctx.drawImage(turboimg, 995, 30, 50, 50);
        ctx.fillText(turbo, 990, 29);
      }

      if (clutch !== "stock clutch") {
        let clutchimg = await loadImage(partdb.Parts[`${clutch}`].Image);
        ctx.drawImage(clutchimg, 1045, 30, 50, 50);
        ctx.fillText(clutch, 1045, 29);
      }

      if (ecu !== "stock ecu") {
        let ecuimg = await loadImage(partdb.Parts[`${ecu}`].Image);
        ctx.drawImage(ecuimg, 1105, 30, 50, 50);
        ctx.fillText(ecu, 1100, 29);
      }

      if (intercooler !== "no intercooler") {
        let intercoolerimg = await loadImage(
          partdb.Parts[`${intercooler}`].Image
        );
        ctx.drawImage(intercoolerimg, 1165, 30, 50, 50);
        ctx.fillText(intercooler, 1160, 29);
      }

      if (suspension !== "stock suspension") {
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

      if (gearbox !== "stock gearbox") {
        let gearboximg = await loadImage(
          partdb.Parts[`${gearbox}`].Image
        );
        ctx.drawImage(gearboximg, 875, 100, 50, 50);
        ctx.fillText(gearbox, 870, 99);
      }

      let attachment = new Discord.AttachmentBuilder(await canvas.toBuffer(), {
        name: "car-image.png",
      });

      let sellprice = Math.floor(carindb[0].Resale)
      console.log(sellprice)
      if(!sellprice && cars.Cars[carindb[0].Name.toLowerCase()].Price > 0){
        sellprice = cars.Cars[carindb[0].Name.toLowerCase()].Price * 0.75
      }
      else if(cars.Cars[carindb[0].Name.toLowerCase()].Price  == 0) {
        sellprice = cars.Cars[carindb[0].Name.toLowerCase()].sellprice * 0.35
      }

      let row = new ActionRowBuilder()
      .setComponents(
        new ButtonBuilder()
        .setCustomId("parts")
        .setLabel("Parts")
        .setEmoji("⚙️")
        .setStyle("Secondary"),
        new ButtonBuilder()
        .setCustomId("remove")
        .setLabel("Set Stock")
        .setEmoji("❌")
        .setStyle("Secondary")
      )

      let msg = await interaction.editReply({
        embeds: [],
        content: `Sells for ${toCurrency(sellprice)}`,
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
     

          // if(exhaust){
          //   partsarr.push(`Exhaust: ${partdb.Parts[exhaust].Emote} ${partdb.Parts[exhaust].Name}`)
          // }
          // if(turbo){
          //   partsarr.push(`Turbo: ${partdb.Parts[turbo].Emote} ${partdb.Parts[turbo].Name}`)
          // }
          // if(intake){
          //   partsarr.push(`Intake: ${partdb.Parts[intake].Emote} ${partdb.Parts[intake].Name}`)
          // }
          // if(engine){
          //   partsarr.push(`Engine: ${partdb.Parts[engine].Emote} ${partdb.Parts[engine].Name}`)
          // }
          // if(tires){
          //   partsarr.push(`Tires: ${partdb.Parts[tires].Emote} ${partdb.Parts[tires].Name}`)
          // }
          // if(suspension){
          //   partsarr.push(`Suspension: ${partdb.Parts[suspension].Emote} ${partdb.Parts[suspension].Name}`)
          // }
          // if(gearbox){
          //   partsarr.push(`Gearbox: ${partdb.Parts[gearbox].Emote} ${partdb.Parts[gearbox].Name}`)
          // }
          // if(clutch){
          //   partsarr.push(`Clutch: ${partdb.Parts[clutch].Emote} ${partdb.Parts[clutch].Name}`)
          // }
          // if(intercooler){
          //   partsarr.push(`Intercooler: ${partdb.Parts[intercooler].Emote} ${partdb.Parts[intercooler].Name}`)
          // }
          // if(ecu){
          //   partsarr.push(`ECU: ${partdb.Parts[ecu].Emote} ${partdb.Parts[ecu].Name}`)
          // }

          let embed = new Discord.EmbedBuilder()
          .setTitle(`Your ${carindb[0].Emote} ${carindb[0].Name}'s parts`)
          .addFields(
            {name: `Exhaust`, value: `${partdb.Parts[exhaust.toLowerCase()].Emote} ${partdb.Parts[exhaust.toLowerCase()].Name}`, inline: true},
            {name: `Turbo`, value: `${partdb.Parts[turbo.toLowerCase()].Emote} ${partdb.Parts[turbo.toLowerCase()].Name}`, inline: true},
            {name: `Intake`, value: `${partdb.Parts[intake.toLowerCase()].Emote} ${partdb.Parts[intake.toLowerCase()].Name}`, inline: true},
            {name: `Engine`, value: `${partdb.Parts[engine.toLowerCase()].Emote} ${partdb.Parts[engine.toLowerCase()].Name}`, inline: true},
            {name: `Tires`, value: `${partdb.Parts[tires.toLowerCase()].Emote} ${partdb.Parts[tires.toLowerCase()].Name}`, inline: true},
            {name: `Suspension`, value: `${partdb.Parts[suspension.toLowerCase()].Emote} ${partdb.Parts[suspension.toLowerCase()].Name}`, inline: true},
            {name: `Gearbox`, value: `${partdb.Parts[gearbox.toLowerCase()].Emote} ${partdb.Parts[gearbox.toLowerCase()].Name}`, inline: true},
            {name: `Clutch`, value: `${partdb.Parts[clutch.toLowerCase()].Emote} ${partdb.Parts[clutch.toLowerCase()].Name}`, inline: true},
            {name: `Intercooler`, value: `${partdb.Parts[intercooler.toLowerCase()].Emote} ${partdb.Parts[intercooler.toLowerCase()].Name}`, inline: true},
            {name: `ECU`, value: `${partdb.Parts[ecu.toLowerCase()].Emote} ${partdb.Parts[ecu.toLowerCase()].Name}`, inline: true},
            {name: `Springs`, value: `${partdb.Parts[springs.toLowerCase()].Emote} ${partdb.Parts[springs.toLowerCase()].Name}`, inline: true},
            {name: `Weight`, value: `${partdb.Parts[weightreduction.toLowerCase()].Emote} ${partdb.Parts[weightreduction.toLowerCase()].Name}`, inline: true},
            {name: `Spoiler`, value: `${partdb.Parts[spoiler.toLowerCase()].Emote} ${partdb.Parts[spoiler.toLowerCase()].Name}`, inline: true},
            {name: `Gas tank`, value: `${partdb.Parts[gastank.toLowerCase()].Emote} ${partdb.Parts[gastank.toLowerCase()].Name}`, inline: true},
            {name: `Brakes`, value: `${partdb.Parts[brakes.toLowerCase()].Emote} ${partdb.Parts[brakes.toLowerCase()].Name}`, inline: true},
            {name: `Drivetrain`, value: `${partdb.Parts[drivetrain.toLowerCase()].Emote} ${partdb.Parts[drivetrain.toLowerCase()].Name}`, inline: true}

            )
          .setColor(colors.blue)

          await interaction.editReply({embeds: [embed]})

        }
        else if(i.customId == "remove"){
          let ogcar = cars.Cars[carindb[0].Name.toLowerCase()]

          if(exhaust !== "stock exhaust"){
            userdata.parts.push(exhaust.toLowerCase())
          }
          if(turbo  !== "no turbo"){
            userdata.parts.push(turbo)
          }
          if(intake  !== "stock intake"){
            userdata.parts.push(intake)
          }
      
          if(tires !== "stock tires"){
            userdata.parts.push(tires)
          }
          if(suspension !== "stock suspension"){
            userdata.parts.push(suspension)
          }
          if(gearbox !== "stock gearbox"){
            userdata.parts.push(gearbox)
          }
          if(clutch !== "stock clutch"){
            userdata.parts.push(clutch)
          }
          if(intercooler !== "no intercooler"){
            userdata.parts.push(intercooler)
          }
          if(ecu !== "stock ecu"){
            userdata.parts.push(ecu)
          }
          if(spoiler !== "no spoiler"){
            userdata.parts.push(spoiler)
          }
          if(brakes !== "stock brakes"){
            userdata.parts.push(brakes)
          }
          if(springs !== "stock springs"){
            userdata.parts.push(springs)
          }
 
          if(weightreduction !== "no weight"){
            userdata.parts.push(weightreduction)
          }
          speed = ogcar.Speed

          let accel = ogcar["0-60"]
          console.log(speed)
         if(engine == carindb[0].engine !== cars.Cars[carindb[0].Name.toLowerCase()].Engine){
           speed = carindb[0].Speed - partdb.Parts[carindb[0].engine.toLowerCase()].Power
           console.log(speed)
           speed = speed + partdb.Parts[carindb[0].engine.toLowerCase()].Power
           console.log(speed)
           if(partdb.Parts[carindb[0].engine.toLowerCase()].Acceleration > 0){
            accel = carindb[0].Acceleration + partdb.Parts[carindb[0].engine.toLowerCase()].Acceleration
            accel = accel - partdb.Parts[carindb[0].engine.toLowerCase()].Acceleration

          }
         }

          let sellprice = Math.floor(ogcar.Price * 0.75)
          if(sellprice == 0){
            sellprice = ogcar.sellprice
          }
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car].Speed": speed,
                "cars.$[car].Acceleration": accel,
                "cars.$[car].Handling": ogcar.Handling,
                "cars.$[car].WeightStat": ogcar.Weight,
                "cars.$[car].Resale": sellprice,
                "cars.$[car].exhaust": null,
                "cars.$[car].turbo": null,
                "cars.$[car].intake": null,
                "cars.$[car].tires": null,
                "cars.$[car].suspension": null,
                "cars.$[car].gearbox": null,
                "cars.$[car].clutch": null,
                "cars.$[car].intercooler": null,
                "cars.$[car].ecu": null,
                "cars.$[car].spoiler": null,
                "cars.$[car].weight": null,
                "cars.$[car].brakes": null,
                "cars.$[car].drivetrain": null,
                "cars.$[car].springs": null,
              },
            },
      
            {
              arrayFilters: [
                {
                  "car.Name": carindb[0].Name,
                },
              ],
            }
          );

          userdata.save()
          collector.stop()
        }
      })

     
    } 
  },
};
