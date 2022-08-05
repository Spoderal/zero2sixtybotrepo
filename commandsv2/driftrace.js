const db = require("quick.db");
const lodash = require("lodash");
const ms = require("pretty-ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drift")
    .setDescription("Drift your car")
    .addStringOption((option) =>
      option
        .setName("difficulty")
        .setDescription("The track difficulty")
        .setRequired(true)
        .addChoice("Easy", "easy")
        .addChoice("Medium", "medium")
        .addChoice("Hard", "hard")
    )
    .addStringOption((option) =>
      option
        .setName("track")
        .setDescription("The track you want to drift on")
        .setRequired(true)
        .addChoice("Regular", "regular")
        .addChoice("Mountain", "mountain")
        .addChoice("Parking Lot", "parking")
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {
    const discord = require("discord.js");
    const cars = require("../cardb.json");
    let tracks = ["easy", "medium", "hard"];

    let moneyearned = 200;
    let user = interaction.user;
    let userdata = await User.findOne({ id: interaction.user.id });
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: user.id });

    let track = interaction.options.getString("difficulty");
    if (!track)
      return interaction.reply(
        "You need to select a track! Example: /drift [id] [difficulty]. The current difficulties are: Easy, Medium, Hard"
      );
    if (!tracks.includes(track.toLowerCase()))
      return interaction.reply(
        "You need to select a track! Example: /drift [id] [difficulty]. The current difficulties are: Easy, Medium, Hard"
      );
    let idtoselect = interaction.options.getString("car");

    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.MessageEmbed()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return interaction.reply({ embeds: [errembed] });
    }
    let car = selected;
    if (!car)
      return interaction.reply(
        "You need to select a car! Example: /ids select [car]"
      );
    let user1cars = userdata.cars;
    if (!user1cars) interaction.reply("You dont have any cars!");
    if (!cars.Cars[car.Name.toLowerCase()])
      return interaction.reply("Thats not a car!");
    let driftscore = selected.Drift;
    let usercarspeed = selected.Speed;
    let handling = selected.Handling;

    if (driftscore <= 0)
      return interaction.reply(
        "You try drifting but your drift rating is too low, so you swerve out and crash."
      );
    let timeout = 45000;
    if (userdata.patron && userdata.patron.tier == 1) {
      timeout = 30000;
    } else if (userdata.patron && userdata.patron.tier == 2) {
      timeout = 15000;
    } else if (userdata.patron && userdata.patron.tier == 3) {
      timeout = 5000;
    } else if (userdata.patron && userdata.patron.tier == 4) {
      timeout = 5000;
    }
    let racing = cooldowndata.drift;
    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return interaction.reply(`Please wait ${time} before drifting again.`);
    }

    cooldowndata.drift = Date.now();
    cooldowndata.save();
    let drifttraining = userdata.driftrank;

    let range = selected.Range;
    if (cars.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }
    let requiredrank = drifttraining * 150;
    let time;
    let ticketsearned;
    switch (track) {
      case "easy": {
        time = 15;
        ticketsearned = 2;
        break;
      }
      case "medium": {
        time = 10;
        moneyearned += 250;
        ticketsearned = 4;
        break;
      }
      case "hard": {
        time = 5;
        moneyearned += 500;
        ticketsearned = 6;
        break;
      }
    }
    let usables = userdata.using;

    let energytimer = cooldowndata.energydrink;
    if (usables.includes("energy drink")) {
      let timeout = 600000;
      if (timeout - (Date.now() - energytimer) > 0) {
        console.log("no energy");
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
        console.log("no sponsor");
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
      let moneyearnedtxt = moneyearnedtxt * 2;
      console.log(moneyearned);
    }

    let tires = selected.Tires;

    let drifttires = [
      "T1DriftTires",
      "T2DriftTires",
      "T3DriftTires",
      "BM1DriftTires",
      "T4DriftTires",
      "T5DriftTires",
    ];
    if (!drifttires.includes(tires))
      return interaction.reply("Your car needs drift tires to drift!");

    let formula = driftscore * drifttraining;
    formula += handling;

    console.log(formula);

    let tracklength;
    let trackname;
    let trackgifs;
    let trackgif;
    let optiontrack = interaction.options.getString("track");
    switch (optiontrack) {
      case "regular":
        tracklength = 9000;
        trackname = "Regular";
        trackgifs = [
          "https://media1.giphy.com/media/o6S51npJYQM48/giphy.gif",
          "https://c.tenor.com/BMmhBsA6GgUAAAAd/drift-drifting.gif",
        ];
        trackgif = lodash.sample(trackgifs);
        break;
      case "mountain":
        tracklength = 10000;
        trackname = "Mountains";
        trackgifs = [
          "https://i.makeagif.com/media/3-16-2016/IAMsw-.gif",
          "https://c.tenor.com/NhopGWhSG0AAAAAC/mustang-drift.gif",
        ];
        trackgif = lodash.sample(trackgifs);

        break;
      case "parking":
        tracklength = 15000;
        trackname = "Parking Lot";
        trackgifs = [
          "https://i.gifer.com/7azI.gif",
          "https://c.tenor.com/bxYLMS8pmqAAAAAC/dk-nissan.gif",
        ];
        trackgif = lodash.sample(trackgifs);

        break;
    }
    let notorietyearned = driftscore * 5 - time;

    let embed = new discord.MessageEmbed()
      .setTitle(`Drifting around the ${track} ${trackname} track`)
      .setDescription(`You have ${time}s to complete the track`)
      .addField(
        `Your ${cars.Cars[selected.Name.toLowerCase()].Name}'s Stats`,
        `Speed: ${usercarspeed}\n\nDrift Rating: ${driftscore}`
      )
      .addField("Your Drift Rank", `${drifttraining}`)

      .setColor("#60b0f4")
      .setImage(`${trackgif}`)
      .setThumbnail("https://i.ibb.co/XzW37RH/drifticon.png");

    let row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("ebrake")
        .setEmoji("<:ebrake:969671303961387050>")
        .setLabel("Handbrake")
        .setStyle("SECONDARY")
    );
    const filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    let rns = [1000, 2000, 3000, 4000, 5000];

    let randomnum = lodash.sample(rns);
    let canshift = false;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 10000,
    });
    setTimeout(() => {
      embed.addField("\u200b", "Shift now!");
      interaction.editReply({ embeds: [embed] });
      canshift = true;
      setTimeout(() => {
        canshift = false;
      }, 3000);

      collector.on("end", async (collected) => {
        if (collected.size == 0 && canshift == false) {
          formula = formula / 2;
        }
      });
    }, randomnum);
    interaction.reply({ embeds: [embed], components: [row] }).then(async () => {
      collector.on("collect", async (i) => {
        if (i.customId.includes("ebrake")) {
          if (canshift == false) {
            interaction.channel.send(
              `You pulled the handbrake at the wrong time!`
            );
            formula = formula / 2;
          } else if (canshift == true) {
            embed.setDescription("Drifting!!!");

            await i.update({ embeds: [embed] });
          }
        }
      });
    });

    let y = setInterval(() => {
      time -= 1;
    }, 1000);

    let x = setInterval(() => {
      tracklength -= formula;
      console.log(`formula: ${formula}`);
      console.log(tracklength);

      if (time == 0 && tracklength >= 0) {
        let randomsub = randomRange(2, 10);
        selected.Tread -= randomsub;
        userdata.save();
        embed.addField("Results", `Failed`);
        interaction.editReply({ embeds: [embed] });
        if (range && range >= 0) {
          selected.Range -= 1;
        }
        userdata.driftxp += 10;

        let driftxp = userdata.driftxp;
        if (driftxp >= requiredrank) {
          if (userdata.driftrank < 50) {
            userdata.driftrank += 1;
            interaction.channel.send(
              `${user}, you just ranked up your drift skill to ${db.fetch(
                `driftrank_${user.id}`
              )}!`
            );
          }
        }
        userdata.save();
        clearInterval(x);
        clearInterval(y);

        return;
      }
      if (tracklength <= 0) {
        let randomsub = randomRange(2, 10);
        selected.Tread -= randomsub;

        embed.addField("Results", `Success\n\nTread: ${selected.Tread}`);
        if (db.fetch(`doublecash`) == true) {
          moneyearned = moneyearned += moneyearned;
          embed.addField("Double Cash Weekend!", `\u200b`);
        }
        embed.addField(
          "Earnings",
          `$${moneyearned}\n${notorietyearned} Notoriety`
        );
        if (cars.Cars[selected.Name.toLowerCase()].StatTrack) {
          selected.Wins += 1;
        }
        interaction.editReply({ embeds: [embed] });
        userdata.cash += Number(moneyearned);
        userdata.rp += ticketsearned;
        userdata.noto += notorietyearned;

        userdata.driftxp += 25;

        let driftxp = userdata.driftxp;
        if (driftxp >= requiredrank) {
          if (userdata.driftrank < 50) {
            userdata.driftrank += 1;
            interaction.channel.send(
              `${user}, you just ranked up your drift skill to ${db.fetch(
                `driftrank_${user.id}`
              )}!`
            );
          }
        }
        userdata.save();

        clearInterval(x);
        clearInterval(y);

        return;
      }
    }, 1000);
  },
};

function randomRange(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}
