const db = require("quick.db");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const housedb = require("../data/houses.json");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("house")
    .setDescription("View your house and its perks")
    .addBooleanOption((option) =>
      option
        .setName("sell")
        .setDescription("Sell your house")
        .setRequired(false)
    ),
  async execute(interaction) {
    let user = interaction.user;
    let uid = user.id;
    let userdata = await User.findOne({ id: uid });

    let house = userdata.house;
    let selloption = interaction.options.getBoolean("sell");

    if (!house)
      return interaction.reply(
        `You don't have a house! View the available houses with \`/houses\``
      );

    if (selloption) {
      let housename = house.name.toLowerCase();

      let items = userdata.items;

      if (!items.includes("for sale sign"))
        return interaction.reply("You need a for sale sign!");
      for (var i = 0; i < 1; i++)
        items.splice(items.indexOf("for sale sign"), 1);
      userdata.items = items;

      db.delete(`partdiscount_${interaction.user.id}`);
      db.delete(`cardiscount_${interaction.user.id}`);
      if (housedb[housename].Rewards.includes("+2 Garage spaces")) {
        userdata.garageLimit -= 2;
      } else if (housedb[housename].Rewards.includes("+3 Garage spaces")) {
        userdata.garageLimit -= 3;
      } else if (housedb[housename].Rewards.includes("+4 Garage spaces")) {
        userdata.garageLimit -= 4;
      } else if (housedb[housename].Rewards.includes("+6 Garage spaces")) {
        userdata.garageLimit -= 6;
      } else if (housedb[housename].Rewards.includes("+15 Garage spaces")) {
        userdata.garageLimit -= 15;
      }
      userdata.cash += housedb[housename].Price;

      interaction.reply(
        `You sold your ${housedb[housename].Name} for $${numberWithCommas(
          housedb[housename].Price
        )}`
      );

      userdata.house = null;
      userdata.save();
    } else {
      let perks = house.perks;
      let image = housedb[house.name.toLowerCase()].Image;

      let embed = new Discord.MessageEmbed()
        .setTitle(`${house.name}`)
        .addField("Perks", `${perks.join("\n")}`)
        .setColor("#60b0f4")
        .setImage(image);

      interaction.reply({ embeds: [embed] });
    }
  },
};
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
