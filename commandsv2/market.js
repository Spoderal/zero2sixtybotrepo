const lodash = require("lodash");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const cardb = require("../data/cardb.json");
const Global = require("../schema/global-schema");
const { toCurrency } = require("../common/utils");
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
    )
    .addSubcommand((option) =>
      option
        .setName("delist")
        .setDescription("Delist an item from the market")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Item id to delist")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    let subcommand = interaction.options.getSubcommand();
    let global = await Global.findOne();
    let userdata = await User.findOne({ id: interaction.user.id });
    let currencies = require("../data/currencydb.json");
    let userparts = userdata.parts;
    if (subcommand == "list") {
      let item = interaction.options.getString("item");
      let price = interaction.options.getNumber("price");
      let amount = interaction.options.getString("amount") || 1;
      let useritems = userdata.items;
      if (amount < 0)
        return interaction.reply("You can't list negative items!");
      let limit = userdata.marketlimit;

      if (limit == 0)
        return interaction.reply("You already have 5 items listed!");
      let obj;

      if (price <= 0) {
        return interaction.reply("Your price needs to be above 0.");
      }
      if (price >= 1000000000) {
        return interaction.reply(
          `Your price needs to be below ${toCurrency(1000000000)}.`
        );
      }

      if (amount < 1)
        return interaction.reply("You need to list more than 1 item");

      if (cardb.Cars[item.toLowerCase()]) {
        let filteredcar = userdata.cars.filter(
          (car) =>
            car.ID.toLowerCase() == item.toLowerCase() ||
            car.Name.toLowerCase() == item.toLowerCase()
        );
        if (!filteredcar[0])
          return interaction.reply("You don't have this car!");
        let sellprice = cardb.Cars[item.toLowerCase()].Price * 0.75;
        let sellpricemax = sellprice * 10;
        if (sellprice > price)
          return interaction.reply(
            `Your price must at least be ${toCurrency(
              sellprice
            )}, this is to prevent things getting undervalued.`
          );
        if (price >= sellpricemax) {
          `Your price must at least be below ${toCurrency(
            sellpricemax
          )}, this is to prevent things getting overvalued.`;
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
        let sellprice = partdb.Parts[item.toLowerCase()].Price * 10 || 0;
        if (!userdata.parts.includes(item.toLowerCase()))
          return interaction.reply("You don't have this item!");
        let filtereduser = userparts.filter(function hasmany(part) {
          return part === item.toLowerCase();
        });
        if (amount > filtereduser.length)
          return await interaction.reply(
            "You don't have that many of that part!"
          );
        if (sellprice !== 0 && price >= sellprice) {
          `Your price must at least be below ${toCurrency(
            sellprice
          )}, this is to prevent things getting overvalued.`;
        }

        if (sellprice == 0) {
          if (price >= 1000000) {
            `Your price must at least be below ${toCurrency(
              1000000
            )}, this is to prevent things getting overvalued.`;
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

        for (var i = 0; i < amount; i++)
          userparts.splice(userparts.indexOf(item.toLowerCase()), 1);
        userdata.parts = userparts;
      } else if (itemdb[item.toLowerCase()]) {
        let filtereduser = useritems.filter(function hasmany(part) {
          return part === item.toLowerCase();
        });
        if (amount > filtereduser.length)
          return await interaction.reply(
            "You don't have that many of that part!"
          );
        obj = {
          item: itemdb[item.toLowerCase()].Name.toLowerCase(),
          price: price,
          amount: amount,
          id: global.marketId,
          user: interaction.user,
          type: "items",
        };

        let useitems = userdata.items;
        for (var i2 = 0; i2 < amount; i2++)
          useitems.splice(useitems.indexOf(item.toLowerCase()), 1);
        userdata.items = useitems;
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

      if (
        partdb.Parts[item.toLowerCase()] &&
        partdb.Parts[item.toLowerCase()].Market == false
      )
        return interaction.reply("This item isn't marketable.");

      if (
        partdb.Parts[item.toLowerCase()] &&
        partdb.Parts[item.toLowerCase()].Market == false
      )
        return interaction.reply("This item isn't marketable.");

      global.marketId += 1;
      global.newmarket.push(obj);
      userdata.marketlimit -= 1;

      global.update();
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
        let marketfiltered = global.newmarket.filter(
          (item) => item.id == findid
        );

        let carob = marketfiltered[0].carobj;
        if (!carob) return interaction.reply("This id isn't a car!");
        let speed = `${carob.Speed}`;

        let exhaust = carob.exhaust || "Stock Exhaust";
        let intake = carob.intake || "Stock Intake";
        let suspension = carob.suspension || "stock suspension";
        let tires = carob.tires || "stock tires";
        let engine = carob.engine || "stock engine";
        let clutch = carob.clutch || "stock clutch";
        let ecu = carob.ecu || "stock ecu";
        let turbo = carob.turbo || "stock turbo";
        let nitro = carob.nitro || "stock nitro";
        let intercooler = carob.intercooler || "stock intercooler";
        let gearbox = carob.gearbox || "stock gearbox";
        let brakes = carob.brakes || "stock brakes";

        let embed = new EmbedBuilder()
          .setTitle(`Stats for ${carob.Name}`)
          .setDescription(`Power: ${speed}\n0-60: ${carob.Acceleration}s`)
          .setImage(`${carob.Livery}`)
          .setColor(colors.blue)
          .addFields([
            {
              name: `Exhaust`,
              value: `${exhaust}`,
              inline: true,
            },
            {
              name: `Intake`,
              value: `${intake}`,
              inline: true,
            },
            {
              name: `Tires`,
              value: `${tires}`,
              inline: true,
            },
            {
              name: `Turbo`,
              value: `${turbo}`,
              inline: true,
            },
            {
              name: `Suspension`,
              value: `${suspension}`,
              inline: true,
            },
            {
              name: `Clutch`,
              value: `${clutch}`,
              inline: true,
            },
            {
              name: `ECU`,
              value: ` ${ecu}`,
              inline: true,
            },
            {
              name: `Engine`,
              value: `${engine}`,
              inline: true,
            },
            {
              name: `Intercooler`,
              value: `${intercooler}`,
              inline: true,
            },
            {
              name: `Gearbox`,
              value: `${gearbox}`,
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

      if (Number(itemtobuy.price) > cash)
        return interaction.reply("You can't afford this!");

      if (itemtobuy.type == "cars") {
        userdata.cars.push(itemtobuy.carobj);
      } else if (itemtobuy.type == "items") {
        for (let i = 0; i < itemtobuy.amount; i++)
          userdata.items.push(itemtobuy.item);
      } else if (itemtobuy.type == "parts") {
        for (let i = 0; i < itemtobuy.amount; i++)
          userdata.parts.push(itemtobuy.item);
      } else if (itemtobuy.type == "currencies") {
        userdata[itemtobuy.nameindb] += Number(itemtobuy.amount);
      }
      userdata.cash -= Number(itemtobuy.price);
      let udata2 = await User.findOne({ id: itemtobuy.user.id });
      console.log(itemtobuy);
      udata2.cash += Number(itemtobuy.price);
      if (udata2.marketlimit < 5) {
        udata2.marketlimit += 1;
      }
      udata2.save();
      userdata.save();
      try {
        let userfromitem = await interaction.client.users.fetch(
          itemtobuy.user.id
        );
        userfromitem.send(`Your item **${itemtobuy.item}** just sold!`);
      } catch (err) {
        console.log(err);
      }
      global.update();
      interaction.reply(`Successfully bought!`);
      global.newmarket.pull(itemtobuy);
      global.update();
      global.save();

      let submitchannel =
        interaction.client.channels.cache.get("931004191428706397");

      submitchannel.send({
        content: `${
          interaction.user.id
        } bought ${itemtobuy.item.toLowerCase()} for ${itemtobuy.price}`,
      });
    } else if (subcommand == "delist") {
      let gmarket = global.newmarket;

      if (!gmarket)
        return interaction.reply("There isn't anything listed at the moment!");

      let cash = userdata.cash;

      let idtobuy = interaction.options.getString("id");

      let itemtobuy = gmarket.filter((item) => item.id == idtobuy);

      if (!itemtobuy[0])
        return interaction.reply("Thats not an item on the market!");

      itemtobuy = itemtobuy[0];

      if (itemtobuy.user.id !== interaction.user.id)
        return interaction.reply("This isn't your item!");

      if (itemtobuy.type == "cars") {
        userdata.cars.push(itemtobuy.carobj);
      } else if (itemtobuy.type == "items") {
        for (let i = 0; i < itemtobuy.amount; i++)
          userdata.items.push(itemtobuy.item);
      } else if (itemtobuy.type == "parts") {
        for (let i = 0; i < itemtobuy.amount; i++)
          userdata.parts.push(itemtobuy.item);
      } else if (itemtobuy.type == "currencies") {
        userdata[itemtobuy.nameindb] += Number(itemtobuy.amount);
      }
      console.log(itemtobuy);

      userdata.save();

      global.update();
      interaction.reply(`Successfully delisted!`);
      global.newmarket.pull(itemtobuy);
      global.update();
      global.save();
    }
  },
};
