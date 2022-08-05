const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Cooldowns = require("../schema/cooldowns");
const partdb = require("../partsdb.json");
const Global = require("../schema/global-schema");
const User = require("../schema/profile-schema");

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
    const db = require("quick.db");

    const cars = require("../cardb.json");
    let moneyearnedtxt = 300;
    let moneyearned = 300;
    let idtoselect = interaction.options.getString("car");
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });
    let cooldowndata =
      (await Cooldowns.findOne({ id: user.id })) ||
      new Cooldowns({ id: interaction.user.id });
    let globaldata = await Global.findOne({});

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

    let timeout = 120000;
    let racing = cooldowndata.timetrial;

    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return interaction.reply(
        `Please wait ${time} before doing the timetrial again.`
      );
    }

    let errorembed = new discord.MessageEmbed()
      .setTitle("❌ Error!")
      .setColor("#60b0f4");

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

    let zero2sixtycar = selected.Acceleration;
    let newhandling = handling / 20;
    let new60 = user1carspeed / zero2sixtycar;

    let driftscore = selected.Drift;
    let hp = user1carspeed + newhandling;
    hp - driftscore;

    let timernum = 0;

    let timer = setInterval(() => {
      timernum++;
    }, 1000);
    let semote = "<:speedemote:983963212393357322>";
    let hemote = "<:handling:983963211403505724>";
    let zemote = "<:zerosixtyemote:983963210304614410>";
    let cemote = "<:zecash:983966383408832533>";
    let rpemote = "<:rp:983968476060336168>";
    let embed = new discord.MessageEmbed()
      .setTitle("Going around the track!")
      .addField(
        `Your ${cars.Cars[selected.toLowerCase()].Emote} ${
          cars.Cars[selected.toLowerCase()].Name
        }`,
        `${semote} Speed: ${user1carspeed} MPH\n${zemote} 0-60: ${user1carzerosixty}s\n${hemote} Handling:${handling}`
      )
      .setColor("#60b0f4")
      .setThumbnail("https://i.ibb.co/Wfk7s36/timer1.png");
    let msg = await interaction.reply({ embeds: [embed] });
    let randomnum = randomRange(2, 4);
    let launchperc = Math.round(hp / randomnum);
    if (randomnum == 2) {
      setTimeout(() => {
        embed.setDescription("Great launch!");
        embed.addField("Bonus", "$100");
        moneyearnedtxt += 100;
        userdata.cash += 100;
        interaction.editReply({ embeds: [embed] });
      }, 2000);
    }
    console.log(randomnum);

    let tracklength = 5000 - launchperc;

    let x = setInterval(() => {
      tracklength -= hp;

      console.log(tracklength);

      if (tracklength <= 0) {
        console.log(timernum);
        moneyearned -= timernum;
        moneyearnedtxt + moneyearned;
        console.log("End");
        clearInterval(x, timer);
        embed.addField("Results", `Finished in ${timernum}s`);

        embed.addField("Earnings", `${cemote} $${moneyearned}`);
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
