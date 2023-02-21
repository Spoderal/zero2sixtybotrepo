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
const { createCanvas, loadImage } = require("canvas");
const partdb = require("../data/partsdb.json");
const { toCurrency, randomRange } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json");

const weather = require("../data/weather.json")
let bot1cars = [
  "1995 mazda miata",
  "1991 toyota mr2",
  "2002 pontiac firebird",
  "2005 hyundai tiburon",
  "1999 honda civic si",
];
let bot2cars = [
  "2014 hyundai genesis coupe",
  "2008 nissan 350z",
  "2010 chevy camaro v6",
  "2010 ford mustang",
  "2004 subaru wrx sti",
  "2013 mazda speed3",
  "2001 toyota supra mk4",
];
let bot3cars = [
  "2020 porsche 718 cayman",
  "2015 lotus exige sport",
  "2011 audi rs5",
  "2021 toyota supra",
  "2011 bmw m3",
  "2021 lexus rc f",
];
let bot4cars = [
  "2013 lexus lfa",
  "1993 jaguar xj220",
  "2021 porsche 911 gt3",
  "2017 ford gt",
  "2014 lamborghini huracan",
  "2018 audi r8",
];
let bot5cars = [
  "2010 ferrari 458 italia",
  "2005 pagani zonda f",
  "2020 aston martin vantage",
  "2020 mclaren 570s",
];
let bot6cars = [
  "2021 ferrari sf90 stradale",
  "2022 aston martin valkyrie",
  "2016 bugatti chiron",
  "2008 bugatti veyron",
  "2021 mclaren 720s",
  "2016 aston martin vulkan",
  "2013 mclaren p1",
];
let bot7cars = [
  "2021 bugatti bolide",
  "2013 lamborghini veneno",
  "2020 koenigsegg regera",
  "2020 bugatti divo",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dragrace")
    .setDescription("Race a bot on the quarter mile or half mile")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Half or quarter mile")
        .setRequired(true)
        .addChoices(
          { name: "Quarter Mile", value: "qm" },
          { name: "Half Mile", value: "hm" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("tier")
        .setDescription("The bot tier to race")
        .setRequired(true)
        .addChoices(
          { name: "Tier 1", value: "1" },
          { name: "Tier 2", value: "2" },
          { name: "Tier 3", value: "3" },
          { name: "Tier 4", value: "4" },
          { name: "Tier 5", value: "5" },
          { name: "Tier 6", value: "6" },
          { name: "Tier 7", value: "7" }
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
    let length = interaction.options.getString("type");
    let tracklength;
    let tracklength2;
    let lengthname;

    let bot = interaction.options.getString("tier");
    let cashwon;

    if (length == "qm") {
      tracklength = 400;
      tracklength2 = 400;
      lengthname = "Quarter Mile";
      cashwon = parseInt(bot) * 200;
    } else if (length == "hm") {
      tracklength = 800;
      tracklength2 = 800;
      lengthname = "Half Mile";
      cashwon = parseInt(bot) * 250;
    }

    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let cooldowndata =
      (await Cooldowns.findOne({ id: user.id })) ||
      new Cooldowns({ id: user.id });
    let timeout = 45 * 1000;
    if (
      cooldowndata.dragracing !== null &&
      timeout - (Date.now() - cooldowndata.dragracing) > 0
    ) {
      let time = ms(timeout - (Date.now() - cooldowndata.dragracing));
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
    interaction.reply("Revving engines...");
    let car2;
    let weather2 = lodash.sample(weather)
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext("2d");
    const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
    const vsimg = await loadImage("https://i.ibb.co/tZghwkJ/vsdrag.png");
    let ckeys = 0;
    let rkeys = 0;
    let ekeys = 0;
    if (bot == "1") {
      car2 = cardb.Cars[lodash.sample(bot1cars)];
      ckeys = 2;
    } else if (bot == "2") {
      car2 = cardb.Cars[lodash.sample(bot2cars)];
      ckeys = 4;
    } else if (bot == "3") {
      car2 = cardb.Cars[lodash.sample(bot3cars)];
      rkeys = 2;
    } else if (bot == "4") {
      car2 = cardb.Cars[lodash.sample(bot4cars)];
      rkeys = 4;
    } else if (bot == "5") {
      car2 = cardb.Cars[lodash.sample(bot5cars)];
      rkeys = 6;
    } else if (bot == "6") {
      car2 = cardb.Cars[lodash.sample(bot6cars)];
      ekeys = 1;
    } else if (bot == "7") {
      car2 = cardb.Cars[lodash.sample(bot7cars)];
      ekeys = 2;
    }

    if (length == "hm") {
      ckeys = ckeys * 2;
      rkeys = rkeys * 2;
      ekeys = ekeys * 2;
    }
    let usertier = userdata.tier;

    let botspeed = car2.Speed
    let bot060 = car2["0-60"]
    if (usertier >= 5) {
      botspeed = botspeed += partdb.Parts.txexhaust.AddedSpeed;
      botspeed = botspeed += partdb.Parts.txclutch.AddedSpeed;
      botspeed = botspeed += partdb.Parts.txintake.AddedSpeed;
      let newzero = (bot060 -= partdb.Parts.txexhaust.AddedSixty);
      let newzero2 = (newzero -= partdb.Parts.txexhaust.AddedSixty);
      let newzero3 = (newzero2 -= partdb.Parts.txexhaust.AddedSixty);
      if (newzero > 2) {
        bot060 = bot060 -= partdb.Parts.txexhaust.AddedSixty;
      }
      if (newzero2 > 2) {
        bot060 = bot060 -= partdb.Parts.txclutch.AddedSixty;
      }
      if (newzero3 > 2) {
        bot060 = bot060 -= partdb.Parts.txintake.AddedSixty;
      }

      if (bot060 < 2) {
        bot060 = 2;
      }
    }
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
    if(weather2.Emote == "🌧️"){
      let weatherimg = await loadImage("https://i.ibb.co/QYLgQMS/rain-png-transparent-9.png")
      ctx.drawImage(weatherimg, 0, 0, canvas.width, canvas.height);
    }
    else if(weather2.Emote == "🌨️"){
      let weatherimg = await loadImage("https://i.ibb.co/Rbydwdt/snow-png-images-transparent-download-1-1.png")
      ctx.drawImage(weatherimg, 0, 0, canvas.width, canvas.height);
    }
    let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
      name: "profile-image.png",
    });

    console.log(attachment);

    cooldowndata.dragracing = Date.now();
    cooldowndata.save();
    let slipchance = weather2.Slip
    let speedreduce = weather2.SpeedReduce
    let mph = selected.Speed -= speedreduce
    let weight = selected.WeightStat || cardb.Cars[selected.Name.toLowerCase()].Weight;
    let acceleration = selected.Acceleration;
    let handling = selected.Handling / weather2.Grip

    if (!selected.WeightStat) {
      selected.WeightStat = cardb.Cars[selected.Name.toLowerCase()].Weight;
    }
    let mph2 = botspeed -= speedreduce
    let weight2 = car2.Weight;
    let acceleration2 = car2["0-60"];
    let handling2 = car2.Handling / weather2.Grip
    if(slipchance > 0){
      let slip = randomRange(1, slipchance)
      if(slip >= 2){
        mph -= 10

      }
    }
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

    let embed = new EmbedBuilder()
      .setTitle(`Racing Tier ${bot} on ${lengthname} ${weather2.Emote}`)

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
        }
      )
      .setColor(colors.blue)
      .setImage("attachment://profile-image.png");

    interaction.editReply({
      embeds: [embed],
      files: [attachment],
      fetchReply: true,
    });

    let i2 = setInterval(async () => {
      console.log(speed);
      let calc = weight * (speed / 234);
      calc = calc / acceleration;
      sec = (6.29 * (weight / calc)) / acceleration;
      calc = calc / sec;
      console.log(`calc: ${calc}`);
      console.log(`sec: ${sec}`);
      // car 2
      console.log(speed2);
      let calc2 = weight2 * (speed2 / 234);
      calc2 = calc2 / acceleration2;
      sec2 = (6.29 * (weight2 / calc2)) / acceleration2;
      calc2 = calc2 / sec2;

      console.log(`calc2: ${calc2}`);
      console.log(`sec2: ${sec2}`);
      tracklength -= calc;
      tracklength2 -= calc2;

      if (tracklength <= 0) {
        ctx.drawImage(cupimg, 200, 50, 100, 100);
        attachment = new AttachmentBuilder(await canvas.toBuffer(), {
          name: "profile-image.png",
        });
        let earnings = [];
        let filteredhouse = userdata.houses.filter(
          (house) => house.Name == "Casa Tranquilla"
        );
        if (userdata.houses && filteredhouse[0]) {
          cashwon = cashwon += cashwon * 0.05;
        }
        earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
        if (ckeys > 0) {
          earnings.push(`${emotes.ckey} +${ckeys}`);
          userdata.ckeys += ckeys;
        }
        if (rkeys > 0) {
          earnings.push(`${emotes.rkey} +${rkeys}`);
          userdata.rkeys += rkeys;
        }
        if (ekeys > 0) {
          earnings.push(`${emotes.ekey} +${ekeys}`);
          userdata.ekeys += ekeys;
        }

        userdata.racerank += 1;
        userdata.cash += cashwon;
        embed.setDescription(`${earnings.join("\n")}`);
        embed.setTitle(`Tier ${bot} ${lengthname} won! ${weather2.Emote}`);
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

        embed.setTitle(`Tier ${bot} ${lengthname} lost! ${weather2.Emote}`);
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
