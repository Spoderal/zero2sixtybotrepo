const { SlashCommandBuilder } = require("@discordjs/builders");
const items = require("../items.json");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");

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
    ),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    let global = await Global.findOne({});

    let amount = interaction.options.getNumber("amount");
    let amount2 = amount || 1;
    let warehousedb = require("../warehouses.json");
    let cars = require("../cardb.json");
    let houses = require("../houses.json");

    const { MessageEmbed } = require("discord.js");
    let parts = require("../partsdb.json");
    let list = cars.Cars;
    let list2 = parts.Parts;
    let list3 = items;
    let cashemote = "<:zecash:983966383408832533>";
    let bought = interaction.options.getString("item").toLowerCase();
    let cash = userdata.cash;
    let gold = userdata.gold;
    let usercars = userdata.cars;
    let garagelimit = userdata.garageLimit;

    if (
      !list[bought] &&
      !list2[bought] &&
      !list3.Other[bought] &&
      !list3.Police[bought] &&
      !list3.Multiplier[bought] &&
      !warehousedb[bought.toLowerCase()]
    )
      return interaction.reply(
        "That car or part isn't available yet, suggest it in the support server! In the meantime, check how to use the command by running /buy."
      );
    if (!bought)
      return interaction.reply(
        "To use this command, specify the car or part you want to buy. Example: /buy 1995 Mazda Miata"
      );
    if (list[bought]) {
      if (usercars.length >= garagelimit)
        return interaction.reply(
          "Your spaces are already filled. Sell a car or get more garage space!"
        );

      if (cars.Cars[bought].Price == 0)
        return interaction.reply("This car is not purchasable.");
      if (usercars.includes(cars.Cars[bought].Name.toLowerCase()))
        return interaction.reply("You already own this car!");
      let carprice = cars.Cars[bought].Price;

      if (cars.Cars[bought].Blackmarket) {
        if (gold < carprice)
          return interaction.reply("You don't have enough gold!");

        userdata.gold -= carprice;
        let carobj;
        let idtoset = cars.Cars[bought.toLowerCase()].alias;
        let carindb = cars.Cars[bought.toLowerCase()];
        if (cars.Cars[bought.toLowerCase()].Range) {
          carobj = {
            ID: carindb.alias,
            Name: carindb.Name,
            Speed: carindb.Speed,
            Acceleration: carindb["0-60"],
            Handling: carindb.Handling,
            Parts: [],
            Emote: carindb.Emote,
            Livery: carindb.Image,
            Range: carindb.Range,
            MaxRange: carindb.Range,
            Miles: 0,
          };
        } else {
          carobj = {
            ID: carindb.alias,
            Name: carindb.Name,
            Speed: carindb.Speed,
            Acceleration: carindb["0-60"],
            Handling: carindb.Handling,
            Parts: [],
            Emote: carindb.Emote,
            Livery: carindb.Image,
            Miles: 0,
          };
        }
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $push: {
              cars: carobj,
            },
          }
        );

        let embed = new MessageEmbed()
          .setTitle(`Bought ${cars.Cars[bought].Name}`)
          .addField("Price", `${carprice} <:z_gold:933929482518167552>`)
          .addField(`ID`, `${idtoset}`)
          .addField("New gold balance", `${gold} <:z_gold:933929482518167552>`)
          .setColor("#60b0f4")
          .setThumbnail(`${cars.Cars[bought].Image}`);
        interaction.reply({ embeds: [embed] });
        return;
      } else {
        if (cash < carprice)
          return interaction.reply("You don't have enough cash!");

        if (cars.Cars[bought].Police) {
          if (cash < cars.Cars[bought].Price)
            return interaction.reply("You don't have enough cash!");

          let job = userdata.job;
          if (!job) return interaction.reply("You don't have a job!");
          if (job.Job !== "police")
            return interaction.reply(
              "You don't work as a cop! Use `/work hire` to get a job!"
            );

          let num = job.Number;

          if (num < cars.Cars[bought].Police)
            return interaction.reply(
              `You need the rank "${cars.Cars[bought].Rank}" to buy this car!`
            );
          let carobj;
          let idtoset = cars.Cars[bought.toLowerCase()].alias;
          let carindb = cars.Cars[bought.toLowerCase()];
          userdata.cash -= cars.Cars[bought].Price;
          if (cars.Cars[bought.toLowerCase()].Range) {
            carobj = {
              ID: carindb.alias,
              Name: carindb.Name,
              Speed: carindb.Speed,
              Acceleration: carindb["0-60"],
              Handling: carindb.Handling,
              Parts: [],
              Emote: carindb.Emote,
              Livery: carindb.Image,
              Range: carindb.Range,
              MaxRange: carindb.Range,
              Miles: 0,
            };
          } else {
            carobj = {
              ID: carindb.alias,
              Name: carindb.Name,
              Speed: carindb.Speed,
              Acceleration: carindb["0-60"],
              Handling: carindb.Handling,
              Parts: [],
              Emote: carindb.Emote,
              Livery: carindb.Image,
              Miles: 0,
            };
          }
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $push: {
                cars: carobj,
              },
            }
          );
          let embed = new MessageEmbed()
            .setTitle(`Bought ${cars.Cars[bought].Name}`)
            .addField("Price", `$${numberWithCommas(cars.Cars[bought].Price)}`)
            .addField(`ID`, `${idtoset}`)
            .addField("New cash balance", `$${numberWithCommas(cash)}`)
            .setColor("#60b0f4")
            .setThumbnail(`${cars.Cars[bought].Image}`);
          return interaction.reply({ embeds: [embed] });
        }
        let sellprice = cars.Cars[bought].Price * 0.65;
        console.log(sellprice);
        let discountcar = "0";
        if (discountcar !== "0") {
          let disccarprice =
            cars.Cars[bought].Price -
            cars.Cars[bought].Price * parseFloat(discountcar);
          let carobj;
          if (cash < disccarprice)
            return interaction.reply(`You can't afford this car!`);
          cash -= disccarprice;
          let idtoset = cars.Cars[bought.toLowerCase()].alias;
          let carindb = cars.Cars[bought.toLowerCase()];
          if (cars.Cars[bought.toLowerCase()].Range) {
            carobj = {
              ID: carindb.alias,
              Name: carindb.Name,
              Speed: carindb.Speed,
              Acceleration: carindb["0-60"],
              Handling: carindb.Handling,
              Parts: [],
              Emote: carindb.Emote,
              Livery: carindb.Image,
              Range: carindb.Range,
              MaxRange: carindb.Range,
              Miles: 0,
              Resale: sellprice,
            };
          } else {
            carobj = {
              ID: carindb.alias,
              Name: carindb.Name,
              Speed: carindb.Speed,
              Acceleration: carindb["0-60"],
              Handling: carindb.Handling,
              Parts: [],
              Emote: carindb.Emote,
              Livery: carindb.Image,
              Miles: 0,
              Resale: sellprice,
            };
          }
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $push: {
                cars: carobj,
              },
            }
          );
          let embed = new MessageEmbed()
            .setTitle(`Bought ${cars.Cars[bought].Name}`)
            .addField(
              "Price",
              `$${numberWithCommas(disccarprice)} with discount`
            )
            .addField("New cash balance", `$${numberWithCommas(cash)}`)
            .addField(`ID`, `${idtoset}`)
            .setColor("#60b0f4")
            .setThumbnail(`${cars.Cars[bought].Image}`);
          interaction.reply({ embeds: [embed] });
        } else {
          let sellprice = cars.Cars[bought].Price * 0.65;

          if (cash < carprice)
            return interaction.reply("You don't have enough cash!");
          let carobj;
          cash -= carprice;

          let idtoset = cars.Cars[bought.toLowerCase()].alias;
          let carindb = cars.Cars[bought.toLowerCase()];
          if (cars.Cars[bought.toLowerCase()].Range) {
            carobj = {
              ID: carindb.alias,
              Name: carindb.Name,
              Speed: carindb.Speed,
              Acceleration: carindb["0-60"],
              Handling: carindb.Handling,
              Parts: [],
              Emote: carindb.Emote,
              Livery: carindb.Image,
              Range: carindb.Range,
              MaxRange: carindb.Range,
              Miles: 0,
              Resale: sellprice,
            };
          } else {
            carobj = {
              ID: carindb.alias,
              Name: carindb.Name,
              Speed: carindb.Speed,
              Acceleration: carindb["0-60"],
              Handling: carindb.Handling,
              Parts: [],
              Emote: carindb.Emote,
              Livery: carindb.Image,
              Miles: 0,
              Resale: sellprice,
            };
          }
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $push: {
                cars: carobj,
              },
            }
          );

          userdata.save();

          let embed = new MessageEmbed()
            .setTitle(`✅ Bought ${cars.Cars[bought].Name}`)
            .addField(
              "Price",
              `${cashemote} $${numberWithCommas(carprice)}`,
              true
            )
            .addField(`ID`, `\`${idtoset}\``, true)
            .addField(
              "New cash balance",
              `${cashemote} $${numberWithCommas(cash)}`
            )
            .setColor("#60b0f4")
            .setThumbnail(`${cars.Cars[bought].Image}`);
          interaction.reply({ embeds: [embed] });
        }
      }
    } else if (list2[bought.toLowerCase()]) {
      bought = bought.toLowerCase();

      let discount = userdata.discountparts;
      if (amount2 > 50)
        return interaction.reply(
          `The max amount you can buy in one command is 50!`
        );
      if (parts.Parts[bought].Tier == "BM1") {
        if (gold < parts.Parts[bought].Price)
          return interaction.reply("You don't have enough gold!");
        userdata.gold -= parts.Parts[bought].Price;
        userdata.parts.push(bought.toLowerCase());
        userdata.save();

        interaction.reply(
          `You bought a ${parts.Parts[bought].Name} for 🪙 ${numberWithCommas(
            parts.Parts[bought].Price
          )}`
        );
      } else {
        if (discount) {
          let priceforpart =
            parts.Parts[bought].Price -
            parts.Parts[bought].Price * parseFloat(discount);
          if (parts.Parts[bought].Price == 0)
            return interaction.reply("This part is not purchasable.");
          if (cash < priceforpart * amount2)
            return interaction.reply("You don't have enough cash!");
          priceforpart = amount2 * priceforpart;
          userdata.cash -= priceforpart;
          let user1newpart = [];
          for (var i = 0; i < amount2; i++)
            user1newpart.push(bought.toLowerCase());
          for (i in user1newpart) {
            userdata.parts.push(bought.toLowerCase());
          }
          userdata.save();

          let embed = new MessageEmbed()
            .setTitle(
              `✅ Bought x${amount2} ${parts.Parts[bought].Name} Discounted`
            )
            .addField(
              `Price`,
              `${cashemote} $${numberWithCommas(priceforpart)}`
            )
            .addField(
              "New cash balance",
              `${cashemote} $${numberWithCommas(cash)}`
            )
            .setColor(`#60b0f4`);
          if (parts.Parts[bought].Image) {
            embed.setThumbnail(parts.Parts[bought].Image);
          }
          await interaction.reply({ embeds: [embed] });
        } else {
          if (parts.Parts[bought].Price == 0)
            return interaction.reply("This part is not purchasable.");
          let newprice = parts.Parts[bought].Price * amount2;
          if (userdata.cash < newprice)
            return interaction.reply(
              `You cant afford this! You need $${numberWithCommas(newprice)}`
            );
          userdata.cash -= newprice;
          let user1newpart = [];

          for (let i = 0; i < amount2; i++)
            user1newpart.push(bought.toLowerCase());
          for (i in user1newpart) {
            userdata.parts.push(bought.toLowerCase());
          }
          userdata.save();
          let embed = new MessageEmbed()
            .setTitle(`✅ Bought x${amount2} ${parts.Parts[bought].Name}`)
            .addField(
              `Price`,
              `${cashemote} $${numberWithCommas(parts.Parts[bought].Price)}`
            )
            .addField(
              "New cash balance",
              `${cashemote} $${numberWithCommas(cash)}`
            )
            .setColor(`#60b0f4`);
          if (parts.Parts[bought].Image) {
            embed.setThumbnail(parts.Parts[bought].Image);
          }
          await interaction.reply({ embeds: [embed] });
        }
      }
    } else if (houses[bought.toLowerCase()]) {
      if (cash < houses[bought.toLowerCase()].Price)
        return interaction.reply("You don't have enough cash!");
      // let house = userdata.house;
      // let garagelimit = userdata.garageLimit;
      if (bought.toLowerCase() !== "yacht") {
        // if (house) {
        //   if (house.perks.includes("+2 Garage spaces")) {
        //     garagelimit -= 2;
        //   } else if (house.perks.includes("+3 Garage spaces")) {
        //     garagelimit -= 3;
        //   } else if (house.perks.includes("+4 Garage spaces")) {
        //     garagelimit -= 4;
        //   } else if (house.perks.includes("+6 Garage spaces")) {
        //     garagelimit -= 6;
        //   } else if (house.perks.includes("+15 Garage spaces")) {
        //     garagelimit -= 15;
        //   }
        // }
        if (houses[bought].Rewards.includes("10% Discount on parts")) {
          userdata.discountparts = 0.1;
        } else if (houses[bought].Rewards.includes("15% Discount on parts")) {
          userdata.discountparts = 0.15;
        } else if (houses[bought].Rewards.includes("20% Discount on parts")) {
          userdata.discountparts = 0.2;
        }
        if (houses[bought].Rewards.includes("20% Discount on parts AND cars")) {
          userdata.discountparts = 0.2;
          userdata.discountcars = 0.2;
        } else if (
          houses[bought].Rewards.includes("25% Discount on parts AND cars")
        ) {
          userdata.discountparts = 0.2;
          userdata.discountcars = 0.2;
        }

        if (houses[bought].Rewards.includes("+2 Garage spaces")) {
          userdata.garageLimit += 2;
        } else if (houses[bought].Rewards.includes("+3 Garage spaces")) {
          userdata.garageLimit += 3;
        } else if (houses[bought].Rewards.includes("+4 Garage spaces")) {
          userdata.garageLimit += 4;
        } else if (houses[bought].Rewards.includes("+6 Garage spaces")) {
          userdata.garageLimit += 6;
        } else if (houses[bought].Rewards.includes("+15 Garage spaces")) {
          userdata.garageLimit += 15;
        }
        let houseobj = {
          name: houses[bought.toLowerCase()].Name,
          perks: houses[bought.toLowerCase()].Rewards,
        };
        userdata.house = houseobj;
      } else {
        userdata.yacht = true;
      }
      userdata.cash -= houses[bought.toLowerCase()].Price;
      userdata.save();
      interaction.reply(
        `You bought ${houses[bought].Name} for $${numberWithCommas(
          houses[bought].Price
        )}`
      );
    } else if (warehousedb[bought.toLowerCase()]) {
      let warehouses = userdata.warehouses;
      let prestige = userdata.prestige;
      let wareprice = warehousedb[bought.toLowerCase()].Price;
      if (cash < wareprice)
        return interaction.reply(`You cant afford this warehouse!`);
      if (prestige < 11)
        return interaction.reply(
          `Your prestige needs to be 11 before you can buy warehouses!`
        );
      if (warehouses.includes(bought.toLowerCase()))
        return interaction.reply(`You've already purchased this warehouse!`);

      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $push: {
            warehouses: bought.toLowerCase(),
          },
        }
      );

      userdata.garageLimit += warehousedb[bought.toLowerCase()].Space;
      userdata.save();

      interaction.reply(
        `You bought the ${warehousedb[bought.toLowerCase()].Emote} ${
          warehousedb[bought.toLowerCase()].Name
        } for $${numberWithCommas(warehousedb[bought.toLowerCase()].Price)}`
      );
    } else if (
      list3.Police[bought.toLowerCase()] ||
      list3.Other[bought.toLowerCase()] ||
      list3.Multiplier[bought.toLowerCase()]
    ) {
      let itemshop = global.itemshop;
      let filtereditem = itemshop.filter(
        (item) => item.Name.toLowerCase() == bought.toLowerCase()
      );
      let itemindb = filtereditem[0] || "No ID";

      if (itemindb == "No ID")
        return interaction.reply(
          `That item isn't in the shop today, check back tomorrow!`
        );

      let pricing = itemindb.Price * amount2;
      if (userdata.cash < pricing)
        return interaction.reply(
          `You cant afford this! You need $${numberWithCommas(pricing)}`
        );

      let user1newarr = [];

      for (let i = 0; i < amount2; i++) user1newarr.push(bought.toLowerCase());
      for (i in user1newarr) {
        userdata.items.push(bought.toLowerCase());
      }
      userdata.cash -= pricing;

      userdata.save();

      interaction.reply(
        `Purchased x${amount2} ${list3.Other[bought].Emote} ${
          list3.Other[bought].Name
        } for $${numberWithCommas(pricing)}`
      );
    } else {
      interaction.reply(`Thats not a purchasable item, car, house, or part!`);
    }
  },
};
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
