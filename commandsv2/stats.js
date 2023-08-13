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
    var list2 = houses
    var item = interaction.options.getString("item");
    let user = interaction.options.getUser("user") || interaction.user;
    let userdata = (await User.findOne({ id: user.id })) || [];
    let global = await Global.findOne({});
    let settings = userdata.settings;
    let brandsarr = [];
    let housesarr = []
    for (let b in brands) {
      brandsarr.push(brands[b]);
    }
    for (let h in list2) {
      housesarr.push(list2[h]);
    }
    let weightemote = emotes.weight;
    let ucars = userdata.cars || [];
    let carindb = ucars.filter((c) => c.ID == item);
    let houseindb = housesarr.filter((h) => h.id == item)
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
      let carbg = await loadImage("https://i.ibb.co/SNWzQ7X/statcard.png");
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
      ctx.drawImage(brimg, 15, 600, 100, 100);
      ctx.drawImage(flag, 1050, 572, 250, 150);
      if (carindb.Police) {
        ctx.drawImage(policeimg, 920, 600, 150, 150);
      }

      ctx.font = "bold 54px sans-serif";
      ctx.fillStyle = "#ffffff";

      ctx.fillText(carindb.Name, 125, 670);

      ctx.font = "bold 55px sans-serif";

      ctx.fillText(Math.round(carindb.Speed), 15, 120);
      ctx.fillText(carindb["0-60"], 215, 120);
      ctx.fillText(carindb.Handling, 400, 120);

      ctx.font = "bold 35px sans-serif";
      ctx.fillText(carindb.Weight, 595, 120);

      ctx.font = "bold 110px sans-serif";

      ctx.fillText(carindb.Class, 1160, 110);

      ctx.font = "bold 55px sans-serif";
      let price = `${toCurrency(carindb.Price)}`;

      if (carindb.Drivetrain) {
        let drivetrain = carindb.Drivetrain;

        ctx.fillText(drivetrain, 900, 640);
      }

      if (carindb.Engine) {
        let engine = carindb.Engine;

        ctx.fillText(engine, 900, 690);
      }

      if (carindb.Price <= 0) {
        let obtained = carindb.Obtained || "Not Obtainable";
        price = `Obtained: ${obtained}`;
      } else if (carindb.Squad) {
        price = `Obtained: Squad`;
      }

      ctx.fillText(price, 800, 100);

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

      let drivetrain = carindb[0].Drivetrain;

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

      ctx.font = "bold 35px sans-serif";

      if (exhaust) {
        let exhaustimg = await loadImage(
          partdb.Parts[`t${exhaust}exhaust`].Image
        );
        ctx.drawImage(exhaustimg, 815, 30, 50, 50);
        ctx.fillText(exhaust, 810, 29);
      }

      if (intake) {
        let intakeimg = await loadImage(partdb.Parts[`t${intake}intake`].Image);
        ctx.drawImage(intakeimg, 875, 30, 50, 50);
        ctx.fillText(intake, 870, 29);
      }

      if (tires) {
        let tiresimg = await loadImage(partdb.Parts[`t${tires}tires`].Image);
        ctx.drawImage(tiresimg, 935, 30, 50, 50);
        ctx.fillText(tires, 930, 29);
      }

      if (turbo) {
        let turboimg = await loadImage(partdb.Parts[`turbo`].Image);
        ctx.drawImage(turboimg, 995, 30, 50, 50);
        ctx.fillText(turbo, 990, 29);
      }

      if (clutch) {
        let clutchimg = await loadImage(partdb.Parts[`t${clutch}clutch`].Image);
        ctx.drawImage(clutchimg, 1045, 30, 50, 50);
        ctx.fillText(clutch, 1045, 29);
      }

      if (ecu) {
        let ecuimg = await loadImage(partdb.Parts[`t${ecu}ecu`].Image);
        ctx.drawImage(ecuimg, 1105, 30, 50, 50);
        ctx.fillText(ecu, 1100, 29);
      }

      if (intercooler) {
        let intercoolerimg = await loadImage(
          partdb.Parts[`t${intercooler}intercooler`].Image
        );
        ctx.drawImage(intercoolerimg, 1165, 30, 50, 50);
        ctx.fillText(intercooler, 1160, 29);
      }

      if (suspension) {
        let suspensionimg = await loadImage(
          partdb.Parts[`t${suspension}suspension`].Image
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
          partdb.Parts[`t${gearbox}gearbox`].Image
        );
        ctx.drawImage(gearboximg, 875, 100, 50, 50);
        ctx.fillText(gearbox, 870, 99);
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

      if (partindb.Power > 0) {
        stats.push(`${emotes.speed} Speed: +${partindb.Power}`);
      }

      if (partindb.Weight > 0) {
        stats.push(`${emotes.weight} Weight: +${partindb.Weight}`);
      }
      if (partindb.WeightMinus > 0) {
        stats.push(`${emotes.weight} Weight: +${partindb.WeightMinus}`);
      }

      if (partindb.Handling > 0) {
        stats.push(
          `<:handling:983963211403505724> Handling: +${partindb.Handling}`
        );
      }

      if (partindb.Acceleration > 0) {
        stats.push(
          `${emotes.zero2sixty} Acceleration: -${partindb.Acceleration}`
        );
      }
      if (partindb.Stars > 0) {
        stats.push(`⭐ Rating: +${partindb.Stars}`);
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
      let price = itemindb.Price;

      if (price == 0 && itemindb.Findable == true) {
        price = `Findable only`;
      } else {
        price = toCurrency(itemindb.Price);
      }
      let tier = itemindb.Tier || 0
      let embed = new Discord.EmbedBuilder()
        .setAuthor({
          name: `Information for ${itemindb.Name}`,
          iconURL: itemindb.Image,
        })
        .setDescription(`${itemindb.Action}\n\nPrice: ${price}`)
        .addFields({
          name: "Type",
          value: `${itemindb.Type}`},
          {name: "Item Tier",
          value: `${tier}`}
        )
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
    else if (houseindb[0]){

      let house = houseindb[0]

      let embed1 = new Discord.EmbedBuilder()
      .setTitle(`Stats for ${house.Name}`)
      .setImage(house.Image)
      .setDescription(
        `Price: ${toCurrency(house.Price)}\n\nPerk: ${
          house.Perk
        }\n\nGarage Space: ${
          house.Space
        }\n\nUnlocks at prestige: ${house.Prestige}`
      )
      .setColor(colors.blue);

     await interaction.editReply({embeds: [embed1]})
    }
  },
};
