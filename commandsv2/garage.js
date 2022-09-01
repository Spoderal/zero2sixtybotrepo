const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const partdb = require("../data/partsdb.json");
const itemdb = require("../data/items.json");
const colors = require("../common/colors");
const { toCurrency, blankField } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("garage")
    .setDescription("Check your garage")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("cars")
        .setDescription("View your cars")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user id to check")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("parts")
        .setDescription("View your parts")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user id to check")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("items")
        .setDescription("View your items")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user id to check")
            .setRequired(false)
        )
    ),
  async execute(interaction) {
    let subcommand = interaction.options.getSubcommand();

    const target = interaction.options.getUser("user") || interaction.user;
    let targetId = target.id;

    await User.findOne({ id: targetId });
    let userdata =
      (await User.findOne({ id: targetId })) || new User({ id: targetId });

    let cars = userdata.cars;
    if (cars == null || cars == [] || cars.length <= 0 || !cars.length)
      return await interaction.reply("You dont own any cars!");
    let parts = userdata.parts;
    let badges = userdata.badges;
    let garagelimit = userdata.garageLimit;
    var userparts = [];
    var actpart;
    let items = userdata.items;
    var actitems = [];
    var actitem;
    let actuserparts = [];
    let sum = 0;
    let xessence = userdata.xessence;
    for (
      let i = 0;
      i < items.length;
      i++ && items !== ["no items"] && items.length > 0
    ) {
      if (!items || items.length == 0 || items == ["no items"])
        return await interaction.reply(`You don't have any items!`);

      actitem = items[i];
      let emote;
      let name;
      let type;
      let price = 0;

      if (itemdb.Police[actitem.toLowerCase()]) {
        emote = itemdb.Police[actitem.toLowerCase()].Emote;
        name = itemdb.Police[actitem.toLowerCase()].Name;
        type = itemdb.Police[actitem.toLowerCase()].Type;
        price = itemdb.Police[actitem.toLowerCase()].Price;
      } else if (itemdb.Multiplier[actitem.toLowerCase()]) {
        emote = itemdb.Multiplier[actitem.toLowerCase()].Emote;
        name = itemdb.Multiplier[actitem.toLowerCase()].Name;
        type = itemdb.Multiplier[actitem.toLowerCase()].Type;
        price = itemdb.Multiplier[actitem.toLowerCase()].Price;
      } else if (itemdb.Other[actitem.toLowerCase()]) {
        emote = itemdb.Other[actitem.toLowerCase()].Emote;
        name = itemdb.Other[actitem.toLowerCase()].Name;
        type = itemdb.Other[actitem.toLowerCase()].Type;
        price = itemdb.Other[actitem.toLowerCase()].Price;
      } else if (itemdb.Collectable[actitem.toLowerCase()]) {
        emote = itemdb.Collectable[actitem.toLowerCase()].Emote;
        name = itemdb.Collectable[actitem.toLowerCase()].Name;
        type = itemdb.Collectable[actitem.toLowerCase()].Type;
        price = itemdb.Collectable[actitem.toLowerCase()].Price;
      }

      if (price) sum += Number(price);

      //Do something
      let x2 = items.filter((x) => x == `${actitem.toLowerCase()}`).length;
      let finalitem = `${emote} ${name} x${x2}\n\`${type}\``;
      if (!actitems.includes(finalitem)) {
        actitems.push(finalitem);
      }
    }

    for (let i = 0; i < parts?.length; i++ && parts !== ["no parts"]) {
      if (!parts || parts.length == 0) {
        actpart = "no parts";
      }
      actpart = parts[i];
      let price = partdb.Parts[actpart.toLowerCase()].Price;
      if (price) sum += Number(price);
      //Do something
      userparts.push(
        `${partdb.Parts[actpart.toLowerCase()].Emote} ${
          partdb.Parts[actpart.toLowerCase()].Name
        }`
      );
    }

    var list = userparts;

    var quantities = list.reduce(function (obj, n) {
      if (obj[n]) obj[n]++;
      else obj[n] = 1;

      return obj;
    }, {});

    for (let n in quantities) {
      actuserparts.push(`${n} x${quantities[n]}`);
    }

    let garageimg =
      userdata.showcase ||
      "https://t3.ftcdn.net/jpg/02/70/01/64/360_F_270016456_CJAh2KQGnBKUzJfjDTkD0vEruHX9T2tV.jpg";

    actuserparts = lodash.chunk(
      actuserparts.map((a) => `${a}\n`),
      10
    );

    if (subcommand == "parts") {
      let embed1 = new EmbedBuilder()
        .setTitle(`${target.username}'s parts`)
        .setThumbnail("https://i.ibb.co/DCNwJrs/Logo-Makr-0i1c-Uy.png")
        .setDescription(
          `${xessence} Xessence\n
          ${actuserparts[0]?.join("\n") || "0 Parts"}`
        )
        .addFields([blankField])
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
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("filter")
          .setEmoji("🔍")
          .setLabel("Filter")
          .setStyle("Secondary")
      );
      let row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("t1")
          .setLabel("T1")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("t2")
          .setLabel("T2")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("t3")
          .setLabel("T3")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("t4")
          .setLabel("T4")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("t5")
          .setLabel("T5")
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
        if (i.customId.includes("filter")) {
          row.components[4].setDisabled(true);
          await msg.edit({ components: [row, row2] });
        }
        let current = page;
        if (i.customId.includes("t1")) {
          // eslint-disable-next-line no-undef
          for (part in parts) {
            const filterItems = (arr, query) => {
              return arr.filter((el) => el.indexOf(query.toLowerCase()) !== -1);
            };
            actuserparts = filterItems(parts, "t1");
            if (!actuserparts || actuserparts.length == 0)
              return i.update(`No T1 parts available`);
          }
          actuserparts = lodash.chunk(
            actuserparts.map((a) => `${a}`),
            10
          );
          let newuserparts = [];
          // for (let p in actuserparts) {
          //   let part2 = actuserparts[0][p];
          // }
          // Caused ESLint Errors and was not in use. Leaving code here incase it's needed later on however will leave commented out for now.
          // Feel free to remove if unneeded.
          var list = actuserparts[0];

          var quantities = list.reduce(function (obj, n) {
            if (obj[n]) obj[n]++;
            else obj[n] = 1;

            return obj;
          }, {});

          for (let n in quantities) {
            newuserparts.push(
              `${partdb.Parts[n.toLowerCase()].Emote} ${
                partdb.Parts[n].Name
              } x${quantities[n]}`
            );
          }
          newuserparts = lodash.chunk(
            newuserparts.map((a) => `${a}\n`),
            10
          );

          embed1.setDescription(
            `${xessence} Xessence\n\n${newuserparts[page - 1].join("\n")}`
          );

          i.update({ embeds: [embed1] });

          return;
        } else if (i.customId.includes("t2")) {
          // eslint-disable-next-line no-undef
          for (part in parts) {
            const filterItems = (arr, query) => {
              return arr.filter((el) => el.indexOf(query.toLowerCase()) !== -1);
            };
            actuserparts = filterItems(parts, "t2");
            if (!actuserparts || actuserparts.length == 0)
              return i.update(`No T2 parts available`);
          }
          actuserparts = lodash.chunk(
            actuserparts.map((a) => `${a}`),
            10
          );
          let newuserparts = [];
          // for (let p in actuserparts) {
          //   let part2 = actuserparts[0][p];
          // }
          // Caused ESLint Errors and was not in use. Leaving code here incase it's needed later on however will leave commented out for now.
          // Feel free to remove if unneeded.
          list = actuserparts[0];

          quantities = list.reduce(function (obj, n) {
            if (obj[n]) obj[n]++;
            else obj[n] = 1;

            return obj;
          }, {});

          for (let n in quantities) {
            newuserparts.push(
              `${partdb.Parts[n.toLowerCase()].Emote} ${
                partdb.Parts[n].Name
              } x${quantities[n]}`
            );
          }
          newuserparts = lodash.chunk(
            newuserparts.map((a) => `${a}\n`),
            10
          );

          embed1.setDescription(
            `${xessence} Xessence\n\n${newuserparts[page - 1].join("\n")}`
          );

          i.update({ embeds: [embed1] });

          return;
        } else if (i.customId.includes("t3")) {
          // eslint-disable-next-line no-undef
          for (part in parts) {
            const filterItems = (arr, query) => {
              return arr.filter((el) => el.indexOf(query.toLowerCase()) !== -1);
            };
            actuserparts = filterItems(parts, "t3");
            if (!actuserparts || actuserparts.length == 0)
              return i.update(`No T3 parts available`);
          }
          actuserparts = lodash.chunk(
            actuserparts.map((a) => `${a}`),
            10
          );
          let newuserparts = [];
          // for (let p in actuserparts) {
          //   let part2 = actuserparts[0][p];
          // }
          // Caused ESLint Errors and was not in use. Leaving code here incase it's needed later on however will leave commented out for now.
          // Feel free to remove if unneeded.
          list = actuserparts[0];

          quantities = list.reduce(function (obj, n) {
            if (obj[n]) obj[n]++;
            else obj[n] = 1;

            return obj;
          }, {});

          for (let n in quantities) {
            newuserparts.push(
              `${partdb.Parts[n.toLowerCase()].Emote} ${
                partdb.Parts[n].Name
              } x${quantities[n]}`
            );
          }
          newuserparts = lodash.chunk(
            newuserparts.map((a) => `${a}\n`),
            10
          );

          embed1.setDescription(
            `${xessence} Xessence\n\n${newuserparts[page - 1].join("\n")}`
          );

          i.update({ embeds: [embed1] });

          return;
        } else if (i.customId.includes("t4")) {
          // eslint-disable-next-line no-undef
          for (part in parts) {
            const filterItems = (arr, query) => {
              return arr.filter((el) => el.indexOf(query.toLowerCase()) !== -1);
            };
            actuserparts = filterItems(parts, "t4");

            if (!actuserparts || actuserparts.length == 0)
              return i.update(`No T4 parts available`);
          }
          actuserparts = lodash.chunk(
            actuserparts.map((a) => `${a}`),
            10
          );
          let newuserparts = [];
          // for (let p in actuserparts) {
          //   let part2 = actuserparts[0][p];
          // }
          // Caused ESLint Errors and was not in use. Leaving code here incase it's needed later on however will leave commented out for now.
          // Feel free to remove if unneeded.
          list = actuserparts[0];

          quantities = list.reduce(function (obj, n) {
            if (obj[n]) obj[n]++;
            else obj[n] = 1;

            return obj;
          }, {});

          for (let n in quantities) {
            newuserparts.push(
              `${partdb.Parts[n.toLowerCase()].Emote} ${
                partdb.Parts[n].Name
              } x${quantities[n]}`
            );
          }
          newuserparts = lodash.chunk(
            newuserparts.map((a) => `${a}\n`),
            10
          );

          embed1.setDescription(
            `${xessence} Xessence\n\n${newuserparts[page - 1].join("\n")}`
          );

          i.update({ embeds: [embed1] });

          return;
        } else if (i.customId.includes("t5")) {
          // eslint-disable-next-line no-undef
          for (part in parts) {
            const filterItems = (arr, query) => {
              return arr.filter((el) => el.indexOf(query.toLowerCase()) !== -1);
            };
            actuserparts = filterItems(parts, "t5");
            if (!actuserparts || actuserparts.length == 0)
              return i.update(`No T5 parts available`);
          }
          actuserparts = lodash.chunk(
            actuserparts.map((a) => `${a}`),
            10
          );
          // let newuserparts = [];
          // for (let p in actuserparts) {
          //   let part2 = actuserparts[0][p];
          // }
          // Caused ESLint Errors and was not in use. Leaving code here incase it's needed later on however will leave commented out for now.
          // Feel free to remove if unneeded.
          list = actuserparts[0];

          quantities = list.reduce(function (obj, n) {
            if (obj[n]) obj[n]++;
            else obj[n] = 1;

            return obj;
          }, {});

          for (let n in quantities) {
            newuserparts.push(
              `${partdb.Parts[n.toLowerCase()].Emote} ${
                partdb.Parts[n].Name
              } x${quantities[n]}`
            );
          }
          newuserparts = lodash.chunk(
            newuserparts.map((a) => `${a}\n`),
            10
          );

          embed1.setDescription(
            `${xessence} Xessence\n\n${newuserparts[page - 1].join("\n")}`
          );

          i.update({ embeds: [embed1] });

          return;
        } else if (i.customId.includes("previous") && page !== 1) page--;
        else if (i.customId.includes("next") && page !== actuserparts.length)
          page++;
        else if (i.customId.includes("first")) page = 1;
        else if (i.customId.includes("last")) page = actuserparts.length;

        embed1.setDescription(
          `${xessence} Xessence\n\n${actuserparts[page - 1].join("\n")}`
        );

        if (current !== page) {
          embed1.setFooter({ text: `Pages ${page}/${actuserparts.length}` });
          i.update({ embeds: [embed1] });
        }
        if (current == page) {
          i.update({ content: `No pages left!` });
        }
      });

      //   let filter2 = (btnInt) => {
      //     return interaction.user.id === btnInt.user.id
      // }

      // const collector2 = emb.createMessageComponentCollector({
      //     filter: filter2
      // })

      // collector2.on('collect', async (i, user) => {

      //   if(i.customId.includes("filter")){
      //     let filtrow = new ActionRowBuilder()
      //     .addComponents(
      //       new ButtonBuilder()
      //       .setLabel("T1")
      //       .setCustomId("t1")
      //       .setStyle("Success"),
      //       new ButtonBuilder()
      //       .setLabel("T2")
      //       .setCustomId("t2")
      //       .setStyle("Success"),
      //       new ButtonBuilder()
      //       .setLabel("T3")
      //       .setCustomId("t3")
      //       .setStyle("Success"),
      //       new ButtonBuilder()
      //       .setLabel("T4")
      //       .setCustomId("t4")
      //       .setStyle("Success"),
      //       new ButtonBuilder()
      //       .setLabel("T5")
      //       .setCustomId("t5")
      //       .setStyle("Success")
      //     )

      //     i.update({components: [row, filtrow]})

      //     let filter3 = (btnInt) => {
      //       return interaction.user.id === btnInt.user.id
      //   }

      //   const collector3 = emb.createMessageComponentCollector({
      //       filter: filter3
      //   })

      //   collector3.on("collect", async (i, user) => {
      //     if(i.customId.includes("t1") || i.customId.includes("t2") || i.customId.includes("t3") || i.customId.includes("t4") || i.customId.includes("t5")){
      //       var flist = userparts;

      //       var quantities = flist.reduce(function(obj, n) {
      //         if (obj[n]) obj[n]++;
      //         else        obj[n] = 1;

      //         return obj;
      //       }, {});

      //       for (let n in quantities) {
      //         if(n.startsWith(`T2`)){
      //           actuserparts.push(`${n} x${quantities[n]}`)

      //         }

      //       }

      //     }
      //   })

      //   }

      // })
    } else if (subcommand == "items") {
      if (!items || items.length == 0)
        return interaction.channel.send(`You don't have any items!`);
      actitems = lodash.chunk(
        actitems.map((a) => `${a}\n`),
        10
      ) || ["No Items"];

      if (actitems == [""] || actitems.length == 0 || !actitems.length) {
        actitems = ["No Items"];
      }

      let embed1 = new EmbedBuilder()
        .setTitle(`${target.username}'s items`)
        .setThumbnail("https://i.ibb.co/DCNwJrs/Logo-Makr-0i1c-Uy.png")
        .setDescription(`${actitems[0].join("\n")}`)
        .addFields([blankField])
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
        else if (i.customId.includes("next") && page !== actitems.length)
          page++;
        else if (i.customId.includes("first")) page = 1;
        else if (i.customId.includes("last")) page = actitems.length;

        embed1.setDescription(`\n${actitems[page - 1].join("\n")}`);

        if (current !== page) {
          embed1.setFooter({ text: `Pages ${page}/${actitems.length}` });
          i.update({ embeds: [embed1] });
        } else {
          return i.update({ content: "No pages left!" });
        }
      });
    } else {
      let usercars = userdata.cars;
      let displaycars = [];
      for (let i in usercars) {
        let car = usercars[i];
        let price = usercars[i].Resale;
        if (price) sum += Number(price);
        displaycars.push(`${car.Emote} ${car.Name} \`${car.ID}\``);
      }
      displaycars = lodash.chunk(
        displaycars.map((a) => `${a}\n`),
        10
      ) || ["No Cars"];

      let yacht = userdata.yacht;
      if (yacht) {
        displaycars[0].push(`🚢 Yacht`);
        sum += 1000000000;
      }

      let embed1 = new EmbedBuilder()
        .setTitle(`${target.username}'s cars`)
        .setDescription(
          `${displaycars[0].join("\n")}\n
          Garage Value: ${toCurrency(sum)}\n
          Garage Limit: ${cars.length}/${garagelimit}`
        )
        .setThumbnail("https://i.ibb.co/DCNwJrs/Logo-Makr-0i1c-Uy.png")
        .setImage(garageimg);

      embed1
        .setFooter({ text: `Page 1/${displaycars.length}` })
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
        else if (i.customId.includes("next") && page !== displaycars.length)
          page++;
        else if (i.customId.includes("first")) page = 1;
        else if (i.customId.includes("last")) page = displaycars.length;

        embed1.setDescription(
          `${displaycars[page - 1].join("\n")}\n\nGarage Value: ${toCurrency(
            sum
          )}\n\nGarage Limit: ${cars.length}/${garagelimit}`
        );

        if (current !== page) {
          embed1.setFooter({ text: `Page ${page}/${displaycars.length}` });
          i.update({ embeds: [embed1] });
        } else {
          return i.update({ content: "No pages left!" });
        }
      });
    }
    if (sum >= 50000000 && !badges.includes("carrich")) {
      badges.push(`badges_${targetId}`, "carrich");
      userdata.save();
      interaction.channel.send(
        `${target}, You just earned the "Car Rich" badge for having a total garage value of $50M!`
      );
    }
  },
};
