const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Cooldowns = require("../schema/cooldowns");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { randomRange } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const Global = require("../schema/global-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timetrial")
    .setDescription("Race against the clock")
    .addSubcommand((option) =>
      option
      .setName("race")
      .setDescription("Race on the timetrial")
      .addStringOption((option) => option
      .setName("car")
      .setDescription("The car id to use")
      .setRequired(true))
      
    )
    .addSubcommand((option) =>
    option
      .setName("leaderboard")
      .setDescription("See the leaderboard")
  ),

  async execute(interaction) {
    let global = await Global.findOne()
    if(interaction.options.getSubcommand() == "race"){
      const cars = require("../data/cardb.json");
      let moneyearnedtxt = 300;
      let moneyearned = 300;
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
        .setTitle("Going around the track...")
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
        .setThumbnail("https://i.ibb.co/Wfk7s36/timer1.png");
  
      interaction.reply({ embeds: [embed] });
  
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
            { name: "Earnings", value: `${emotes.cash} $${moneyearned}` },
          ]);
          interaction.editReply({ embeds: [embed] });
          userdata.cash += Number(moneyearned);
          let filteredtimes = global.trialtimes.filter((u) => u.user.id == interaction.user.id)
          if(filteredtimes[0]){
            filteredtimes[0].time = timernum
          }
          else {
            global.trialtimes.push({time: timernum, user: interaction.user})

          }
          global.markModified("timetrials")
          global.save()
          userdata.save();
  
          return;
        }
      }, 1000);

    }
    else if(interaction.options.getSubcommand() == "leaderboard"){
      let lb = global.trialtimes.sort(function (x, y) {
        return x.time - y.time;
    });
    console.log(lb)
    
      let finallb = []

      for(let l in lb){
        let spot = lb[l]

        finallb.push(`${spot.user.username}#${spot.user.discriminator} : ${spot.time}s`)
      }

      let embed = new discord.EmbedBuilder()
      .setTitle("Time Leaderboard")
      .setDescription(`${finallb.slice(0, 10).join('\n')}`)
      .addFields(
        {name: "Top Users", value:`${finallb.slice(0, 3).join('\n')}`}
        )
        .setThumbnail("https://i.ibb.co/Fng0cKF/timetrialevent.png")
        .setColor(colors.blue)

        interaction.reply({embeds: [embed]})


    }
  },
};
