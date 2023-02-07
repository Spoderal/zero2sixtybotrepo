const lodash = require("lodash");
const ms = require("pretty-ms");
// const discord = require("discord.js");
const { EmbedBuilder, AttachmentBuilder,  ButtonBuilder, ActionRowBuilder} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const helmetdb = require("../data/pfpsdb.json");
const { emotes } = require("../common/emotes");
const { createCanvas, loadImage } = require("canvas");
const {
  toCurrency,
} = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json");

let bot1cars = [
  "2019 mazda miata",
  "2020 subaru brz ts",
  "2021 bmw m2"
];
let bot2cars = [
  "2020 hyundai i30 n",
  "2020 mini",
  "2022 ford fiesta st"
];
let bot3cars = [
  "2019 jaguar xe sv",
  "2021 bac mono",
  "2021 nissan gtr nismo",
];
let bot4cars = [
  "2023 porsche 911 gt3 rs",
  "2021 mercedes amg gt black series",
  "2020 ferrari f8 tributo"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trackrace")
    .setDescription("Race a bot on the track")
    .addStringOption((option) =>
      option
        .setName("tier")
        .setDescription("The bot tier to race")
        .setRequired(true)
        .addChoices(
          { name: "Tier 1", value: "1" },
          { name: "Tier 2", value: "2" },
          { name: "Tier 3", value: "3" },
          { name: "Tier 4", value: "4" }
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
    let tracklength = 800;
    let tracklength2 = 800;

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
    await interaction.reply("Revving engines...");
    let car2;
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext("2d");
    const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
    const vsimg = await loadImage("https://i.ibb.co/wc6pt53/vstrack.png");
    let cashwon = parseInt(bot) * 150;
    let rpwon = parseInt(bot) * 2;
    let eventkeys = parseInt(bot) * 1;
    let lostcash
    if (bot == "1") {
      lostcash = 5000
      car2 = cardb.Cars[lodash.sample(bot1cars)];
    } else if (bot == "2") {
      lostcash = 10000
      car2 = cardb.Cars[lodash.sample(bot2cars)];
    } else if (bot == "3") {
      lostcash = 15000
      car2 = cardb.Cars[lodash.sample(bot3cars)];
    } else if (bot == "4") {
      lostcash = 20000
      car2 = cardb.Cars[lodash.sample(bot4cars)];
    }

    if(userdata.cash < lostcash){
      return interaction.reply(`You need at least ${lostcash} to race this tier! Just in case you lose it...`)
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
    let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
      name: "profile-image.png",
    });

    console.log(attachment);

    console.log(attachment);

    cooldowndata.racing = Date.now();
    cooldowndata.save();
    let mph = selected.Speed;
    let weight = selected.WeightStat || cardb.Cars[selected.Name.toLowerCase()].Weight;
    let acceleration = selected.Acceleration;
    let handling = selected.Handling;

    if (!selected.WeightStat) {
      selected.WeightStat = cardb.Cars[selected.Name.toLowerCase()].Weight;
    }

    let mph2 = car2.Speed;
    let weight2 = car2.Weight;
    let acceleration2 = 2.5
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

    let embed = new EmbedBuilder()
      .setTitle(`Racing Tier ${bot} Street Race`)

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

    let msg =  await interaction.editReply({
      content: "GO!",
      embeds: [embed],
      files: [attachment],
      fetchReply: true,
    });

    let i2 = setInterval(async () => {
        let calc = (weight / 3) + (speed / 75);

          calc = calc / acceleration;

    
        sec = (7.3 * (handling / calc)) / 5;
        calc = calc / sec;
        // car 2
        let calc2 = (weight2 / 3) + (speed2 / 75);
     
        calc2 = calc2 / acceleration2;

  
      sec2 = (7.3 * (handling2 / calc2)) / 5;
      calc2 = calc2 / sec2;
        console.log(`sec2: ${sec2}`);
  
        console.log(`calc: ${calc}`);

        console.log(`calc2: ${calc2}`);
        tracklength -= calc;
        tracklength2 -= calc2;
        if (tracklength2 <= 0 && i2 !== null) {
          clearInterval(i2);

          tracklength = 800
          tracklength2 = 800
            ctx.drawImage(cupimg, 960, 50, 100, 100);
            attachment = new AttachmentBuilder(await canvas.toBuffer(), {
              name: "profile-image.png",
            });
            embed.setImage(`attachment://profile-image.png`);
    
            embed.setTitle(`Tier ${bot} Track Race lost!`);
            await interaction.editReply({ embeds: [embed], files: [attachment] });
            userdata.cash -= lostcash
            userdata.save()
            return
          }

      else if (tracklength <= 0 && i2 !== null) {
        clearInterval(i2);

        tracklength = 800
        tracklength2 = 800

        let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("keep")
            .setEmoji(car2.Emote)
            .setLabel("Keep Car")
            .setStyle("Secondary"),
            new ButtonBuilder()
            .setCustomId("sell")
            .setEmoji(`💲`)
            .setLabel("Sell Car")
            .setStyle("Success")
        )
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
        let filteredhouse2 = userdata.houses.filter(
          (house) => house.Name == "Casa Della Pace"
        );
        if (userdata.houses && filteredhouse[0]) {
          cashwon = cashwon += cashwon * 0.05;
        }
        if (userdata.houses && filteredhouse2[0]) {
          rpwon = rpwon * 2;
        }
        earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
        earnings.push(`${emotes.rp} +${rpwon}`);



        userdata.cash += cashwon;
        userdata.rp3 += rpwon;
        userdata.racerank += 1;
        embed.setDescription(`${earnings.join("\n")}`);
        embed.setTitle(`Tier ${bot} Track Race won!`);
        embed.setImage(`attachment://profile-image.png`);
        let botfiltered = userdata.cars.filter((car) => car.Name == car2.Name);
        if(botfiltered[0]){
            await interaction.editReply({ embeds: [embed], files: [attachment]});
           await interaction.channel.send(`Sold car for ${toCurrency(car2.sellprice)}`)
           userdata.cash += car2.sellprice
           userdata.save()
           return;
        }
        else {
            await interaction.editReply({ embeds: [embed], files: [attachment], components: [row], fetchReply: true });
        }

      }
      // lost

    
      

      
      
      console.log(`track length ${tracklength}`);
      console.log(`track length 2 ${tracklength2}`);
    }, 1000);
    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector = msg.createMessageComponentCollector({
      filter: filter2,
    });
    collector.once('collect', async (i) => {
      
      if(i.customId.includes("sell")){
         userdata.cash += car2.sellprice
         embed.setTitle("✅")
         userdata.save()

        return await i.update({embeds: [embed], fetchReply: true})
        
      }
      else if(i.customId.includes("keep")){
        let carindb = cardb.Cars[car2.Name.toLowerCase()];
        let carobj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: carindb.Speed,
          Acceleration: carindb["0-60"],
          Handling: carindb.Handling,
          Parts: [],
          Emote: carindb.Emote,
          Livery: carindb.Image,
          Miles: 0,
        };

        userdata.cars.push(carobj);
        embed.setTitle("✅")
        userdata.save()

        return await i.update({embeds: [embed], fetchReply: true})
        
      }
    })
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
