const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wanted")
    .setDescription("Get away from the cops! (PRESTIGE 2)")
    .addStringOption((option) =>
      option
        .setName("tier")
        .setDescription("The police tier to run from")
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
    )
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("Optional")
        .setRequired(false)
        .addChoices({ name: "Chase", value: "chase" })
    ),
  async execute(interaction) {
    const cars = require("../data/cardb.json");

    let moneyearned = 400;
    let moneyearnedtxt = 400;

    let userdata = await User.findOne({ id: interaction.user.id });
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
    let chase = interaction.options.getString("options");

    let prestige = userdata.prestige;
    if (prestige < 2)
      return await interaction.reply(
        "You need to be prestige 2 to do this race!"
      );
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
    let user1cars = userdata.cars;
    let bot1cars = [
      "police 2009 corvette c6",
      "police 2012 dodge charger srt8",
    ];
    let bot2cars = ["police 2020 porsche 718 cayman", "police 2011 bmw m3"];
    let bot3cars = ["police 2008 bugatti veyron"];
    let job;
    if (chase == "chase") {
      job = userdata.job;

      if (job.Job !== "police" || !job)
        return await interaction.reply(`You're not a cop!`);
      let worked = job.worked;
      let timeoutj = job.Timeout;
      if (worked !== null && timeoutj - (Date.now() - worked) > 0) {
        let time = ms(timeoutj - (Date.now() - worked));
        let timeEmbed = new discord.EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(`You've already worked!\n\nWork again in ${time}.`);
        return await interaction.reply({ embeds: [timeEmbed] });
      }
      bot1cars = ["2014 hyundai genesis coupe", "2008 nissan 350z"];
      bot2cars = ["2020 porsche 718 cayman", "2011 bmw m3"];
      bot3cars = ["2008 bugatti veyron"];
    }

    let errorembed = new discord.EmbedBuilder()
      .setTitle("❌ Error!")
      .setColor(colors.blue);
    if (!user1cars) {
      errorembed.setDescription("You dont have any cars!");
      return await interaction.reply({ embeds: [errorembed] });
    }

    if (!botlist.includes(bot.toLowerCase())) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, and 3"
      );
      return await interaction.reply({ embeds: [errorembed] });
    }
    if (!botlist.includes(bot.toLowerCase()) && !cars.Cars[selected]) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, and 3"
      );
      return await interaction.reply({ embeds: [errorembed] });
    }
    if (!botlist.includes(bot.toLowerCase()) && user1cars.includes(selected)) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, and 3"
      );
      return await interaction.reply({ embeds: [errorembed] });
    }
    if (!botlist.includes(bot.toLowerCase()) && !selected) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, and 3"
      );
      return await interaction.reply({ embeds: [errorembed] });
    }

    if (!cars.Cars[selected.toLowerCase()]) {
      errorembed.setDescription("Thats not an available car!");
      return await interaction.reply({ embeds: [errorembed] });
    }

    // if (cars.Cars[selected.Name.toLowerCase()].Junked && restoration < 100) {
    //   return await interaction.reply("This car is too junked to race, sorry!");
    // }

    switch (bot) {
      case "1": {
        botcar = lodash.sample(bot1cars);
        break;
      }
      case "2": {
        botcar = lodash.sample(bot2cars);
        moneyearned += 300;
        moneyearnedtxt += 300;
        break;
      }
      case "3": {
        botcar = lodash.sample(bot3cars);
        moneyearned += 600;
        moneyearnedtxt += 600;
        break;
      }
    }

    let range = selected.Range;
    if (cars.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return await interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }

    let racelevel = userdata.racelevel;

    cooldowndata.racing = Date.now();
    cooldowndata.save();

    let newrankrequired = racelevel * 200;
    if (prestige >= 3) {
      newrankrequired * 2;
    } else if (prestige >= 5) {
      newrankrequired * 3;
    }

    let user1carspeed = selected.Speed;

    let handling = selected.Handling;

    let zero2sixtycar = selected.Acceleration;
    let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"];
    let newhandling = handling / 20;
    let othernewhandling = cars.Cars[botcar.toLowerCase()].Handling / 20;
    let new60 = user1carspeed / zero2sixtycar;
    let new62 = cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty;

    Number(user1carspeed);
    Number(cars.Cars[botcar.toLowerCase()].Speed);
    Number(new60);
    Number(new62);
    let hp = user1carspeed + newhandling;
    let hp2 = cars.Cars[botcar.toLowerCase()].Speed + othernewhandling;

    let embed = new discord.EmbedBuilder()
      .setTitle(`🚨Tier ${bot} chase in progress...🚨`)
      .addFields([
        {
          name: `Your ${cars.Cars[selected.toLowerCase()].Emote} ${
            cars.Cars[selected.toLowerCase()].Name
          }`,
          value: `Speed: ${user1carspeed}\n\n0-60: ${selected.Acceleration}`,
        },
        {
          name: `🚨${cars.Cars[botcar.toLowerCase()].Emote} ${
            cars.Cars[botcar.toLowerCase()].Name
          }`,
          value: `Speed: ${cars.Cars[botcar.toLowerCase()].Speed}\n\n0-60: ${
            cars.Cars[botcar.toLowerCase()]["0-60"]
          }`,
        },
      ])
      .setColor(colors.blue)
      .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
    let randomobstacle = randomRange(1, 3);
    let randomnum = randomRange(2, 4);
    let timeobs = randomobstacle * 1000;
    if (randomnum == 2) {
      setTimeout(() => {
        embed.setDescription("Great launch!");
        embed.addFields([{ name: "Bonus", value: "$100" }]);
        moneyearnedtxt += 100;
        userdata.cash += 100;
        hp += 1;
        interaction.editReply({ embeds: [embed] });
      }, 2000);
    }
    setTimeout(() => {
      interaction.channel.send("⛔ Obstacle! ⛔").then(async (emb) => {
        emb.react("🟢");
        emb.react("🚧");
        const filter = (_, u) => u.id === interaction.user.id;
        const collector = emb.createReactionCollector({ filter, time: 4000 });
        let gifs = [
          "https://c.tenor.com/foyTc4YBDWwAAAAC/ray-donovan-showtime.gif",
          "https://c.tenor.com/vBzDM0XpZVEAAAAC/crash-flip.gif",
          "https://bestanimations.com/media/police/1287902099police-animated-gif-21.gif",
        ];
        collector.on("collect", async (r, user) => {
          emb.reactions.cache.get(r.emoji.name).users.remove(user.id);
          emb.reactions.cache
            .get(r.emoji.name)
            .users.remove(interaction.client.user.id);
          if (r.emoji.name === "🚧") {
            if (chase == "chase") {
              return emb.edit("Crashed!");
            }
            emb.edit("🚨Busted!🚨");
          }
          if (r.emoji.name === "🟢") {
            embed.setImage(lodash.sample(gifs));
            emb.edit("✅ Avoided obstacle!");
            interaction.editReply({ embeds: [embed] });
          }
        });
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            if (chase == "chase") {
              return emb.edit("Crashed!");
            }
            return emb.edit("Busted!");
          }
        });
      });
    }, timeobs);
    let tracklength = 0;
    let tracklength2 = 0;
    tracklength += new60;
    tracklength2 += new62;

    let timer = 0;

    let x = setInterval(() => {
      tracklength += hp;
      tracklength2 += hp2;
      timer++;

      if (timer >= 10) {
        if (tracklength > tracklength2) {
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

          clearInterval(x);
          embed.setTitle(`Got away from Tier ${bot} police!`);
          if (chase == "chase") {
            userdata.job.worked = Date.now();
            embed.setTitle(`Caught Tier ${bot} racer!`);
            let job = userdata.job;
            let jobsdb = require("../data/jobs.json");
            let num = job.Number;
            let salary = job.Salary;
            let actjob = job.Job;
            let addednum = (num += 1);
            let requiredxp;
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
              job.EXP += 10;
            }

            userdata.cash += salary;
            interaction.channel.send(
              `You've completed your job duties and earned yourself $${salary}, and ${xp2} XP`
            );
            return interaction.editReply({ embeds: [embed] });
          }
          embed.addFields([{ name: `Earnings`, value: `$${moneyearnedtxt}` }]);

          interaction.editReply({ embeds: [embed] });
          userdata.cash += Number(moneyearned);
          userdata.racexp += 30;
          if (range) {
            range -= 1;
          }

          if (userdata.racexp >= newrankrequired) {
            userdata.racerank += 1;
            interaction.channel.send(
              `${interaction.user}, You just ranked up your race skill to ${userdata.racerank}!`
            );
          }
          userdata.save();

          return;
        } else if (tracklength < tracklength2) {
          embed.setTitle(`Busted!`);
          if (chase == "chase") {
            embed.setTitle("They got away!");
          }
          clearInterval(x);
          if (range) {
            range -= 1;
          }
          userdata.save();
          interaction.editReply({ embeds: [embed] });
          return;
        } else if (tracklength == tracklength2) {
          embed.setTitle(`Busted!`);
          if (chase == "chase") {
            embed.setTitle("They got away!");
          }
          clearInterval(x);
          if (range) {
            range -= 1;
          }
          userdata.save();
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
