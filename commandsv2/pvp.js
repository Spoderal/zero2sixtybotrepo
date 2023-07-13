const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  ButtonBuilder,
  AttachmentBuilder,
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
    const discord = require("discord.js");

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
      let timeout = 3600000;
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

      let tracklength = 1000;
      let tracklength2 = 1000;
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

      if (!selected.WeightStat) {
        selected.WeightStat = cars.Cars[selected.Name.toLowerCase()].Weight;
      }

      let mph = selected.Speed;
      let weight =
        selected.WeightStat || cars.Cars[selected.Name.toLowerCase()].Weight;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      if (!selected2.Weight) {
        selected2.Weight = cars.Cars[selected2.Name.toLowerCase()].Weight;
      }
      let mph2 = selected2.Speed;
      let weight2 = selected2.Weight;
      let acceleration2 = selected2.Acceleration;
      let handling2 = selected2.Handling;

      let speed = 0;
      let speed2 = 0;

      let accms = acceleration * 10;
      let accms2 = acceleration2 * 10;

      let x = setInterval(() => {
        if (speed <= mph) {
          speed++;
        } else {
          clearInterval(x);
        }
      }, accms);
      let x2 = setInterval(() => {
        if (speed2 <= mph2) {
          speed2++;
        } else {
          clearInterval(x2);
        }
      }, accms2);

      let embed = new discord.EmbedBuilder()
        .setTitle(`${user2.username}, would you like to race ${user.username}?`)
        .addFields([
          {
            name: `${user.username}'s ${carindb1.Emote} ${carindb1.Name}`,
            value: `${emotes.speed} Power: ${mph}\n\n${emotes.zero2sixty} 0-60: ${acceleration}s\n\n${emotes.handling} Handling: ${handling}\n\n${emotes.weight} Weight: ${weight}`,
          },
          {
            name: `${user2.username}'s ${carindb2.Emote} ${carindb2.Name}`,
            value: `${emotes.speed} Power: ${mph2}\n\n${emotes.zero2sixty} 0-60: ${acceleration2}s\n\n${emotes.handling} Handling: ${handling2}\n\n${emotes.weight} Weight: ${weight2}`,
          },
        ])
        .setImage(carindb1.Image)
        .setThumbnail(carindb2.Image)
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

          let i2 = setInterval(async () => {
            if (speed2 > mph2) {
              speed2 = mph2;
            }
            if (speed > mph) {
              speed = mph;
            }
            console.log(`speed ${speed}`);
            console.log(`speed2 ${speed2}`);
            speed / 6;
            handling = handling / 100;
            handling2 = handling2 / 100;
            speed2 / 6;

            let formula = (speed += handling += weight / 100);

            console.log(formula);

            // car 2

            let formula2 = (speed2 += handling2 += weight2 / 100);
            console.log(formula2);

            tracklength -= formula;
            tracklength2 -= formula2;

            if (tracklength <= 0) {
              clearInterval(i2);

              let earnings = [];
              userdata.pvprank.Wins = userdata.pvprank.Wins += 1;
              userdata2.pvprank.Losses = userdata2.pvprank.Losses += 1;
              userdata.update();

              let rewardtogive = userpvprank.Wins;
              let rewardinreward =
                userrank[0].rewards.filter(
                  (reward) => reward.number == rewardtogive
                ) || 0;
              console.log(rewardinreward);
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
              console.log(nextuser1rank[0]);
              userdata.update();
              if (
                userdata.pvprank.Wins >= nextuser1rank[0].wins &&
                userdata.pvprank.Name !== "Onyx"
              ) {
                console.log("ranked up");
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
            else if (tracklength2 <= 0) {
              clearInterval(i2);

              let earnings = [];
              userdata2.pvprank.Wins = userdata2.pvprank.Wins += 1;
              userdata2.pvprank.Losses = userdata2.pvprank.Losses += 1;
              userdata.update();

              let rewardtogive = userpvprank2.Wins;
              let rewardinreward =
                userrank2[0].rewards.filter(
                  (reward) => reward.number == rewardtogive
                ) || 0;
              console.log(rewardinreward);
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
            console.log(tracklength);
            console.log(tracklength2);
          }, 1000);
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

function roundedImage(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
