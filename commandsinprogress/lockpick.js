

const cars = require("../data/cardb.json");
const partdb = require("../data/partsdb.json").Parts;
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const garagedb = require("../data/garages.json");
const {  randomNoRepeats, randomRange } = require("../common/utils");
const ms = require("pretty-ms")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("lockpick")
    .setDescription("Lockpick a random garage for rewards"),
  async execute(interaction) {
    let udata = await User.findOne({ id: interaction.user.id });
    let cooldowns = await Cooldowns.findOne({ id: interaction.user.id });
    let lockpicks = udata.lockpicks;
    let using = udata.using;
    if (lockpicks <= 0) return await interaction.reply(`You're out of lockpicks!`);

    let cooldown = cooldowns.lockpicks;
    let timeout = 15000;
    if (cooldown !== null && timeout - (Date.now() - cooldown) > 0) {
      console.log('false')
      let time = ms(timeout - (Date.now() - cooldown));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(
          `Wait ${time} before using lockpicks again.`
        );
     return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    } 
    let trypick = lodash.sample([true, false, false, false, true]);
    udata.lockpicks = udata.lockpicks -= 1;
    cooldowns.lockpicks = Date.now()
    await cooldowns.save()
    udata.update();
    if (using.includes("epic lockpick") || using.includes("Epic Lockpick")) {
      let cooldown = cooldowns.epiclockpick;
      let timeout = 600000;
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        udata.using.pull("epic lockpick");
        udata.update();
        interaction.channel.send("Your epic lockpick ran out! :(");
      } else {
        trypick = true;
      }
    }
    // if (trypick == false) {
    //   interaction.reply("Your lockpick broke!");
    //   udata.save();
    //   return;
    // }

    let garages = [];
    for (let g in garagedb) {
      let garage = garagedb[g];

      garages.push({ chance: garage.Rarity, type: garage.Name.toLowerCase() });
    }

    let fil = 200;
    if (using.includes("grape juice") || using.includes("Grape Juice")) {
      let cooldown = cooldowns.grapejuice;
      let timeout = 120000;
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        udata.using.pull("grape juice");
        udata.update();
        interaction.channel.send("Your grape juice ran out! :(");
      }
      fil = 50;
    }

    let garagepicked;
    // Calculate chances for common
    let chance = Math.floor(Math.random() * fil);

    if (chance >= garagedb["common garage"].Rarity) {
      garagepicked = "common garage";
    } else if (chance >= garagedb["rare garage"].Rarity) {
      garagepicked = "rare garage";
    } else if (chance >= garagedb["legendary garage"].Rarity) {
      garagepicked = "legendary garage";
    } else {
      garagepicked = "legendary garage";
    }


    let garageindb = garagedb[garagepicked];
    let carchance1 = randomRange(1, 6);


    var chooser = randomNoRepeats(garageindb.Contents);
    var chooser2 = randomNoRepeats(garageindb.Cars);
    let rand1;
    let rand2;
    let rand3;
    if (carchance1 <= 4) {
      rand1 = chooser();
    } else {
      rand1 = chooser2();
    }
   

    let randomarray = [rand1, rand2, rand3];
    let rand2arr = [];
    let sellrow = new ActionRowBuilder();
    let cararray = [];
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
          WeightStat: cars.Cars[it.toLowerCase()].Weight,
          Gas: 10,
          MaxGas: 10,
        };
        rand2arr.push(
          `${cars.Cars[it.toLowerCase()].Emote} ${
            cars.Cars[it.toLowerCase()].Name
          }`
        );
        cararray.push(carobj);

        sellrow.addComponents(
          new ButtonBuilder()
            .setCustomId(`${it}`)
            .setLabel(`Sell ${it}`)
            .setStyle("Danger")
        );
      } else if (partdb[it.toLowerCase()]) {
        rand2arr.push(
          `${partdb[it.toLowerCase()].Emote} ${partdb[it.toLowerCase()].Name}`
        );
        udata.parts.push(it.toLowerCase());
      }
    }

    let embed = new EmbedBuilder()
      .setTitle(`Found ${garagepicked}`)
      .addFields({
        name: `Items found`,
        value: `${rand2arr.join(
          "\n"
        )}\nYou will receive them in 15 seconds\n\nSell the cars for $5k each`,
        inline: true,
      })
      .setThumbnail(garagedb[garagepicked].Image)
      .setColor(colors.blue);

    let msg;
    if (sellrow.components[0]) {
      msg = await interaction.reply({ embeds: [embed], components: [sellrow] });
    } else {
      msg = interaction.reply({ embeds: [embed] });
    }

    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector;
    if (sellrow.components[0]) {
      collector = msg.createMessageComponentCollector({ filter, time: 15000 });

      collector.on("collect", async (i) => {
        let car = cars.Cars[i.customId.toLowerCase()];


        if (car) {
          let button = sellrow.components.filter(
            (b) => b.data.custom_id !== i.customId
          );
          for (var i2 = 0; i2 < cararray.length; i2++) {
            if (cararray[i2].Name.toLowerCase() == i.customId.toLowerCase()) {
              udata.cash += 5000;
              cararray.splice(i2, 1);
              break;
            }
          }

          sellrow = sellrow.setComponents(button);

          if (sellrow.components.length == 0) {
            await interaction.editReply({ components: [], content: "Sold all cars!" });
          } else {
            await interaction.editReply({ components: [sellrow] });
          }
        }
      });
    }

    setTimeout(() => {
      for (let ca in cararray) {
        udata.cars.push(cararray[ca]);
      }
      udata.save();
    }, 15000);
  },
};
