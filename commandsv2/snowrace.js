const lodash = require("lodash");
const ms = require("pretty-ms");
// const discord = require("discord.js");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const helmetdb = require("../data/pfpsdb.json")
const { emotes } = require("../common/emotes");
const { createCanvas, loadImage } = require('canvas')

const {
  toCurrency,
} = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json");

let bot1cars = ["2018 subaru wrx sti we", "2020 toyota gr yaris we"];
let bot2cars = [
  "2015 mitsubishi lancer evolution we",
  "2016 mercedes benz g63 we",
];
let bot3cars = ["2016 ford focus rs we", "2017 ford fiesta st we"];


module.exports = {
  data: new SlashCommandBuilder()
    .setName("snowrace")
    .setDescription("Race a bot in the snow")
    .addStringOption((option) =>
      option
        .setName("tier")
        .setDescription("The bot tier to race")
        .setRequired(true)
        .addChoices(
          { name: "Tier 1", value: "1" },
          { name: "Tier 2", value: "2" },
          { name: "Tier 3", value: "3" },
        )
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {
    let user = interaction.user
    let tracklength = 600
    let tracklength2 = 600


    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let cooldowndata = (await Cooldowns.findOne({ id: user.id })) || new Cooldowns({ id: user.id });
    let timeout = 45 * 1000
    if (cooldowndata.racing !== null && timeout - (Date.now() - cooldowndata.racing) > 0) {
      let time = ms(timeout - (Date.now() - cooldowndata.racing));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(
          `You can race again in ${time}`
        );
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
    interaction.reply("Revving engines...")
    let car2
    const canvas = createCanvas(1280, 720)
const ctx = canvas.getContext('2d')
const bg = await loadImage('https://i.ibb.co/b7WGPX2/bgqm.png')
const vsimg = await loadImage('https://i.ibb.co/kKgnTLH/vssnow.png')
let cashwon = parseInt(bot) * 150
let notowon 

if(bot == "1"){
  car2 = cardb.Cars[lodash.sample(bot1cars)]
  notowon = 50
}
else if(bot == "2"){
  car2 = cardb.Cars[lodash.sample(bot2cars)]
  notowon = 100
}
else if(bot == "3"){
  car2 = cardb.Cars[lodash.sample(bot3cars)]
  notowon = 250
}

let selected1image = await loadImage(`${selected.Livery}`)
let selected2image = await loadImage(`${car2.Image}`)
let cupimg = await loadImage(`https://i.ibb.co/QD34bF0/Golden-Cup-Vector-Transparent-Image.png`)
ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);


ctx.save();
roundedImage(ctx, 640, 200, 640, 360, 20);
ctx.stroke()
ctx.clip();
ctx.drawImage(selected2image, 640, 200, 640, 360);
ctx.restore();

ctx.save();
roundedImage(ctx, 0, 200, 640, 360, 20);
ctx.stroke()
ctx.clip();
ctx.drawImage(selected1image, 0, 200, 640, 360);
ctx.restore();
ctx.font = '40px sans-serif';
ctx.fillStyle = '#ffffff';

ctx.fillText(selected.Name, 75, 180);

ctx.fillText(car2.Name, 845, 180);
ctx.drawImage(vsimg, 0, 0, canvas.width, canvas.height);
let attachment = new AttachmentBuilder(await canvas.toBuffer(), { name: 'profile-image.png' });

console.log(attachment)
    
cooldowndata.racing = Date.now()
cooldowndata.save()
    let mph = selected.Speed
    let weight = selected.WeightStat || cardb.Cars[selected.Name.toLowerCase()].Weight
    let acceleration = selected.Acceleration
    let handling = selected.Handling

    if(!selected.WeightStat){
      selected.WeightStat = cardb.Cars[selected.Name.toLowerCase()].Weight
    }


    let mph2 = car2.Speed
    let weight2 = car2.Weight
    let acceleration2 = car2["0-60"]
    let handling2 = car2.Handling
  

    let speed = 0
    let speed2 = 0
    
    let x = setInterval(() => {
        if(speed < mph){
            speed++

        }
        else {
            clearInterval(x)
        }
    }, 30);
    let x2 = setInterval(() => {
        if(speed2 < mph2){
            speed2++

        }
        else {
            clearInterval(x2)
        }
    }, 30);
    let sec
    let sec2

    let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()]

    let embed = new EmbedBuilder()
    .setTitle(`Racing Tier ${bot} Snow Race`)
    
    .setAuthor({ name: `${user.username}`, iconURL:`${helmet.Image}` })
    .addFields(
      {
        name:`${selected.Emote} ${selected.Name}`,
        value:`${emotes.speed} Power: ${mph}\n\n${emotes.zero2sixty} Acceleration: ${acceleration}s\n\n${emotes.weight} Weight: ${weight}\n\n${emotes.handling} Handling: ${handling}`,
        
        inline: true
      },
      {
        name:`${car2.Emote} ${car2.Name}`,
        value:`${emotes.speed} Power: ${mph2}\n\n${emotes.zero2sixty} Acceleration: ${acceleration2}s\n\n${emotes.weight} Weight: ${weight2}\n\n${emotes.handling} Handling: ${handling2}`,
        inline: true
      }
    )
    .setColor(colors.blue)
    .setImage('attachment://profile-image.png')

    

    interaction.editReply({embeds: [embed], files:[attachment], fetchReply: true})

    let i2 = setInterval(async () => {
        console.log(speed)
        let calc = handling * (speed / 100) 
        calc = calc / acceleration
        sec = 6 * (weight / calc) / acceleration
        calc = calc / sec
        console.log(`calc: ${calc}`)
        console.log(`sec: ${sec}`)
        // car 2
        console.log(speed2)
        let calc2 = handling2 * (speed / 100) 
        calc2 = calc2 / acceleration2
        sec2 = 6 * (weight2 / calc2) / acceleration2
        console.log(`sec2: ${sec2}`)
        
        calc2 = calc2 / sec2
        console.log(`calc2: ${calc2}`)
        tracklength -= calc
        tracklength2 -= calc2

        if(tracklength <= 0){
          ctx.save();
          roundedImage(ctx, 640, 200, 640, 360, 20);
          ctx.stroke()
          ctx.clip();
          

ctx.restore();
ctx.drawImage(cupimg, 200, 50, 100, 100)
attachment = new AttachmentBuilder(await canvas.toBuffer(), { name: 'profile-image.png' });
          let earnings = []
          
          let filteredhouse = userdata.houses.filter(
            (house) => house.Name == "Casa Sul Lago"
          );
          if (userdata.houses && filteredhouse[0]) {
            notowon = notowon * 2
          }
          earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`)
          earnings.push(`${emotes.notoriety} +${notowon}`)

          userdata.cash += cashwon
          userdata.noto5 += notowon
          embed.setDescription(`${earnings.join('\n')}`)
          embed.setTitle(`Tier ${bot} Snow Race won!`)
          embed.setImage(`attachment://profile-image.png`)

          await interaction.editReply({embeds: [embed], files: [attachment]})
            clearInterval(i2)
        }
        // lost
        else if(tracklength2 <= 0){
ctx.drawImage(cupimg, 960, 50, 100, 100)
attachment = new AttachmentBuilder(await canvas.toBuffer(), { name: 'profile-image.png' });
          embed.setImage(`attachment://profile-image.png`)
          
          embed.setTitle(`Tier ${bot} Snow Race lost!`)
          await interaction.editReply({embeds: [embed], files: [attachment]})
            clearInterval(i2)
        }
       
        console.log(`track length ${tracklength}`)
        console.log(`track length 2 ${tracklength2}`)
        userdata.save()
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