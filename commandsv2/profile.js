const Discord = require("discord.js");
const profilepics = require("../data/pfpsdb.json");
const cardb = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const prestigedb = require(`../data/prestige.json`);
const { GET_STARTED_MESSAGE } = require("../common/constants");

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
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let prestige = userdata.prestige || 0;
    let racerank = userdata.racerank;
    let driftrank = userdata.driftrank;
    let helmet = userdata.helmet;
    let acthelmet = profilepics.Pfps[helmet.toLowerCase()].Image;
    let title = userdata.title;

    if (prestige == 0) title = "Noob Racer";
    else if (prestige > 0) title = prestigedb[`${prestige}`].Title;

    let cars = userdata.cars;
    cars = cars.sort(function (b, a) {
      return a.Speed - b.Speed;
    });

    let finalprice = 0;
    for (let car in cars) {
      let car2 = cars[car];
      let price = cardb.Cars[car2.Name.toLowerCase()]?.Price;
      if (price) finalprice += Number(price);
    }

    let cash = userdata.cash;
    finalprice += cash;

    const fields = [
      {
        name: `Progress`,
        value: `
          Race Rank: ${racerank}
          XP: ${userdata.racexp}
          Drift Rank: ${driftrank}
          Prestige: ${prestige}
          Tier: ${userdata.tier}
        `,
      },
    ];

    let bestcar = cars[0];
    if (bestcar) {
      fields.push({
        name: `Best Car`,
        value: `
          ${bestcar.Emote} ${bestcar.Name}\n
          Speed: ${bestcar.Speed}MPH
          0-60: ${bestcar.Acceleration}s
          Handling: ${bestcar.Handling}
        `,
        inline: true,
      });
    }
    fields.push({
      name: `Networth`,
      value: `${toCurrency(finalprice)}`,
      inline: true,
    });

    let embed = new Discord.EmbedBuilder()
      .setTitle(title)
      .setAuthor({ name: `${user.username} - Profile` })
      .setColor(colors.blue)
      .setThumbnail(acthelmet)
      .addFields(fields);

    await interaction.reply({ embeds: [embed] });
  },
};
