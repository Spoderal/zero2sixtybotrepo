const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const racedb = require("../data/races.json");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
let cardb = require("../data/cardb.json");
const lodash = require("lodash");
const petdb = require("../data/pets.json");
const { toCurrency, randomRange } = require("../common/utils");
const cratedb = require("../data/cratedb.json");
const helmetdb = require("../data/pfpsdb.json");
const partdb = require("../data/partsdb.json");
const squaddb = require("../data/squads.json");

const ms = require("pretty-ms");
const itemdb = require("../data/items.json");

const { createCanvas, loadImage } = require("canvas");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const weather = require("../data/weather.json");

const cardata = require("../events/shopdata");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("race")
    .setDescription("Start a race from the menu")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car ID to race with")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction, client) {
    let focusedValue = interaction.options.getFocused();
    let choices = cardata.shopitems;
    let filtered = choices.filter((choice) => choice.includes(focusedValue));
    let userdata2 = await User.findOne({ id: interaction.user.id });
    let options;
    filtered = userdata2.cars;
    let filteredarr = [];
    for (let ca in filtered) {
      let carind = filtered[ca];
      filteredarr.push(carind.Name);
    }
    if (filteredarr.length > 25) {
      options = filteredarr.slice(0, 25);
    } else {
      options = filteredarr;
    }

    await interaction.respond(
      options.map((choice) => ({ name: choice, value: choice.toLowerCase() }))
    );
  },

  async execute(interaction) {
    let user = interaction.user;
    let carsarray = [];

    for (let car1 in cardb.Cars) {
      let caroj = cardb.Cars[car1];
      carsarray.push(caroj);
    }

    let userdata = await User.findOne({ id: user.id });
    let usinginv = userdata.using;
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let pet = userdata.newpet;
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
    let usercars = userdata.cars;
    let idtoselect = interaction.options.getString("car");
    idtoselect = cardb.Cars[idtoselect].Name;
    let filteredcar = userdata.cars.filter((car) => car.Name == idtoselect);
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

    cooldowndata.racing = Date.now();
    cooldowndata.save();
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Street Race")
        .setEmoji("<:logo_sr:1088661364836417609>")
        .setCustomId("streetrace")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Highway Race")
        .setEmoji("<:logo_hw:1088661363209023510>")
        .setCustomId("highwayrace")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Quarter Mile")
        .setEmoji("<:logo_qm:1090112677642244197>")
        .setCustomId("quartermile")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Half Mile")
        .setEmoji("<:logo_hm:1090112674660102195>")
        .setCustomId("halfmile")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Cross Country")
        .setEmoji("<:logo_cr:1090120001744281742>")
        .setCustomId("crossrace")
        .setStyle("Secondary")
    );
    const row5 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Venus Race")
        .setEmoji("🪐")
        .setCustomId("venusrace")
        .setStyle("Primary"),
      new ButtonBuilder()
        .setLabel("Mars Race")
        .setEmoji("🪐")
        .setCustomId("marsrace")
        .setStyle("Primary"),
      new ButtonBuilder()
        .setLabel("Moon Race")
        .setEmoji("🪐")
        .setCustomId("moonrace")
        .setStyle("Primary"),
      new ButtonBuilder()
        .setLabel("Saturn Race")
        .setEmoji("🪐")
        .setCustomId("saturnrace")
        .setStyle("Primary"),
      new ButtonBuilder()
        .setLabel("Pluto Race")
        .setEmoji("🪐")
        .setCustomId("plutorace")
        .setStyle("Primary")
    );
    const row0 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Squad Takeover")
        .setEmoji("🕶️")
        .setCustomId("squadtake")
        .setStyle("Secondary")
    );
    const tierrow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Tier 1")
        .setEmoji("<:logo_t1:1088661402165723227>")
        .setCustomId("1")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Tier 2")
        .setEmoji("<:logo_t2:1088661372000280596>")
        .setCustomId("2")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Tier 3")
        .setEmoji("<:logo_t3:1088661370943324261>")
        .setCustomId("3")
        .setStyle("Secondary")
    );
    const tierrow2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Tier 4")
        .setEmoji("<:logo_t4:1088661369877975040>")
        .setCustomId("4")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Tier 5")
        .setEmoji("<:logo_t5:1088661368414142474>")
        .setCustomId("5")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Tier 6")
        .setEmoji("<:logo_t6:1088661367088742511>")
        .setCustomId("6")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Tier 7")
        .setEmoji("<:logo_t7:1088661366447022090>")
        .setCustomId("7")
        .setStyle("Secondary")
    );

    let rowsquads = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Flame House")
        .setEmoji("<:squad_flamehouse:1025142698807668736>")
        .setCustomId("flamehouse")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("X Squad")
        .setEmoji("<:squad_xsquad:1025142697553563649>")
        .setCustomId("xsquad")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Muscle Brains")
        .setEmoji("<:squad_muscleheads:1025581852683153428>")
        .setCustomId("musclebrains")
        .setStyle("Secondary")
    );

    let squadrow2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Cool Cobras")
        .setEmoji("<:squad_cobras:1025856889730379776>")
        .setCustomId("coolcobras")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("The Ws")
        .setEmoji("<:squad_w:1026222214648963152>")
        .setCustomId("thews")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Snowys Agera")
        .setEmoji("❄️")
        .setCustomId("snowysagera")
        .setStyle("Secondary")
    );
    let carimage =
      selected.Livery || cardb.Cars[selected.Name.toLowerCase()].Image;
    let usingmsg = [];
    if (usinginv.includes("fruit punch")) {
      usingmsg.push(
        `${itemdb["fruit punch"].Emote} ${itemdb["fruit punch"].Name} Active`
      );
    }

    if (usinginv.includes("flat tire")) {
      usingmsg.push(
        `${itemdb["flat tire"].Emote} ${itemdb["flat tire"].Name} Active`
      );
    }

    if (usinginv.includes("energy drink")) {
      usingmsg.push(
        `${itemdb["energy drink"].Emote} ${itemdb["energy drink"].Name} Active`
      );
    }

    let embed = new EmbedBuilder()
      .setTitle("Select a race")
      .setDescription(
        `**Select a race from the menu below**\n\nDifferent races have different difficulties, and rewards\n\n${usingmsg.join(
          "\n"
        )}`
      )
      .setColor(colors.blue)
      .setThumbnail(carimage)
      .addFields({
        name: "Your car",
        value: `${selected.Emote} ${selected.Name}`,
      });

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row2, row5, row0],
      fetchReply: true,
    });

    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 60000,
    });
    let race;
    let races = [
      "streetrace",
      "highwayrace",
      "halfmile",
      "quartermile",
      "crossrace",
      "venusrace",
      "marsrace",
      "moonrace",
      "saturnrace",
      "plutorace",
      "squadtake",
    ];
    collector.on("collect", async (i) => {
      console.log(i.customId);
      if (races.includes(i.customId)) {
        race = racedb.filter((r) => r.name == i.customId);
        let deftier = 1;
        let reward = race[0].reward;
        let rewardsarr = [];
        for (deftier; deftier <= race[0].tiers; deftier++) {
          let am = deftier * reward;
          rewardsarr.push(`Tier ${deftier} Reward: ${am}`);
        }
        embed.setTitle("Select a tier to race in (Difficulty)");
        embed.setDescription(`${rewardsarr.join("\n")}`);

        console.log(race);

        if (i.customId == "squadtake") {
          await i.update({
            embeds: [embed],
            components: [rowsquads, squadrow2],
            fetchReply: true,
          });
        } else {
          await i.update({
            embeds: [embed],
            components: [tierrow, tierrow2],
            fetchReply: true,
          });
        }
      } else if (
        i.customId == 1 ||
        i.customId == 2 ||
        i.customId == 3 ||
        i.customId == 4 ||
        i.customId == 5 ||
        i.customId == 6 ||
        i.customId == 7 ||
        i.customId == "flamehouse" ||
        i.customId == "xsquad" ||
        i.customId == "thews" ||
        i.customId == "musclebrains" ||
        i.customId == "coolcobras" ||
        i.customId == "snowysagera"
      ) {
        if (race[0].name == "streetrace") {
          let tracklength = 0;
          let tracklength2 = 0;
          await i.update({
            content: "Please wait...",
            components: [],
            fetchReply: true,
          });
          console.log("street");
          console.log("race");
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 150;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 140
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 160
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 180
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 200
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 210
            );
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 220
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 250
            );
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          console.log(weather2);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling;
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = Number(car2.Weight);
          let acceleration2 = car2["0-60"];
          let handling2 = Number(car2.Handling);

          let speed = 0;
          let speed2 = 0;

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
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
            .setImage(carimage)
            .setThumbnail(car2.Image);

          await i.editReply({
            content: "",
            embeds: [embed],
            components: [],
            fetchReply: true,
          });

          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          let x = setInterval(() => {
            if (speed <= mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 <= mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;

          let i2 = setInterval(async () => {
            if (speed2 > mph2) {
              speed2 = mph2;
            }
            if (speed > mph) {
              speed = mph;
            }
            console.log(`speed ${speed}`);
            console.log(`speed2 ${speed2}`);
            timer++;
            speed / 6;
            handling = handling / 100;
            handling2 = handling2 / 100;
            speed2 / 6;

            let formula = (speed += handling += weight / 100);

            console.log(formula);

            // car 2

            let formula2 = (speed2 += handling2 += weight2 / 100);
            console.log(formula2);

            tracklength += formula;
            tracklength2 += formula2;

            if (tracklength > tracklength2 && timer == 10) {
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

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                if (usinginv.includes("pet treats")) {
                  let cooldown = cooldowndata.pettreats;
                  let timeout = 600000;
                  console.log(timeout - (Date.now() - cooldown));
                  if (
                    cooldown !== null &&
                    timeout - (Date.now() - cooldown) < 0
                  ) {
                    console.log("pulled");
                    userdata.using.pull("pet treats");
                    pet.xessence = petdb[pet.pet].Xessence;
                    userdata.update();
                    interaction.channel.send("Your pet treats ran out! :(");
                  }
                }

                earnings.push(
                  `${petdb[pet.pet].Emote} +${xessneceearn} Xessence`
                );

                userdata.xessence += xessneceearn;
                if (usinginv.includes("pet collar")) {
                  let cooldown = cooldowndata.petcollar;
                  let timeout = 3600000;
                  console.log(timeout - (Date.now() - cooldown));
                  if (
                    cooldown !== null &&
                    timeout - (Date.now() - cooldown) < 0
                  ) {
                    console.log("pulled");
                    userdata.using.pull("pet collar");
                    userdata.update();
                    interaction.channel.send("Your pet collar fell off! :(");
                  }
                } else {
                  userdata.newpet.love -= 5;
                  userdata.newpet.hunger -= 5;
                  userdata.newpet.thirst -= 3;
                }

                if (userdata.newpet.hunger <= 0) {
                  interaction.channel.send("Your pet died of hunger :(");
                  userdata.newpet = {};
                }
                if (userdata.newpet.thirst <= 0) {
                  interaction.channel.send("Your pet died of thirst :(");
                  userdata.newpet = {};
                }
                if (userdata.newpet.love <= 0) {
                  interaction.channel.send(
                    "Your pet left because it wasn't loved enough :("
                  );
                  userdata.newpet = {};
                }

                userdata.markModified("newpet");
              }

              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  interaction.channel.send("Your radio battery ran out.");
                } else {
                  raceranks = raceranks * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                }
              }

              if (usinginv.includes("flat tire")) {
                let cooldown = cooldowndata.flattire;
                let timeout = 1800000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("flat tire");
                  userdata.update();
                  interaction.channel.send("Your flat tire ran out! :(");
                } else {
                  cashwon = cashwon += cashwon * 0.05;
                }
              }
              let itemeffects = userdata.itemeffects || [];
              let itemeffectsfilter = itemeffects.filter(
                (item) => item.item == "tequila shot"
              );
              if (itemeffectsfilter[0]) {
                let cooldown = cooldowndata.tequilla;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("tequila shot");
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
                } else {
                  if (itemeffectsfilter[0].earning == "bad") {
                    earnings.push("You lost $500K!");
                    let usercash = userdata.cash;
                    if ((usercash -= 500000) < 0) {
                      userdata.cash = 0;
                    } else {
                      userdata.cash -= 500000;
                    }
                  } else if (itemeffectsfilter[0].earning == "good") {
                    cashwon = cashwon * 5;
                  }
                }
              }

              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                } else {
                  raceranks = 2;
                }
              }
              if (usinginv.includes("energy drink")) {
                let cooldown = cooldowndata.energydrink;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("energy drink");
                  userdata.update();
                  interaction.channel.send("Your energy drink ran out! :(");
                } else {
                  rpwon = rpwon * 2;
                }
              }

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let raceranks = 1;

              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;
              let taskfilter = userdata.tasks.filter(
                (task) => task.Task == "Win 10 street races"
              );
              if (taskfilter[0]) {
                taskfilter[0].Races += 1;
                await User.findOneAndUpdate(
                  {
                    id: user.id,
                  },
                  {
                    $set: {
                      "tasks.$[task]": taskfilter[0],
                    },
                  },

                  {
                    arrayFilters: [
                      {
                        "task.Task": "Win 10 street races",
                      },
                    ],
                  }
                );
                if (taskfilter[0].Races >= 10) {
                  userdata.cash += taskfilter[0].Reward;
                  userdata.tasks.pull(taskfilter[0]);
                  userdata.tasks.push({ ID: "T1", Time: Date.now() });
                  interaction.channel.send(`You just completed your task!`);
                }
              }
              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Street Race won!`);

              await i.editReply({ embeds: [embed] });

              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You won! Thats great! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (tracklength2 > tracklength && timer == 10) {
              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Street Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed] });
              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You lost! Thats ok! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "squadtake") {
          let tracklength = 0;
          let tracklength2 = 0;
          await i.update({
            content: "Please wait...",
            components: [],
            fetchReply: true,
          });
          console.log("street");
          console.log("race");
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = 0;
          let rpwon = 0;
          let cashlost = 0;
          let tier = userdata.tier;

          if (bot == "flamehouse") {
            console.log("1");
            car2 = squaddb.Squads["flame house"].Cars;
            if (tier < 1)
              return interaction.channel.send(
                "You need to be tier 1 or higher to do this race"
              );
          } else if (bot == "xsquad") {
            car2 = squaddb.Squads["x squad"].Cars;
            if (tier < 2)
              return interaction.channel.send(
                "You need to be tier 2 or higher to do this race"
              );
          } else if (bot == "musclebrains") {
            car2 = squaddb.Squads["muscle brains"].Cars;
            if (tier < 3)
              return interaction.channel.send(
                "You need to be tier 3 or higher to do this race"
              );
          } else if (bot == "coolcobras") {
            car2 = squaddb.Squads["cool cobras"].Cars;
            if (tier < 4)
              return interaction.channel.send(
                "You need to be tier 4 or higher to do this race"
              );
          } else if (bot == "thews") {
            car2 = squaddb.Squads["the ws"].Cars;
            if (tier < 5)
              return interaction.channel.send(
                "You need to be tier 5 or higher to do this race"
              );
          } else if (bot == "snowysagera") {
            car2 = [
              "snowys 2018 koenigsegg agera",
              "pams 2016 bugatti chiron",
              "2016 bugatti chiron",
              "2021 mclaren 720s",
              "2016 bugatti chiron",
              "2021 mclaren 720s",
              "2016 bugatti chiron",
              "2021 mclaren 720s",
            ];
            if (tier < 6)
              return interaction.reply(
                "You need to be tier 6 or higher to do this race"
              );
          }
          let car3 = lodash.sample(car2);

          console.log(car3);
          car2 = cardb.Cars[car3.toLowerCase()];

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          console.log(weather2);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling;
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = Number(car2.Weight);
          let acceleration2 = car2["0-60"];
          let handling2 = Number(car2.Handling);

          let speed = 0;
          let speed2 = 0;

          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Squad Takeover`)

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
            .setColor(colors.blue);

          await i.editReply({
            content: "",
            embeds: [embed],
            components: [],
            fetchReply: true,
          });
          cashwon = 0;
          rpwon = 0;
          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          let x = setInterval(() => {
            if (speed <= mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 <= mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;

          let i2 = setInterval(async () => {
            if (speed2 > mph2) {
              speed2 = mph2;
            }
            if (speed > mph) {
              speed = mph;
            }
            console.log(`speed ${speed}`);
            console.log(`speed2 ${speed2}`);
            timer++;
            speed / 6;
            handling = handling / 100;
            handling2 = handling2 / 100;
            speed2 / 6;

            let formula = (speed += handling += weight / 100);

            console.log(formula);

            // car 2

            let formula2 = (speed2 += handling2 += weight2 / 100);
            console.log(formula2);

            tracklength += formula;
            tracklength2 += formula2;

            if (tracklength > tracklength2 && timer == 10) {
              let earnings = [];
              if (car2.Squad) {
                let randomnumforcar = randomRange(1, 5);
                if (randomnumforcar == 5) {
                  let filtercar = usercars.filter(
                    (car) => car.Name == car2.Name
                  );
                  if (!filtercar[0]) {
                    earnings.push(`${car2.Emote} ${car2.Name}`);

                    let squadobj = car2;
                    userdata.cars.push(squadobj);
                  }

                  if (car2.Name == "Snowys 2018 Koenigsegg Agera") {
                    earnings.push("Snowy: You cheated, not fair");
                  }
                } else {
                  earnings.push("You did NOT earn their car, try again!");
                }
              }
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

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let raceranks = 1;

              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Squad Takeover won!`);

              await i.editReply({ embeds: [embed] });

              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You won! Thats great! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (tracklength2 > tracklength && timer == 10) {
              userdata.cash += cashlost;
              embed.setTitle(`Squad Takeover lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed] });
              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You lost! Thats ok! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "venusrace") {
          if (
            selected.Tires !== "T1SpaceTires" &&
            selected.Name !== "Mars Rover"
          )
            return interaction.channel.send(
              "You need space tires to race on this planet!"
            );
          let tracklength = 0;
          let tracklength2 = 0;
          await i.update({
            content: "Please wait...",
            components: [],
            fetchReply: true,
          });
          console.log("street");
          console.log("race");
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 150;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 140
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 160
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 180
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 200
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 210
            );
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 220
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 250
            );
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling;
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling;

          let speed = 0;
          let speed2 = 0;
          let randomgravity = randomRange(2000, 5000);

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);

          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Venus Race`)

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
            .setImage(carimage)
            .setThumbnail(car2.Image);

          await i.editReply({
            content: "",
            embeds: [embed],
            components: [],
            fetchReply: true,
          });
          let gravity = false;
          setTimeout(async () => {
            let grow = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("gravity")
                .setEmoji("🪛")
                .setLabel("Pull gravity lever")
                .setStyle("Primary")
            );

            await i.editReply({
              components: [grow],
              fetchReply: true,
            });

            collector.on("collect", async (i) => {
              if (i.customId.includes("gravity")) {
                gravity = true;
                await i.deferUpdate();
              }
            });

            setTimeout(async () => {
              await i.editReply({
                components: [],
                fetchReply: true,
              });
            }, 2000);
          }, randomgravity);

          weight = weight * 10;
          weight2 = weight2 * 10;
          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;
          let i2 = setInterval(async () => {
            if (speed2 > mph2) {
              speed2 = mph2;
            }
            if (speed > mph) {
              speed = mph;
            }
            timer++;
            console.log(timer);
            let newspeed = speed / 6.3;
            handling = handling / 100;
            handling2 = handling2 / 100;
            let newspeed2 = speed2 / 6.3;

            let formula = (newspeed += handling += weight / 100);

            console.log(formula);
            // car 2

            let formula2 = (newspeed2 += handling2 += weight2 / 100);
            tracklength += formula;
            tracklength2 += formula2;

            if (tracklength > tracklength2 && timer == 10 && gravity == false) {
              embed.setTitle(
                `Tier ${bot} Venus Race lost! Your car flew off the planet!`
              );

              await i.editReply({ embeds: [embed] });
            } else if (
              tracklength < tracklength2 &&
              timer == 10 &&
              gravity == false
            ) {
              embed.setTitle(
                `Tier ${bot} Venus Race lost! Your car flew off the planet!`
              );

              await i.editReply({ embeds: [embed] });
            } else if (
              tracklength > tracklength2 &&
              timer == 10 &&
              gravity == true
            ) {
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

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                earnings.push(
                  `${petdb[pet.pet].Emote} +${xessneceearn} Xessence`
                );
                userdata.xessence += xessneceearn;
                userdata.newpet.love -= 5;
                userdata.newpet.hunger -= 5;
                userdata.newpet.thirst -= 3;

                if (userdata.newpet.hunger <= 0) {
                  interaction.channel.send("Your pet died of hunger :(");
                  userdata.newpet = {};
                }
                if (userdata.newpet.thirst <= 0) {
                  interaction.channel.send("Your pet died of thirst :(");
                  userdata.newpet = {};
                }
                if (userdata.newpet.love <= 0) {
                  interaction.channel.send(
                    "Your pet left because it wasn't loved enough :("
                  );
                  userdata.newpet = {};
                }

                userdata.markModified("newpet");
              }

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let randompart = randomRange(1, 5);

              console.log(randompart);
              if (randompart == 3) {
                earnings.push(
                  `${partdb.Parts["car hook"].Emote} +1 ${partdb.Parts["car hook"].Name}`
                );
                userdata.parts.push("car hook");
              }
              let raceranks = 1;
              earnings.push("<:moontokens:1044726056680161371> 1 Space Token");
              userdata.spacetokens += 1;
              let using = userdata.using;
              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) < 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                } else {
                  raceranks = 2;
                }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;
              let taskfilter = userdata.tasks.filter(
                (task) => task.Task == "Win 10 street races"
              );
              if (taskfilter[0]) {
                taskfilter[0].Races += 1;
                await User.findOneAndUpdate(
                  {
                    id: user.id,
                  },
                  {
                    $set: {
                      "tasks.$[task]": taskfilter[0],
                    },
                  },

                  {
                    arrayFilters: [
                      {
                        "task.Task": "Win 10 street races",
                      },
                    ],
                  }
                );
                if (taskfilter[0].Races >= 10) {
                  userdata.cash += taskfilter[0].Reward;
                  userdata.tasks.pull(taskfilter[0]);
                  userdata.tasks.push({ ID: "T1", Time: Date.now() });
                  interaction.channel.send(`You just completed your task!`);
                }
              }
              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Venus Race won!`);

              await i.editReply({ embeds: [embed] });

              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You won! Thats great! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (
              tracklength2 > tracklength &&
              timer == 10 &&
              gravity == true
            ) {
              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Venus Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed] });
              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You lost! Thats ok! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "marsrace") {
          if (
            selected.Tires !== "T1SpaceTires" &&
            selected.Name !== "Mars Rover"
          )
            return interaction.channel.send(
              "You need space tires to race on this planet!"
            );
          let tracklength = 0;
          let tracklength2 = 0;
          await i.update({
            content: "Please wait...",
            components: [],
            fetchReply: true,
          });
          console.log("street");
          console.log("race");
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 150;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 140
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 160
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 180
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 200
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 210
            );
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 220
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 250
            );
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          console.log(weather2);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling;
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling;

          let speed = 0;
          let speed2 = 0;
          let randomgravity = randomRange(2000, 5000);

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Mars Race`)

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
            .setImage(carimage)
            .setThumbnail(car2.Image);

          await i.editReply({
            content: "",
            embeds: [embed],
            components: [],
            fetchReply: true,
          });
          let gravity = false;
          setTimeout(async () => {
            let grow = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("gravity")
                .setEmoji("🪛")
                .setLabel("Pull gravity lever")
                .setStyle("Primary")
            );

            await i.editReply({
              components: [grow],
              fetchReply: true,
            });

            collector.on("collect", async (i) => {
              if (i.customId.includes("gravity")) {
                gravity = true;
                await i.deferUpdate();
              }
            });

            setTimeout(async () => {
              await i.editReply({
                components: [],
                fetchReply: true,
              });
            }, 2000);
          }, randomgravity);

          weight = weight * 5;
          weight2 = weight2 * 5;
          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;
          let i2 = setInterval(async () => {
            if (speed2 > mph2) {
              speed2 = mph2;
            }
            if (speed > mph) {
              speed = mph;
            }
            timer++;
            console.log(timer);
            let newspeed = speed / 6.3;
            handling = handling / 100;
            handling2 = handling2 / 100;
            let newspeed2 = speed2 / 6.3;

            let formula = (newspeed += handling += weight / 100);

            console.log(formula);
            // car 2

            let formula2 = (newspeed2 += handling2 += weight2 / 100);
            tracklength += formula;
            tracklength2 += formula2;

            if (tracklength > tracklength2 && timer == 10 && gravity == false) {
              embed.setTitle(
                `Tier ${bot} Mars Race lost! Your car flew off the planet!`
              );

              await i.editReply({ embeds: [embed] });
            } else if (
              tracklength < tracklength2 &&
              timer == 10 &&
              gravity == false
            ) {
              embed.setTitle(
                `Tier ${bot} Mars Race lost! Your car flew off the planet!`
              );

              await i.editReply({ embeds: [embed] });
            } else if (
              tracklength > tracklength2 &&
              timer == 10 &&
              gravity == true
            ) {
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

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                earnings.push(
                  `${petdb[pet.pet].Emote} +${xessneceearn} Xessence`
                );
                userdata.xessence += xessneceearn;
                userdata.newpet.love -= 5;
                userdata.newpet.hunger -= 5;
                userdata.newpet.thirst -= 3;

                if (userdata.newpet.hunger <= 0) {
                  interaction.channel.send("Your pet died of hunger :(");
                  userdata.newpet = {};
                }
                if (userdata.newpet.thirst <= 0) {
                  interaction.channel.send("Your pet died of thirst :(");
                  userdata.newpet = {};
                }
                if (userdata.newpet.love <= 0) {
                  interaction.channel.send(
                    "Your pet left because it wasn't loved enough :("
                  );
                  userdata.newpet = {};
                }

                userdata.markModified("newpet");
              }

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let randompart = randomRange(1, 5);

              if (randompart == 3) {
                earnings.push(
                  `${partdb.Parts["nuclear core"].Emote} +1 ${partdb.Parts["nuclear core"].Name}`
                );
                userdata.parts.push("nuclear core");
              }
              let raceranks = 1;
              earnings.push("<:moontokens:1044726056680161371> 1 Space Token");
              userdata.spacetokens += 1;
              let using = userdata.using;
              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) < 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                } else {
                  raceranks = 2;
                }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;
              let taskfilter = userdata.tasks.filter(
                (task) => task.Task == "Win 10 street races"
              );
              if (taskfilter[0]) {
                taskfilter[0].Races += 1;
                await User.findOneAndUpdate(
                  {
                    id: user.id,
                  },
                  {
                    $set: {
                      "tasks.$[task]": taskfilter[0],
                    },
                  },

                  {
                    arrayFilters: [
                      {
                        "task.Task": "Win 10 street races",
                      },
                    ],
                  }
                );
                if (taskfilter[0].Races >= 10) {
                  userdata.cash += taskfilter[0].Reward;
                  userdata.tasks.pull(taskfilter[0]);
                  userdata.tasks.push({ ID: "T1", Time: Date.now() });
                  interaction.channel.send(`You just completed your task!`);
                }
              }
              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Mars Race won!`);

              await i.editReply({ embeds: [embed] });

              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You won! Thats great! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (
              tracklength2 > tracklength &&
              timer == 10 &&
              gravity == true
            ) {
              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Mars Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed] });
              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You lost! Thats ok! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "moonrace") {
          if (
            selected.Tires !== "T1SpaceTires" &&
            selected.Name !== "Mars Rover"
          )
            return interaction.channel.send(
              "You need space tires to race on this planet!"
            );
          let tracklength = 0;
          let tracklength2 = 0;
          await i.update({
            content: "Please wait...",
            components: [],
            fetchReply: true,
          });
          console.log("street");
          console.log("race");
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 150;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 140
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 160
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 180
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 200
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 210
            );
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 220
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 250
            );
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          console.log(weather2);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling;
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling;

          let speed = 0;
          let speed2 = 0;
          let randomgravity = randomRange(2000, 5000);

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Moon Race`)

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
            .setImage(carimage)
            .setThumbnail(car2.Image);

          await i.editReply({
            content: "",
            embeds: [embed],
            components: [],
            fetchReply: true,
          });
          let gravity = false;
          setTimeout(async () => {
            let grow = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("gravity")
                .setEmoji("🪛")
                .setLabel("Pull gravity lever")
                .setStyle("Primary")
            );

            await i.editReply({
              components: [grow],
              fetchReply: true,
            });

            collector.on("collect", async (i) => {
              if (i.customId.includes("gravity")) {
                gravity = true;
                await i.deferUpdate();
              }
            });

            setTimeout(async () => {
              await i.editReply({
                components: [],
                fetchReply: true,
              });
            }, 1500);
          }, randomgravity);

          weight = weight / 2;
          weight2 = weight2 / 2;
          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;
          let i2 = setInterval(async () => {
            if (speed2 > mph2) {
              speed2 = mph2;
            }
            if (speed > mph) {
              speed = mph;
            }
            timer++;
            console.log(timer);
            let newspeed = speed / 6.3;
            handling = handling / 100;
            handling2 = handling2 / 100;
            let newspeed2 = speed2 / 6.3;

            let formula = (newspeed += handling += weight / 100);

            console.log(formula);
            // car 2

            let formula2 = (newspeed2 += handling2 += weight2 / 100);
            tracklength += formula;
            tracklength2 += formula2;

            if (tracklength > tracklength2 && timer == 10 && gravity == false) {
              embed.setTitle(
                `Tier ${bot} Moon Race lost! Your car flew off the planet!`
              );

              await i.editReply({ embeds: [embed] });
            } else if (
              tracklength < tracklength2 &&
              timer == 10 &&
              gravity == false
            ) {
              embed.setTitle(
                `Tier ${bot} Moon Race lost! Your car flew off the planet!`
              );

              await i.editReply({ embeds: [embed] });
            } else if (
              tracklength > tracklength2 &&
              timer == 10 &&
              gravity == true
            ) {
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

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                earnings.push(
                  `${petdb[pet.pet].Emote} +${xessneceearn} Xessence`
                );
                userdata.xessence += xessneceearn;
                userdata.newpet.love -= 5;
                userdata.newpet.hunger -= 5;
                userdata.newpet.thirst -= 3;

                if (userdata.newpet.hunger <= 0) {
                  interaction.channel.send("Your pet died of hunger :(");
                  userdata.newpet = {};
                }
                if (userdata.newpet.thirst <= 0) {
                  interaction.channel.send("Your pet died of thirst :(");
                  userdata.newpet = {};
                }
                if (userdata.newpet.love <= 0) {
                  interaction.channel.send(
                    "Your pet left because it wasn't loved enough :("
                  );
                  userdata.newpet = {};
                }

                userdata.markModified("newpet");
              }

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let randompart = randomRange(1, 5);

              if (randompart == 3) {
                earnings.push(
                  `${partdb.Parts["metal frame"].Emote} +1 ${partdb.Parts["metal frame"].Name}`
                );
                userdata.parts.push("metal frame");
              }
              let raceranks = 1;
              earnings.push("<:moontokens:1044726056680161371> 1 Space Token");
              userdata.spacetokens += 1;
              let using = userdata.using;
              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) < 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                } else {
                  raceranks = 2;
                }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;
              let taskfilter = userdata.tasks.filter(
                (task) => task.Task == "Win 10 street races"
              );
              if (taskfilter[0]) {
                taskfilter[0].Races += 1;
                await User.findOneAndUpdate(
                  {
                    id: user.id,
                  },
                  {
                    $set: {
                      "tasks.$[task]": taskfilter[0],
                    },
                  },

                  {
                    arrayFilters: [
                      {
                        "task.Task": "Win 10 street races",
                      },
                    ],
                  }
                );
                if (taskfilter[0].Races >= 10) {
                  userdata.cash += taskfilter[0].Reward;
                  userdata.tasks.pull(taskfilter[0]);
                  userdata.tasks.push({ ID: "T1", Time: Date.now() });
                  interaction.channel.send(`You just completed your task!`);
                }
              }
              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Moon Race won!`);

              await i.editReply({ embeds: [embed] });

              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You won! Thats great! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (
              tracklength2 > tracklength &&
              timer == 10 &&
              gravity == true
            ) {
              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Moon Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed] });
              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You lost! Thats ok! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "saturnrace") {
          if (
            selected.Tires !== "T1SpaceTires" &&
            selected.Name !== "Mars Rover"
          )
            return interaction.channel.send(
              "You need space tires to race on this planet!"
            );
          let tracklength = 0;
          let tracklength2 = 0;
          await i.update({
            content: "Please wait...",
            components: [],
            fetchReply: true,
          });
          console.log("street");
          console.log("race");
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 150;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 140
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 160
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 180
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 200
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 210
            );
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 220
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 250
            );
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          console.log(weather2);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling;
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling;

          let speed = 0;
          let speed2 = 0;
          let randomgravity = randomRange(2000, 5000);

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Saturn Race`)

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
            .setImage(carimage)
            .setThumbnail(car2.Image);

          await i.editReply({
            content: "",
            embeds: [embed],
            components: [],
            fetchReply: true,
          });
          let gravity = false;
          setTimeout(async () => {
            let grow = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("gravity")
                .setEmoji("🪛")
                .setLabel("Pull gravity lever")
                .setStyle("Primary")
            );

            await i.editReply({
              components: [grow],
              fetchReply: true,
            });

            collector.on("collect", async (i) => {
              if (i.customId.includes("gravity")) {
                gravity = true;
                await i.deferUpdate();
              }
            });

            setTimeout(async () => {
              await i.editReply({
                components: [],
                fetchReply: true,
              });
            }, 1500);
          }, randomgravity);

          weight = weight / 5;
          weight2 = weight2 / 5;
          let accms = acceleration * 15;
          let accms2 = acceleration2 * 15;

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;
          let i2 = setInterval(async () => {
            if (speed2 > mph2) {
              speed2 = mph2;
            }
            if (speed > mph) {
              speed = mph;
            }
            timer++;
            console.log(timer);
            let newspeed = speed / 6.3;
            handling = handling / 100;
            handling2 = handling2 / 100;
            let newspeed2 = speed2 / 6.3;

            let formula = (newspeed += handling += weight / 100);

            console.log(formula);
            // car 2

            let formula2 = (newspeed2 += handling2 += weight2 / 100);
            tracklength += formula;
            tracklength2 += formula2;

            if (tracklength > tracklength2 && timer == 10 && gravity == false) {
              embed.setTitle(
                `Tier ${bot} Saturn Race lost! Your car flew off the planet!`
              );

              await i.editReply({ embeds: [embed] });
            } else if (
              tracklength < tracklength2 &&
              timer == 10 &&
              gravity == false
            ) {
              embed.setTitle(
                `Tier ${bot} Saturn Race lost! Your car flew off the planet!`
              );

              await i.editReply({ embeds: [embed] });
            } else if (
              tracklength > tracklength2 &&
              timer == 10 &&
              gravity == true
            ) {
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

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                earnings.push(
                  `${petdb[pet.pet].Emote} +${xessneceearn} Xessence`
                );
                userdata.xessence += xessneceearn;
                userdata.newpet.love -= 5;
                userdata.newpet.hunger -= 5;
                userdata.newpet.thirst -= 3;

                if (userdata.newpet.hunger <= 0) {
                  interaction.channel.send("Your pet died of hunger :(");
                  userdata.newpet = {};
                }
                if (userdata.newpet.thirst <= 0) {
                  interaction.channel.send("Your pet died of thirst :(");
                  userdata.newpet = {};
                }
                if (userdata.newpet.love <= 0) {
                  interaction.channel.send(
                    "Your pet left because it wasn't loved enough :("
                  );
                  userdata.newpet = {};
                }

                userdata.markModified("newpet");
              }

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let randompart = randomRange(1, 5);

              if (randompart == 3) {
                earnings.push(
                  `${partdb.Parts["alien oil"].Emote} +1 ${partdb.Parts["alien oil"].Name}`
                );
                userdata.parts.push("alien oil");
              }
              let raceranks = 1;
              earnings.push("<:moontokens:1044726056680161371> 1 Space Token");
              userdata.spacetokens += 1;
              let using = userdata.using;
              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) < 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                } else {
                  raceranks = 2;
                }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;
              let taskfilter = userdata.tasks.filter(
                (task) => task.Task == "Win 10 street races"
              );
              if (taskfilter[0]) {
                taskfilter[0].Races += 1;
                await User.findOneAndUpdate(
                  {
                    id: user.id,
                  },
                  {
                    $set: {
                      "tasks.$[task]": taskfilter[0],
                    },
                  },

                  {
                    arrayFilters: [
                      {
                        "task.Task": "Win 10 street races",
                      },
                    ],
                  }
                );
                if (taskfilter[0].Races >= 10) {
                  userdata.cash += taskfilter[0].Reward;
                  userdata.tasks.pull(taskfilter[0]);
                  userdata.tasks.push({ ID: "T1", Time: Date.now() });
                  interaction.channel.send(`You just completed your task!`);
                }
              }
              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Saturn Race won!`);

              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You won! Thats great! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (
              tracklength2 > tracklength &&
              timer == 10 &&
              gravity == true
            ) {
              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Saturn Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You lost! Thats ok! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "plutorace") {
          if (
            selected.Tires !== "T1SpaceTires" &&
            selected.Name !== "Mars Rover"
          )
            return interaction.channel.send(
              "You need space tires to race on this planet!"
            );
          let tracklength = 0;
          let tracklength2 = 0;
          await i.update({
            content: "Please wait...",
            components: [],
            fetchReply: true,
          });
          console.log("street");
          console.log("race");
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 150;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 140
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 160
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 180
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 200
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 210
            );
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 220
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 250
            );
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          console.log(weather2);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling;
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling;

          let speed = 0;
          let speed2 = 0;
          let randomgravity = randomRange(2000, 5000);

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Pluto Race`)

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
            .setImage(carimage)
            .setThumbnail(car2.Image);

          await i.editReply({
            content: "",
            embeds: [embed],
            components: [],
            fetchReply: true,
          });
          let gravity = false;
          setTimeout(async () => {
            let grow = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("gravity")
                .setEmoji("🪛")
                .setLabel("Pull gravity lever")
                .setStyle("Primary")
            );

            await i.editReply({
              components: [grow],
              fetchReply: true,
            });

            collector.on("collect", async (i) => {
              if (i.customId.includes("gravity")) {
                gravity = true;
                await i.deferUpdate();
              }
            });

            setTimeout(async () => {
              await i.editReply({
                components: [],
                fetchReply: true,
              });
            }, 1500);
          }, randomgravity);

          weight = weight * 2;
          weight2 = weight2 * 2;
          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;
          let i2 = setInterval(async () => {
            if (speed2 > mph2) {
              speed2 = mph2;
            }
            if (speed > mph) {
              speed = mph;
            }
            timer++;
            console.log(timer);
            let newspeed = speed / 6.3;
            handling = handling / 100;
            handling2 = handling2 / 100;
            let newspeed2 = speed2 / 6.3;

            let formula = (newspeed += handling += weight / 100);

            console.log(formula);
            // car 2

            let formula2 = (newspeed2 += handling2 += weight2 / 100);
            tracklength += formula;
            tracklength2 += formula2;

            if (tracklength > tracklength2 && timer == 10 && gravity == false) {
              embed.setTitle(
                `Tier ${bot} Pluto Race lost! Your car flew off the planet!`
              );
            } else if (
              tracklength < tracklength2 &&
              timer == 10 &&
              gravity == false
            ) {
              embed.setTitle(
                `Tier ${bot} Pluto Race lost! Your car flew off the planet!`
              );
            } else if (
              tracklength > tracklength2 &&
              timer == 10 &&
              gravity == true
            ) {
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

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                earnings.push(
                  `${petdb[pet.pet].Emote} +${xessneceearn} Xessence`
                );
                userdata.xessence += xessneceearn;
                userdata.newpet.love -= 5;
                userdata.newpet.hunger -= 5;
                userdata.newpet.thirst -= 3;

                if (userdata.newpet.hunger <= 0) {
                  interaction.channel.send("Your pet died of hunger :(");
                  userdata.newpet = {};
                }
                if (userdata.newpet.thirst <= 0) {
                  interaction.channel.send("Your pet died of thirst :(");
                  userdata.newpet = {};
                }
                if (userdata.newpet.love <= 0) {
                  interaction.channel.send(
                    "Your pet left because it wasn't loved enough :("
                  );
                  userdata.newpet = {};
                }

                userdata.markModified("newpet");
              }

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let randompart = randomRange(1, 5);

              if (randompart == 3) {
                earnings.push(
                  `${partdb.Parts["zionite pistons"].Emote} +1 ${partdb.Parts["zionite pistons"].Name}`
                );
                userdata.parts.push("zionite pistons");
              }
              let raceranks = 1;
              earnings.push("<:moontokens:1044726056680161371> 1 Space Token");
              userdata.spacetokens += 1;
              let using = userdata.using;
              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) < 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                } else {
                  raceranks = 2;
                }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;
              let taskfilter = userdata.tasks.filter(
                (task) => task.Task == "Win 10 street races"
              );
              if (taskfilter[0]) {
                taskfilter[0].Races += 1;
                await User.findOneAndUpdate(
                  {
                    id: user.id,
                  },
                  {
                    $set: {
                      "tasks.$[task]": taskfilter[0],
                    },
                  },

                  {
                    arrayFilters: [
                      {
                        "task.Task": "Win 10 street races",
                      },
                    ],
                  }
                );
                if (taskfilter[0].Races >= 10) {
                  userdata.cash += taskfilter[0].Reward;
                  userdata.tasks.pull(taskfilter[0]);
                  userdata.tasks.push({ ID: "T1", Time: Date.now() });
                  interaction.channel.send(`You just completed your task!`);
                }
              }
              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Pluto Race won!`);

              await i.editReply({ embeds: [embed] });

              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You won! Thats great! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (
              tracklength2 > tracklength &&
              timer == 10 &&
              gravity == true
            ) {
              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Pluto Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              if (userdata.tutorial && userdata.tutorial.stage == 1) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You lost! Thats ok! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "highwayrace") {
          let tracklength = 1000;
          let tracklength2 = 1000;
          await i.update({ content: "Please wait...", components: [] });
          console.log("street");
          console.log("race");
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 250;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;
          let lockpicks = parseInt(bot) * 1;
          let wheelspins = parseInt(bot) * 1;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 140
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 160
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 180
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 200
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 210
            );
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 220
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 250
            );
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling;

          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling;

          let speed = 0;
          let speed2 = 0;

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Highway Race`)

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
            .setImage(carimage)
            .setThumbnail(car2.Image);

          await i.editReply({
            content: "",
            embeds: [embed],
            components: [],
            fetchReply: true,
          });

          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let i2 = setInterval(async () => {
            if (speed2 > mph2) {
              speed2 = mph2;
            }
            if (speed > mph) {
              speed = mph;
            }
            let newspeed = speed / 5;
            handling = handling / 100;
            handling2 = handling2 / 100;
            let newspeed2 = speed2 / 5;

            let formula = (newspeed += handling += weight / 100);

            console.log(formula);
            // car 2

            let formula2 = (newspeed2 += handling2 += weight2 / 100);
            tracklength -= formula;
            tracklength2 -= formula2;

            if (tracklength <= 0) {
              clearInterval(i2);

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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }

              earnings.push(`${emotes.wheelSpin} +${wheelspins}`);
              earnings.push(`${emotes.lockpicks} +${lockpicks}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }

              let raceranks = 1;

              let using = userdata.using;

              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  interaction.channel.send("Your radio battery ran out.");
                } else {
                  raceranks = raceranks * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                }
              }

              if (usinginv.includes("flat tire")) {
                let cooldown = cooldowndata.flattire;
                let timeout = 1800000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("flat tire");
                  userdata.update();
                  interaction.channel.send("Your flat tire ran out! :(");
                } else {
                  cashwon = cashwon += cashwon * 0.05;
                }
              }
              let itemeffects = userdata.itemeffects || [];
              let itemeffectsfilter = itemeffects.filter(
                (item) => item.item == "tequila shot"
              );
              if (itemeffectsfilter[0]) {
                let cooldown = cooldowndata.tequilla;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("tequila shot");
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
                } else {
                  if (itemeffectsfilter[0].earning == "bad") {
                    earnings.push("You lost $500K!");
                    let usercash = userdata.cash;
                    if ((usercash -= 500000) < 0) {
                      userdata.cash = 0;
                    } else {
                      userdata.cash -= 500000;
                    }
                  } else if (itemeffectsfilter[0].earning == "good") {
                    cashwon = cashwon * 5;
                  }
                }
              }

              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                } else {
                  raceranks = 2;
                }
              }
              if (usinginv.includes("energy drink")) {
                let cooldown = cooldowndata.energydrink;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("energy drink");
                  userdata.update();
                  interaction.channel.send("Your energy drink ran out! :(");
                } else {
                  rpwon = rpwon * 2;
                }
              }
              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.wheelspins += wheelspins;
              userdata.lockpicks += lockpicks;

              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Highway Race won!`);

              if (userdata.tutorial && userdata.tutorial.stage == 2) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You won! Thats great! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (tracklength2 <= 0) {
              clearInterval(i2);

              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Highway Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              if (userdata.tutorial && userdata.tutorial.stage == 2) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You lost! Thats ok! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "halfmile") {
          let tracklength = 800;
          let tracklength2 = 800;
          await i.update({ content: "Please wait...", components: [] });
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 250;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 140
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 160
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 180
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 200
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 210
            );
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 220
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 250
            );
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          console.log(weather2);

          let slipchance = weather2.Slip;
          let speedreduce = weather2.SpeedReduce;
          let mph;
          if (speedreduce > 0) {
            mph = selected.Speed -= speedreduce;
          } else {
            mph = selected.Speed;
          }
          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling / weather2.Grip;

          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          if (speedreduce > 0) {
            mph2 = car2.Speed -= speedreduce;
          } else {
            mph2 = car2.Speed;
          }
          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling / weather2.Grip;
          if (slipchance > 0) {
            let slip = randomRange(1, slipchance);
            if (slip >= 2) {
              mph -= 10;
            }
          }
          let speed = 0;
          let speed2 = 0;

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Half Mile Race ${weather2.Emote}`)

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
            .setImage(carimage)
            .setThumbnail(car2.Image);

          await i.editReply({
            content: "",
            embeds: [embed],
            components: [],
            fetchReply: true,
          });

          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let i2 = setInterval(async () => {
            if (speed2 > mph2) {
              speed2 = mph2;
            }
            if (speed > mph) {
              speed = mph;
            }
            let newspeed = speed / 3;
            handling = handling / 100;
            handling2 = handling2 / 100;
            let newspeed2 = speed2 / 3;

            let formula = (newspeed += handling += weight / 75);

            console.log(formula);
            // car 2

            let formula2 = (newspeed2 += handling2 += weight2 / 75);
            tracklength -= formula;
            tracklength2 -= formula2;
            if (tracklength <= 0) {
              clearInterval(i2);

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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let raceranks = 1;

              let using = userdata.using;

              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  interaction.channel.send("Your radio battery ran out.");
                } else {
                  raceranks = raceranks * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                }
              }

              if (usinginv.includes("flat tire")) {
                let cooldown = cooldowndata.flattire;
                let timeout = 1800000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("flat tire");
                  userdata.update();
                  interaction.channel.send("Your flat tire ran out! :(");
                } else {
                  cashwon = cashwon += cashwon * 0.05;
                }
              }
              let itemeffects = userdata.itemeffects || [];
              let itemeffectsfilter = itemeffects.filter(
                (item) => item.item == "tequila shot"
              );
              if (itemeffectsfilter[0]) {
                let cooldown = cooldowndata.tequilla;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("tequila shot");
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
                } else {
                  if (itemeffectsfilter[0].earning == "bad") {
                    earnings.push("You lost $500K!");
                    let usercash = userdata.cash;
                    if ((usercash -= 500000) < 0) {
                      userdata.cash = 0;
                    } else {
                      userdata.cash -= 500000;
                    }
                  } else if (itemeffectsfilter[0].earning == "good") {
                    cashwon = cashwon * 5;
                  }
                }
              }

              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                } else {
                  raceranks = 2;
                }
              }
              if (usinginv.includes("energy drink")) {
                let cooldown = cooldowndata.energydrink;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("energy drink");
                  userdata.update();
                  interaction.channel.send("Your energy drink ran out! :(");
                } else {
                  rpwon = rpwon * 2;
                }
              }

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;

              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(
                `Tier ${bot} Half Mile Race won! ${weather2.Emote}`
              );

              if (userdata.tutorial && userdata.tutorial.stage == 2) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You won! Thats great! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (tracklength2 <= 0) {
              clearInterval(i2);

              userdata.cash += cashlost;
              embed.setTitle(
                `Tier ${bot} Half Mile Race lost! ${weather2.Emote}`
              );
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              if (userdata.tutorial && userdata.tutorial.stage == 2) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You lost! Thats ok! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "quartermile") {
          let tracklength = 400;
          let tracklength2 = 400;
          await i.update({ content: "Please wait...", components: [] });
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 200;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;
          let commonkeys;
          let rarekeys;
          let exotickeys;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 140
            );
            commonkeys = 2;
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 160
            );

            commonkeys = 5;
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 180
            );
            rarekeys = 2;
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 200
            );
            rarekeys = 5;
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 210
            );
            exotickeys = 2;
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 220
            );
            exotickeys = 5;
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 250
            );
            exotickeys = 7;
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          console.log(weather2);

          let slipchance = weather2.Slip;
          let speedreduce = weather2.SpeedReduce;
          let mph;
          if (speedreduce > 0) {
            mph = selected.Speed -= speedreduce;
          } else {
            mph = selected.Speed;
          }
          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling / weather2.Grip;

          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          if (speedreduce > 0) {
            mph2 = car2.Speed -= speedreduce;
          } else {
            mph2 = car2.Speed;
          }
          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling / weather2.Grip;
          if (slipchance > 0) {
            let slip = randomRange(1, slipchance);
            if (slip >= 2) {
              mph -= 10;
            }
          }
          let speed = 0;
          let speed2 = 0;

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Quarter Mile Race ${weather2.Emote}`)

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
            .setImage(carimage)
            .setThumbnail(car2.Image);

          await i.editReply({
            content: "",
            embeds: [embed],
            components: [],
            fetchReply: true,
          });

          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let i2 = setInterval(async () => {
            if (speed2 > mph2) {
              speed2 = mph2;
            }
            if (speed > mph) {
              speed = mph;
            }
            let newspeed = speed / 3;
            handling = handling / 100;
            handling2 = handling2 / 100;
            let newspeed2 = speed2 / 3;

            let formula = (newspeed += handling += weight / 75);

            console.log(formula);
            // car 2

            let formula2 = (newspeed2 += handling2 += weight2 / 75);
            tracklength -= formula;
            tracklength2 -= formula2;

            console.log(tracklength);

            if (tracklength <= 0) {
              clearInterval(i2);

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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }
              if (commonkeys && commonkeys > 0) {
                earnings.push(`${emotes.ckey} +${commonkeys}`);
                userdata.ckeys += commonkeys;
              }
              if (rarekeys && rarekeys > 0) {
                earnings.push(`${emotes.rkey} +${rarekeys}`);
                userdata.rkeys += rarekeys;
              }
              if (exotickeys && exotickeys > 0) {
                earnings.push(`${emotes.ekey} +${exotickeys}`);
                userdata.ekeys += exotickeys;
              }

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let raceranks = 1;
              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  interaction.channel.send("Your radio battery ran out.");
                } else {
                  raceranks = raceranks * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                }
              }

              if (usinginv.includes("flat tire")) {
                let cooldown = cooldowndata.flattire;
                let timeout = 1800000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("flat tire");
                  userdata.update();
                  interaction.channel.send("Your flat tire ran out! :(");
                } else {
                  cashwon = cashwon += cashwon * 0.05;
                }
              }
              let itemeffects = userdata.itemeffects || [];
              let itemeffectsfilter = itemeffects.filter(
                (item) => item.item == "tequila shot"
              );
              if (itemeffectsfilter[0]) {
                let cooldown = cooldowndata.tequilla;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("tequila shot");
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
                } else {
                  if (itemeffectsfilter[0].earning == "bad") {
                    earnings.push("You lost $500K!");
                    let usercash = userdata.cash;
                    if ((usercash -= 500000) < 0) {
                      userdata.cash = 0;
                    } else {
                      userdata.cash -= 500000;
                    }
                  } else if (itemeffectsfilter[0].earning == "good") {
                    cashwon = cashwon * 5;
                  }
                }
              }

              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                } else {
                  raceranks = 2;
                }
              }
              if (usinginv.includes("energy drink")) {
                let cooldown = cooldowndata.energydrink;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("energy drink");
                  userdata.update();
                  interaction.channel.send("Your energy drink ran out! :(");
                } else {
                  rpwon = rpwon * 2;
                }
              }

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(
                `Tier ${bot} Quarter Mile Race won! ${weather2.Emote}`
              );

              if (userdata.tutorial && userdata.tutorial.stage == 2) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You won! Thats great! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }

              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
              return;
            }
            // lost
            else if (tracklength2 <= 0) {
              clearInterval(i2);

              userdata.cash += cashlost;
              embed.setTitle(
                `Tier ${bot} Quarter Mile Race lost! ${weather2.Emote}`
              );
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);
              if (userdata.tutorial && userdata.tutorial.stage == 2) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You lost! Thats ok! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              userdata.save();
              return;
            }
          }, 1000);
        } else if (race[0].name == "crossrace") {
          let itemdb = require("../data/items.json");
          let findables = [];
          for (let ite in itemdb) {
            if (itemdb[ite].Findable == true) {
              findables.push(itemdb[ite]);
            }
          }
          let tracklength = 2500;
          let tracklength2 = 2500;
          await i.update({ content: "Please wait...", components: [] });
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 350;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;
          let commonmaps;
          let raremaps;
          let legendarymaps;
          let itemfound;
          let itemsucc = lodash.random(5);

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 140
            );
            commonmaps = 1;
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 160
            );

            commonmaps = 2;
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 180
            );
            raremaps = 1;
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 200
            );
            raremaps = 2;
          } else if (bot == 5) {
            itemfound = lodash.sample(findables);
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 210
            );
            legendarymaps = 1;
          } else if (bot == 6) {
            itemfound = lodash.sample(findables);
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 220
            );
            legendarymaps = 2;
          } else if (bot == 7) {
            itemfound = lodash.sample(findables);
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 250
            );
            legendarymaps = 3;
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          console.log(weather2);

          let slipchance = weather2.Slip;
          let speedreduce = weather2.SpeedReduce;
          let mph;
          if (speedreduce > 0) {
            mph = selected.Speed -= speedreduce;
          } else {
            mph = selected.Speed;
          }
          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling / weather2.Grip;

          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          if (speedreduce > 0) {
            mph2 = car2.Speed -= speedreduce;
          } else {
            mph2 = car2.Speed;
          }
          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling / weather2.Grip;
          if (slipchance > 0) {
            let slip = randomRange(1, slipchance);
            if (slip >= 2) {
              mph -= 10;
            }
          }
          let speed = 0;
          let speed2 = 0;

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Cross Country Race ${weather2.Emote}`)

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
            .setImage(carimage)
            .setThumbnail(car2.Image);

          await i.editReply({
            content: "",
            embeds: [embed],
            components: [],
            fetchReply: true,
          });

          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          handling = handling / 100;
          handling2 = handling2 / 100;
          let i2 = setInterval(async () => {
            if (speed2 > mph2) {
              speed2 = mph2;
            }
            if (speed > mph) {
              speed = mph;
            }
            let newspeed = speed / 5;
            handling = handling / 50;
            handling2 = handling2 / 50;
            let newspeed2 = speed2 / 5;

            let formula = (newspeed += handling += weight / 100);

            console.log(formula);
            // car 2

            let formula2 = (newspeed2 += handling2 += weight2 / 100);
            tracklength -= formula;
            tracklength2 -= formula2;

            console.log(tracklength);

            if (tracklength <= 0) {
              clearInterval(i2);

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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }
              if (commonmaps && commonmaps > 0) {
                earnings.push(`${emotes.barnMapCommon} +${commonmaps}`);
                userdata.cmaps += commonmaps;
              }
              if (raremaps && raremaps > 0) {
                earnings.push(`${emotes.barnMapRare} +${raremaps}`);
                userdata.rmaps += raremaps;
              }
              if (legendarymaps && legendarymaps > 0) {
                earnings.push(`${emotes.barnMapLegendary} +${legendarymaps}`);
                userdata.lmaps += legendarymaps;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              if (itemfound !== undefined) {
                if (itemsucc == 3) {
                  userdata.items.push(itemfound.Name.toLowerCase());
                  earnings.push(`${itemfound.Emote} +1 ${itemfound.Name}`);
                }
              }

              let raceranks = 1;

              let using = userdata.using;
              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  interaction.channel.send("Your radio battery ran out.");
                } else {
                  raceranks = raceranks * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                }
              }

              if (usinginv.includes("flat tire")) {
                let cooldown = cooldowndata.flattire;
                let timeout = 1800000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("flat tire");
                  userdata.update();
                  interaction.channel.send("Your flat tire ran out! :(");
                } else {
                  cashwon = cashwon += cashwon * 0.05;
                }
              }
              let itemeffects = userdata.itemeffects || [];
              let itemeffectsfilter = itemeffects.filter(
                (item) => item.item == "tequila shot"
              );
              if (itemeffectsfilter[0]) {
                let cooldown = cooldowndata.tequilla;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("tequila shot");
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
                } else {
                  if (itemeffectsfilter[0].earning == "bad") {
                    earnings.push("You lost $500K!");
                    let usercash = userdata.cash;
                    if ((usercash -= 500000) < 0) {
                      userdata.cash = 0;
                    } else {
                      userdata.cash -= 500000;
                    }
                  } else if (itemeffectsfilter[0].earning == "good") {
                    cashwon = cashwon * 5;
                  }
                }
              }

              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                } else {
                  raceranks = 2;
                }
              }
              if (usinginv.includes("energy drink")) {
                let cooldown = cooldowndata.energydrink;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  console.log("pulled");
                  userdata.using.pull("energy drink");
                  userdata.update();
                  interaction.channel.send("Your energy drink ran out! :(");
                } else {
                  rpwon = rpwon * 2;
                }
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;

              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(
                `Tier ${bot} Cross Country Race won! ${weather2.Emote}`
              );

              if (userdata.tutorial && userdata.tutorial.stage == 2) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You won! Thats great! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (tracklength2 <= 0) {
              clearInterval(i2);

              userdata.cash += cashlost;
              embed.setTitle(
                `Tier ${bot} Cross Country Race lost! ${weather2.Emote}`
              );
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed] });
              if (userdata.tutorial && userdata.tutorial.stage == 2) {
                userdata.parts.push("t1exhaust");
                interaction.channel.send(
                  `You lost! Thats ok! To give you a head start, I've given you a T1Exhaust, now use the \`/upgrade\` command to upgrade your car, and input your cars ID followed by **t1exhaust** to equip the exhaust!`
                );
                interaction.channel.send(
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY5NzBhMzBjYzcxYTdhZDUzZWE5MWI3MmM2ZjliMzI3ZDFiOGJhYSZjdD1n/xvZXwzhNYtfUqjvDnb/giphy.gif"
                );
                userdata.tutorial.stage += 1;
                userdata.markModified("tutorial");
              }
              userdata.save();
            }
          }, 1000);
        }
      }
    });
  },
};
