const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const emotes = require("../common/emotes");
const itemdb = require("../data/items.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("garage")
    .setDescription("Check your garage")
    .addUserOption((option) =>
      option
        .setName("user")
        .setRequired(false)
        .setDescription("The user to view the garage of")
    ),
  async execute(interaction) {
    let user = interaction.options.getUser("user") || interaction.user;

    let udata = await User.findOne({ id: user.id });

    let ucars = udata.cars;
    let cars = udata.cars;
    let parts = udata.parts;
    let items = udata.items;
    let garagelimit = udata.garageLimit;
    let xessence = udata.xessence;

    let displayparts = [];
    let displayitems = [];
    let page = 1;
    let displayparts2 = [];
    cars = lodash.chunk(
      cars.map((a) => a),
      6
    );
    for (let part in parts) {
      part = parts[part];
      console.log(part);
      let partindb = partdb.Parts[part.toLowerCase()];
      displayparts.push(`${partindb.Emote} ${partindb.Name}`);
    }

    var list = displayparts;
    var quantities = list.reduce(function (obj, n) {
      if (obj[n]) obj[n]++;
      else obj[n] = 1;

      return obj;
    }, {});

    for (let n in quantities) {
      displayparts2.push(`${n} x${quantities[n]}`);
    }

    displayparts2 = lodash.chunk(
      displayparts2.map((a) => a),
      10
    );

    console.log(parts);

    let itempage = cars;
    let embed = new EmbedBuilder()
      .setTitle(`Displaying cars for ${user.username}`)
      .setDescription(
        `Garage Limit: ${ucars.length}/${garagelimit}\nXessence: ${xessence}`
      )
      .setImage("https://i.ibb.co/pf4vwHC/istockphoto-521421426-612x612.jpg")
      .setColor(colors.blue)
      .setFooter({ text: `Pages ${page}/${itempage.length}` });
    if (udata.showcase) {
      embed.setThumbnail(`${udata.showcase}`);
    }
    for (let car in cars[0]) {
      car = cars[0][car];
      let favorite = "";
      if (car.Favorite == true) {
        favorite = "⭐";
      }
      embed.addFields({
        name: `${car.Emote} ${car.Name} ${favorite}`,
        value: `${emotes.emotes.speed} P: ${car.Speed}\n${emotes.emotes.zero2sixty} A: ${car.Acceleration}s\n\`ID: ${car.ID}\``,
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
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("filter")
        .setEmoji("🔍")
        .setStyle("Secondary")
        .setLabel("Filter")
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
        .setStyle("Secondary")
    );
    let msg = await interaction.reply({
      embeds: [embed],
      components: [row, row2],
      fetchReply: true,
    });

    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector2 = msg.createMessageComponentCollector({
      filter: filter2,
    });

    let filtereddcars;
    collector2.on("collect", async (i) => {
      if (i.customId == "cars") {
        itempage = cars;

        embed = new EmbedBuilder()
          .setTitle(`Displaying cars for ${user.username}`)
          .setDescription(
            `Garage Limit: ${ucars.length}/${garagelimit}\nXessence: ${xessence}`
          )
          .setImage("https://i.ibb.co/zfvBtLR/garage1img.png")
          .setColor(colors.blue)
          .setFooter({ text: `Pages ${page}/${itempage.length}` });
        for (let car in cars[0]) {
          car = cars[0][car];
          embed.addFields({
            name: `${car.Emote} ${car.Name}`,
            value: `${emotes.emotes.speed} Power: ${car.Speed}\n${emotes.emotes.zero2sixty} Acceleration: ${car.Acceleration}s\n\`ID: ${car.ID}\``,
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
          .setImage("https://i.ibb.co/zfvBtLR/garage1img.png")
          .setColor(colors.blue)
          .setFooter({ text: `Pages ${page}/${itempage.length}` });
        console.log(parts);
        if (displayparts2.length == 0)
          return i.update("You don't have any parts!");
        embed.setDescription(`${displayparts2[0].join("\n")}`);
        await i.update({
          embeds: [embed],
          components: [row, row2],
          fetchReply: true,
        });
      } else if (i.customId.includes("items")) {
        itempage = items;
        embed = new EmbedBuilder()
          .setTitle(`Displaying items for ${user.username}`)
          .setImage("https://i.ibb.co/zfvBtLR/garage1img.png")
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
          fetchReply: true,
        });
      }

      if (i.customId.includes("filter")) {
        let rowf = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("reset")
            .setLabel("All")
            .setEmoji("🚗")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("fpower200")
            .setLabel("Power > 200")
            .setEmoji("<:newspeedemote:1049569265730195466>")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("fpower250")
            .setLabel("Power > 250")
            .setEmoji("<:newspeedemote:1049569265730195466>")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("fpower300")
            .setLabel("Power > 300")
            .setEmoji("<:newspeedemote:1049569265730195466>")
            .setStyle("Secondary")
        );

        await i.update({
          embeds: [embed],
          components: [rowf],
          fetchReply: true,
        });
      } else if (i.customId.includes("fpower200")) {
        console.log("power");
        embed.data.fields = null;
        filtereddcars = udata.cars.filter((car2) => car2.Speed >= 200);
        filtereddcars = lodash.chunk(
          filtereddcars.map((a) => a),
          6
        );
        let filter = filtereddcars[0];
        itempage = filtereddcars;
        for (let car in filter) {
          car = filter[car];
          let favorite = "";
          if (car.Favorite == true) {
            favorite = "⭐";
          }
          embed.addFields({
            name: `${car.Emote} ${car.Name} ${favorite}`,
            value: `${emotes.emotes.speed} Power: ${car.Speed}\n${emotes.emotes.zero2sixty} Acceleration: ${car.Acceleration}s\n\`ID: ${car.ID}\``,
            inline: true,
          });
        }

        embed.setFooter({ text: `Pages ${page}/${itempage.length}` });

        await i.update({
          embeds: [embed],
          components: [row, row2],
          fetchReply: true,
        });
      } else if (i.customId.includes("fpower250")) {
        console.log("power");
        embed.data.fields = null;
        filtereddcars = udata.cars.filter((car2) => car2.Speed >= 250);
        filtereddcars = lodash.chunk(
          filtereddcars.map((a) => a),
          6
        );
        let filter = filtereddcars[0];
        itempage = filtereddcars;
        for (let car in filter) {
          car = filter[car];
          let favorite = "";
          if (car.Favorite == true) {
            favorite = "⭐";
          }
          embed.addFields({
            name: `${car.Emote} ${car.Name} ${favorite}`,
            value: `${emotes.emotes.speed} Power: ${car.Speed}\n${emotes.emotes.zero2sixty} Acceleration: ${car.Acceleration}s\n\`ID: ${car.ID}\``,
            inline: true,
          });
        }

        embed.setFooter({ text: `Pages ${page}/${itempage.length}` });

        await i.update({
          embeds: [embed],
          components: [row, row2],
          fetchReply: true,
        });
      } else if (i.customId.includes("fpower300")) {
        console.log("power");
        embed.data.fields = null;
        filtereddcars = udata.cars.filter((car2) => car2.Speed >= 300);
        filtereddcars = lodash.chunk(
          filtereddcars.map((a) => a),
          6
        );
        let filter = filtereddcars[0];
        itempage = filtereddcars;
        for (let car in filter) {
          car = filter[car];
          let favorite = "";
          if (car.Favorite == true) {
            favorite = "⭐";
          }
          embed.addFields({
            name: `${car.Emote} ${car.Name} ${favorite}`,
            value: `${emotes.emotes.speed} Power: ${car.Speed}\n${emotes.emotes.zero2sixty} Acceleration: ${car.Acceleration}s\n\`ID: ${car.ID}\``,
            inline: true,
          });
        }

        embed.setFooter({ text: `Pages ${page}/${itempage.length}` });

        await i.update({
          embeds: [embed],
          components: [row, row2],
          fetchReply: true,
        });
      } else if (i.customId.includes("reset")) {
        embed.data.fields = null;
        itempage = cars;

        for (let car in cars[0]) {
          car = cars[0][car];
          let favorite = "";
          if (car.Favorite == true) {
            favorite = "⭐";
          }
          embed.addFields({
            name: `${car.Emote} ${car.Name} ${favorite}`,
            value: `${emotes.emotes.speed} Power: ${car.Speed}\n${emotes.emotes.zero2sixty} Acceleration: ${car.Acceleration}s\n\`ID: ${car.ID}\``,
            inline: true,
          });
        }

        await i.update({
          embeds: [embed],
          components: [row, row2],
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
        console.log(itempage);
        console.log(displayparts2);
        for (let e in itempage[page - 1]) {
          let car = itempage[page - 1][e];
          if (itempage == cars) {
            let favorite = "";
            if (car.Favorite == true) {
              favorite = "⭐";
            }
            embed.addFields({
              name: `${car.Emote} ${car.Name} ${favorite}`,
              value: `${emotes.emotes.speed} P: ${car.Speed}\n${emotes.emotes.zero2sixty} A: ${car.Acceleration}s\n\`ID: ${car.ID}\``,
              inline: true,
            });
          } else if (itempage == filtereddcars) {
            let favorite = "";
            if (car.Favorite == true) {
              favorite = "⭐";
            }
            embed.addFields({
              name: `${car.Emote} ${car.Name}  ${favorite}`,
              value: `${emotes.emotes.speed} P: ${car.Speed}\n${emotes.emotes.zero2sixty} A: ${car.Acceleration}s\n\`ID: ${car.ID}\``,
              inline: true,
            });
          } else if (itempage == displayparts2) {
            embed.setDescription(`${displayparts2[page - 1].join("\n")}`);
          }
        }

        if (current !== page) {
          embed.setFooter({ text: `Pages ${page}/${itempage.length}` });
          await i.update({ embeds: [embed], fetchReply: true });
        } else {
          return i.update({ content: "No pages left!" });
        }
      }
    });
  },
};
