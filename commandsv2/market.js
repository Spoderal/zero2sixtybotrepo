const lodash = require("lodash");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const cardb = require("../data/cardb.json");
const Global = require("../schema/global-schema");
const { toCurrency, convertMPHtoKPH } = require("../common/utils");
const partdb = require("../data/partsdb.json");
const itemdb = require("../data/items.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("market")
    .setDescription("View or buy things from the global market")
    .addSubcommand((option) =>
      option
        .setName("view")
        .setDescription("View the market")
        .addStringOption((option) =>
          option
            .setName("filter")
            .setDescription("Filter items by cars, items, or parts")
            .addChoices(
              { name: "Cars", value: "cars" },
              { name: "Parts", value: "parts" },
              { name: "Items", value: "items" },
              { name: "Currency", value: "currency" }
            )
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("View more details on an item by ID")
            .setRequired(false)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("buy")
        .setDescription("Buy something from the market")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Buy an item by ID")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("list")
        .setDescription("List on the market")
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription("Item to list on the market")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("price")
            .setDescription("Price to set for the item")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("amount")
            .setDescription("Amount of the item")
            .setRequired(false)
        )
    ),
  async execute(interaction) {
    let subcommand = interaction.options.getSubcommand();
    let global = await Global.findOne();
    let userdata = await User.findOne({ id: interaction.user.id });
    let currencies = require("../data/currencydb.json");
    if (subcommand == "list") {
      let item = interaction.options.getString("item");
      let price = interaction.options.getNumber("price");
      let amount = interaction.options.getString("amount") || 1;
      let obj;
      let maxprice = 

      if(price <= 0){
        return interaction.reply("Your price needs to be above 0.")
      }
      if(price >= 1000000000){
        return interaction.reply(`Your price needs to be below ${toCurrency(1000000000)}.`)
      }



      if (cardb.Cars[item.toLowerCase()]) {
        let filteredcar = userdata.cars.filter(
          (car) =>
            car.ID.toLowerCase() == item.toLowerCase() ||
            car.Name.toLowerCase() == item.toLowerCase()
        );
        if (!filteredcar[0])
          return interaction.reply("You don't have this car!");
        let sellprice = cardb.Cars[item.toLowerCase()].Price * 0.65;
        let sellpricemax = sellprice * 10
        if (sellprice > price)
          return interaction.reply(
            `Your price must at least be ${toCurrency(
              sellprice
            )}, this is to prevent things getting undervalued.`
          );
          if(price >= sellpricemax){
            `Your price must at least be below ${toCurrency(
              sellpricemax
            )}, this is to prevent things getting overvalued.`
          }
        obj = {
          item: cardb.Cars[item.toLowerCase()].Name.toLowerCase(),
          price: price,
          amount: amount,
          id: global.marketId,
          user: interaction.user,
          carobj: filteredcar[0],
          type: "cars",
        };
        userdata.cars.pull(filteredcar[0]);
      } else if (partdb.Parts[item.toLowerCase()]) {
        let sellprice = partdb.Parts[item.toLowerCase()].Price * 10 || 0

        if(sellprice !== 0 && price >= sellprice ){
          `Your price must at least be below ${toCurrency(
            sellpricemax
          )}, this is to prevent things getting overvalued.`
        }

        if(sellprice == 0){
          if(price >= 1000000 ){
            `Your price must at least be below ${toCurrency(
              1000000
            )}, this is to prevent things getting overvalued.`
          }
        }
        obj = {
          item: partdb.Parts[item.toLowerCase()].Name.toLowerCase(),
          price: price,
          amount: amount,
          id: global.marketId,
          user: interaction.user,
          type: "parts",
        };

        userdata.parts.pull(item, amount);
      } else if (itemdb.Other[item.toLowerCase()]) {
        obj = {
          item: itemdb.Other[item.toLowerCase()].Name.toLowerCase(),
          price: price,
          amount: amount,
          id: global.marketId,
          user: interaction.user,
          type: "items",
        };

        userdata.items.pull(item, amount);
      } else if (currencies[item.toLowerCase()]) {
        obj = {
          item: currencies[item.toLowerCase()].Name.toLowerCase(),
          price: price,
          amount: amount,
          id: global.marketId,
          user: interaction.user,
          type: "currencies",
          nameindb: currencies[item.toLowerCase()].nameindb,
        };
        let currency = currencies[item.toLowerCase()].nameindb;

        userdata[currency] -= amount;
      } else
        return interaction.reply(
          `Error! The item you're trying to list either doesn't exist or is not marketable.`
        );

      global.marketId += 1;
      global.newmarket.push(obj);

      global.save();
      userdata.save();

      let embed = new EmbedBuilder()
        .setTitle("Listed!")
        .setColor(colors.blue)
        .setDescription(`${obj.item}\nYou'll be notified if this item sells!`);

      interaction.reply({ embeds: [embed] });
    } else if (subcommand == "view") {
      if (interaction.options.getString("id")) {
        let findid = interaction.options.getString("id");
        let marketfiltered = global.newmarket.filter((item) => item.id == findid);

        let carob = marketfiltered[0].carobj;
        if (!carob) return interaction.reply("This id isn't a car!");
        let speed = `${carob.Speed}`;

        let exhaust = carob.Exhaust || "Stock Exhaust";
        let intake = carob.Intake || "Stock Intake";
        let suspension = carob.Suspension || "Stock Suspension";
        let tires = carob.Tires || "Stock Tires";
        let engine = carob.Engine || "Stock Engine";
        let clutch = carob.Clutch || "Stock Clutch";
        let ecu = carob.ECU || "Stock ECU";
        let turbo = carob.Turbo || "Stock Turbo";
        let nitro = carob.Nitro || "Stock Nitro";
        let intercooler = carob.Intercooler || "Stock Intercooler";
        let gearbox = carob.Gearbox || "Stock Gearbox";
        let brakes = carob.Brakes || "Stock Brakes";
        let exhaustemote = partdb.Parts[exhaust.toLowerCase()]?.Emote || "🔵";
        let intakeemote = partdb.Parts[intake.toLowerCase()]?.Emote || "🔵";
        let suspensionemote =
          partdb.Parts[suspension.toLowerCase()]?.Emote || "🔵";
        let tiresemote = partdb.Parts[tires.toLowerCase()]?.Emote || "🔵";
        let clutchemote = partdb.Parts[clutch.toLowerCase()]?.Emote || "🔵";
        let ecuemote = partdb.Parts[ecu.toLowerCase()]?.Emote || "🔵";
        let engineemote = partdb.Parts[engine.toLowerCase()]?.Emote || "🔵";
        let turboemote = partdb.Parts[turbo.toLowerCase()]?.Emote || "🔵";
        let nitroemote = partdb.Parts[nitro.toLowerCase()]?.Emote || "🔵";
        let intercooleremote =
          partdb.Parts[intercooler.toLowerCase()]?.Emote || "🔵";
        let gearboxemote = partdb.Parts[gearbox.toLowerCase()]?.Emote || "🔵";
        let brakesemote = partdb.Parts[brakes.toLowerCase()]?.Emote || "🔵";
        let embed = new EmbedBuilder()
          .setTitle(`Stats for ${carob.Name}`)
          .setDescription(`Power: ${speed}\n0-60: ${carob.Acceleration}s`)
          .setImage(`${carob.Livery}`)
          .setColor(colors.blue)
          .addFields([
            {
              name: `Exhaust`,
              value: `${exhaustemote} ${exhaust.split(" ")[0]}`,
              inline: true,
            },
            {
              name: `Intake`,
              value: `${intakeemote} ${intake.split(" ")[0]}`,
              inline: true,
            },
            {
              name: `Tires`,
              value: `${tiresemote} ${tires.split(" ")[0]}`,
              inline: true,
            },
            {
              name: `Turbo`,
              value: `${turboemote} ${turbo.split(" ")[0]}`,
              inline: true,
            },
            {
              name: `Suspension`,
              value: `${suspensionemote} ${suspension.split(" ")[0]}`,
              inline: true,
            },
            {
              name: `Clutch`,
              value: `${clutchemote} ${clutch.split(" ")[0]}`,
              inline: true,
            },
            {
              name: `ECU`,
              value: `${ecuemote} ${ecu.split(" ")[0]}`,
              inline: true,
            },
            {
              name: `Engine`,
              value: `${engineemote} ${engine.split(" ")[0]}`,
              inline: true,
            },
            {
              name: `Nitro`,
              value: `${nitroemote} ${nitro.split(" ")[0]}`,
              inline: true,
            },
            {
              name: `Intercooler`,
              value: `${intercooleremote} ${intercooler.split(" ")[0]}`,
              inline: true,
            },
            {
              name: `Gearbox`,
              value: `${gearboxemote} ${gearbox.split(" ")[0]}`,
              inline: true,
            },
            {
              name: `Brakes`,
              value: `${brakesemote} ${brakes.split(" ")[0]}`,
              inline: true,
            },
          ]);

        interaction.reply({ embeds: [embed] });
      } else {
        let filt = interaction.options.getString("filter");
        let market;
        if (filt) {
          market = global.newmarket.filter((item) => item.type == filt);
        } else {
          market = global.newmarket;
        }

        let marketdisplay = [];
        for (let m in market) {
          let listing = market[m];

          if (cardb.Cars[listing.item]) {
            marketdisplay.push(
              `\`ID ${listing.id}\`: ${cardb.Cars[listing.item].Emote} ${
                cardb.Cars[listing.item].Name
              } - ${toCurrency(listing.price)}`
            );
          } else if (partdb.Parts[listing.item.toLowerCase()]) {
            marketdisplay.push(
              `\`ID ${listing.id}\`: ${
                partdb.Parts[listing.item.toLowerCase()].Emote
              } ${partdb.Parts[listing.item.toLowerCase()].Name} - ${toCurrency(
                listing.price
              )} **x${listing.amount}**`
            );
          } else if (itemdb.Other[listing.item.toLowerCase()]) {
            marketdisplay.push(
              `\`ID ${listing.id}\`: ${
                itemdb.Other[listing.item.toLowerCase()].Emote
              } ${itemdb.Other[listing.item.toLowerCase()].Name} - ${toCurrency(
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
        let embed1 = new EmbedBuilder()
          .setTitle(`User Market`)
          .setDescription(`${marketdisplay[0].join("\n")}`);

        embed1
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
          else if (i.customId.includes("next") && page !== marketdisplay.length)
            page++;
          else if (i.customId.includes("first")) page = 1;
          else if (i.customId.includes("last")) page = marketdisplay.length;

          embed1.setDescription(`${marketdisplay[page - 1].join("\n")}`);

          if (current !== page) {
            embed1.setFooter({ text: `Page ${page}/${marketdisplay.length}` });
            i.update({ embeds: [embed1] });
          } else {
            return i.update({ content: "No pages left!" });
          }
        });
      }
    } else if (subcommand == "buy") {
      let gmarket = global.newmarket;

      if (!gmarket)
        return interaction.reply("There isn't anything listed at the moment!");

      let cash = userdata.cash;

      let idtobuy = interaction.options.getString("id");

      let itemtobuy = gmarket.filter((item) => item.id == idtobuy);

      if (!itemtobuy[0])
        return interaction.reply("Thats not an item on the market!");

      itemtobuy = itemtobuy[0];

      if (parseInt(itemtobuy.price) > cash)
        return interaction.reply("You can't afford this!");

      if (itemtobuy.type == "cars") {
        userdata.cars.push(itemtobuy.carobj);
      } else if (itemtobuy.type == "items") {
        userdata.items.push(itemtobuy.item);
      } else if (itemtobuy.type == "parts") {
        userdata.parts.push(itemtobuy.item);
      } else if (itemtobuy.type == "currencies") {
        userdata[itemtobuy.nameindb] += parseInt(itemtobuy.amount);
      }
      userdata.cash -= parseInt(itemtobuy.price);
      let udata2 = await User.findOne({ id: itemtobuy.user.id });
      udata2.cash += parseInt(itemtobuy.price);
      udata2.save()
      userdata.save();
      try {
        let userfromitem = await interaction.client.users.fetch(
          itemtobuy.user.id
        );
        userfromitem.send(`Your item **${itemtobuy.item}** just sold!`);
      } catch (err) {
        console.log(err);
      }
      interaction.reply(`Successfully bought!`);
      global.newmarket.pull(itemtobuy);
      global.save();
    }
  },
};


