const lodash = require("lodash");
const ms = require("pretty-ms");
// const discord = require("discord.js");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const helmetdb = require("../data/pfpsdb.json");
const { emotes } = require("../common/emotes");
const { userGetPatreonTimeout } = require("../common/user");
const { createCanvas, loadImage } = require("canvas");
const partdb = require("../data/partsdb.json");
const {
  doubleCashWeekendField,
  convertMPHtoKPHm,
  toCurrency,
  randomRange,
} = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const houses = require("../data/houses.json");
const cardb = require("../data/cardb.json");
const weather = require("../data/weather.json");
const cratedb = require("../data/cratedb.json");

let bot1cars = [
  "2023 alfa romeo c38",
  "2023 aston martin amr23",
  "2023 mercedes w14 e",
  "2023 ferrari sf23",
  "2021 red bull rb18",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("f1race")
    .setDescription("Race on the F1 track!")
    .addStringOption((option) =>
      option
        .setName("tier")
        .setDescription("The bot tier to race")
        .setRequired(true)
        .addChoices(
          { name: "Tier 1", value: "1" },
        )
    )
    .addStringOption((option) =>
      option
        .setName("laps")
        .setDescription("The amount of laps")
        .setRequired(true)
        .addChoices(
          { name: "1 Lap", value: "1" },
          { name: "3 Laps", value: "3" },
          { name: "5 Laps", value: "5" }
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
    let tracklength = 3000;
    let tracklength2 = 3000;
    let tracklength3 = 3000;
    let laps = interaction.options.getString("laps");
    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let cooldowndata =
      (await Cooldowns.findOne({ id: user.id })) ||
      new Cooldowns({ id: user.id });
    let timeout = 45 * 1000;
    if (
      cooldowndata.racing !== null &&
      timeout - (Date.now() - cooldowndata.racing) > 0
    ) {
      let time = ms(timeout - (Date.now() - cooldowndata.racing));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`You can race again in ${time}`);
      return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }
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
    let bot = interaction.options.getString("tier");
    await interaction.deferReply();
    await interaction.editReply("Revving engines...");
    if (!cardb.Cars[selected.Name.toLowerCase()].F1)
      return interaction.reply("Your car isn't an F1 car!");
    let weather2 = lodash.sample(weather);
    console.log(weather2);
    let car2;
    let car3;
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext("2d");
    const bg = await loadImage("https://i.ibb.co/d5jq39R/F1TRACK.png");
    let cashwon = parseInt(bot) * 220;
    let rpwon = parseInt(bot) * 2;
    let cashlost = parseInt(bot) * 20;
    let eventkeys = parseInt(bot) * 1;

    if (bot == "1") {
      car2 = cardb.Cars[lodash.sample(bot1cars)];
      car3 = cardb.Cars[lodash.sample(bot1cars)];
    } else if (bot == "2") {
      car2 = cardb.Cars[lodash.sample(bot2cars)];
    } else if (bot == "3") {
      car2 = cardb.Cars[lodash.sample(bot3cars)];
    }
    let usertier = userdata.tier;

    let botspeed = car2.Speed;
    let bot2speed = car3.Speed;
    let bot060 = car2["0-60"];
    let bot0602 = car3["0-60"];

    let craterare = randomRange(1, 3);

    let crateearned;

    if (craterare == 2) {
      crateearned = "common crate";
    } else if (craterare == 3) {
      crateearned = "rare crate";
    }

    let selected1image = await loadImage(`${selected.Livery}`);
    let selected2image = await loadImage(`${car2.Image}`);
    let selected3image = await loadImage(`${car3.Image}`);
    let cupimg = await loadImage(
      `https://i.ibb.co/QD34bF0/Golden-Cup-Vector-Transparent-Image.png`
    );

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.save();
    roundedImage(ctx, 855, 200, 370, 180, 20);
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(selected2image, 855, 200, 370, 180);
    ctx.restore();

    ctx.save();
    roundedImage(ctx, 40, 200, 370, 180, 20);
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(selected1image, 40, 200, 370, 180);
    ctx.restore();

    ctx.save();
    roundedImage(ctx, 470, 490, 370, 180, 20);
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(selected3image, 470, 490, 370, 180);
    ctx.restore();

    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#ffffff";

    ctx.fillText(selected.Name, 20, 180);

    ctx.fillText(car2.Name, 845, 180);

    ctx.fillText(car3.Name, 450, 470);

    if (weather2.Emote == "🌧️") {
      let weatherimg = await loadImage(
        "https://i.ibb.co/QYLgQMS/rain-png-transparent-9.png"
      );
      ctx.drawImage(weatherimg, 0, 0, canvas.width, canvas.height);
    } else if (weather2.Emote == "🌨️") {
      let weatherimg = await loadImage(
        "https://i.ibb.co/Rbydwdt/snow-png-images-transparent-download-1-1.png"
      );
      ctx.drawImage(weatherimg, 0, 0, canvas.width, canvas.height);
    }

    let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
      name: "profile-image.png",
    });

    let slipchance = weather2.Slip;
    let speedreduce = weather2.SpeedReduce;
    cooldowndata.racing = Date.now();
    cooldowndata.save();
    let mph = (selected.Speed -= speedreduce);
    let weight =
      selected.WeightStatStat || cardb.Cars[selected.Name.toLowerCase()].Weight;
    let acceleration = selected.Acceleration;
    let handling = selected.Handling / weather2.Grip;

    if (!selected.WeightStatStat) {
      selected.WeightStatStat = cardb.Cars[selected.Name.toLowerCase()].Weight;
    }

    let mph2 = (botspeed -= speedreduce);
    let weight2 = car2.Weight;
    let acceleration2 = car2["0-60"];
    let handling2 = car2.Handling / weather2.Grip;
    let mph3 = (bot2speed -= speedreduce);
    let weight3 = car3.Weight;
    let acceleration3 = car3["0-60"];
    let handling3 = car3.Handling / weather2.Grip;
    if (slipchance > 0) {
      let slip = randomRange(1, slipchance);
      if (slip >= 2) {
        mph -= 10;
      }
    }
    if (slipchance > 0) {
      let slip = randomRange(1, slipchance);
      if (slip >= 2) {
        mph2 -= 10;
      }
    }
    if (slipchance > 0) {
      let slip = randomRange(1, slipchance);
      if (slip >= 2) {
        mph3 -= 10;
      }
    }

    handling = Math.floor(handling);
    handling2 = Math.floor(handling2);
    let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

    let embed = new EmbedBuilder()
      .setTitle(`Racing Tier ${bot} F1 ${weather2.Emote}`)
      .setAuthor({ name: `${user.username}`, iconURL: `${helmet.Image}` })
      .addFields(
        {
          name: `${selected.Emote} ${selected.Name}`,
          value: `${emotes.speed} Power: ${mph}\n\n${emotes.zero2sixty} Acceleration: ${acceleration}s\n\n${emotes.weight} Weight: ${weight}\n\n${emotes.handling} Handling: ${handling}`,

          inline: true,
        },
        {
          name: `${car2.Emote} ${car2.Name}`,
          value: `${emotes.speed} Power: ${mph2}\n\n${emotes.zero2sixty} Acceleration: ${acceleration2}s\n\n${emotes.weight} Weight: ${weight2}\n\n${emotes.handling} Handling: ${handling2}`,
          inline: true,
        },
        {
          name: `${car3.Emote} ${car3.Name}`,
          value: `${emotes.speed} Power: ${mph3}\n\n${emotes.zero2sixty} Acceleration: ${acceleration3}s\n\n${emotes.weight} Weight: ${weight3}\n\n${emotes.handling} Handling: ${handling3}`,
          inline: true,
        }
      )
      .setColor(colors.blue)
      .setImage("attachment://profile-image.png");

    interaction.editReply({
      content: "",
      embeds: [embed],
      files: [attachment],
      fetchReply: true,
    });

    let laptime = 0;
    let laptime2 = 0;
    let laptime3 = 0;

    let weightst = weight / 10;
    let handlingst = handling / 10;
    let weightst2 = weight2 / 10;
    let handlingst2 = handling2 / 10;
    let weightst3 = weight3 / 10;
    let handlingst3 = handling3 / 10;
    let formula1 = mph / acceleration + (weightst + handlingst);
    let formula2 = mph2 / acceleration2 + (weightst2 + handlingst2);
    let formula3 = mph3 / acceleration3 + (weightst3 + handlingst3);
    laps = Number(laps);
    let laps2 = Number(laps);
    let laps3 = Number(laps);
    let firstplace;
    let secondplace;
    let thirdplace;
    let lapt;
    let firstplaced = false;
    let x = setInterval(async () => {
      console.log(`laps ${laps}`);
      tracklength -= formula1;
      console.log(`1: ${tracklength}`);
      laptime++;
      if (tracklength <= 0) {
        if (laps > 0) {
          if (
            tracklength < tracklength2 &&
            tracklength < tracklength3 &&
            firstplaced !== true
          ) {
            firstplace = `${user.username}`;
            firstplaced = true;
          } else if (
            tracklength2 < tracklength &&
            tracklength2 < tracklength3 &&
            firstplaced !== true
          ) {
            firstplace = "bot 2";
            firstplaced = true;
          } else if (
            tracklength3 < tracklength2 &&
            tracklength3 < tracklength &&
            firstplaced !== true
          ) {
            firstplace = "bot 3";
            firstplaced = true;
          }
          lapt = laptime;
          laps -= 1;
          await console.log(`Lap time: ${laptime}s`);
          laptime = 0;
          tracklength = 2000;
        }
      }
      if (laps2 > 0) {
        console.log(`laps ${laps2}`);
        tracklength2 -= formula2;
        console.log(`2: ${tracklength2}`);
        laptime2++;
        if (tracklength2 <= 0) {
          if (
            tracklength < tracklength2 &&
            tracklength < tracklength3 &&
            firstplaced !== true
          ) {
            firstplace = `${user.username}`;
            firstplaced = true;
          } else if (
            tracklength2 < tracklength &&
            tracklength2 < tracklength3 &&
            firstplaced !== true
          ) {
            firstplace = "bot 2";
            firstplaced = true;
          } else if (
            tracklength3 < tracklength2 &&
            tracklength3 < tracklength &&
            firstplaced !== true
          ) {
            firstplace = "bot 3";
            firstplaced = true;
          }
          laps2 -= 1;
          laptime2 = 0;
          tracklength2 = 2000;
          await console.log(`Lap time 2: ${laptime2}s`);
        }
      }
      if (laps3 > 0) {
        console.log(`laps ${laps3}`);
        tracklength3 -= formula3;
        console.log(`3: ${tracklength3}`);
        laptime3++;
        if (tracklength3 <= 0) {
          if (
            tracklength < tracklength2 &&
            tracklength < tracklength3 &&
            firstplaced !== true
          ) {
            firstplace = `${user.username}`;
            firstplaced = true;
          } else if (
            tracklength2 < tracklength &&
            tracklength2 < tracklength3 &&
            firstplaced !== true
          ) {
            firstplace = "bot 2";
            firstplaced = true;
          } else if (
            tracklength3 < tracklength2 &&
            tracklength3 < tracklength &&
            firstplaced !== true
          ) {
            firstplace = "bot 3";
            firstplaced = true;
          }

          laps3 -= 1;
          laptime3 = 0;
          tracklength3 = 2000;
          await console.log(`Lap time 3: ${laptime3}s`);
        }
      } else {
        console.log(`first: ${firstplace}`);
        clearInterval(x);

        embed.setTitle(`Winner: ${firstplace}`);
        let rewards = [`Your lap time: ${lapt}s`];
        if (firstplace == `${user.username}`) {
          userdata.f1blueprints += 1;
          userdata.cash += cashwon;
          userdata.save();

          rewards.push(`${emotes.cash} +${toCurrency(cashwon)}`);
          rewards.push(`${emotes.f1blueprint} +1`);
        }
        embed.setDescription(`${rewards.join("\n")}`);
        await interaction.editReply({ embeds: [embed] });
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
