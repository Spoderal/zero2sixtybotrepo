const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const partdb = require("../data/partsdb.json");
const Global = require("../schema/global-schema");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { tipFooterRandom } = require("../common/tips");
const { doubleCashWeekendField } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("training")
    .setDescription("Train your driving skills")
    .addStringOption((option) =>
      option
        .setName("tier")
        .setDescription("The bot tier to race")
        .setRequired(true)
        .addChoices(
          { name: "Tier 1", value: "1" },
          { name: "Tier 2", value: "2" },
          { name: "Tier 3", value: "3" }
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

    let moneyearned = 50;
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
    let botlist = ["1", "2", "3"];
    let timeout = 45000;
    let botcar = null;
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
    let bot1cars = ["1995 mazda miata", "1995 mazda miata"];
    let bot2cars = ["2014 hyundai genesis coupe", "2008 nissan 350z"];
    let bot3cars = ["2020 porsche 718 cayman", "2015 lotus exige sport"];

    let botdupgrades = randomRange(5, 25);
    let botemote;

    let prestige = userdata.prestige;
    let errorembed = new discord.EmbedBuilder()
      .setTitle("❌ Error!")
      .setColor(colors.blue);

    if (!botlist.includes(bot.toLowerCase())) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, 6, 7 and 8"
      );
      return await interaction.reply({ embeds: [errorembed] });
    }

    if (!cars.Cars[selected.Name.toLowerCase()]) {
      errorembed.setDescription("Thats not an available car!");
      return await interaction.reply({ embeds: [errorembed] });
    }

    if (cars.Cars[selected.Name.toLowerCase()].Junked && bot !== "rust") {
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
    let weekytask1 = userdata.weeklytask;
    let ticketsearned;
    let classd;
    let barnmaps;
    let ubarnmaps;
    let tracklength = 0;
    switch (bot) {
      case "1": {
        botcar = lodash.sample(bot1cars);
        ticketsearned = 1;
        classd = "1";
        botemote = emotes.botTier1;
        break;
      }

      case "2": {
        botcar = lodash.sample(bot2cars);
        moneyearned += 150;
        // moneyearnedtxt += 150;
        ticketsearned = 2;
        classd = "2";
        botemote = emotes.botTier2;

        break;
      }
      case "3": {
        botcar = lodash.sample(bot3cars);
        moneyearned += 300;
        // moneyearnedtxt += 300;
        ticketsearned = 3;
        classd = "3";
        botemote = emotes.botTier3;

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

    cooldowndata.racing = Date.now();
    cooldowndata.save();
    let newrankrequired = racelevel * 200;
    if (prestige >= 3) {
      newrankrequired * 2;
    } else if (prestige >= 5) {
      newrankrequired * 3;
    }
    let user1carspeed = selected.Speed;
    let user1carzerosixty = selected.Acceleration;
    let user1carhandling = selected.Handling;

    let userhelmet = userdata.helmet;
    userhelmet = userhelmet.toLowerCase();
    let helmets = require("../data/pfpsdb.json");
    let actualhelmet = helmets.Pfps[userhelmet.toLowerCase()];
    let driftscore = selected.Drift;
    let botspeed = cars.Cars[botcar.toLowerCase()].Speed;
    let zero2sixtycar = selected.Acceleration;
    let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"];
    let newhandling = user1carhandling / 20;
    let othernewhandling = cars.Cars[botcar.toLowerCase()].Handling / 20;
    let new60 = user1carspeed / zero2sixtycar;
    let new62 = cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty;
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
    let embed = new discord.EmbedBuilder()
      .setTitle(`Tier ${classd} bot race in progress...`)
      .addFields([
        {
          name: `${actualhelmet.Emote} ${selected.Emote} ${selected.Name}`,
          value: `${semote} Power: ${user1carspeed}\n\n${zemote} 0-60: ${user1carzerosixty}s\n\n${hemote} Handling: ${user1carhandling}`,
          inline: true,
        },
        {
          name: `${botemote} ${cars.Cars[botcar.toLowerCase()].Emote} ${
            cars.Cars[botcar.toLowerCase()].Name
          }`,
          value: `${semote} Power: ${botspeed}\n\n${zemote} 0-60: ${otherzero2sixty}s\n\n${hemote} Handling: ${
            cars.Cars[botcar.toLowerCase()].Handling
          }`,
          inline: true,
        },
      ])
      .setColor(colors.blue)

      .setFooter(tipFooterRandom)
      .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("chase")
        .setEmoji("🚔")
        .setLabel("Chase")
        .setStyle("Secondary")
    );
    let msg = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
      components: [row],
    });
    let filter2 = (btnInt) => {
      return interaction.user.id !== btnInt.user.id;
    };
    const collector2 = msg.createMessageComponentCollector({
      filter: filter2,
      time: 10000,
    });

    if (selected.Nitro) {
      row.addComponents(
        new ButtonBuilder()
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
          let boost = partdb.Parts.t1nitro.AddedBoost;

          tracklength += parseInt(boost);
          i.update({ content: "Boosting!", embeds: [embed] });
          selected.Nitro = null;
          userdata.save();
        }
      });
    }
    collector2.on("collect", async (r, user) => {
      user = r.user;

      if (r.customId.includes("chase")) {
        let userid = r.user.id;

        let userdatacop = await User.findOne({ id: userid });

        let job = userdatacop.job;

        if (!job || job.Type !== "police") {
          // do nothing?
        }
        let policejobs = job.cooldown;
        let timeout2 = 10800000;
        let ispolice = false;
        await r.deferUpdate();
        if (policejobs !== null && timeout2 - (Date.now() - policejobs) > 0) {
          let time = ms(timeout2 - (Date.now() - policejobs), {
            compact: true,
          });
          ispolice = false;
          user.send({
            content: `Please wait ${time} before chasing users again`,
          });
        } else {
          msg.channel.send(
            `🚨${user}, what car via id would you like to chase ${interaction.user.username} in?🚨`
          );

          let filter2 = (m = discord.Message) => {
            return m.author.id === user.id;
          };
          let collectorp = interaction.channel.createMessageCollector({
            filter: filter2,
            max: 1,
            time: 1000 * 10,
          });
          let idtoselectcop;
          let selected2;
          collectorp.on("collect", async (msg) => {
            if (job) {
              idtoselectcop = msg.content;
              let filteredcar2 = userdatacop.cars.filter(
                (car) => car.ID == idtoselectcop
              );
              selected2 = filteredcar2[0] || "No ID";
              if (!selected2 == "No ID") {
                let errembed = new discord.EmbedBuilder()
                  .setTitle("Error!")
                  .setColor(colors.discordTheme.red)
                  .setDescription(
                    `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
                  );
                return await interaction.reply({ embeds: [errembed] });
              }

              if (!cars.Cars[selected2.Name.toLowerCase()].Police) {
                ispolice = false;
                return msg.reply("Thats not a police car!");
              }

              if (bot < cars.Cars[selected2.Name.toLowerCase()].Police) {
                ispolice = false;

                return msg.reply(
                  `${user}, you cant use this police car for this low of a tier!`
                );
              }
              ispolice = true;

              if (ispolice) {
                let policespeed = selected2.Speed;

                let policehandling = selected2.Handling;
                let police60 = selected2.Acceleration;
                let newhandlingp = policehandling / 20;
                let poice060 = policespeed / police60;

                embed.addFields([
                  {
                    name: `🚨${user.username}'s ${
                      cars.Cars[selected2.toLowerCase()].Emote
                    } ${cars.Cars[selected2.toLowerCase()].Name}`,
                    value: `Speed: ${policespeed}\n\n0-60: ${police60}s`,
                    inline: true,
                  },
                ]);
                interaction.editReply({ embeds: [embed] });

                Number(user1carspeed);

                Number(poice060);
                let php = policespeed + newhandlingp;
                let policelength = 600;
                policelength += poice060;
                let items2 = userdatacop.items;

                if (items2 && items2.includes("roadblock")) {
                  embed.addFields([
                    {
                      name: "Item Used!",
                      value:
                        "The police set up a roadblock! Your car has been slowed down.",
                    },
                  ]);
                  itemusedp = true;
                  await User.findOneAndUpdate(
                    {
                      id: userid,
                    },
                    {
                      $pull: {
                        items: "roadblock",
                      },
                    }
                  );
                }

                policelen = policelength;
                policeuser = user;
                userdatacop.job.cooldown = Date.now();
                userdatacop.save();
                y = setInterval(() => {
                  policelength += php;
                  policelen = policelength;
                }, 1000);
              }
            }
          });
        }
      }
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
        collector2.stop();
        if (policelen) {
          if (tracklength > policelen) {
            clearInterval(y);
            embed.addFields([
              { name: `Escaped from the cops!`, value: `Bonus: $200` },
            ]);

            userdata.cash += 200;

            interaction.editReply({ embeds: [embed] });
          } else if (policelen > tracklength) {
            let userid = interaction.user.id;
            let userdatacop = await User.findOne({ id: userid });
            let job = userdatacop.job;
            let jobsdb = require("../data/jobs.json");
            let num = job.Number;
            let salary = job.Salary;
            let actjob = job.Job;
            let addednum = (num += 1);
            let requiredxp;
            let jobdb = jobsdb.Jobs[actjob.toLowerCase()];
            if (jobsdb.Jobs[actjob].Ranks[addednum]) {
              requiredxp = jobsdb.Jobs[actjob].Ranks[addednum].XP;
            } else {
              requiredxp = "MAX";
            }
            let xp2 = randomRange(15, 25);

            embed.addFields([
              { name: `Busted!`, value: `No earnings from this race` },
            ]);

            if (requiredxp !== "MAX") {
              db.add(`job_${policeuser.id}.EXP`, xp2);
            }

            if (
              requiredxp !== "MAX" &&
              db.fetch(`job_${policeuser.id}.EXP`) >= requiredxp
            ) {
              msg.channel.send(
                `You just ranked up to ${jobsdb.Jobs[actjob].Ranks[addednum].Name}!`
              );
              db.set(`job_${policeuser.id}`, {
                Number: addednum,
                Rank: jobdb.Ranks[`${addednum}`].Name,
                EXP: 0,
                Salary: jobdb.Ranks[`${addednum}`].Salary,
                Timeout: jobdb.Ranks[`${addednum}`].Time,
                Job: actjob,
              });
            }
            userdatacop.cash += salary;
            userdatacop.save();
            msg.reply(
              `You've completed your job duties and earned yourself $${salary}, and ${xp2} XP`
            );
            return interaction.editReply({ embeds: [embed] });
          }
        }

        if (tracklength > tracklength2) {
          if (userdata.cashgain == "10") {
            let calccash = moneyearned * 0.1;
            // moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata.cashgain == "15") {
            let calccash = moneyearned * 0.15;
            // moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata.cashgain == "20") {
            let calccash = moneyearned * 0.2;
            // moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata.cashgain == "25") {
            let calccash = moneyearned * 0.25;
            // moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata.cashgain == "50") {
            let calccash = moneyearned * 0.5;
            // moneyearnedtxt += calccash;
            moneyearned += calccash;
          }
          if (using.includes("trophy")) {
            moneyearned = moneyearned * 2;
            // moneyearnedtxt = `${moneyearned} *with x2 multiplier*`;
          }

          embed.setTitle(`Tier ${classd} bot race won!`);

          if (cars.Cars[selected.Name.toLowerCase()].StatTrack) {
            selected.Wins += 1;
            userdata.save();
          }
          let earningsresult = [];
          if (interaction.guild.id == "931004190149460048") {
            let calccash = moneyearned * 0.05;
            // moneyearnedtxt += calccash;
            moneyearned += calccash;
          }
          earningsresult.push(`$${moneyearned}`);
          earningsresult.push(`${rpemote} ${ticketsearned} RP`);
          if (barnmaps) {
            earningsresult.push(`${barnmaps} Common Barn Maps`);
            userdata.cmaps += barnmaps;
          }

          if (
            weekytask1 &&
            !weekytask1.completed &&
            weekytask1.task == "Win a tier 3 bot race" &&
            bot == "3"
          ) {
            earningsresult.push(
              `${interaction.user}, you've completed your weekly task "${weekytask1.task}"!`
            );
            userdata.weeklytask.completed = true;
            userdata.cash += userdata.weeklytask.reward;
            userdata.save();
          }

          if (cars.Cars[selected.Name.toLowerCase()].Emote == emotes.ferrari) {
            earningsresult.push(`1 <:ferrari:931011838374727730> Ferrari Key`);
            userdata.fkeys += 1;
          }
          userdata.rp2 += ticketsearned;
          userdata.cash += Number(moneyearned);
          userdata.racexp += 25;

          let racerank2 = userdata.racerank;

          let reqxp = racerank2 * 100;

          if (userdata.racexp >= reqxp) {
            userdata.racerank += 1;
            earningsresult.push(
              `Ranked up your race rank to ${userdata.racerank}`
            );
            userdata.racexp = 0;
          }

          embed.addFields([
            {
              name: "Earnings",
              value: `${cemote} ${earningsresult.join("\n")}`,
            },
          ]);

          let globalvars = await Global.findOne();

          if (globalvars.double == true) {
            moneyearned = moneyearned += moneyearned;
            embed.addFields([doubleCashWeekendField]);
            // moneyearnedtxt = `$${moneyearned}`;
          }
          interaction.editReply({ embeds: [embed] });

          userdata.save();

          if (range > 0) {
            selected.Range -= 1;
            userdata.save();
          }

          return;
        } else if (tracklength < tracklength2) {
          embed.setTitle(`Tier ${classd} bot race lost!`);

          clearInterval(x);
          if (range > 0) {
            selected.Range -= 1;
            userdata.save();
          }
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

    function randomRange(min, max) {
      return Math.round(Math.random() * (max - min)) + min;
    }
  },
};
