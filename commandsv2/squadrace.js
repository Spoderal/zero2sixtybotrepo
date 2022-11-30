const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { randomRange, convertMPHtoKPH } = require("../common/utils");
const { userGetPatreonTimeout } = require("../common/user");
const { tipFooterRandom } = require("../common/tips");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const squadsdb = require("../data/squads.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("squadrace")
    .setDescription("Race a squad and rank up")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {
    const cars = require("../data/cardb.json");

    // let moneyearnedtxt = 50;
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: interaction.user.id });

    let idtoselect = interaction.options.getString("car");
    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    let bot = interaction.options.getString("tier");

    let timeout = userGetPatreonTimeout(userdata);

    let racing = cooldowndata.racing;
    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return await interaction.reply(
        `Please wait ${time} before racing again.`
      );
    }

    let semote = emotes.speed;
    let hemote = emotes.handling;
    let zemote = emotes.zero2sixty;
    let cemote = emotes.cash;
    let rpemote = emotes.rp;
    let tier = userdata.tier || 1;
    let botdupgrades = randomRange(5, 25);
    let botemote;

    let prestige = userdata.prestige;

    let range = selected.Range;
    if (cars.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return await interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }

    let ticketsearned;
    let classd;
    if (tier == 6) return interaction.reply("You've beaten all the squads!");
    let tracklength = 0;

    let squadsarr = [];
    for (let s in squadsdb.Squads) {
      let sq = squadsdb.Squads[s];
      squadsarr.push(sq);
    }

    let squadfiltered = squadsarr.filter((squad) => squad.Tier == tier);
    let sqlevels = userdata.squads || [
      { name: "flame squad", car: 0 },
      { name: "x squad", car: 0 },
    ];

    console.log(squadfiltered[0]);
    let sqlevelfiltered = sqlevels.filter(
      (sqt) => sqt.name == squadfiltered[0].Name.toLowerCase()
    );
    let moneyearned = squadfiltered[0].Reward;
    if (sqlevelfiltered[0].car >= 4) {
      moneyearned = squadfiltered[0].BigReward;
    }
    if (prestige) {
      let mult = require("../data/prestige.json")[prestige].Mult;

      let multy = mult * moneyearned;

      moneyearned = moneyearned += multy;
    }
    let squadinfo = squadfiltered[0];
    let botcar = squadfiltered[0].Cars[sqlevelfiltered[0].car];
    let botcarindb = cars.Cars[botcar.toLowerCase()];
    botemote = squadinfo.Emote;
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
      // moneyearnedtxt = moneyearnedtxt * 2;
    }

    let racelevel = userdata.racerank;

    cooldowndata.racing = Date.now();
    cooldowndata.save();

    let newrankrequired = racelevel * 200;
    if (prestige >= 3) {
      newrankrequired * 2;
    } else if (prestige >= 5) {
      newrankrequired * 3;
    }
    let user1carspeed = parseInt(selected.Speed);
    let user1carzerosixty = parseInt(selected.Acceleration);
    let user1carhandling = parseInt(selected.Handling);

    let userhelmet = userdata.helmet;
    userhelmet = userhelmet.toLowerCase();
    let helmets = require("../data/pfpsdb.json");
    let actualhelmet = helmets.Pfps[userhelmet.toLowerCase()];
    let driftscore = selected.Drift;
    let botspeed = parseInt(cars.Cars[botcarindb.Name.toLowerCase()].Speed);
    let zero2sixtycar = parseInt(selected.Acceleration);
    let otherzero2sixty = parseInt(
      cars.Cars[botcarindb.Name.toLowerCase()]["0-60"]
    );
    let newhandling = user1carhandling / 20;
    let bothandling = parseInt(
      cars.Cars[botcarindb.Name.toLowerCase()].Handling
    );
    let othernewhandling = bothandling / 20;
    let new60 = user1carspeed / zero2sixtycar;
    let new62 = botspeed / otherzero2sixty;
    let using = userdata.using;
    Number(user1carspeed);
    Number(botspeed);
    Number(new60);
    Number(new62);
    if (bot == "dclass") {
      botspeed += botdupgrades;
    }
    let hp = user1carspeed + newhandling;
    hp - driftscore;
    let hp2 = botspeed + othernewhandling;
    let y;
    let policeuser;
    let policelen;
    let itemusedp;
    let settings = userdata.settings;

    let speed = `${user1carspeed} MPH`;
    let speed2 = `${botspeed} MPH`;

    if (settings.ph == "KMH") {
      speed = `${Math.floor(convertMPHtoKPH(user1carspeed))} KMH`;
      speed2 = `${Math.floor(convertMPHtoKPH(botspeed))} KMH`;
    }
    let embed = new discord.EmbedBuilder()
      .setTitle(`${squadinfo.Name} race in progress...`)
      .addFields([
        {
          name: `${actualhelmet.Emote} ${selected.Emote} ${selected.Name}`,
          value: `${semote} Speed: ${speed}\n\n${zemote} 0-60: ${user1carzerosixty}s\n\n${hemote} Handling: ${user1carhandling}`,
          inline: true,
        },
        {
          name: `${botemote} ${
            cars.Cars[botcarindb.Name.toLowerCase()].Emote
          } ${cars.Cars[botcarindb.Name.toLowerCase()].Name}`,
          value: `${semote} Speed: ${speed2} MPH\n\n${zemote} 0-60: ${otherzero2sixty}s\n\n${hemote} Handling: ${
            cars.Cars[botcarindb.Name.toLowerCase()].Handling
          }`,
          inline: true,
        },
      ])
      .setColor(colors.blue)
      .setFooter(tipFooterRandom)
      .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");

    let msg = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });

    let randomnum = randomRange(1, 4);
    if (randomnum == 2) {
      setTimeout(() => {
        embed.setDescription("Great launch!");
        embed.addFields([{ name: "Bonus", value: "$100" }]);
        hp += 1;
        // moneyearnedtxt += 100;
        userdata.cash += 100;
        interaction.editReply({ embeds: [embed] });
      }, 2000);
    }

    tracklength += new62;
    let tracklength2 = 0;
    tracklength2 += new60;
    if (itemusedp == true) {
      itemusedp = false;
      tracklength - 20;
    }

    let timer = 0;
    let x = setInterval(async () => {
      tracklength += hp;
      tracklength2 += hp2;
      timer++;

      if (timer >= 10) {
        clearInterval(x);
        clearInterval(y);

        if (tracklength > tracklength2) {
          if (using.includes("trophy")) {
            moneyearned = moneyearned * 2;
            // moneyearnedtxt = `${moneyearned} *with x2 multiplier*`;
          }

          embed.setTitle(`${squadinfo.Name} race won!`);

          if (cars.Cars[selected.Name.toLowerCase()].StatTrack) {
            selected.Wins += 1;
            userdata.save();
          }
          if (interaction.guild.id == "931004190149460048") {
            let calccash = moneyearned * 0.05;
            // moneyearnedtxt += calccash;
            moneyearned += calccash;
          }
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
          let newnum = (sqlevelfiltered[0].car += 1);
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "squads.$[squad].car": newnum,
              },
            },

            {
              arrayFilters: [
                {
                  "squad.name": squadinfo.Name.toLowerCase(),
                },
              ],
            }
          );

          let earningsresult = [];
          earningsresult.push(`$${moneyearned}`);

          userdata.cash += parseInt(moneyearned);
          userdata.update();
          let newlevel = sqlevels.filter(
            (sqt) => sqt.name == squadfiltered[0].Name.toLowerCase()
          );
          if (newlevel[0].car > 4) {
            userdata.tier += 1;
          }
          userdata.update();

          embed.addFields([
            {
              name: "Earnings",
              value: `${cemote} ${earningsresult.join("\n")}`,
            },
          ]);

          interaction.editReply({ embeds: [embed] });

          if (range > 0) {
            selected.Range -= 1;
          }

          userdata.save();

          return;
        } else if (tracklength < tracklength2) {
          let moneye = moneyearned / 5;
          embed.setTitle(`Race lost!`);

          embed.addFields([
            {
              name: "Earnings",
              value: `${cemote} $${moneye}`,
            },
          ]);
          userdata.cash += Number(moneye);

          clearInterval(x);
          if (range > 0) {
            selected.Range -= 1;
          }
          userdata.save();
          interaction.editReply({ embeds: [embed] });
          return;
        } else if (tracklength == tracklength2) {
          embed.setTitle(`Tier ${classd} bot race tied!`);
          clearInterval(x);
          if (range > 0) {
            selected.Range -= 1;
            userdata.save();
          }

          interaction.editReply({ embeds: [embed] });
          return;
        }
      }
    }, 1000);
  },
};
