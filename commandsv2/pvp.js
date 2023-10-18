

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const ms = require("pretty-ms");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const { toCurrency } = require("../common/utils");
const emotes = require("../common/emotes").emotes;
const pvpranks = require("../data/ranks.json");
const helmetdb = require("../data/pfpsdb.json");
const Global = require("../schema/global-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pvp")
    .setDescription("PVP race another user")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("race")
        .setDescription("Race against other users")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user you want to race with")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("car")
            .setDescription("The car id you want to race with")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("car2")
            .setDescription("The users car id they want to race you with")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("rank").setDescription("View your PVP rank")
    ),
  async execute(interaction) {
    const dorace = (
      speed,
      speed2,
      handling,
      handling2,
      weight,
      weight2,
      acceleration,
      acceleration2
    ) => {
      speed = speed * 100;
      speed2 = speed2 * 100;
      let player = (handling + speed - weight) / acceleration;
      let opponent = (handling2 + speed2 - weight2) / acceleration2;
      
      const playerRegression = player;
      const opponentRegression = opponent;
      winner = playerRegression >= opponentRegression ? "Player" : "Opponent";

      const string =
        `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
        `- Winner: ${winner}\n`;

      return string;
    };
    const discord = require("discord.js");
    let winner;
    const cars = require("../data/cardb.json");
    let subcommand = interaction.options.getSubcommand();
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });

    if (subcommand == "race") {
      let user2 = interaction.options.getUser("target");
      let car = interaction.options.getString("car");
      let car2 = interaction.options.getString("car2");
      if (!user2) return await interaction.reply("Specify a user to race!");

      if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

      let userdata2 = await User.findOne({ id: user2.id });
      let cooldowndata =
        (await Cooldowns.findOne({ id: user.id })) ||
        new Cooldowns({ id: user.id });
      let timeout = 600000;
      if (
        cooldowndata.pvp !== null &&
        timeout - (Date.now() - cooldowndata.pvp) > 0
      ) {
        let time = ms(timeout - (Date.now() - cooldowndata.pvp));
        let timeEmbed = new EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(`You can pvp again in ${time}`);
        return await interaction.reply({
          embeds: [timeEmbed],
          fetchReply: true,
        });
      }
      let cooldowndata2 =
        (await Cooldowns.findOne({ id: user2.id })) ||
        new Cooldowns({ id: user2.id });
      if (
        cooldowndata2.pvp !== null &&
        timeout - (Date.now() - cooldowndata2.pvp) > 0
      ) {
        let time = ms(timeout - (Date.now() - cooldowndata2.pvp));
        let timeEmbed = new EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(`${user2.username} can pvp again in ${time}`);
        return await interaction.reply({
          embeds: [timeEmbed],
          fetchReply: true,
        });
      }
      let idtoselect = car;
      let idtoselect2 = car2;
      if (user2.id == interaction.user.id)
        return interaction.reply("You cant race yourself!");
      let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
      let selected = filteredcar[0] || "No ID";
      if (selected == "No ID") {
        let errembed = new discord.EmbedBuilder()
          .setTitle("Error!")
          .setColor(colors.discordTheme.red)
          .setDescription(
            `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
          );
        return await interaction.reply({ embeds: [errembed] });
      }
      let filteredcar2 = userdata2.cars.filter((car) => car.ID == idtoselect2);
      let selected2 = filteredcar2[0] || "No ID";
      if (selected2 == "No ID") {
        let errembed = new discord.EmbedBuilder()
          .setTitle("Error!")
          .setColor(colors.discordTheme.red)
          .setDescription(
            `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
          );
        return await interaction.reply({ embeds: [errembed] });
      }

      let userpvprank = userdata.pvprank || {
        Rank: "Silver",
        Wins: 0,
        Losses: 0,
        Rewards: 0,
      };
      let userpvprank2 = userdata2.pvprank || {
        Rank: "Silver",
        Wins: 0,
        Losses: 0,
        Rewards: 0,
      };
      let urankslist = [];

      for (let r in pvpranks) {
        let rankin = pvpranks[r];

        urankslist.push(rankin);
      }

      let userrank = urankslist.filter((r) => r.name == userpvprank.Rank);
      let rrank = userrank[0].rank;

      let userrank2 = urankslist.filter((r) => r.name == userpvprank2.Rank);
      let rrank2 = userrank2[0].rank;
      let user1num = (rrank += 1);
      let user2num = (rrank2 += 1);
      let nextuser1rank = urankslist.filter((r) => r.rank == user1num);
      let nextuser2rank = urankslist.filter((r) => r.rank == user2num);

      //  if(rrank !== rrank2 && user1num !== rrank2 && user2num !== rrank) return interaction.reply(`You need to be at least the same rank, or 1 rank above the other user to race them!`)
      await interaction.reply("Revving engines...");

      let carindb1 = cars.Cars[selected.Name.toLowerCase()];
      let carindb2 = cars.Cars[selected2.Name.toLowerCase()];

      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("approve")
          .setStyle("Success")
          .setEmoji("✔️"),
        new ButtonBuilder()
          .setCustomId("deny")
          .setStyle("Danger")
          .setEmoji("✖️")
      );

      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = selected2.WeightStat;
      let speed2 = selected2.Speed;
      let acceleration2 = selected2.Acceleration;
      let handling2 = selected2.Handling;

      let weightscore = Math.floor(weight / 100);
      let weightscore2 = Math.floor(weight2 / 100);

      let speedscore = speed * 10;
      let speedscore2 = speed2 * 10;

      let carimage1 =
        selected.Image || cars.Cars[selected.Name.toLowerCase()].Image;
      let carimage2 =
        selected2.Image || cars.Cars[selected2.Name.toLowerCase()].Image;

      let embed = new discord.EmbedBuilder()
        .setTitle(`${user2.username}, would you like to race ${user.username}?`)
        .addFields([
          {
            name: `${user.username}'s ${carindb1.Emote} ${carindb1.Name}`,
            value: `${emotes.speed} Power: ${speed}\n\n${emotes.acceleration} 0-60: ${acceleration}s\n\n${emotes.handling} Handling: ${handling}\n\n${emotes.weight} Weight: ${weight}`,
          },
          {
            name: `${user2.username}'s ${carindb2.Emote} ${carindb2.Name}`,
            value: `${emotes.speed} Power: ${speed2}\n\n${emotes.acceleration} 0-60: ${acceleration2}s\n\n${emotes.handling} Handling: ${handling2}\n\n${emotes.weight} Weight: ${weight2}`,
          },
        ])
        .setImage(carimage1)
        .setThumbnail(carimage2)
        .setColor(`#60b0f4`);

      let msg = await interaction.editReply({
        embeds: [embed],
        components: [row],
        fetchReply: true,
      });

      let filter = (btnInt) => {
        return user2.id == btnInt.user.id;
      };
      const collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 30000,
      });

   



      collector.on("collect", async (i) => {
        if (i.customId.includes("approve")) {
          cooldowndata2.pvp = Date.now();
          cooldowndata.pvp = Date.now();
          cooldowndata.save();
          cooldowndata2.save();
          embed.setTitle("Racing!");
          i.update({ embeds: [embed], components: [] });

          dorace(
            speedscore,
            speedscore2,
            handling,
            handling2,
            weightscore,
            weightscore2,
            acceleration,
            acceleration2
          );
          setTimeout(async () => {
            if (winner == "Player") {
              let earnings = [];
              let rpwon = 350;

              userdata.pvprank.Wins = userdata.pvprank.Wins += 1;
              userdata2.pvprank.Losses = userdata2.pvprank.Losses += 1;
              userdata.update();
              let tasks = userdata2.tasks;
              let taskpvp = tasks.filter((task) => task.ID == "5");

              if (taskpvp[0]) {
                if (taskpvp[0].Races < 10) {
                  taskpvp[0].Races += 1;
                  await User.findOneAndUpdate(
                    {
                      id: interaction.user.id,
                    },
                    {
                      $set: {
                        "tasks.$[task]": taskpvp[0],
                      },
                    },

                    {
                      arrayFilters: [
                        {
                          "task.ID": "3",
                        },
                      ],
                    }
                  );
                }
                if (taskpvp[0].Races >= 10) {
                  userdata.cash += 20000;
                  userdata.tasks.pull(taskpvp[0]);
                  interaction.channel.send(
                    `${user} Task completed! You earned ${toCurrency(
                      taskpvp[0].Reward
                    )}`
                  );
                }
              }
              let globals = await Global.findOne();
              let usercrew = userdata.crew;

              let crews = globals.crews;

              if (usercrew) {
                let rpbonus = 0;
                let crew = crews.filter((cre) => cre.name == usercrew.name);

                let timeout = 14400000;
                let timeout2 = 7200000;
                let timeout3 = 3600000;

                if (
                  crew[0].Cards[0].time !== null &&
                  timeout - (Date.now() - crew[0].Cards[0].time) < 0
                ) {
                  console.log("no card");
                } else {
                  rpbonus += 0.2;
                }

                if (
                  crew[0].Cards[1].time !== null &&
                  timeout2 - (Date.now() - crew[0].Cards[1].time) < 0
                ) {
                  console.log("no card");
                } else {
                  rpbonus += 0.5;
                }

                if (
                  crew[0].Cards[2].time !== null &&
                  timeout3 - (Date.now() - crew[0].Cards[2].time) < 0
                ) {
                  console.log("no card");
                } else {
                  rpbonus += 1.2;
                }

                if (rpbonus > 0) {
                  rpwon = rpwon += rpwon * rpbonus;
                }
              }
              earnings.push(`${rpwon}`);
              let rewardtogive = userpvprank.Wins;
              let rewardinreward =
                userrank[0].rewards.filter(
                  (reward) => reward.number == rewardtogive
                ) || 0;
              if (rewardinreward.length !== 0) {
                if (rewardinreward[0].reward.endsWith("Cash")) {
                  let amount = Number(rewardinreward[0].reward.split(" ")[0]);
                  userdata.cash += amount;
                  userdata.pvprank.Rewards += 1;
                  earnings.push(`${emotes.cash} +${toCurrency(amount)}`);
                } else if (rewardinreward[0].reward.endsWith("Barn Map")) {
                  let amount = Number(rewardinreward[0].reward.split(" ")[0]);
                  userdata.barnmaps += amount;
                  userdata.pvprank.Rewards += 1;
                  earnings.push(`${emotes.barnMapLegendary} +${amount}`);
                } else if (
                  rewardinreward[0].reward.endsWith("Super Wheelspins")
                ) {
                  let amount = Number(rewardinreward[0].reward.split(" ")[0]);
                  userdata.swheelspins += amount;
                  userdata.pvprank.Rewards += 1;
                  earnings.push(`${emotes.superWheel} +${amount}`);
                } else if (rewardinreward[0].reward.endsWith("Lockpicks")) {
                  let amount = Number(rewardinreward[0].reward.split(" ")[0]);
                  userdata.lockpicks += amount;
                  userdata.pvprank.Rewards += 1;
                  earnings.push(`${emotes.lockpicks} +${amount}`);
                } else if (rewardinreward[0].reward.endsWith("Gold")) {
                  let amount = Number(rewardinreward[0].reward.split(" ")[0]);
                  userdata.gold += amount;
                  userdata.pvprank.Rewards += 1;
                  earnings.push(`${emotes.gold} +${amount}`);
                }
              }

              if (earnings.length > 0) {
                embed.setDescription(`${earnings.join("\n")}`);
              }
              embed.setTitle(`${user.username} Won!!`);

              await interaction.editReply({
                embeds: [embed],
              });
              userdata.update();
              if (
                userdata.pvprank.Wins >= nextuser1rank[0].wins &&
                userdata.pvprank.Name !== "Onyx"
              ) {
                userdata.pvprank.Wins = 0;
                userdata.pvprank.Losses = 0;
                userdata.pvprank.Rank = `${nextuser1rank[0].name}`;
              }
              if (userdata.pvprank.Losses >= 20) {
                userdata.pvprank.Wins = 0;
                userdata.pvprank.Losses = 0;
              }

              if (
                userdata2.pvprank.Wins >= nextuser2rank[0].wins &&
                userdata.pvprank.Name !== "Onyx"
              ) {
                userdata2.pvprank.Wins = 0;
                userdata2.pvprank.Losses = 0;
                userdata2.pvprank.Rank = `${
                  nextuser2rank[0].name && userdata.pvprank.Name !== "Onyx"
                }`;
              }
              if (
                userdata2.pvprank.Losses >= 20 &&
                userdata.pvprank.Name !== "Onyx"
              ) {
                userdata2.pvprank.Wins = 0;
                userdata2.pvprank.Losses = 0;
              }

              userdata.markModified("pvprank");
              userdata2.markModified("pvprank");
              userdata.save();
              userdata2.save();
            }
            // lost
            else if (winner == "Opponent") {
              let tasks2 = userdata2.tasks;
              let taskpvp2 = tasks2.filter((task) => task.ID == "5");
              if (taskpvp2[0]) {
                if (taskpvp2[0].Races < 10) {
                  taskpvp2[0].Races += 1;
                  await User.findOneAndUpdate(
                    {
                      id: interaction.user.id,
                    },
                    {
                      $set: {
                        "tasks.$[task]": taskpvp2[0],
                      },
                    },

                    {
                      arrayFilters: [
                        {
                          "task.ID": "3",
                        },
                      ],
                    }
                  );
                }
                if (taskpvp2[0].Races >= 10) {
                  userdata.cash += 20000;
                  userdata.tasks.pull(taskpvp2[0]);
                  interaction.channel.send(
                    `${user2} Task completed! You earned ${toCurrency(
                      taskpvp2[0].Reward
                    )}`
                  );
                }
              }
              let earnings = [];
              userdata2.pvprank.Wins = userdata2.pvprank.Wins += 1;
              userdata2.pvprank.Losses = userdata2.pvprank.Losses += 1;
              userdata.update();

              let rewardtogive = userpvprank2.Wins;
              let rewardinreward =
                userrank2[0].rewards.filter(
                  (reward) => reward.number == rewardtogive
                ) || 0;
              if (rewardinreward.length !== 0) {
                if (rewardinreward[0].reward.endsWith("Cash")) {
                  let amount = Number(rewardinreward[0].reward.split(" ")[0]);
                  userdata2.cash += amount;
                  userdata2.pvprank.Rewards += 1;
                  earnings.push(`${emotes.cash} +${toCurrency(amount)}`);
                } else if (rewardinreward[0].reward.endsWith("Barn Map")) {
                  let amount = Number(rewardinreward[0].reward.split(" ")[0]);
                  userdata2.barnmaps += amount;
                  userdata2.pvprank.Rewards += 1;
                  earnings.push(`${emotes.barnMapLegendary} +${amount}`);
                } else if (
                  rewardinreward[0].reward.endsWith("Super Wheelspins")
                ) {
                  let amount = Number(rewardinreward[0].reward.split(" ")[0]);
                  userdata2.swheelspins += amount;
                  userdata2.pvprank.Rewards += 1;
                  earnings.push(`${emotes.superWheel} +${amount}`);
                } else if (rewardinreward[0].reward.endsWith("Lockpicks")) {
                  let amount = Number(rewardinreward[0].reward.split(" ")[0]);
                  userdata2.lockpicks += amount;
                  userdata2.pvprank.Rewards += 1;
                  earnings.push(`${emotes.lockpicks} +${amount}`);
                } else if (rewardinreward[0].reward.endsWith("Gold")) {
                  let amount = Number(rewardinreward[0].reward.split(" ")[0]);
                  userdata2.gold += amount;
                  userdata2.pvprank.Rewards += 1;
                  earnings.push(`${emotes.gold} +${amount}`);
                }
              }
              let usercrew2 = userdata2.crew;
              let globals = await Global.findOne();
              let crews = globals.crews;
              let rpwon = 350;
              if (usercrew2) {
                let rpbonus = 0;
                let crew = crews.filter((cre) => cre.name == usercrew2.name);

                let timeout = 14400000;
                let timeout2 = 7200000;
                let timeout3 = 3600000;

                if (
                  crew[0].Cards[0].time !== null &&
                  timeout - (Date.now() - crew[0].Cards[0].time) < 0
                ) {
                  console.log("no card");
                } else {
                  rpbonus += 0.2;
                }

                if (
                  crew[0].Cards[1].time !== null &&
                  timeout2 - (Date.now() - crew[0].Cards[1].time) < 0
                ) {
                  console.log("no card");
                } else {
                  rpbonus += 0.5;
                }

                if (
                  crew[0].Cards[2].time !== null &&
                  timeout3 - (Date.now() - crew[0].Cards[2].time) < 0
                ) {
                  console.log("no card");
                } else {
                  rpbonus += 1.2;
                }

                if (rpbonus > 0) {
                  rpwon = rpwon += rpwon * rpbonus;
                }
              }
              earnings.push(`${rpwon}`);
              if (earnings.length > 0) {
                embed.setDescription(`${earnings.join("\n")}`);
              }
              embed.setTitle(`${user2.username} Won!`);

              await interaction.editReply({
                embeds: [embed],
              });
              userdata2.pvprank.Wins += 1;
              userdata.pvprank.Losses += 1;
              userdata.markModified();
              userdata2.markModified();
              userdata.update();
              userdata2.update();
              if (userdata.pvprank.Wins >= nextuser1rank.wins) {
                userdata.pvprank.Wins = 0;
                userdata.pvprank.Losses = 0;
                userdata.pvprank.Rank = `${nextuser1rank.name}`;
              }
              if (userdata.pvprank.Losses >= 20) {
                userdata.pvprank.Wins = 0;
                userdata.pvprank.Losses = 0;
              }

              if (userdata2.pvprank.Wins >= nextuser2rank.wins) {
                userdata2.pvprank.Wins = 0;
                userdata2.pvprank.Losses = 0;
                userdata2.pvprank.Rank = `${nextuser2rank.name}`;
              }
              if (userdata2.pvprank.Losses >= 20) {
                userdata2.pvprank.Wins = 0;
                userdata2.pvprank.Losses = 0;
              }

              userdata.markModified("pvprank");
              userdata2.markModified("pvprank");
              userdata.save();
              userdata2.save();
            }
          }, 5000);
        } else {
          embed.addFields([{ name: "Result", value: "Declined" }]);
          row.components[0].setDisabled(true);
          row.components[1].setDisabled(true);

          i.update({ embeds: [embed], components: [row] });
        }
      });
    } else if (subcommand == "rank") {
      let pvprank = userdata.pvprank || { Rank: "Silver", Wins: 0, Losses: 0 };
      let rankslist = [];

      for (let r in pvpranks) {
        let rankin = pvpranks[r];

        rankslist.push(rankin);
      }

      let userrank = rankslist.filter((r) => r.name == pvprank.Rank);
      let rrank = userrank[0].rank;
      let nextnum = (rrank += 1);
      let nextrank = rankslist.filter((r) => r.rank == nextnum);
      nextrank = nextrank[0] || { wins: 0, name: "Onyx" };
      let newwins = nextrank.wins || 0;

      if (userdata.pvprank.Name == "Onyx") {
        newwins = 0;
      }

      console.log(nextrank);

      let embed = new EmbedBuilder()
        .setAuthor({
          name: `${user.username} - PVP Rank`,
          iconURL: `${helmetdb.Pfps[userdata.helmet.toLowerCase()].Image}`,
        })
        .setDescription(
          `${pvpranks[pvprank.Rank.toLowerCase()].emote} ${
            pvprank.Rank
          }\n\nWins: ${pvprank.Wins}\n\nWins Needed: ${newwins}`
        )
        .setThumbnail(`${pvpranks[pvprank.Rank.toLowerCase()].icon}`)
        .setColor(colors.blue);

      interaction.reply({ embeds: [embed] });
    }
  },
};


