const db = require("quick.db");
const Discord = require("discord.js");
const ms = require("pretty-ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tasks")
    .setDescription("View your daily and weekly tasks"),

  async execute(interaction) {
    let userid = interaction.user.id;
    let tasksdb = require("../tasks.json");
    let randomtask = lodash.sample(tasksdb.Daily);
    let randomtask2 = lodash.sample(tasksdb.Weekly);

    let timerfordaily = db.fetch(`dailytasktimer_${userid}`);
    let timerforweekly = db.fetch(`weeklytasktimer_${userid}`);

    let timeout1 = 86400000;
    let timeoutweek = 604800000;

    if (timeoutweek - (Date.now() - timerforweekly) < 0) {
      db.set(`weeklytask_${userid}`, {
        task: randomtask2.Task,
        user: userid,
        completed: false,
        reward: randomtask2.Reward,
      });
      db.set(`weeklytasktimer_${userid}`, Date.now());
    }

    if (timeout1 - (Date.now() - timerfordaily) < 0) {
      db.set(`dailytask_${userid}`, {
        task: randomtask.Task,
        user: userid,
        completed: false,
        reward: randomtask.Reward,
      });
      db.set(`dailytasktimer_${userid}`, Date.now());
    }

    let cash = db.fetch(`cash_${userid}`);
    if (!cash || cash == null) cash = 0;
    let dailytask1 = db.fetch(`dailytask_${userid}`);
    let weeklytask1 = db.fetch(`weeklytask_${userid}`);

    let dailytimeleft = db.fetch(`dailytasktimer_${userid}`);
    let weeklytimeleft = db.fetch(`weeklytasktimer_${userid}`);

    let timeout = 86400000;
    let timeout2 = 604800000;

    let dailyms = ms(timeout - (Date.now() - dailytimeleft));
    let weeklyms = ms(timeout2 - (Date.now() - weeklytimeleft));

    if (!dailytask1 || !weeklytask1)
      return interaction.reply("Please send a message to set your tasks.");
    let dailyemote;
    let weeklyemote;
    if (dailytask1.completed == true) dailyemote = "✅";
    else if (!dailytask1.completed) dailyemote = "❌";
    if (weeklytask1.completed == true) weeklyemote = "✅";
    else if (!weeklytask1.completed) weeklyemote = "❌";

    let embed = new Discord.MessageEmbed()
      .setTitle(`Tasks`)
      .setDescription(`Complete daily/weekly tasks for rewards.`)
      .addField(
        "Daily",
        `${dailytask1.task} : $${numberWithCommas(
          dailytask1.reward
        )} ${dailyemote} *${dailyms} left*`
      )
      .addField(
        "Weekly",
        `${weeklytask1.task} : $${numberWithCommas(
          weeklytask1.reward
        )} ${weeklyemote} *${weeklyms} left*`
      )

      .setColor("#60b0f4")
      .setThumbnail("https://i.ibb.co/Srtk0HT/Logo-Makr-5-Db-APp.png");

    interaction.reply({ embeds: [embed] });

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
};
