const Discord = require("discord.js");
const profilepics = require("../data/pfpsdb.json");
const cardb = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const achievementsdb = require("../data/achievements.json");

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
    let achievements = userdata.achievements;
    let acharray = [];
    if (achievements && achievements.length !== 0) {
      for (let a in achievements) {
        let achievement = achievements[a];

        if (achievement.completed == true) {
          let achindb =
            achievementsdb.Achievements[achievement.id.toLowerCase()];
          acharray.push(`${achindb.Emote} ${achindb.Name}`);
        }
      }
    } else {
      acharray["None"];
    }
    let acthelmet = profilepics.Pfps[helmet.toLowerCase()].Image;
    let title = userdata.title;

    if (prestige >= 5) {
      title = "Novice Racer";
    } else if (prestige >= 10) {
      title = "Decent Racer";
    } else if (prestige >= 25) {
      title = "Good Racer";
    } else if (prestige >= 50) {
      title = "Pro Racer";
    } else if (prestige >= 100) {
      title = "Stig Racer";
    } else if (prestige >= 500) {
      title = "No Life Racer";
    }

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
        inline: true,
      },
      {
        name: `Achievements`,
        value: `
          ${acharray.join("\n")}
        `,
        inline: true,
      },
      {
        name: `\u200b`,
        value: `\u200b`,
        inline: true,
      },
    ];

    let bestcar = cars[0];
    if (bestcar) {
      fields.push({
        name: `Best Car`,
        value: `
          ${bestcar.Emote} ${bestcar.Name}\n
          Power: ${bestcar.Speed}
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
      .setTitle(`${title}`)
      .setAuthor({ name: `${user.username} - Profile` })
      .setColor(colors.blue)
      .setThumbnail(acthelmet)
      .addFields(fields);

    await interaction.reply({ embeds: [embed] });
  },
};
