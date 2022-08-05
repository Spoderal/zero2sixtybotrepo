const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rallybot")
    .setDescription("Rally race a bot")
    .addStringOption((option) =>
      option
        .setName("tier")
        .setDescription("The bot tier to race")
        .setRequired(true)
        .addChoice("Tier 1", "1")
        .addChoice("Tier 2", "2")
        .addChoice("Tier 3", "3")
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

    let moneyearned = 200;
    let moneyearnedtxt = 200;

    let idtoselect = interaction.options.getString("car");
    let selected = db.fetch(`selected_${idtoselect}_${interaction.user.id}`);
    if (!selected)
      return interaction.reply(
        "That id doesn't have a car! Use /ids select [id] [car] to select it!"
      );
    let user = interaction.user;
    let bot = interaction.options.getString("tier");
    let botlist = ["1", "2", "3", "4", "5", "6"];
    let timeout = db.fetch(`timeout_${interaction.user.id}`) || 45000;
    let botcar = null;
    let racing = db.fetch(`racing_${user.id}`);

    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return interaction.reply(`Please wait ${time} before racing again.`);
    }
    let user1cars = db.fetch(`cars_${user.id}`);
    let bot1cars = ["1967 mini cooper s", "2004 subaru wrx sti"];
    let bot2cars = ["1984 audi quattro", "2017 ford focus rs"];
    let bot3cars = ["1978 porsche 911 sc", "2017 ford focus rs"];

    let errorembed = new discord.MessageEmbed()
      .setTitle("❌ Error!")
      .setColor("#60b0f4");
    if (!user1cars) {
      errorembed.setDescription("You dont have any cars!");
      return interaction.reply({ embeds: [errorembed] });
    }

    if (!botlist.includes(bot.toLowerCase())) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, and 6"
      );
      return interaction.reply({ embeds: [errorembed] });
    }
    if (!botlist.includes(bot.toLowerCase()) && !cars.Cars[selected]) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, and 6"
      );
      return interaction.reply({ embeds: [errorembed] });
    }
    if (!botlist.includes(bot.toLowerCase()) && user1cars.includes(selected)) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, and 6"
      );
      return interaction.reply({ embeds: [errorembed] });
    }
    if (!botlist.includes(bot.toLowerCase()) && !selected) {
      errorembed.setDescription(
        "Thats not a tier! The available tiers are: 1, 2, 3, 4, 5, and 6"
      );
      return interaction.reply({ embeds: [errorembed] });
    }

    if (!cars.Cars[selected.toLowerCase()]) {
      errorembed.setDescription("Thats not an available car!");
      return interaction.reply({ embeds: [errorembed] });
    }

    let restoration = db.fetch(
      `${cars.Cars[selected.toLowerCase()].Name}restoration_${
        interaction.user.id
      }`
    );
    if (cars.Cars[selected.toLowerCase()].Junked && restoration < 100) {
      return interaction.reply("This car is too junked to race, sorry!");
    }
    let offroad = db.fetch(
      `${cars.Cars[selected.toLowerCase()].Name}offroad_${interaction.user.id}`
    );
    if (!offroad || offroad == 0 || offroad < 0) {
      return interaction.reply("This car's offroad rating is too low!!");
    }
    let tracklengthb;
    let weekytask1 = db.fetch(`weeklytask_${interaction.user.id}`);
    let barnrandom = randomRange(1, 6);
    console.log(`random ${barnrandom}`);
    let barnmaps;
    switch (bot) {
      case "1": {
        botcar = lodash.sample(bot1cars);
        tracklengthb = 500;
        break;
      }
      case "2": {
        botcar = lodash.sample(bot2cars);
        moneyearned += 300;
        moneyearnedtxt += 300;
        tracklengthb = 600;
        break;
      }
      case "3": {
        botcar = lodash.sample(bot3cars);
        moneyearned += 400;
        moneyearnedtxt += 400;
        tracklengthb = 700;
        if (barnrandom == 2) {
          barnmaps = 1;
        }
        break;
      }
    }

    let racelevel = db.fetch(`racerank_${interaction.user.id}`);
    if (!db.fetch(`racerank_${interaction.user.id}`)) {
      db.set(`racerank_${interaction.user.id}`, 1);
    }
    db.set(`racing_${user.id}`, Date.now());
    let newrankrequired = racelevel * 200;

    console.log(newrankrequired);
    console.log(botcar);

    let user1carspeed = db.fetch(
      `${cars.Cars[selected.toLowerCase()].Name}speed_${user.id}`
    );
    let user1carzerosixty =
      db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`) ||
      cars.Cars[selected.toLowerCase()]["0-60"];
    if (user1carzerosixty < 2) {
      db.set(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`, 2);
    }
    if (!user1carzerosixty) {
      db.set(
        `${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`,
        parseFloat(cars.Cars[selected.toLowerCase()]["0-60"])
      );
    }

    if (
      !db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`)
    ) {
      db.set(
        `${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`,
        cars.Cars[selected.toLowerCase()].Handling
      );
    }
    let handling =
      db.fetch(
        `${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`
      ) || cars.Cars[selected.toLowerCase()].Handling;

    let zero2sixtycar = db.fetch(
      `${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`
    );
    let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"];
    let newhandling = handling / 15;
    let othernewhandling = cars.Cars[botcar.toLowerCase()].Handling / 15;
    let hp = user1carspeed / zero2sixtycar + newhandling + offroad;
    let hp2 =
      cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty +
      othernewhandling +
      cars.Cars[botcar.toLowerCase()].Rally;

    let range = db.fetch(
      `${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`
    );
    if (cars.Cars[selected.toLowerCase()].Electric) {
      if (range <= 0) {
        return interaction.reply(
          `Your EV is out of range! Run /charge to charge it!`
        );
      }
    }

    if (range) {
      db.subtract(
        `${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`,
        1
      );
    }
    console.log(hp);
    let embed = new discord.MessageEmbed()
      .setTitle(`Tier ${bot} rally race in progress...`)
      .addField(
        `Your ${cars.Cars[selected.toLowerCase()].Emote} ${
          cars.Cars[selected.toLowerCase()].Name
        }`,
        `Speed: ${user1carspeed}\n\n0-60: ${db.fetch(
          `${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`
        )}\n
            Offroad rating: ${offroad}`
      )
      .addField(
        `Bots ${cars.Cars[botcar.toLowerCase()].Emote} ${
          cars.Cars[botcar.toLowerCase()].Name
        }`,
        `Speed: ${cars.Cars[botcar.toLowerCase()].Speed}\n\n0-60: ${
          cars.Cars[botcar.toLowerCase()]["0-60"]
        }
            \nOffroad rating: ${cars.Cars[botcar.toLowerCase()].Rally}`
      )
      .setColor("#60b0f4")
      .setThumbnail("https://i.ibb.co/TkqTq9R/Logo-Makr-17-Np-PO.png");
    let randomnum = randomRange(2, 4);
    let launchperc = Math.round(hp / randomnum);
    if (randomnum == 2) {
      setTimeout(() => {
        embed.setDescription("Great launch!");
        embed.addField("Bonus", "$100");
        moneyearnedtxt += 100;
        db.add(`cash_${interaction.user.id}`, 100);
        interaction.editReply({ embeds: [embed] });
      }, 2000);
    }
    console.log(randomnum);

    let tracklength = tracklengthb - launchperc;
    let tracklength2 = tracklengthb;

    let randomobstacle = randomRange(1, 4);
    let timeobs = randomobstacle * 1000;

    setTimeout(() => {
      interaction.channel.send("⛔ Jump! ⛔").then(async (emb) => {
        emb.react("steer:945185050130006066");
        emb.react("❌");
        const filter = (_, u) => u.id === interaction.user.id;
        const collector = emb.createReactionCollector({ filter, time: 4000 });
        let gifs = [
          "https://c.tenor.com/0u3SUF5GcWUAAAAS/subaru-rally-wrc-subaru.gif",
          "https://media1.giphy.com/media/oKuiwS2NsAhjy/giphy.gif",
          "https://media1.giphy.com/media/xT0BKi8beZIotuqrFS/200.gif",
        ];
        collector.on("collect", async (r) => {
          if (r.emoji.name === "❌") {
            embed.setImage(
              "https://media2.giphy.com/media/3xINyooRG4JB4XPKQu/200w.gif?cid=82a1493by2jz4yaxvxevizi1x2k7e4mk5yl7ija1igl2l5u9&rid=200w.gif&ct=g"
            );

            emb.edit("Missed Jump!");
            tracklength2 = 0;
            return interaction.editReply({ embeds: [embed] });
          }
          if (r.emoji.name === "steer") {
            let gif = lodash.sample(gifs);
            emb.edit("✅ Jumped!");
            embed.setImage(gif);
            interaction.editReply({ embeds: [embed] });
          }
        });
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            embed.setImage(
              "https://media2.giphy.com/media/3xINyooRG4JB4XPKQu/200w.gif?cid=82a1493by2jz4yaxvxevizi1x2k7e4mk5yl7ija1igl2l5u9&rid=200w.gif&ct=g"
            );

            emb.edit("Missed Jump!");
            tracklength2 = 0;
            return interaction.editReply({ embeds: [embed] });
          }
        });
      });
    }, timeobs);
    let x = setInterval(() => {
      tracklength -= hp;
      tracklength2 -= hp2;

      db.add(`racescompleted`, 1);
      if (tracklength <= 0) {
        if (db.fetch(`cashgain_${interaction.user.id}`) == "10") {
          let calccash = moneyearned * 0.1;
          moneyearnedtxt += calccash;
          moneyearned += calccash;
        } else if (db.fetch(`cashgain_${interaction.user.id}`) == "15") {
          let calccash = moneyearned * 0.15;
          moneyearnedtxt += calccash;
          moneyearned += calccash;
        } else if (db.fetch(`cashgain_${interaction.user.id}`) == "20") {
          let calccash = moneyearned * 0.2;
          moneyearnedtxt += calccash;
          moneyearned += calccash;
        } else if (db.fetch(`cashgain_${interaction.user.id}`) == "25") {
          let calccash = moneyearned * 0.25;
          moneyearnedtxt += calccash;
          moneyearned += calccash;
        } else if (db.fetch(`cashgain_${interaction.user.id}`) == "50") {
          let calccash = moneyearned * 0.5;
          moneyearnedtxt += calccash;
          moneyearned += calccash;
        }
        console.log("End");
        clearInterval(x);
        embed.setTitle(`Tier ${bot} rally race won!`);
        embed.addField("Earnings", `$${moneyearnedtxt}`);
        if (barnmaps == 1) {
          embed.addField("Barn Map Found", `\u200b`);
          db.add(`barnmaps_${interaction.user.id}`, 1);
        }
        interaction.editReply({ embeds: [embed] });
        db.add(`cash_${interaction.user.id}`, moneyearned);
        db.add(`raceswon_${interaction.user.id}`, 1);
        db.add(`racexp_${interaction.user.id}`, 15);
        if (range) {
          db.add(`batteries_${user.id}`, 1);
        }
        if (db.fetch(`racexp_${interaction.user.id}`) >= newrankrequired) {
          if (db.fetch(`racerank_${interaction.user.id}`) < 20) {
            db.add(`racerank_${interaction.user.id}`, 1);
            interaction.channel.send(
              `${
                interaction.user
              }, You just ranked up your race skill to ${db.fetch(
                `racerank_${interaction.user.id}`
              )}!`
            );
          }
        }
        if (
          weekytask1 &&
          !weekytask1.completed &&
          weekytask1.task == "Win a tier 3 bot race" &&
          bot.toLowerCase() == "tier3"
        ) {
          interaction.channel.send(
            `${interaction.user}, you've completed your weekly task "${weekytask1.task}"!`
          );
          db.set(`weeklytask_${interaction.user.id}.completed`, true);
          db.add(`cash_${interaction.user.id}`, weekytask1.reward);
        }
        if (
          weekytask1 &&
          !weekytask1.completed &&
          weekytask1.task == "Win a rally bot race"
        ) {
          interaction.channel.send(
            `${interaction.user}, you've completed your weekly task "${weekytask1.task}"!`
          );
          db.set(`weeklytask_${interaction.user.id}.completed`, true);
          db.add(`cash_${interaction.user.id}`, weekytask1.reward);
        }
        return;
      } else if (tracklength2 <= 0) {
        console.log("End");
        embed.setTitle(`Tier ${bot} rally race lost!`);
        clearInterval(x);
        db.add(`raceslost_${interaction.user.id}`, 1);
        interaction.editReply({ embeds: [embed] });
        return;
      }
    }, 1000);

    function randomRange(min, max) {
      return Math.round(Math.random() * (max - min)) + min;
    }
  },
};
