const cars = require("../data/cardb.json");
const partdb = require("../data/partsdb.json").Parts;
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ActionRow,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const garagedb = require("../data/garages.json");
const { toCurrency, randomNoRepeats, randomRange } = require("../common/utils");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("lockpick")
    .setDescription("Lockpick a random garage for rewards"),
  async execute(interaction) {
    let udata = await User.findOne({ id: interaction.user.id });
    let cooldowns = await Cooldowns.findOne({ id: interaction.user.id });
    let lockpicks = udata.lockpicks;
    let using = udata.using;
    if (lockpicks == 0) return interaction.reply(`You're out of lockpicks!`);
    let trypick = lodash.sample([true, false, true]);
    udata.lockpicks -= 1;
    udata.update();
    if (using.includes("epic lockpick") || using.includes("Epic Lockpick")) {
      let cooldown = cooldowns.epiclockpick;
      let timeout = 600000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        udata.using.pull("epic lockpick");
        udata.update();
        interaction.channel.send("Your grape juice ran out! :(");
      } else {
        trypick = true;
      }
    }
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
    let fil = 200;
    if (using.includes("grape juice") || using.includes("Grape Juice")) {
      let cooldown = cooldowns.grapejuice;
      let timeout = 900000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        udata.using.pull("grape juice");
        udata.update();
        interaction.channel.send("Your grape juice ran out! :(");
      }
      fil = 50;
    }
    console.log(fil);

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

    console.log(chance);

    let garageindb = garagedb[garagepicked];
    let carchance1 = randomRange(1, 10);
    let carchance2 = randomRange(1, 10);
    let carchance3 = randomRange(1, 10);

    var chooser = randomNoRepeats(garageindb.Contents);
    let rand1;
    let rand2;
    let rand3;
    if (carchance1 >= 6) {
      rand1 = chooser();
    } else {
      rand1 = randomNoRepeats(garageindb.Cars);
    }
    if (carchance2 >= 6) {
      rand2 = chooser();
    } else {
      rand2 = randomNoRepeats(garageindb.Cars);
    }
    if (carchance3 >= 6) {
      rand3 = chooser();
    } else {
      rand3 = randomNoRepeats(garageindb.Cars);
    }

    let randcash = lodash.random(garageindb.MaxCash);
    let randomarray = [rand1, rand2, rand3];
    console.log(randomarray);
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

        console.log(car);

        if (car) {
          console.log("car");
          let button = sellrow.components.filter(
            (b) => b.data.custom_id !== i.customId
          );
          console.log(button[0]);
          for (var i2 = 0; i2 < cararray.length; i2++) {
            if (cararray[i2].Name.toLowerCase() == i.customId.toLowerCase()) {
              udata.cash += 5000;
              console.log("spliced");
              cararray.splice(i2, 1);
              break;
            }
          }

          sellrow = sellrow.setComponents(button);

          console.log(sellrow.components.length);
          if (sellrow.components.length == 0) {
            await i.update({ components: [], content: "Sold all cars!" });
          } else {
            await i.update({ components: [sellrow] });
          }
        }
      });
    }

    setTimeout(() => {
      console.log(cararray);
      for (let ca in cararray) {
        udata.cars.push(cararray[ca]);
      }
      udata.save();
    }, 15000);
  },
};
