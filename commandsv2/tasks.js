const db = require("quick.db");
const Discord = require("discord.js");
const ms = require("pretty-ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const colors = require("../common/colors");
const { toCurrency, randomRange } = require("../common/utils");

const User = require("../schema/profile-schema");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tasks")
    .setDescription("View your tasks and claim them")
    .addSubcommand((cmd) =>
      cmd
        .setName("claim")
        .setDescription("Claim a task by id")

    )
    .addSubcommand((cmd) =>
      cmd.setName("list").setDescription("List the tasks you can claim")
    )
    .addSubcommand((cmd) =>
      cmd.setName("view").setDescription("View your tasks and their progress")
    ),

  async execute(interaction) {
    let userid = interaction.user.id;
    let userdata = await User.findOne({ id: userid });
    let tasksdb = require("../data/tasks.json");
    let subcommand = interaction.options.getSubcommand();
    let usertasks = userdata.tasks;

    if (subcommand == "list") {
      let tasksarr = [];
      for (let task in tasksdb) {
        let t = tasksdb[task];

        tasksarr.push(`\`ID: ${t.ID}\`${t.Task} : ${toCurrency(t.Reward)}`);
      }
      let embed = new Discord.EmbedBuilder()
        .setTitle("Claimable tasks")
        .setDescription(
          `${tasksarr.join("\n")}\n\nUse **/task claim [ID]** to claim a task!`
        )
        .setColor(colors.blue);

      interaction.reply({ embeds: [embed] });
    } else if (subcommand == "claim") {
      let taskid = randomRange(1, 6)
      let filteredtask = usertasks.filter((task) => task.ID == taskid);
      let taskindb = tasksdb[taskid];
    
      if (filteredtask.length > 0) return interaction.reply("You already have a task in progress!");
      let filteredtime = usertasks.filter(
        (task) => task.ID == `T${taskindb.ID}`
      );
      if (filteredtime[0]) {
        let timeremain = filteredtime[0].Time;
        let timeout = taskindb.Time;
        if (timeremain !== null && timeout - (Date.now() - timeremain) > 0) {
          let time = ms(timeout - (Date.now() - timeremain));
          let timeEmbed = new Discord.EmbedBuilder()
            .setColor(colors.blue)
            .setDescription(
              `You've already completed this task\n\nClaim it it again in ${time}.`
            );
          await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
          return;
        }
      }
      let taskobj;
      if (taskindb.Race) {
        taskobj = {
          ID: taskindb.ID,
          Completed: false,
          Races: 0,
          Task: taskindb.Task,
          Time: taskindb.Time,
          Reward: taskindb.Reward,
        };
      } else {
        taskobj = {
          ID: taskindb.ID,
          Completed: false,
          Task: taskindb.Task,
          Time: taskindb.Time,
          Reward: taskindb.Reward,
        };
      }

      userdata.tasks.push(taskobj);
      userdata.save();

      interaction.reply(`You claimed the task **"${taskindb.Task}"**`);
    } else if (subcommand == "view") {
      let tasksarr = [];

      for (let task in usertasks) {
        let t = usertasks[task];
        let emote = " ";
        console.log(t);

        let filteredtime = usertasks.filter((task) => task.ID == `T1`);
        let filteredtime2 = usertasks.filter((task) => task.ID == `T2`);
        let filteredtime3 = usertasks.filter((task) => task.ID == `T3`);
        // eslint-disable-next-line no-prototype-builtins
        if (t.hasOwnProperty("Races")) {
          console.log("races");
          emote = `**${t.Races}/10**`;
        }
        if (
          t !== filteredtime[0] &&
          t !== filteredtime2[0] &&
          t !== filteredtime3[0]
        ) {
          tasksarr.push(
            `\`ID: ${t.ID}\`${t.Task} : ${toCurrency(t.Reward)} ${emote}`
          );
        }
      }
      if (tasksarr.length == 0)
        return interaction.reply(
          "You don't have any tasks! Try claiming some with /tasks claim"
        );
      let embed = new Discord.EmbedBuilder()
        .setTitle("Your tasks")
        .setDescription(`${tasksarr.join("\n")}`)
        .setColor(colors.blue);

      interaction.reply({ embeds: [embed] });
    }
  },
};
