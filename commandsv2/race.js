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
          { name: `Track Race (EVENT)`, value: `trackraceevent` },
          { name: `Cross Country`, value: `crosscountry` },
          { name: "Car Series", value: "carseries" },
          { name: "Motorcycle Madness", value: "motorcyclemad" }
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

    let streettiers = {
      1:{
        hp: 300,
        acc: 5,
        handling: 500,
        weight: 3000
      },
      2:{
        hp: 400,
        acc: 5,
        handling: 600,
        weight: 2800
      },
      3:{
        hp: 500,
        acc: 4,
        handling: 700,
        weight: 2600
      },
      4:{
        hp: 600,
        acc: 4,
        handling: 700,
        weight: 2600
      },
      5:{
        hp: 700,
        acc: 3,
        handling: 800,
        weight: 2500
      },
      6:{
        hp: 800,
        acc: 3,
        handling: 800,
        weight: 2400
      },
      7:{
        hp: 1000,
        acc: 2,
        handling: 1000,
        weight: 2400
      },
      8:{
        hp: 4000,
        acc: 2,
        handling: 1200,
        weight: 2300
      }
    }

    let dragtiers = {
      1:{
        hp: 400,
        acc: 5,
        handling: 500,
        weight: 3000
      },
      2:{
        hp: 500,
        acc: 5,
        handling: 500,
        weight: 2800
      },
      3:{
        hp: 600,
        acc: 4,
        handling: 500,
        weight: 2600
      },
      4:{
        hp: 700,
        acc: 4,
        handling: 500,
        weight: 2600
      },
      5:{
        hp: 800,
        acc: 3,
        handling: 500,
        weight: 2500
      },
      6:{
        hp: 900,
        acc: 3,
        handling: 500,
        weight: 2400
      },
      7:{
        hp: 1000,
        acc: 2,
        handling: 500,
        weight: 2400
      },
      8:{
        hp: 3000,
        acc: 2,
        handling: 500,
        weight: 2300
      }
    }

    let tracktiers = {
      1:{
        hp: 300,
        acc: 5,
        handling: 750,
        weight: 3500
      },
      2:{
        hp: 400,
        acc: 5,
        handling: 800,
        weight: 3400
      },
      3:{
        hp: 500,
        acc: 4,
        handling: 1000,
        weight: 3300
      },
      4:{
        hp: 600,
        acc: 4,
        handling: 1500,
        weight: 3200
      },
      5:{
        hp: 700,
        acc: 3,
        handling: 2000,
        weight: 3100
      },
      6:{
        hp: 800,
        acc: 3,
        handling: 2500,
        weight: 3000
      },
      7:{
        hp: 1000,
        acc: 2,
        handling: 3000,
        weight: 2900
      },
      8:{
        hp: 3000,
        acc: 2,
        handling: 3500,
        weight: 2800
      }
    }

    

    const dorace = function(hp, a, h, w) {
      let targetHp = streettiers[tieroption].hp
      let targetA = streettiers[tieroption].acc
      let targetH = streettiers[tieroption].handling
      let targetW = streettiers[tieroption].weight
      let p = (x, t) => 100 - Math.abs(100 - ((x / t) * 100));
      let sum = p(hp, targetHp)
        + p(a, targetA)
        + p(h, targetH)
        + p(w, targetW)
      return sum / 4;


    }
    const dodrag = function(hp, a, h, w) {
      let targetHp = dragtiers[tieroption].hp
      let targetA = dragtiers[tieroption].acc
      let targetH = dragtiers[tieroption].handling
      let targetW = dragtiers[tieroption].weight
      let p = (x, t) => 100 - Math.abs(100 - ((x / t) * 100));
      let sum = p(hp, targetHp)
        + p(a, targetA)
        + p(w, targetW)
      return sum / 4;
}


    const dotrack = function(hp, a, h, w) {
      let targetHp = tracktiers[tieroption].hp
      let targetA = tracktiers[tieroption].acc
      let targetH = tracktiers[tieroption].handling
      let targetW = tracktiers[tieroption].weight
      let p = (x, t) => 100 - Math.abs(100 - ((x / t) * 100));
      let sum = p(hp, targetHp)
        + p(a, targetA)
        + p(h, targetH)
        + p(w, targetW)
      return sum / 4;


    }
    const domotor = function(hp, a, h, w) {
      let targetHp = 300
      let targetA = 3.0
      let targetH = 1000
      let targetW = 500
      let p = (x, t) => 100 - Math.abs(100 - ((x / t) * 100));
      let sum = p(hp, targetHp)
        + p(a, targetA)
        + p(h, targetH)
        + p(w, targetW)
      return sum / 4;


    }
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

    if (tieroption == 1 && raceoption == "motorcyclemad") {
      cartofilter = carsarray.filter(
        (car) => car.Motorcycle && car.Speed <= 150
      );
    } else if (tieroption == 2 && raceoption == "motorcyclemad") {
      cartofilter = carsarray.filter(
        (car) => car.Motorcycle && car.Speed <= 200
      );
    } else if (tieroption == 3 && raceoption == "motorcyclemad") {
      cartofilter = carsarray.filter(
        (car) => car.Motorcycle && car.Speed <= 300
      );
    } else if (tieroption > 3 && raceoption == "motorcyclemad")
      return interaction.reply("The max tier for this race is 3!");
    else if (
      raceoption == "motorcyclemad" &&
      !cardb.Cars[selected.Name.toLowerCase()].Motorcycle
    )
      return interaction.reply("You need a motorcycle for this race!");

    if (tieroption == 1 && raceoption == "trackraceevent") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 300 && car.Track
      );
    } else if (tieroption == 2 && raceoption == "trackraceevent") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 400  && car.Track
      );
    } else if (tieroption == 3 && raceoption == "trackraceevent") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 500  && car.Track
      );
    } else if (tieroption == 4 && raceoption == "trackraceevent") {
      cartofilter = carsarray.filter(
        (car) => car.Speed <= 600 && car.Track
      );
    } else if (tieroption == 5 && raceoption == "trackraceevent") {
      cartofilter = carsarray.filter(
        (car) =>
          (car.Speed <= 700  && car.Track)
      );
    } else if (tieroption == 6 && raceoption == "trackraceevent") {
      cartofilter = carsarray.filter(
        (car) =>
          (car.Speed <= 800 && car.Track) 
      );
    } else if (tieroption == 7 && raceoption == "trackraceevent") {
      cartofilter = carsarray.filter(
        (car) =>
          (car.Speed <= 900 && car.Track)
      );
    } else if (tieroption == 8 && raceoption == "trackraceevent") {
      cartofilter = carsarray.filter(
        (car) =>  (car.Speed >= 900 && car.Track) 
      );
    }

    car2 = lodash.sample(cartofilter);
    console.log(cartofilter);
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

      let playerrace = dorace(speed, acceleration, handling, weight);
      let opponentrace = dorace(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

      console.log(playerrace);
      console.log(opponentrace);
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

      let playerrace = dodrag(speed, acceleration, handling, weight);
      let opponentrace = dodrag(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

      console.log(playerrace);
      console.log(opponentrace);
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

      let playerrace = dotrack(speed, acceleration, handling, weight);
      let opponentrace = dotrack(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

      console.log(playerrace);
      console.log(opponentrace);
      console.log(winner);
    } else if (raceoption == "trackraceevent") {
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

      let playerrace = dotrack(speed, acceleration, handling, weight);
      let opponentrace = dotrack(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

      console.log(playerrace);
      console.log(opponentrace);
      console.log(winner);
    }
    //test
    else if (raceoption == "trackraceevent") {
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

      let playerrace = dotrack(
        speed, acceleration, handling, weight
      );
      let opponentrace = dotrack(
        speed2, acceleration2, handling2, weight2
      );

      winner = playerrace > opponentrace
      

      console.log(playerrace);
      console.log(opponentrace)
      console.log(winner);
    }
     else if (raceoption == "crosscountry") {
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

      let playerrace = dorace(speed, acceleration, handling, weight);
      let opponentrace = dorace(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

      console.log(playerrace);
      console.log(opponentrace);
      console.log(winner);
    } else if (raceoption == "motorcyclemad") {
      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let weight2 = car2.Weight;
      let speed2 = car2.Speed;
      let acceleration2 = car2["0-60"];
      let handling2 = car2.Handling;

      let playerrace = domotor(speed, acceleration, handling, weight);
      let opponentrace = domotor(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

      console.log(playerrace);
      console.log(opponentrace);
      console.log(winner);
    } else if (raceoption == "carseries") {
      if (userdata.seriestickets <= 0)
        return interaction.reply("You need a series ticket to race!");

      if (!cardb.Cars[selected.Name.toLowerCase()].Series)
        return interaction.channel.send("You need to use a series car!");

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

      let playerrace = dorace(speed, acceleration, handling, weight);
      let opponentrace = dorace(speed2, acceleration2, handling2, weight2);

      winner = playerrace > opponentrace;

      console.log(playerrace);
      console.log(opponentrace);
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
    let randcar = randomRange(1, 10);
    let possiblekey = randomRange(1, 15);
    let raceindb = racedb[raceoption.toLowerCase()];
    let cashwon = tieroption * raceindb.Reward;
    if (userdata.prestige) {
      let prestige = userdata.prestige;
      let prestigebonus = prestige * 0.1;

      cashwon = cashwon += cashwon * prestigebonus;
    }
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
      console.log(winner)
      if (winner == true) {
        rewards.push(`${emotes.cash} ${toCurrency(cashwon)}`);
        let rankwon = 1;
        let rating = selected.Rating;
        if (userdata.items.includes("camera")) {
          rating += 1;
        }

        if (rating && rating >= 1) {
          rankwon = rankwon += rankwon * rating;
        }

        rewards.push(`<:rank_race:1103913420320944198> +${rankwon} Rank`);
        userdata.cash += cashwon;
        userdata.racerank += rankwon;
        let cratechance = randomRange(1, 20);
        if (cratechance > 10) {
          rewards.push(`<:supplydrop:1044404467119960085> Common Crate`);
          userdata.items.push("common crate");
        } else if (cratechance == 5) {
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
        if (raceoption == "dragrace") {
          rewards.push(`${emotes.notoriety} +25 Notoriety`);
          userdata.notoriety += 25;
        }
        rewards.push(`${emotes.rp} + 10 RP`);
        userdata.rp4 += 10;
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

        if (raceoption == "trackraceevent" && randcar >= 6) {
          let carobj = {
            ID: car2.alias,
            Name: car2.Name,
            Speed: car2.Speed,
            Acceleration: car2["0-60"],
            Handling: car2.Handling,
            Parts: [],
            Emote: car2.Emote,
            Livery: car2.Image,
            Miles: 0,
            WeightStat: car2.Weight,
            Gas: 10,
            MaxGas: 10,
          };
          rewards.push(`${carobj.Emote} ${carobj.Name} Won!`);
          userdata.cars.push(carobj);
        }
        if (raceoption == "carseries") {
          rewards.push(`+1 Wins`);
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car].Wins": (selected.Wins += 1),
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

          userdata.seriestickets -= 1;
        }
        embed.addFields({
          name: `Rewards`,
          value: `${rewards.join("\n")}`,
        });
        embed.setTitle(`Tier ${tieroption} ${raceindb.Name} won!`);
      } else if (winner == false) {
        embed.setTitle(`Tier ${tieroption} ${raceindb.Name} lost!`);
      }

      await interaction.editReply({ embeds: [embed] });
      selected.Miles += 15;
      let dirt = selected.Dirt || 100;

      let newdirt = (dirt -= 5);

      if (dirt > 0) {
        selected.Dirt = newdirt;
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

      userdata.save();
    }, 5000);
  },
};
