const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rallypvp")
    .setDescription("Rally pvp race another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you want to race with")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target2")
        .setDescription("The 2nd user you want to race with")
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
    const db = require("quick.db");

    const cars = require("../cardb.json");

    let user = interaction.user;
    let user2 = interaction.options.getUser("target");
    let user3 = interaction.options.getUser("target2");

    if (!user2) return interaction.reply("Specify a user to race!");
    if (!user3) return interaction.reply("Specify a 2nd user to race!");

    let timeout = 45000;

    let user1cars = db.fetch(`cars_${user.id}`);
    let racing = db.fetch(`racing_${user.id}`);
    let racing2 = db.fetch(`racing_${user2.id}`);
    let racing3 = db.fetch(`racing_${user3.id}`);
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
    if (racing3 !== null && timeout - (Date.now() - racing3) > 0) {
      let time = ms(timeout - (Date.now() - racing3), { compact: true });

      return interaction.reply(
        `The 2nd user needs to wait ${time} before racing again.`
      );
    }

    let idtoselect = interaction.options.getString("car");
    if (!idtoselect)
      return interaction.reply(
        "Specify an id! Use /ids select [id] [car] to select a car! `Command example: /race @test 1`"
      );
    let selected = db.fetch(`selected_${idtoselect}_${user.id}`);
    if (!selected) {
      let errembed = new discord.MessageEmbed()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return interaction.reply({ embeds: [errembed] });
    }

    if (!user1cars) return interaction.reply("You dont have any cars!");
    let user1carchoice = selected.toLowerCase();

    if (!user1cars.some((e) => e.includes(selected)))
      return interaction.reply(
        `You need to enter the car you want to verse with. E.g. \`race @user dragster\`\nYour current cars: ${user1cars.join(
          " "
        )}`
      );
    if (user.id === user2.id)
      return interaction.reply("You cant race yourself!");

    let user2cars = db.fetch(`cars_${user2.id}`);
    if (!user2cars) return interaction.reply("They dont have any cars!");
    if (!cars.Cars[user1carchoice])
      return interaction.reply("Thats not a car!");

    let restoration = db.fetch(
      `${cars.Cars[user1carchoice.toLowerCase()].Name}restoration_${user.id}`
    );
    if (cars.Cars[user1carchoice.toLowerCase()].Junked && restoration < 100) {
      return interaction.reply("This car is too junked to race, sorry!");
    }
    interaction.reply(
      `${user2}, what car do you wish to rally race ${user} in?`
    );
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
    let collector2;
    collector.on("collect", (msg) => {
      user2carchoice = msg.content;
      if (!user2carchoice)
        return msg.reply(
          "Specify an id! Use /ids select [id] [car] to select a car! `Command example: /race @test 1`"
        );
      selected2 = db.fetch(`selected_${user2carchoice}_${msg.author.id}`);
      if (!selected2)
        return msg.reply(
          "That id doesn't have a car! Use /ids select [id] [car] to select it! `Command example: /race @test 1`"
        );
      let restoration2 = db.fetch(
        `${cars.Cars[selected2.toLowerCase()].Name}restoration_${msg.author.id}`
      );
      if (cars.Cars[selected2.toLowerCase()].Junked && restoration2 < 100) {
        return msg.reply("This car is too junked to race, sorry!");
      }

      collector.on("end", async () => {
        interaction.channel.send(
          `${user3}, what car do you wish to rally race ${user} & ${user2} in?`
        );
        let filter2 = (m = discord.Message) => {
          return m.author.id === user3.id;
        };
        collector2 = interaction.channel.createMessageCollector({
          filter: filter2,
          max: 1,
          time: 1000 * 20,
        });

        let selected3;
        let user3carchoice;
        collector2.on("collect", (msg2) => {
          user3carchoice = msg2.content;
          if (!user3carchoice)
            return msg2.reply(
              "Specify an id! Use /ids select [id] [car] to select a car! `Command example: /race @test 1`"
            );
          selected3 = db.fetch(`selected_${user3carchoice}_${msg2.author.id}`);
          if (!selected3)
            return msg2.reply(
              "That id doesn't have a car! Use /ids select [id] [car] to select it! `Command example: /race @test 1`"
            );
          let restoration2 = db.fetch(
            `${cars.Cars[selected3.toLowerCase()].Name}restoration_${
              msg2.author.id
            }`
          );
          if (cars.Cars[selected3.toLowerCase()].Junked && restoration2 < 100) {
            return msg.reply("This car is too junked to race, sorry!");
          }

          collector2.on("end", async () => {
            if (!user2carchoice)
              return interaction.channel.send("They didn't answer in time!");
            if (!selected)
              return interaction.channel.send("They didn't answer in time!");
            let user2carspeed = db.fetch(
              `${cars.Cars[selected2.toLowerCase()].Name}speed_${user2.id}`
            );
            let user2car = cars.Cars[selected2].Name;
            let user3car = cars.Cars[selected3].Name;

            let user1car = cars.Cars[user1carchoice].Name;
            db.set(`racing_${user.id}`, Date.now());
            db.set(`racing_${user2.id}`, Date.now());

            let user1carspeed = db.fetch(`${user1car}speed_${user.id}`);

            let user3carspeed = db.fetch(`${user3car}speed_${user3.id}`);

            let user1carzerosixty = db.fetch(
              `${cars.Cars[user1car.toLowerCase()].Name}060_${user.id}`
            );
            let user2carzerosixty = db.fetch(
              `${cars.Cars[user2car.toLowerCase()].Name}060_${user2.id}`
            );
            let user3carzerosixty = db.fetch(
              `${cars.Cars[user3car.toLowerCase()].Name}060_${user3.id}`
            );

            if (user1carzerosixty < 2) {
              db.set(
                `${cars.Cars[user1car.toLowerCase()].Name}060_${user.id}`,
                2
              );
            }
            if (user2carzerosixty < 2) {
              db.set(
                `${cars.Cars[user2car.toLowerCase()].Name}060_${user2.id}`,
                2
              );
            }
            if (user3carzerosixty < 2) {
              db.set(
                `${cars.Cars[user3car.toLowerCase()].Name}060_${user3.id}`,
                2
              );
            }

            let newzero1 = db.fetch(
              `${cars.Cars[user1car.toLowerCase()].Name}060_${user.id}`
            );
            let newzero2 = db.fetch(
              `${cars.Cars[user2car.toLowerCase()].Name}060_${user2.id}`
            );
            let newzero3 = db.fetch(
              `${cars.Cars[user3car.toLowerCase()].Name}060_${user3.id}`
            );

            let offroad = db.fetch(
              `${cars.Cars[user1car.toLowerCase()].Name}offroad_${user.id}`
            );
            let offroad2 = db.fetch(
              `${cars.Cars[user2car.toLowerCase()].Name}offroad_${user2.id}`
            );
            let offroad3 = db.fetch(
              `${cars.Cars[user3car.toLowerCase()].Name}offroad_${user3.id}`
            );

            if (!offroad || offroad == 0 || offroad < 0) {
              return interaction.channel.send(
                `${user}'s car's offroad rating is too low!`
              );
            }
            if (!offroad2 || offroad2 == 0 || offroad2 < 0) {
              return interaction.channel.send(
                `${user2}'s car's offroad rating is too low!!`
              );
            }
            if (!offroad3 || offroad3 == 0 || offroad3 < 0) {
              return interaction.channel.send(
                `${user3}'s car's offroad rating is too low!!`
              );
            }
            if (
              !db.fetch(
                `${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`
              )
            ) {
              db.set(
                `${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`,
                cars.Cars[selected.toLowerCase()].Handling
              );
            }
            if (
              !db.fetch(
                `${cars.Cars[user2car.toLowerCase()].Name}handling_${user2.id}`
              )
            ) {
              db.set(
                `${cars.Cars[user2car.toLowerCase()].Name}handling_${user2.id}`,
                cars.Cars[user2car.toLowerCase()].Handling
              );
            }
            if (
              !db.fetch(
                `${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`
              )
            ) {
              db.set(
                `${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`,
                cars.Cars[selected.toLowerCase()].Handling
              );
            }
            if (
              !db.fetch(
                `${cars.Cars[user3car.toLowerCase()].Name}handling_${user3.id}`
              )
            ) {
              db.set(
                `${cars.Cars[user3car.toLowerCase()].Name}handling_${user3.id}`,
                cars.Cars[user3car.toLowerCase()].Handling
              );
            }
            let handling =
              db.fetch(
                `${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`
              ) || cars.Cars[selected.toLowerCase()].Handling;
            let handling2 =
              db.fetch(
                `${cars.Cars[user2car.toLowerCase()].Name}handling_${user2.id}`
              ) || cars.Cars[user2car.toLowerCase()].Handling;
            let handling3 =
              db.fetch(
                `${cars.Cars[user3car.toLowerCase()].Name}handling_${user3.id}`
              ) || cars.Cars[user3car.toLowerCase()].Handling;

            let zero2sixtycar = db.fetch(
              `${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`
            );
            let otherzero2sixty = db.fetch(
              `${cars.Cars[user2car.toLowerCase()].Name}060_${user2.id}`
            );
            let otherzero2sixty2 = db.fetch(
              `${cars.Cars[user3car.toLowerCase()].Name}060_${user3.id}`
            );

            let newhandling = handling / 20;
            let othernewhandling = handling2 / 20;
            let handling12 = handling3 / 20;
            let hp = user1carspeed / zero2sixtycar + newhandling;
            let hp2 = user2carspeed / otherzero2sixty + othernewhandling;
            let hp3 = user3carspeed / otherzero2sixty2 + handling12;

            let range = db.fetch(
              `${cars.Cars[user1car.toLowerCase()].Name}range_${
                interaction.user.id
              }`
            );
            if (cars.Cars[user1car.toLowerCase()].Electric) {
              if (range <= 0) {
                return interaction.reply(
                  `${user}, Your EV is out of range! Run /charge to charge it!`
                );
              }
            }
            let range2 = db.fetch(
              `${cars.Cars[user2car.toLowerCase()].Name}range_${user2.id}`
            );
            if (cars.Cars[user2car.toLowerCase()].Electric) {
              if (range2 <= 0) {
                return interaction.reply(
                  `${user2}, Your EV is out of range! Run /charge to charge it!`
                );
              }
            }
            let range3 = db.fetch(
              `${cars.Cars[user3car.toLowerCase()].Name}range_${user3.id}`
            );
            if (cars.Cars[user3car.toLowerCase()].Electric) {
              if (range3 <= 0) {
                return interaction.reply(
                  `${user3}, Your EV is out of range! Run /charge to charge it!`
                );
              }
            }

            if (range) {
              db.subtract(
                `${cars.Cars[user1car.toLowerCase()].Name}range_${user.id}`,
                1
              );
            }
            if (range2) {
              db.subtract(
                `${cars.Cars[user2car.toLowerCase()].Name}range_${user2.id}`,
                1
              );
            }
            if (range3) {
              db.subtract(
                `${cars.Cars[user3car.toLowerCase()].Name}range_${user3.id}`,
                1
              );
            }
            let embed = new discord.MessageEmbed()
              .setTitle("3...2...1....GO!")
              .addField(
                `${user.username}'s ${
                  cars.Cars[user1car.toLowerCase()].Emote
                } ${cars.Cars[user1car.toLowerCase()].Name}`,
                `Speed: ${user1carspeed}MPH\n\n0-60: ${newzero1}s\n\nOffroad Rating:${offroad}`
              )
              .addField(
                `${user2.username}'s ${
                  cars.Cars[user2car.toLowerCase()].Emote
                } ${cars.Cars[user2car.toLowerCase()].Name}`,
                `Speed: ${user2carspeed}MPH\n\n0-60: ${newzero2}s\n\nOffroad Rating:${offroad2}`
              )
              .addField(
                `${user3.username}'s ${
                  cars.Cars[user3car.toLowerCase()].Emote
                } ${cars.Cars[user3car.toLowerCase()].Name}`,
                `Speed: ${user3carspeed}MPH\n\n0-60: ${newzero3}s\n\nOffroad Rating:${offroad3}`
              )

              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/TkqTq9R/Logo-Makr-17-Np-PO.png");
            let msg2 = await interaction.editReply({ embeds: [embed] });

            let tracklength = 0;
            let tracklength2 = 0;
            let tracklength3 = 0;
            console.log(hp);
            console.log(hp2);
            console.log(hp3);

            let timer = 0;
            let x = setInterval(() => {
              tracklength += hp;
              tracklength2 += hp2;
              tracklength3 += hp3;
              timer++;

              if (timer >= 10) {
                if (tracklength > tracklength2 && tracklength > tracklength3) {
                  console.log("End");
                  clearInterval(x);
                  embed.addField("Results", `${user.username} Won`);
                  embed.addField("Earnings", `$500`);
                  msg2.edit({ embeds: [embed] });
                  db.add(`cash_${user.id}`, 500);
                  db.add(`racexp_${user.id}`, 25);
                  db.add(`rp_${user.id}`, 10);
                  if (range) {
                    db.add(`batteries_${user.id}`, 1);
                  }
                  if (!db.fetch(`2ezbadge_${user.id}`)) {
                    db.set(`2ezbadge_${user.id}`, true);
                    db.push(`badges_${user.id}`, "2ez");
                    interaction.channel.send(
                      `${user}, you just earned the "2EZ" badge for winning a group race!`
                    );
                  }

                  return;
                } else if (
                  tracklength2 > tracklength &&
                  tracklength2 > tracklength3
                ) {
                  console.log("End");
                  clearInterval(x);
                  embed.addField("Results", `${user2.username} Won`);
                  embed.addField("Earnings", `$500`);
                  msg2.edit({ embeds: [embed] });
                  db.add(`cash_${user2.id}`, 500);
                  db.add(`racexp_${user2.id}`, 25);
                  db.add(`rp_${user2.id}`, 10);
                  if (range2) {
                    db.add(`batteries_${user2.id}`, 1);
                  }
                  if (!db.fetch(`2ezbadge_${user2.id}`)) {
                    db.set(`2ezbadge_${user2.id}`, true);
                    db.push(`badges_${user2.id}`, "2ez");
                    interaction.channel.send(
                      `${user2}, you just earned the "2EZ" badge for winning a group race!`
                    );
                  }

                  return;
                } else if (
                  tracklength3 > tracklength2 &&
                  tracklength3 > tracklength
                ) {
                  console.log("End");
                  clearInterval(x);
                  embed.addField("Results", `${user3.username} Won`);
                  embed.addField("Earnings", `$500`);
                  msg2.edit({ embeds: [embed] });
                  db.add(`cash_${user2.id}`, 500);
                  db.add(`racexp_${user2.id}`, 25);
                  db.add(`rp_${user2.id}`, 10);
                  if (range3) {
                    db.add(`batteries_${user3.id}`, 1);
                  }
                  if (!db.fetch(`2ezbadge_${user3.id}`)) {
                    db.set(`2ezbadge_${user3.id}`, true);
                    db.push(`badges_${user3.id}`, "2ez");
                    interaction.channel.send(
                      `${user3}, you just earned the "2EZ" badge for winning a group race!`
                    );
                  }

                  return;
                }
              }
            }, 1000);
          });
        });
      });
    });
  },
};
