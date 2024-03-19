const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/profile-schema");
const colors = require("../common/colors");
const { randomRange } = require("../common/utils");
const ms = require(`pretty-ms`);
const lodash = require("lodash")
const BARN_TIMEOUT = 3600000;
const carsdb = require("../data/cardb.json");
const barns = require("../data/barns.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("barn")
    .setDescription("Search barns for old cars to restore!"),

  async execute(interaction) {
    try {

    
    const userId = interaction.user.id;

    let userdata = (await User.findOne({ id: userId })) || new User({ id: userId });
    let cooldowns = (await Cooldowns.findOne({ id: userId })) || new Cooldowns({ id: userId });

    let barntimer = cooldowns.barn;
    let barnmaps = userdata.barnmaps;

    if (barnmaps <= 0) {
      return await interaction.reply("You don't have any barn maps! You can earn them in drag races");
    }

    let randomRarity = randomRange(1, 100);
    let rarity = (randomRarity >= 40) ? "common" : (randomRarity < 10) ? "legendary" : "rare";

    let garagelimit = userdata.garageLimit;
    let usercars = userdata.cars;
    if (usercars.length >= garagelimit) {
      return await interaction.reply("Your spaces are already filled. Sell a car or get more garage space!");
    }

    if (barntimer !== null && BARN_TIMEOUT - (Date.now() - barntimer) > 0) {
      let time = ms(BARN_TIMEOUT - (Date.now() - barntimer));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`Please wait ${time} before searching barns again.`);

      await interaction.reply({ embeds: [timeEmbed] });
      return;
    }
    let color, namefor;

    console.log(randomRarity)
    if (randomRarity >= 40) {
      rarity = "common";
      namefor = "Common"
      color = "#00FF00";
    } else if (randomRarity < 10) {
      rarity = "legendary";
      namefor = "Legendary"
      color = "#FFA500";
    } else {
      rarity = "rare";
      namefor = "Rare"
      color = "#FFD700";
    }
    
    let barnfind = lodash.sample(barns.Barns[rarity]);
    let cars = userdata.cars;
    console.log(rarity)
    let carindb = carsdb.Cars[barnfind.toLowerCase()];
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
      WeightStat: carindb.Weight,
      Gas: 10,
      MaxGas: 10,
    };

    userdata.barnmaps -= 1;

    let arrByID = cars.filter((item) => item.Name == carobj.Name);
    if (arrByID[0]) {
      await interaction.reply(`You found a ${carindb.Name} but you already have this car..`);
      userdata.save();
      return;
    }





    
    cooldowns.barn = Date.now();
    cooldowns.save();

    let embed = new Discord.EmbedBuilder()
      .setTitle(`${namefor} Barn Find`)
      .addFields([
        { name: "<:icons_classiccar:1203826559480369314> Car", value: `${carobj.Emote} ${carobj.Name}` },
        { name: "ID", value: carobj.ID },
      ])
      .setDescription(`You found a barn car! How do you restore it and use it? Run \`/restore\` for more information on restoring barn finds!`)
      .setImage(carobj.Livery)
      .setColor(color)
      .setThumbnail("https://i.ibb.co/FwFWdC7/icons8-barn-240.png")
      
      await interaction.reply({ embeds: [embed] });
      userdata.cars.push(carobj);
      userdata.save();
      
      if(userdata.tutorial && userdata.tutorial.started == true && userdata.tutorial.stage == 1 && userdata.tutorial.type == "restore"){
        console.log("tutorial")
        let tut = userdata.tutorial
        tut.stage += 1
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "tutorial": tut,
            },
          },
    
        );
    
        interaction.channel.send(`**TUTORIAL:** Nice find! Now run \`/restore [${carobj.ID}]\` to learn how to restore the car to its former glory so it can race again!`)
      }
    }
    catch(err){
      return console.log(err)
    }
  
  },
};
