const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Cooldowns = require("../schema/cooldowns");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timetrial")
    .setDescription("Race against the clock")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {
    const cars = require("../data/cardb.json");
    let moneyearnedtxt = 300;
    let moneyearned = 300;
    let idtoselect = interaction.options.getString("car");
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });
    let cooldowndata =
      (await Cooldowns.findOne({ id: user.id })) ||
      new Cooldowns({ id: interaction.user.id });

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

    let timeout = 120000;
    let racing = cooldowndata.timetrial;

    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return interaction.reply(
        `Please wait ${time} before doing the timetrial again.`
      );
    }

    if (cars.Cars[selected.Name.toLowerCase()].Junked) {
      return interaction.reply("This car is too junked to race, sorry!");
    }

    let range = selected.Range;
    if (cars.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return interaction.reply(
          `Your EV is out of range! Run /charge to charge it!`
        );
      }
    }

    if (range) {
      selected.Range -= 1;
    }

    cooldowndata.timetrial = Date.now();
    cooldowndata.save();

    let user1carspeed = selected.Speed;
    let user1carzerosixty = selected.Acceleration;
    let handling = selected.Handling;

    let newhandling = handling / 20;

    let driftscore = selected.Drift;
    let hp = user1carspeed + newhandling;
    hp - driftscore;

    let timernum = 0;

    let timer = setInterval(() => {
      timernum++;
    }, 1000);
    let semote = emotes.speed;
    let hemote = emotes.handling;
    let zemote = emotes.zero2sixty;
    let cemote = emotes.cash;
    let embed = new discord.EmbedBuilder()
      .setTitle("Going around the track!")
      .addFields([
        {
          name: `Your ${cars.Cars[selected.toLowerCase()].Emote} ${
            cars.Cars[selected.toLowerCase()].Name
          }`,
          value: `${semote} Speed: ${user1carspeed} MPH\n${zemote} 0-60: ${user1carzerosixty}s\n${hemote} Handling:${handling}`,
        },
      ])
      .setColor(colors.blue)
      .setThumbnail("https://i.ibb.co/Wfk7s36/timer1.png");
    let randomnum = randomRange(2, 4);
    let launchperc = Math.round(hp / randomnum);
    if (randomnum == 2) {
      setTimeout(() => {
        embed.setDescription("Great launch!");
        embed.addFields([{ name: "Bonus", value: "$100" }]);
        moneyearnedtxt += 100;
        userdata.cash += 100;
        interaction.editReply({ embeds: [embed] });
      }, 2000);
    }

    let tracklength = 5000 - launchperc;

    let x = setInterval(() => {
      tracklength -= hp;

      if (tracklength <= 0) {
        moneyearned -= timernum;
        moneyearnedtxt + moneyearned;
        clearInterval(x, timer);
        embed.addFields([
          { name: "Results", value: `Finished in ${timernum}s` },
          { name: "Earnings", value: `${cemote} $${moneyearned}` },
        ]);
        interaction.editReply({ embeds: [embed] });
        userdata.cash += Number(moneyearned);
        userdata.save();

        return;
      }
    }, 1000);

    function randomRange(min, max) {
      return Math.round(Math.random() * (max - min)) + min;
    }
  },
};
