const db = require("quick.db");
const lodash = require("lodash");
const ms = require("pretty-ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { userGetPatreonTimeout } = require("../common/user");
const { invisibleSpace, doubleCashWeekendField } = require("../common/utils");
const cars = require("../data/cardb.json");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drift")
    .setDescription("Drift your car")
    .addStringOption((option) =>
      option
        .setName("difficulty")
        .setDescription("The track difficulty")
        .setRequired(true)
        .addChoices(
          { name: "Easy", value: "easy" },
          { name: "Medium", value: "medium" },
          { name: "Hard", value: "hard" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("track")
        .setDescription("The track you want to drift on")
        .setRequired(true)
        .addChoices(
          { name: "Regular", value: "regular" },
          { name: "Mountain", value: "mountain" },
          { name: "Parking Lot", value: "parking" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {
    let tracks = ["easy", "medium", "hard"];
    let moneyearned = 200;
    let user = interaction.user;
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: user.id });

    let track = interaction.options.getString("difficulty");
    if (!track)
      return await interaction.reply(
        "You need to select a track! Example: /drift [id] [difficulty]. The current difficulties are: Easy, Medium, Hard"
      );
    if (!tracks.includes(track.toLowerCase()))
      return await interaction.reply(
        "You need to select a track! Example: /drift [id] [difficulty]. The current difficulties are: Easy, Medium, Hard"
      );
    let idtoselect = interaction.options.getString("car");

    let selected = userdata.cars.find((car) => car.ID == idtoselect);

    // This will auto-correct a database issue when a user purchased a vehicle
    // and ".Drift" value was set to an object with NaN due to strings in data
    if (Number.isNaN(selected?.Drift)) {
      const carInLocalDB = cars.Cars[selected.Name.toLowerCase()];
      await User.updateOne(
        { id: interaction.user.id, "cars.Name": carInLocalDB.Name },
        {
          $set: {
            "cars.$.Drift": carInLocalDB.Drift,
          },
        }
      );
      selected.Drift = carInLocalDB.Drift;
    }

    if (selected == "No ID") {
      let errembed = new EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    let car = selected;
    if (!car)
      return await interaction.reply(
        "You need to select a car! Example: /ids select [car]"
      );
    let user1cars = userdata.cars;
    if (!user1cars) await interaction.reply("You dont have any cars!");
    if (!cars.Cars[car.Name.toLowerCase()])
      return await interaction.reply("Thats not a car!");
    let driftscore = selected.Drift;
    let usercarspeed = selected.Speed;
    let handling = selected.Handling;

    if (driftscore <= 0)
      return await interaction.reply(
        "You try drifting but your drift rating is too low, so you swerve out and crash."
      );

    const timeout = userGetPatreonTimeout(userdata);

    let racing = cooldowndata.drift;
    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return await interaction.reply(
        `Please wait ${time} before drifting again.`
      );
    }

    cooldowndata.drift = Date.now();
    cooldowndata.save();
    let drifttraining = userdata.driftrank;

    let range = selected.Range;
    if (cars.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return await interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }
    let requiredrank = drifttraining * 150;
    let time;
    let ticketsearned;
    let xpearn
    switch (track) {
      case "easy": {
        time = 15;
        ticketsearned = 2;
        xpearn = 25;
        break;
      }
      case "medium": {
        time = 10;
        moneyearned += 250;
        ticketsearned = 4;
        xpearn = 50;
        break;
      }
      case "hard": {
        time = 5;
        moneyearned += 500;
        ticketsearned = 6;
        xpearn = 100;
        break;
      }
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
      let moneyearnedtxt = moneyearnedtxt * 2;
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
      return await interaction.reply("Your car needs drift tires to drift!");

    let formula = driftscore * drifttraining;
    formula += handling;

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
        
        xpearn += 50;
        trackname = "Mountains";
        trackgifs = [
          "https://i.makeagif.com/media/3-16-2016/IAMsw-.gif",
          "https://c.tenor.com/NhopGWhSG0AAAAAC/mustang-drift.gif",
        ];
        trackgif = lodash.sample(trackgifs);

        break;
      case "parking":
        tracklength = 15000;
        xpearn += 100
        trackname = "Parking Lot";
        trackgifs = [
          "https://i.gifer.com/7azI.gif",
          "https://c.tenor.com/bxYLMS8pmqAAAAAC/dk-nissan.gif",
        ];
        trackgif = lodash.sample(trackgifs);

        break;
    }

    let embed = new EmbedBuilder()
      .setTitle(`Drifting around the ${track} ${trackname} track`)
      .setDescription(`You have ${time}s to complete the track`)
      .addFields([
        {
          name: `Your ${cars.Cars[selected.Name.toLowerCase()].Name}'s Stats`,
          value: `
            Speed: ${usercarspeed}
            Drift Rating: ${driftscore}
          `,
        },
        { name: "Your Drift Rank", value: `${drifttraining}` },
      ])
      .setColor(colors.blue)
      .setImage(`${trackgif}`)
      .setThumbnail("https://i.ibb.co/XzW37RH/drifticon.png");

    const originalEmbed = embed;

    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ebrake")
        .setEmoji(emotes.eBrake)
        .setLabel("Shifter")
        .setStyle("Secondary")
    );

    const filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    let rns = [1000, 2000, 3000, 4000];

    let randomnum = lodash.sample(rns);
    let canshift = false;
    let showedShiftButton = false;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 10000,
    });

    setTimeout(() => {
      embed.addFields([{ name: invisibleSpace, value: "Shift now!" }]);
      interaction.editReply({ embeds: [embed], components: [row] });
      canshift = true;
      showedShiftButton = true;
      setTimeout(() => {
        canshift = false;
      }, 2000);

      collector.on("end", async (collected) => {
        if (collected.size == 0 && canshift == false) {
          formula = formula / 2;
        }
      });
    }, randomnum);

    await interaction
      .reply({ embeds: [embed], components: [] })
      .then(async () => {
        collector.on("collect", async (i) => {
          if (i.customId.includes("ebrake")) {
            if (canshift == false) {
              formula = formula / 2;
              embed.setFooter({
                text: "You failed to shift at the right moment and lost momentum!",
              });
              await i.update({ embeds: [originalEmbed], components: [] });
            } else if (canshift == true) {
              formula = formula * 1.3;
              embed.setFooter({ text: "Great shift... drifting!!!" });
              await i.update({ embeds: [originalEmbed], components: [] });
            }
          }
        });
      });

    let y = setInterval(() => {
      time -= 1;
    }, 1000);

    let removedShiftButton = false;
    let x = setInterval(() => {
      tracklength -= formula;

      if (showedShiftButton && !canshift && !removedShiftButton) {
        removedShiftButton = true;
        setTimeout(
          () => interaction.editReply({ embeds: [embed], components: [] }),
          2000
        );
      }

      if (time == 0) {
        if (tracklength >= 0) {
          embed.addFields([
            { name: "Results", value: `Failed` },
            { name: "Earnings", value: "+10 Drift XP" },
          ]);
          embed.setFooter({ text: invisibleSpace });
          interaction.editReply({ embeds: [embed], components: [] });
          if (range && range >= 0) {
            selected.Range -= 1;
          }
          userdata.driftxp += 10;

          let driftxp = userdata.driftxp;
          if (driftxp >= requiredrank) {
            if (userdata.driftrank < 50) {
              userdata.driftrank += 1;
              interaction.channel.send(
                `${user}, you just ranked up your drift skill to ${userdata.driftrank}!`
              );
            }
          }
          userdata.save();
          clearInterval(x);
          clearInterval(y);

          return;
        } else if (tracklength <= 0) {
          if (db.fetch(`doublecash`) == true) {
            moneyearned = moneyearned += moneyearned;
            embed.addFields([doubleCashWeekendField]);
          }
          if (userdata.patreon && userdata.patreon.tier == 1 || userdata.patreon && userdata.patreon.tier == 2) {
            let patronbonus = moneyearned * 1.5

            moneyearned += patronbonus
          }
          if (userdata.patreon && userdata.patreon.tier == 3) {
            let patronbonus = moneyearned * 2

            moneyearned += patronbonus
          }
          if (userdata.patreon && userdata.patreon.tier == 4) {
            let patronbonus = moneyearned * 4

            moneyearned += patronbonus
          }
          embed.addFields([
            {
              name: "Earnings",
              value: `
              ${emotes.cash} $${moneyearned}
              ${emotes.rp} ${ticketsearned} RP
              +${xpearn} Drift XP
            `,
            },
          ]);
          embed.setFooter({ text: invisibleSpace });
          if (cars.Cars[selected.Name.toLowerCase()].StatTrack) {
            selected.Wins += 1;
          }
          interaction.editReply({ embeds: [embed], components: [] });
          userdata.cash += Number(moneyearned);
          userdata.rp2 += ticketsearned;

          userdata.driftxp += xpearn;
          userdata.update()

          let driftxp = userdata.driftxp;
          console.log(requiredrank)
          if (driftxp >= requiredrank) {
            if (userdata.driftrank < 50) {
              userdata.driftrank += 1;
              userdata.driftxp = 0;
              interaction.channel.send(
                `${user}, you just ranked up your drift skill to ${userdata.driftrank}!`
              );
            }
          }
          userdata.save();

          clearInterval(x);
          clearInterval(y);

          return;
        }
      }
    }, 1000);
  },
};
