

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
            emoji: "<:porsche:931011550880338011>",
          },
          {
            label: "Pressure",
            description: "Information for the Pressure Series",
            value: "pressure",
            customId: "pressure",
            emoji: "<:bmw:931011550054056007>",
          },
          {
            label: "Fiesta Familia",
            description: "Information for the Fiesta Familia Series",
            value: "fiesta",
            customId: "fiesta",
            emoji: "<:ford:931012624152399902>",
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
    let row4 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Claim 2018 BMW M4CS")
        .setEmoji("<:bmw:931011550054056007>")
        .setCustomId("claimcar2")
        .setStyle("Secondary")
    );
    let row6 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Claim 2017 Ford Fiesta ST")
        .setEmoji("<:ford:931012624152399902>")
        .setCustomId("claimcar3")
        .setStyle("Secondary")
    );
    let userdata = await User.findOne({ id: interaction.user.id });
    let cooldowndata = await Cooldowns.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let wins = userdata.cars.filter(
      (car) => car.Name == "1980 Porsche 911" && car.Wins
    );
    let wins2 = userdata.cars.filter(
      (car) => car.Name == "2018 BMW M4CS" && car.Wins
    );
    let wins3 = userdata.cars.filter(
      (car) => car.Name == "2017 Ford Fiesta ST" && car.Wins
    );
    let winstext = "";
    if (wins[0]) {
      console.log(wins);
      winstext = `Wins: ${wins[0].Wins}`;
    }

    let winstext2 = "";
    if (wins2[0]) {
      winstext2 = `Wins: ${wins2[0].Wins}`;
    }
    let winstext3 = "";
    if (wins3[0]) {
      winstext3 = `Wins: ${wins3[0].Wins}`;
    }
    let embed = new EmbedBuilder();
    embed.setTitle("Series Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the current car series going on!\n\n
            **__Events__**
            Perfect Engineering <:porsche:931011550880338011> *Prestige 5* ${winstext}

            Pressure <:bmw:931011550054056007> *Prestige 3* ${winstext2}

            Fiesta Familia <:ford:931012624152399902> *Prestige 2* ${winstext3}

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

    let seriescomplfilt2 = userdata.cars.filter(
      (car) => car.Name == "2018 BMW M4CS"
    );

    let seriescomplfilt3 = userdata.cars.filter(
      (car) => car.Name == "2017 Ford Fiesta ST"
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
    if (
      seriescomplfilt2[0] &&
      seriescomplfilt2[0].Wins >= 50 &&
      userdata.pressurecomplete !== true
    ) {
      row4.addComponents(
        new ButtonBuilder()
          .setLabel("Claim 2016 BMW M4 GTS")
          .setEmoji("<:bmw:931011550054056007>")
          .setCustomId("claimcarfinal2")
          .setStyle("Secondary")
      );
    }

    if (
      seriescomplfilt3[0] &&
      seriescomplfilt3[0].Wins >= 50 &&
      userdata.fiestafamiliacomplete !== true
    ) {
      row6.addComponents(
        new ButtonBuilder()
          .setLabel("Claim 2016 Ford Focus RS")
          .setEmoji("<:ford:931012624152399902>")
          .setCustomId("claimcarfinal3")
          .setStyle("Secondary")
      );
    }
    console.log(seriescomplfilt2);
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
      } else if (value === "pressure" && userdata.prestige >= 3) {
        embed.setTitle("Pressure");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`
          Put some pressure on your opponents with the brand new 2018 BMW M4CS!

          You have 10 series tickets per day, use them wisely! You use 1 ticket when you race with this car, after you win 50 races with this car, you finish the series and earn the **2016 BMW M4 GTS**

          Once you have 50 wins, come back and claim your 2016 BMW M4 GTS
                    `);
        embed.setThumbnail("https://i.ibb.co/Ttth621/carseries.png");
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/w6X8HbH/series-pressure.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2, row4],
        });
      } else if (value === "fiesta" && userdata.prestige >= 2) {
        embed.setTitle("Fiesta Familia");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`
          A member of our family, the fiesta is going out of production, so its time for one last ride with the 2017 Ford Fiesta ST!

          You have 10 series tickets per day, use them wisely! You use 1 ticket when you race with this car, after you win 50 races with this car, you finish the series and earn the **2016 Ford Focus RS**

          Once you have 50 wins, come back and claim your 2016 Ford Focus RS
                    `);
        embed.setThumbnail("https://i.ibb.co/Ttth621/carseries.png");
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/zxpMkqQ/series-fiesta.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2, row6],
        });
      }
    });

    collector2.on("collect", async (i) => {
      if (i.customId == "claimcar") {
        let series1cool = cooldowndata.series1;
        userdata = await User.findOne({ id: interaction.user.id });
        let eng = userdata.perfectengineering;
        let cooldown = 86400000;
        if (eng == true) return interaction.editReply("You already started this series!");
        if (series1cool !== null && cooldown - (Date.now() - series1cool) > 0) {
          let time = ms(cooldown - (Date.now() - series1cool));
          let timeEmbed = new EmbedBuilder()
            .setColor(colors.blue)
            .setDescription(
              `You've already started this series\n\nStart it again in ${time}.`
            );
          await interaction.editReply({ embeds: [timeEmbed], fetchReply: true });
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
          Image: carobj.Image,
          Miles: 0,
          Drift: 0,
          Loan: true,
          WeightStat: carobj.Weight,
          Gas: 10,
          MaxGas: 10,
          Wins: 0,
        };

        cooldowndata.series1 = Date.now();
        userdata.perfectengineering = true;
        userdata.cars.push(newobj);
        userdata.save();
        cooldowndata.save();

        interaction.editReply("✅");
      } else if (i.customId == "claimcar2") {
        let series1cool = cooldowndata.series1;
        userdata = await User.findOne({ id: interaction.user.id });
        let eng = userdata.pressure;
        let cooldown = 86400000;
        if (eng == true) return interaction.editReply("You already started this series!");
        if (series1cool !== null && cooldown - (Date.now() - series1cool) > 0) {
          let time = ms(cooldown - (Date.now() - series1cool));
          let timeEmbed = new EmbedBuilder()
            .setColor(colors.blue)
            .setDescription(
              `You've already started a series\n\nStart one again in ${time}.`
            );
          await interaction.editReply({ embeds: [timeEmbed], fetchReply: true });
        }
        let carobj = cardb.Cars["2018 bmw m4cs"];

        let newobj = {
          ID: carobj.alias,
          Name: carobj.Name,
          Speed: carobj.Speed,
          Acceleration: carobj["0-60"],
          Handling: carobj.Handling,
          Parts: [],
          Emote: carobj.Emote,
          Image: carobj.Image,
          Miles: 0,
          Drift: 0,
          Loan: true,
          WeightStat: carobj.Weight,
          Gas: 10,
          MaxGas: 10,
          Wins: 0,
        };

        cooldowndata.series1 = Date.now();
        userdata.pressure = true;
        userdata.cars.push(newobj);
        userdata.save();
        cooldowndata.save();

        interaction.editReply("✅");
      } else if (i.customId == "claimcar3") {
        let series1cool = cooldowndata.series1;
        userdata = await User.findOne({ id: interaction.user.id });
        let eng = userdata.fiestafamilia;
        let cooldown = 86400000;
        if (eng == true) return interaction.editReply("You already started this series!");
        if (series1cool !== null && cooldown - (Date.now() - series1cool) > 0) {
          let time = ms(cooldown - (Date.now() - series1cool));
          let timeEmbed = new EmbedBuilder()
            .setColor(colors.blue)
            .setDescription(
              `You've already started a series\n\nStart one again in ${time}.`
            );
          await interaction.editReply({ embeds: [timeEmbed], fetchReply: true });
        }
        let carobj = cardb.Cars["2017 ford fiesta st"];

        let newobj = {
          ID: carobj.alias,
          Name: carobj.Name,
          Speed: carobj.Speed,
          Acceleration: carobj["0-60"],
          Handling: carobj.Handling,
          Parts: [],
          Emote: carobj.Emote,
          Image: carobj.Image,
          Miles: 0,
          Drift: 0,
          Loan: true,
          WeightStat: carobj.Weight,
          Gas: 10,
          MaxGas: 10,
          Wins: 0,
        };

        cooldowndata.series1 = Date.now();
        userdata.fiestafamilia = true;
        userdata.cars.push(newobj);
        userdata.save();
        cooldowndata.save();

        interaction.editReply("✅");
      } else if (
        i.customId == "claimcarfinal" &&
        userdata.perfectengineeringcomplete !== true
      ) {
        let carobj = cardb.Cars["2018 singer dls"];
        userdata = await User.findOne({ id: interaction.user.id });
        let eng = userdata.perfectengineeringcomplete;
        if (eng == true) return interaction.editReply("You already finished this series!");
        let newobj = {
          ID: carobj.alias,
          Name: carobj.Name,
          Speed: carobj.Speed,
          Acceleration: carobj["0-60"],
          Handling: carobj.Handling,
          Parts: [],
          Emote: carobj.Emote,
          Image: carobj.Image,
          Miles: 0,
          Drift: 0,
          Loan: true,
          WeightStat: carobj.Weight,
          Gas: 10,
          MaxGas: 10,
          Wins: 0,
        };
        userdata.perfectengineering = true;
        userdata.perfectengineeringcomplete = true;
        userdata.cars.push(newobj);
        userdata.save();

        interaction.editReply("✅");
      } else if (
        i.customId == "claimcarfinal2" &&
        userdata.pressurecomplete !== true
      ) {
        let carobj = cardb.Cars["2016 bmw m4 gts"];
        userdata = await User.findOne({ id: interaction.user.id });
        let eng = userdata.pressurecomplete;
        if (eng == true) return interaction.editReply("You already finished this series!");
        let newobj = {
          ID: carobj.alias,
          Name: carobj.Name,
          Speed: carobj.Speed,
          Acceleration: carobj["0-60"],
          Handling: carobj.Handling,
          Parts: [],
          Emote: carobj.Emote,
          Image: carobj.Image,
          Miles: 0,
          Drift: 0,
          Loan: true,
          WeightStat: carobj.Weight,
          Gas: 10,
          MaxGas: 10,
          Wins: 0,
        };

        userdata.pressure = true;
        userdata.pressurecomplete = true;
        userdata.cars.push(newobj);
        userdata.save();

        interaction.editReply("✅");
      } else if (
        i.customId == "claimcarfinal3" &&
        userdata.fiestafamiliacomplete !== true
      ) {
        let carobj = cardb.Cars["2016 ford focus rs"];
        userdata = await User.findOne({ id: interaction.user.id });
        let eng = userdata.fiestafamiliacomplete;
        if (eng == true) return interaction.editReply("You already finished this series!");
        let newobj = {
          ID: carobj.alias,
          Name: carobj.Name,
          Speed: carobj.Speed,
          Acceleration: carobj["0-60"],
          Handling: carobj.Handling,
          Parts: [],
          Emote: carobj.Emote,
          Image: carobj.Image,
          Miles: 0,
          Drift: 0,
          Loan: true,
          WeightStat: carobj.Weight,
          Gas: 10,
          MaxGas: 10,
          Wins: 0,
        };

        userdata.fiestafamilia = true;
        userdata.fiestafamiliacomplete = true;
        userdata.cars.push(newobj);
        userdata.save();

        interaction.editReply("✅");
      }
    });
  },
};
