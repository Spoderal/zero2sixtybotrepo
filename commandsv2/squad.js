

const { SlashCommandBuilder } = require("@discordjs/builders");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");
const squadsdb = require("../data/squads.json");
const { EmbedBuilder } = require("discord.js");
const cardb = require("../data/cardb.json");
const discord = require("discord.js");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const ms = require("pretty-ms");

const { toCurrency } = require("../common/utils");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("squad")
    .setDescription(
      "Show the information of the squad you're at, or another squad"
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("Show the list of squads")
    )
    .addSubcommand((subcommand) =>
    subcommand
      .setName("race")
      .setDescription("Race a squad")
      .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("Car to use")
        .setRequired(true)
    )
  )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("Show the information of a squad")
        .addStringOption((option) =>
          option
            .setName("squad")
            .setDescription("Squad to see the info of")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let tier = userdata.tier;
    let squadsarr = [];
    let option = interaction.options.getSubcommand();
    for (let s in squadsdb.Squads) {
      let sq = squadsdb.Squads[s];
      squadsarr.push(sq);
    }

    if(option == "race"){
      let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: interaction.user.id });

    let idtoselect = interaction.options.getString("car");
    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }

    let timeout = 45000

    let racing = cooldowndata.racing;
    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return await interaction.reply(
        `Please wait ${time} before racing again.`
      );
    }
    let tracklength = 600;
    let tracklength2 = 600;
    let cemote = emotes.cash;
    let tier = userdata.tier || 1;

    let prestige = userdata.prestige;

    let range = selected.Range;
    if (cardb.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return await interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }
    if (tier >= 8) return interaction.reply("You've beaten all the squads!");

    

    let squadsarr = [];
    for (let s in squadsdb.Squads) {
      let sq = squadsdb.Squads[s];
      squadsarr.push(sq);
    }

    let squadfiltered = squadsarr.filter((squad) => squad.Tier == tier);
    let sqlevels = userdata.squads || [
      { name: "flame squad", car: 0 },
      { name: "the astros", car: 0 },
      {name: "muscle brains", car: 0},
      {name: "cool cobras", car: 0},
      {name: "demonz", car: 0}
    ];
    if (!sqlevels.includes({ name: "double 0", car: 0 })) {
      sqlevels.push({ name: "double 0", car: 0 });
      userdata.markModified("squads");
      userdata.update();
    }
    if (!sqlevels.includes({ name: "the classics", car: 0 })) {
      sqlevels.push({ name: "the classics", car: 0 });
      userdata.markModified("squads");
      userdata.update();
    }
    let sqlevelfiltered = sqlevels.filter(
      (sqt) => sqt.name == squadfiltered[0].Name.toLowerCase()
    );
    let moneyearned = squadfiltered[0].Reward;
    if (sqlevelfiltered[0].car >= 4) {
      moneyearned = squadfiltered[0].BigReward;
    }
    if (prestige) {
      let mult = prestige * 0.05;

      let multy = mult * moneyearned;

      moneyearned = moneyearned += multy;
    }
    let squadinfo = squadfiltered[0];
    let botcar = squadfiltered[0].Cars[sqlevelfiltered[0].car];
    let carimage = selected.Image || cardb.Cars[selected.Name.toLowerCase()].Image;
    let botcarindb = cardb.Cars[botcar.toLowerCase()];
    let car2 = botcarindb;
    let carindb = cardb.Cars[selected.Name.toLowerCase()]
    if(carindb.Class !== squadinfo.Class) return interaction.reply(`Your car class doesn't match the squad's class, use a ${squadinfo.Class} car!`)
    let racelevel = userdata.racerank;

    cooldowndata.racing = Date.now();
    cooldowndata.save();

    let newrankrequired = racelevel * 200;
    if (prestige >= 3) {
      newrankrequired * 2;
    } else if (prestige >= 5) {
      newrankrequired * 3;
    }
    let mph = selected.Speed;
    let weight =
      selected.WeightStat || cardb.Cars[selected.Name.toLowerCase()].Weight;
    let acceleration = selected.Acceleration;
    let handling = selected.Handling;

    if (!selected.WeightStat) {
      selected.WeightStat = cardb.Cars[selected.Name.toLowerCase()].Weight;
    }

    let mph2 = car2.Speed;
    let weight2 = car2.Weight;
    let acceleration2 = car2["0-60"];
    let handling2 = car2.Handling;

    let speed = 0;
    let speed2 = 0;

    let userpfp = userdata.helmet || "default";
    let outfits = require("../data/characters.json")

    let embed = new EmbedBuilder()
      .setTitle(`Racing Squad ${squadfiltered[0].Name}`)

      .addFields(
        {
          name: `${outfits.Helmets[userpfp.toLowerCase()].Emote} Your ${
            selected.Emote
          } ${selected.Name}`,
          value: `${emotes.speed} Power: ${mph}\n\n${emotes.acceleration} Acceleration: ${acceleration}s\n\n${emotes.weight} Weight: ${weight}\n\n${emotes.handling} Handling: ${handling}`,

          inline: true,
        },
        {
          name: `${car2.Emote} ${car2.Name}`,
          value: `${emotes.speed} Power: ${mph2}\n\n${emotes.acceleration} Acceleration: ${acceleration2}s\n\n${emotes.weight} Weight: ${weight2}\n\n${emotes.handling} Handling: ${handling2}`,
          inline: true,
        }
      )
      .setColor(colors.blue)
      .setImage(carimage)
      .setThumbnail(botcarindb.Image);

    await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });

    let weightscore = Math.floor(weight / 100);
    let weightscore2 = Math.floor(weight2 / 100);

    speed = mph * 100;
    speed2 = mph2 * 100;

    let player = (handling + speed - weightscore) / acceleration;
    let opponent = (handling2 + speed2 - weightscore2) / acceleration2;

    let winner;
    const dorace = () => {
      const playerRegression = player;
      const opponentRegression = opponent;
      winner = playerRegression >= opponentRegression ? "Player" : "Opponent";

      const string =
        `- Player: ${playerRegression} vs Opponent: ${opponentRegression}\n` +
        `- Winner: ${winner}\n`;

      return string;
    };

    dorace();

    setTimeout(async () => {
      if (winner == "Player") {
        embed.setTitle(`${squadinfo.Name} race won!`);

        if (cardb.Cars[selected.Name.toLowerCase()].StatTrack) {
          selected.Wins += 1;
          userdata.save();
        }
        if (interaction.guild.id == "931004190149460048") {
          let calccash = moneyearned * 0.05;
          // moneyearnedtxt += calccash;
          moneyearned += calccash;
        }

        let newnum = (sqlevelfiltered[0].car += 1);
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "squads.$[squad].car": newnum,
            },
          },

          {
            arrayFilters: [
              {
                "squad.name": squadinfo.Name.toLowerCase(),
              },
            ],
          }
        );

        let earningsresult = [];
        earningsresult.push(`$${moneyearned}`);
        moneyearned = Number(moneyearned);
        userdata.cash += moneyearned;
        userdata.update();
        let newlevel = sqlevels.filter(
          (sqt) => sqt.name == squadfiltered[0].Name.toLowerCase()
        );
        if (newlevel[0].car > 4) {
          userdata.tier += 1;
        }
        userdata.update();

        embed.addFields([
          {
            name: "Earnings",
            value: `${cemote} ${earningsresult.join("\n")}`,
          },
        ]);

        interaction.editReply({ embeds: [embed] });

        if (range > 0) {
          selected.Range -= 1;
        }

        userdata.save();
      } else if (winner == "Opponent") {
        embed.setTitle(`Race lost!`);

        if (range > 0) {
          selected.Range -= 1;
        }
        userdata.save();
        interaction.editReply({ embeds: [embed] });
        return;
      }

      console.log(tracklength);
      console.log(tracklength2);
    }, 3000);
    }
    else if (option == "list") {
      let embed = new EmbedBuilder()
        .setTitle("Squads List")
        .setColor(`#60B0F4`);
      for (let s in squadsarr) {
        embed.addFields({
          name: `${squadsarr[s].Emote} ${squadsarr[s].Name}`,
          value: `Tier: ${squadsarr[s].Tier}`,
          inline: true,
        });
      }

      interaction.reply({ embeds: [embed] });
    } else if (option == "info") {
      let squatofind = interaction.options.getString("squad").toLowerCase();
      let squadfiltered = squadsarr.filter(
        (squad) => squad.Name.toLowerCase() == squatofind
      );
      if (!squadfiltered[0]) return interaction.reply("Thats not a squad!");

      let squadinfo = squadfiltered[0];

      let embed = new EmbedBuilder()
        .setTitle(`Info for ${squadinfo.Emote} ${squadinfo.Name}`)
        .setColor(`#60B0F4`)
        .setDescription(
          `Class: ${squadinfo.Class}\nTier: ${
            squadinfo.Tier
          }\nCash Earnings: ${toCurrency(
            squadinfo.Reward
          )}\nBoss Cash Earnings: ${toCurrency(squadinfo.BigReward)}`
        )
        .addFields({ name: "Cars", value: `${squadinfo.Cars.join("\n")}` })
        .setThumbnail(`${squadinfo.Icon}`);

      interaction.reply({ embeds: [embed] });
    } else {
      let squadfiltered = squadsarr.filter((squad) => squad.Tier == tier);
      let squadinfo = squadfiltered[0];

      let embed = new EmbedBuilder()
        .setTitle(`Info for ${squadinfo.Emote} ${squadinfo.Name}`)
        .setColor(`#60B0F4`)
        .setDescription(
          `Class: ${squadinfo.Class}\nTier: ${
            squadinfo.Tier
          }\nCash Earnings: ${toCurrency(
            squadinfo.Reward
          )}\nBoss Cash Earnings: ${toCurrency(squadinfo.BigReward)}`
        )
        .addFields({ name: "Cars", value: `${squadinfo.Cars.join("\n")}` })
        .setThumbnail(`${squadinfo.Icon}`);

      interaction.reply({ embeds: [embed] });
    }
  },
};
