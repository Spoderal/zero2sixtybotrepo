

const Discord = require("discord.js");
const ms = require("ms");

const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Collect your daily cash"),
  async execute(interaction) {

    let profile = await User.findOne({ id: interaction.user.id });

    if(!profile){
      return interaction.reply({content: GET_STARTED_MESSAGE, ephemeral: true})
    }


   await interaction.reply("Please wait...")
    let uid = interaction.user.id;
    let dcash = 5000;
    let userdata = (await User.findOne({ id: uid })) || new User({ id: uid });
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: uid });
    var isWeekend = ([0,6].indexOf(new Date().getDay()) != -1);

console.log(isWeekend)
    let daily = cooldowndata.daily;
    let patreon = userdata.zpass;
    let lastDaily = cooldowndata.lastDaily;
    let streak = userdata.settings.dailyStreak || 0;
    let premium = userdata.premium

    let lastDailyTime = new Date(lastDaily);

    let timestamp = lastDailyTime.getTime();
    let now = new Date(Date.now()).getTime();
    console.log(now);

    let delta = now - timestamp;

    console.log(delta);

    let time = 172800000;
    if (delta > time) {
      userdata.settings.dailyStreak = 1;
    } else {
      userdata.settings.dailyStreak += 1;
    }

    userdata.markModified("settings");

    if (interaction.guild.id == "931004190149460048") {
      dcash += 500;
    }
    let Global = require("../schema/global-schema");
    let global = await Global.findOne();
    if (global.zeroplus.includes(interaction.guild.id)) {
      dcash = dcash * 1.5;
    }
    let timeout = 86400000;
    let prestige = userdata.prestige;
    if (prestige) {
      let mult = prestige * 0.05;

      let multy = mult * dcash;

      dcash = dcash += multy;
    }

    if(patreon == true){
      dcash = dcash * 2
    }

    if (daily !== null && timeout - (Date.now() - daily) > 0) {
      console.log('false')
      let time = ms(timeout - (Date.now() - daily));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(
          `You've already collected your daily cash\n\nCollect it again in ${time}.`
        );
     return await interaction.editReply({ embeds: [timeEmbed], fetchReply: true });
    } else {
      let house = userdata.house;
      if (house && house.perks.includes("Daily $300")) {
        dcash += 300;
      }
      if (house && house.perks.includes("Daily $500")) {
        dcash += 500;
      }
      if (house && house.perks.includes("Daily $1000")) {
        dcash += 1000;
      }
      if (house && house.perks.includes("Daily $1500")) {
        dcash += 1500;
      }
      if (premium == true) {
        dcash *= 2;
      }
  
      let filteredhouse = userdata.houses.filter(
        (house) => house.Name == "Albergo Delle Meraviglie"
      );
      let filteredhouse2 = userdata.houses.filter(
        (house) => house.Name == "Cabina Accogliente"
      );
      if (userdata.houses && filteredhouse[0]) {
        userdata.swheelspins += 1;
        interaction.channel.send("+1 Super Wheelspin");
      }
      if (userdata.houses && filteredhouse2[0]) {
        userdata.barnmaps += 1;
        interaction.channel.send("+1 Barn Map");
      }
      let dailystre = streak;
      if (streak > 1) {
        dcash = dcash * (dailystre -= 0.5);
      }
      let using = userdata.using;

      if (using.includes("oil")) {
        let cooldown = cooldowndata.oil;
        let timeout = 604800000;
        console.log(timeout - (Date.now() - cooldown));
        if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
          console.log("pulled");
          userdata.using.pull("oil");

          userdata.update();
          interaction.channel.send("Your oil ran out! :(");
        }
      }

      let tasks = userdata.tasks;
      let taskdaily = tasks.filter((task) => task.ID == "4");

      if (taskdaily[0]) {
        userdata.cash += 2500;

        userdata.tasks.pull(taskdaily[0]);

        interaction.channel.send(`Completed your task!`);
      }

      userdata.cash += dcash;
      cooldowndata.daily = Date.now();
      cooldowndata.lastDaily = Date.now();
      userdata.save();
      cooldowndata.save();

      let embed = new Discord.EmbedBuilder()
        .setTitle(`Daily Cash ${interaction.user.username}`)
        .addFields([{ name: "Earned Cash", value: `${toCurrency(dcash)}` }]);
      if (streak > 1) {
        embed.addFields([{ name: "Streak", value: `${(streak += 1)}` }]);
      }
      embed.setColor(colors.blue);

      await interaction.editReply({ embeds: [embed] });
      console.log(userdata.settings.dailyStreak);
    }
  },
};
