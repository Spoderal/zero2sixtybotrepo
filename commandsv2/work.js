const Discord = require("discord.js");
const carsdb = require("../cardb.json");
const db = require("quick.db");
const ms = require("ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const wheelspinrewards = require("../wheelspinrewards.json");
const partsdb = require("../partsdb.json");
const jobsdb = require("../jobs.json");
const pretty = require("pretty-ms");
const { MessageActionRow, MessageButton } = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const Global = require("../schema/global-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("See the work menu!")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Options for the work command")
        .setRequired(true)
        .addChoice("Job List", "joblist")
        .addChoice("Hire", "hire")
        .addChoice("Quit", "quit")
        .addChoice("Work", "work")
        .addChoice("Rank", "rank")
    )
    .addStringOption((option) =>
      option
        .setName("job")
        .setDescription("The job to be hired for, quit, or to work for")
        .setRequired(false)
        .addChoice("Mechanic", "mechanic")
        .addChoice("Police", "police")
        .addChoice("YouTuber", "youtuber")
        .addChoice("Zero2Sixty Programmer", "zero2sixty programmer")
        .addChoice("Pizza Delivery", "pizza delivery")
    ),
  async execute(interaction) {
    let uid = interaction.user.id;

    let option = interaction.options.getString("option");
    let userdata = await User.findOne({ id: uid });
    if (option == "joblist") {
      let embed = new Discord.MessageEmbed()
        .setTitle("Job List")
        .addField(
          "Mechanic",
          `<:helmet_mechanic:967208601145974875>\nPrestige Required: 2\nStarting Rank: Tire Installer\nStarting Salary: $150/6 hours`,
          true
        )
        .addField(
          "Police",
          `<:helmet_police:967209460630171658>\nPrestige Required: 3\nStarting Rank: Cadet\nStarting Salary: $200 per chase\n\nChase other players, or chase bots in wanted!`,
          true
        )
        .addField(
          "YouTuber",
          `<:helmet_youtube:967208601435398164>\nPrestige Required: 4\nStarting Rank: 100 Subscribers\nStarting Salary: $50/1 hour`,
          true
        )
        .addField(
          "Zero2Sixty Programmer",
          `<:helmet_programmer:973390981179260928>\nPrestige Required: 7\nStarting Rank: Jr Web Developer\nStarting Salary: $400/6 hours`,
          true
        )
        .addField(
          "Pizza Delivery",
          `<:pizzaman:978186078802559007>\nPrestige Required: 5\nStarting Rank: Pizza Boy\nStarting Salary: $250/3 hours`,
          true
        )

        .setColor("#60b0f4");

      interaction.reply({ embeds: [embed] });
    } else if (option == "hire") {
      let job = userdata.job;
      if (job)
        return interaction.reply(
          "You already have a job! Quit it before getting another job."
        );
      let jobselected = interaction.options.getString("job");
      if (!jobselected)
        return interaction.reply("You need to select a job from the menu!");
      let prestige = userdata.prestige;

      if (!jobsdb.Jobs[jobselected.toLowerCase()])
        return interaction.reply("Thats not a job!");
      let jobdb = jobsdb.Jobs[jobselected.toLowerCase()];
      if (prestige < jobdb.Prestige || !prestige)
        return interaction.reply(
          `You need to be prestige ${
            jobsdb.Jobs[jobselected.toLowerCase()].Prestige
          } for this job!`
        );

      let jobobj = {
        Number: 1,
        Rank: jobdb.Ranks["1"].Name,
        EXP: 0,
        Salary: jobdb.Ranks["1"].Salary,
        Timeout: jobdb.Ranks["1"].Time,
        Job: jobselected,
        worked: 0,
      };

      userdata.job = jobobj;
      userdata.save();

      interaction.reply(`✅ You're hired!`);
    } else if (option == "rank") {
      let job = userdata.job;
      if (!job)
        return interaction.reply(
          "You don't have a job! Use `/work hire` to get a job!"
        );

      let jobrank = job.Rank;
      let num = job.Number;
      let salary = job.Salary;
      let exp = job.EXP;
      let timeout = job.Timeout;
      let actjob = job.Job;
      let time = pretty(timeout);
      let addednum = (num += 1);
      let requiredxp;
      if (jobsdb.Jobs[actjob].Ranks[addednum]) {
        requiredxp = jobsdb.Jobs[actjob].Ranks[addednum].XP;
      } else {
        requiredxp = "MAX";
      }
      let embed = new Discord.MessageEmbed()
        .setTitle(`Your rank for ${jobsdb.Jobs[actjob].Name}`)
        .setThumbnail(jobsdb.Jobs[actjob].Helmet)
        .setDescription(
          `Rank: ${jobrank}\nXP: ${exp}\/${requiredxp}\nSalary: $${salary}/${time}`
        )
        .setColor("#60b0f4");

      interaction.reply({ embeds: [embed] });
    } else if (option == "work") {
      let job = userdata.job;
      let worked = job.worked || 0;
      if (!job)
        return interaction.reply(
          "You don't have a job! Use `/work hire` to get a job!"
        );
      let timeoutj = job.Timeout;
      if (worked !== null && timeoutj - (Date.now() - worked) > 0) {
        let time = ms(timeoutj - (Date.now() - worked));
        let timeEmbed = new Discord.MessageEmbed()
          .setColor("#60b0f4")
          .setDescription(`You've already worked!\n\nWork again in ${time}.`);
        return interaction.reply({ embeds: [timeEmbed] });
      }

      let jobrank = job.Rank;
      let num = job.Number;
      let salary = job.Salary;
      let exp = job.EXP;
      let timeout = job.Timeout;
      let actjob = job.Job;
      let time = pretty(timeout);
      let addednum = (num += 1);
      let requiredxp;
      let jobdb = jobsdb.Jobs[actjob.toLowerCase()];
      if (jobsdb.Jobs[actjob].Ranks[addednum]) {
        requiredxp = jobsdb.Jobs[actjob].Ranks[addednum].XP;
      } else {
        requiredxp = "MAX";
      }

      let xp1 = randomRange(10, 20);
      let xp2 = randomRange(15, 25);

      if (actjob == "mechanic") {
        let questions = {
          1: {
            Question: `A customer needs their oil changed in their 1999 Honda Civic Si, please type the option they need`,
            Options: ["Oil", "Tire", "Gas", "Air Filter"],
            XP: xp1,
            Answer: "oil",
          },
          2: {
            Question: `A customer needs their tire changed in their 1999 Honda Civic Si, please type the option they need`,
            Options: ["Tire", "Oil", "Gas", "Intake"],
            XP: xp1,
            Answer: "tire",
          },
          3: {
            Question: `You need to loosen a screw, do you turn it left or right?`,
            Options: ["Right", "Left"],
            XP: xp2,
            Answer: "left",
          },
          4: {
            Question: `You need to tighten a screw, do you turn it left or right?`,
            Options: ["Right", "Left"],
            XP: xp2,
            Answer: "right",
          },
        };

        let question = lodash.sample(questions);

        let embed = new Discord.MessageEmbed()
          .setTitle(`Working...`)
          .setDescription(
            `Duties: ${
              question.Question
            }\n\n__Options__:\n${question.Options.join("\n")}`
          )
          .setColor("#60b0f4")
          .setThumbnail(jobsdb.Jobs[actjob].Helmet);
        interaction.reply({ embeds: [embed] });
        job.worked = Date.now();
        userdata.update();
        const filter = (m = discord.Message) => {
          return m.author.id === uid;
        };
        let choice,
          collector = interaction.channel.createMessageCollector({
            filter,
            max: 1,
            time: 1000 * 20,
          });

        collector.on("collect", (msg) => {
          if (msg.content.toLowerCase() !== question.Answer)
            return msg.reply(
              "Incorrect! Careful, if you keep messing up I'm firing you!"
            );

          if (requiredxp !== "MAX") {
            job.EXP += question.XP;
          }

          if (requiredxp !== "MAX" && job.EXP >= requiredxp) {
            msg.channel.send(
              `You just ranked up to ${jobsdb.Jobs[actjob].Ranks[addednum].Name}!`
            );
            job.Number += 1;
            job.Rank = jobdb.Ranks[`${addednum}`].Name;
            job.Salary = jobdb.Ranks[`${addednum}`].Salary;
            job.Timeout = jobdb.Ranks[`${addednum}`].Time;
            job.EXP = 0;
          }
          userdata.cash += Number(salary);

          userdata.save();
          msg.reply(
            `You've completed your job duties and earned yourself $${salary}, and ${question.XP} XP`
          );
        });
      } else if (actjob == "youtuber") {
        let jobrank = job.Rank;
        let num = job.Number;
        let salary = job.Salary;
        let exp = job.EXP;
        let timeout = job.Timeout;
        let actjob = job.Job;
        let time = pretty(timeout);
        let addednum = (num += 1);
        let requiredxp;
        let jobdb = jobsdb.Jobs[actjob.toLowerCase()];
        if (jobsdb.Jobs[actjob].Ranks[addednum]) {
          requiredxp = jobsdb.Jobs[actjob].Ranks[addednum].XP;
        } else {
          requiredxp = "MAX";
        }
        let videotypes1 = {
          gaming: {
            Games: ["Need That Speed", "FortZa", "Gran Brrismo"],
            Trending: false,
          },
          "car review": {
            Cars: [
              "1999 Honda Civic",
              "1991 Toyota MR2",
              "1999 Mitsubishi Eclipse",
            ],
            Trending: false,
          },
          podcast: {
            Topics: [
              "JDM or American cars?",
              "My favorite brand",
              "Best car ever",
            ],
            Trending: false,
          },
        };
        let cartrending = randomRange(1, 5);
        let gametrending = randomRange(1, 5);
        let podcasttrending = randomRange(1, 5);

        if (cartrending == 2) videotypes1["car review"].Trending = true;
        if (gametrending == 2) videotypes1["gaming"].Trending = true;
        if (podcasttrending == 2) videotypes1["podcast"].Trending = true;
        userdata.worked = Date.now();

        let type;
        let embed = new Discord.MessageEmbed()
          .setTitle("Video Types")
          .setDescription(
            `Gaming 🎮: Choose the correct reaction to game events\n\nCar Review 🚗: Choose the rating the audience agrees with or get half of your salary.`
          )
          .setColor("#60b0f4");

        interaction.reply({ embeds: [embed] });
        interaction.channel.send("Choose a video type!").then((emb) => {
          emb.react("🎮");
          emb.react("🚗");

          let filter = (_, u) => u.id === interaction.user.id;
          let rcollector = emb.createReactionCollector({
            filter,
            time: 300000,
          });
          rcollector.on("collect", async (r, user) => {
            emb.reactions.cache.get(r.emoji.name).users.remove(user.id);
            emb.reactions.cache
              .get(r.emoji.name)
              .users.remove(interaction.client.id);

            if (r.emoji.name === "🎮") {
              type = "gaming";

              rcollector.stop();
            } else if (r.emoji.name === "🚗") {
              type = "car review";

              rcollector.stop();
            }

            if (type == "gaming") {
              let reactiontuber = {
                sad: {
                  Question: "A sad thing just happened! Whats your reaction?",
                  Answer: "😭",
                },
                funny: {
                  Question: "A funny thing just happened! Whats your reaction?",
                  Answer: "😆",
                },
                funny: {
                  Question: "You crashed your car! Whats your reaction?",
                  Answer: "😡",
                },
              };
              let game = lodash.sample(videotypes1.gaming.Games);
              let gameimages = {
                "Need That Speed": {
                  Image: "https://i.ytimg.com/vi/8jiTNodDe-Y/maxresdefault.jpg",
                },
                FortZa: {
                  Image:
                    "https://i.pcmag.com/imagery/reviews/06vWN3yxcpku86WEFg5CoXb-5..v1633546079.jpg",
                },
                "Gran Brrismo": {
                  Image:
                    "https://car-images.bauersecure.com/pagefiles/76993/gt-sport_review_12.jpg",
                },
              };
              let imagegam = gameimages[game].Image;
              let reactiontub = lodash.sample(reactiontuber);

              let embed = new Discord.MessageEmbed()
                .setTitle(`Playing ${game}...`)
                .setDescription(`${reactiontub.Question}`)
                .setColor("#60b0f4")
                .setThumbnail(`${imagegam}`);

              interaction.channel.send({ embeds: [embed] }).then((emb) => {
                emb.react("😡");
                emb.react("😆");
                emb.react("😭");

                let overallscore = randomRange(5, 10);
                console.log(overallscore);

                let filter = (_, u) => u.id === interaction.user.id;
                let rcollector2 = emb.createReactionCollector({
                  filter,
                  time: 300000,
                });
                rcollector2.on("collect", async (r, user) => {
                  emb.reactions.cache.get(r.emoji.name).users.remove(user.id);
                  emb.reactions.cache
                    .get(r.emoji.name)
                    .users.remove(interaction.client.id);

                  if (r.emoji.name !== reactiontub.Answer) {
                    overallscore -= 2;
                    rcollector2.stop();

                    embed.addField(`???`, `\u200b`);
                    emb.edit({ embeds: [embed] });
                  } else if (r.emoji.name == reactiontub.Answer) {
                    overallscore += 2;
                    rcollector2.stop();
                    embed.addField(`Bonus!`, `\u200b`);
                    emb.edit({ embeds: [embed] });
                  }
                  let addedsubs = overallscore * 10;

                  let likes = overallscore * 2;

                  if (videotypes1[type].Trending) {
                    addedsubs *= 2;
                    embed.addField(`Trending!`, `\u200b`);
                    emb.edit({ embeds: [embed] });
                  }

                  setTimeout(() => {
                    embed.addField(`Results`, `New subscribers: ${addedsubs}`);

                    emb.edit({ embeds: [embed] });

                    if (requiredxp !== "MAX") {
                      job.EXP += addedsubs;
                    }

                    if (requiredxp !== "MAX" && job.EXP >= requiredxp) {
                      emb.channel.send(
                        `You just ranked up to ${jobsdb.Jobs[actjob].Ranks[addednum].Name}!`
                      );
                      job.Number += 1;
                      job.Rank = jobdb.Ranks[`${addednum}`].Name;
                      job.Salary = jobdb.Ranks[`${addednum}`].Salary;
                      job.Timeout = jobdb.Ranks[`${addednum}`].Time;
                      job.EXP = 0;
                    }
                    userdata.cash += Number(salary);

                    userdata.save();
                    emb.reply(
                      `You've completed your job duties and earned yourself $${salary}, and ${addedsubs} XP`
                    );
                  }, 2000);

                  console.log(overallscore);
                });
              });
            } else if (type == "car review") {
              let cartoreview = lodash.sample(videotypes1["car review"].Cars);

              let randomrating = randomRange(1, 10);

              interaction.channel.send(
                `Choose a rating to give to the ${cartoreview} out of 10, if your rating is close to what most people think you get a reward!`
              );
              let filter2 = (m = discord.Message) => {
                return m.author.id === uid;
              };
              let choice,
                collector = interaction.channel.createMessageCollector({
                  filter: filter2,
                  max: 1,
                  time: 1000 * 20,
                });

              collector.on("collect", (msg) => {
                let numbertorate = msg.content;

                if (isNaN(numbertorate))
                  return msg.reply("Thats not a number!");

                if (numbertorate > 10)
                  return msg.reply("Thats greater than 10!");
                let possiblenumbers;
                if (numbertorate == 1) {
                  possiblenumbers = [1, 2, 3];
                } else if (numbertorate == 2) {
                  possiblenumbers = [2, 3, 4];
                } else if (numbertorate == 3) {
                  possiblenumbers = [3, 4, 5];
                } else if (numbertorate == 4) {
                  possiblenumbers = [4, 5, 6];
                } else if (numbertorate == 5) {
                  possiblenumbers = [5, 6, 7];
                } else if (numbertorate == 6) {
                  possiblenumbers = [5, 6, 7];
                } else if (numbertorate == 7) {
                  possiblenumbers = [6, 7, 8];
                } else if (numbertorate == 8) {
                  possiblenumbers = [7, 8, 9];
                } else if (numbertorate == 9) {
                  possiblenumbers = [8, 9, 10];
                } else if (numbertorate == 10) {
                  possiblenumbers = [8, 9, 10];
                }
                if (possiblenumbers.includes(randomrating)) {
                  msg.reply(
                    `Your rating was ${numbertorate}/10 while the audience chose ${randomrating}/10, close enough, here's your reward: $${salary} and ${xp1} subscribers`
                  );
                  job.EXP += xp1;
                  userdata.cash += salary;
                }
                if (!possiblenumbers.includes(randomrating)) {
                  let newxp = Math.round(xp1 / 2);
                  let newsalary = Math.round(salary / 2);
                  msg.reply(
                    `Your rating was ${numbertorate}/10 while the audience chose ${randomrating}/10, you get half of your salary this time, $${newsalary} and ${newxp} subscribers`
                  );
                  job.EXP += newxp;
                  userdata.cash += newsalary;
                }
              });
            }
          });
        });
      } else if (actjob == "zero2sixty programmer") {
        let jobrank = job.Rank;
        let num = job.Number;
        let salary = job.Salary;
        let exp = job.EXP;
        let timeout = job.Timeout;
        let actjob = job.Job;
        let time = pretty(timeout);
        let addednum = (num += 1);
        let requiredxp;
        let jobdb = jobsdb.Jobs[actjob.toLowerCase()];
        if (jobsdb.Jobs[actjob].Ranks[addednum]) {
          requiredxp = jobsdb.Jobs[actjob].Ranks[addednum].XP;
        } else {
          requiredxp = "MAX";
        }

        let randomgames = ["clicker", "type"];
        let randomgame = lodash.sample(randomgames);
        job.worked = Date.now();
        userdata.update();

        if (randomgame == "clicker") {
          console.log("clicker");
          let row = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("green")
              .setEmoji("🖱️")
              .setStyle("SUCCESS"),
            new MessageButton()
              .setCustomId("red")
              .setEmoji("🖱️")
              .setStyle("DANGER")
          );

          let colors = ["green", "red"];
          let randomcolor = lodash.sample(colors);

          interaction.reply({
            content: `Click the ${randomcolor} button`,
            components: [row],
          });

          const filter = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };

          const collector = interaction.channel.createMessageComponentCollector(
            {
              filter,
              max: 1,
              time: 15000,
            }
          );

          collector.on("collect", async (i) => {
            if (i.customId.includes(randomcolor)) {
              await i.deferUpdate();
              if (requiredxp !== "MAX") {
                job.EXP += xp1;
              }

              if (requiredxp !== "MAX" && job.EXP >= requiredxp) {
                interaction.channel.send(
                  `You just ranked up to ${jobsdb.Jobs[actjob].Ranks[addednum].Name}!`
                );
                job.Number += 1;
                job.Rank = jobdb.Ranks[`${addednum}`].Name;
                job.Salary = jobdb.Ranks[`${addednum}`].Salary;
                job.Timeout = jobdb.Ranks[`${addednum}`].Time;
                job.EXP = 0;
              }
              userdata.cash += Number(salary);

              userdata.save();
              interaction.channel.send(
                `You've completed your job duties and earned yourself $${salary}, and ${xp1} XP`
              );
            } else {
              await i.deferUpdate();

              interaction.channel.send("Failed!");
            }
          });
        } else if (randomgame == "type") {
          console.log("type");

          let typing = [
            "hello world",
            "zero2sixty typing",
            "slash commands",
            `console.log("hi")`,
          ];
          let randomtype = lodash.sample(typing);
          interaction.reply({
            content: `Type \`${randomtype}\` in 10 seconds!`,
          });

          const filter = (m = discord.Message) => {
            return m.author.id === uid;
          };
          let choice,
            collector = interaction.channel.createMessageCollector({
              filter,
              max: 1,
              time: 1000 * 10,
            });

          collector.on("collect", (msg) => {
            if (msg.content.toLowerCase() !== randomtype)
              return msg.reply(
                "Incorrect! Careful, if you keep messing up I'm firing you!"
              );

            if (requiredxp !== "MAX") {
              job.EXP += xp1;
            }

            if (requiredxp !== "MAX" && job.EXP >= requiredxp) {
              msg.channel.send(
                `You just ranked up to ${jobsdb.Jobs[actjob].Ranks[addednum].Name}!`
              );
              job.Number += 1;
              job.Rank = jobdb.Ranks[`${addednum}`].Name;
              job.Salary = jobdb.Ranks[`${addednum}`].Salary;
              job.Timeout = jobdb.Ranks[`${addednum}`].Time;
              job.EXP = 0;
            }
            userdata.cash += Number(salary);

            userdata.save();
            msg.reply(
              `You've completed your job duties and earned yourself $${salary}, and ${xp1} XP`
            );
          });
          collector.on("end", (collected) => {
            if (collected.size == 0)
              return interaction.channel.send("You took too long!");
          });
        }
      } else if (actjob == "pizza delivery") {
        let jobrank = job.Rank;
        let num = job.Number;
        let salary = job.Salary;
        let exp = job.EXP;
        let timeout = job.Timeout;
        let actjob = job.Job;
        let time = pretty(timeout);
        let addednum = (num += 1);
        let requiredxp;
        let jobdb = jobsdb.Jobs[actjob.toLowerCase()];
        if (jobsdb.Jobs[actjob].Ranks[addednum]) {
          requiredxp = jobsdb.Jobs[actjob].Ranks[addednum].XP;
        } else {
          requiredxp = "MAX";
        }

        job.worked = Date.now();
        userdata.update();

        let randpizzas = ["2", "3", "5", "6"];
        let randpizza = lodash.sample(randpizzas);
        interaction.reply(
          `Remember that this customer wants ${randpizza} pizzas.`
        );
        setTimeout(() => {
          let row = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("2")
              .setLabel("2 🍕")
              .setStyle("SECONDARY"),
            new MessageButton()
              .setCustomId("5")
              .setLabel("5 🍕")
              .setStyle("SECONDARY"),
            new MessageButton()
              .setCustomId("3")
              .setLabel("3 🍕")
              .setStyle("SECONDARY"),
            new MessageButton()
              .setCustomId("6")
              .setLabel("6 🍕")
              .setStyle("SECONDARY")
          );

          interaction.editReply({
            content: `How many pizzas did they want?`,
            components: [row],
          });

          const filter = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };

          const collector = interaction.channel.createMessageComponentCollector(
            {
              filter,
              max: 1,
              time: 15000,
            }
          );

          collector.on("collect", async (i) => {
            if (i.customId == randpizza) {
              await i.deferUpdate();
              if (requiredxp !== "MAX") {
                job.EXP += xp1;
              }

              if (requiredxp !== "MAX" && job.EXP >= requiredxp) {
                interaction.channel.send(
                  `You just ranked up to ${jobsdb.Jobs[actjob].Ranks[addednum].Name}!`
                );
                job.Number += 1;
                job.Rank = jobdb.Ranks[`${addednum}`].Name;
                job.Salary = jobdb.Ranks[`${addednum}`].Salary;
                job.Timeout = jobdb.Ranks[`${addednum}`].Time;
                job.EXP = 0;
              }
              userdata.cash += Number(salary);

              userdata.save();
              interaction.channel.send(
                `You've completed your job duties and earned yourself $${salary}, and ${xp1} XP`
              );
            } else {
              await i.deferUpdate();

              interaction.channel.send("Failed!");
            }
          });
        }, 2000);
      }

      //  db.set(`worked_${uid}`, Date.now())

      //    }
    } else if (option == "quit") {
      let job = userdata.job;
      if (!job)
        return interaction.reply(
          "You don't have a job! Use `/work hire` to get a job!"
        );

      interaction.reply(
        "Are you sure you want to quit your job? This will erase all of your progress on that job. (Y/N)"
      );

      const filter2 = (m = discord.Message) => {
        return m.author.id === uid;
      };
      let choice,
        collector = interaction.channel.createMessageCollector({
          filter: filter2,
          max: 1,
          time: 1000 * 20,
        });

      collector.on("collect", async (msg) => {
        if (msg.content.toLowerCase() == "y") {
          await User.findOneAndUpdate(
            {
              id: uid,
            },
            {
              $unset: "job",
            }
          );
          userdata.save();

          interaction.channel.send("Sad to see you go!");
        } else if (msg.content.toLowerCase() == "n") {
          interaction.channel.send("Glad you've decided to stay!");
        } else {
          interaction.channel.send("Choose y (yes) or n (no)");
        }
      });
    }

    function randomRange(min, max) {
      return Math.round(Math.random() * (max - min)) + min;
    }

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
};
