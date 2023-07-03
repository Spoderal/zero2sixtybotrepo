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
const Globals = require("../schema/global-schema");
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
    ),

  // async autocomplete(interaction, client) {
  //   let userdata2 = await User.findOne({ id: interaction.user.id });
  //   let focusedValue = interaction.options.getFocused();
  //   let choices = userdata2.cars;
  //   let filtered = choices.filter((choice) =>
  //     choice.Name.toLowerCase().includes(focusedValue.toLowerCase())
  //   );
  //   let options;
  //   filtered = userdata2.cars;
  //   let filteredarr = [];
  //   for (let ca in filtered) {
  //     let carind = filtered[ca];
  //     filteredarr.push(carind.Name);
  //   }
  //   if (filteredarr.length > 25) {
  //     options = filteredarr.slice(0, 25);
  //   } else {
  //     options = filteredarr;
  //   }

  //   options = options.filter((option) =>
  //     option.toLowerCase().includes(focusedValue.toLowerCase())
  //   );

  //   await interaction.respond(
  //     options.map((choice) => ({ name: choice, value: choice.toLowerCase() }))
  //   );
  // },

  async execute(interaction) {
    let user = interaction.user;
    let carsarray = [];

    for (let car1 in cardb.Cars) {
      let caroj = cardb.Cars[car1];
      carsarray.push(caroj);
    }
    let userdata = await User.findOne({ id: user.id });
    let prestigerank = userdata.prestige || 0;
    let bountyuser = userdata.bounty || 0;
    console.log(prestigerank);
    let bonus = prestigerank * 0.05;
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
    let bountytimeout = 3600000;
    if (
      cooldowndata.bounty !== null &&
      bountytimeout - (Date.now() - cooldowndata.bounty) > 0
    ) {
      interaction.channel.send("Your bounty reset, it resets every **1 hour**");
      cooldowndata.bounty = 0;
      userdata.bounty = 0;
      userdata.update();
    } else {
      console.log("bounty");
    }
    let usercars = userdata.cars;
    let idtoselect = interaction.options.getString("car").toLowerCase();

    console.log(idtoselect);
    let carsfiltered = [];
    for (let cr in userdata.cars) {
      let car = userdata.cars[cr];

      if (car.ID) {
        carsfiltered.push(car);
      }
    }

    let filteredcar = carsfiltered.filter(
      (car) => car.ID.toLowerCase() == idtoselect
    );

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

    if (selected.Impounded && selected.Impounded == true) {
      return interaction.reply(
        "This car is impounded! Use /impound to unimpound it."
      );
    }

    let canrace = 600000;
    if (
      userdata.canrace !== null &&
      canrace - (Date.now() - userdata.canrace) > 0
    ) {
      let time = ms(canrace - (Date.now() - userdata.canrace));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`You can race again in ${time}`);
      return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }
    cooldowndata.bounty = Date.now();
    let row2;
    let row0;
    if (userdata.police == false) {
      row2 = new ActionRowBuilder().addComponents(
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
      row0 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Car Series")
          .setEmoji("🚗")
          .setCustomId("carseries")
          .setStyle("Secondary")
      );
    } else if (userdata.police == true) {
      if (!cardb.Cars[selected.Name.toLowerCase()].Police)
        return interaction.reply("You need to use a police car!");
      row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Bounty Street Race")
          .setEmoji("<a:logo_police:1105267744896729169>")
          .setCustomId("police_streetrace")
          .setStyle("Secondary")
      );
      row0 = [];
    }
    let raceranks = 1;

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

    let nosrow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Use NOS")
        .setEmoji("<:nos:1112991188711116891>")
        .setCustomId("nos")
        .setStyle("Primary")
    );

    let carimage =
      selected.Image || cardb.Cars[selected.Name.toLowerCase()].Image;
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
      })
      .setImage("https://i.ibb.co/Xx6bPT9/zerocity-map.png");
    let msg;
    cooldowndata.racing = Date.now();
    cooldowndata.save();
    if (userdata.police == false) {
      msg = await interaction.reply({
        embeds: [embed],
        components: [row2, row0],
        fetchReply: true,
      });
    } else if (userdata.police == true) {
      msg = await interaction.reply({
        embeds: [embed],
        components: [row2],
        fetchReply: true,
      });
    }

    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 20000,
    });
    let race;
    let races = [
      "streetrace",
      "highwayrace",
      "halfmile",
      "quartermile",
      "crossrace",
      "police_streetrace",
      "carseries",
    ];
    collector.on("collect", async (i) => {
      let tierrow2 = new ActionRowBuilder().addComponents(
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
      let tierrow3 = new ActionRowBuilder();

      console.log(i.customId);
      if (races.includes(i.customId)) {
        race = racedb.filter((r) => r.name == i.customId);
        let deftier = 1;

        let reward = race[0].reward;
        let rewardsarr = [];
        if (userdata.police == false) {
          for (deftier; deftier <= race[0].tiers; deftier++) {
            let am = deftier * reward;
            let rank = deftier * race[0].ranks;
            rewardsarr.push(
              `Tier ${deftier} Reward: ${toCurrency(am)} **Ranks: ${rank}**`
            );
          }
          embed.setTitle("Select a tier to race in (Difficulty)");
        } else if (userdata.police == true) {
          for (deftier; deftier <= race[0].tiers; deftier++) {
            let am = deftier * reward;
            rewardsarr.push(`Tier ${deftier} Reward: ${emotes.bounty} ${am}`);
          }
          embed.setTitle("Select a tier to patrol in (Difficulty)");
        }
        embed.setDescription(
          `${toCurrency(
            bountyuser * 0.1
          )} bonus cash from bounty\n${bonus}x bonus cash from prestige\n\n${rewardsarr.join(
            "\n"
          )}`
        );

        console.log(race);

        if (race[0].tiers >= 8) {
          tierrow3.addComponents(
            new ButtonBuilder()
              .setLabel("Tier 8")
              .setEmoji("<:logo_t8:1118019024501092415>")
              .setCustomId("8")
              .setStyle("Secondary")
          );
        }
        if (race[0].tiers >= 9) {
          tierrow3.addComponents(
            new ButtonBuilder()
              .setLabel("Tier 9")
              .setEmoji("<:logo_t9:1118019026057187368>")
              .setCustomId("9")
              .setStyle("Secondary")
          );
        }
        if (race[0].tiers >= 10) {
          tierrow3.addComponents(
            new ButtonBuilder()
              .setLabel("Tier X")
              .setEmoji("<:logo_tx:1118019022655602769>")
              .setCustomId("10")
              .setStyle("Secondary")
          );
        }
        let components = [tierrow, tierrow2];

        if (race[0].tiers >= 8) {
          components.push(tierrow3);
        }
        await i.update({
          embeds: [embed],
          components: components,
          fetchReply: true,
        });
      } else if (
        i.customId == 1 ||
        i.customId == 2 ||
        i.customId == 3 ||
        i.customId == 4 ||
        i.customId == 5 ||
        i.customId == 6 ||
        i.customId == 7 ||
        i.customId == 8 ||
        i.customId == 9 ||
        i.customId == 10 ||
        i.customId == "flamehouse" ||
        i.customId == "xsquad" ||
        i.customId == "thews" ||
        i.customId == "musclebrains" ||
        i.customId == "coolcobras" ||
        i.customId == "snowysagera"
      ) {
        console.log("test");
        if (race[0].name == "streetrace") {
          cooldowndata.is_racing = Date.now();
          cooldowndata.save();

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
          let cashwon = parseInt(bot) * 50;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 25;
          let race2 = racedb.filter((r) => r.name == "streetrace");
          let rankswon = parseInt(bot) * race2[0].ranks;
          let notowon = 0;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 150
            );
            notowon = 25;
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 250
            );
            notowon = 50;
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 300
            );
            notowon = 100;
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 400
            );
            notowon = 150;
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 500
            );
            notowon = 200;
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 600
            );
            notowon = 250;
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 700
            );
            notowon = 350;
          } else if (bot == 8) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 750
            );
            notowon = 350;
          } else if (bot == 9) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 800
            );
            notowon = 350;
          } else if (bot == 10) {
            car2 = carsarray.filter((car) => car.Speed >= 900);
            notowon = 350;
          }
          car2 = lodash.sample(car2);

          let craterare = randomRange(1, 50);

          let crateearned;

          if (craterare < 6) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

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

          let speed = selected.Speed;
          let speed2 = car2.Speed;

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
            fetchReply: true,
          });

          let weightscore = Math.floor(weight / 100);
          let weightscore2 = Math.floor(weight2 / 100);
          speed = speed * 100;
          speed2 = speed2 * 100;
          let player = (handling + speed - weightscore) / acceleration;
          console.log(player);
          let opponent = (handling2 + speed2 - weightscore2) / acceleration2;

          console.log(opponent);
          let winner;
          const dorace = () => {
            const playerRegression = player;
            const opponentRegression = opponent;
            winner =
              playerRegression >= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          dorace();

          setTimeout(async () => {
            console.log(winner);
            if (winner == "Player") {
              let earnings = [];

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                if (usinginv.includes("pet treats")) {
                  let cooldown = cooldowndata.pettreats;
                  let timeout = 600000;
                  console.log(timeout - (Date.now() - cooldown));
                  if (
                    cooldown !== null &&
                    timeout - (Date.now() - cooldown) > 0
                  ) {
                    console.log("there");
                    xessneceearn = pet.xessence;
                  } else {
                    console.log("pulled");
                    userdata.using.pull("pet treats");
                    pet.xessence = petdb[pet.pet].Xessence;
                    userdata.update();

                    cooldowndata.pettreats = 0;
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
                    timeout - (Date.now() - cooldown) > 0
                  ) {
                    console.log("pulled");
                    userdata.using.pull("pet collar");
                    userdata.update();
                    cooldowndata.petcollar = 0;
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

              if (usinginv.includes("flat tire")) {
                let cooldown = cooldowndata.flattire;
                let timeout = 1800000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  cashwon = cashwon += cashwon * 0.05;
                } else {
                  console.log("pulled");
                  userdata.using.pull("flat tire");
                  userdata.update();
                  cooldowndata.flattire = 0;
                  interaction.channel.send("Your flat tire ran out! :(");
                }
              }
              let itemeffects = userdata.itemeffects || [];

              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                }
              }
              if (usinginv.includes("energy drink")) {
                let cooldown = cooldowndata.energydrink;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("energy drink");
                  userdata.update();
                  cooldowndata.energydrink = 0;
                  interaction.channel.send("Your energy drink ran out! :(");
                }
              }

              if (bonus > 0) {
                cashwon = cashwon += cashwon * bonus;
              }
              if (bountyuser > 0) {
                cashwon = cashwon += bountyuser * 0.1;
              }

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 2),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );

              userdata.racerank += rankswon;
              earnings.push(`${emotes.notoriety} ${notowon} Notoriety`);
              userdata.cash += cashwon;
              userdata.notoriety += notowon;
              userdata.bounty += 1;
              userdata.car_racing = selected;
              userdata.rp4 += rpwon;
              userdata.worldwins += 1;
              await cooldowndata.save();
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
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (winner == "Opponent") {
              let iszero = (userdata.cash -= cashlost);
              if (iszero < 0) {
                userdata.cash = 0;
              } else {
                userdata.cash -= cashlost;
              }
              embed.setTitle(`Tier ${bot} Street Race lost!`);
              embed.setDescription(`${emotes.cash} -${toCurrency(cashlost)}`);

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

              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 2),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );
              userdata.cash -= cashlost;
              userdata.save();
            }
          }, 5000);
        } else if (race[0].name == "highwayrace") {
          cooldowndata.is_racing = Date.now();
          cooldowndata.save();
          let tracklength = 1000;
          let tracklength2 = 1000;
          await i.update({ content: "Please wait...", components: [] });
          console.log("street");
          console.log("race");
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 75;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;
          let lockpicks = parseInt(bot) * 1;
          let wheelspins = 1;
          let race2 = racedb.filter((r) => r.name == "highwayrace");
          let rankswon = parseInt(bot) * race2[0].ranks;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 150
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 250
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 300
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed >= 400
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed >= 500
            );
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed >= 600
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed >= 700
            );
          } else if (bot == 8) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 750
            );
          } else if (bot == 9) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 800
            );
          } else if (bot == 10) {
            car2 = carsarray.filter((car) => car.Speed >= 900);
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 50);

          let crateearned;

          if (craterare < 6) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

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

          let weightscore = Math.floor(weight / 100);
          let weightscore2 = Math.floor(weight2 / 100);

          let player = (handling + speed - weightscore) / acceleration;
          console.log(player);
          let opponent = (handling2 + speed2 - weightscore2) / acceleration2;
          console.log(opponent);

          let winner;
          const dorace = () => {
            const playerRegression = player;
            const opponentRegression = opponent;
            winner =
              playerRegression >= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          dorace();

          setTimeout(async () => {
            if (winner == "Player") {
              let earnings = [];

              let wheelrandom = randomRange(1, 5);
              if (wheelrandom == 2) {
                userdata.wheelspins += wheelspins;
                earnings.push(`${emotes.wheelSpin} +${wheelspins}`);
              }
              let lockpickrandom = randomRange(1, 5);
              if (lockpickrandom == 2) {
                earnings.push(`${emotes.lockpicks} +1`);
                userdata.lockpicks += 1;
              }

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }

              let using = userdata.using;

              if (usinginv.includes("bubbles")) {
                let cooldown = cooldowndata.bubbles;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  cashwon = cashwon * 3;
                } else {
                  console.log("pulled");
                  userdata.using.pull("bubbles");
                  userdata.update();
                  cooldowndata.bubbles = 0;
                  interaction.channel.send("Your bubbles popped.");
                }
              }

              if (usinginv.includes("chips")) {
                let cooldown = cooldowndata.chips;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  let chip = userdata.chips;
                  let percent = chip * 0.1;
                  cashwon += cashwon * percent;
                } else {
                  console.log("pulled");
                  userdata.using.pull("chips");
                  userdata.update();
                  cooldowndata.chips = 0;
                  interaction.channel.send("You ran out of chips.");
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
                  cashwon = cashwon += cashwon * 0.05;
                } else {
                  console.log("pulled");
                  userdata.using.pull("flat tire");
                  userdata.update();
                  cooldowndata.flattire = 0;
                  interaction.channel.send("Your flat tire ran out! :(");
                }
              }
              let itemeffects = userdata.itemeffects || [];

              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                }
              }
              if (usinginv.includes("energy drink")) {
                let cooldown = cooldowndata.energydrink;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("energy drink");
                  userdata.update();
                  cooldowndata.energydrink = 0;
                  interaction.channel.send("Your energy drink ran out! :(");
                }
              }

              if (bonus > 0) {
                cashwon = cashwon += cashwon * bonus;
              }
              if (bountyuser > 0) {
                cashwon = cashwon += bountyuser * 0.1;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              userdata.racerank += rankswon;

              userdata.cash += cashwon;
              userdata.bounty += 1;
              userdata.rp4 += rpwon;

              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 5),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );
              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Highway Race won!`);
              await i.editReply({ embeds: [embed] });

              await i.editReply({ embeds: [embed] });
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
            else if (winner == "Opponent") {
              userdata.cash -= cashlost;
              let iszero = (userdata.cash -= cashlost);
              if (iszero < 0) {
                userdata.cash = 0;
              }
              embed.setTitle(`Tier ${bot} Highway Race lost!`);
              embed.setDescription(`${emotes.cash} -${toCurrency(cashlost)}`);
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
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 5),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );
              userdata.save();
            }
          }, 3000);
        } else if (race[0].name == "halfmile") {
          cooldowndata.is_racing = Date.now();
          cooldowndata.save();
          let tracklength = 800;
          let tracklength2 = 800;
          await i.update({ content: "Please wait...", components: [] });
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 60;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;

          let race2 = racedb.filter((r) => r.name == "halfmile");
          let rankswon = parseInt(bot) * race2[0].ranks;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 150
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 250
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 300
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 400
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 500
            );
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 600
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 700
            );
          } else if (bot == 8) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 750
            );
          } else if (bot == 9) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 800
            );
          } else if (bot == 10) {
            car2 = carsarray.filter((car) => car.Speed >= 900);
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 50);

          let crateearned;

          if (craterare < 6) {
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
            .setTitle(`Racing Tier ${bot} Half Mile Race`)

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

          let weightscore = Math.floor(weight / 100);
          let weightscore2 = Math.floor(weight2 / 100);

          let player = (handling + speed - weightscore) / acceleration;
          console.log(player);
          let opponent = (handling2 + speed2 - weightscore2) / acceleration2;

          console.log(opponent);
          let winner;
          const dorace = () => {
            const playerRegression = player;
            const opponentRegression = opponent;
            winner =
              playerRegression >= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          dorace();

          setTimeout(async () => {
            if (winner == "Player") {
              let earnings = [];

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }

              let using = userdata.using;

              if (usinginv.includes("bubbles")) {
                let cooldown = cooldowndata.bubbles;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  cashwon = cashwon * 3;
                } else {
                  console.log("pulled");
                  userdata.using.pull("bubbles");
                  userdata.update();
                  cooldowndata.bubbles = 0;
                  interaction.channel.send("Your bubbles popped.");
                }
              }

              if (usinginv.includes("chips")) {
                let cooldown = cooldowndata.chips;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  let chip = userdata.chips;
                  let percent = chip * 0.1;
                  cashwon += cashwon * percent;
                } else {
                  console.log("pulled");
                  userdata.using.pull("chips");
                  userdata.update();
                  cooldowndata.chips = 0;
                  interaction.channel.send("You ran out of chips.");
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
                  cashwon = cashwon += cashwon * 0.05;
                } else {
                  console.log("pulled");
                  userdata.using.pull("flat tire");
                  userdata.update();
                  cooldowndata.flattire = 0;
                  interaction.channel.send("Your flat tire ran out! :(");
                }
              }
              let itemeffects = userdata.itemeffects || [];

              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                }
              }
              if (usinginv.includes("energy drink")) {
                let cooldown = cooldowndata.energydrink;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("energy drink");
                  userdata.update();
                  cooldowndata.energydrink = 0;
                  interaction.channel.send("Your energy drink ran out! :(");
                }
              }
              if (bonus > 0) {
                cashwon = cashwon += cashwon * bonus;
              }
              if (bountyuser > 0) {
                cashwon = cashwon += bountyuser * 0.1;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);
              userdata.racerank += rankswon;

              userdata.cash += cashwon;
              userdata.bounty += 1;
              userdata.rp4 += rpwon;

              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Half Mile Race won!`);
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 0.5),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );

              await i.editReply({ embeds: [embed] });

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
            else if (winner == "Opponent") {
              userdata.cash -= cashlost;
              let iszero = (userdata.cash -= cashlost);
              if (iszero < 0) {
                userdata.cash = 0;
              }
              embed.setTitle(`Tier ${bot} Half Mile Race lost!`);
              embed.setDescription(`${emotes.cash} -${toCurrency(cashlost)}`);
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
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 0.5),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );
              userdata.save();
            }
          }, 3000);
        } else if (race[0].name == "quartermile") {
          cooldowndata.is_racing = Date.now();
          cooldowndata.save();
          let tracklength = 400;
          let tracklength2 = 400;
          await i.update({ content: "Please wait...", components: [] });
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 65;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;
          let race2 = racedb.filter((r) => r.name == "quartermile");
          let rankswon = parseInt(bot) * race2[0].ranks;
          let commonkeys;
          let rarekeys;
          let exotickeys;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 150
            );
            commonkeys = 1;
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 250
            );

            commonkeys = 1;
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 350
            );
            rarekeys = 1;
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 400
            );
            rarekeys = 1;
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 500
            );
            exotickeys = 1;
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 600
            );
            exotickeys = 1;
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 700
            );
            exotickeys = 1;
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 50);

          let crateearned;

          if (craterare < 6) {
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
            .setTitle(`Racing Tier ${bot} Quarter Mile Race`)

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

          let weightscore = Math.floor(weight / 100);
          let weightscore2 = Math.floor(weight2 / 100);

          let player = (handling + speed - weightscore) / acceleration;
          console.log(player);
          let opponent = (handling2 + speed2 - weightscore2) / acceleration2;

          console.log(opponent);
          let winner;
          const dorace = () => {
            const playerRegression = player;
            const opponentRegression = opponent;
            winner =
              playerRegression >= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          dorace();
          setTimeout(async () => {
            if (winner == "Player") {
              let earnings = [];

              let randomkey = randomRange(1, 5);
              if (randomkey == 2) {
                earnings.push(`${emotes.commonKey} +${commonkeys}`);
                userdata.ckeys += commonkeys;

                if (commonkeys && commonkeys > 0) {
                  if (usinginv.includes("milk")) {
                    let cooldown = cooldowndata.milk;
                    let timeout = 600000;
                    console.log(timeout - (Date.now() - cooldown));
                    if (
                      cooldown !== null &&
                      timeout - (Date.now() - cooldown) > 0
                    ) {
                      commonkeys = commonkeys * 2;
                    } else {
                      console.log("pulled");
                      userdata.using.pull("milk");
                      userdata.update();
                      interaction.channel.send("Your milk ran out.");
                    }
                  }
                }
                if (rarekeys && rarekeys > 0) {
                  if (usinginv.includes("strawberry milk")) {
                    let cooldown = cooldowndata.smilk;
                    let timeout = 600000;
                    console.log(timeout - (Date.now() - cooldown));
                    if (
                      cooldown !== null &&
                      timeout - (Date.now() - cooldown) > 0
                    ) {
                      rarekeys = rarekeys * 2;
                    } else {
                      console.log("pulled");
                      userdata.using.pull("milk");
                      userdata.update();
                      interaction.channel.send("Your strawberry milk ran out.");
                    }
                  }
                  earnings.push(`${emotes.rareKey} +${rarekeys}`);
                  userdata.rkeys += rarekeys;
                }
                if (exotickeys && exotickeys > 0) {
                  if (usinginv.includes("chocolate milk")) {
                    let cooldown = cooldowndata.cmilk;
                    let timeout = 600000;
                    console.log(timeout - (Date.now() - cooldown));
                    if (
                      cooldown !== null &&
                      timeout - (Date.now() - cooldown) > 0
                    ) {
                      exotickeys = exotickeys * 2;
                    } else {
                      console.log("pulled");
                      userdata.using.pull("milk");
                      userdata.update();
                      interaction.channel.send("Your chocolate milk ran out.");
                    }
                  }
                  earnings.push(`${emotes.exoticKey} +${exotickeys}`);
                  userdata.ekeys += exotickeys;
                }
              }
              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }

              if (usinginv.includes("bubbles")) {
                let cooldown = cooldowndata.bubbles;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  cashwon = cashwon * 3;
                } else {
                  console.log("pulled");
                  userdata.using.pull("bubbles");
                  userdata.update();
                  cooldowndata.bubbles = 0;
                  interaction.channel.send("Your bubbles popped.");
                }
              }

              if (usinginv.includes("chips")) {
                let cooldown = cooldowndata.chips;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  let chip = userdata.chips;
                  let percent = chip * 0.1;
                  cashwon += cashwon * percent;
                } else {
                  console.log("pulled");
                  userdata.using.pull("chips");
                  userdata.update();
                  cooldowndata.chips = 0;
                  interaction.channel.send("You ran out of chips.");
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
                  cashwon = cashwon += cashwon * 0.05;
                } else {
                  console.log("pulled");
                  userdata.using.pull("flat tire");
                  userdata.update();
                  cooldowndata.flattire = 0;
                  interaction.channel.send("Your flat tire ran out! :(");
                }
              }
              let itemeffects = userdata.itemeffects || [];

              if (usinginv.includes("fruit punch")) {
                let cooldown = cooldowndata.fruitpunch;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                }
              }
              if (usinginv.includes("energy drink")) {
                let cooldown = cooldowndata.energydrink;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("energy drink");
                  userdata.update();
                  cooldowndata.energydrink = 0;
                  interaction.channel.send("Your energy drink ran out! :(");
                }
              }
              if (bonus > 0) {
                cashwon = cashwon += cashwon * bonus;
              }
              if (bountyuser > 0) {
                cashwon = cashwon += bountyuser * 0.1;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);
              userdata.racerank += rankswon;

              userdata.cash += cashwon;
              userdata.bounty += 1;
              userdata.rp4 += rpwon;
              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Quarter Mile Race won!`);
              await i.editReply({ embeds: [embed] });

              await i.editReply({ embeds: [embed] });

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
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 0.25),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );

              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
              return;
            }
            // lost
            else if (winner == "Opponent") {
              userdata.cash -= cashlost;
              let iszero = (userdata.cash -= cashlost);
              if (iszero < 0) {
                userdata.cash = 0;
              }
              embed.setTitle(`Tier ${bot} Quarter Mile Race lost!`);
              embed.setDescription(`${emotes.cash} -${toCurrency(cashlost)}`);
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
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 0.25),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );
              userdata.save();
              return;
            }
          }, 3000);
        } else if (race[0].name == "carseries") {
          cooldowndata.is_racing = Date.now();
          cooldowndata.save();
          if (userdata.seriestickets <= 0)
            return interaction.reply("You need a series ticket to race!");
          let tracklength = 0;
          let tracklength2 = 0;
          await i.update({ content: "Please wait...", components: [] });
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;
          if (!cardb.Cars[selected.Name.toLowerCase()].Series)
            return interaction.channel.send("You need to use a series car!");

          let cashwon = parseInt(bot) * 1;
          let diamond = randomRange(1, 100);

          let diam = false;
          if (diamond <= 10) {
            diam = true;
          }
          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 150
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 250
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 300
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 400
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 500
            );
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 600
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 700
            );
          } else if (bot == 8) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 750
            );
          } else if (bot == 9) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 800
            );
          } else if (bot == 10) {
            car2 = carsarray.filter((car) => car.Speed >= 900);
          }
          car2 = lodash.sample(car2);

          console.log(car2);

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

          let mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling;
          //test
          let speed = 0;
          let speed2 = 0;
          userdata.seriestickets -= 1;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Car Series Race`)

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

          let weightscore = Math.floor(weight / 100);
          let weightscore2 = Math.floor(weight2 / 100);

          let player = (handling + speed - weightscore) / acceleration;
          console.log(player);
          let opponent = (handling2 + speed2 - weightscore2) / acceleration2;

          console.log(opponent);
          let winner;
          const dorace = () => {
            const playerRegression = player;
            const opponentRegression = opponent;
            winner =
              playerRegression >= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          dorace();
          setTimeout(async () => {
            if (winner == "Player") {
              let earnings = [];

              if (diam == true) {
                if (
                  selected.Name == "1980 Porsche 911" ||
                  selected.Name == "2018 Singer DLS"
                ) {
                  earnings.push(`+ <:part_txxecu:1113746120187846726> TXXECU`);
                  userdata.parts.push("txxecu");
                } else if (
                  selected.Name == "2018 BMW M4CS" ||
                  selected.Name == "2016 BMW M4 GTS"
                ) {
                  earnings.push(
                    `+ <:part_txxbrakes:1113959753119440956> TXXBrakes`
                  );
                  userdata.parts.push("txxbrakes");
                }
              }

              let randompart = randomRange(1, 5);

              if (randompart >= 3) {
                let randpart = lodash.sample([
                  "loan exhaust",
                  "loan turbo",
                  "loan intake",
                  "loan suspension",
                  "loan ecu",
                ]);
                earnings.push(
                  `+ ${partdb.Parts[randpart].Emote} ${partdb.Parts[randpart].Name}`
                );
                userdata.parts.push(randpart);
              }

              earnings.push(`+${cashwon} Wins`);
              userdata.racerank += raceranks;
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Wins": (selected.Wins += cashwon),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );
              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Car Series Race won!`);
              await i.editReply({ embeds: [embed] });

              await i.editReply({ embeds: [embed] });

              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 1),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );

              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
              return;
            }
            // lost
            else if (winner == "Opponent") {
              embed.setTitle(`Tier ${bot} Car Series Race lost!`);
              await i.editReply({ embeds: [embed] });

              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 1),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );
              userdata.save();
              return;
            }
          }, 3000);
        } else if (race[0].name == "crossrace") {
          cooldowndata.is_racing = Date.now();
          cooldowndata.save();
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

          let cashwon = parseInt(bot) * 75;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;

          let race2 = racedb.filter((r) => r.name == "crossrace");
          let rankswon = parseInt(bot) * race2[0].ranks;
          let commonmaps;
          let itemfound;
          let itemsucc = lodash.random(5);

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 150
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 200
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 350
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 400
            );
            commonmaps = 1;
          } else if (bot == 5) {
            itemfound = lodash.sample(findables);
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 500
            );
            commonmaps = 1;
          } else if (bot == 6) {
            itemfound = lodash.sample(findables);
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 600
            );
            commonmaps = 1;
          } else if (bot == 7) {
            itemfound = lodash.sample(findables);
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 700
            );
            commonmaps = 1;
          }
          car2 = lodash.sample(car2);

          console.log(car2);

          let craterare = randomRange(1, 50);

          let crateearned;

          if (craterare < 6) {
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
            .setTitle(`Racing Tier ${bot} Cross Country Race`)

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

          let weightscore = Math.floor(weight / 100);
          let weightscore2 = Math.floor(weight2 / 100);

          let player = (handling + speed - weightscore) / acceleration;
          console.log(player);
          let opponent = (handling2 + speed2 - weightscore2) / acceleration2;

          console.log(opponent);
          let winner;
          const dorace = () => {
            const playerRegression = player;
            const opponentRegression = opponent;
            winner =
              playerRegression >= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          dorace();
          setTimeout(async () => {
            if (winner == "Player") {
              let earnings = [];

              if (commonmaps && commonmaps > 0) {
                let randommap = randomRange(1, 5);
                if (randommap == 2) {
                  earnings.push(`${emotes.barnMapCommon} +${commonmaps}`);
                  userdata.barnmaps += commonmaps;
                }
              }

              if (bonus > 0) {
                cashwon = cashwon += cashwon * bonus;
              }
              if (bountyuser > 0) {
                cashwon = cashwon += bountyuser * 0.1;
              }

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

              let using = userdata.using;

              if (usinginv.includes("bubbles")) {
                let cooldown = cooldowndata.bubbles;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  cashwon = cashwon * 3;
                } else {
                  console.log("pulled");
                  userdata.using.pull("bubbles");
                  userdata.update();
                  cooldowndata.bubbles = 0;
                  interaction.channel.send("Your bubbles popped.");
                }
              }

              if (usinginv.includes("chips")) {
                let cooldown = cooldowndata.chips;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  let chip = userdata.chips;
                  let percent = chip * 0.1;
                  cashwon += cashwon * percent;
                } else {
                  console.log("pulled");
                  userdata.using.pull("chips");
                  userdata.update();
                  cooldowndata.chips = 0;
                  interaction.channel.send("You ran out of chips.");
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
                  cashwon = cashwon += cashwon * 0.05;
                } else {
                  console.log("pulled");
                  userdata.using.pull("flat tire");
                  userdata.update();
                  cooldowndata.flattire = 0;
                  interaction.channel.send("Your flat tire ran out! :(");
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
                  rankswon = rankswon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("fruit punch");
                  userdata.update();
                  interaction.channel.send("Your fruit punch ran out! :(");
                }
              }
              if (usinginv.includes("energy drink")) {
                let cooldown = cooldowndata.energydrink;
                let timeout = 600000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("energy drink");
                  userdata.update();
                  cooldowndata.energydrink = 0;
                  interaction.channel.send("Your energy drink ran out! :(");
                }
              }
              if (bonus > 0) {
                cashwon = cashwon += cashwon * bonus;
              }
              if (bountyuser > 0) {
                cashwon = cashwon += bountyuser * 0.1;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);
              userdata.racerank += rankswon;

              userdata.cash += cashwon;
              userdata.bounty += 1;
              userdata.rp4 += rpwon;

              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Cross Country Race won!`);
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 10),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );

              await i.editReply({ embeds: [embed] });

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
            else if (winner == "Opponent") {
              userdata.cash -= cashlost;
              let iszero = (userdata.cash -= cashlost);
              if (iszero < 0) {
                userdata.cash = 0;
              }
              embed.setTitle(`Tier ${bot} Cross Country Race lost!`);
              embed.setDescription(`${emotes.cash} -${toCurrency(cashlost)}`);
              await i.editReply({ embeds: [embed] });
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
              userdata.bounty += 1;
              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 10),
                  },
                },

                {
                  arrayFilters: [
                    {
                      "car.Name": selected.Name,
                    },
                  ],
                }
              );
              userdata.save();
            }
          }, 3000);
        } else if (race[0].name == "police_streetrace") {
          cooldowndata.is_racing = Date.now();
          cooldowndata.save();
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

          let cashwon = parseInt(bot) * 75;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 150
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 250
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 300
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 400
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 500
            );
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 600
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 700
            );
          } else if (bot == 8) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 750
            );
          } else if (bot == 9) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 800
            );
          } else if (bot == 10) {
            car2 = carsarray.filter((car) => car.Speed >= 900);
          }
          car2 = lodash.sample(car2);

          console.log(car2);

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
              clearInterval(i2);

              let earnings = [];

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                if (usinginv.includes("pet treats")) {
                  let cooldown = cooldowndata.pettreats;
                  let timeout = 600000;
                  console.log(timeout - (Date.now() - cooldown));
                  if (
                    cooldown !== null &&
                    timeout - (Date.now() - cooldown) > 0
                  ) {
                    xessneceearn = pet.xessence;
                  } else {
                    console.log("pulled");
                    userdata.using.pull("pet treats");
                    pet.xessence = petdb[pet.pet].Xessence;
                    userdata.update();

                    cooldowndata.pettreats = 0;
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
                    timeout - (Date.now() - cooldown) > 0
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

              if (bonus > 0) {
                cashwon = cashwon += cashwon * bonus;
              }

              earnings.push(`${emotes.bounty} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              let policeranks = 50;

              userdata.work.xp += policeranks;

              userdata.update();

              let jobdb = require("../data/jobs.json");
              let post = userdata.work;

              let positionfilter = jobdb.police.Positions.filter(
                (pos) => pos.name.toLowerCase() == post.position.toLowerCase()
              );
              let prevrank = positionfilter[0].rank;
              let nextrank = (prevrank += 1);
              let newpositionfilter = jobdb.police.Positions.filter(
                (pos) => pos.rank == nextrank
              );

              if (newpositionfilter[0] && post.xp >= newpositionfilter[0].xp) {
                interaction.channel.send(
                  `You've received a promotion! Your new salary is ${toCurrency(
                    newpositionfilter[0].salary
                  )}`
                );
                userdata.work.position = newpositionfilter[0].name;
                if (userdata.work.salary < newpositionfilter[0].salary) {
                  userdata.work.salary = newpositionfilter[0].salary;
                }
                userdata.work.xp = 0;

                userdata.markModified("work");
              }

              userdata.bounty += cashwon;

              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Busted!`);

              await i.editReply({ embeds: [embed] });

              clearInterval(i2);

              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (tracklength2 > tracklength && timer == 10) {
              userdata.bounty -= cashlost;
              userdata.update();
              if (userdata.bounty < 0) {
                userdata.bounty = 0;
              }
              embed.setTitle(`Tier ${bot} got away!`);
              embed.setDescription(`${emotes.bounty} -${toCurrency(cashlost)}`);

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
        }
      }
    });
  },
};
