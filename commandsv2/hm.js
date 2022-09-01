const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { userGetPatreonTimeout } = require("../common/user");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const { invisibleSpace, toCurrency } = require("../common/utils");

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
];
let bot7cars = [
  "2021 bugatti bolide",
  "2013 lamborghini veneno",
  "2020 koenigsegg regera",
  "2020 bugatti divo",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hm")
    .setDescription("Race a bot on the half mile")
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
    const cars = require("../data/cardb.json");
    let moneyearned = 150;
    let uid = interaction.user.id;
    let userdata = await User.findOne({ id: uid });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let cooldowndata =
      (await Cooldowns.findOne({ id: uid })) || new Cooldowns({ id: uid });

    let idtoselect = interaction.options.getString("car");
    if (!idtoselect)
      return await interaction.reply(
        "Specify an id! Use /ids select [id] [car] to select a car!"
      );

    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n
          **Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    let bot = interaction.options.getString("tier");
    let botlist = ["1", "2", "3", "4", "5", "6", "7"];

    const timeout = userGetPatreonTimeout(userdata);
    let botcar = null;
    let racing = cooldowndata.hm;

    let prestige = userdata.prestige;
    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return await interaction.reply(
        `Please wait ${time} before half mile racing again.`
      );
    }
    let user1cars = userdata.cars;

    let errorembed = new discord.EmbedBuilder()
      .setTitle("❌ Error!")
      .setColor(colors.blue);
    if (!user1cars) {
      errorembed.setDescription("You dont have any cars!");
      return await interaction.reply({ embeds: [errorembed] });
    }

    if (!botlist.includes(bot.toLowerCase()) && user1cars.includes(selected)) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, 6 and 7"
      );
      return await interaction.reply({ embeds: [errorembed] });
    }
    if (!botlist.includes(bot.toLowerCase()) && !selected) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, 6 and 7"
      );
      return await interaction.reply({ embeds: [errorembed] });
    }

    const selectedCarInfo = cars.Cars[selected.Name.toLowerCase()];

    if (!selectedCarInfo) {
      errorembed.setDescription("Thats not an available car!");
      return await interaction.reply({ embeds: [errorembed] });
    }

    if (selectedCarInfo.Junked && bot !== "rust") {
      return await interaction.reply("This car is too junked to race, sorry!");
    }

    let range = selected.Range;
    if (selectedCarInfo.Electric) {
      if (range <= 0) {
        return await interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }
    let ticketsearned;
    // let bankrand;
    let bankinc;
    let barnmaps;
    switch (bot) {
      case "1": {
        botcar = lodash.sample(bot1cars);
        ticketsearned = 2;
        break;
      }
      case "2": {
        botcar = lodash.sample(bot2cars);
        moneyearned += 150;
        ticketsearned = 3;
        break;
      }
      case "3": {
        botcar = lodash.sample(bot3cars);
        moneyearned += 300;
        ticketsearned = 4;
        break;
      }
      case "4": {
        botcar = lodash.sample(bot4cars);
        moneyearned += 500;
        ticketsearned = 4;
        break;
      }
      case "5": {
        botcar = lodash.sample(bot5cars);
        moneyearned += 600;
        ticketsearned = 5;
        barnmaps = 1;
        break;
      }
      case "6": {
        let barnrandom = randomRange(1, 6);
        botcar = lodash.sample(bot6cars);
        moneyearned += 750;
        ticketsearned = 6;
        // bankrand = randomRange(1, 3);
        if (barnrandom == 3) {
          bankinc = 1;
        }

        break;
      }
      case "7": {
        botcar = lodash.sample(bot7cars);
        moneyearned += 1100;
        ticketsearned = 10;

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
    }

    let racelevel = userdata.racerank;

    cooldowndata.hm = Date.now();
    cooldowndata.save();
    let newrankrequired = racelevel * 500;
    if (prestige >= 3) {
      newrankrequired * 2;
    } else if (prestige >= 5) {
      newrankrequired * 3;
    }

    let user1carspeed = selected.Speed;
    let user1carzerosixty = selected.Acceleration;
    let user1carhandling = selected.Handling;

    let handling = user1carhandling;

    const selectedBotCar = cars.Cars[botcar.toLowerCase()];

    let zero2sixtycar = selected.Acceleration;
    let otherzero2sixty = selectedBotCar["0-60"];
    let newhandling = handling / 20;
    let othernewhandling = selectedBotCar.Handling / 20;
    let new60 = user1carspeed / zero2sixtycar;
    let new62 = selectedBotCar.Speed / otherzero2sixty;
    let driftscore = selected.Drift;

    let semote = emotes.speed;
    let hemote = emotes.handling;
    let zemote = emotes.zero2sixty;
    let cemote = emotes.cash;
    let rpemote = emotes.rp;

    Number(user1carspeed);
    Number(selectedBotCar.Speed);
    Number(new60);
    Number(new62);
    let hp = user1carspeed + newhandling;
    hp - driftscore;
    let hp2 = selectedBotCar.Speed + othernewhandling;
    let userhelmet = userdata.helmet;
    userhelmet = userhelmet.toLowerCase();
    let helmets = require("../data/pfpsdb.json");
    let actualhelmet = helmets.Pfps[userhelmet.toLowerCase()];

    let embed = new discord.EmbedBuilder()
      .setTitle("3...2...1....GO!")
      .addFields([
        {
          name: `
            ${actualhelmet.Emote} ${selectedCarInfo.Emote} ${selectedCarInfo.Name}`,
          value: `${semote} Speed: ${user1carspeed} MPH\n
            ${zemote} 0-60: ${user1carzerosixty}s\n
            ${hemote} Handling: ${user1carhandling}
          `,
          inline: true,
        },
        {
          name: `🤖 ${selectedBotCar.Emote} ${selectedBotCar.Name}`,
          value: `${semote} Speed: ${selectedBotCar.Speed} MPH\n
          ${zemote} 0-60: ${otherzero2sixty}s\n
          ${hemote} Handling: ${selectedBotCar.Handling}`,
          inline: true,
        },
      ])
      .setColor(colors.blue)
      .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");

    let msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    let randomnum = randomRange(2, 4);
    if (randomnum == 2) {
      setTimeout(() => {
        embed.setDescription("Great launch!");
        embed.addFields([{ name: "Bonus", value: "$50" }]);
        userdata.cash += 50;
        tracklength += 1;
        interaction.editReply({ embeds: [embed] });
      }, 2000);
    }

    let tracklength = 0;
    let tracklength2 = 0;
    tracklength += new60;
    tracklength += new62;
    let nitro = selected.Nitro;
    if (nitro) {
      let row = new discord.ActionRowBuilder();
      row.addComponents(
        new discord.ButtonBuilder()
          .setCustomId("boost")
          .setEmoji(emotes.boost)
          .setLabel("Boost")
          .setStyle("Secondary")
      );
      msg.edit({ components: [row] });

      // Don't let them boost after a few second of the button being visible
      const miisedChanceTimer = setTimeout(() => {
        embed.setFooter({ text: "You missed the chance to boost!" });
        interaction.editReply({ embeds: [embed], components: [] });
      }, 3000);

      let filter = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };

      const collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 10000,
      });

      collector.on("collect", async (i) => {
        if (i.customId.includes("boost")) {
          clearTimeout(miisedChanceTimer);
          let boost = partdb.Parts[nitro.toLowerCase()].AddedBoost;
          tracklength += parseInt(boost);
          embed.setFooter({ text: "Boosting!!!" });
          await i.update({ embeds: [embed], components: [] });
          selected.Nitro = null;
          setTimeout(() => {
            embed.setFooter({ text: "Good boost timing!" });
            i.editReply({ embeds: [embed], components: [] });
          }, 3000);
        }
      });
    }

    let timer = 0;
    let x = setInterval(() => {
      tracklength += hp;
      tracklength2 += hp2;
      timer++;

      if (timer >= 20) {
        if (tracklength > tracklength2) {
          if (
            (userdata.patreon && userdata.patreon.tier == 1) ||
            (userdata.patreon && userdata.patreon.tier == 2)
          ) {
            let patronbonus = moneyearned * 1.5;

            moneyearned += patronbonus;
          }
          if (userdata.patreon && userdata.patreon.tier == 3) {
            let patronbonus = moneyearned * 2;

            moneyearned += patronbonus;
          }
          if (userdata.patreon && userdata.patreon.tier == 4) {
            let patronbonus = moneyearned * 4;

            moneyearned += patronbonus;
          }
          clearInterval(x);
          embed.addFields([{ name: "Results", value: "Won" }]);
          let calccash = moneyearned;
          moneyearned += calccash;

          let earningsresult = [];
          if (selectedCarInfo.StatTrack) {
            selected.Wins += 1;
          }
          earningsresult.push(toCurrency(moneyearned));
          earningsresult.push(`${rpemote} ${ticketsearned} RP`);
          if (bot == "6" || bot == "7") {
            earningsresult.push(`Wheel Spin Earned!`);
            userdata.wheelspins += 1;
          }
          if (barnmaps == 1) {
            earningsresult.push(`1 ${emotes.barnMapRare}`);
            userdata.rmaps += 1;
          }
          if (bankinc == 1) {
            let itemdb = require("../data/items.json");
            let emote = itemdb.Collectable[0]["bank increase"].Emote;

            earningsresult.push(`${emote} Bank Increase Earned!`);

            userdata.items.push("bank increase");
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
              earningsresult.push(
                `<:bugatti:931012624110460979> 2024 Bugatti Mistral`
              );
            }
          }

          embed.addFields([
            {
              name: "Earnings",
              value: `${cemote} ${earningsresult.join("\n")}`,
            },
          ]);
          embed.setFooter({ text: invisibleSpace });
          interaction.editReply({ embeds: [embed] });
          if (range && range > 0) {
            selected.Range -= 1;
          }

          userdata.cash += parseInt(moneyearned);
          userdata.racexp += 25;
          userdata.cash += parseInt(ticketsearned);
          if (userdata.racexp >= newrankrequired) {
            userdata.racerank += 1;
            earningsresult.push(
              `Ranked up your race rank to ${userdata.racerank}`
            );
            userdata.racexp = 0;
          }

          userdata.save();

          return;
        } else if (tracklength < tracklength2) {
          embed.addFields([{ name: "Results", value: "Lost" }]);
          embed.setFooter({ text: invisibleSpace });
          interaction.editReply({ embeds: [embed] });
          clearInterval(x);
          if (range && range > 0) {
            selected.Range -= 1;
            userdata.save();
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
