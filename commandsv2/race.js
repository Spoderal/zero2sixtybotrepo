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
        .setName("race")
        .setChoices(
          { name: `Street Race`, value: `streetrace` },
          { name: `Drag Race`, value: `dragrace` },
          { name: `Track Race`, value: `trackrace` },
          { name: `Cross Country`, value: `crosscountry` }
        )
        .setRequired(true)
        .setDescription(`The race to start`)
    )
    .addNumberOption((option) =>
      option
        .setName("tier")
        .setDescription("The tier to race")
        .setRequired(true)
        .setMaxValue(8)
        .setChoices(
          { name: `Tier 1`, value: 1 },
          { name: `Tier 2`, value: 2 },
          { name: `Tier 3`, value: 3 },
          { name: `Tier 4`, value: 4 },
          { name: `Tier 5`, value: 5 },
          { name: `Tier 6`, value: 6 },
          { name: `Tier 7`, value: 7 },
          { name: `Tier 8`, value: 8 }
        )
    )
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
    const dorace = (
      speed,
      speed2,
      handling,
      handling2,
      weight,
      weight2,
      acceleration,
      acceleration2
    ) => {
      speed = speed * 100;
      speed2 = speed2 * 100;
      let player = (handling + speed - weight) / acceleration;
      let opponent = (handling2 + speed2 - weight2) / acceleration2;
      console.log(player);
      console.log(opponent);
      const playerRegression = player;
      const opponentRegression = opponent;
      winner = playerRegression >= opponentRegression ? "Player" : "Opponent";

      const string =
        `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
        `- Winner: ${winner}\n`;

      return string;
    };
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

    if (selected.Gas <= 0)
      return interaction.reply(
        `You're out of gas! Use \`/gas\` to fill up for the price of gas today! Check the daily price of gas with \`/bot\``
      );
    let car2;
    let raceoption = interaction.options.getString("race");
    let tieroption = interaction.options.getNumber("tier");
    let cartofilter = [];
    if (tieroption == 1) {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 300 && car.Class == "D"
      );
    } else if (tieroption == 2) {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 400 && car.Class == "C"
      );
    } else if (tieroption == 3) {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 500 && car.Class == "B"
      );
    } else if (tieroption == 4) {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 600 && car.Class == "A"
      );
    } else if (tieroption == 5) {
      cartofilter = carsarray.filter(
        (car) =>
          (car.Speed <= 700 && car.Class == "A") ||
          (car.Speed <= 700 && car.Class == "S")
      );
    } else if (tieroption == 6) {
      cartofilter = carsarray.filter(
        (car) =>
          (car.Speed <= 800 && car.Class == "A") ||
          (car.Speed <= 800 && car.Class == "S")
      );
    } else if (tieroption == 7) {
      cartofilter = carsarray.filter(
        (car) =>
          (car.Speed <= 900 && car.Class == "A") ||
          (car.Speed <= 900 && car.Class == "S")
      );
    } else if (tieroption == 8) {
      cartofilter = carsarray.filter(
        (car) =>
          (car.Speed >= 1000 && car.Class == "A") ||
          (car.Speed >= 1000 && car.Class == "S")
      );
    }

    car2 = lodash.sample(cartofilter);
    let winner;
    let rewards = [];
    if (raceoption == "streetrace") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;

      let weightscore = Math.floor(weight / 100);
      let weightscore2 = Math.floor(weight2 / 100);

      let speedscore = speed * 10;
      let speedscore2 = speed2 * 10;

      dorace(
        speedscore,
        speedscore2,
        handling,
        handling2,
        weightscore,
        weightscore2,
        acceleration,
        acceleration2
      );

      console.log(car2);
      console.log(winner);
    } else if (raceoption == "dragrace") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;

      let weightscore = Math.floor(weight / 50);
      let weightscore2 = Math.floor(weight2 / 50);

      let speedscore = speed * 5;
      let speedscore2 = speed2 * 5;

      dorace(
        speedscore,
        speedscore2,
        handling,
        handling2,
        weightscore,
        weightscore2,
        acceleration,
        acceleration2
      );

      console.log(car2);
      console.log(winner);
    } else if (raceoption == "trackrace") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;

      let handlingscore = handling * 100;
      let handlingscore2 = handling2 * 100;

      let weightscore = Math.floor(weight / 100);
      let weightscore2 = Math.floor(weight2 / 100);

      let speedscore = speed * 15;
      let speedscore2 = speed2 * 15;

      dorace(
        speedscore,
        speedscore2,
        handlingscore,
        handlingscore2,
        weightscore,
        weightscore2,
        acceleration,
        acceleration2
      );

      console.log(car2);
      console.log(winner);
    } else if (raceoption == "crosscountry") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;

      let handlingscore = handling * 150;
      let handlingscore2 = handling2 * 150;

      let weightscore = Math.floor(weight / 10);
      let weightscore2 = Math.floor(weight2 / 10);

      let speedscore = speed * 20;
      let speedscore2 = speed2 * 20;

      dorace(
        speedscore,
        speedscore2,
        handlingscore,
        handlingscore2,
        weightscore,
        weightscore2,
        acceleration,
        acceleration2
      );

      console.log(car2);
      console.log(winner);
    }
    let randombarn = randomRange(1, 20);
    let randomstory = [
      "Snowy is the leader of the oldest squad in the city.",
      "Snowy gained his Agera from Devil by beating him in a race",
      "You are snowy's son",
      "Snowy has now been missing for 3 years",
      "Zero City is heavily controlled by Devil, the ZPD Captain",
      "Snowy used to be the ZPD Captain",
    ];
    let randstory = lodash.sample(randomstory);
    let randkey = randomRange(1, 10);
    let possiblekey = randomRange(1, 15);
    let raceindb = racedb[raceoption.toLowerCase()];
    let cashwon = tieroption * raceindb.Reward;
    let carimg =
      selected.Image || cardb.Cars[selected.Name.toLowerCase()].Image;
    let userpfp = userdata.helmet || "Noob Helmet";
    let embed = new EmbedBuilder()
      .setTitle(`Racing tier ${tieroption} ${raceindb.Name}`)
      .setImage(`${carimg}`)
      .setThumbnail(`${car2.Image}`)
      .setColor(colors.blue)
      .addFields(
        {
          name: `${helmetdb.Pfps[userpfp.toLowerCase()].Emote} Your ${
            selected.Emote
          } ${selected.Name}`,
          value: `${emotes.speed} HP: ${selected.Speed}\n${emotes.zero2sixty} Acceleration: ${selected.Acceleration}s\n${emotes.handling} Handling: ${selected.Handling}\n${emotes.weight} Weight: ${selected.WeightStat}`,
          inline: true,
        },
        {
          name: `${car2.Emote} ${car2.Name}`,
          value: `${emotes.speed} HP: ${car2.Speed}\n${
            emotes.zero2sixty
          } Acceleration: ${car2[`0-60`]}s\n${emotes.handling} Handling: ${
            car2.Handling
          }\n${emotes.weight} Weight: ${car2.Weight}`,
          inline: true,
        }
      );

    cooldowndata.racing = Date.now();
    cooldowndata.is_racing = Date.now();
    selected.Gas -= 1;
    if (selected.Gas <= 0) {
      selected.Gas = 0;
    }
    await User.findOneAndUpdate(
      {
        id: interaction.user.id,
      },
      {
        $set: {
          "cars.$[car]": selected,
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

    cooldowndata.save();
    await interaction.reply({ embeds: [embed], fetchReply: true });

    setTimeout(async () => {
      if (winner == "Player") {
        rewards.push(`${emotes.cash} ${toCurrency(cashwon)}`);
        rewards.push(`<:rank_race:1103913420320944198> +1 Rank`);
        userdata.cash += cashwon;
        userdata.racerank += 1;
        let cratechance = randomRange(1, 500);
        if (cratechance >= 400) {
          rewards.push(`<:supplydrop:1044404467119960085> Common Crate`);
          userdata.items.push("common crate");
        } else if (cratechance <= 25) {
          rewards.push(`<:supplydroprare:1044404466096537731> Rare Crate`);
          userdata.items.push("rare crate");
        } else {
          rewards.push("No crate");
        }
        if (raceoption == "trackrace" && possiblekey == 10 && tieroption <= 2) {
          let randomamount = randomRange(1, 3);
          rewards.push(`${emotes.commonKey} ${randomamount}`);
          userdata.ckeys += randomamount;
        } else if (
          raceoption == "trackrace" &&
          possiblekey == 10 &&
          tieroption <= 4
        ) {
          let randomamount = randomRange(1, 3);
          rewards.push(`${emotes.rareKey} ${randomamount}`);
          userdata.rkeys += randomamount;
        } else if (
          raceoption == "trackrace" &&
          possiblekey == 10 &&
          tieroption >= 5
        ) {
          let randomamount = randomRange(1, 3);
          rewards.push(`${emotes.exoticKey} ${randomamount}`);
          userdata.ekeys += randomamount;
        }

        if (raceoption == "dragrace" && randombarn == 10) {
          let randomamount = 1;
          rewards.push(`${emotes.barnMapCommon} ${randomamount}`);
          userdata.barnmaps += randomamount;
        }
        if (raceoption == "crosscountry" && randkey >= 6) {
          let randomamount = 1;
          rewards.push(`${emotes.dirftKey} ${randomamount}`);
          rewards.push(`${randstory}`);
          userdata.evkeys += randomamount;
        }
        embed.addFields({
          name: `Rewards`,
          value: `${rewards.join("\n")}`,
        });
        embed.setTitle(`Tier ${tieroption} ${raceindb.Name} won!`);
      } else if (winner == "Opponent") {
        embed.setTitle(`Tier ${tieroption} ${raceindb.Name} lost!`);
      }
      await interaction.editReply({ embeds: [embed] });

      userdata.save();
    }, 5000);
  },
};
