

const { SlashCommandBuilder } = require("@discordjs/builders");
const { toCurrency } = require("../common/utils");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
let parts = require("../data/partsdb.json");
let profilestuff = require("../data/pfpsdb.json");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json");
const itemdb = require("../data/items.json");
const imports = require("../data/imports.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sell")
    .setDescription("Sell a car or part")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item you want to sell")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount to sell")
        .setRequired(true)
        .setMinValue(1)
    ),

  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let cooldowns = await Cooldowns.findOne({ id: interaction.user.id });

    let timeout = 10000;

    if (
      cooldowns.trading !== null &&
      timeout - (Date.now() - cooldowns.trading) > 0
    ) {
      return interaction.reply({
        content: `You need to wait to use this command because you're trading with someone! **IF SOMEONE IS ABUSING THIS, REPORT IT TO STAFF IMMEDIATELY**`,
      });
    }
    let userparts = userdata.parts;
    let selling = interaction.options.getString("item");
    let amount = interaction.options.getNumber("amount") || 1;
    let amount2 = Math.round(amount);

    let usercars = userdata.cars;
    if (!selling) return await interaction.reply("Specify a car or part!");

    let filteredcar = userdata.cars.filter(
      (car) =>
        car.ID.toLowerCase() == selling.toLowerCase() ||
        (car.Name.toLowerCase() == selling.toLowerCase() &&
          car.Favorite !== true)
    );

    let selected = filteredcar[0] || "No ID";
    console.log(selected);


    if (selected !== "No ID") {
      let price = selected.Resale || selected.Price || 0;

      if (selected.Resale == 0 || !selected.Resale) {
        if(cardb.Cars[selected.Name.toLowerCase()].Price == 0 && cardb.Cars[selected.Name.toLowerCase()].sellprice > 0){
          price = cardb.Cars[selected.Name.toLowerCase()].sellprice
        }
        else {
          if(userdata.location == "united kingdom"){
            price = cardb.Cars[selected.Name.toLowerCase()].Price * 0.80;
          }
          else {
            price = cardb.Cars[selected.Name.toLowerCase()].Price * 0.75;

          }
        }
      }

      if (amount2 > filteredcar.length)
        return interaction.reply("You don't have that many of that car!");

      price = price * amount2;

      if (userdata.items.includes("coconut")) {
        price = price += price * 0.05;
      }
      for (var b = 0; b < usercars.length; b++)
        if (usercars[b].Name === selected.Name) {
          usercars.splice(b, amount2);
          break;
        }
      if (isNaN(price)) {
        price = 0;
      }
      userdata.cars = usercars;
      userdata.cash += Number(price);
      if (imports.common.Contents.includes(selected.Name.toLowerCase())) {
        userdata.commonCredits += 5;
      }
      if (imports.exotic.Contents.includes(selected.Name.toLowerCase())) {
        userdata.exoticCredits += 5;
      }
      if (imports.rare.Contents.includes(selected.Name.toLowerCase())) {
        userdata.rareCredits += 5;
      }
      if(userdata.cars.length <= 0) return interaction.reply("You need to have at least 1 car!")


      await interaction.reply(
        `You sold ${amount2} ${selected.Name} for ${toCurrency(price)}!`
      );
    } else if (parts.Parts[selling.toLowerCase()]) {
      if (
        !userparts.includes(
          parts.Parts[selling.toLowerCase()].Name.toLowerCase()
        )
      )
        return await interaction.reply("You dont have that part!");
      
      let filtereduser = userparts.filter(function hasmany(part) {
        return part === selling.toLowerCase();
      });
      if (amount2 > filtereduser.length)
        return await interaction.reply(
          "You don't have that many of that part!"
        );
      let finalamount = 0;

        let resale = parts.Parts[selling.toLowerCase()].Price * 0.35;
        finalamount = amount2 * resale;
        userdata.cash += finalamount;
      
      if (parts.Parts[selling.toLowerCase()].Tier == "4") {
        let resale = 1000;
        finalamount = amount2 * resale;
        userdata.cash += finalamount;
      } else if (parts.Parts[selling.toLowerCase()].Tier == "5") {
        let resale = 2500;
        finalamount = amount2 * resale;
        userdata.cash += finalamount;
      }
      for (var i2 = 0; i2 < amount2; i2++)
        userparts.splice(userparts.indexOf(selling.toLowerCase()), 1);
      userdata.parts = userparts;
      await interaction.reply(
        `You sold your ${selling} for ${toCurrency(finalamount)}!`
      );
    } else if (
      selling.toLowerCase() == "legendary barn maps" ||
      selling.toLowerCase() == "legendary barn map" ||
      selling.toLowerCase() == "rare barn maps" ||
      selling.toLowerCase() == "rare barn map" ||
      selling.toLowerCase() == "uncommon barn maps" ||
      selling.toLowerCase() == "uncommon barn map" ||
      selling.toLowerCase() == "common barn maps" ||
      selling.toLowerCase() == "common barn map"
    ) {
      let exchange;
      let maps;

      if (selling.startsWith("legendary")) {
        exchange = 1000;
        maps = userdata.lmaps;
      } else if (selling.startsWith("rare")) {
        exchange = 500;
        maps = userdata.rmaps;
      } else if (selling.startsWith("uncommon")) {
        exchange = 100;
        maps = userdata.ucmaps;
      } else if (selling.startsWith("common")) {
        exchange = 50;
        maps = userdata.cmaps;
      }
      if (maps < amount2)
        return await interaction.reply(`You dont have enough barn maps!`);

      let finalam = exchange * amount2;

      if (selling.startsWith("legendary")) {
        userdata.lmaps -= amount2;
      } else if (selling.startsWith("rare")) {
        userdata.rmaps -= amount2;
      } else if (selling.startsWith("uncommon")) {
        userdata.ucmaps -= amount2;
      } else if (selling.startsWith("common")) {
        userdata.cmaps -= amount2;
      }

      userdata.cash += finalam;

      await interaction.reply(
        `Sold ${amount2} ${selling} for ${toCurrency(finalam)}`
      );
    } else if (itemdb[selling.toLowerCase()]) {
      let useritems = userdata.items;
      let finalprice = itemdb[selling.toLowerCase()].Price * 0.35;
      useritems.splice(useritems.indexOf(selling.toLowerCase()), 1);
      userdata.items = useritems;
      userdata.cash +=finalprice

      await interaction.reply(`You sold your ${selling} for ${toCurrency(finalprice)}!`);
    } else if (profilestuff.Pfps[selling.toLowerCase()]) {
      userdata.pfps.pull(selling.toLowerCase());

      await interaction.reply(`You sold your ${selling} for $0!`);
    } else {
      await interaction.reply({
        content: `You don't have "${selling}". Maybe it was a typo?`,
        ephemeral: true,
      });
    }

    userdata.save();
  },
};
