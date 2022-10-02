const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Cooldowns = require("../schema/cooldowns");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { randomRange } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trickortreat")
    .setDescription("Get as much candy as you can!")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    ),

  async execute(interaction) {
    const cars = require("../data/cardb.json");
    let moneyearnedtxt = 50;
    let moneyearned = 50;
    let zerobars = 0;
    let idtoselect = interaction.options.getString("car");
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let cooldowndata =
      (await Cooldowns.findOne({ id: user.id })) ||
      new Cooldowns({ id: user.id });

    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select]\` to select a car to your specified id!\n
          Example: \`/ids Select 1 1995 mazda miata\``
        );

      return await interaction.reply({ embeds: [errembed] });
    }

    const carInLocalDB = cars.Cars[selected.Name.toLowerCase()];

    let timeout = 120000;

    let racing = cooldowndata.timetrial;

    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });
      return await interaction.reply(
        `Please wait ${time} before doing the timetrial again.`
      );
    }

    if (carInLocalDB.Junked) {
      return await interaction.reply("This car is too junked to race, sorry!");
    }

    let range = selected.Range;
    if (carInLocalDB.Electric && range <= 0) {
      return await interaction.reply(
        `Your EV is out of range! Run /charge to charge it!`
      );
    }

    if (range) selected.Range -= 1;

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

    let embed = new discord.EmbedBuilder()
      .setTitle("Trick or treating...")
      .addFields([
        {
          name: `Your ${carInLocalDB.Emote} ${carInLocalDB.Name}`,
          value: `
            ${emotes.speed} Speed: ${user1carspeed} MPH
            ${emotes.zero2sixty} 0-60: ${user1carzerosixty}s
            ${emotes.handling} Handling: ${handling}
          `,
        },
      ])
      .setColor(colors.blue)
      .setThumbnail("https://i.ibb.co/3fwT2CR/spookyrace.png");

    interaction.reply({ embeds: [embed] });

    let randomnum = randomRange(2, 4);
    let launchperc = Math.round(hp / randomnum);
    if (randomnum == 2) {
      setTimeout(() => {
        embed.setDescription("Great launch!");
        embed.addFields([{ name: "Bonus", value: "5 Candy" }]);
        moneyearnedtxt += 5;
        userdata.candy += 5;
        interaction.editReply({ embeds: [embed] });
      }, 2000);
    }

    if (randomnum == 3) {
      zerobars = 1;
    }
    let tracklength = 5000 - launchperc;

    let x = setInterval(() => {
      tracklength -= hp;

      if (tracklength <= 0) {
        let rewards = [];
        if (zerobars > 0) {
          rewards.push(`<:zerobar:1025128975216947210> ${zerobars}`);
          userdata.items.push("zero bar");
        }
        rewards.push(`🍬 ${moneyearned}`);

        moneyearned -= timernum;
        moneyearnedtxt + moneyearned;
        clearInterval(x, timer);
        embed.addFields([
          { name: "Results", value: `Finished in ${timernum}s` },
          { name: "Earnings", value: `${rewards.join("\n")}` },
        ]);
        interaction.editReply({ embeds: [embed] });
        userdata.cash += Number(moneyearned);
        userdata.save();

        return;
      }
    }, 1000);
  },
};