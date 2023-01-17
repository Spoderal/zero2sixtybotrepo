const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { tipFooterRandom } = require("../common/tips");
const { toCurrency } = require("../common/utils");
const { AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const helmetdb = require("../data/pfpsdb.json");
let bot1cars = [
  "1995 mazda miata",
  "1991 toyota mr2",
  "2002 pontiac firebird",
  "1999 honda civic si",
  "1997 acura integra",
  "2002 ford mustang",
];
let bot2cars = [
  "2014 hyundai genesis coupe",
  "2008 nissan 350z",
  "2008 nissan 350z",
  "2010 ford mustang",
  "1989 chevy camaro",
  "1996 nissan 300zx twin turbo",
  "2004 subaru wrx sti",
];
let bot3cars = [
  "2020 porsche 718 cayman",
  "2015 lotus exige sport",
  "2011 audi rs5",
  "2023 nissan z",
  "2018 kia stinger",
  "2012 dodge charger srt8",
];
let bot4cars = [
  "2015 mercedes amg gts",
  "2016 alfa romeo giulia",
  "2021 porsche 911 gt3",
  "2017 ford gt",
  "2021 nissan gtr",
  "2013 lexus lfa",
];
let bot5cars = [
  "2014 lamborghini huracan",
  "2014 mclaren 12c",
  "2018 audi r8",
  "2020 mclaren 570s",
  "2020 aston martin vantage",
];
let bot6cars = [
  "2010 ferrari 458 italia",
  "2018 lamborghini aventador s",
  "2016 aston martin vulkan",
  "2013 mclaren p1",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cashcup")
    .setDescription("Race up in the tiers for more cash!")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {
    let user = interaction.user;

    const cardb = require("../data/cardb.json");
    let userdata =
      (await User.findOne({ id: interaction.user.id })) ||
      new User({ id: user.id });
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: user.id });

    let idtoselect = interaction.options.getString("car");
    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected!
          Use \`/ids select [id] [car to select]\` to select a car to your specified id!\n
          Example: \`/ids select 1 1995 mazda miata\``
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    let car2;

    let tracklength = 600;
    let tracklength2 = 600;

    let timeout = 7200000;
    let racing = cooldowndata.cashcup || 0;

    let newcashcuptier = userdata.cashcuptier;

    let cashwon = 75 * newcashcuptier;

    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return await interaction.reply(
        `Please wait ${time} before racing in the cash cup again.`
      );
    }

    let botcar;

    if (cardb.Cars[selected.Name.toLowerCase()].Junked) {
      return await interaction.reply("This car is too junked to race, sorry!");
    }

    let range = selected.Range;
    if (cardb.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return await interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }
    interaction.reply("Revving engines...");

    cooldowndata.cashcup = Date.now();
    cooldowndata.save();
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext("2d");
    const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
    const vsimg = await loadImage("https://i.ibb.co/Hz6rgNv/vscc.png");
    if (newcashcuptier <= 5) {
      botcar = lodash.sample(bot1cars);
    } else if (newcashcuptier <= 15) {
      botcar = lodash.sample(bot2cars);
    } else if (newcashcuptier <= 25) {
      botcar = lodash.sample(bot3cars);
    } else if (newcashcuptier <= 45) {
      botcar = lodash.sample(bot4cars);
    } else if (newcashcuptier <= 60) {
      botcar = lodash.sample(bot5cars);
    } else if (newcashcuptier >= 60) {
      botcar = lodash.sample(bot5cars);
    } else if (newcashcuptier >= 70) {
      botcar = lodash.sample(bot6cars);
    }
    car2 = cardb.Cars[botcar.toLowerCase()];
    let selected1image = await loadImage(`${selected.Livery}`);
    let selected2image = await loadImage(`${car2.Image}`);
    let cupimg = await loadImage(
      `https://i.ibb.co/QD34bF0/Golden-Cup-Vector-Transparent-Image.png`
    );
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    ctx.save();
    roundedImage(ctx, 640, 200, 640, 360, 20);
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(selected2image, 640, 200, 640, 360);
    ctx.restore();

    ctx.save();
    roundedImage(ctx, 0, 200, 640, 360, 20);
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(selected1image, 0, 200, 640, 360);
    ctx.restore();
    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#ffffff";

    ctx.fillText(selected.Name, 75, 180);
    ctx.fillText(car2.Name, 845, 180);
    ctx.drawImage(vsimg, 0, 0, canvas.width, canvas.height);
    let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
      name: "profile-image.png",
    });

    let mph = selected.Speed;
    let weight =
      selected.WeightStat || cardb.Cars[selected.Name.toLowerCase()].Weight;
    let acceleration = selected.Acceleration;
    let handling = selected.Handling;

    if (!selected.WeightStat) {
      selected.Weight = cardb.Cars[selected.Name.toLowerCase()].Weight;
    }

    let mph2 = car2.Speed;
    let weight2 = car2.Weight;
    let acceleration2 = car2["0-60"];
    let handling2 = car2.Handling;

    let speed = 0;
    let speed2 = 0;

    let x = setInterval(() => {
      if (speed < mph) {
        speed++;
      } else {
        clearInterval(x);
      }
    }, 30);
    let x2 = setInterval(() => {
      if (speed2 < mph2) {
        speed2++;
      } else {
        clearInterval(x2);
      }
    }, 30);
    let sec;
    let sec2;
    let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];
    let embed = new discord.EmbedBuilder()
      .setTitle(`Tier ${newcashcuptier} cash cup race in progress...`)
      .addFields([
        {
          name: `${helmet.Emote} ${
            cardb.Cars[selected.Name.toLowerCase()].Emote
          } ${cardb.Cars[selected.Name.toLowerCase()].Name}`,
          value: `${emotes.speed} Power: ${mph}\n\n${emotes.zero2sixty} 0-60: ${acceleration}s\n\n${emotes.handling} Handling: ${handling}\n\n${emotes.weight} Weight: ${weight}`,
          inline: true,
        },
        {
          name: `🤖 ${cardb.Cars[botcar.toLowerCase()].Emote} ${
            cardb.Cars[botcar.toLowerCase()].Name
          }`,
          value: `${emotes.speed} Power: ${mph2}\n\n${emotes.zero2sixty} 0-60: ${acceleration2}s\n\n${emotes.handling} Handling: ${handling2}\n\n${emotes.weight} Weight: ${weight2}`,
          inline: true,
        },
      ])
      .setColor(colors.blue)

      .setFooter(tipFooterRandom)
      .setImage("attachment://profile-image.png");

    interaction.editReply({
      embeds: [embed],
      files: [attachment],
      fetchReply: true,
    });

    let i2 = setInterval(async () => {
      console.log(speed);
      let calc = handling * (speed / 50);
      calc = calc / acceleration;
      sec = (6.3 * (weight / calc)) / acceleration;
      calc = calc / sec;
      console.log(`calc: ${calc}`);
      console.log(`sec: ${sec}`);
      // car 2
      console.log(speed2);
      let calc2 = handling2 * (speed / 50);
      calc2 = calc2 / acceleration2;
      sec2 = (6.3 * (weight2 / calc2)) / acceleration2;
      console.log(`sec2: ${sec2}`);

      calc2 = calc2 / sec2;
      console.log(`calc2: ${calc2}`);
      tracklength -= calc;
      tracklength2 -= calc2;

      if (tracklength <= 0) {
        ctx.save();
        roundedImage(ctx, 640, 200, 640, 360, 20);
        ctx.stroke();
        ctx.clip();

        ctx.restore();
        ctx.drawImage(cupimg, 200, 50, 100, 100);
        attachment = new AttachmentBuilder(await canvas.toBuffer(), {
          name: "profile-image.png",
        });
        let earnings = [];
        let filteredhouse = userdata.houses.filter(
          (house) => house.Name == "Buone Vedute"
        );
        if (userdata.houses && filteredhouse[0]) {
          cashwon = cashwon += cashwon * 0.05;
        }
        earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);

        userdata.cash += cashwon;
        userdata.cashcuptier += 1;
        embed.setDescription(`${earnings.join("\n")}`);
        embed.setTitle(`Tier ${newcashcuptier} Cash Cup Race won!`);
        embed.setImage(`attachment://profile-image.png`);

        await interaction.editReply({ embeds: [embed], files: [attachment] });
        clearInterval(i2);
      }
      // lost
      else if (tracklength2 <= 0) {
        ctx.drawImage(cupimg, 960, 50, 100, 100);
        attachment = new AttachmentBuilder(await canvas.toBuffer(), {
          name: "profile-image.png",
        });
        embed.setImage(`attachment://profile-image.png`);

        userdata.cashcuptier -= 1;
        embed.setTitle(`Tier ${newcashcuptier} Cash Cup Race lost!`);
        await interaction.editReply({ embeds: [embed], files: [attachment] });
        clearInterval(i2);
      }

      console.log(`track length ${tracklength}`);
      console.log(`track length 2 ${tracklength2}`);
      userdata.save();
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
