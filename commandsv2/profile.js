const Discord = require("discord.js");
const profilepics = require("../data/pfpsdb.json");
const cardb = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View a profile")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("View the profile of another user")
        .setRequired(false)
    ),
  async execute(interaction) {
    let user = interaction.options.getUser("user") || interaction.user;

    let userdata = await User.findOne({ id: user.id });

    let prestige = userdata.prestige;
    let racerank = userdata.racerank;
    let driftrank = userdata.driftrank;

    let helmet = userdata.helmet;
    let acthelmet = profilepics.Pfps[helmet.toLowerCase()].Image;

    let title = userdata.title;

    let cars = userdata.cars;
    cars = cars.sort(function (b, a) {
      return a.Speed - b.Speed;
    });

    let finalprice = 0;

    for (let car in cars) {
      let car2 = cars[car];

      let price = Number(cardb.Cars[car2.Name.toLowerCase()].Price);

      finalprice += price;
    }

    let cash = userdata.cash;
    finalprice += cash;

    let bestcar = cars[0];

    let embed = new Discord.EmbedBuilder()
      .setTitle(title)
      .setAuthor(`Spoder - Profile`)
      .setColor(colors.blue)
      .setThumbnail(acthelmet)
      .addFields([
        {
          name: `Progress`,
          value: `Race Rank: ${racerank}\nDrift Rank: ${driftrank}\nPrestige: ${prestige}\nTier: ${userdata.tier}`,
        },
        {
          name: `Best Car`,
          value: `${bestcar.Emote} ${bestcar.Name}\n\nSpeed: ${bestcar.Speed}MPH\n0-60: ${bestcar.Acceleration}s\nHandling: ${bestcar.Handling}`,
          inline: true,
        },
        { name: `Networth`, value: `${toCurrency(finalprice)}`, inline: true },
      ]);

    interaction.reply({ embeds: [embed] });
  },
};
