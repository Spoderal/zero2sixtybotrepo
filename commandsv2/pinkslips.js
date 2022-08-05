const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pinkslips")
    .setDescription("Bet your cars against others")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you want to race with")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id you want to race with")
        .setRequired(true)
    ),

  async execute(interaction) {
    const ms = require("pretty-ms");
    const discord = require("discord.js");
    const cars = require("../data/cardb.json");

    let user = interaction.user;
    let user2 = interaction.options.getUser("target");
    let userdata = await User.findOne({ id: user.id });
    if (!user2) return interaction.reply("Specify a user to race!");
    let userdata2 = await User.findOne({ id: user2.id });
    let cooldowndata =
      (await Cooldowns.findOne({ id: user.id })) ||
      new Cooldowns({ id: user.id });
    let cooldowndata2 =
      (await Cooldowns.findOne({ id: user2.id })) ||
      new Cooldowns({ id: user2.id });

    let timeout = 45000;

    let user1cars = userdata.cars;
    let racing = userdata.racing;
    let racing2 = userdata2.racing;
    let prestige = userdata.prestige;
    let prestige2 = userdata2.prestige;
    let pinkslips = userdata.pinkslips;
    let pinkslips2 = userdata2.pinkslips;

    if (!pinkslips || pinkslips < 1) {
      return interaction.reply(`You don't have any pink slips!`);
    }
    if (!pinkslips2 || pinkslips2 < 1) {
      return interaction.reply(`${user2} doesn't have any pink slips!`);
    }

    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing), { compact: true });

      return interaction.reply(`Please wait ${time} before racing again.`);
    }
    if (racing2 !== null && timeout - (Date.now() - racing2) > 0) {
      let time = ms(timeout - (Date.now() - racing2), { compact: true });

      return interaction.reply(
        `The other user needs to wait ${time} before racing again.`
      );
    }

    let idtoselect = interaction.options.getString("car");
    if (!idtoselect)
      return interaction.reply(
        "Specify an id! Use /ids select [id] [car] to select a car! `Command example: /race @test 1`"
      );
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

    if (!user1cars) return interaction.reply("You dont have any cars!");
    let user1carchoice = selected;

    if (user.id === user2.id)
      return interaction.reply("You cant race yourself!");

    let user2cars = userdata2.cars;
    if (!user2cars) return interaction.reply("They dont have any cars!");
    if (!cars.Cars[user1carchoice.Name.toLowerCase()])
      return interaction.reply("Thats not a car!");

    if (cars.Cars[user1carchoice.Name.toLowerCase()].Junked) {
      return interaction.reply("This car is too junked to race, sorry!");
    }
    interaction.reply(`${user2}, what car do you wish to verse ${user} in?`);
    const filter = (m = discord.Message) => {
      return m.author.id === user2.id;
    };
    let collector = interaction.channel.createMessageCollector({
      filter,
      max: 1,
      time: 1000 * 20,
    });
    let selected2;
    let user2carchoice;
    collector.on("collect", (msg) => {
      user2carchoice = msg.content;
      if (!user2carchoice)
        return interaction.reply(
          "Specify an id! Use /ids select [id] [car] to select a car! `Command example: /race @test 1`"
        );
      let filteredcar2 = userdata2.cars.filter((car) => car.ID == idtoselect);
      selected2 = filteredcar2[0] || "No ID";
      if (selected2 == "No ID") {
        let errembed = new discord.MessageEmbed()
          .setTitle("Error!")
          .setColor("DARK_RED")
          .setDescription(
            `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
          );
        return interaction.reply({ embeds: [errembed] });
      }

      if (cars.Cars[selected2.Name.toLowerCase()].Junked) {
        return msg.reply("This car is too junked to race, sorry!");
      }
    });
    let racelevel = userdata.racerank;

    let newrankrequired = racelevel * 200;
    if (prestige >= 3) {
      newrankrequired * 2;
    } else if (prestige >= 5) {
      newrankrequired * 3;
    }

    let racelevel2 = userdata2.racerank;

    let newrankrequired2 = racelevel2 * 100;
    if (prestige2 >= 3) {
      newrankrequired2 * 2;
    } else if (prestige2 >= 5) {
      newrankrequired2 * 3;
    }
    collector.on("end", async () => {
      if (!user2carchoice)
        return interaction.channel.send("They didn't answer in time!");
      if (!selected2)
        return interaction.channel.send("They didn't answer in time!");
      let user2carspeed = selected2.Speed;
      let user2car = selected2;
      let user1car = selected;
      cooldowndata.racing = Date.now();
      cooldowndata2.racing = Date.now();
      cooldowndata.save();
      cooldowndata2.save();

      let user1carspeed = selected.Speed;

      let range = selected.Range;
      if (cars.Cars[selected.Name.toLowerCase()].Electric) {
        if (range <= 0) {
          return interaction.editReply(
            `${user}, Your EV is out of range! Run /charge to charge it!`
          );
        }
      }
      let range2 = selected2.Range;
      if (cars.Cars[selected2.Name.toLowerCase()].Electric) {
        if (range2 <= 0) {
          return interaction.editReply(
            `${user2}, Your EV is out of range! Run /charge to charge it!`
          );
        }
      }

      let newzero1 = selected.Acceleration;
      let newzero2 = selected2.Acceleration;

      let handling = selected.Handling;
      let handling2 = selected2.Handling;

      let newhandling = handling / 20;
      let othernewhandling = handling2 / 20;
      let new60 = user1carspeed / newzero1;
      let new62 = user2carspeed / newzero2;

      let hp = user1carspeed + newhandling;
      let hp2 = user2carspeed + othernewhandling;

      userdata.pinkslips -= 1;
      userdata2.pinkslips -= 1;

      userdata.update();
      userdata2.update();

      let embed = new discord.MessageEmbed()
        .setTitle("3...2...1....GO!")
        .addField(
          `${user.username}'s ${selected.Emote} ${selected.Name}`,
          `Speed: ${user1carspeed}\n\n0-60: ${newzero1}s`
        )
        .addField(
          `${user2.username}'s ${selected2.Emote} ${selected2.Name}`,
          `Speed: ${user2carspeed}\n\n0-60: ${newzero2}s`
        )
        .setColor("#60b0f4")
        .setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
      let msg2 = await interaction.editReply({ embeds: [embed] });

      let tracklength = 0;
      let tracklength2 = 0;

      tracklength += new60;
      tracklength2 += new62;

      let timer = 0;
      let x = setInterval(() => {
        tracklength += hp;
        tracklength2 += hp2;
        timer++;
        console.log(tracklength);
        console.log(tracklength2);

        if (timer >= 10) {
          if (tracklength > tracklength2) {
            console.log("End");
            clearInterval(x);
            embed.addField("Results", `${user.username} Won`);
            embed.addField(
              "Earnings",
              `${cars.Cars[user2car.toLowerCase()].Name}`
            );
            user2car = user2car.toLowerCase();

            userdata.cars.push(selected2);
            userdata2.cars.pull(selected2);

            msg2.edit({ embeds: [embed] });
            userdata.racexp += 25;
            userdata.rp += 10;

            userdata.update();

            let racerank = userdata.racexp;

            if (racerank >= newrankrequired) {
              userdata.racerank += 1;
              msg2.reply(
                `${user}, you just ranked up your race skill to ${userdata.racerank}!`
              );
            }
            userdata.save();

            userdata2.save();
            return;
          } else if (tracklength < tracklength2) {
            console.log("End");
            clearInterval(x);
            embed.addField("Results", `${user2.username} Won`);
            embed.addField(
              "Earnings",
              `${cars.Cars[user1car.toLowerCase()].Name}`
            );
            user1car = user1car.toLowerCase();
            userdata2.cars.push(selected);
            userdata.cars.pull(selected);

            msg2.edit({ embeds: [embed] });
            userdata.racexp += 25;
            userdata.rp += 10;

            userdata2.update();

            let racerank = userdata2.racexp;

            if (racerank >= newrankrequired) {
              userdata2.racerank += 1;
              msg2.reply(
                `${user}, you just ranked up your race skill to ${userdata2.racerank}!`
              );
            }
            userdata.save();

            userdata2.save();
            return;
          } else if (tracklength == tracklength2) {
            embed.addField("Results", `Tied!`);
            msg2.edit({ embeds: [embed] });
          }
        }
      }, 1000);
    });
  },
};
