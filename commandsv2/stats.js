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
const currencies = require("../data/currencies.json");


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
      !partdb.Parts[item.toLowerCase()] && !currencies[item.toLowerCase()]
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
        console.log(carindb)
        let carbg = await loadImage(cars.Tiers[carindb.Class.toLowerCase()].Image);
        let carimg = await loadImage(carindb.Image);
        let brand = brandsarr.filter((br) => br.emote == carindb.Emote);
        if (!brand[0]) {
          brand[0] = brands["no brand"];
        }
        let brimg = await loadImage(brand[0].image);
        let flag = await loadImage(brand[0].country);
        ctx.drawImage(carimg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(carbg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(brimg, 150, 10, 75, 75);
        ctx.drawImage(flag, 0, 0, 136, 90);


  
        
        ctx.font = "bold 50px sans-serif";
        ctx.fillStyle = "#ffffff";
  
        let nametxt = `${carindb.Name}`
        ctx.fillText(nametxt, 250, 70);
        ctx.font = "bold 40px sans-serif";

        let id = carindb.alias
        ctx.fillText(id, 840, 700);

        
  
        ctx.font = "bold 35px sans-serif";
  
        
        ctx.fillText(Math.round(carindb.Speed), 80, 190);
        ctx.fillText(carindb["0-60"], 90, 300);
        ctx.fillText(carindb.Handling, 80, 420);
        ctx.fillText(carindb.Weight, 75, 550);
  
        ctx.font = "regular 35px sans-serif";

  
  
        ctx.font = "bold 40px sans-serif";
        let price = `${toCurrency(carindb.Price)}`;
  
        if (carindb.Drivetrain) {
          let drivetrain = carindb.Drivetrain;
          ctx.fillText(drivetrain, 75, 650);
        }
  
        if (carindb.Engine) {
          let engine = carindb.Engine;
  
          ctx.fillText(engine, 95, 700);
        }
  
        ctx.font = "bold 40px sans-serif";
        if (carindb.Price <= 0) {
          let obtained = carindb.Obtained || "Not Obtainable";
          price = `${obtained}`;
        } else if (carindb.Squad) {
          price = `Squad Car`;
        }
  
        ctx.fillText(price, 250, 700);
  
        let attachment = new Discord.AttachmentBuilder(await canvas.toBuffer(), {
          name: "stats-image.png",
        });

        let sellprice = Math.floor(carindb.Price * 0.75)

        if(sellprice === 0){
          sellprice = carindb.sellprice * 0.35 
        }
  
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
      if (partindb.DecreaseHandling > 0) {
        stats.push(
          `<:handling:983963211403505724> Handling: -${partindb.DecreaseHandling}`
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
      let og = cars.Cars[carindb[0].Name.toLowerCase()];
      let carbg = await loadImage(cars.Tiers[og.Class.toLowerCase()].Image);
      if(carindb[0].Class && carindb[0].Class == "X"){
        carbg = await loadImage(cars.Tiers["x"].Image);
      }
      let brand = brandsarr.filter((br) => br.emote == og.Emote);
      if (!brand[0]) {
        brand[0] = brands["no brand"];
      }
      let brimg = await loadImage(brand[0].image);
      let flag = await loadImage(brand[0].country);
      let ogcar = cars.Cars[og.Name.toLowerCase()].Image;
      new ImgurClient({ accessToken: process.env.imgur });
      let carim = carindb[0].Image || carindb[0].Livery || ogcar;
      let weight = carindb[0].WeightStat;
      if (!weight) {
        weight = cars.Cars[carindb[0].Name.toLowerCase()].Weight;
      }
      let carimg = await loadImage(carim)
      ctx.drawImage(carimg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(carbg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(brimg, 150, 10, 75, 75);
      ctx.drawImage(flag, 0, 0, 136, 90);



      
      ctx.font = "bold 50px sans-serif";
      ctx.fillStyle = "#ffffff";

      let nametxt = `${carindb[0].Name}`
      ctx.fillText(nametxt, 250, 70);
      ctx.font = "bold 40px sans-serif";

      let id = carindb[0].ID
      ctx.fillText(id, 840, 700);

      

      ctx.font = "bold 35px sans-serif";
      let acceleration = Math.round(carindb[0].Acceleration * 10) / 10;
      let speed = Math.round(carindb[0].Speed);
      let handling = Math.round(carindb[0].Handling);
      
      ctx.fillText(speed, 80, 190);
      ctx.fillText(acceleration, 90, 300);
      ctx.fillText(handling, 80, 420);
      ctx.fillText(carindb[0].WeightStat, 75, 550);

      ctx.font = "regular 35px sans-serif";



      ctx.font = "bold 40px sans-serif";
      let sellprice = Math.floor(carindb[0].Resale)
      if(!sellprice && cars.Cars[carindb[0].Name.toLowerCase()].Price > 0){
        sellprice = cars.Cars[carindb[0].Name.toLowerCase()].Price * 0.75
      }
      else if(cars.Cars[carindb[0].Name.toLowerCase()].Price  == 0) {
        sellprice = cars.Cars[carindb[0].Name.toLowerCase()].sellprice * 0.35
      }

      if (carindb[0].drivetrain && carindb[0].drivetrain !== null) {
        let drivetrain = carindb[0].drivetrain
        ctx.fillText(partdb.Parts[drivetrain.toLowerCase()].Name, 75, 650);
      }
      else {
        let drivetrain = cars.Cars[carindb[0].Name.toLowerCase()].Drivetrain;

        ctx.fillText(drivetrain, 75, 650);
      }

      if (carindb[0].engine) {
        let engine = partdb.Parts[carindb[0].engine].Name;

        ctx.fillText(engine, 95, 700);
      }
      else {
        let engine = cars.Cars[carindb[0].Name.toLowerCase()].Engine;

        ctx.fillText(engine, 95, 700);
      }

      ctx.font = "bold 40px sans-serif";


      ctx.fillText(`${toCurrency(sellprice)}`, 250, 700);

      let attachment = new Discord.AttachmentBuilder(await canvas.toBuffer(), {
        name: "stats-image.png",
      });

    

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


    

      let row = new ActionRowBuilder()
      .setComponents(
        new ButtonBuilder()
        .setCustomId("parts")
        .setLabel("Parts")
        .setEmoji("⚙️")
        .setStyle("Secondary")

      )

      let xessence = carindb[0].Xessence || 0
      let classxessencerequired = {
        "D": 1000,
        "C": 2000,
        "B": 3000,
        "A": 4000,
        "S": 5000
      }
      let carclass = cars.Cars[carindb[0].Name.toLowerCase()].Class;
  
      let xessenceneeded = classxessencerequired[carclass]
      let msg = await interaction.editReply({
        embeds: [],
        content: `${emotes.cash} Sells for ${toCurrency(sellprice)}\n${emotes.xessence} Xessence: ${xessence}/${xessenceneeded}`,
        files: [attachment],
        components:[row],
        fetchReply: true,
      });

      let filter = (btnInt) => {
        return interaction.user.id == btnInt.user.id;
      };
      const collector = msg.createMessageComponentCollector({
        filter: filter,
      });
      
      collector.on('collect', async (i) => {
        if(i.customId == "parts"){
     


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
     
      })

     
    } else if(currencies[item.toLowerCase()]){
      let currency = currencies[item.toLowerCase()]
      let embed = new Discord.EmbedBuilder()
      .setTitle(`Stats for ${currency.Emote} ${currency.Name}`)
      .setDescription(`${currency.Use}`)
      .setColor(colors.blue)

      await interaction.editReply({embeds: [embed]})
    }
  },
};
