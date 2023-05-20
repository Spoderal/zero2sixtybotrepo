const { SlashCommandBuilder } = require("@discordjs/builders");
const { toCurrency } = require("../common/utils");
const User = require("../schema/profile-schema");
let parts = require("../data/partsdb.json");
let profilestuff = require("../data/pfpsdb.json");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json");

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
        .addChoices(
          { name: "1", value: 1 },
          { name: "5", value: 5 },
          { name: "10", value: 10 }
        )
    ),

  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let userparts = userdata.parts;
    let selling = interaction.options.getString("item");
    let amount = interaction.options.getNumber("amount") || 1;
    let usercars = userdata.cars
    if (!selling) return await interaction.reply("Specify a car or part!");

    let filteredcar = userdata.cars.filter(
      (car) =>
        car.ID.toLowerCase() == selling.toLowerCase() ||
        (car.Name.toLowerCase() == selling.toLowerCase() &&
          car.Favorite !== true)
    );

    let selected = filteredcar[0] || "No ID";

    if (selected !== "No ID") {
      let price = selected.Resale || selected.Price || 0;

      if (selected.Resale == 0 || !selected.Resale) {
        price = cardb.Cars[selected.Name.toLowerCase()].sellprice;
      }

      if (amount > filteredcar.length)
        return interaction.reply("You don't have that many of that car!");

      price = price * amount;

      if (userdata.items.includes("coconut")) {
        price = price += price / 0.05;
      }

      for (var i2 = 0; i2 < amount; i2++) usercars.splice(usercars.indexOf(selling.toLowerCase()), 1);
      userdata.cars = usercars
      userdata.cash += Number(price);

      await interaction.reply(
        `You sold ${amount} ${selected.Name} for ${toCurrency(price)}!`
      );
    } else if (parts.Parts[selling.toLowerCase()]) {
      if (
        !userparts.includes(
          parts.Parts[selling.toLowerCase()].Name.toLowerCase()
        )
      )
        return await interaction.reply("You dont have that part!");
      if (
        parts.Parts[selling.toLowerCase()].sellprice == "N/A" ||
        !parts.Parts[selling.toLowerCase()].sellprice
      )
        return await interaction.reply("That part is unsellable!");
      let filtereduser = userparts.filter(function hasmany(part) {
        return part === selling.toLowerCase();
      });
      if (amount > filtereduser.length)
        return await interaction.reply(
          "You don't have that many of that part!"
        );
      let finalamount = 0;
      if (parts.Parts[selling.toLowerCase()].sellprice > 0) {
        let resale = parts.Parts[selling.toLowerCase()].Price * 0.35;
        finalamount = amount * resale;
        userdata.cash += finalamount;
      }
      for (var i = 0; i < amount; i++) userparts.splice(userparts.indexOf(selling.toLowerCase()), 1);
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
      if (maps < amount)
        return await interaction.reply(`You dont have enough barn maps!`);

      let finalam = exchange * amount;

      if (selling.startsWith("legendary")) {
        userdata.lmaps -= amount;
      } else if (selling.startsWith("rare")) {
        userdata.rmaps -= amount;
      } else if (selling.startsWith("uncommon")) {
        userdata.ucmaps -= amount;
      } else if (selling.startsWith("common")) {
        userdata.cmaps -= amount;
      }

      userdata.cash += finalam;

      await interaction.reply(
        `Sold ${amount} ${selling} for ${toCurrency(finalam)}`
      );
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
