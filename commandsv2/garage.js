const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const emotes = require("../common/emotes");
const itemdb = require("../data/items.json");
const ms = require("pretty-ms");
const { createCanvas, loadImage } = require("canvas");
const cardb = require("../data/cardb.json");
const { numberWithCommas } = require("../common/utils");
const housedb = require("../data/houses.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("garage")
    .setDescription("Check your garage")
    .addUserOption((option) =>
      option
        .setName("user")
        .setRequired(false)
        .setDescription("The user to view the garage of")
    )
    .addStringOption((option) =>
      option
        .setName("filter")
        .setRequired(false)
        .setDescription("Filter your garage")
        .addChoices({ name: "Favorites", value: "favorites" })
    )
    .addStringOption((option) =>
      option
        .setName("filtertag")
        .setRequired(false)
        .setDescription("Filter your garage by tag")
    ),
  async execute(interaction) {
    let user = interaction.options.getUser("user") || interaction.user;

    let udata = await User.findOne({ id: user.id });
    let filter = interaction.options.getString("filter");
    let filtertag = interaction.options.getString("filtertag");

    let ucars = udata.cars;
    ucars = ucars.reverse()
    let cars = udata.cars;
    let parts = udata.parts;
    let items = udata.items;
    let houses = udata.houses;
    let garagelimit = udata.garageLimit;
    let xessence = udata.xessence;

    if (filter && filter == "favorites") {
      ucars = udata.cars.filter((car) => car.Favorite && car.Favorite == true);
      console.log(ucars);
    }
    if (filtertag) {
      ucars = udata.cars.filter((car) => car.Tag && car.Tag == filtertag);
      console.log(ucars);
    }

    let displayparts = [];
    let displayitems = [];
    let displayhouses = [];
    let displayhouses2 = [];
    let page = 1;
    let displayparts2 = [];
    cars = lodash.chunk(
      ucars.map((a) => a),
      6
    );
    for (let part in parts) {
      part = parts[part];
      let partindb = partdb.Parts[part.toLowerCase()];
      displayparts.push(`${partindb.Emote} ${partindb.Name}`);
    }

    for (let house in houses) {
      house = houses[house];
      let houseindb = housedb[house.Name.toLowerCase()];
      displayhouses.push(`${houseindb.Emote} ${houseindb.Name}`);
    }

    var list = displayparts;
    var hlist = displayhouses;
    var quantities = list.reduce(function (obj, n) {
      if (obj[n]) obj[n]++;
      else obj[n] = 1;

      return obj;
    }, {});
    var hquantities = hlist.reduce(function (obj, n) {
      if (obj[n]) obj[n]++;
      else obj[n] = 1;

      return obj;
    }, {});

    for (let n in quantities) {
      displayparts2.push(`${n} x${quantities[n]}`);
    }

    for (let n in hquantities) {
      displayhouses2.push(`${n} x${hquantities[n]}`);
    }

    displayparts2 = lodash.chunk(
      displayparts2.map((a) => a),
      10
    );

    displayhouses2 = lodash.chunk(
      displayhouses2.map((a) => a),
      10
    );

    let showcaseimg = udata.showcase;
    console.log(parts);

    let itempage = cars;
    let embed = new EmbedBuilder()
      .setTitle(`Displaying cars for ${user.username}`)
      .setDescription(
        `Garage Limit: ${ucars.length}/${garagelimit}\nXessence: ${xessence}`
      )
      .setColor(colors.blue)
      .setFooter({ text: `Pages ${page}/${itempage.length}` });
    embed.setImage("attachment://profile-image.png");

    if (udata.showcase) {
      embed.setThumbnail(udata.showcase);
    }
    for (let car in cars[0]) {
      car = cars[0][car];
      let favorite = "";
      let tag = "";
      if (car.Favorite == true) {
        favorite = "⭐";
      }
      if (car.Tag) {
        tag = `🏷️ ${car.Tag}`;
      }
      let spe = car.Speed;
      let acc = Math.floor(car.Acceleration);
      let hp = spe / acc;
      hp = Math.round(hp);
      embed.addFields({
        name: `${car.Emote} ${car.Name} ${favorite}`,
        value: `${tag}\n${
          emotes.emotes.PT
        } PT: ${hp}\nMiles: ${numberWithCommas(car.Miles)}\n\`ID: ${car.ID}\``,
        inline: true,
      });
    }

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

    let row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cars")
        .setEmoji("🚗")
        .setLabel("Cars")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("parts")
        .setEmoji("⚙️")
        .setLabel("Parts")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("items")
        .setEmoji("🪛")
        .setLabel("Items")
        .setStyle("Secondary"),

      new ButtonBuilder()
        .setCustomId("houses")
        .setEmoji("🏠")
        .setLabel("Houses")
        .setStyle("Secondary")
    );
    let msg = await interaction.reply({
      content: "Loading garage...",
      embeds: [embed],
      components: [row, row2],
      fetchReply: true,
    });

    let canvas = createCanvas(426, 240);
    let ctx = canvas.getContext("2d");
    let bg = await loadImage("https://i.ibb.co/QMZ0Hch/garage.png");
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    let defaulty = 50;
    let defaultx = 5;
    for (let ca in cars[0]) {
      console.log(ca);
      if (ca == 0) {
        defaulty = 40;
        defaultx = 5;
      }
      if (ca == 1) {
        defaulty = 40;
        defaultx = 150;
      }
      if (ca == 2) {
        defaulty = 40;
        defaultx = 300;
      }
      if (ca == 3) {
        defaulty = 125;
        defaultx = 5;
      }
      if (ca == 4) {
        defaulty = 125;
        defaultx = 150;
      }
      if (ca == 5) {
        defaulty = 125;
        defaultx = 300;
      }
      let car = cars[0][ca];
      console.log(car);
      let carimg = car.Image || cardb.Cars[car.Name.toLowerCase()].Image;
      let carimage = await loadImage(carimg);
      try {
        ctx.save();
        roundedImage(ctx, defaultx, defaulty, 123, 70, 20);
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(carimage, defaultx, defaulty, 123, 70);
        ctx.restore();
      } catch (err) {
        console.log("error loading image");
      }
    }
    let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
      name: "profile-image.png",
    });

    setTimeout(async () => {
      embed.setImage("attachment://profile-image.png");
      await interaction.editReply({
        content: "Loaded!",
        embeds: [embed],
        components: [row, row2],
        files: [attachment],
        fetchReply: true,
      });
    }, 3000);

    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector2 = msg.createMessageComponentCollector({
      filter: filter2,
    });

    collector2.on("collect", async (i) => {
      if (i.customId == "cars") {
        itempage = cars;

        embed = new EmbedBuilder()
          .setTitle(`Displaying cars for ${user.username}`)
          .setDescription(
            `Garage Limit: ${ucars.length}/${garagelimit}}\nXessence: ${xessence}`
          )
          .setColor(colors.blue)
          .setFooter({ text: `Pages ${page}/${itempage.length}` });
        for (let car in cars[0]) {
          car = cars[0][car];
          let favorite = "";
          let tag = "";
          if (car.Favorite == true) {
            favorite = "⭐";
          }
          if (car.Tag) {
            tag = `🏷️ ${car.Tag}`;
          }
          let spe = car.Speed;
          let acc = Math.floor(car.Acceleration);
          let hp = spe / acc;
          hp = Math.round(hp);
          embed.addFields({
            name: `${car.Emote} ${car.Name} ${favorite}`,
            value: `${tag}\n${
              emotes.emotes.PT
            } PT: ${hp}\nMiles: ${numberWithCommas(car.Miles)}\n\`ID: ${
              car.ID
            }\``,
            inline: true,
          });
        }

        await i.update({
          embeds: [embed],
          components: [row, row2],
          fetchReply: true,
        });
      } else if (i.customId.includes("parts")) {
        itempage = displayparts2;
        embed = new EmbedBuilder()
          .setTitle(`Displaying parts for ${user.username}`)
          .setColor(colors.blue)
          .setFooter({ text: `Pages ${page}/${itempage.length}` });
        console.log(parts);

        embed.setDescription(`${displayparts2[0].join("\n")}`);
        await i.update({
          embeds: [embed],

          files: [],
          components: [row, row2],
          fetchReply: true,
        });
      } else if (i.customId.includes("houses")) {
        itempage = displayhouses2;
        embed = new EmbedBuilder()
          .setTitle(`Displaying houses for ${user.username}`)
          .setColor(colors.blue)
          .setFooter({ text: `Pages ${page}/${itempage.length}` });
        console.log(parts);

        embed.setDescription(`${displayhouses2[0].join("\n")}`);
        await i.update({
          embeds: [embed],
          components: [row, row2],
          files: [],
          fetchReply: true,
        });
      } else if (i.customId.includes("items")) {
        itempage = items;
        embed = new EmbedBuilder()
          .setTitle(`Displaying items for ${user.username}`)
          .setColor(colors.blue)
          .setFooter({ text: `Pages ${page}/${itempage.length}` });
        console.log(items);
        for (let item in items) {
          item = items[item];
          let itemindb = itemdb[item.toLowerCase()];
          displayitems.push(`${itemindb.Emote} ${itemindb.Name}`);
        }
        var list2 = displayitems;
        let displayitems2 = [];
        var quantities2 = list2.reduce(function (obj, n) {
          if (obj[n]) obj[n]++;
          else obj[n] = 1;

          return obj;
        }, {});

        for (let n in quantities2) {
          displayitems2.push(`${n} x${quantities2[n]}`);
        }
        if (displayitems2.length == 0) embed.setDescription(`No Items`);
        else {
          embed.setDescription(`${displayitems2.join("\n")}`);
        }
        await i.update({
          embeds: [embed],
          components: [row, row2],

          files: [],
          fetchReply: true,
        });
      } else {
        let current = page;
        if (i.customId.includes("previous") && page !== 1) {
          embed.data.fields = null;

          page--;
        } else if (i.customId.includes("next") && page !== itempage.length) {
          embed.data.fields = null;

          page++;
        } else if (i.customId.includes("first")) {
          embed.data.fields = null;

          page = 1;
        } else if (i.customId.includes("last")) {
          embed.data.fields = null;

          page = itempage.length;
        }
        for (let e in itempage[page - 1]) {
          let car = itempage[page - 1][e];
          if (itempage == cars) {
            let favorite = "";
            let tag = "";
            if (car.Favorite == true) {
              favorite = "⭐";
            }
            if (car.Tag) {
              tag = `🏷️ ${car.Tag}`;
            }
            let spe = car.Speed;
            let acc = Math.floor(car.Acceleration);
            let hp = spe / acc;
            hp = Math.round(hp);
            embed.addFields({
              name: `${car.Emote} ${car.Name} ${favorite}`,
              value: `${tag}\n${
                emotes.emotes.PT
              } PT: ${hp}\nMiles: ${numberWithCommas(car.Miles)}\n\`ID: ${
                car.ID
              }\``,
              inline: true,
            });
          } else if (itempage == displayparts2) {
            embed.setDescription(`${displayparts2[page - 1].join("\n")}`);
          }
        }

        if (current !== page) {
          embed.setFooter({ text: `Pages ${page}/${itempage.length}` });
          if (itempage == cars) {
            embed.setFooter({ text: `Loading car image...` });
            i.update({ embeds: [embed], fetchReply: true });
            let canvas = createCanvas(426, 240);
            let ctx = canvas.getContext("2d");
            let bg = await loadImage("https://i.ibb.co/QMZ0Hch/garage.png");
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

            let defaulty = 50;
            let defaultx = 5;
            for (let ca in itempage[page - 1]) {
              console.log(ca);
              if (ca == 0) {
                defaulty = 40;
                defaultx = 5;
              }
              if (ca == 1) {
                defaulty = 40;
                defaultx = 150;
              }
              if (ca == 2) {
                defaulty = 40;
                defaultx = 300;
              }
              if (ca == 3) {
                defaulty = 125;
                defaultx = 5;
              }
              if (ca == 4) {
                defaulty = 125;
                defaultx = 150;
              }
              if (ca == 5) {
                defaulty = 125;
                defaultx = 300;
              }
              let car = itempage[page - 1][ca];
              console.log(car);

              let carimg =
                car.Image || cardb.Cars[car.Name.toLowerCase()].Image;
              let carimage = await loadImage(carimg);
              try {
                ctx.save();
                roundedImage(ctx, defaultx, defaulty, 123, 70, 20);
                ctx.stroke();
                ctx.clip();
                ctx.drawImage(carimage, defaultx, defaulty, 123, 70);
                ctx.restore();
              } catch (err) {
                console.log("error loading image");
              }
            }
            let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
              name: "profile-image.png",
            });
            setTimeout(() => {
              embed.setImage("attachment://profile-image.png");
              embed.setFooter({ text: `Pages ${page}/${itempage.length}` });
              interaction.editReply({
                embeds: [embed],
                fetchReply: true,
                files: [attachment],
              });
            }, 5000);
          } else {
            i.update({ embeds: [embed], fetchReply: true });
          }
        } else {
          return i.update({ content: "No pages left!" });
        }
      }
    });
  },
};
function roundedImage(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
