const lodash = require("lodash");
const ms = require("pretty-ms");
// const discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { userGetPatreonTimeout } = require("../common/user");
const { doubleCashWeekendField } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qm")
    .setDescription("Race a bot on the quarter mile")
    .addStringOption((option) =>
      option
        .setName("tier")
        .setDescription("The bot tier to race")
        .setRequired(true)
        .addChoices(
          { name: "Tier 1", value: "1" },
          { name: "Tier 2", value: "2" },
          { name: "Tier 3", value: "3" },
          { name: "Tier 4", value: "4" },
          { name: "Tier 5", value: "5" },
          { name: "Tier 6", value: "6" },
          { name: "Tier 7", value: "7" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {
    const db = require("quick.db");

    const cars = require("../data/cardb.json");
    let moneyearned = 75;
    let moneyearnedtxt = 75;
    let uid = interaction.user.id;
    let idtoselect = interaction.options.getString("car");
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: interaction.user.id });

    if (!idtoselect)
      return await interaction.reply(
        "Specify an id! Use /ids select [id] [car] to select a car!"
      );
    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }

    let user = interaction.user;
    let bot = interaction.options.getString("tier");
    const timeout = userGetPatreonTimeout(userdata);
    let botcar = null;
    let racing = cooldowndata.racing;
    let prestige = userdata.prestige;
    if (prestige < 1)
      return await interaction.reply(
        "You need to be prestige 1 to do this race!"
      );
    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return await interaction.reply(
        `Please wait ${time} before racing again.`
      );
    }
    let user1cars = userdata.cars;
    let bot1cars = [
      "1995 mazda miata",
      "1991 toyota mr2",
      "2002 pontiac firebird",
      "2002 ford mustang",
      "2005 hyundai tiburon",
    ];
    let bot2cars = [
      "2014 hyundai genesis coupe",
      "2008 nissan 350z",
      "2008 nissan 350z",
      "2010 ford mustang",
    ];
    let bot3cars = [
      "2020 porsche 718 cayman",
      "2015 lotus exige sport",
      "2011 audi rs5",
    ];
    let bot4cars = [
      "2015 mercedes amg gts",
      "2016 alfa romeo giulia",
      "2021 porsche 911 gt3",
      "2017 ford gt",
    ];
    let bot5cars = [
      "2010 ferrari 458 italia",
      "2018 lamborghini aventador s",
      "2016 aston martin vulkan",
      "2021 mclaren 720s",
    ];
    let bot6cars = [
      "2021 ferrari sf90 stradale",
      "2022 aston martin valkyrie",
      "2016 bugatti chiron",
      "2008 bugatti veyron",
      "2021 mclaren 720s",
      "2016 aston martin vulkan",
      "2013 mclaren p1",
    ];
    let bot7cars = [
      "2021 bugatti bolide",
      "2013 lamborghini veneno",
      "2020 koenigsegg regera",
      "2020 bugatti divo",
    ];

    let errorembed = new EmbedBuilder()
      .setTitle("❌ Error!")
      .setColor(colors.blue);
    if (!user1cars) {
      errorembed.setDescription("You dont have any cars!");
      return await interaction.reply({ embeds: [errorembed] });
    }

    if (!bot) {
      errorembed.setDescription(
        "Please specify  the tier you want to race. Tiers available: 1, 2, 3, 4, 5, and 6"
      );
      return await interaction.reply({ embeds: [errorembed] });
    }

    if (cars.Cars[selected.Name.toLowerCase()].Junked) {
      return await interaction.reply("This car is too junked to race, sorry!");
    }
    let ticketsearned;
    let ckeysearned;
    let rkeysearned;
    let ekeysearned;
    let range = selected.Range;
    if (cars.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return await interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }
    switch (bot) {
      case "1": {
        botcar = lodash.sample(bot1cars);
        ticketsearned = 1;
        ckeysearned = 2;
        break;
      }
      case "2": {
        botcar = lodash.sample(bot2cars);
        moneyearned += 150;
        moneyearnedtxt += 150;
        ticketsearned = 2;
        ckeysearned = 4;
        break;
      }
      case "3": {
        botcar = lodash.sample(bot3cars);
        moneyearned += 200;
        moneyearnedtxt += 200;
        ticketsearned = 3;
        rkeysearned = 1;
        break;
      }
      case "4": {
        botcar = lodash.sample(bot4cars);
        moneyearned += 300;
        moneyearnedtxt += 525;
        ticketsearned = 4;
        rkeysearned = 2;
        break;
      }
      case "5": {
        botcar = lodash.sample(bot5cars);
        moneyearned += 400;
        moneyearnedtxt += 400;
        ticketsearned = 5;
        rkeysearned = 3;
        break;
      }
      case "6": {
        botcar = lodash.sample(bot6cars);
        moneyearned += 700;
        moneyearnedtxt += 700;
        ticketsearned = 6;
        ekeysearned = 1;
        break;
      }
      case "7": {
        botcar = lodash.sample(bot7cars);
        moneyearned += 800;
        moneyearnedtxt += 800;
        ticketsearned = 7;
        ekeysearned = 1;
        rkeysearned = 4;
        break;
      }
    }
    if (prestige) {
      let mult = require("../data/prestige.json")[prestige].Mult;

      let multy = mult * moneyearned;

      moneyearned = moneyearned += multy;
    }
    let usables = userdata.using;

    let energytimer = cooldowndata.energydrink;
    if (usables.includes("energy drink")) {
      let timeout = 600000;
      if (timeout - (Date.now() - energytimer) > 0) {
        // do nothing?
      } else {
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $pull: {
              using: "energy drink",
            },
          }
        );
      }

      userdata.save();
    }
    if (usables.includes("energy drink")) {
      ticketsearned = ticketsearned * 2;
    }
    let sponsortimer = cooldowndata.sponsor;
    if (usables.includes("sponsor")) {
      let timeout = 600000;
      if (timeout - (Date.now() - sponsortimer) > 0) {
        // do nothing?
      } else {
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $pull: {
              using: "sponsor",
            },
          }
        );
        userdata.save();
      }
    }
    if (usables.includes("sponsor")) {
      moneyearned = moneyearned * 2;
      moneyearnedtxt = moneyearnedtxt * 2;
    }

    let racelevel = userdata.racerank;

    cooldowndata.racing = Date.now();
    cooldowndata.save();

    let newrankrequired = racelevel * 100;
    if (prestige >= 3) {
      newrankrequired * 2;
    } else if (prestige >= 5) {
      newrankrequired * 3;
    }

    let user1carspeed = selected.Speed;
    let user1carzerosixty = selected.Acceleration;
    let user1carhandling = selected.Handling;

    let handling = user1carhandling;

    let zero2sixtycar = selected.Acceleration;
    let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"];
    let newhandling = handling / 20;
    let othernewhandling = cars.Cars[botcar.toLowerCase()].Handling / 20;
    let new60 = user1carspeed / zero2sixtycar;
    let new62 = cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty;
    let driftscore = selected.Drift;

    Number(user1carspeed);
    Number(cars.Cars[botcar.toLowerCase()].Speed);
    Number(new60);
    Number(new62);
    let hp = user1carspeed + newhandling;
    hp - driftscore;
    let hp2 = cars.Cars[botcar.toLowerCase()].Speed + othernewhandling;
    let userhelmet = userdata.helmet;
    userhelmet = userhelmet.toLowerCase();
    let helmets = require("../data/pfpsdb.json");
    let actualhelmet = helmets.Pfps[userhelmet.toLowerCase()];
    let semote = emotes.speed;
    let hemote = emotes.handling;
    let zemote = emotes.zero2sixty;
    let cemote = emotes.cash;
    let rpemote = emotes.rp;

    let embed = new EmbedBuilder()
      .setTitle("3...2...1....GO!")
      .addFields([
        {
          name: `${actualhelmet.Emote} ${selected.Emote} ${selected.Name}`,
          value: `${semote} Speed: ${user1carspeed} MPH\n\n${zemote} 0-60: ${user1carzerosixty}s\n\n${hemote} Handling: ${handling}`,
          inline: true,
        },
        {
          name: `🤖 ${cars.Cars[botcar.toLowerCase()].Emote} ${
            cars.Cars[botcar.toLowerCase()].Name
          }`,
          value: `${semote} Speed: ${
            cars.Cars[botcar.toLowerCase()].Speed
          } MPH\n\n${zemote} 0-60: ${otherzero2sixty}s\n\n${hemote} Handling: ${
            cars.Cars[botcar.toLowerCase()].Handling
          }`,
          inline: true,
        },
      ])
      .setColor(colors.blue)
      .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
    let msg = await interaction.reply({ embeds: [embed] });
    let randomnum = randomRange(2, 4);
    if (randomnum == 2) {
      setTimeout(() => {
        embed.setDescription("Great launch!");
        embed.addFields([{ name: "Bonus", value: "$100" }]);
        moneyearnedtxt += 100;
        userdata.cash += 100;
        tracklength += 1;
        interaction.editReply({ embeds: [embed] });
      }, 2000);
    }

    let tracklength = 0;
    let tracklength2 = 0;
    tracklength += new60;
    tracklength2 += new62;

    let nitro = selected.Nitro;

    if (nitro) {
      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("boost")
          .setEmoji(emotes.boost)
          .setLabel("Boost")
          .setStyle("Secondary")
      );
      interaction.editReply({ components: [row] });

      let filter = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };

      const collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 10000,
      });

      collector.on("collect", async (i) => {
        if (i.customId.includes("boost")) {
          let boost = partdb.Parts[nitro.toLowerCase()].AddedBoost;
          tracklength += parseInt(boost);
          i.update({ content: "Boosting!", embeds: [embed] });
          selected.Nitro = null;
        }
      });
    }

    let timer = 0;
    let x = setInterval(() => {
      tracklength += hp;
      tracklength2 += hp2;
      timer++;

      if (timer >= 15) {
        if (tracklength > tracklength2) {
          clearInterval(x);
          embed.addFields([{ name: "Results", value: "Won" }]);
          if (global.double == true) {
            moneyearned = moneyearned += moneyearned;
            embed.addFields([doubleCashWeekendField]);
            moneyearnedtxt = `${moneyearned}`;
          }
          if (cars.Cars[selected.Name.toLowerCase()].StatTrack) {
            selected.Wins += 1;
          }
          let earnings = [];

          earnings.push(`${cemote} $${moneyearnedtxt}`);
          earnings.push(`${rpemote} ${ticketsearned} RP`);
          let ckemote = emotes.ckey;
          let rkemote = emotes.rkey;
          let ekemote = emotes.ekey;
          if (ckeysearned >= 1) {
            earnings.push(`${ckeysearned} ${ckemote} keys`);
            userdata.ckeys += ckeysearned;
          }
          if (rkeysearned >= 1) {
            earnings.push(`${rkeysearned} ${rkemote} keys`);
            userdata.rkeys += rkeysearned;
          }
          if (ekeysearned >= 1) {
            earnings.push(`${ekeysearned} ${ekemote} keys`);
            userdata.ekeys += ekeysearned;
          }
          if (selected.Name.includes("Bugatti") && bot == "6") {
            userdata.bugattiwins += 1;

            let hasbugatti = userdata.cars.filter(
              (car) => car.Name == "2024 Bugatti Mistral"
            );

            if (userdata.bugattiwins >= 1000 && !hasbugatti[0]) {
              let carindb = cars.Cars["2024 bugatti mistral"];
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
              userdata.cars.push(carobj);
              earnings.push(
                `<:bugatti:931012624110460979> 2024 Bugatti Mistral`
              );
            }
          }
          embed.addFields([
            { name: "Earnings", value: `${earnings.join("\n")}` },
          ]);
          interaction.editReply({ embeds: [embed] });

          if (range) {
            range -= 1;
          }
          userdata.cash += Number(moneyearned);
          userdata.racexp += 10;
          userdata.rp2 += ticketsearned;
          if (userdata.racexp >= newrankrequired) {
            userdata.racerank += 1;
            interaction.channel.send(
              `${user}, you just ranked up your race skill to ${db.fetch(
                `racerank_${uid}`
              )}!`
            );
          }

          userdata.save();

          return;
        } else if (tracklength < tracklength2) {
          embed.addFields([{ name: "Results", value: "Lost" }]);
          interaction.editReply({ embeds: [embed] });
          clearInterval(x);
          if (range) {
            range -= 1;
          }

          return;
        } else if (tracklength == tracklength2) {
          embed.addFields([{ name: "Results", value: "Tie" }]);
          interaction.editReply({ embeds: [embed] });
          clearInterval(x);
          if (range) {
            range -= 1;
          }

          return;
        }
      }
    }, 1000);
    function randomRange(min, max) {
      return Math.round(Math.random() * (max - min)) + min;
    }
  },
};
