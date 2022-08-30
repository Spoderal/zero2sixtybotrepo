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
const { toCurrency, numberWithCommas } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");

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
    const userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    const global = await Global.findOne({});
    const amount = interaction.options.getNumber("amount");
    const amount2 = amount || 1;
    let cash = userdata.cash;
    const gold = userdata.gold;
    const usercars = userdata.cars;
    const garagelimit = userdata.garageLimit;

    const bought = interaction.options.getString("item").toLowerCase();

    if (!bought)
      return await interaction.reply(
        "To use this command, specify the car or part you want to buy. Example: /buy 1995 Mazda Miata"
      );

    const carsList = cars.Cars;
    const partsList = parts.Parts;
    const itemsList = items;
    let carrarray = []
    for(let car1 in carsList){
      let caroj = carsList[car1]
      carrarray.push(caroj)

    }
     
    let boughtCar = carrarray.filter((car) => car.alias == bought.toLowerCase()) || 'NO ID'
    console.log(boughtCar)
    if(boughtCar.length == 0 && !boughtCar[0] || boughtCar == [] && !boughtCar[0]){
      boughtCar = carrarray.filter((car2) => car2.Name.toLowerCase() == bought.toLowerCase()) 
    }
    boughtCar = boughtCar[0]
  
 
      console.log(boughtCar)
    const boughtPart = partsList[bought];
    const boughtHouse = houses[bought];
    const boughtWarehouse = warehousedb[bought];

    if (
      !boughtCar &&
      !boughtPart &&
      !boughtWarehouse &&
      !boughtHouse &&
      !itemsList.Other[bought] &&
      !itemsList.Police[bought] &&
      !itemsList.Multiplier[bought]
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
          Livery: carindb.Image,
          Miles: 0,
        };
        if (boughtCar.Range) {
          carobj = {
            ...carobj,
            Range: carindb.Range,
            MaxRange: carindb.Range,
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
        if (cash < boughtCarPrice)
          return await interaction.reply("You don't have enough cash!");

        if (boughtCar.Police) {
          if (cash < boughtCarPrice)
            return await interaction.reply("You don't have enough cash!");

          let job = userdata.job;
          if (!job) return await interaction.reply("You don't have a job!");
          if (job.Job !== "police")
            return await interaction.reply(
              "You don't work as a cop! Use `/work hire` to get a job!"
            );

          let num = job.Number;

          if (num < boughtCar.Police)
            return await interaction.reply(
              `You need the rank "${boughtCar.Rank}" to buy this car!`
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
            Livery: boughtCar.Image,
            Miles: 0,
          };

          if (boughtCar.Range) {
            carobj = {
              ...carobj,
              Range: boughtCar.Range,
              MaxRange: boughtCar.Range,
            };
          }

          userdata.cash -= boughtCarPrice;
          userdata.cars.push(carobj);
          await userdata.save();

          let embed = new EmbedBuilder()
            .setTitle(`Bought ${boughtCar.Name}`)
            .addFields([
              {
                name: "Price",
                value: `${toCurrency(boughtCarPrice)}`,
              },
              { name: `ID`, value: `${idtoset}` },
              { name: "New cash balance", value: `${toCurrency(cash)}` },
            ])
            .setColor(colors.blue)
            .setThumbnail(`${boughtCar.Image}`);

          return await interaction.reply({ embeds: [embed] });
        }
        let sellprice = boughtCarPrice * 0.65;

        let discountcar = "0";
        if (discountcar !== "0") {
          let disccarprice =
            boughtCarPrice - boughtCarPrice * parseFloat(discountcar);

          if (cash < disccarprice)
            return await interaction.reply(`You can't afford this car!`);
            let filteredcar = carsList.filter((car) => car.ID == bought.toLowerCase());
            let carindb = filteredcar[0] || carsList[bought.toLowerCase()];
          cash -= disccarprice;
          let idtoset = boughtCar.alias;
          let carobj = {
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

          if (boughtCar.Range) {
            carobj = {
              ...carobj,
              Range: carindb.Range,
              MaxRange: carindb.Range,
            };
          }

          userdata.cash = cash;
          userdata.cars.push(carobj);
          await userdata.save();

          let embed = new EmbedBuilder()
            .setTitle(`Bought ${boughtCar.Name}`)
            .addFields([
              {
                name: "Price",
                value: `${toCurrency(disccarprice)} with discount`,
              },
              { name: "New cash balance", value: `${toCurrency(cash)}` },
              { name: `ID`, value: `${idtoset}` },
            ])
            .setColor(colors.blue)
            .setThumbnail(`${boughtCar.Image}`);

          await interaction.reply({ embeds: [embed] });
        } else {
          let sellprice = boughtCarPrice * 0.65;

          if (cash < boughtCarPrice)
            return await interaction.reply("You don't have enough cash!");
            let filteredcar = carrarray.filter((car) => car.alias == bought.toLowerCase()) || 'NO ID'
            console.log(boughtCar)
            if(filteredcar.length == 0 || filteredcar == []){
              filteredcar = carrarray.filter((car2) => car2.Name.toLowerCase() == bought.toLowerCase()) 
            }
            
            let carindb = filteredcar[0] || carsList[bought.toLowerCase()];
          cash -= boughtCarPrice;
          let idtoset = filteredcar[0].alias;
          let carobj = {
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
          if (boughtCar.Range) {
            carobj = {
              Range: carindb.Range,
              MaxRange: carindb.Range,
            };
          }

          userdata.cash = cash;
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
              {
                name: "New cash balance",
                value: `${emotes.cash} ${toCurrency(cash)}`,
              },
            ])
            .setColor(colors.blue)
            .setThumbnail(`${boughtCar.Image}`);

          await interaction.reply({ embeds: [embed] });
          if(userdata.tutorial && userdata.tutorial.stage == 1){
            console.log("tutorial")
            interaction.channel.send({content: `Now that you've bought your first car, you can race with it! See the ID field? Thats what you're going to type in the box when it asks for the car, go ahead and try running \`/botrace tier 1 ${idtoset}\``})
            userdata.tutorial.stage += 1
          }
  
        }
      }
    } else if (boughtPart) {
      const boughtPartPrice = parseInt(boughtPart.Price);
      let discount = userdata.discountparts;

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
        if (discount) {
          let priceforpart =
            boughtPartPrice - boughtPartPrice * parseFloat(discount);

          if (boughtPartPrice == 0)
            return await interaction.reply("This part is not purchasable.");

          if (cash < priceforpart * amount2)
            return await interaction.reply("You don't have enough cash!");

          priceforpart = amount2 * priceforpart;
          cash -= priceforpart;
          userdata.cash -= priceforpart;

          let user1newpart = [];
          for (var i = 0; i < amount2; i++) user1newpart.push(bought);
          for (i in user1newpart) {
            userdata.parts.push(bought);
          }

          await userdata.save();

          let embed = new EmbedBuilder()
            .setTitle(`✅ Bought x${amount2} ${boughtPart.Name} Discounted`)
            .addFields([
              {
                name: `Price`,
                value: `${emotes.cash} ${toCurrency(priceforpart)}`,
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
                value: `${emotes.cash} ${toCurrency(boughtPartPrice)}`,
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
      }
    } else if (boughtHouse) {
      const boughtHousePrice = parseInt(boughtHouse.Price);
      if (cash < boughtHousePrice)
        return await interaction.reply("You don't have enough cash!");

      // let house = userdata.house;
      // let garagelimit = userdata.garageLimit;
      if (bought !== "yacht") {
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

        if (boughtHouse.Rewards.includes("10% Discount on parts")) {
          userdata.discountparts = 0.1;
        } else if (boughtHouse.Rewards.includes("15% Discount on parts")) {
          userdata.discountparts = 0.15;
        } else if (boughtHouse.Rewards.includes("20% Discount on parts")) {
          userdata.discountparts = 0.2;
        }
        if (boughtHouse.Rewards.includes("20% Discount on parts AND cars")) {
          userdata.discountparts = 0.2;
          userdata.discountcars = 0.2;
        } else if (
          boughtHouse.Rewards.includes("25% Discount on parts AND cars")
        ) {
          userdata.discountparts = 0.2;
          userdata.discountcars = 0.2;
        }

        if (boughtHouse.Rewards.includes("+2 Garage spaces")) {
          userdata.garageLimit += 2;
        } else if (boughtHouse.Rewards.includes("+3 Garage spaces")) {
          userdata.garageLimit += 3;
        } else if (boughtHouse.Rewards.includes("+4 Garage spaces")) {
          userdata.garageLimit += 4;
        } else if (boughtHouse.Rewards.includes("+6 Garage spaces")) {
          userdata.garageLimit += 6;
        } else if (boughtHouse.Rewards.includes("+15 Garage spaces")) {
          userdata.garageLimit += 15;
        }
        let houseobj = {
          name: boughtHouse.Name,
          perks: boughtHouse.Rewards,
        };
        userdata.house = houseobj;
      } else {
        userdata.yacht = true;
      }
      userdata.cash -= boughtHousePrice;
      await userdata.save();
      await interaction.reply(
        `You bought ${boughtHouse.Name} for ${toCurrency(boughtHousePrice)}`
      );
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
    } else if (
      itemsList.Police[bought] ||
      itemsList.Other[bought] ||
      itemsList.Multiplier[bought]
    ) {
      let itemshop = global.itemshop;
      let filtereditem = itemshop.filter(
        (item) => item.Name.toLowerCase() == bought
      );
      let itemindb = filtereditem[0] || "No ID";

      if (itemindb == "No ID")
        return await interaction.reply(
          `That item isn't in the shop today, check back tomorrow!`
        );

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
        `Purchased x${amount2} ${itemsList.Other[bought].Emote} ${
          itemsList.Other[bought].Name
        } for ${toCurrency(pricing)}`
      );
    } else {
      await interaction.reply(
        `Thats not a purchasable item, car, house, or part!`
      );
    }
  },
};
