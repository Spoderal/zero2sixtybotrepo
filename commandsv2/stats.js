const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");
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
const brands = require("../data/brands.json");
const lodash = require("lodash");

let currencies = require("../data/currencydb.json");
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
    var item = interaction.options.getString("item");
    let user = interaction.options.getUser("user") || interaction.user;
    let userdata = await User.findOne({ id: user.id });
    let global = await Global.findOne({});
    let settings = userdata.settings;
    let brandsarr = [];
    let embedl = new Discord.EmbedBuilder()
      .setTitle(`${emotes.loading} Loading`)
      .setDescription("Fetching data, this wont take too long!")
      .setColor(colors.blue);
    await interaction.reply({ embeds: [embedl], fetchReply: true });
    for (let b in brands) {
      brandsarr.push(brands[b]);
    }
    let weightemote = emotes.weight;
    let ucars = userdata.cars;
    let carindb = ucars.filter((c) => c.ID == item);
    if (list[item.toLowerCase()]) {
      let canvas = createCanvas(1280, 720);
      let ctx = canvas.getContext("2d");
      let carindb = list[item.toLowerCase()];
      let carbg = await loadImage("https://i.ibb.co/MN2rTZ7/newcardblue-1.png");
      let carimg = await loadImage(carindb.Image);
      let brand =
        brandsarr.filter((br) => br.emote == carindb.Emote) || "no brand";
      if (brand.length == 0) {
        brand[0] = "no brand";
      }
      let brimg = await loadImage(brand[0].image);
      let flag = await loadImage(brand[0].country);
      let policeimg = await loadImage("https://i.ibb.co/cwr7WLB/police.png");
      ctx.drawImage(carimg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(carbg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(brimg, 15, 620, 100, 100);
      ctx.drawImage(flag, 1120, 620, 180, 100);
      if (carindb.Police) {
        ctx.drawImage(policeimg, 920, 600, 150, 150);
      }

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
      let price = `${toCurrency(carindb.Price)}`;

      if (carindb.Price <= 0) {
        let obtained = carindb.Obtained || "Not Obtainable";
        price = `Obtained: ${obtained}`;
      } else if (carindb.Squad) {
        price = `Obtained: Squad`;
      }

      ctx.fillText(price, 600, 75);

      let attachment = new Discord.AttachmentBuilder(await canvas.toBuffer(), {
        name: "stats-image.png",
      });

      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("market")
          .setLabel("View market listings")
          .setEmoji("🏪")
          .setStyle("Success")
      );

      let msg = await interaction.editReply({
        embeds: [],
        files: [attachment],
        components: [row],
      });

      let filter = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };
      let collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (i.customId.includes("market")) {
          let filt = "cars";
          let market;
          if (filt) {
            market = global.newmarket.filter(
              (item) =>
                item.type == filt && item.item == carindb.Name.toLowerCase()
            );
          } else {
            market = global.newmarket;
          }

          let marketdisplay = [];
          for (let m in market) {
            let listing = market[m];

            if (cars.Cars[listing.item]) {
              marketdisplay.push(
                `\`ID ${listing.id}\`: ${cars.Cars[listing.item].Emote} ${
                  cars.Cars[listing.item].Name
                } - ${toCurrency(listing.price)}`
              );
            }

            if (partdb.Parts[listing.item.toLowerCase()]) {
              marketdisplay.push(
                `\`ID ${listing.id}\`: ${
                  partdb.Parts[listing.item.toLowerCase()].Emote
                } ${
                  partdb.Parts[listing.item.toLowerCase()].Name
                } - ${toCurrency(listing.price)} **x${listing.amount}**`
              );
            } else if (itemdb[listing.item.toLowerCase()]) {
              marketdisplay.push(
                `\`ID ${listing.id}\`: ${
                  itemdb[listing.item.toLowerCase()].Emote
                } ${itemdb[listing.item.toLowerCase()].Name} - ${toCurrency(
                  listing.price
                )} **x${listing.amount}**`
              );
            } else if (currencies[listing.item.toLowerCase()]) {
              marketdisplay.push(
                `\`ID ${listing.id}\`: ${
                  currencies[listing.item.toLowerCase()].Emote
                } ${currencies[listing.item.toLowerCase()].Name} - ${toCurrency(
                  listing.price
                )} **x${listing.amount}**`
              );
            }
          }

          marketdisplay = lodash.chunk(
            marketdisplay.map((a) => `${a}`),
            10
          ) || ["Nothing on the market yet!"];
          if (marketdisplay == undefined || !marketdisplay[0]) {
            marketdisplay = [["Nothing yet!"]];
          }
          console.log(marketdisplay);
          let embed1 = new Discord.EmbedBuilder()
            .setTitle(`User Market`)
            .setDescription(`${marketdisplay[0].join("\n")}`)
            .setFooter({ text: `Page 1/${marketdisplay.length}` })
            .setColor(colors.blue);

          let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("previous")
              .setEmoji("◀️")
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("next")
              .setEmoji("▶️")
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("first")
              .setEmoji("⏮️")
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("last")
              .setEmoji("⏭️")
              .setStyle("Secondary")
          );

          let msg = await i.update({
            embeds: [embed1],
            components: [row],
            fetchReply: true,
          });
          let filter = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };
          let collector = msg.createMessageComponentCollector({
            filter: filter,
          });
          let page = 1;
          collector.on("collect", async (i) => {
            let current = page;
            if (i.customId.includes("previous") && page !== 1) page--;
            else if (
              i.customId.includes("next") &&
              page !== marketdisplay.length
            )
              page++;
            else if (i.customId.includes("first")) page = 1;
            else if (i.customId.includes("last")) page = marketdisplay.length;

            embed1.setDescription(`${marketdisplay[page - 1].join("\n")}`);

            if (current !== page) {
              embed1.setFooter({
                text: `Page ${page}/${marketdisplay.length}`,
              });
              i.update({ embeds: [embed1] });
            } else {
              return i.update({ content: "No pages left!" });
            }
          });
        }
      });
    } else if (carindb[0]) {
      let canvas = createCanvas(1280, 720);
      let ctx = canvas.getContext("2d");

      if (carindb.length == 0) {
        return interaction.editReply("Thats not an ID!");
      }

      console.log(carindb);
      let ogcar = cars.Cars[carindb[0].Name.toLowerCase()].Image;
      let weight = carindb[0].WeightStat;
      if (!weight) {
        weight = cars.Cars[carindb[0].Name.toLowerCase()].Weight;
      }

      let exhaust = carindb[0].Exhaust;
      let intake = carindb[0].Intake;
      let tires = carindb[0].Tires;
      let turbo = carindb[0].Turbo;
      let suspension = carindb[0].Suspension;
      let engine = carindb[0].Engine;
      let gearbox = carindb[0].Gearbox;
      let clutch = carindb[0].Clutch;
      let ecu = carindb[0].ECU;
      let brakes = carindb[0].Brakes;
      let spoiler = carindb[0].Spoiler;
      let intercooler = carindb[0].Intercooler;

      let drivetrain = carindb[0].Drivetrain;

      // let suspensionimg = await loadImage(partdb.Parts[suspension.toLowerCase()].Image)
      // let engineimg = await loadImage(partdb.Parts[engine.toLowerCase()].Image)
      // let gearboximg = await loadImage(partdb.Parts[gearbox.toLowerCase()].Image)
      // let intercoolerimg = await loadImage(partdb.Parts[intercooler.toLowerCase()].Image)

      let carbg = await loadImage("https://i.ibb.co/MN2rTZ7/newcardblue-1.png");
      let carimg = await loadImage(ogcar);
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
      ctx.drawImage(brimg, 15, 620, 100, 100);
      console.log("br done");
      ctx.drawImage(flag, 1120, 620, 180, 100);
      console.log("flag done");

      ctx.font = "bold 54px sans-serif";
      ctx.fillStyle = "#ffffff";

      ctx.fillText(carindb[0].Name, 125, 690);
      console.log("name done");

      ctx.font = "bold 45px sans-serif";

      ctx.fillText(carindb[0].Speed, 15, 105);
      console.log("speed done");
      ctx.fillText(`${carindb[0].Acceleration.toFixed(1)}`, 170, 105);
      console.log("acc done");
      ctx.fillText(carindb[0].Handling, 300, 105);
      console.log("hand done");

      ctx.font = "bold 35px sans-serif";
      console.log("done");
      ctx.fillText(weight, 435, 105);

      ctx.font = "bold 20px sans-serif";

      if (exhaust) {
        let exhaustimg = await loadImage(
          partdb.Parts[exhaust.toLowerCase()].Image
        );
        ctx.drawImage(exhaustimg, 595, 10, 75, 75);
        ctx.fillText(exhaust, 585, 105);
      }

      if (intake) {
        let intakeimg = await loadImage(
          partdb.Parts[intake.toLowerCase()].Image
        );
        ctx.drawImage(intakeimg, 710, 10, 75, 75);
        ctx.fillText(intake, 700, 105);
      }

      if (tires) {
        let tiresimg = await loadImage(partdb.Parts[tires.toLowerCase()].Image);
        ctx.drawImage(tiresimg, 815, 10, 75, 75);
        ctx.fillText(tires, 815, 105);
      }

      if (turbo) {
        let turboimg = await loadImage(partdb.Parts[turbo.toLowerCase()].Image);
        ctx.drawImage(turboimg, 930, 10, 75, 75);
        ctx.fillText(turbo, 930, 105);
      }

      if (clutch) {
        let clutchimg = await loadImage(
          partdb.Parts[clutch.toLowerCase()].Image
        );
        ctx.drawImage(clutchimg, 1045, 10, 75, 75);
        ctx.fillText(clutch, 1045, 105);
      }

      if (ecu) {
        let ecuimg = await loadImage(partdb.Parts[ecu.toLowerCase()].Image);
        ctx.drawImage(ecuimg, 1160, 10, 75, 75);
        ctx.fillText(ecu, 1160, 105);
      }

      if (brakes) {
        let brakesimg = await loadImage(
          partdb.Parts[brakes.toLowerCase()].Image
        );
        ctx.drawImage(brakesimg, 1160, 115, 75, 75);
        ctx.fillText(brakes, 1160, 215);
      }

      if (spoiler) {
        let spoilerimg = await loadImage(
          partdb.Parts[spoiler.toLowerCase()].Image
        );
        ctx.drawImage(spoilerimg, 1160, 215, 75, 75);
        ctx.fillText(spoiler, 1160, 315);
      }
      if (intercooler) {
        let intercoolerimg = await loadImage(
          partdb.Parts[intercooler.toLowerCase()].Image
        );
        ctx.drawImage(intercoolerimg, 1160, 315, 75, 75);
        ctx.fillText(intercooler, 1140, 415);
      }

      if (suspension) {
        let suspensionimg = await loadImage(
          partdb.Parts[suspension.toLowerCase()].Image
        );
        ctx.drawImage(suspensionimg, 1160, 415, 75, 75);
        ctx.fillText(suspension, 1140, 515);
      }
      if (drivetrain) {
        let drivetrainimg = await loadImage(
          partdb.Parts[drivetrain.toLowerCase()].Image
        );
        ctx.drawImage(drivetrainimg, 1170, 515, 75, 75);
        ctx.fillText(drivetrain, 1170, 615);
      }

      if (engine) {
        let engineimg = await loadImage(
          partdb.Parts[engine.toLowerCase()].Image
        );
        ctx.drawImage(engineimg, 790, 640, 75, 75);
        ctx.fillText("Engine", 800, 650);
      }

      if (gearbox) {
        let gearboximg = await loadImage(
          partdb.Parts[gearbox.toLowerCase()].Image
        );
        ctx.drawImage(gearboximg, 890, 640, 75, 75);
        ctx.fillText(gearbox, 900, 650);
      }

      console.log("done");
      let attachment = new Discord.AttachmentBuilder(await canvas.toBuffer(), {
        name: "car-image.png",
      });

      await interaction.editReply({
        embeds: [],
        files: [attachment],
        fetchReply: true,
      });
    } else if (partdb.Parts[item.toLowerCase()]) {
      let part = interaction.options.getString("item");
      part = part.toLowerCase();
      let partindb = partdb.Parts[part];

      if (!partindb) return await interaction.editReply(`Thats not a part!`);
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

      if (partindb.AddHandling > 0) {
        stats.push(
          `<:handling:983963211403505724> Handling: +${partindb.AddHandling}`
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
      let mark = global.newmarket.filter(
        (item) =>
          item.type == "parts" && item.item == partindb.Name.toLowerCase()
      );
      let prices = 0;
      for (let par in mark) {
        prices += mark[par].price;
      }
      let total = mark.length;

      let avg = prices / total;

      if (isNaN(avg)) {
        avg = 0;
      }

      let embed = new Discord.EmbedBuilder()
        .setTitle(`Stats for ${partindb.Emote} ${partindb.Name}`)
        .setDescription(
          `Store Price: ${toCurrency(partindb.Price)}\n\n${stats.join(
            "\n"
          )}\n\nMarket Listings: ${mark.length}\nAverage Price: ${toCurrency(
            avg
          )}`
        )
        .setColor(colors.blue);

      if (partindb.Image) {
        embed.setThumbnail(`${partindb.Image}`);
      }

      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("market")
          .setLabel("View market listings")
          .setEmoji("🏪")
          .setStyle("Success")
      );

      let msg = await interaction.editReply({
        embeds: [embed],
        components: [row],
      });

      let filter = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };
      let collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (i.customId.includes("market")) {
          let filt = "parts";
          let market;
          if (filt) {
            market = global.newmarket.filter(
              (item) =>
                item.type == filt && item.item == partindb.Name.toLowerCase()
            );
          } else {
            market = global.newmarket;
          }

          let marketdisplay = [];
          for (let m in market) {
            let listing = market[m];

            if (partdb.Parts[listing.item.toLowerCase()]) {
              marketdisplay.push(
                `\`ID ${listing.id}\`: ${
                  partdb.Parts[listing.item.toLowerCase()].Emote
                } ${
                  partdb.Parts[listing.item.toLowerCase()].Name
                } - ${toCurrency(listing.price)} **x${listing.amount}**`
              );
            } else if (itemdb[listing.item.toLowerCase()]) {
              marketdisplay.push(
                `\`ID ${listing.id}\`: ${
                  itemdb[listing.item.toLowerCase()].Emote
                } ${itemdb[listing.item.toLowerCase()].Name} - ${toCurrency(
                  listing.price
                )} **x${listing.amount}**`
              );
            } else if (currencies[listing.item.toLowerCase()]) {
              marketdisplay.push(
                `\`ID ${listing.id}\`: ${
                  currencies[listing.item.toLowerCase()].Emote
                } ${currencies[listing.item.toLowerCase()].Name} - ${toCurrency(
                  listing.price
                )} **x${listing.amount}**`
              );
            }
          }

          marketdisplay = lodash.chunk(
            marketdisplay.map((a) => `${a}`),
            10
          ) || ["Nothing on the market yet!"];
          if (marketdisplay == undefined || !marketdisplay[0]) {
            marketdisplay = [["Nothing yet!"]];
          }
          console.log(marketdisplay);
          let embed1 = new Discord.EmbedBuilder()
            .setTitle(`User Market`)
            .setDescription(`${marketdisplay[0].join("\n")}`)
            .setFooter({ text: `Page 1/${marketdisplay.length}` })
            .setColor(colors.blue);

          let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("previous")
              .setEmoji("◀️")
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("next")
              .setEmoji("▶️")
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("first")
              .setEmoji("⏮️")
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("last")
              .setEmoji("⏭️")
              .setStyle("Secondary")
          );

          let msg = await i.update({
            embeds: [embed1],
            components: [row],
            fetchReply: true,
          });
          let filter = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };
          let collector = msg.createMessageComponentCollector({
            filter: filter,
          });
          let page = 1;
          collector.on("collect", async (i) => {
            let current = page;
            if (i.customId.includes("previous") && page !== 1) page--;
            else if (
              i.customId.includes("next") &&
              page !== marketdisplay.length
            )
              page++;
            else if (i.customId.includes("first")) page = 1;
            else if (i.customId.includes("last")) page = marketdisplay.length;

            embed1.setDescription(`${marketdisplay[page - 1].join("\n")}`);

            if (current !== page) {
              embed1.setFooter({
                text: `Page ${page}/${marketdisplay.length}`,
              });
              i.update({ embeds: [embed1] });
            } else {
              return i.update({ content: "No pages left!" });
            }
          });
        }
      });
    } else if (itemdb[item.toLowerCase()]) {
      let itemindb = itemdb[item.toLowerCase()];
      let embed = new Discord.EmbedBuilder()
        .setAuthor({
          name: `Information for ${itemindb.Name}`,
          iconURL: itemindb.Image,
        })
        .setDescription(
          `${itemindb.Action}\n\nPrice: ${toCurrency(itemindb.Price)}`
        )
        .addFields({
          name: "Type",
          value: `${itemindb.Type}`,
        })
        .setColor(colors.blue);

      if (itemindb.Image) {
        embed.setThumbnail(`${itemindb.Image}`);
      }

      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("market")
          .setLabel("View market listings")
          .setEmoji("🏪")
          .setStyle("Success")
      );

      let msg = await interaction.editReply({
        embeds: [embed],
        components: [row],
      });

      let filter = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };
      let collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (i.customId.includes("market")) {
          let filt = "items";
          let market;
          if (filt) {
            market = global.newmarket.filter(
              (item) =>
                item.type == filt && item.item == itemindb.Name.toLowerCase()
            );
          } else {
            market = global.newmarket;
          }

          let marketdisplay = [];
          for (let m in market) {
            let listing = market[m];

            if (partdb.Parts[listing.item.toLowerCase()]) {
              marketdisplay.push(
                `\`ID ${listing.id}\`: ${
                  partdb.Parts[listing.item.toLowerCase()].Emote
                } ${
                  partdb.Parts[listing.item.toLowerCase()].Name
                } - ${toCurrency(listing.price)} **x${listing.amount}**`
              );
            } else if (itemdb[listing.item.toLowerCase()]) {
              marketdisplay.push(
                `\`ID ${listing.id}\`: ${
                  itemdb[listing.item.toLowerCase()].Emote
                } ${itemdb[listing.item.toLowerCase()].Name} - ${toCurrency(
                  listing.price
                )} **x${listing.amount}**`
              );
            } else if (currencies[listing.item.toLowerCase()]) {
              marketdisplay.push(
                `\`ID ${listing.id}\`: ${
                  currencies[listing.item.toLowerCase()].Emote
                } ${currencies[listing.item.toLowerCase()].Name} - ${toCurrency(
                  listing.price
                )} **x${listing.amount}**`
              );
            }
          }

          marketdisplay = lodash.chunk(
            marketdisplay.map((a) => `${a}`),
            10
          ) || ["Nothing on the market yet!"];
          if (marketdisplay == undefined || !marketdisplay[0]) {
            marketdisplay = [["Nothing yet!"]];
          }
          let embed1 = new Discord.EmbedBuilder()
            .setTitle(`User Market`)
            .setDescription(`${marketdisplay[0].join("\n")}`);

          embed1
            .setFooter({ text: `Page 1/${marketdisplay.length}` })
            .setColor(`#60B0F4`);

          let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("previous")
              .setEmoji("◀️")
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("next")
              .setEmoji("▶️")
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("first")
              .setEmoji("⏮️")
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("last")
              .setEmoji("⏭️")
              .setStyle("Secondary")
          );
          await interaction.deferReply();

          let msg = await interaction.editReply({
            embeds: [embed1],
            components: [row],
            fetchReply: true,
          });
          let filter = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };
          let collector = msg.createMessageComponentCollector({
            filter: filter,
          });
          let page = 1;
          collector.on("collect", async (i) => {
            let current = page;
            if (i.customId.includes("previous") && page !== 1) page--;
            else if (
              i.customId.includes("next") &&
              page !== marketdisplay.length
            )
              page++;
            else if (i.customId.includes("first")) page = 1;
            else if (i.customId.includes("last")) page = marketdisplay.length;

            embed1.setDescription(`${marketdisplay[page - 1].join("\n")}`);

            if (current !== page) {
              embed1.setFooter({
                text: `Page ${page}/${marketdisplay.length}`,
              });
              i.update({ embeds: [embed1] });
            } else {
              return i.update({ content: "No pages left!" });
            }
          });
        }
      });
    }
  },
};
