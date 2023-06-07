const { SlashCommandBuilder } = require("@discordjs/builders");
const items = require("../data/items.json");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");
let warehousedb = require("../data/warehouses.json");
let cars = require("../data/cardb.json");
let houses = require("../data/houses.json");
const { EmbedBuilder } = require("discord.js");
let parts = require("../data/partsdb.json");
const { emotes } = require("../common/emotes");
const colors = require("../common/colors");
const { toCurrency, numberWithCommas, isInt } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const carpacks = require("../data/carpacks.json");
const cardata = require("../events/shopdata");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy a car or part")

    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The car or part to buy")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount to buy")
        .setRequired(false)
        .addChoices(
          { name: "1", value: 1 },
          { name: "5", value: 5 },
          { name: "10", value: 10 }
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("gold")
        .setDescription("Purchase car with gold")
        .setRequired(false)
    ),

  // async autocomplete(interaction, client) {
  //   let global2 = await Global.findOne({});

  //   let focusedValue = interaction.options.getFocused();
  //   let choices = global2.shopitems;
  //   let filtered = choices.filter((choice) => choice.includes(focusedValue));

  //   let options;

  //   if (filtered.length > 25) {
  //     options = filtered.slice(0, 25);
  //   } else {
  //     options = filtered;
  //   }

  //   await interaction.respond(
  //     options.map((choice) => ({ name: choice, value: choice.toLowerCase() }))
  //   );
  // },
  async execute(interaction) {
    const userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    const global = await Global.findOne({});

    const amount = interaction.options.getNumber("amount");
    let goldpurchase = interaction.options.getBoolean("gold");
    const amount2 = amount || 1;
    let cash = userdata.cash;
    const gold = userdata.gold;
    const usercars = userdata.cars;
    const garagelimit = userdata.garageLimit;
    let tier = userdata.tier;
    const bought = interaction.options.getString("item").toLowerCase();

    if (!bought)
      return await interaction.reply(
        "To use this command, specify the car or part you want to buy. Example: /buy 1995 Mazda Miata"
      );

    const carsList = cars.Cars;
    const partsList = parts.Parts;
    const itemsList = items;
    let carrarray = [];
    let housearry = [];
    for (let car1 in carsList) {
      let caroj = carsList[car1];
      carrarray.push(caroj);
    }
    for (let house1 in houses) {
      let houseobj = houses[house1];
      housearry.push(houseobj);
    }

    let boughtCar =
      carrarray.filter((car) => car.alias == bought.toLowerCase()) || "NO ID";
    console.log(boughtCar);
    if (
      (boughtCar.length == 0 && !boughtCar[0]) ||
      (boughtCar == [] && !boughtCar[0])
    ) {
      boughtCar = carrarray.filter(
        (car2) => car2.Name.toLowerCase() == bought.toLowerCase()
      );
    }
    boughtCar = boughtCar[0];

    console.log(boughtCar);
    const boughtPart = partsList[bought];
    const boughtHouse = housearry.filter(
      (house) => house.id == bought.toLowerCase()
    );
    const boughtWarehouse = warehousedb[bought];

    if (carpacks[bought.toLowerCase()]) {
      let pack = carpacks[bought.toLowerCase()];
      if (gold < pack.Gold)
        return interaction.reply("You need 500 gold for this pack!");

      for (let ca in pack.cars) {
        let car = pack.cars[ca];
        let carindb = cars.Cars[car];

        let obj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: carindb.Speed,
          Acceleration: carindb["0-60"],
          Handling: carindb.Handling,
          Parts: [],
          Emote: carindb.Emote,
          Image: carindb.Image,
          Miles: 0,
          Drift: 0,
          WeightStat: carindb.Weight,
        };
        userdata.cars.push(obj);
      }

      userdata.gold -= Number(pack.Gold);

      userdata.save();
      return interaction.reply("Bought car pack!");
    }

    if (
      !boughtCar &&
      !boughtPart &&
      !boughtWarehouse &&
      !boughtHouse &&
      !itemsList[bought]
    )
      return await interaction.reply(
        "That car or part isn't available yet, suggest it in the support server! In the meantime, check how to use the command by running /buy."
      );

    if (boughtCar) {
      if (usercars?.length >= garagelimit)
        return await interaction.reply(
          "Your spaces are already filled. Sell a car or get more garage space!"
        );
      let boughtCarPrice = parseInt(boughtCar.Price);
      if (cash < boughtCarPrice)
        return await interaction.reply("You don't have enough cash!");
      let cargoldprice = Math.round(boughtCarPrice / 150);
      if (goldpurchase && cargoldprice > gold)
        return await interaction.reply("You don't have enough gold!");

      if (boughtCarPrice == 0)
        return await interaction.reply("This car is not purchasable.");

      if (usercars.find((c) => c.Name == boughtCar.Name))
        return await interaction.reply("You already own this car!");

      if (boughtCar.Blackmarket) {
        if (gold < boughtCarPrice)
          return await interaction.reply("You don't have enough gold!");

        let idtoset = boughtCar.alias;
        let carindb = boughtCar;
        let carobj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: carindb.Speed,
          Acceleration: carindb["0-60"],
          Handling: carindb.Handling,
          Parts: [],
          Emote: carindb.Emote,
          Image: carindb.Image,
          Miles: 0,
          Drift: 0,
          WeightStat: carindb.Weight,
        };
        if (boughtCar.Range) {
          carobj = {
            ID: carindb.alias,
            Name: carindb.Name,
            Speed: carindb.Speed,
            Acceleration: carindb["0-60"],
            Handling: carindb.Handling,
            Parts: [],
            Emote: carindb.Emote,
            Image: carindb.Image,
            Miles: 0,
            Drift: 0,
            Range: carindb.Range,
            MaxRange: carindb.Range,
            WeightStat: carindb.Weight,
          };
        }

        userdata.gold -= boughtCarPrice;
        userdata.cars.push(carobj);
        await userdata.save();

        let embed = new EmbedBuilder()
          .setTitle(`Bought ${boughtCar.Name}`)
          .addFields([
            { name: "Price", value: `${boughtCarPrice} ${emotes.gold}` },
            { name: `ID`, value: `${idtoset}` },
            { name: "New gold balance", value: `${gold} ${emotes.gold}` },
          ])
          .setColor(colors.blue)
          .setThumbnail(`${boughtCar.Image}`);

        await interaction.reply({ embeds: [embed] });

        return;
      } else {
        let cargoldprice = Math.round(boughtCarPrice / 150);
        if (userdata.cash < boughtCarPrice)
          return await interaction.reply("You don't have enough cash!");
        if (goldpurchase && cargoldprice > gold)
          return await interaction.reply("You don't have enough gold!");
        if (boughtCar.Rank) {
          if (userdata.bounty < boughtCarPrice)
            return await interaction.reply("You don't have enough bounty!");

          let job = userdata.work;
          if (!job) return await interaction.reply("You don't have a job!");
          if (job.name !== "Police")
            return await interaction.reply(
              "You don't work as a cop! Use `/work hire` to get a job!"
            );

          if (job.position.toLowerCase() !== boughtCar.Rank.toLowerCase())
            return await interaction.reply(
              `You need to be rank ${boughtCar.Rank} to buy this car!`
            );

          let idtoset = boughtCar.alias;
          let carobj = {
            ID: boughtCar.alias,
            Name: boughtCar.Name,
            Speed: boughtCar.Speed,
            Acceleration: boughtCar["0-60"],
            Handling: boughtCar.Handling,
            Parts: [],
            Emote: boughtCar.Emote,
            Image: boughtCar.Image,
            Miles: 0,
            Drift: 0,
            police: true,
            WeightStat: boughtCar.Weight,
          };

          if (boughtCar.Range) {
            carobj = {
              ID: boughtCar.alias,
              Name: boughtCar.Name,
              Speed: boughtCar.Speed,
              Acceleration: boughtCar["0-60"],
              Handling: boughtCar.Handling,
              Parts: [],
              Emote: boughtCar.Emote,
              Image: boughtCar.Image,
              Miles: 0,
              Drift: 0,
              Range: boughtCar.Range,
              MaxRange: boughtCar.Range,
              police: true,
              WeightStat: boughtCar.Weight,
            };
          }

          if (!goldpurchase) {
            userdata.cash -= boughtCarPrice;
          } else if (goldpurchase) {
            userdata.gold -= cargoldprice;
          }
          userdata.cars.push(carobj);
          await userdata.save();

          let embed = new EmbedBuilder()
            .setTitle(`Bought ${boughtCar.Name}`)
            .addFields([
              {
                name: "Price",
                value: `${toCurrency(
                  boughtCarPrice
                )} (${cargoldprice} if you bought it with gold)`,
              },
              { name: `ID`, value: `${idtoset}` },
              {
                name: "New cash balance",
                value: `${emotes.cash} ${toCurrency(cash)}`,
              },
              {
                name: "New gold balance",
                value: `${emotes.gold} ${toCurrency(gold)}`,
              },
            ])
            .setColor(colors.blue)
            .setThumbnail(`${boughtCar.Image}`);

          return await interaction.reply({ embeds: [embed] });
        } else {
          let sellprice = boughtCarPrice * 0.65;
          let carstock = global.stock;
          let filteredcar =
            carrarray.filter((car) => car.alias == bought.toLowerCase()) ||
            "NO ID";
          console.log(boughtCar);
          if (filteredcar.length == 0 || filteredcar == []) {
            filteredcar = carrarray.filter(
              (car2) => car2.Name.toLowerCase() == bought.toLowerCase()
            );
          }
          let carindb = filteredcar[0] || carsList[bought.toLowerCase()];
          if (cars.Tiers[carindb.Class].level > tier)
            return interaction.reply(
              `Your tier is not high enough! You need to beat the **Tier ${
                cars.Tiers[carindb.Class].level
              } Squad** to unlock this car!`
            );

          if (cash < boughtCarPrice)
            return await interaction.reply("You don't have enough cash!");

          cash -= boughtCarPrice;

          if (carindb.Stock) {
            if (carstock[carindb.Name.toLowerCase()].Stock <= 0) {
              return interaction.reply("This car is out of stock!");
            }
            carstock[carindb.Name.toLowerCase()].Stock -= 1;
            global.markModified("stock");
            global.save();
          }

          let idtoset = filteredcar[0].alias;
          let carobj = {
            ID: carindb.alias,
            Name: carindb.Name,
            Speed: carindb.Speed,
            Acceleration: carindb["0-60"],
            Handling: carindb.Handling,
            Parts: [],
            Emote: carindb.Emote,
            Image: carindb.Image,
            Miles: 0,
            Resale: sellprice,
            WeightStat: carindb.Weight,
          };
          if (boughtCar.Range) {
            carobj = {
              ID: carindb.alias,
              Name: carindb.Name,
              Speed: carindb.Speed,
              Acceleration: carindb["0-60"],
              Handling: carindb.Handling,
              Parts: [],
              Emote: carindb.Emote,
              Image: carindb.Image,
              Miles: 0,
              Resale: sellprice,
              Drift: 0,
              Range: carindb.Range,
              MaxRange: carindb.Range,
              WeightStat: carindb.Weight,
            };
          }

          if (goldpurchase == true) {
            userdata.gold -= cargoldprice;
          } else {
            userdata.cash -= boughtCarPrice;
          }
          userdata.cars.push(carobj);
          await userdata.save();

          let embed = new EmbedBuilder()
            .setTitle(`✅ Bought ${boughtCar.Name}`)
            .addFields([
              {
                name: "Price",
                value: `${emotes.cash} ${toCurrency(boughtCarPrice)}`,
                inline: true,
              },
              {
                name: `ID`,
                value: `\`${idtoset}\``,
                inline: true,
              },
            ])
            .setColor(colors.blue)
            .setImage(`${boughtCar.Image}`);

          await interaction.reply({ embeds: [embed] });
        }
      }
    } else if (boughtPart) {
      const boughtPartPrice = parseInt(boughtPart.Price);

      if (amount2 > 50)
        return await interaction.reply(
          `The max amount you can buy in one command is 50!`
        );

      if (boughtPart.Tier == "BM1") {
        if (gold < boughtPartPrice)
          return await interaction.reply("You don't have enough gold!");

        userdata.gold -= boughtPartPrice;
        userdata.parts.push(bought);
        await userdata.save();

        await interaction.reply(
          `You bought a ${boughtPart.Name} for 🪙 ${numberWithCommas(
            boughtPartPrice
          )}`
        );
      } else {
        if (boughtPartPrice == 0)
          return await interaction.reply("This part is not purchasable.");

        let newprice = boughtPartPrice * amount2;
        if (userdata.cash < newprice)
          return await interaction.reply(
            `You cant afford this! You need ${toCurrency(newprice)}`
          );

        let user1newpart = [];
        for (let i = 0; i < amount2; i++) user1newpart.push(bought);
        for (i in user1newpart) {
          userdata.parts.push(bought);
        }

        cash -= newprice;
        userdata.cash -= newprice;
        await userdata.save();

        let embed = new EmbedBuilder()
          .setTitle(`✅ Bought x${amount2} ${boughtPart.Name}`)
          .addFields([
            {
              name: `Price`,
              value: `${emotes.cash} ${toCurrency(newprice)}`,
            },
            {
              name: "New cash balance",
              value: `${emotes.cash} ${toCurrency(cash)}`,
            },
          ])
          .setColor(colors.blue);

        if (boughtPart.Image) {
          embed.setThumbnail(boughtPart.Image);
        }

        await interaction.reply({ embeds: [embed] });
      }
    } else if (boughtHouse[0]) {
      let boughtHousePrice = boughtHouse[0].Price;
      if (cash < boughtHousePrice)
        return await interaction.reply("You don't have enough cash!");
      if (userdata.prestige < boughtHouse[0].Prestige)
        return await interaction.reply(
          "Your prestige is not high enough to buy this house!"
        );

      if (boughtHousePrice == 0)
        return interaction.reply("This house isn't purchasable!");

      let houseobj = userdata.houses.filter(
        (house) => house.Name == boughtHouse[0].Name
      );
      if (houseobj[0]) return interaction.reply("You already own this house!");

      console.log(houseobj);
      userdata.garageLimit += boughtHouse[0].Space;
      userdata.houses.push(boughtHouse[0]);

      userdata.cash -= boughtHousePrice;
      await userdata.save();
      let embed = new EmbedBuilder()
        .setTitle(`Bought ${boughtHouse[0].Name}`)
        .setImage(`${boughtHouse[0].Image}`)
        .setColor(colors.blue)
        .setDescription(`Price: ${toCurrency(boughtHouse[0].Price)}`);
      await interaction.reply({ embeds: [embed] });
    } else if (boughtWarehouse) {
      let warehouses = userdata.warehouses;
      let prestige = userdata.prestige;
      let wareprice = parseInt(boughtWarehouse.Price);
      if (cash < wareprice)
        return await interaction.reply(`You cant afford this warehouse!`);
      if (prestige < 11)
        return await interaction.reply(
          `Your prestige needs to be 11 before you can buy warehouses!`
        );
      if (warehouses.includes(bought))
        return await interaction.reply(
          `You've already purchased this warehouse!`
        );

      userdata.warehouses.push(bought);
      userdata.garageLimit += boughtWarehouse.Space;
      await userdata.save();

      await interaction.reply(
        `You bought the ${boughtWarehouse.Emote} ${
          boughtWarehouse.Name
        } for ${toCurrency(boughtWarehouse.Price)}`
      );
    } else if (itemsList[bought]) {
      let itemshopweek = global.itemshop;
      let itemindb = itemsList[bought];
      if (!itemshopweek.includes(itemindb.Name))
        return interaction.reply(
          "That item isn't purchasable today! Check back tomorrow **THE SHOP REFRESHES WEEKLY**"
        );
      if (itemindb.Price == 0)
        return interaction.reply("This item isn't purchasable!");

      let pricing = parseInt(itemindb.Price) * amount2;
      if (userdata.cash < pricing)
        return await interaction.reply(
          `You cant afford this! You need ${toCurrency(pricing)}`
        );

      let user1newarr = [];

      for (let i = 0; i < amount2; i++) user1newarr.push(bought);
      for (i in user1newarr) {
        userdata.items.push(bought);
      }
      userdata.cash -= pricing;

      await userdata.save();

      await interaction.reply(
        `Purchased x${amount2} ${itemsList[bought].Emote} ${
          itemsList[bought].Name
        } for ${toCurrency(pricing)}`
      );
    } else {
      await interaction.reply(
        `Thats not a purchasable item, car, house, or part!`
      );
    }
  },
};
