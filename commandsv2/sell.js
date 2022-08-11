const { SlashCommandBuilder } = require("@discordjs/builders");
const { toCurrency } = require("../common/utils");
const User = require("../schema/profile-schema");

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
    ),

  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });

    let parts = require("../data/partsdb.json");
    let profilestuff = require("../data/pfpsdb.json");
    let userparts = userdata.parts;

    let selling = interaction.options.getString("item");
    let amount = interaction.options.getNumber("amount") || 1;

    if (!selling) return await interaction.reply("Specify a car or part!");

    let filteredcar = userdata.cars.filter((car) => car.ID == selling);
    let selected = filteredcar[0] || "No ID";

    if (selected !== "No ID") {
      let price = selected.Resale || selected.Price || 0;

      userdata.cars.pull(selected);
      userdata.cash += Number(price);

      await interaction.reply(
        `You sold your ${selected.Name} for ${toCurrency(price)}!`
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
        return await interaction.reply("You don't have that many of that part!");
      if (parts.Parts[selling.toLowerCase()].sellprice > 0) {
        userdata.cash += parts.Parts[selling.toLowerCase()].sellprice * amount;
      }
      let resale = parts.Parts[selling.toLowerCase()].Price * 0.35;
      for (var i = 0; i < amount; i++)
        userparts.splice(userparts.indexOf(selling.toLowerCase()), 1);
      userdata.parts = userparts;
      let finalamount = amount * resale;
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

      await interaction.reply(`Sold ${amount} ${selling} for ${toCurrency(finalam)}`);
    } else if (profilestuff.Pfps[selling.toLowerCase()]) {
      userdata.pfps.pull(selling.toLowerCase());

      await interaction.reply(`You sold your ${selling} for $0!`);
    }

    userdata.save();
  },
};
