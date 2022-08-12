const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { emotes } = require("../common/emotes");
const { tipFooterRandom } = require("../common/tips");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("betrace")
    .setDescription("Race against the odds!")
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("The amount to bet")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {
    const cars = require("../data/cardb.json");

    let userid = interaction.user.id;

    let userdata =
      (await User.findOne({ id: userid })) || new User({ id: userid });
    let cooldowns =
      (await Cooldowns.findOne({ id: userid })) ||
      new Cooldowns({ id: userid });

    let semote = emotes.speed;
    let hemote = emotes.handling;
    let zemote = emotes.zero2sixty;
    let moneyearned = interaction.options.getNumber("bet");

    let idtoselect = interaction.options.getString("car");
    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    let timeout = 18000000;
    let racing = cooldowns.betracing;
    let prestige = userdata.prestige;
    if (prestige < 5)
      return await interaction.reply("You need to be prestige 5 to do this race!");
    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return await interaction.reply(`Please wait ${time} before racing again.`);
    }
    let botcar = lodash.sample(cars.Cars);

    if (cars.Cars[selected.Name.toLowerCase()].Junked) {
      return await interaction.reply("This car is too junked to race, sorry!");
    }

    let range = selected.Range;
    if (cars.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return await interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }

    let bank = userdata.bank;
    if (moneyearned > bank)
      return await interaction.reply(
        `You don't have enough money in your bank account!`
      );

    let racelevel = userdata.racerank;

    cooldowns.betracing = Date.now();
    cooldowns.save();

    let newrankrequired = racelevel * 200;
    if (prestige >= 3) {
      newrankrequired * 2;
    } else if (prestige >= 5) {
      newrankrequired * 3;
    }
    let nitro = selected.Nitro;

    let user1carspeed = selected.Speed;

    let handling = selected.Handling;
    let botspeed = cars.Cars[botcar.Name.toLowerCase()].Speed;
    let rando = randomRange(1, 5);

    if (rando == 3) {
      botspeed += 50;
    }
    let zero2sixtycar = selected.Acceleration;
    let otherzero2sixty = Number(cars.Cars[botcar.Name.toLowerCase()]["0-60"]);
    let newhandling = handling / 20;
    let othernewhandling = cars.Cars[botcar.Name.toLowerCase()].Handling / 20;
    let new60 = user1carspeed / zero2sixtycar;
    let new62 = cars.Cars[botcar.Name.toLowerCase()].Speed / otherzero2sixty;
    Number(user1carspeed);
    Number(botspeed);
    Number(new60);
    new62 = Number(new62);
    let hp = user1carspeed + newhandling;
    let hp2 = botspeed + othernewhandling;
    let userhelmet = userdata.helmet;
    userhelmet = userhelmet.toLowerCase();
    let helmets = require("../data/pfpsdb.json");
    let actualhelmet = helmets.Pfps[userhelmet.toLowerCase()];

    userdata.bank -= moneyearned;
    userdata.save();

    let embed = new discord.EmbedBuilder()
      .setTitle(`Bet race in progress...`)
      .addFields([
        {
          name: `Your bet`,
          value: `${toCurrency(moneyearned)}`,
        },
        {
          name: `${actualhelmet.Emote} ${
            cars.Cars[selected.Name.toLowerCase()].Emote
          } ${cars.Cars[selected.Name.toLowerCase()].Name}`,
          value: `${semote} Speed: ${user1carspeed} MPH\n\n${zemote} 0-60: ${zero2sixtycar}s\n\n${hemote} Handling: ${handling}`,
          inline: true,
        },
        {
          name: `🤖 ${cars.Cars[botcar.Name.toLowerCase()].Emote} ${
            cars.Cars[botcar.Name.toLowerCase()].Name
          }`,
          calue: `${semote} Speed: ${botspeed} MPH\n\n${zemote} 0-60: ${otherzero2sixty}s\n\n${hemote} Handling: ${
            cars.Cars[botcar.Name.toLowerCase()].Handling
          }`,
          inline: true,
        },
      ])
      .setColor(colors.blue)
      .setFooter(tipFooterRandom)
      .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
    let msg = await interaction.reply({ embeds: [embed], fetchReply: true });

    let randomnum = randomRange(1, 4);
    if (randomnum == 2) {
      setTimeout(() => {
        embed.setDescription("Great launch!");
        hp += 1;
        interaction.editReply({ embeds: [embed] });
      }, 2000);
    }

    let tracklength = 0;
    tracklength += new62;
    let tracklength2 = 0;
    tracklength2 += new60;
    if (nitro) {
      let row = new ActionRowBuilder();

      row.addComponents(
        new ButtonBuilder()
          .setCustomId("boost")
          .setEmoji(emotes.boost)
          .setLabel("Boost")
          .setStyle("Secondary")
      );
      msg.edit({ components: [row] });

      let filter = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };

      const collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 10000,
      });

      collector.on("collect", async (i) => {
        if (i.customId.includes("boost")) {
          let boost = partdb.Patrts[nitro.toLowerCase()].AddedBoost;

          tracklength += parseInt(boost);
          i.update({ content: "Boosting!", embeds: [embed] });
          nitro = null;
          userdata.save();
        }
      });
    }
    let timer = 0;
    let x = setInterval(() => {
      tracklength += hp;
      tracklength2 += hp2;
      timer++;

      if (timer >= 10) {
        clearInterval(x);

        if (tracklength > tracklength2) {
          embed.setTitle(`Bet race won!`);

          let racerank2 = userdata.racerank;

          let reqxp = racerank2 * 1000;

          let finalamount = moneyearned + moneyearned * 0.35;

          let earningsresult = [];
          earningsresult.push(`${toCurrency(finalamount)}`);
          if (userdata.racexp >= reqxp) {
            userdata.racerank += 1;
            earningsresult.push(
              `Ranked up your race rank to ${userdata.racerank}`
            );
            userdata.racexp = 0;
          }

          embed.addFields([
            {
              name: "Earnings",
              value: `${earningsresult.join("\n")}`,
            },
          ]);
          interaction.editReply({ embeds: [embed] });
          userdata.cash += finalamount;
          userdata.racexp += 25;

          if (cars.Cars[selected.Name.toLowerCase()].StatTrack) {
            selected.Wins += 1;
          }
          if (range > 0) {
            selected.Range -= 1;
          }
          userdata.save();

          return;
        } else if (tracklength < tracklength2) {
          embed.setTitle(`Bet race lost!`);

          clearInterval(x);

          if (range > 0) {
            selected.Range -= 1;
            userdata.save();
          }

          interaction.editReply({ embeds: [embed] });

          return;
        } else if (tracklength == tracklength2) {
          embed.setTitle(`Bet race tied, you still lost your earnings!`);

          clearInterval(x);

          if (range > 0) {
            selected.Range -= 1;
            userdata.save();
          }

          interaction.editReply({ embeds: [embed] });

          return;
        }
      }
    }, 1000);

    function randomRange(min, max) {
      return Math.round(Math.random() * (max - min)) + min;
    }
  },
};
