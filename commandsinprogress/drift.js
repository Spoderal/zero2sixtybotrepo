

const ms = require("pretty-ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const cars = require("../data/cardb.json");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const achievementdb = require("../data/achievements.json")
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

    if (selected.Gas <= 0)
    return interaction.reply(
      `You're out of gas! Use \`/gas\` to fill up for the price of gas today! Check the daily price of gas with \`/bot\``
    );
    if (driftcooldown !== null && timeout - (Date.now() - driftcooldown) > 0) {
      let timel = ms(timeout - (Date.now() - driftcooldown));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`You can race again in ${timel}`);
      return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }
    let velocity = selected.Speed;



    let acc = selected.Acceleration;

    let weight =
      selected.WeightStat || cars.Cars[selected.Name.toLowerCase()].Weight;

    let handling = selected.Handling;

    let timelimit;

    let notorietyreward;

    let cashreward;

    let xp;
    if (difficulty == "easy") {
      timelimit = 15;
      notorietyreward = 50;
      cashreward = 100;
      xp = 10;
    } else if (difficulty == "medium") {
      timelimit = 10;
      notorietyreward = 100;
      cashreward = 250;
      xp = 20;
    } else if (difficulty == "hard") {
      timelimit = 7;

      notorietyreward = 200;
      cashreward = 500;
      xp = 30;
    } else if (difficulty == "master") {
      timelimit = 5;

      notorietyreward = 300;
      cashreward = 600;
      xp = 50;
    }

    let tracklength;

    if (track == "regular") {
      tracklength = 500;
      notorietyreward = notorietyreward * 1;
      cashreward = cashreward * 1;
    } else if (track == "mountain") {
      tracklength = 1000;
      notorietyreward = notorietyreward * 1.5;
      cashreward = cashreward * 2;
    } else if (track == "parking garage") {
      tracklength = 2500;
      notorietyreward = notorietyreward * 2;
      cashreward = cashreward * 3;
    }

    let speed = velocity;
    let weight2 = weight / 1000;
    let momentum = speed / weight2;

    momentum = momentum / acc;

    momentum = momentum * handling;

    let driftscore = momentum / velocity;
    await interaction.reply({
      content: "Revving engines...",
      fetchReply: true,
    });

    let trackimg;
    let trackemote;
    let miles = 0;
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
        value: `${emotes.speed} Power: ${velocity.toFixed(1)}\n\n${
          emotes.acceleration
        } Acceleration: ${acc.toFixed(1)}s\n\n${
          emotes.weight
        } Weight: ${weight}\n\n${emotes.handling} Handling: ${handling.toFixed(
          1
        )}`,

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
    cooldowndata.is_racing = Date.now();
    cooldowndata.save();
    let x = setInterval(async () => {
      timelimit -= 1;
      tracklength -= driftscore;

      if (timelimit <= 0 || tracklength <= 0) {
        if (tracklength > 0) {
          embed.setTitle(`${trackemote} ${difficulty} ${track} track lost.`);
          await interaction.editReply({ embeds: [embed] });
        } else if (tracklength <= 0) {
          let earnings = [];
          let filteredhouse = userdata.houses.filter(
            (house) => house.Name == "Casa Sul Lago"
          );
          if (userdata.houses && filteredhouse[0]) {
            notorietyreward = notorietyreward * 2;
          }

          let using = userdata.using;
          if (using.includes("fruit punch")) {
            xp = xp * 2;
          }
          //test
          earnings.push(`${emotes.cash} +${cashreward}`);

          if (userdata.items.includes("match")) {
            xp = xp * 2;
          }
          if (userdata.items.includes("parking brake")) {
            xp = xp * 4;
          }
          if(userdata.location == "japan" ){
            cashreward = cashreward * 2
          }
          earnings.push(`${emotes.xp} ${xp}`);

          userdata.xp += xp
          let skill = userdata.skill
  
          let requiredxp  = skill * 100
  
          if(userdata.xp >= requiredxp){
            userdata.skill += 1
            userdata.xp = 0
            earnings.push(`${emotes.rank} Skill Level Up!`)
          }
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

          let ach2 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["drift king"].Name)
          if (difficulty == "master" && track == "parking garage" && ach2.length <= 0) {
            interaction.channel.send(
              'You just earned the "Drift King" achievement!'
            );
            userdata.achievements.push({
              name: achievementdb.Achievements["drift king"].Name,
              id: achievementdb.Achievements["drift king"].Name.toLowerCase(),
              completed: true,
            });
          }

          selected.Gas -= 1;
    if (selected.Gas <= 0) {
      selected.Gas = 0;
    }
    await User.findOneAndUpdate(
      {
        id: interaction.user.id,
      },
      {
        $set: {
          "cars.$[car]": selected,
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
