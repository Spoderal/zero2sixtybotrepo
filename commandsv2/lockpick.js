const cars = require("../data/cardb.json");
const partdb = require("../data/partsdb.json").Parts;
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const garagedb = require("../data/garages.json");
const { toCurrency } = require("../common/utils");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("lockpick")
    .setDescription("Lockpick a random garage for rewards"),
  async execute(interaction) {
    let udata = await User.findOne({ id: interaction.user.id });
    let cooldowns = await Cooldowns.findOne({ id: interaction.user.id });
    let lockpicks = udata.lockpicks;
    let using = udata.using
    if (lockpicks == 0) return interaction.reply(`You're out of lockpicks!`);
    let trypick = lodash.sample([true, false, true]);
    udata.lockpicks -= 1;
    udata.update();
    if (trypick == false) {
      interaction.reply("Your lockpick broke!");
      udata.save();
      return;
    }

    let garages = [];
    for (let g in garagedb) {
      let garage = garagedb[g];

      garages.push({ chance: garage.Rarity, type: garage.Name.toLowerCase() });
    }

    let rarity;
    let fil = 200
    if(using.includes("grape juice") || using.includes("Grape Juice")){
      let cooldown = cooldowns.grapejuice
      let timeout = 900000
      console.log(timeout - (Date.now() - cooldown))
      if(cooldown !== null && timeout - (Date.now() - cooldown) < 0){
        console.log("pulled")
        udata.using.pull("grape juice")
        udata.update()
        interaction.channel.send("Your grape juice ran out! :(")
      }
      fil = 50
    }
    console.log(fil)

    let garagepicked
      // Calculate chances for common
      let chance = Math.floor(Math.random() * fil)

      if(chance >= garagedb["common garage"].Rarity){
        garagepicked = "common garage"

      }
     else if(chance >= garagedb["rare garage"].Rarity){
        garagepicked = "rare garage"

      }
    else if(chance >= garagedb["legendary garage"].Rarity){
        garagepicked = "legendary garage"

      }
      else{
        garagepicked = "legendary garage"
      }
    
      console.log(chance)

    let garageindb = garagedb[garagepicked];
    let rand1 = lodash.sample(garageindb.Contents);
    let rand2 = lodash.sample(garageindb.Contents);
    let rand3 = lodash.sample(garageindb.Contents);
    let randcash = lodash.random(garageindb.MaxCash);
    let randomarray = [rand1, rand2, rand3];
    let rand2arr = [];

    for (let r in randomarray) {
      let it = randomarray[r];
      if (cars.Cars[it.toLowerCase()]) {
        let carobj = {
          ID: cars.Cars[it.toLowerCase()].alias,
          Name: cars.Cars[it.toLowerCase()].Name,
          Speed: cars.Cars[it.toLowerCase()].Speed,
          Acceleration: cars.Cars[it.toLowerCase()]["0-60"],
          Handling: cars.Cars[it.toLowerCase()].Handling,
          Parts: [],
          Emote: cars.Cars[it.toLowerCase()].Emote,
          Livery: cars.Cars[it.toLowerCase()].Image,
          Miles: 0,
        };
        rand2arr.push(
          `${cars.Cars[it.toLowerCase()].Emote} ${
            cars.Cars[it.toLowerCase()].Name
          }`
        );
        udata.cars.push(carobj);
      } else if (partdb[it.toLowerCase()]) {
        rand2arr.push(
          `${partdb[it.toLowerCase()].Emote} ${partdb[it.toLowerCase()].Name}`
        );
        udata.parts.push(it.toLowerCase());
      }
    }
    let embed = new Discord.EmbedBuilder()
      .setTitle(`Found ${garagepicked}`)
      .addFields({
        name: `Items found`,
        value: `${rand2arr.join("\n")}\n${toCurrency(randcash)}`,
        inline: true,
      })
      .setThumbnail(garagedb[garagepicked].Image)
      .setColor(colors.blue);

    udata.cash += randcash;

    udata.save();

    interaction.reply({ embeds: [embed] });
  },
};
