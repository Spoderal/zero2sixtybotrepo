const lodash = require("lodash");
const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const Global = require("../schema/global-schema");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("pvpdrift")
    .setDescription("PVP Drift an other user")
    .addStringOption((option) =>
      option
        .setName("track")
        .setDescription("The track you want to drift on")
        .setRequired(true)
        .addChoice("Regular", "regular")
        .addChoice("Mountain", "mountain")
        .addChoice("Parking Lot", "parking")
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to pvp").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("car2")
        .setDescription("Users car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {
    const cars = require("../cardb.json");

    let moneyearned = 50;
    let idtoselect = interaction.options.getString("car");
    let user2 = interaction.options.getString("user");
    let idtoselect2 = interaction.options.getString("car2");

    let userdata = await User.findOne({ id: interaction.user.id });
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: uid });
    let userdata2 = await User.findOne({ id: user2.id });
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

    let filteredcar2 = userdata2.cars.filter((car) => car.ID == idtoselect2);
    let selected2 = filteredcar2[0] || "No ID";
    if (selected2 == "No ID") {
      let errembed = new discord.MessageEmbed()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(
          `${user2.username}, That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return interaction.reply({ embeds: [errembed] });
    }
    console.log(filteredcar);
    let user = interaction.user;
    let timeout = cooldowndata.timeout || 45000;
    let botcar = null;
    let racing = cooldowndata.racing;

    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return interaction.reply(`Please wait ${time} before racing again.`);
    }
    let semote = "<:speedemote:983963212393357322>";
    let hemote = "<:handling:983963211403505724>";
    let zemote = "<:zerosixtyemote:983963210304614410>";
    let cemote = "<:zecash:983966383408832533>";
    let rpemote = "<:rp:983968476060336168>";

    if (cars.Cars[selected.Name.toLowerCase()].Junked) {
      return interaction.reply("This car is too junked to race, sorry!");
    }
    if (cars.Cars[selected2.Name.toLowerCase()].Junked) {
      return interaction.reply("This car is too junked to race, sorry!");
    }

    if (cars.Cars[selected.Name.toLowerCase()].Electric) {
      let range = selected.Range;
      if (range <= 0) {
        return interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }
    if (cars.Cars[selected2.Name.toLowerCase()].Electric) {
      let range2 = selected2.Range;
      if (range2 <= 0) {
        return interaction.reply(
          "Your EV is out of range! Run /charge to charge it!"
        );
      }
    }
    let ticketsearned;

    let tracklength = 0;

    cooldowndata.racing = Date.now();
    cooldowndata.save();

    let user1carspeed = selected.Speed;
    let user1carzerosixty = selected.Acceleration;
    let user1carhandling = selected.Handling;
    let user2carspeed = selected2.Speed;
    let user2carzerosixty = selected2.Acceleration;
    let user2carhandling = selected2.Handling;

    let userhelmet = userdata.helmet;
    let userhelmet2 = userdata2.helmet;

    console.log(userhelmet);
    userhelmet = userhelmet.toLowerCase();
    let helmets = require("../pfpsdb.json");
    let actualhelmet = helmets.Pfps[userhelmet.toLowerCase()];
    let actualhelmet2 = helmets.Pfps[userhelmet2.toLowerCase()];

    console.log(actualhelmet);
    let driftscore = selected.Drift;
    let driftscore2 = selected2.Drift;

    let zero2sixtycar = selected.Acceleration;
    let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"];

    let new60 = user1carspeed / zero2sixtycar;
    let new62 = cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty;
    let using = userdata.using;
    Number(user1carspeed);
    Number(new60);
    Number(new62);
    let driftrank1 = userdata.driftrank;
    let driftrank2 = userdata2.driftrank;

    let hp = driftscore * 2 + driftrank1;
    let hp2 = driftscore2 * 2 + driftrank2;

    let tips = [
      "Try buying gold to support us! Starting at $0.99 for 20, and you can do so much with it!",
      "Join the support server to get a boost in botrace earnings",
      "Create a crew and get benefits such as cash bonuses!",
      "Use /weekly, /daily, and /vote to get a small cash boost!",
      "Notoriety is used for seasons, check the current season with /season",
      "Use keys to purchase import crates with exclusive cars",
      "View events with /event",
    ];
    let tip = lodash.sample(tips);
    let y;
    let itemusedp;
    let embed = new discord.MessageEmbed()
      .setTitle(`Drift PVP in progress...`)
      .addField(
        `${user.username} ${actualhelmet.Emote} ${selected.Emote} ${selected.Name}`,
        `${semote} Speed: ${user1carspeed} MPH\n\n${zemote} 0-60: ${user1carzerosixty}s\n\n${hemote} Handling: ${user1carhandling}\n\n Drift: ${driftscore}`,
        true
      )
      .addField(
        `${user2.username} ${actualhelmet2.Emote} ${
          cars.Cars[botcar.toLowerCase()].Emote
        } ${cars.Cars[botcar.toLowerCase()].Name}`,
        `${semote} Speed: ${user2carspeed} MPH\n\n${zemote} 0-60: ${user2carzerosixty}s\n\n${hemote} Handling: ${user2carhandling}\n\n Drift: ${driftscore}`,
        true
      )
      .setColor("#60b0f4")

      .setFooter(`${tip}`)
      .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");

    tracklength += new62;
    let tracklength2 = 0;
    tracklength2 += new60;
    if (itemusedp == true) {
      itemusedp = false;
      tracklength - 20;
    }

    let timer = 0;
    let x = setInterval(async () => {
      tracklength += hp;
      tracklength2 += hp2;
      timer++;

      if (timer >= 10) {
        console.log(tracklength);
        clearInterval(x);
        clearInterval(y);

        if (tracklength > tracklength2) {
          if (userdata.cashgain == "10") {
            let calccash = moneyearned * 0.1;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata.cashgain == "15") {
            let calccash = moneyearned * 0.15;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata.cashgain == "20") {
            let calccash = moneyearned * 0.2;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata.cashgain == "25") {
            let calccash = moneyearned * 0.25;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata.cashgain == "50") {
            let calccash = moneyearned * 0.5;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          }
          console.log(`before: ${moneyearned}`);
          console.log("End");
          if (using.includes("trophy")) {
            moneyearned = moneyearned * 2;
            moneyearnedtxt = `${moneyearned} *with x2 multiplier*`;
            console.log(moneyearned);
          }

          embed.setTitle(`Drift PVP Winner: ${user.tag}`);

          if (cars.Cars[selected.Name.toLowerCase()].StatTrack) {
            selected.Wins += 1;
            userdata.save();
          }
          let earningsresult = [];
          if (interaction.guild.id == "931004190149460048") {
            let calccash = moneyearned * 0.05;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          }
          earningsresult.push(`$${moneyearned}`);
          earningsresult.push(`${rpemote} ${ticketsearned} RP`);

          userdata.rp += ticketsearned;
          userdata.cash += Number(moneyearned);
          userdata.driftxp += 25;

          let racerank2 = (driftrank += 1);

          let reqxp = racerank2 * 1000;

          if (userdata.driftxp >= reqxp) {
            userdata.driftrank += 1;
            earningsresult.push(
              `Ranked up your race rank to ${userdata.driftrank}`
            );
            userdata.driftxp = 0;
          }

          embed.addField("Earnings", `${cemote} ${earningsresult.join("\n")}`);

          let globalvars = await Global.findOne();

          if (globalvars.double == true) {
            moneyearned = moneyearned += moneyearned;
            embed.addField("Double Cash Weekend!", `\u200b`);
            moneyearnedtxt = `$${moneyearned}`;
          }
          interaction.editReply({ embeds: [embed] });

          userdata.save();

          if (range && range > 0) {
            selected.Range -= 1;
            userdata.save();
          }
          if (range2 && range2 > 0) {
            selected2.Range -= 1;
            userdata.save();
          }

          return;
        } else if (tracklength < tracklength2) {
          console.log("End");
          embed.setTitle(`Drift PVP Winner: ${user2.tag}`);
          if (userdata2.cashgain == "10") {
            let calccash = moneyearned * 0.1;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata2.cashgain == "15") {
            let calccash = moneyearned * 0.15;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata2.cashgain == "20") {
            let calccash = moneyearned * 0.2;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata2.cashgain == "25") {
            let calccash = moneyearned * 0.25;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          } else if (userdata2.cashgain == "50") {
            let calccash = moneyearned * 0.5;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          }
          console.log(`before: ${moneyearned}`);
          console.log("End");
          if (using.includes("trophy")) {
            moneyearned = moneyearned * 2;
            moneyearnedtxt = `${moneyearned} *with x2 multiplier*`;
            console.log(moneyearned);
          }

          if (cars.Cars[selected2.Name.toLowerCase()].StatTrack) {
            selected2.Wins += 1;
            userdata2.save();
          }
          let earningsresult = [];
          if (interaction.guild.id == "931004190149460048") {
            let calccash = moneyearned * 0.05;
            moneyearnedtxt += calccash;
            moneyearned += calccash;
          }
          earningsresult.push(`$${moneyearned}`);
          earningsresult.push(`${rpemote} ${ticketsearned} RP`);

          userdata2.rp += ticketsearned;
          userdata2.cash += moneyearned;
          userdata2.racexp += 25;

          let racerank2;

          let reqxp = racerank2 * 1000;

          if (userdata2.racexp >= reqxp) {
            userdata2.racerank += 1;
            earningsresult.push(
              `Ranked up your race rank to ${userdata2.racerank}`
            );
            userdata2.racexp = 0;
          }

          embed.addField("Earnings", `${cemote} ${earningsresult.join("\n")}`);

          let globalvars = await Global.findOne();

          if (globalvars.double == true) {
            moneyearned = moneyearned += moneyearned;
            embed.addField("Double Cash Weekend!", `\u200b`);
            moneyearnedtxt = `$${moneyearned}`;
          }
          interaction.editReply({ embeds: [embed] });

          userdata2.save();

          clearInterval(x);
          if (range2 && range2 > 0) {
            selected2.Range -= 1;
            userdata.save();
          }
          if (range && range > 0) {
            selected.Range -= 1;
            userdata.save();
          }
          interaction.editReply({ embeds: [embed] });
          return;
        } else if (tracklength == tracklength2) {
          console.log("End");
          embed.setTitle(`Drift PVP race tied!`);
          clearInterval(x);
          if (range2 && range2 > 0) {
            selected2.Range -= 1;
            userdata.save();
          }
          if (range && range > 0) {
            selected.Range -= 1;
            userdata.save();
          }

          interaction.editReply({ embeds: [embed] });
          return;
        }
      }
    }, 1000);
  },
};
