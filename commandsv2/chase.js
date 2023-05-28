const Discord = require("discord.js");
const profilepics = require("../data/pfpsdb.json");
const cardb = require("../data/cardb.json");
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency, randomRange } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const achievementsdb = require("../data/achievements.json");
const pvpranks = require("../data/ranks.json");
const titledb = require("../data/titles.json");
const emotes = require("../common/emotes").emotes;
const jobdb = require("../data/jobs.json");
const Cooldowns = require("../schema/cooldowns");
const ms = require("pretty-ms");
const { createCanvas, loadImage } = require("canvas");
const lodash = require("lodash");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chase")
    .setDescription("Chase a user racing")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to chase")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("Vehicle to use in pursuit")
        .setRequired(true)
    ),
  async execute(interaction) {
    let user = interaction.options.getUser("user");
    let userdata = await User.findOne({ id: user.id });
    let bounty = userdata.bounty || 0;
    let policeuser = interaction.user;
    let policedata = await User.findOne({ id: policeuser.id });
    let policecooldown = await Cooldowns.findOne({ id: policeuser.id });
    let racercooldown = await Cooldowns.findOne({ id: user.id });
    let chasecool = policecooldown.chasing;
    let timeout = 900000;
    let raceritems = userdata.items;
    let policeitems = policedata.items;
    let chased = userdata.chased;
    let chasedtime = 43200000;

    if (chasecool !== null && timeout - (Date.now() - chasecool) > 0) {
      let time = ms(timeout - (Date.now() - chasecool));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(
          `You need to wait ${time} before chasing someone again.`
        );
      return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }
    if (chased !== null && chasedtime - (Date.now() - chased) > 0) {
      let time = ms(chasedtime - (Date.now() - chased));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`This user can be chased again in ${time}.`);
      return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }
    if (bounty == 0)
      return interaction.reply("Negative, that user is innocent");
    let selectedpolice = interaction.options.getString("car");
    if (!selectedpolice[0])
      return interaction.reply(
        "Thats not a police car! Try using the ID of the car you want to use, or try using a police car"
      );

    await interaction.reply(
      `${user}, ${policeuser} is chasing you! Use any items you can to lose them, or just run.\n\n${policeuser}, We have an APB on a racer, all units proceed and take him out.`
    );

    policecooldown.chasing = Date.now();
    policecooldown.save();
    selectedpolice = policedata.cars.filter(
      (car) => car.ID == selectedpolice && car.police == true
    );
    selectedpolice = selectedpolice[0];

    let selectedracer = userdata.car_racing || lodash.sample(userdata.cars);
    let racerusing = userdata.using
    let liveryracer =
      selectedracer.Livery ||
      cardb.Cars[selectedracer.Name.toLowerCase()].Image;

    let liverypolice =
      selectedpolice.Livery ||
      cardb.Cars[selectedpolice.Name.toLowerCase()].Image;

    let embed = new Discord.EmbedBuilder()
      .setTitle(`Chasing suspect ${user.username} ${emotes.police}`)
      .addFields(
        {
          name: `${policeuser.username}'s ${selectedpolice.Name}`,
          value: `${emotes.speed} Power: ${selectedpolice.Speed}\n${emotes.zero2sixty} Acceleration: ${selectedpolice.Acceleration}s\n${emotes.handling} Handling: ${selectedpolice.Handling}\n${emotes.weight} Weight: ${selectedpolice.WeightStat}\n\n${emotes.bounty} Rank: ${policedata.work.position}`,
        },
        {
          name: `${user.username}'s ${selectedracer.Name}`,
          value: `${emotes.speed} Power: ${selectedracer.Speed}\n${emotes.zero2sixty} Acceleration: ${selectedracer.Acceleration}s\n${emotes.handling} Handling: ${selectedracer.Handling}\n${emotes.weight} Weight: ${selectedracer.WeightStat}\n\n${emotes.bounty} Bounty: ${userdata.bounty}`,
        }
      )
      .setImage(liverypolice)
      .setThumbnail(liveryracer)
      .setColor(colors.blue);

    let policemph = selectedpolice.Speed;
    let racermph = selectedracer.Speed;

    let msg = await interaction.editReply({
      embeds: [embed],
      fetchReply: true,
    });

    if (raceritems.includes("emp")) {
      console.log("emp");
      policemph = policemph -= 20;
      for (var i = 0; i < 1; i++)
        raceritems.splice(raceritems.indexOf("emp"), 1);
      userdata.items = raceritems;
      embed.setFields(
        {
          name: `${policeuser.username}'s ${selectedpolice.Name}`,
          value: `${emotes.speed} Power: ${policemph}\n${emotes.zero2sixty} Acceleration: ${selectedpolice.Acceleration}s\n${emotes.handling} Handling: ${selectedpolice.Handling}\n${emotes.weight} Weight: ${selectedpolice.Weight}\n\n${emotes.bounty} Rank: ${policedata.work.position}`,
        },
        {
          name: `${user.username}'s ${selectedracer.Name}`,
          value: `${emotes.speed} Power: ${selectedracer.Speed}\n${emotes.zero2sixty} Acceleration: ${selectedracer.Acceleration}s\n${emotes.handling} Handling: ${selectedracer.Handling}\n${emotes.weight} Weight: ${selectedracer.Weight}\n\n${emotes.bounty} Bounty: ${userdata.bounty}`,
        }
      );
      await msg.edit({ content: `The racer used an EMP!`, embeds: [embed] });
    }

    if (policeitems.includes("spikes")) {
      console.log("spikes");
      for (var i2 = 0; i2 < 1; i2++)
        policeitems.splice(policeitems.indexOf("spikes"), 1);
      policedata.items = policeitems;
      racermph = racermph -= 20;
      embed.setFields(
        {
          name: `${policeuser.username}'s ${selectedpolice.Name}`,
          value: `${emotes.speed} Power: ${policemph}\n${emotes.zero2sixty} Acceleration: ${selectedpolice.Acceleration}s\n${emotes.handling} Handling: ${selectedpolice.Handling}\n${emotes.weight} Weight: ${selectedpolice.WeightStat}\n\n${emotes.bounty} Rank: ${policedata.work.position}`,
        },
        {
          name: `${user.username}'s ${selectedracer.Name}`,
          value: `${emotes.speed} Power: ${racermph}\n${emotes.zero2sixty} Acceleration: ${selectedracer.Acceleration}s\n${emotes.handling} Handling: ${selectedracer.Handling}\n${emotes.weight} Weight: ${selectedracer.WeightStat}\n\n${emotes.bounty} Bounty: ${userdata.bounty}`,
        }
      );
      await msg.edit({ content: `The police used spikes!`, embeds: [embed] });
    }

    let policespeed = 0;
    let racerspeed = 0;

    let policeacc = selectedpolice.Acceleration * 10;
    let raceacc = selectedracer.Acceleration * 10;

    let policeweight = selectedpolice.WeightStat;
    let racerweight = selectedracer.WeightStat;

    let racerhandling = selectedracer.Handling / 100;
    let policehandling = selectedpolice.Handling / 100;

    console.log(selectedracer.Handling);
    console.log(selectedpolice.Handling);

    let x = setInterval(() => {
      if (policespeed <= policemph) {
        policespeed++;
      } else {
        clearInterval(x);
      }
    }, policeacc);

    let x2 = setInterval(() => {
      if (racerspeed <= racermph) {
        racerspeed++;
      } else {
        clearInterval(x);
      }
    }, raceacc);

    let tracklength = 0;
    let tracklength2 = 0;
    let timer = 0;

    let w = setInterval(async () => {
      if (racerspeed > racermph) {
        racerspeed = racermph;
      }
      if (policespeed > policemph) {
        policespeed = policemph;
      }

      timer++;
      policespeed / 6;

      racerspeed / 6;

      console.log(`handling ${policehandling}`);

      let formula = (policespeed += policehandling += policeweight / 100);

      console.log(formula);

      // car 2

      let formula2 = (racerspeed += racerhandling += racerweight / 100);
      console.log(formula2);

      tracklength += formula;
      tracklength2 += formula2;
      let chasedbounty = randomRange(1, bounty);
      let newbounty = (bounty -= chasedbounty);
      console.log(timer);
      if (timer >= 10) {
        clearInterval(w);
        clearInterval(x);
        clearInterval(x2);
        if (tracklength > tracklength2) {
          embed.setTitle(`🚨 Busted! 🚨`);
          embed.setDescription(
            `${user} your car has been impounded and you lost ${newbounty} bounty\n${policeuser} you gained ${newbounty} bounty`
          );
          
          let coold = racercooldown.permissionslip
          if(racerusing.includes("permission slip") && coold !== null && timeout - (Date.now() - coold) > 0){
            interaction.channel.send("Your car is safe thanks to your permission slip!")
          
          }
          else {

          await User.findOneAndUpdate(
            {
              id: user.id,
            },
            {
              $set: {
                "cars.$[car].Impounded": true,
                "cars.$[car].ImpoundTime": Date.now(),
              },
            },

            {
              arrayFilters: [
                {
                  "car.Name": selectedracer.Name,
                },
              ],
            }
          );
          }
         

          
          
          userdata.bounty -= newbounty;
          userdata.chased = Date.now();
          policedata.bounty += newbounty;
          userdata.save();
          policedata.save();
          await msg.edit({ embeds: [embed] });
        } else if (tracklength2 > tracklength) {
          embed.setTitle(`🏎️ Got away! 🏎️`);
          embed.setDescription(
            `${user} you gained ${toCurrency(
              bounty
            )}\n${policeuser} your police car has been impounded`
          );

          await User.findOneAndUpdate(
            {
              id: policeuser.id,
            },
            {
              $set: {
                "cars.$[car].Impounded": true,
                "cars.$[car].ImpoundTime": Date.now(),
              },
            },

            {
              arrayFilters: [
                {
                  "car.Name": selectedpolice.Name,
                },
              ],
            }
          );
          userdata.chased = Date.now();
          userdata.cash += bounty;
          userdata.save();
          policedata.save();

          await msg.edit({ embeds: [embed] });
        }
      }
    }, 1000);
  },
};
