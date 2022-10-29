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
const cooldowns = require("../schema/cooldowns");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trackrace")
    .setDescription("Race your car on the track!")
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
        .setName("laps")
        .setDescription("The amount of laps")
        .setRequired(true)
        .addChoices(
          { name: "5", value: "5" },
          { name: "10", value: "10" },
          { name: "15", value: "15" }
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
        "You need to select a track! Example: /trackrace [id] [difficulty]. The current difficulties are: Easy, Medium, Hard"
      );
    if (!tracks.includes(track.toLowerCase()))
      return await interaction.reply(
        "You need to select a track! Example: /trackrace [id] [difficulty]. The current difficulties are: Easy, Medium, Hard"
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
    let usercarspeed = selected.Speed;
    let handling = selected.Handling;

    const timeout = userGetPatreonTimeout(userdata);

    let racing = cooldowndata.track;
    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return await interaction.reply(
        `Please wait ${time} before racing on the track again.`
      );
    }

    await cooldowns.findOneAndUpdate(
      {
        id: interaction.user.id,
      },
      {
        $set: {
          track: Date.now(),
        },
      }
    );
    let drifttraining = userdata.driftrank;

    let range = selected.Range;
    if (cars.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return await interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }
    let time;
    let ticketsearned;
    let tracklength;
    let xpearn;
    switch (track) {
      case "easy": {
        time = 15;
        ticketsearned = 2;
        tracklength = 100000;
        xpearn = 100;
        break;
      }
      case "medium": {
        time = 10;
        moneyearned += 300;
        ticketsearned = 4;
        tracklength = 200000;
        xpearn = 250;

        break;
      }
      case "hard": {
        time = 5;
        moneyearned += 800;
        ticketsearned = 6;
        tracklength = 300000;
        xpearn = 400;

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

    let optiontrack = interaction.options.getString("laps");

    let formula = usercarspeed * handling;
    let laps = Number(optiontrack);
    formula / laps;

    let trackgif =
      "https://media1.giphy.com/media/xULW8NCU1Fmmm2iAtq/giphy.gif";

    let notorietyearned = handling / time;

    let embed = new EmbedBuilder()
      .setTitle(`Racing around the ${track} track for ${laps} laps`)
      .setDescription(`You have ${time}s to complete the track`)
      .addFields([
        {
          name: `Your ${cars.Cars[selected.Name.toLowerCase()].Name}'s Stats`,
          value: `
            Speed: ${usercarspeed}
            Handling: ${handling}
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
              embed.setFooter({ text: "Great shift!!!" });
              await i.update({ embeds: [originalEmbed], components: [] });
            }
          }
        });
      });

    let y = setInterval(async () => {
      time -= 1;
    }, 1000);

    let removedShiftButton = false;
    let x = setInterval( async () => {
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
          embed.addFields([{ name: "Results", value: `Failed` }]);
          embed.setFooter({ text: invisibleSpace });
          interaction.editReply({ embeds: [embed], components: [] });
          if (range && range >= 0) {
            selected.Range -= 1;
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
          let Global = require("../schema/global-schema")
          let global = await Global.findOne()
          if(global.zeroplus.includes(interaction.guild.id)){
            moneyearned = moneyearned * 2
          }
          let notorounded = Math.round(notorietyearned);
          embed.addFields([
            {
              name: "Earnings",
              value: `
              ${emotes.cash} $${moneyearned}
              ${emotes.notoriety} ${notorounded} Notoriety
              ${emotes.rp} ${ticketsearned} RP
              +${xpearn} Race XP
            `,
            },
          ]);
          userdata.racexp += xpearn;
          userdata.update();
          let requiredXP = userdata.racerank * 1000;

          if (userdata.racexp >= requiredXP) {
            userdata.racerank += 1;
            userdata.racexp = 0;
            interaction.channel.send(
              `Ranked up your race rank to ${userdata.racerank}`
            );
          }

          embed.setFooter({ text: invisibleSpace });
          if (cars.Cars[selected.Name.toLowerCase()].StatTrack) {
            selected.Wins += 1;
          }
          interaction.editReply({ embeds: [embed], components: [] });
          userdata.cash += Number(moneyearned);
          userdata.rp2 += ticketsearned;
          userdata.notofall += notorounded;

          userdata.save();

          clearInterval(x);
          clearInterval(y);

          return;
        }
      }
    }, 1000);
  },
};
