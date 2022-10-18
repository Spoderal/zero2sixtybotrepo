const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { tipFooterRandom } = require("../common/tips");
const { randomRange, convertMPHtoKPH } = require("../common/utils");

let bot1cars = [
  "1995 mazda miata",
  "1991 toyota mr2",
  "2002 pontiac firebird",
  "1999 honda civic si",
  "1997 acura integra",
  "2002 ford mustang",
];
let bot2cars = [
  "2014 hyundai genesis coupe",
  "2008 nissan 350z",
  "2008 nissan 350z",
  "2010 ford mustang",
  "1989 chevy camaro",
  "1996 nissan 300zx twin turbo",
  "2004 subaru wrx sti",
];
let bot3cars = [
  "2020 porsche 718 cayman",
  "2015 lotus exige sport",
  "2011 audi rs5",
  "2023 nissan z",
  "2018 kia stinger",
  "2012 dodge charger srt8",
];
let bot4cars = [
  "2015 mercedes amg gts",
  "2016 alfa romeo giulia",
  "2021 porsche 911 gt3",
  "2017 ford gt",
  "2021 nissan gtr",
  "2013 lexus lfa",
];
let bot5cars = [
  "2014 lamborghini huracan",
  "2014 mclaren 12c",
  "2018 audi r8",
  "2020 mclaren 570s",
  "2020 aston martin vantage",
];
let bot6cars = [
  "2010 ferrari 458 italia",
  "2018 lamborghini aventador s",
  "2016 aston martin vulkan",
  "2013 mclaren p1",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cashcup")
    .setDescription("Race up in the tiers for more cash!")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {
    let user = interaction.user;

    const cars = require("../data/cardb.json");
    let userdata =
      (await User.findOne({ id: interaction.user.id })) ||
      new User({ id: user.id });
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: user.id });

    let idtoselect = interaction.options.getString("car");
    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected!
          Use \`/ids select [id] [car to select]\` to select a car to your specified id!\n
          Example: \`/ids select 1 1995 mazda miata\``
        );
      return await interaction.reply({ embeds: [errembed] });
    }

    let timeout = 7200000;
    let racing = cooldowndata.cashcup || 0;

    let newcashcuptier = userdata.cashcuptier;

    let moneyearned = 75 * newcashcuptier;

    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return await interaction.reply(
        `Please wait ${time} before racing in the cash cup again.`
      );
    }

    let botcar;

    if (cars.Cars[selected.Name.toLowerCase()].Junked) {
      return await interaction.reply("This car is too junked to race, sorry!");
    }

    let range = selected.Range;
    if (cars.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return await interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }

    cooldowndata.cashcup = Date.now();
    cooldowndata.save();

    if (newcashcuptier <= 5) {
      botcar = lodash.sample(bot1cars);
    } else if (newcashcuptier <= 15) {
      botcar = lodash.sample(bot2cars);
    } else if (newcashcuptier <= 25) {
      botcar = lodash.sample(bot3cars);
    } else if (newcashcuptier <= 45) {
      botcar = lodash.sample(bot4cars);
    } else if (newcashcuptier <= 60) {
      botcar = lodash.sample(bot5cars);
    } else if (newcashcuptier >= 60) {
      botcar = lodash.sample(bot5cars);
    } else if (newcashcuptier >= 70) {
      botcar = lodash.sample(bot6cars);
    }

    let racelevel = userdata.racerank;

    let newrankrequired = racelevel * 200;
    let nitro = selected.Nitro;

    let user1carspeed = selected.Speed;

    let handling = selected.Handling;
    let botspeed = cars.Cars[botcar.toLowerCase()].Speed;
    let zero2sixtycar = selected.Acceleration;
    let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"];
    let newhandling = handling / 20;
    let othernewhandling = cars.Cars[botcar.toLowerCase()].Handling / 20;
    let new60 = user1carspeed / zero2sixtycar;
    let new62 = cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty;
    let driftscore = selected.Drift;

    Number(user1carspeed);
    Number(botspeed);
    Number(new60);
    Number(new62);
    let hp = user1carspeed + newhandling;
    hp - driftscore;
    let hp2 = botspeed + othernewhandling;
    let userhelmet = userdata.helmet;
    userhelmet = userhelmet.toLowerCase();
    let helmets = require("../data/pfpsdb.json");
    let actualhelmet = helmets.Pfps[userhelmet.toLowerCase()];
    let semote = emotes.speed;
    let hemote = emotes.handling;
    let zemote = emotes.zero2sixty;
    let cemote = emotes.cash;
    let settings = userdata.settings

    let speed = `${user1carspeed} MPH`
    let speed2 = `${botspeed} MPH`

      if(settings.ph == "KMH"){
        speed = `${Math.floor(convertMPHtoKPH(user1carspeed))} KMH`
        speed2 = `${Math.floor(convertMPHtoKPH(botspeed))} KMH`
      }
    let embed = new discord.EmbedBuilder()
      .setTitle(`Tier ${newcashcuptier} cash cup race in progress...`)
      .addFields([
        {
          name: `${actualhelmet.Emote} ${
            cars.Cars[selected.Name.toLowerCase()].Emote
          } ${cars.Cars[selected.Name.toLowerCase()].Name}`,
          value: `${semote} Speed: ${speed}\n\n${zemote} 0-60: ${selected.Acceleration}s\n\n${hemote} Handling: ${handling}`,
          inline: true,
        },
        {
          name: `🤖 ${cars.Cars[botcar.toLowerCase()].Emote} ${
            cars.Cars[botcar.toLowerCase()].Name
          }`,
          value: `${semote} Speed: ${speed2}\n\n${zemote} 0-60: ${otherzero2sixty}s\n\n${hemote} Handling: ${
            cars.Cars[botcar.toLowerCase()].Handling
          }`,
          inline: true,
        },
      ])
      .setColor(colors.blue)

      .setFooter(tipFooterRandom)
      .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
    let msg = await interaction.reply({ embeds: [embed], fetchReply: true });

    let randomnum = randomRange(1, 4);
    if (randomnum == 2) {
      setTimeout(() => {
        embed.setDescription("Great launch!");
        embed.addFields([{ name: "Bonus", value: "$100" }]);
        hp += 1;
        userdata.cash += 100;
        interaction.editReply({ embeds: [embed] });
      }, 2000);
    }

    let tracklength = 0;
    tracklength += new62;
    let tracklength2 = 0;
    tracklength2 += new60;
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

      if (timer >= 10) {
        clearInterval(x);

        if (tracklength > tracklength2) {
          embed.setTitle(`Tier ${newcashcuptier} cash cup race won!`);
          let earningsresult = [];

          earningsresult.push(`$${moneyearned}`);
          earningsresult.push(`New cash cup tier: ${(newcashcuptier += 1)}`);
          earningsresult.push(`+1Race Rank`);

          userdata.racerank += 1;
          embed.addFields([
            {
              name: "Earnings",
              value: `${cemote} ${earningsresult.join("\n")}`,
            },
          ]);

          interaction.editReply({ embeds: [embed] });

          userdata.cashcuptier += 1;
          userdata.cash += Number(moneyearned);

          userdata.racexp += 25;
          if (cars.Cars[selected.Name.toLowerCase()].Electric) {
            if (range > 0) {
              selected.Range -= 1;
            }
          }
          if (cars.Cars[selected.Name.toLowerCase()].StatTrack) {
            selected.Wins += 1;
          }
          userdata.save();

          return;
        } else if (tracklength < tracklength2) {
          embed.setTitle(`Tier ${newcashcuptier} cash cup race lost!`);
          if (newcashcuptier > 1) {
            embed.setDescription(
              `You got set back to tier ${newcashcuptier - 1}`
            );
            userdata.cashcuptier -= 1;
          }
          userdata.save();

          clearInterval(x);
          if (cars.Cars[selected.Name.toLowerCase()].Electric) {
            if (range > 0) {
              selected.Range -= 1;
            }
          }
          interaction.editReply({ embeds: [embed] });
          return;
        } else if (tracklength == tracklength2) {
          embed.setTitle(`Tier ${newcashcuptier} bot race tied!`);
          clearInterval(x);
          if (cars.Cars[selected.Name.toLowerCase()].Electric) {
            if (range > 0) {
              selected.Range -= 1;
            }
          }
          userdata.save();
          interaction.editReply({ embeds: [embed] });
          return;
        }
      }
    }, 1000);
  },
};
