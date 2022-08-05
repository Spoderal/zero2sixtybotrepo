const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/profile-schema");
const partdb = require("../partsdb.json");

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
    const cars = require("../cardb.json");

    let userid = interaction.user.id;

    let userdata =
      (await User.findOne({ id: userid })) || new User({ id: userid });
    let cooldowns =
      (await Cooldowns.findOne({ id: userid })) ||
      new Cooldowns({ id: userid });

    let semote = "<:speedemote:983963212393357322>";
    let hemote = "<:handling:983963211403505724>";
    let zemote = "<:zerosixtyemote:983963210304614410>";
    let moneyearned = interaction.options.getNumber("bet");

    let idtoselect = interaction.options.getString("car");
    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.MessageEmbed()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return interaction.reply({ embeds: [errembed] });
    }
    let timeout = 18000000;
    let racing = cooldowns.betracing;
    let prestige = userdata.prestige;
    if (prestige < 5)
      return interaction.reply("You need to be prestige 5 to do this race!");
    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return interaction.reply(`Please wait ${time} before racing again.`);
    }
    let botcar = lodash.sample(cars.Cars);
    console.log(botcar);

    if (cars.Cars[selected.Name.toLowerCase()].Junked) {
      return interaction.reply("This car is too junked to race, sorry!");
    }

    let range = selected.Range;
    if (cars.Cars[selected.Name.toLowerCase()].Electric) {
      if (range <= 0) {
        return interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }

    let bank = userdata.bank;
    if (moneyearned > bank)
      return interaction.reply(
        `You don't have enough money in your bank account!`
      );

    let racelevel = userdata.racerank;

    userdata.betracing = Date.now();
    let newrankrequired = racelevel * 200;
    if (prestige >= 3) {
      newrankrequired * 2;
    } else if (prestige >= 5) {
      newrankrequired * 3;
    }
    console.log(newrankrequired);
    console.log(botcar);
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
    let tips = [
      "Try buying gold to support us! Starting at $0.99 for 20, and you can do so much with it!",
      "You can upgrade cars with /upgrade",
      "Create a crew and get benefits such as cash bonuses!",
      "Use /weekly, /daily, and /vote to get a small cash boost!",
      "Notoriety is used for seasons, check the current season with /season",
      "Use keys to purchase import crates with exclusive cars",
      "View events with /event",
    ];
    let tip = lodash.sample(tips);
    let userhelmet = userdata.helmet;
    console.log(userhelmet);
    userhelmet = userhelmet.toLowerCase();
    let helmets = require("../pfpsdb.json");
    let actualhelmet = helmets.Pfps[userhelmet.toLowerCase()];
    console.log(actualhelmet);

    bank -= moneyearned;
    userdata.save();

    let embed = new discord.MessageEmbed()
      .setTitle(`Bet race in progress...`)
      .addField(`Your bet`, `$${numberWithCommas(moneyearned)}`)
      .addField(
        `${actualhelmet.Emote} ${
          cars.Cars[selected.Name.toLowerCase()].Emote
        } ${cars.Cars[selected.Name.toLowerCase()].Name}`,
        `${semote} Speed: ${user1carspeed} MPH\n\n${zemote} 0-60: ${zero2sixtycar}s\n\n${hemote} Handling: ${handling}`,
        true
      )
      .addField(
        `🤖 ${cars.Cars[botcar.Name.toLowerCase()].Emote} ${
          cars.Cars[botcar.Name.toLowerCase()].Name
        }`,
        `${semote} Speed: ${botspeed} MPH\n\n${zemote} 0-60: ${otherzero2sixty}s\n\n${hemote} Handling: ${
          cars.Cars[botcar.Name.toLowerCase()].Handling
        }`,
        true
      )
      .setColor("#60b0f4")
      .setFooter(`${tip}`)
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
      let row = new MessageActionRow();

      row.addComponents(
        new MessageButton()
          .setCustomId("boost")
          .setEmoji("<:boost:983813400289234978>")
          .setLabel("Boost")
          .setStyle("SECONDARY")
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
          console.log("boosted " + parseInt(boost));
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
        console.log(tracklength);
        clearInterval(x);

        if (tracklength > tracklength2) {
          console.log(moneyearned);
          console.log("End");

          embed.setTitle(`Bet race won!`);

          let racerank2 = userdata.racerank;

          let reqxp = racerank2 * 1000;

          let finalamount = moneyearned + moneyearned * 0.35;

          let earningsresult = [];
          earningsresult.push(`$${numberWithCommas(finalamount)}`);
          if (userdata.racexp >= reqxp) {
            userdata.racerank += 1;
            earningsresult.push(
              `Ranked up your race rank to ${userdata.racerank}`
            );
            userdata.racexp = 0;
          }

          embed.addField("Earnings", `${earningsresult.join("\n")}`);
          interaction.editReply({ embeds: [embed] });
          userdata.cash += Number(moneyearned);
          userdata.racexp += 25;

          if (cars.Cars[selected.Name.toLowerCase()].StatTrack) {
            selected.Wins += 1;
            userdata.save();
          }
          if (range > 0) {
            selected.Range -= 1;
            userdata.save();
          }

          return;
        } else if (tracklength < tracklength2) {
          console.log("End");
          embed.setTitle(`Bet race lost!`);

          clearInterval(x);

          if (range > 0) {
            selected.Range -= 1;
            userdata.save();
          }
          interaction.editReply({ embeds: [embed] });
          return;
        } else if (tracklength == tracklength2) {
          console.log("End");
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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
