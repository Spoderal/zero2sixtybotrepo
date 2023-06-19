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
    let bountytimeout = 86400000;
    if (
      cooldowndata.bounty !== null &&
      bountytimeout - (Date.now() - cooldowndata.bounty) > 0 &&
      userdata.bounty > 0
    ) {
      console.log("bounty");
    } else {
      interaction.channel.send(
        "Your bounty reset, it resets every **24 hours**"
      );
      cooldowndata.bounty = 0;
      userdata.bounty = 0;
      userdata.update();
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
          .setLabel("Muscle Drag (SEASON)")
          .setEmoji("💪")
          .setCustomId("muscledrag")
          .setStyle("Secondary"),

        new ButtonBuilder()
          .setLabel("Car Series")
          .setEmoji("🚗")
          .setCustomId("carseries")
          .setStyle("Secondary"),

        new ButtonBuilder()
          .setLabel("Le Mans (EVENT)")
          .setEmoji("🏎️")
          .setCustomId("lemans")
          .setStyle("Secondary"),

        new ButtonBuilder()
          .setLabel("Track Race (EVENT)")
          .setEmoji("<:tracklegends:1072357967652995174>")
          .setCustomId("trackrace")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setLabel("Wet Warriors (EVENT)")
          .setEmoji("🌧️")
          .setCustomId("wetrace")
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
    cooldowndata.racing = Date.now();
    cooldowndata.save();
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
      time: 60000,
    });
    let race;
    let races = [
      "streetrace",
      "highwayrace",
      "halfmile",
      "quartermile",
      "muscledrag",
      "crossrace",
      "lemans",
      "police_streetrace",
      "carseries",
      "trackrace",
      "wetrace",
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
            bountyuser
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
          let cashlost = parseInt(bot) * 50;
          let race2 = racedb.filter((r) => r.name == "streetrace");
          let rankswon = parseInt(bot) * race2[0].ranks;
          let notowon = 0;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed < 135
            );
            notowon = 25;
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 155
            );
            notowon = 50;
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 180
            );
            notowon = 100;
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 200
            );
            notowon = 150;
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 210
            );
            notowon = 200;
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 220
            );
            notowon = 250;
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 250
            );
            notowon = 350;
          } else if (bot == 8) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 260
            );
            notowon = 350;
          } else if (bot == 9) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 270
            );
            notowon = 350;
          } else if (bot == 10) {
            car2 = carsarray.filter((car) => car.Speed >= 270);
            notowon = 350;
          }
          car2 = lodash.sample(car2);

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
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
            fetchReply: true,
          });

          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          class ICar {
            constructor(speed, accel, handling, weight) {
              this.speed = speed;
              this.accel = accel;
              this.handling = handling;
              this.weight = weight;
            }
          }

          let formula = function (speed, accel, handling, weight) {
            const target = new ICar(speed, accel, handling, weight);
            return (car) => {
              let speedDifference = target.speed - car.speed;
              let handlingPerSpeed = target.handling / target.speed;
              let handling = (car.handling += speedDifference) * handlingPerSpeed;

              let weightDifference = target.weight - car.weight;
              let accelPerWeight = target.accel / target.weight;
              let accel = (car.accel -= weightDifference) * accelPerWeight;

              let targetRegression = target.handling / target.accel;
              let regression = Math.abs((targetRegression -= handling) / accel);
              console.log(targetRegression)
              return Math.round(regression * 100) / 100;
            };
          };

          const drag = formula(400, 2.0, 1000, 2000)
          const track = formula(250, 2.0, 500, 3000)
          const drift = formula(150, 4.0, 2300, 3700);

          let player = new ICar(speed, acceleration, handling, weight);
          let opponent = new ICar(speed2, acceleration2, handling2, weight2);
          console.log(player);
          console.log(opponent);
          let winner;
          const dorace = (f) => {
            const playerRegression = f(player);
            const opponentRegression = f(opponent);
            winner =
              playerRegression <= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          console.log("Track Race:\n", dorace(track));

          dorace(track);

          setTimeout(async () => {
            if (winner == "Player") {
              let earnings = [];

              let filteredhouse = userdata.houses.filter(
                (house) => house.Name == "Buone Vedute"
              );

              let filteredhouse2 = userdata.houses.filter(
                (house) => house.Name == "Casa Della Pace"
              );

              let filteredhouse3 = userdata.houses.filter(
                (house) => house.Name == "Casa Sul Lago"
              );

              let filteredhouse4 = userdata.houses.filter(
                (house) => house.Name == "Villa Sull Acqua"
              );

              if (userdata.houses && filteredhouse[0]) {
                cashwon = cashwon += cashwon * 0.05;
              }
              if (userdata.houses && filteredhouse2[0]) {
                rpwon = rpwon * 2;
              }
              if (userdata.houses && filteredhouse3[0]) {
                notowon = notowon * 2;
              }

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

                if (userdata.houses && filteredhouse4[0]) {
                  xessneceearn = xessneceearn * 2;
                }

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

              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  cooldowndata.radio = 0;
                  interaction.channel.send("Your radio battery ran out.");
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
                } else {
                  console.log("pulled");
                  userdata.itemeffects.pull(itemeffectsfilter[0]);
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
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
                cashwon = cashwon += bountyuser;
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
              userdata.bounty += 5;
              userdata.car_racing = selected;
              userdata.rp4 += rpwon;
              userdata.worldwins += 1;
              cooldowndata.is_racing = true;
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
              userdata.cash -= cashlost;
              let iszero = (userdata.cash -= cashlost);
              if (iszero < 0) {
                userdata.cash = 0;
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
        } else if (race[0].name == "trackrace") {
          let tracklength = 0;
          let tracklength2 = 0;
          if (selected.Speed > 350)
            return await i.update(
              "Your car is too fast so you swerve and crash! Make sure its under 350 Power!"
            );
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

          let race2 = racedb.filter((r) => r.name == "trackrace");
          let rankswon = parseInt(bot) * race2[0].ranks;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Speed >= 140 && car.Speed <= 160 && car.Track
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Speed >= 150 && car.Speed <= 170 && car.Track
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Speed >= 170 && car.Speed <= 180 && car.Track
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Speed >= 170 && car.Speed <= 180 && car.Track
            );
          } else if (bot == 5) {
            car2 = carsarray.filter((car) => car.Speed >= 180 && car.Track);
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Speed >= 190 && car.Speed <= 215 && car.Track
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Speed > 190 && car.Speed < 250 && car.Track
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
          let rowbrake;
          if (selected.Brakes) {
            rowbrake = new ActionRowBuilder().setComponents(
              new ButtonBuilder()
                .setLabel("Brake")
                .setEmoji(
                  `${partdb.Parts[selected.Brakes.toLowerCase()].Emote}`
                )
                .setCustomId("brake")
                .setStyle("Secondary")
            );
          }
          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Track Race`)

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

          if (selected.Brakes) {
            await i.editReply({
              content: "",
              embeds: [embed],
              components: [rowbrake],
              fetchReply: true,
            });
          } else {
            await i.editReply({
              content: "",
              embeds: [embed],
              fetchReply: true,
            });
          }

          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          let braketime = randomRange(1000, 5000);

          let filter = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };
          let collec = msg.createMessageComponentCollector({
            filter: filter,
            time: 10000,
          });

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
            handling = handling / 50;
            handling2 = handling2 / 50;
            speed2 / 6;

            let formula = (speed += handling += weight / 100);
            let braked = false;
            collec.on("collect", async (i) => {
              if (i.customId == "brake" && braked == false) {
                if (timer * 1000 > braketime) {
                  let score =
                    partdb.Parts[selected.Brakes.toLowerCase()].Tier * 100;
                  formula += score;
                }
                braked = true;

                interaction.editReply({ components: [] });
              }
            });

            console.log(formula);

            // car 2

            let formula2 = (speed2 += handling2 += weight2 / 100);
            console.log(formula2);
            formula2 += 3;

            tracklength += formula;
            tracklength2 += formula2;

            if (timer == 9) {
              if (braked == false) {
                formula -= 500;
              }
            }

            console.log(`track ${tracklength}`);
            console.log(`track2 ${tracklength2}`);

            if (tracklength > tracklength2 && timer == 10) {
              let earnings = [];
              let carrandom = randomRange(1, 100);

              if (carrandom < 20) {
                earnings.push("Car earned!");
                let newcarobj = {
                  ID: car2.alias,
                  Name: car2.Name,
                  Speed: car2.Speed,
                  Acceleration: car2["0-60"],
                  Handling: car2.Handling,
                  Parts: [],
                  Emote: car2.Emote,
                  Image: car2.Image,
                  Miles: 0,
                  Resale: 0,
                  WeightStat: car2.Weight,
                };
                userdata.cars.push(newcarobj);
              }

              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  cooldowndata.radio = 0;
                  interaction.channel.send("Your radio battery ran out.");
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
                } else {
                  console.log("pulled");
                  userdata.itemeffects.pull(itemeffectsfilter[0]);
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
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
                cashwon = cashwon += bountyuser;
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
              userdata.cash += cashwon;
              userdata.bounty += 5;
              userdata.car_racing = selected;
              userdata.rp4 += rpwon;
              userdata.worldwins += 1;
              cooldowndata.is_racing = true;
              await cooldowndata.save();

              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Track Race won!`);

              await i.editReply({ embeds: [embed] });

              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }

            // lost
            else if (tracklength2 > tracklength && timer == 10) {
              userdata.cash -= cashlost;
              embed.setTitle(`Tier ${bot} Track Race lost!`);
              embed.setDescription(
                `${emotes.cash} -${toCurrency(
                  cashlost
                )}\n\nYour car is impounded!`
              );

              await i.editReply({ embeds: [embed] });

              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 2),
                    "cars.$[car].Impounded": true,
                    "cars.$[car].ImpoundTime": Date.now(),
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
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "wetrace") {
          let tracklength = 0;
          let tracklength2 = 0;
          if (selected.Speed > 350)
            return await i.update(
              "Your car is too fast so you swerve and crash! Make sure its under 350 Power!"
            );
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

          let race2 = racedb.filter((r) => r.name == "wetrace");
          let rankswon = parseInt(bot) * race2[0].ranks;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Speed >= 140 && car.Speed <= 160 && car.Track
            );
          } else if (bot == 2) {
            car2 = carsarray.filter(
              (car) => car.Speed >= 150 && car.Speed <= 170 && car.Track
            );
          } else if (bot == 3) {
            car2 = carsarray.filter(
              (car) => car.Speed >= 170 && car.Speed <= 180 && car.Track
            );
          } else if (bot == 4) {
            car2 = carsarray.filter(
              (car) => car.Speed >= 170 && car.Speed <= 180 && car.Track
            );
          } else if (bot == 5) {
            car2 = carsarray.filter((car) => car.Speed >= 180 && car.Track);
          } else if (bot == 6) {
            car2 = carsarray.filter(
              (car) => car.Speed >= 190 && car.Speed <= 215 && car.Track
            );
          } else if (bot == 7) {
            car2 = carsarray.filter(
              (car) => car.Speed > 190 && car.Speed < 250 && car.Track
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
          let rowbrake;

          rowbrake = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setLabel("Trophy Appeared!")
              .setEmoji(`<:trophy_rain:1118814812785365023>`)
              .setCustomId("trophy")
              .setStyle("Secondary")
          );

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Wet Warriors`)

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
          let rand = [1000, 2000, 3000, 4000, 5000];
          let randtime = lodash.sample(rand);
          setTimeout(async () => {
            await i.editReply({
              fetchReply: true,
              components: [rowbrake],
            });
          }, randtime);

          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;

          let braketime = randomRange(1000, 5000);

          let filter = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };
          let collec = msg.createMessageComponentCollector({
            filter: filter,
            time: 15000,
          });

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
            handling = handling / 50;
            handling2 = handling2 / 50;
            speed2 / 6;

            let formula = (speed += handling += weight / 100);
            let trophy = false;
            collec.on("collect", async (i) => {
              if (i.customId == "trophy" && trophy == false) {
                userdata.raintrophy += 1;
                trophy = true;
                interaction.editReply({ components: [] });
              }
            });

            console.log(formula);

            // car 2

            let formula2 = (speed2 += handling2 += weight2 / 100);
            console.log(formula2);
            formula2 += 3;

            tracklength += formula;
            tracklength2 += formula2;

            console.log(`track ${tracklength}`);
            console.log(`track2 ${tracklength2}`);

            if (tracklength > tracklength2 && timer == 15) {
              let earnings = [];

              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  cooldowndata.radio = 0;
                  interaction.channel.send("Your radio battery ran out.");
                }
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
                  cooldowndata.radio = 0;
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
                } else {
                  console.log("pulled");
                  userdata.itemeffects.pull(itemeffectsfilter[0]);
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
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
                cashwon = cashwon += bountyuser;
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
              userdata.cash += cashwon;
              userdata.bounty += 5;
              userdata.car_racing = selected;
              userdata.rp4 += rpwon;
              userdata.worldwins += 1;
              cooldowndata.is_racing = true;
              await cooldowndata.save();

              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Track Race won!`);

              await i.editReply({ embeds: [embed] });

              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }

            // lost
            else if (tracklength2 > tracklength && timer == 15) {
              userdata.cash -= cashlost;
              embed.setTitle(`Tier ${bot} Track Race lost!`);
              embed.setDescription(
                `${emotes.cash} -${toCurrency(
                  cashlost
                )}\n\nYour car is impounded!`
              );

              await i.editReply({ embeds: [embed] });

              await User.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $set: {
                    "cars.$[car].Miles": (selected.Miles += 2),
                    "cars.$[car].Impounded": true,
                    "cars.$[car].ImpoundTime": Date.now(),
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
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "lemans") {
          let globals2 = await Globals.findOne();
          let isteam = cardb.Cars[selected.Name.toLowerCase()].Team;
          if (!isteam)
            return interaction.editReply("You need to use a le mans car!");

          let lemasncool = cooldowndata.lemans;
          let canrace = 43200000;
          if (userdata.using.includes("ice cube")) {
            canrace = canrace / 2;
          }

          if (lemasncool !== null && canrace - (Date.now() - lemasncool) > 0) {
            let time = ms(canrace - (Date.now() - lemasncool));
            let timeEmbed = new EmbedBuilder()
              .setColor(colors.blue)
              .setDescription(`You can do le mans again in ${time}`);
            return await interaction.editReply({
              embeds: [timeEmbed],
              fetchReply: true,
            });
          }

          cooldowndata.lemans = Date.now();
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
          let race2 = racedb.filter((r) => r.name == "trackrace");
          let rankswon = parseInt(bot) * race2[0].ranks;

          let keyswon = 0;
          if (bot == 1) {
            keyswon = 2;
            console.log("1");
            car2 = carsarray.filter(
              (car) => car.Class == "D" && car.Speed >= 170 && car.Team
            );
          } else if (bot == 2) {
            keyswon = 4;
            car2 = carsarray.filter(
              (car) => car.Class == "C" && car.Speed < 200 && car.Team
            );
          } else if (bot == 3) {
            keyswon = 5;
            car2 = carsarray.filter(
              (car) => car.Class == "B" && car.Speed < 210 && car.Team
            );
          } else if (bot == 4) {
            keyswon = 6;
            car2 = carsarray.filter(
              (car) => car.Class == "A" && car.Speed < 220 && car.Team
            );
          } else if (bot == 5) {
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 250 && car.Team
            );
          } else if (bot == 6) {
            keyswon = 7;
            car2 = carsarray.filter(
              (car) =>
                car.Class == "S" &&
                car.Speed < 250 &&
                car.Handling < 1500 &&
                car.Team
            );
          } else if (bot == 7) {
            keyswon = 8;
            car2 = carsarray.filter(
              (car) =>
                car.Class == "S" &&
                car.Speed < 250 &&
                car.Handling < 2000 &&
                car.Team
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
            .setTitle(`Racing Tier ${bot} Le Mans`)

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
            speed / 8;
            handling = handling / 10;
            handling2 = handling2 / 10;
            speed2 / 8;

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

              if (usinginv.includes("ice cube")) {
                userdata.using.pull("ice cube");
                userdata.eventCooldown = 43200000;
                userdata.update();
              }

              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  cooldowndata.radio = 0;
                  interaction.channel.send("Your radio battery ran out.");
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
                } else {
                  console.log("pulled");
                  userdata.itemeffects.pull(itemeffectsfilter[0]);
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
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
                cashwon = cashwon += bountyuser;
              }

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);
              earnings.push(`${emotes.lekey} +${keyswon}`);
              userdata.lekeys += keyswon;
              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }

              let isteam = cardb.Cars[selected.Name.toLowerCase()].Team;

              if (isteam !== null) {
                console.log(isteam);
                let wins = globals2.teams.filter((team) => team.name == isteam);
                console.log(wins);
                await Globals.findOneAndUpdate(
                  {},
                  {
                    $set: {
                      "teams.$[team].wins": (wins[0].wins += 1),
                    },
                  },
                  {
                    arrayFilters: [
                      {
                        "team.name": isteam,
                      },
                    ],
                  }
                );
              }

              globals2.save();

              userdata.racerank += rankswon;

              userdata.cash += cashwon;
              userdata.bounty += 5;
              userdata.rp4 += rpwon;
              userdata.worldwins += 1;
              cooldowndata.is_racing = true;
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
              embed.setTitle(`Tier ${bot} Le Mans won!`);

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
              embed.setTitle(`Tier ${bot} Le Mans lost!`);
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
          let race2 = racedb.filter((r) => r.name == "highwayrace");
          let rankswon = parseInt(bot) * race2[0].ranks;

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

          class ICar {
            constructor(speed, accel, handling, weight) {
              this.speed = speed;
              this.accel = accel;
              this.handling = handling;
              this.weight = weight;
            }
          }

          let formula = function (speed, accel, handling, weight) {
            const target = new ICar(speed, accel, handling, weight);
            return (car) => {
              let speedDifference = target.speed - car.speed;
              let handlingPerSpeed = target.handling / target.speed;
              let handling = (car.handling += speedDifference) * handlingPerSpeed;

              let weightDifference = target.weight - car.weight;
              let accelPerWeight = target.accel / target.weight;
              let accel = (car.accel -= weightDifference) * accelPerWeight;

              let targetRegression = target.handling / target.accel;
              let regression = Math.abs((targetRegression -= handling) / accel);
              console.log(targetRegression)
              return Math.round(regression * 100) / 100;
            };
          };

          const drag = formula(400, 2.0, 1000, 2000)
          const track = formula(250, 2.0, 500, 3000)
          const drift = formula(150, 4.0, 2300, 3700);

          let player = new ICar(speed, acceleration, handling, weight);
          let opponent = new ICar(speed2, acceleration2, handling2, weight2);

          let winner;
          const dorace = (f) => {
            const playerRegression = f(player);
            const opponentRegression = f(opponent);
            winner =
              playerRegression <= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          console.log("Track Race:\n", dorace(drag));

          dorace(drag);

          setTimeout(async () => {
            if (winner == "Player") {
              let earnings = [];
              let filteredhouse2 = userdata.houses.filter(
                (house) => house.Name == "Casa Della Pace"
              );
              let filteredhouse3 = userdata.houses.filter(
                (house) => house.Name == "Castello Verde"
              );

              if (userdata.houses && filteredhouse2[0]) {
                rpwon = rpwon * 2;
              }

              if (userdata.houses && filteredhouse3[0]) {
                cashwon = cashwon += cashwon * 0.1;
              }

              earnings.push(`${emotes.wheelSpin} +${wheelspins}`);
              earnings.push(`${emotes.lockpicks} +${lockpicks}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }

              let using = userdata.using;

              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  cooldowndata.radio = 0;
                  interaction.channel.send("Your radio battery ran out.");
                }
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
                  cooldowndata.radio = 0;
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
                } else {
                  console.log("pulled");
                  userdata.itemeffects.pull(itemeffectsfilter[0]);
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
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
              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              if (bonus > 0) {
                cashwon = cashwon += cashwon * bonus;
              }
              if (bountyuser > 0) {
                cashwon = cashwon += bountyuser;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              userdata.racerank += rankswon;

              userdata.cash += cashwon;
              userdata.bounty += 5;
              userdata.rp4 += rpwon;
              userdata.wheelspins += wheelspins;
              userdata.lockpicks += lockpicks;
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
          let tracklength = 800;
          let tracklength2 = 800;
          await i.update({ content: "Please wait...", components: [] });
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 250;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;

          let race2 = racedb.filter((r) => r.name == "halfmile");
          let rankswon = parseInt(bot) * race2[0].ranks;

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

          class ICar {
            constructor(speed, accel, handling, weight) {
              this.speed = speed;
              this.accel = accel;
              this.handling = handling;
              this.weight = weight;
            }
          }

          let formula = function (speed, accel, handling, weight) {
            const target = new ICar(speed, accel, handling, weight);
            return (car) => {
              let speedDifference = target.speed - car.speed;
              let handlingPerSpeed = target.handling / target.speed;
              let handling = (car.handling += speedDifference) * handlingPerSpeed;

              let weightDifference = target.weight - car.weight;
              let accelPerWeight = target.accel / target.weight;
              let accel = (car.accel -= weightDifference) * accelPerWeight;

              let targetRegression = target.handling / target.accel;
              let regression = Math.abs((targetRegression -= handling) / accel);
              console.log(targetRegression)
              return Math.round(regression * 100) / 100;
            };
          };

          const drag = formula(400, 2.0, 1000, 2000)
          const track = formula(250, 2.0, 500, 3000)
          const drift = formula(150, 4.0, 2300, 3700);

          let player = new ICar(speed, acceleration, handling, weight);
          let opponent = new ICar(speed2, acceleration2, handling2, weight2);

          let winner;
          const dorace = (f) => {
            const playerRegression = f(player);
            const opponentRegression = f(opponent);
            winner =
              playerRegression <= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          console.log("Track Race:\n", dorace(drag));

          dorace(drag);

          setTimeout(async () => {
            if (winner == "Player") {
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

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }

              let using = userdata.using;

              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  cooldowndata.radio = 0;
                  interaction.channel.send("Your radio battery ran out.");
                }
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
                  cooldowndata.radio = 0;
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
                } else {
                  console.log("pulled");
                  userdata.itemeffects.pull(itemeffectsfilter[0]);
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
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
                cashwon = cashwon += bountyuser;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);
              userdata.racerank += rankswon;

              userdata.cash += cashwon;
              userdata.bounty += 5;
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
          let tracklength = 400;
          let tracklength2 = 400;
          await i.update({ content: "Please wait...", components: [] });
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;

          let cashwon = parseInt(bot) * 200;
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

          class ICar {
            constructor(speed, accel, handling, weight) {
              this.speed = speed;
              this.accel = accel;
              this.handling = handling;
              this.weight = weight;
            }
          }

          let formula = function (speed, accel, handling, weight) {
            const target = new ICar(speed, accel, handling, weight);
            return (car) => {
              let speedDifference = target.speed - car.speed;
              let handlingPerSpeed = target.handling / target.speed;
              let handling = (car.handling += speedDifference) * handlingPerSpeed;

              let weightDifference = target.weight - car.weight;
              let accelPerWeight = target.accel / target.weight;
              let accel = (car.accel -= weightDifference) * accelPerWeight;

              let targetRegression = target.handling / target.accel;
              let regression = Math.abs((targetRegression -= handling) / accel);
              console.log(targetRegression)
              return Math.round(regression * 100) / 100;
            };
          };

          const drag = formula(400, 2.0, 1000, 2000)
          const track = formula(250, 2.0, 500, 3000)
          const drift = formula(150, 4.0, 2300, 3700);

          let player = new ICar(speed, acceleration, handling, weight);
          let opponent = new ICar(speed2, acceleration2, handling2, weight2);

          let winner;
          const dorace = (f) => {
            const playerRegression = f(player);
            const opponentRegression = f(opponent);
            winner =
              playerRegression <= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          console.log("Track Race:\n", dorace(drag));

          dorace(drag);
          setTimeout(async () => {
            if (winner == "Player") {
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
                earnings.push(`${emotes.commonKey} +${commonkeys}`);
                userdata.ckeys += commonkeys;
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

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }

              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  cooldowndata.radio = 0;
                  interaction.channel.send("Your radio battery ran out.");
                }
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
                  cooldowndata.radio = 0;
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
                } else {
                  console.log("pulled");
                  userdata.itemeffects.pull(itemeffectsfilter[0]);
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
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
                cashwon = cashwon += bountyuser;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);
              userdata.racerank += rankswon;

              userdata.cash += cashwon;
              userdata.bounty += 5;
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
        } else if (race[0].name == "muscledrag") {
          let tracklength = 400;
          let tracklength2 = 400;
          await i.update({ content: "Please wait...", components: [] });
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;
          if (!cardb.Cars[selected.Name.toLowerCase()].Muscle)
            return interaction.channel.send("You need to use a muscle car!");
          let cashwon = parseInt(bot) * 200;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;
          let race2 = racedb.filter((r) => r.name == "muscledrag");
          let rankswon = parseInt(bot) * race2[0].ranks;
          let commonkeys;
          let rarekeys;
          let exotickeys;

          let notowon = 0;

          if (bot == 1) {
            console.log("1");
            car2 = carsarray.filter((car) => car.Speed < 145 && car.Muscle);
            notowon = 50;
            commonkeys = 2;
          } else if (bot == 2) {
            car2 = carsarray.filter((car) => car.Speed < 160 && car.Muscle);

            notowon = 100;
            commonkeys = 5;
          } else if (bot == 3) {
            car2 = carsarray.filter((car) => car.Speed < 180 && car.Muscle);
            rarekeys = 2;
            notowon = 200;
          } else if (bot == 4) {
            car2 = carsarray.filter((car) => car.Speed < 190 && car.Muscle);
            rarekeys = 5;
            notowon = 250;
          } else if (bot == 5) {
            car2 = carsarray.filter((car) => car.Speed > 200 && car.Muscle);
            exotickeys = 2;
            notowon = 300;
            notowon = 500;
            exotickeys = 7;
          } else if (bot == 6) {
            car2 = carsarray.filter((car) => car.Speed > 200 && car.Muscle);
            exotickeys = 2;
            notowon = 300;
            notowon = 500;
            exotickeys = 7;
          } else if (bot == 7) {
            car2 = carsarray.filter((car) => car.Speed > 200 && car.Muscle);
            exotickeys = 2;
            notowon = 300;
            notowon = 500;
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
            .setTitle(`Racing Tier ${bot} Muscle Drag Race`)

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

          class ICar {
            constructor(speed, accel, handling, weight) {
              this.speed = speed;
              this.accel = accel;
              this.handling = handling;
              this.weight = weight;
            }
          }

          let formula = function (speed, accel, handling, weight) {
            const target = new ICar(speed, accel, handling, weight);
            return (car) => {
              let speedDifference = target.speed - car.speed;
              let handlingPerSpeed = target.handling / target.speed;
              let handling = (car.handling += speedDifference) * handlingPerSpeed;

              let weightDifference = target.weight - car.weight;
              let accelPerWeight = target.accel / target.weight;
              let accel = (car.accel -= weightDifference) * accelPerWeight;

              let targetRegression = target.handling / target.accel;
              let regression = Math.abs((targetRegression -= handling) / accel);
              console.log(targetRegression)
              return Math.round(regression * 100) / 100;
            };
          };

          const drag = formula(400, 2.0, 1000, 2000)
          const track = formula(250, 2.0, 500, 3000)
          const drift = formula(150, 4.0, 2300, 3700);

          let player = new ICar(speed, acceleration, handling, weight);
          let opponent = new ICar(speed2, acceleration2, handling2, weight2);

          let winner;
          const dorace = (f) => {
            const playerRegression = f(player);
            const opponentRegression = f(opponent);
            winner =
              playerRegression <= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          console.log("Track Race:\n", dorace(drag));

          dorace(drag);
          setTimeout(async () => {
            if (winner == "Player") {
              let earnings = [];
              let filteredhouse = userdata.houses.filter(
                (house) => house.Name == "Buone Vedute"
              );
              let filteredhouse2 = userdata.houses.filter(
                (house) => house.Name == "Casa Della Pace"
              );
              let filteredhouse3 = userdata.houses.filter(
                (house) => house.Name == "Casa Sul Lago"
              );
              if (userdata.houses && filteredhouse[0]) {
                cashwon = cashwon += cashwon * 0.05;
              }
              if (userdata.houses && filteredhouse2[0]) {
                rpwon = rpwon * 2;
              }
              if (userdata.houses && filteredhouse3[0]) {
                notowon = notowon * 2;
              }

              if (commonkeys && commonkeys > 0) {
                if (usinginv.includes("milk")) {
                  let cooldown = cooldowndata.milk;
                  let timeout = 600000;
                  console.log(timeout - (Date.now() - cooldown));
                  if (
                    cooldown !== null &&
                    timeout - (Date.now() - cooldown) > 0
                  ) {
                    console.log("pulled");
                    userdata.using.pull("milk");
                    userdata.update();
                    interaction.channel.send("Your milk ran out.");
                  } else {
                    commonkeys = commonkeys * 2;
                  }
                }
                earnings.push(`${emotes.commonKey} +${commonkeys}`);
                userdata.ckeys += commonkeys;
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
                    console.log("pulled");
                    userdata.using.pull("milk");
                    userdata.update();
                    interaction.channel.send("Your strawberry milk ran out.");
                  } else {
                    rarekeys = rarekeys * 2;
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
                    console.log("pulled");
                    userdata.using.pull("milk");
                    userdata.update();
                    interaction.channel.send("Your chocolate milk ran out.");
                  } else {
                    exotickeys = exotickeys * 2;
                  }
                }
                earnings.push(`${emotes.exoticKey} +${exotickeys}`);
                userdata.ekeys += exotickeys;
              }

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  cooldowndata.radio = 0;
                  interaction.channel.send("Your radio battery ran out.");
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
                } else {
                  console.log("pulled");
                  userdata.itemeffects.pull(itemeffectsfilter[0]);
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
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
                cashwon = cashwon += bountyuser;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              earnings.push(`${emotes.notoriety} +${notowon}`);
              userdata.racerank += rankswon;
              userdata.notoriety += notowon;
              userdata.cash += cashwon;
              userdata.bounty += 5;
              userdata.rp4 += rpwon;
              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Muscle Drag Race won!`);
              await i.editReply({ embeds: [embed] });

              await i.editReply({ embeds: [embed] });

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
              embed.setTitle(`Tier ${bot} Muscle Drag Race lost!`);
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
            car2 = carsarray.filter((car) => car.Speed < 140);
          } else if (bot == 2) {
            car2 = carsarray.filter((car) => car.Speed < 160);
          } else if (bot == 3) {
            car2 = carsarray.filter((car) => car.Speed < 180);
          } else if (bot == 4) {
            car2 = carsarray.filter((car) => car.Speed < 190);
          } else if (bot == 5) {
            car2 = carsarray.filter((car) => car.Speed > 200);
          } else if (bot == 6) {
            car2 = carsarray.filter((car) => car.Speed > 210);
          } else if (bot == 7) {
            car2 = carsarray.filter((car) => car.Speed > 220);
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

          class ICar {
            constructor(speed, accel, handling, weight) {
              this.speed = speed;
              this.accel = accel;
              this.handling = handling;
              this.weight = weight;
            }
          }

          let formula = function (speed, accel, handling, weight) {
            const target = new ICar(speed, accel, handling, weight);
            return (car) => {
              let speedDifference = target.speed - car.speed;
              let handlingPerSpeed = target.handling / target.speed;
              let handling = (car.handling += speedDifference) * handlingPerSpeed;

              let weightDifference = target.weight - car.weight;
              let accelPerWeight = target.accel / target.weight;
              let accel = (car.accel -= weightDifference) * accelPerWeight;

              let targetRegression = target.handling / target.accel;
              let regression = Math.abs((targetRegression -= handling) / accel);
              console.log(targetRegression)
              return Math.round(regression * 100) / 100;
            };
          };

          const drag = formula(400, 2.0, 1000, 2000)
          const track = formula(250, 2.0, 500, 3000)
          const drift = formula(150, 4.0, 2300, 3700);

          let player = new ICar(speed, acceleration, handling, weight);
          let opponent = new ICar(speed2, acceleration2, handling2, weight2);

          let winner;
          const dorace = (f) => {
            const playerRegression = f(player);
            const opponentRegression = f(opponent);
            winner =
              playerRegression <= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          console.log("Track Race:\n", dorace(track));

          dorace(track);
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

          let race2 = racedb.filter((r) => r.name == "crosrace");
          let rankswon = parseInt(bot) * race2[0].ranks;
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

          let accms = acceleration * 10;
          let accms2 = acceleration2 * 10;
          class ICar {
            constructor(speed, accel, handling, weight) {
              this.speed = speed;
              this.accel = accel;
              this.handling = handling;
              this.weight = weight;
            }
          }

          let formula = function (speed, accel, handling, weight) {
            const target = new ICar(speed, accel, handling, weight);
            return (car) => {
              const speedDifference = target.speed - car.speed;
              const handlingPerSpeed = target.handling / target.speed;
              const handling =
                car.handling + speedDifference * handlingPerSpeed;

              const weightDifference = target.weight - car.weight;
              const accelPerWeight = target.accel / target.weight;
              const accel = car.accel - weightDifference * accelPerWeight;

              const targetRegression = target.handling / target.accel;
              const regression = Math.abs(targetRegression - handling / accel);
              return Math.round(regression * 100) / 100;
            };
          };

          const drag = formula(400, 2.0, 1000, 2000)
          const track = formula(250, 2.0, 500, 3000)
          const drift = formula(150, 4.0, 2300, 3700);

          let player = new ICar(speed, acceleration, handling, weight);
          let opponent = new ICar(speed2, acceleration2, handling2, weight2);

          let winner;
          const dorace = (f) => {
            const playerRegression = f(player);
            const opponentRegression = f(opponent);
            winner =
              playerRegression <= opponentRegression ? "Player" : "Opponent";

            const string =
              `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
              `- Winner: ${winner}\n`;

            return string;
          };

          console.log("Track Race:\n", dorace(track));

          dorace(track);
          setTimeout(async () => {
            if (winner == "Player") {
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
              if (bonus > 0) {
                cashwon = cashwon += cashwon * bonus;
              }
              if (bountyuser > 0) {
                cashwon = cashwon += bountyuser;
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
              if (usinginv.includes("radio")) {
                let cooldown = cooldowndata.radio;
                let timeout = 60000;
                console.log(timeout - (Date.now() - cooldown));
                if (
                  cooldown !== null &&
                  timeout - (Date.now() - cooldown) > 0
                ) {
                  rankswon = rankswon * 2;
                  cashwon = cashwon * 2;
                  rpwon = rpwon * 2;
                } else {
                  console.log("pulled");
                  userdata.using.pull("radio");
                  userdata.update();
                  cooldowndata.radio = 0;
                  interaction.channel.send("Your radio battery ran out.");
                }
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
                  cooldowndata.radio = 0;
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
                } else {
                  console.log("pulled");
                  userdata.itemeffects.pull(itemeffectsfilter[0]);
                  userdata.itemeffects.pull(itemeffectsfilter[0]);
                  userdata.update();
                  interaction.channel.send("Your tequila shot ran out! :(");
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
                cashwon = cashwon += bountyuser;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);
              userdata.racerank += rankswon;

              userdata.cash += cashwon;
              userdata.bounty += 5;
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
              userdata.bounty += 20;
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
