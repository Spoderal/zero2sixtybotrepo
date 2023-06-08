const ms = require("pretty-ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { userGetPatreonTimeout } = require("../common/user");
const { toCurrency } = require("../common/utils");
const cars = require("../data/cardb.json");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const lodash = require("lodash");
const cratedb = require("../data/cratedb.json");

const { createCanvas, loadImage } = require("canvas");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("drift")
    .setDescription("Drift your car")
    .addStringOption((option) =>
      option
        .setName("difficulty")
        .setDescription("The track difficulty")
        .setRequired(true)
        .addChoices(
          { name: "Easy", value: "easy" },
          { name: "Medium", value: "medium" },
          { name: "Hard", value: "hard" },
          { name: "Master", value: "master" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("track")
        .setDescription("The track you want to drift on")
        .setRequired(true)
        .addChoices(
          { name: "Regular", value: "regular" },
          { name: "Mountain", value: "mountain" },
          { name: "Parking Garage", value: "parking garage" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {
    let user = interaction.user;
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: user.id });
    let driftcooldown = cooldowndata.drift;
    let track = interaction.options.getString("track");
    let difficulty = interaction.options.getString("difficulty");
    let timeout = 45000;
    let idtoselect = interaction.options.getString("car");

    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";

    if (selected == "No ID") {
      let errembed = new EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    if (driftcooldown !== null && timeout - (Date.now() - driftcooldown) > 0) {
      let timel = ms(timeout - (Date.now() - driftcooldown));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`You can race again in ${timel}`);
      return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }
    let velocity = selected.Speed;

    if (velocity >= 300)
      return interaction.reply("Your car is too fast so it crashed!");

    let acc = selected.Acceleration;

    let weight =
      selected.WeightStat || cars.Cars[selected.Name.toLowerCase()].Weight;

    let handling = selected.Handling;

    let time;

    let timelimit;

    let notorietyreward;

    let cashreward;
    let crater;
    let cratereward = lodash.sample(["yes", "no", "no"]);
    if (cratereward == "yes") {
      crater = true;
    }
    let keysreward;
    let dranks;
    if (difficulty == "easy") {
      keysreward = 1;
      time = 100;
      timelimit = 15;
      notorietyreward = 50;
      cashreward = 100;
      dranks = 1;
    } else if (difficulty == "medium") {
      keysreward = 2;
      time = 250;
      timelimit = 10;
      notorietyreward = 100;
      cashreward = 250;
      dranks = 2;
    } else if (difficulty == "hard") {
      keysreward = 3;
      time = 500;
      timelimit = 7;

      notorietyreward = 200;
      cashreward = 500;
      dranks = 2;
    } else if (difficulty == "master") {
      keysreward = 4;
      time = 550;
      timelimit = 5;

      notorietyreward = 300;
      cashreward = 600;
      dranks = 3;
    }

    let tracklength;

    if (track == "regular") {
      tracklength = 10000;
      notorietyreward = notorietyreward * 1;
      cashreward = cashreward * 1;
    } else if (track == "mountain") {
      tracklength = 20000;
      notorietyreward = notorietyreward * 1.5;
      cashreward = cashreward * 2;
    } else if (track == "parking garage") {
      tracklength = 30000;
      notorietyreward = notorietyreward * 2;
      cashreward = cashreward * 3;
    }

    let speed = velocity / 2;
    let momentum = speed * weight;

    momentum = momentum / acc;

    momentum = momentum * handling;

    momentum = momentum / time;

    let driftscore = momentum / velocity;
    await interaction.reply({
      content: "Revving engines...",
      fetchReply: true,
    });

    let trackimg;
    let trackemote;
    let miles = 0;
    keysreward = 1;
    if (track == "regular") {
      trackemote = "🛣️";
      if (difficulty == "easy") {
        trackimg = "https://i.ibb.co/mtbZtS8/track-regular.png";
      } else if (difficulty == "medium") {
        trackimg = "https://i.ibb.co/YpzH8gZ/track-regular-medium.png";
      } else if (difficulty == "hard") {
        trackimg = "https://i.ibb.co/7bVpDKp/track-regular-hard.png";
      } else if (difficulty == "master") {
        trackimg = "https://i.ibb.co/YjXsvc2/track-regular-master.png";
      }
      miles = 3;
    } else if (track == "mountain") {
      trackemote = "🏔️";
      if (difficulty == "easy") {
        trackimg = "https://i.ibb.co/yRH20Hs/track-mountains.png";
      } else if (difficulty == "medium") {
        trackimg = "https://i.ibb.co/mqvt9Hw/track-mountains-medium.png";
      } else if (difficulty == "hard") {
        trackimg = "https://i.ibb.co/sKsTTFD/track-mountains-hard.png";
      } else if (difficulty == "master") {
        trackimg = "https://i.ibb.co/ZWg8Z83/track-mountains-master.png";
      }
      miles = 5;
    } else if (track == "parking garage") {
      trackemote = "🅿️";
      if (difficulty == "easy") {
        trackimg = "https://i.ibb.co/4Jb4Pqn/track-parking.png";
      } else if (difficulty == "medium") {
        trackimg = "https://i.ibb.co/zHKLphZ/track-parking-medium.png";
      } else if (difficulty == "hard") {
        trackimg = "https://i.ibb.co/WBkQHvm/track-parking-hard.png";
      } else if (difficulty == "master") {
        trackimg = "https://i.ibb.co/F00h1Rv/track-parking-master.png";
      }
      miles = 2;
    }
    if (track == "mountain" && difficulty == "master") {
      tracklength = 35000;
      cashreward = cashreward * 4;
      dranks = dranks * 3;
      trackimg = "https://i.ibb.co/NF6jb79/devilsmountain2.png";
    }

    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext("2d");
    const bg = await loadImage(trackimg);
    let img = selected.Image || cars.Cars[selected.Name.toLowerCase()].Image;
    let selected1image = await loadImage(img);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.save();
    roundedImage(ctx, 320, 200, 640, 360, 20);
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(selected1image, 320, 200, 640, 360);
    ctx.restore();

    let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
      name: "profile-image.png",
    });
    let embed = new EmbedBuilder()
      .setTitle(`Drifting on the ${trackemote} ${difficulty} ${track} track!`)
      .addFields({
        name: `${selected.Emote} ${selected.Name}`,
        value: `${emotes.speed} Power: ${velocity}\n\n${emotes.zero2sixty} Acceleration: ${acc}s\n\n${emotes.weight} Weight: ${weight}\n\n${emotes.handling} Handling: ${handling}`,

        inline: true,
      })
      .setColor(colors.blue)
      .setImage("attachment://profile-image.png");

    await interaction.editReply({
      embeds: [embed],
      files: [attachment],
      fetchReply: true,
    });

    cooldowndata.drift = Date.now();
    cooldowndata.save();
    let x = setInterval(async () => {
      timelimit -= 1;
      tracklength -= driftscore;
      console.log(timelimit);
      console.log(tracklength);
      if (timelimit <= 0) {
        if (tracklength > 0) {
          embed.setTitle(`${trackemote} ${difficulty} ${track} track lost.`);
          await interaction.editReply({ embeds: [embed] });
        } else if (tracklength <= 0) {
          console.log(crater);
          console.log(cratereward);
          let earnings = [];
          let filteredhouse = userdata.houses.filter(
            (house) => house.Name == "Casa Sul Lago"
          );
          if (userdata.houses && filteredhouse[0]) {
            notorietyreward = notorietyreward * 2;
          }

          let using = userdata.using;
          if (using.includes("fruit punch")) {
            dranks = dranks * 2;
          }
          //test
          earnings.push(`${emotes.cash} +${cashreward}`);
          if (keysreward > 0) {
            earnings.push(`${emotes.dirftKey} +${keysreward}`);
            userdata.dkeyst += keysreward;
          }
          earnings.push(`+${dranks} Drift Rank`);

          userdata.driftrank += dranks;
          userdata.cash += cashreward;
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car].Miles": (selected.Miles += miles),
              },
            },

            {
              arrayFilters: [
                {
                  "car.Name": selected.Name,
                },
              ],
            }
          );
          if (crater == true) {
            earnings.push(
              `+ ${cratedb.Crates["seasonal crate"].Emote} ${cratedb.Crates["seasonal crate"].Name}`
            );
            userdata.items.push("seasonal crate");
          }
          if (difficulty == "master") {
            let filteredach = userdata.achievements.filter(
              (ach) => ach.name == "Drift King"
            );
            userdata.masterwins += 1;
            if (userdata.masterwins == 20 && !filteredach[0]) {
              userdata.achievements.push({
                name: "Drift King",
              });
            }
          }

          if (difficulty == "master" && track == "mountain") {
            userdata.dkeyst += 2;
            if (!userdata.titles.includes("drift king")) {
              userdata.titles.push("drift king");
            }
          }
          userdata.save();
          embed.setDescription(`${earnings.join("\n")}`);
          embed.setTitle(`${trackemote} ${difficulty} ${track} track won!`);
          await interaction.editReply({ embeds: [embed] });
        }
        clearInterval(x);
        return;
      }
    }, 1000);
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
