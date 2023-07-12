const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { AttachmentBuilder } = require("discord.js");
const Cooldowns = require("../schema/cooldowns");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const Global = require("../schema/global-schema");
const cardb = require("../data/cardb.json");
const { toCurrency } = require("../common/utils");
const { createCanvas, loadImage } = require("canvas");
const achievementdb = require("../data/achievements.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timetrial")
    .setDescription("Race against the clock")
    .addSubcommand((option) =>
      option
        .setName("race")
        .setDescription("Race on the timetrial")
        .addStringOption((option) =>
          option
            .setName("car")
            .setDescription("The car id to use")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option.setName("leaderboard").setDescription("See the leaderboard")
    ),

  async execute(interaction) {
    let global = await Global.findOne();
    if (interaction.options.getSubcommand() == "race") {
      const cars = require("../data/cardb.json");
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
        return await interaction.reply(
          "This car is too junked to race, sorry!"
        );
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

      let mph = selected.Speed;
      let weight =
        selected.WeightStatStat ||
        cardb.Cars[selected.Name.toLowerCase()].Weight;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      if (!selected.WeightStat) {
        selected.WeightStat = cardb.Cars[selected.Name.toLowerCase()].Weight;
      }
      let carimg = selected.Image || cardb.Cars[selected.Name.toLowerCase()].Image;

      let speed = 0;
      let time = 0;

      let x = setInterval(() => {
        if (speed < mph) {
          speed++;
        } else {
          clearInterval(x);
        }
      }, 30);
      let timeint = setInterval(() => {
        time++;
      }, 1000);
      let sec;

      let embed = new discord.EmbedBuilder()
        .setTitle("Going around the track...")
        .addFields([
          {
            name: `Your ${carInLocalDB.Emote} ${carInLocalDB.Name}`,
            value: `
              ${emotes.speed} Power: ${mph}\n
              ${emotes.zero2sixty} 0-60: ${acceleration}s\n
              ${emotes.handling} Handling: ${handling}\n
              ${emotes.weight} Weight: ${weight}\n
            `,
          },
        ])
        .setImage(`${carimg}`)
        .setColor(colors.blue);

      await interaction.reply({
        embeds: [embed],
        fetchReply: true,
      });

      let tracklength = 600;

      let i2 = setInterval(async () => {
        console.log(speed);
        let calc = handling * (speed / 25);
        calc = calc / acceleration;
        sec = (6.5 * (weight / calc)) / acceleration;
        calc = calc / sec;

        tracklength -= calc;
        console.log(`calc: ${calc}`);
        console.log(`sec: ${sec}`);
        // car 2

        if (tracklength <= 0) {
          clearInterval(i2);

          let earnings = [];

          clearInterval(timeint);
          let cashwon = 100 / time;
          earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);

          userdata.cash += cashwon;

          embed.setDescription(`${earnings.join("\n")}`);
          embed.setTitle(`Finished time trial in ${time}s!`);

          if (time <= 2) {
            interaction.channel.send(
              'You just earned the "Time Master" achievement!'
            );
            userdata.achievements.push({
              name: achievementdb.Achievements["time master"].Name,
              id: achievementdb.Achievements["time master"].Name.toLowerCase(),
              completed: true,
            });
          }

          let taskfilter = userdata.tasks.filter(
            (task) => task.Task == "Get under 5 seconds in the time trial"
          );

          if (taskfilter[0] && time < 5) {
            userdata.cash += taskfilter[0].Reward;
            userdata.tasks.pull(taskfilter[0]);
            userdata.tasks.push({ ID: "T3", Time: Date.now() });
            interaction.channel.send(`You just completed your task!`);
          }

          await interaction.editReply({ embeds: [embed] });
          userdata.save();
        }

        let timeuser = global.trialtimes.filter(
          (user) => user.user.id == interaction.user.id
        );

        if (timeuser.length == 0 || time > timeuser.time) {
          timeuser.time = time;
          timeuser.user = interaction.user;
        }
        global.markModified();
        global.save();

        console.log(`track length ${tracklength}`);
      }, 1000);
    } else if (interaction.options.getSubcommand() == "leaderboard") {
      let lb = global.trialtimes.sort(function (x, y) {
        return x.time - y.time;
      });
      console.log(lb);

      let finallb = [];

      for (let l in lb) {
        let spot = lb[l];

        finallb.push(
          `${spot.user.username}#${spot.user.discriminator} : ${spot.time}s`
        );
      }

      let embed = new discord.EmbedBuilder()
        .setTitle("Time Leaderboard")
        .setDescription(`${finallb.slice(0, 10).join("\n")}`)
        .addFields({
          name: "Top Users",
          value: `${finallb.slice(0, 3).join("\n")}`,
        })
        .setThumbnail("https://i.ibb.co/Fng0cKF/timetrialevent.png")
        .setColor(colors.blue);

      interaction.reply({ embeds: [embed] });
    }
  },
};
