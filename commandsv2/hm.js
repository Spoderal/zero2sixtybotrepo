const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");

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
    let moneyearnedtxt = 150;
    let uid = interaction.user.id;
    let userdata = await User.findOne({ id: uid });
    let cooldowndata =
      (await Cooldowns.findOne({ id: uid })) || new Cooldowns({ id: uid });
    let idtoselect = interaction.options.getString("car");
    if (!idtoselect)
      return interaction.reply(
        "Specify an id! Use /ids select [id] [car] to select a car!"
      );
    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return interaction.reply({ embeds: [errembed] });
    }
    let bot = interaction.options.getString("tier");
    let botlist = ["1", "2", "3", "4", "5", "6", "7"];
    let timeout = 60000;
    if (userdata.patron && userdata.patron.tier == 1) {
      timeout = 30000;
    } else if (userdata.patron && userdata.patron.tier == 2) {
      timeout = 15000;
    } else if (userdata.patron && userdata.patron.tier == 3) {
      timeout = 5000;
    } else if (userdata.patron && userdata.patron.tier == 4) {
      timeout = 5000;
    }
    let botcar = null;
    let racing = cooldowndata.hm;

    let prestige = userdata.prestige;
    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return interaction.reply(
        `Please wait ${time} before half mile racing again.`
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
    ];
    let bot7cars = [
      "2021 bugatti bolide",
      "2013 lamborghini veneno",
      "2020 koenigsegg regera",
      "2020 bugatti divo",
    ];
    let errorembed = new discord.EmbedBuilder()
      .setTitle("❌ Error!")
      .setColor(colors.blue);
    if (!user1cars) {
      errorembed.setDescription("You dont have any cars!");
      return interaction.reply({ embeds: [errorembed] });
    }

    if (!botlist.includes(bot.toLowerCase()) && user1cars.includes(selected)) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, 6 and 7"
      );
      return interaction.reply({ embeds: [errorembed] });
    }
    if (!botlist.includes(bot.toLowerCase()) && !selected) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, 6 and 7"
      );
      return interaction.reply({ embeds: [errorembed] });
    }

    if (!cars.Cars[selected.Name.toLowerCase()]) {
      errorembed.setDescription("Thats not an available car!");
      return interaction.reply({ embeds: [errorembed] });
    }

    if (cars.Cars[selected.Name.toLowerCase()].Junked && bot !== "rust") {
      return interaction.reply("This car is too junked to race, sorry!");
    }

    let range = selected.Range;
    if (cars.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }
    let ticketsearned;
    let bankrand;
    let bankinc;
    switch (bot) {
      case "1": {
        botcar = lodash.sample(bot1cars);
        ticketsearned = 2;
        break;
      }
      case "2": {
        botcar = lodash.sample(bot2cars);
        moneyearned += 150;
        moneyearnedtxt += 150;
        ticketsearned = 3;
        break;
      }
      case "3": {
        botcar = lodash.sample(bot3cars);
        moneyearned += 300;
        moneyearnedtxt += 300;
        ticketsearned = 4;
        break;
      }
      case "4": {
        botcar = lodash.sample(bot4cars);
        moneyearned += 500;
        moneyearnedtxt += 500;
        ticketsearned = 4;
        break;
      }
      case "5": {
        botcar = lodash.sample(bot5cars);
        moneyearned += 600;
        moneyearnedtxt += 600;
        ticketsearned = 5;
        break;
      }
      case "6": {
        let barnrandom = randomRange(1, 6);
        botcar = lodash.sample(bot6cars);
        moneyearned += 750;
        moneyearnedtxt += 750;
        ticketsearned = 6;
        bankrand = randomRange(1, 3);
        if (barnrandom == 3) {
          bankinc = 1;
        }

        break;
      }
      case "7": {
        botcar = lodash.sample(bot7cars);
        moneyearned += 1100;
        moneyearnedtxt += 1100;
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
      moneyearnedtxt = moneyearnedtxt * 2;
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

    let zero2sixtycar = selected.Acceleration;
    let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"];
    let newhandling = handling / 20;
    let othernewhandling = cars.Cars[botcar.toLowerCase()].Handling / 20;
    let new60 = user1carspeed / zero2sixtycar;
    let new62 = cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty;
    let driftscore = selected.Drift;

    let semote = emotes.speed;
    let hemote = emotes.handling;
    let zemote = emotes.zero2sixty;
    let cemote = emotes.cash;
    let rpemote = emotes.rp;

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

    let embed = new discord.EmbedBuilder()
      .setTitle("3...2...1....GO!")
      .addFields([
        {
          name: `${actualhelmet.Emote} ${
            cars.Cars[selected.Name.toLowerCase()].Emote
          } ${cars.Cars[selected.Name.toLowerCase()].Name}`,
          value: `${semote} Speed: ${user1carspeed} MPH\n\n${zemote} 0-60: ${user1carzerosixty}s\n\n${hemote} Handling: ${user1carhandling}`,
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
        embed.addFields([{ name: "Bonus", value: "$50" }]);
        moneyearnedtxt += 50;
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
    let row = new discord.ActionRowBuilder();
    if (nitro) {
      row.addComponents(
        new discord.ButtonBuilder()
          .setCustomId("boost")
          .setEmoji(emotes.boost)
          .setLabel("Boost")
          .setStyle("Secondary")
      );
      msg.edit({ components: [row] });

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

      if (timer >= 20) {
        if (tracklength > tracklength2) {
          clearInterval(x);
          embed.addFields([{ name: "Results", value: "Won" }]);
          if (userdata.cashgain == "10") {
            let calccash = moneyearned * 0.1;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata.cashgain == "15") {
            let calccash = moneyearned * 0.15;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata.cashgain == "20") {
            let calccash = moneyearned * 0.2;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata.cashgain == "25") {
            let calccash = moneyearned * 0.25;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata.cashgain == "50") {
            let calccash = moneyearned * 0.5;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          }

          let earningsresult = [];
          if (cars.Cars[selected.Name.toLowerCase()].StatTrack) {
            selected.Wins += 1;
          }
          earningsresult.push(`$${moneyearned}`);
          earningsresult.push(`${rpemote} ${ticketsearned} RP`);
          if (bot == "6" || bot == "7") {
            earningsresult.push(`Wheel Spin Earned!`);
            userdata.wheelspins += 1;
          }
          if (bankinc == 1) {
            let itemdb = require("../data/items.json");
            let emote = itemdb.Collectable[0]["bank increase"].Emote;

            earningsresult.push(`${emote} Bank Increase Earned!`);

            userdata.items.push("bank increase");
          }

          embed.addFields([
            {
              name: "Earnings",
              value: `${cemote} ${earningsresult.join("\n")}`,
            },
          ]);

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
