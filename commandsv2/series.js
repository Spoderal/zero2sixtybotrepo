const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
  ButtonBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const cardb = require("../data/cardb.json");
let seasondb = require("../data/seasons.json");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("series")
    .setDescription("Check the current car series"),
  async execute(interaction) {
    const row2 = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("No car series selected")
        .addOptions([
          {
            label: "Help",
            description: "Information for what a series is",
            value: "help",
            customId: "help",
          },
          {
            label: "Perfect Engineering",
            description: "Information for the Perfect Engineering Series",
            value: "perfect_engineering",
            customId: "pe",
          },
        ])
    );
    let row3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Claim 1980 Porsche 911")
        .setEmoji("<:porsche:931011550880338011>")
        .setCustomId("claimcar")
        .setStyle("Secondary")
    );

    let userdata = await User.findOne({ id: interaction.user.id });
    let cooldowndata = await Cooldowns.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let series1 = userdata.perfectengineering;
    let embed = new EmbedBuilder();
    embed.setTitle("Series Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the current car series going on!\n\n
            **__Events__**
            Perfect Engineering <:porsche:931011550880338011>\n *Prestige 5*

            You only have **1 day** to complete a car series
        `);

    embed.setColor(colors.blue);

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row2],
      fetchReply: true,
    });

    let seriescomplfilt = userdata.cars.filter(
      (car) => car.Name == "1980 Porsche 911"
    );

    if (
      seriescomplfilt[0] &&
      seriescomplfilt[0].Wins >= 50 &&
      userdata.perfectengineeringcomplete !== true
    ) {
      row3.addComponents(
        new ButtonBuilder()
          .setLabel("Claim 2018 Singer DLS")
          .setEmoji("<:porsche:931011550880338011>")
          .setCustomId("claimcarfinal")
          .setStyle("Secondary")
      );
    }
    const filter = (interaction2) =>
      interaction2.isSelectMenu() &&
      interaction2.user.id === interaction.user.id;

    const filter2 = (interaction2) =>
      interaction2.user.id === interaction.user.id;

    const collector = msg.createMessageComponentCollector({
      filter,
      time: 1000 * 15,
    });

    const collector2 = msg.createMessageComponentCollector({
      filter: filter2,
      time: 1000 * 15,
    });

    collector.on("collect", async (collected) => {
      const value = collected.values[0];
      if (value === "perfect_engineering" && userdata.prestige >= 5) {
        embed.setTitle("Perfect Engineering Car Series");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`
          Perfect Engineering is hard to find, but you know where you can find it? A car, not just any car, the Porsche 911

          You're gonna have a 1980 Porsche 911 on loan, that you cant upgrade unless you use Loaned Parts, this will be until you finish the series

          You have 10 series tickets per day, use them wisely! You use 1 ticket when you race with this car, after you win 50 races with this car, you finish the series and earn the **2018 Singer DLS**

          Once you have 50 wins, come back and claim your Singer DLS

          You will also have a chance to earn exclusive **DIAMOND PLATED PARTS** such as the <:part_txxecu:1113746120187846726> TXXECU!
                    `);
        embed.setThumbnail("https://i.ibb.co/Ttth621/carseries.png");
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/NLH4tBQ/series-perfect.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row3, row2],
        });
      } else if (value == "help") {
        embed.setTitle("Help with series");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`
          Car series are small permanent events that you can do when you reach a certain prestige, the prestige required for each series is highlighted next to the name.

          There are 2 types of series, series where you can earn a final car prize, and series where you just race with the car to earn diamond parts, diamond parts have a 10% chance to drop depending on which series you're doing.

          Each series will only give you 24 hours to complete it. The series where you get parts from will NOT let you do it again after your first try, but the others will.

          You will receive 10 series tickets to start, you'll need a series ticket to race with the car. You will get 1 series ticket every 30 minutes.
  
                    `);
        embed.setThumbnail("https://i.ibb.co/Ttth621/carseries.png");
        embed.setColor(colors.blue);

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } else if (value === "bit" && userdata.prestige >= 6) {
        embed.setTitle("Back In Time Series");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`
          Time to go back in time with the delorean! You'll be renting out a delorean to go to different time periods to race with it!

          You're gonna need a 1981 DMC DeLorean to complete the series, and you can only try to complete it once!

          You will also have a chance to earn exclusive **DIAMOND PLATED PARTS** such as the <:part_txxbrakes:1113959753119440956> TXXBrakes!
  
                    `);
        embed.setThumbnail("https://i.ibb.co/Ttth621/carseries.png");
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/cJp0dhC/series-backintime.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      }
    });

    collector2.on("collect", async (i) => {
      if (i.customId == "claimcar") {
        let series1cool = cooldowndata.series1;
        userdata = await User.findOne({ id: interaction.user.id });
        let eng = userdata.perfectengineering;
        let cooldown = 86400000;
        if (eng == true) return i.update("You already started this series!");
        if (series1cool !== null && cooldown - (Date.now() - series1cool) > 0) {
          let time = ms(cooldown - (Date.now() - series1cool));
          let timeEmbed = new EmbedBuilder()
            .setColor(colors.blue)
            .setDescription(
              `You've already started this series\n\nStart it again in ${time}.`
            );
          await i.update({ embeds: [timeEmbed], fetchReply: true });
        }
        let carobj = cardb.Cars["1980 porsche 911"];

        let newobj = {
          ID: carobj.alias,
          Name: carobj.Name,
          Speed: carobj.Speed,
          Acceleration: carobj["0-60"],
          Handling: carobj.Handling,
          Parts: [],
          Emote: carobj.Emote,
          Livery: carobj.Image,
          Miles: 0,
          Drift: 0,
          Loan: true,
          WeightStat: carobj.Weight,
          Wins: 0,
        };

        cooldowndata.series1 = Date.now();
        userdata.perfectengineering = true;
        userdata.cars.push(newobj);
        userdata.save();
        cooldowndata.save();

        i.update("✅");
      } else if (
        i.customId == "claimcarfinal" &&
        userdata.perfectengineeringcomplete !== true
      ) {
        let carobj = cardb.Cars["2018 singer dls"];
        userdata = await User.findOne({ id: interaction.user.id });
        let eng = userdata.perfectengineeringcomplete;
        if (eng == true) return i.update("You already finished this series!");
        let newobj = {
          ID: carobj.alias,
          Name: carobj.Name,
          Speed: carobj.Speed,
          Acceleration: carobj["0-60"],
          Handling: carobj.Handling,
          Parts: [],
          Emote: carobj.Emote,
          Livery: carobj.Image,
          Miles: 0,
          Drift: 0,
          Loan: true,
          WeightStat: carobj.Weight,
        };

        userdata.perfectengineering = true;
        userdata.perfectengineeringcomplete = true;
        userdata.cars.push(newobj);
        userdata.save();

        i.update("✅");
      }
    });
  },
};
