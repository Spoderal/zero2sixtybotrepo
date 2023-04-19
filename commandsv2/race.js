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
let cardb = require("../data/cardb.json");
const lodash = require("lodash");
const petdb = require("../data/pets.json");
const {
  toCurrency,
  randomRange,
} = require("../common/utils");
const cratedb = require("../data/cratedb.json");
const helmetdb = require("../data/pfpsdb.json");
const partdb = require("../data/partsdb.json")

const ms = require("pretty-ms");
const itemdb = require("../data/items.json")

const { createCanvas, loadImage } = require("canvas");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const weather = require("../data/weather.json");

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
  async execute(interaction) {
    let user = interaction.user;
    let carsarray = [];

    for (let car1 in cardb.Cars) {
      let caroj = cardb.Cars[car1];
      carsarray.push(caroj);
    }
    
    let userdata = await User.findOne({ id: user.id });
    let usinginv = userdata.using
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
    let idtoselect = interaction.options.getString("car");
    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
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
    const row2 = new ActionRowBuilder().addComponents(
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
          .setStyle("Secondary"),
    );
    const row5 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Venus Race")
        .setEmoji("🪐")
        .setCustomId("venusrace")
        .setStyle("Primary"),
        new ButtonBuilder()
        .setLabel("Mars Race")
        .setEmoji("🪐")
        .setCustomId("marsrace")
        .setStyle("Primary"),
        new ButtonBuilder()
        .setLabel("Moon Race")
        .setEmoji("🪐")
        .setCustomId("moonrace")
        .setStyle("Primary"),
        new ButtonBuilder()
        .setLabel("Saturn Race")
        .setEmoji("🪐")
        .setCustomId("saturnrace")
        .setStyle("Primary"),
        new ButtonBuilder()
        .setLabel("Pluto Race")
        .setEmoji("🪐")
        .setCustomId("plutorace")
        .setStyle("Primary")
        
    );
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
    const tierrow2 = new ActionRowBuilder().addComponents(
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
    let usingmsg = []
    if(usinginv.includes("fruit punch")){
      usingmsg.push(`${itemdb["fruit punch"].Emote} ${itemdb["fruit punch"].Name} Active`)
    }
    let embed = new EmbedBuilder()
      .setTitle("Select a race")
      .setDescription(
        `**Select a race from the menu below**\n\nDifferent races have different difficulties, and rewards\n\n${usingmsg.join('\n')}`
      )
      .setColor(colors.blue)
      .setThumbnail(`${cardb.Cars[selected.Name.toLowerCase()].Image}`)
      .addFields({
        name: "Your car",
        value: `${selected.Emote} ${selected.Name}`,
      });

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row2, row5],
      fetchReply: true,
    });

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
      "crossrace",
      "venusrace",
      "marsrace",
      "moonrace",
      "saturnrace",
      "plutorace"
    ];
    collector.on("collect", async (i) => {
      console.log(i.customId);
      if (races.includes(i.customId)) {
        race = racedb.filter((r) => r.name == i.customId);
        let deftier = 1;
        let reward = race[0].reward;
        let rewardsarr = [];
        for (deftier; deftier <= race[0].tiers; deftier++) {
          let am = deftier * reward;
          rewardsarr.push(`Tier ${deftier} Reward: ${am}`);
        }
        embed.setTitle("Select a tier to race in (Difficulty)");
        embed.setDescription(`${rewardsarr.join("\n")}`);

        if (
          i.customId == "streetrace" ||
          i.customId == "highwayrace" ||
          i.customId == "halfmile" ||
          i.customId == "quartermile" ||
          i.customId == "crossrace" ||
          i.customId == "venusrace" ||
          i.customId == "marsrace" ||
          i.customId == "moonrace" ||
          i.customId == "saturnrace" ||
          i.customId == "plutorace" 
        ) {
          cooldowndata.racing = Date.now();
          cooldowndata.save();
        }

        console.log(race);

        await i.update({
          embeds: [embed],
          components: [tierrow, tierrow2],
          fetchReply: true,
        });
      } else if (
        i.customId == 1 ||
        i.customId == 2 ||
        i.customId == 3 ||
        i.customId == 4 ||
        i.customId == 5 ||
        i.customId == 6 ||
        i.customId == 7
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
          const canvas = createCanvas(1280, 720);
          const ctx = canvas.getContext("2d");
          const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
          const vsimg = await loadImage("https://i.ibb.co/HV63X20/VSIMG.png");
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


          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

          ctx.save();
          roundedImage(ctx, 640, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected2image, 640, 200, 640, 360);
          ctx.restore();

          ctx.save();
          roundedImage(ctx, 0, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected1image, 0, 200, 640, 360);
          ctx.restore();
          ctx.font = "40px sans-serif";
          ctx.fillStyle = "#ffffff";

          ctx.fillText(selected.Name, 75, 180);

          ctx.fillText(car2.Name, 845, 180);
          ctx.drawImage(vsimg, 0, 0, canvas.width, canvas.height);

          if (pet.name) {
            let petimage = await loadImage(petdb[pet.pet.toLowerCase()].Image);

            ctx.drawImage(petimage, 200, 200, 200, 200);
          }

          let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
            name: "profile-image.png",
          });

          console.log(weather2);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling 

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
            .setImage("attachment://profile-image.png");

          await i.editReply({
            content: "",
            embeds: [embed],
            files: [attachment],
            components: [],
            fetchReply: true,
          });


          weight = weight / 10
          weight2 = weight2 / 10
          let accms = acceleration * 10
          let accms2 = acceleration2 * 10
          handling = handling / 100
          handling2 = handling2 / 100

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;
          
          let i2 = setInterval(async () => {
            timer++;
            console.log(timer);
            let calc = (speed / 2)
            sec = (weight / calc)
            sec += handling
            calc = calc / sec;
            console.log(`calc: ${calc}`);
            console.log(`sec: ${sec}`);
            // car 2
            console.log(speed2);
            let calc2 = (speed2 / 2)
            sec2 = (weight2 / calc2)
            sec2 += handling2
            console.log(`sec2: ${sec2}`);

            calc2 = calc2 / sec2;
            console.log(`calc2: ${calc2}`);
            tracklength += calc;
            tracklength2 += calc2;

            if (tracklength > tracklength2 && timer == 10) {
              ctx.save();
              roundedImage(ctx, 640, 200, 640, 360, 20);
              ctx.stroke();
              ctx.clip();

              ctx.restore();
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);


                if(usinginv.includes("pet treats")){
                  let cooldown = cooldowndata.pettreats;
        let timeout = 600000;
        console.log(timeout - (Date.now() - cooldown));
        if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
          console.log("pulled");
          userdata.using.pull("pet treats");
          pet.xessence = petdb[pet.pet].Xessence
          userdata.update();
          interaction.channel.send("Your pet treats ran out! :(");
        } 
                }
                

                earnings.push(
                  `${petdb[pet.pet].Emote} +${xessneceearn} Xessence`
                );
                
                userdata.xessence += xessneceearn;
                userdata.newpet.love -= 5;
                userdata.newpet.hunger -= 5;
                userdata.newpet.thirst -= 3;

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


              if(usinginv.includes("flat tire")){
                let cooldown = cooldowndata.flattire;
      let timeout = 1800000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        userdata.using.pull("flat tire");
        userdata.update();
        interaction.channel.send("Your flat tire ran out! :(");
      } 
      else {
        cashwon = cashwon += (cashwon * 0.05)
      }
              }

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let raceranks = 1

              let using = userdata.using
              if(usinginv.includes("fruit punch")){
                let cooldown = cooldowndata.fruitpunch;
      let timeout = 60000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        userdata.using.pull("fruit punch");
        userdata.update();
        interaction.channel.send("Your orange juice ran out! :(");
      } else {
                raceranks = 2
      }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;
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
              embed.setImage(`attachment://profile-image.png`);

              await i.editReply({ embeds: [embed], files: [attachment] });

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
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
              embed.setImage(`attachment://profile-image.png`);
              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Street Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed], files: [attachment] });
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
        else  if (race[0].name == "venusrace") {
          if(selected.Tires !== "T1SpaceTires" && selected.Name !== "Mars Rover") return interaction.channel.send("You need space tires to race on this planet!")
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
          const canvas = createCanvas(1280, 720);
          const ctx = canvas.getContext("2d");
          const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
          const vsimg = await loadImage("https://i.ibb.co/HV63X20/VSIMG.png");
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


          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

          ctx.save();
          roundedImage(ctx, 640, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected2image, 640, 200, 640, 360);
          ctx.restore();

          ctx.save();
          roundedImage(ctx, 0, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected1image, 0, 200, 640, 360);
          ctx.restore();
          ctx.font = "40px sans-serif";
          ctx.fillStyle = "#ffffff";

          ctx.fillText(selected.Name, 75, 180);

          ctx.fillText(car2.Name, 845, 180);
          ctx.drawImage(vsimg, 0, 0, canvas.width, canvas.height);

          if (pet.name) {
            let petimage = await loadImage(petdb[pet.pet.toLowerCase()].Image);

            ctx.drawImage(petimage, 200, 200, 200, 200);
          }

          let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
            name: "profile-image.png",
          });

          console.log(weather2);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling 

          let speed = 0;
          let speed2 = 0;
          let randomgravity = randomRange(2000, 5000)

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Venus Race`)

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
            .setImage("attachment://profile-image.png");

          await i.editReply({
            content: "",
            embeds: [embed],
            files: [attachment],
            components: [],
            fetchReply: true,
          });
          let gravity = false
          setTimeout(async () => {
        

            let grow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setCustomId("gravity")
              .setEmoji("🪛")
              .setLabel("Pull gravity lever")
              .setStyle("Primary")
            )

           await i.editReply({
              components: [grow],
              fetchReply: true
            })

              collector.on('collect', async (i) => {
                if(i.customId.includes("gravity")){
                  gravity = true
                  await i.deferUpdate()
                }

              })

              setTimeout(async () => {
                await i.editReply({
                  components: [],
                  fetchReply: true
                })
              }, 2000);
              
       
            
          }, randomgravity);

       
          weight = weight * 10
          weight2 = weight2 * 10
          let accms = acceleration * 10
          let accms2 = acceleration2 * 10
          handling = handling / 100
          handling2 = handling2 / 100

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;
          let i2 = setInterval(async () => {
            timer++;
            console.log(timer);
            let calc = (speed / 2)
            sec = (weight / calc)
            sec += handling
            calc = calc / sec;
            console.log(`calc: ${calc}`);
            console.log(`sec: ${sec}`);
            // car 2
            console.log(speed2);
            let calc2 = (speed2 / 2)
            sec2 = (weight2 / calc2)
            sec2 += handling2
            console.log(`sec2: ${sec2}`);

            calc2 = calc2 / sec2;
            console.log(`calc2: ${calc2}`);
            tracklength += calc;
            tracklength2 += calc2;
            
            if(tracklength > tracklength2 && timer == 10 && gravity == false){
              embed.setTitle(`Tier ${bot} Venus Race lost! Your car flew off the planet!`);

              await i.editReply({ embeds: [embed], files: [attachment] });
            }
            else if(tracklength < tracklength2 && timer == 10 && gravity == false){
              embed.setTitle(`Tier ${bot} Venus Race lost! Your car flew off the planet!`);

              await i.editReply({ embeds: [embed], files: [attachment] });
            }

          
           else if (tracklength > tracklength2 && timer == 10 && gravity == true) {
              ctx.save();
              roundedImage(ctx, 640, 200, 640, 360, 20);
              ctx.stroke();
              ctx.clip();

              ctx.restore();
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                earnings.push(
                  `${petdb[pet.pet].Emote} +${xessneceearn} Xessence`
                );
                userdata.xessence += xessneceearn;
                userdata.newpet.love -= 5;
                userdata.newpet.hunger -= 5;
                userdata.newpet.thirst -= 3;

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

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let randompart = randomRange(1, 5)
              
              if(randompart > 3){
                earnings.push(
                  `${partdb.Parts["car hook"].Emote} +1 ${cratedb.Crates["car hook"].Name}`
                );
                userdata.parts.push("car hook")
              }
              let raceranks = 1
              earnings.push("<:moontokens:1044726056680161371> 1 Space Token")
              userdata.spacetokens += 1
              let using = userdata.using
              if(usinginv.includes("fruit punch")){
                let cooldown = cooldowndata.fruitpunch;
      let timeout = 60000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        userdata.using.pull("fruit punch");
        userdata.update();
        interaction.channel.send("Your orange juice ran out! :(");
      } else {
                raceranks = 2
      }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;
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
              embed.setTitle(`Tier ${bot} Venus Race won!`);
              embed.setImage(`attachment://profile-image.png`);

              await i.editReply({ embeds: [embed], files: [attachment] });

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
            else if (tracklength2 > tracklength && timer == 10 && gravity == true) {
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
              embed.setImage(`attachment://profile-image.png`);
              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Venus Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed], files: [attachment] });
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
        else  if (race[0].name == "marsrace") {
          if(selected.Tires !== "T1SpaceTires" && selected.Name !== "Mars Rover") return interaction.channel.send("You need space tires to race on this planet!")
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
          const canvas = createCanvas(1280, 720);
          const ctx = canvas.getContext("2d");
          const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
          const vsimg = await loadImage("https://i.ibb.co/HV63X20/VSIMG.png");
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


          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

          ctx.save();
          roundedImage(ctx, 640, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected2image, 640, 200, 640, 360);
          ctx.restore();

          ctx.save();
          roundedImage(ctx, 0, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected1image, 0, 200, 640, 360);
          ctx.restore();
          ctx.font = "40px sans-serif";
          ctx.fillStyle = "#ffffff";

          ctx.fillText(selected.Name, 75, 180);

          ctx.fillText(car2.Name, 845, 180);
          ctx.drawImage(vsimg, 0, 0, canvas.width, canvas.height);

          if (pet.name) {
            let petimage = await loadImage(petdb[pet.pet.toLowerCase()].Image);

            ctx.drawImage(petimage, 200, 200, 200, 200);
          }

          let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
            name: "profile-image.png",
          });

          console.log(weather2);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling 

          let speed = 0;
          let speed2 = 0;
          let randomgravity = randomRange(2000, 5000)

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Mars Race`)

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
            .setImage("attachment://profile-image.png");

          await i.editReply({
            content: "",
            embeds: [embed],
            files: [attachment],
            components: [],
            fetchReply: true,
          });
          let gravity = false
          setTimeout(async () => {
        

            let grow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setCustomId("gravity")
              .setEmoji("🪛")
              .setLabel("Pull gravity lever")
              .setStyle("Primary")
            )

           await i.editReply({
              components: [grow],
              fetchReply: true
            })

              collector.on('collect', async (i) => {
                if(i.customId.includes("gravity")){
                  gravity = true
                  await i.deferUpdate()
                }

              })

              setTimeout(async () => {
                await i.editReply({
                  components: [],
                  fetchReply: true
                })
              }, 2000);
              
       
            
          }, randomgravity);

       
          weight = weight * 5
          weight2 = weight2 * 5
          let accms = acceleration * 10
          let accms2 = acceleration2 * 10
          handling = handling / 100
          handling = handling / 100

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;
          let i2 = setInterval(async () => {
            timer++;
            console.log(timer);
            let calc = (speed)
            sec = (weight / calc)
            sec += handling
            calc = calc / sec;
            console.log(`calc: ${calc}`);
            console.log(`sec: ${sec}`);
            // car 2
            console.log(speed2);
            let calc2 = (speed2)
            sec2 = (weight2 / calc2)
            sec2 += handling2
            console.log(`sec2: ${sec2}`);

            calc2 = calc2 / sec2;
            console.log(`calc2: ${calc2}`);
            tracklength += calc;
            tracklength2 += calc2;
            
            if(tracklength > tracklength2 && timer == 10 && gravity == false){
              embed.setTitle(`Tier ${bot} Mars Race lost! Your car flew off the planet!`);

              await i.editReply({ embeds: [embed], files: [attachment] });
            }
            else if(tracklength < tracklength2 && timer == 10 && gravity == false){
              embed.setTitle(`Tier ${bot} Mars Race lost! Your car flew off the planet!`);

              await i.editReply({ embeds: [embed], files: [attachment] });
            }

          
           else if (tracklength > tracklength2 && timer == 10 && gravity == true) {
              ctx.save();
              roundedImage(ctx, 640, 200, 640, 360, 20);
              ctx.stroke();
              ctx.clip();

              ctx.restore();
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                earnings.push(
                  `${petdb[pet.pet].Emote} +${xessneceearn} Xessence`
                );
                userdata.xessence += xessneceearn;
                userdata.newpet.love -= 5;
                userdata.newpet.hunger -= 5;
                userdata.newpet.thirst -= 3;

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

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let randompart = randomRange(1, 5)
              
              if(randompart > 3){
                earnings.push(
                  `${partdb.Parts["nuclear core"].Emote} +1 ${cratedb.Crates["nuclear core"].Name}`
                );
                userdata.parts.push("nuclear core")
              }
              let raceranks = 1
              earnings.push("<:moontokens:1044726056680161371> 1 Space Token")
              userdata.spacetokens += 1
              let using = userdata.using
              if(usinginv.includes("fruit punch")){
                let cooldown = cooldowndata.fruitpunch;
      let timeout = 60000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        userdata.using.pull("fruit punch");
        userdata.update();
        interaction.channel.send("Your orange juice ran out! :(");
      } else {
                raceranks = 2
      }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;
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
              embed.setTitle(`Tier ${bot} Mars Race won!`);
              embed.setImage(`attachment://profile-image.png`);

              await i.editReply({ embeds: [embed], files: [attachment] });

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
            else if (tracklength2 > tracklength && timer == 10 && gravity == true) {
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
              embed.setImage(`attachment://profile-image.png`);
              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Mars Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed], files: [attachment] });
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
        else  if (race[0].name == "moonrace") {

          if(selected.Tires !== "T1SpaceTires" && selected.Name !== "Mars Rover") return interaction.channel.send("You need space tires to race on this planet!")
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
          const canvas = createCanvas(1280, 720);
          const ctx = canvas.getContext("2d");
          const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
          const vsimg = await loadImage("https://i.ibb.co/HV63X20/VSIMG.png");
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


          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

          ctx.save();
          roundedImage(ctx, 640, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected2image, 640, 200, 640, 360);
          ctx.restore();

          ctx.save();
          roundedImage(ctx, 0, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected1image, 0, 200, 640, 360);
          ctx.restore();
          ctx.font = "40px sans-serif";
          ctx.fillStyle = "#ffffff";

          ctx.fillText(selected.Name, 75, 180);

          ctx.fillText(car2.Name, 845, 180);
          ctx.drawImage(vsimg, 0, 0, canvas.width, canvas.height);

          if (pet.name) {
            let petimage = await loadImage(petdb[pet.pet.toLowerCase()].Image);

            ctx.drawImage(petimage, 200, 200, 200, 200);
          }

          let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
            name: "profile-image.png",
          });

          console.log(weather2);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling 

          let speed = 0;
          let speed2 = 0;
          let randomgravity = randomRange(2000, 5000)

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Moon Race`)

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
            .setImage("attachment://profile-image.png");

          await i.editReply({
            content: "",
            embeds: [embed],
            files: [attachment],
            components: [],
            fetchReply: true,
          });
          let gravity = false
          setTimeout(async () => {
        

            let grow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setCustomId("gravity")
              .setEmoji("🪛")
              .setLabel("Pull gravity lever")
              .setStyle("Primary")
            )

           await i.editReply({
              components: [grow],
              fetchReply: true
            })

              collector.on('collect', async (i) => {
                if(i.customId.includes("gravity")){
                  gravity = true
                  await i.deferUpdate()
                }

              })

              setTimeout(async () => {
                await i.editReply({
                  components: [],
                  fetchReply: true
                })
              }, 1500);
              
       
            
          }, randomgravity);

       
          weight = weight / 2
          weight2 = weight2 / 2
          let accms = acceleration * 10
          let accms2 = acceleration2 * 10
          handling = handling / 500
          handling2 = handling2 / 500

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;
          let i2 = setInterval(async () => {
            timer++;
            console.log(timer);
            let calc = (speed / 234)
            sec = (weight / calc)
            sec += handling
            calc = calc / sec;
            console.log(`calc: ${calc}`);
            console.log(`sec: ${sec}`);
            // car 2
            console.log(speed2);
            let calc2 = (speed2 / 234)
            sec2 = (weight2 / calc2)
            sec2 += handling2
            console.log(`sec2: ${sec2}`);

            calc2 = calc2 / sec2;
            console.log(`calc2: ${calc2}`);
            tracklength += calc;
            tracklength2 += calc2;
            
            if(tracklength > tracklength2 && timer == 10 && gravity == false){
              embed.setTitle(`Tier ${bot} Moon Race lost! Your car flew off the planet!`);

              await i.editReply({ embeds: [embed], files: [attachment] });
            }
            else if(tracklength < tracklength2 && timer == 10 && gravity == false){
              embed.setTitle(`Tier ${bot} Moon Race lost! Your car flew off the planet!`);

              await i.editReply({ embeds: [embed], files: [attachment] });
            }

          
           else if (tracklength > tracklength2 && timer == 10 && gravity == true) {
              ctx.save();
              roundedImage(ctx, 640, 200, 640, 360, 20);
              ctx.stroke();
              ctx.clip();

              ctx.restore();
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                earnings.push(
                  `${petdb[pet.pet].Emote} +${xessneceearn} Xessence`
                );
                userdata.xessence += xessneceearn;
                userdata.newpet.love -= 5;
                userdata.newpet.hunger -= 5;
                userdata.newpet.thirst -= 3;

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

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let randompart = randomRange(1, 5)
              
              if(randompart > 3){
                earnings.push(
                  `${partdb.Parts["metal frame"].Emote} +1 ${cratedb.Crates["metal frame"].Name}`
                );
                userdata.parts.push("metal frame")
              }
              let raceranks = 1
              earnings.push("<:moontokens:1044726056680161371> 1 Space Token")
              userdata.spacetokens += 1
              let using = userdata.using
              if(usinginv.includes("fruit punch")){
                let cooldown = cooldowndata.fruitpunch;
      let timeout = 60000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        userdata.using.pull("fruit punch");
        userdata.update();
        interaction.channel.send("Your orange juice ran out! :(");
      } else {
                raceranks = 2
      }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;
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
              embed.setTitle(`Tier ${bot} Moon Race won!`);
              embed.setImage(`attachment://profile-image.png`);

              await i.editReply({ embeds: [embed], files: [attachment] });

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
            else if (tracklength2 > tracklength && timer == 10 && gravity == true) {
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
              embed.setImage(`attachment://profile-image.png`);
              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Moon Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed], files: [attachment] });
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
        else  if (race[0].name == "saturnrace") {
          if(selected.Tires !== "T1SpaceTires" && selected.Name !== "Mars Rover") return interaction.channel.send("You need space tires to race on this planet!")
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
          const canvas = createCanvas(1280, 720);
          const ctx = canvas.getContext("2d");
          const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
          const vsimg = await loadImage("https://i.ibb.co/HV63X20/VSIMG.png");
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


          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

          ctx.save();
          roundedImage(ctx, 640, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected2image, 640, 200, 640, 360);
          ctx.restore();

          ctx.save();
          roundedImage(ctx, 0, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected1image, 0, 200, 640, 360);
          ctx.restore();
          ctx.font = "40px sans-serif";
          ctx.fillStyle = "#ffffff";

          ctx.fillText(selected.Name, 75, 180);

          ctx.fillText(car2.Name, 845, 180);
          ctx.drawImage(vsimg, 0, 0, canvas.width, canvas.height);

          if (pet.name) {
            let petimage = await loadImage(petdb[pet.pet.toLowerCase()].Image);

            ctx.drawImage(petimage, 200, 200, 200, 200);
          }

          let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
            name: "profile-image.png",
          });

          console.log(weather2);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling 

          let speed = 0;
          let speed2 = 0;
          let randomgravity = randomRange(2000, 5000)

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Saturn Race`)

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
            .setImage("attachment://profile-image.png");

          await i.editReply({
            content: "",
            embeds: [embed],
            files: [attachment],
            components: [],
            fetchReply: true,
          });
          let gravity = false
          setTimeout(async () => {
        

            let grow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setCustomId("gravity")
              .setEmoji("🪛")
              .setLabel("Pull gravity lever")
              .setStyle("Primary")
            )

           await i.editReply({
              components: [grow],
              fetchReply: true
            })

              collector.on('collect', async (i) => {
                if(i.customId.includes("gravity")){
                  gravity = true
                  await i.deferUpdate()
                }

              })

              setTimeout(async () => {
                await i.editReply({
                  components: [],
                  fetchReply: true
                })
              }, 1500);
              
       
            
          }, randomgravity);

       
          weight = weight / 5
          weight2 = weight2 / 5
          let accms = acceleration * 15
          let accms2 = acceleration2 * 15
          handling = handling / 300
          handling2 = handling2 / 300

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;
          let i2 = setInterval(async () => {
            timer++;
            console.log(timer);
            let calc = (speed / 234)
            sec = (weight / calc)
            sec += handling
            calc = calc / sec;
            console.log(`calc: ${calc}`);
            console.log(`sec: ${sec}`);
            // car 2
            console.log(speed2);
            let calc2 = (speed2 / 234)
            sec2 = (weight2 / calc2)
            sec2 += handling2
            console.log(`sec2: ${sec2}`);

            calc2 = calc2 / sec2;
            console.log(`calc2: ${calc2}`);
            tracklength += calc;
            tracklength2 += calc2;
            
            if(tracklength > tracklength2 && timer == 10 && gravity == false){
              embed.setTitle(`Tier ${bot} Saturn Race lost! Your car flew off the planet!`);

              await i.editReply({ embeds: [embed], files: [attachment] });
            }
            else if(tracklength < tracklength2 && timer == 10 && gravity == false){
              embed.setTitle(`Tier ${bot} Saturn Race lost! Your car flew off the planet!`);

              await i.editReply({ embeds: [embed], files: [attachment] });
            }

          
           else if (tracklength > tracklength2 && timer == 10 && gravity == true) {
              ctx.save();
              roundedImage(ctx, 640, 200, 640, 360, 20);
              ctx.stroke();
              ctx.clip();

              ctx.restore();
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                earnings.push(
                  `${petdb[pet.pet].Emote} +${xessneceearn} Xessence`
                );
                userdata.xessence += xessneceearn;
                userdata.newpet.love -= 5;
                userdata.newpet.hunger -= 5;
                userdata.newpet.thirst -= 3;

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

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let randompart = randomRange(1, 5)
              
              if(randompart > 3){
                earnings.push(
                  `${partdb.Parts["alien oil"].Emote} +1 ${cratedb.Crates["alien oil"].Name}`
                );
                userdata.parts.push("alien oil")
              }
              let raceranks = 1
              earnings.push("<:moontokens:1044726056680161371> 1 Space Token")
              userdata.spacetokens += 1
              let using = userdata.using
              if(usinginv.includes("fruit punch")){
                let cooldown = cooldowndata.fruitpunch;
      let timeout = 60000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        userdata.using.pull("fruit punch");
        userdata.update();
        interaction.channel.send("Your orange juice ran out! :(");
      } else {
                raceranks = 2
      }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;
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
              embed.setTitle(`Tier ${bot} Saturn Race won!`);
              embed.setImage(`attachment://profile-image.png`);

              await i.editReply({ embeds: [embed], files: [attachment] });

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
            else if (tracklength2 > tracklength && timer == 10 && gravity == true) {
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
              embed.setImage(`attachment://profile-image.png`);
              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Saturn Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed], files: [attachment] });
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
        else  if (race[0].name == "plutorace") {
          if(selected.Tires !== "T1SpaceTires" && selected.Name !== "Mars Rover") return interaction.channel.send("You need space tires to race on this planet!")
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
          const canvas = createCanvas(1280, 720);
          const ctx = canvas.getContext("2d");
          const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
          const vsimg = await loadImage("https://i.ibb.co/HV63X20/VSIMG.png");
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


          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

          ctx.save();
          roundedImage(ctx, 640, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected2image, 640, 200, 640, 360);
          ctx.restore();

          ctx.save();
          roundedImage(ctx, 0, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected1image, 0, 200, 640, 360);
          ctx.restore();
          ctx.font = "40px sans-serif";
          ctx.fillStyle = "#ffffff";

          ctx.fillText(selected.Name, 75, 180);

          ctx.fillText(car2.Name, 845, 180);
          ctx.drawImage(vsimg, 0, 0, canvas.width, canvas.height);

          if (pet.name) {
            let petimage = await loadImage(petdb[pet.pet.toLowerCase()].Image);

            ctx.drawImage(petimage, 200, 200, 200, 200);
          }

          let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
            name: "profile-image.png",
          });

          console.log(weather2);

          let mph = selected.Speed;

          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling
          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          mph2 = car2.Speed;

          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling 

          let speed = 0;
          let speed2 = 0;
          let randomgravity = randomRange(2000, 5000)

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Pluto Race`)

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
            .setImage("attachment://profile-image.png");

          await i.editReply({
            content: "",
            embeds: [embed],
            files: [attachment],
            components: [],
            fetchReply: true,
          });
          let gravity = false
          setTimeout(async () => {
        

            let grow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setCustomId("gravity")
              .setEmoji("🪛")
              .setLabel("Pull gravity lever")
              .setStyle("Primary")
            )

           await i.editReply({
              components: [grow],
              fetchReply: true
            })

              collector.on('collect', async (i) => {
                if(i.customId.includes("gravity")){
                  gravity = true
                  await i.deferUpdate()
                }

              })

              setTimeout(async () => {
                await i.editReply({
                  components: [],
                  fetchReply: true
                })
              }, 1500);
              
       
            
          }, randomgravity);

       
          weight = weight * 2
          weight2 = weight2 * 2
          let accms = acceleration * 10
          let accms2 = acceleration2 * 10
          handling = handling / 300
          handling2 = handling2 / 300

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          let timer = 0;
          let i2 = setInterval(async () => {
            timer++;
            console.log(timer);
            let calc = (speed / 234)
            sec = (weight / calc)
            sec += handling
            calc = calc / sec;
            console.log(`calc: ${calc}`);
            console.log(`sec: ${sec}`);
            // car 2
            console.log(speed2);
            let calc2 = (speed2 / 234)
            sec2 = (weight2 / calc2)
            sec2 += handling2
            console.log(`sec2: ${sec2}`);

            calc2 = calc2 / sec2;
            console.log(`calc2: ${calc2}`);
            tracklength += calc;
            tracklength2 += calc2;
            
            if(tracklength > tracklength2 && timer == 10 && gravity == false){
              embed.setTitle(`Tier ${bot} Pluto Race lost! Your car flew off the planet!`);

              await i.editReply({ embeds: [embed], files: [attachment] });
            }
            else if(tracklength < tracklength2 && timer == 10 && gravity == false){
              embed.setTitle(`Tier ${bot} Pluto Race lost! Your car flew off the planet!`);

              await i.editReply({ embeds: [embed], files: [attachment] });
            }

          
           else if (tracklength > tracklength2 && timer == 10 && gravity == true) {
              ctx.save();
              roundedImage(ctx, 640, 200, 640, 360, 20);
              ctx.stroke();
              ctx.clip();

              ctx.restore();
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }

              if (pet.name) {
                let xessneceearn = lodash.random(pet.xessence);

                earnings.push(
                  `${petdb[pet.pet].Emote} +${xessneceearn} Xessence`
                );
                userdata.xessence += xessneceearn;
                userdata.newpet.love -= 5;
                userdata.newpet.hunger -= 5;
                userdata.newpet.thirst -= 3;

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

              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let randompart = randomRange(1, 5)
              
              if(randompart > 3){
                earnings.push(
                  `${partdb.Parts["zionite pistons"].Emote} +1 ${cratedb.Crates["zionite pistons"].Name}`
                );
                userdata.parts.push("zionite pistons")
              }
              let raceranks = 1
              earnings.push("<:moontokens:1044726056680161371> 1 Space Token")
              userdata.spacetokens += 1
              let using = userdata.using
              if(usinginv.includes("fruit punch")){
                let cooldown = cooldowndata.fruitpunch;
      let timeout = 60000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        userdata.using.pull("fruit punch");
        userdata.update();
        interaction.channel.send("Your orange juice ran out! :(");
      } else {
                raceranks = 2
      }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.worldwins += 1;
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
              embed.setTitle(`Tier ${bot} Pluto Race won!`);
              embed.setImage(`attachment://profile-image.png`);

              await i.editReply({ embeds: [embed], files: [attachment] });

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
            else if (tracklength2 > tracklength && timer == 10 && gravity == true) {
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
              embed.setImage(`attachment://profile-image.png`);
              userdata.cash += cashlost;
              embed.setTitle(`Tier ${bot} Pluto Race lost!`);
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed], files: [attachment] });
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
        else if (race[0].name == "highwayrace") {
          let tracklength = 1000;
          let tracklength2 = 1000;
          await i.update({ content: "Please wait...", components: [] });
          console.log("street");
          console.log("race");
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;
          const canvas = createCanvas(1280, 720);
          const ctx = canvas.getContext("2d");
          const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
          const vsimg = await loadImage("https://i.ibb.co/HV63X20/VSIMG.png");
          let cashwon = parseInt(bot) * 250;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;
          let lockpicks = parseInt(bot) * 1;
          let wheelspins = parseInt(bot) * 1;

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

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

          ctx.save();
          roundedImage(ctx, 640, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected2image, 640, 200, 640, 360);
          ctx.restore();

          ctx.save();
          roundedImage(ctx, 0, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected1image, 0, 200, 640, 360);
          ctx.restore();
          ctx.font = "40px sans-serif";
          ctx.fillStyle = "#ffffff";

          ctx.fillText(selected.Name, 75, 180);

          ctx.fillText(car2.Name, 845, 180);
          ctx.drawImage(vsimg, 0, 0, canvas.width, canvas.height);

          if (weather2.Emote == "🌧️") {
            let weatherimg = await loadImage(
              "https://i.ibb.co/QYLgQMS/rain-png-transparent-9.png"
            );
            ctx.drawImage(weatherimg, 0, 0, canvas.width, canvas.height);
          } else if (weather2.Emote == "🌨️") {
            let weatherimg = await loadImage(
              "https://i.ibb.co/Rbydwdt/snow-png-images-transparent-download-1-1.png"
            );
            ctx.drawImage(weatherimg, 0, 0, canvas.width, canvas.height);
          }

          let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
            name: "profile-image.png",
          });

          console.log(weather2);

          let slipchance = weather2.Slip;
          let speedreduce = weather2.SpeedReduce;
          let mph;
          if (speedreduce > 0) {
            mph = selected.Speed -= speedreduce;
          } else {
            mph = selected.Speed;
          }
          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling / weather2.Grip;

          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          if (speedreduce > 0) {
            mph2 = car2.Speed -= speedreduce;
          } else {
            mph2 = car2.Speed;
          }
          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling / weather2.Grip;
          if (slipchance > 0) {
            let slip = randomRange(1, slipchance);
            if (slip >= 2) {
              mph -= 10;
            }
          }
          let speed = 0;
          let speed2 = 0;

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Highway Race ${weather2.Emote}`)

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
            .setImage("attachment://profile-image.png");

          await i.editReply({
            content: "",
            embeds: [embed],
            files: [attachment],
            components: [],
            fetchReply: true,
          });

          let accms = acceleration * 10
          let accms2 = acceleration2 * 10

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          handling = handling / 100
          handling2 = handling2 / 100
          let i2 = setInterval(async () => {
            let calc = (speed / 200)
            sec = (weight / calc)
            calc = calc / sec;
            console.log(`calc: ${calc}`);
            console.log(`sec: ${sec}`);
            // car 2
            console.log(speed2);
            let calc2 = (speed2 / 200)
            sec2 = (weight2 / calc2)
            console.log(`sec2: ${sec2}`);

            calc2 = calc2 / sec2;
            console.log(`calc2: ${calc2}`);
            tracklength -= calc;
            tracklength2 -= calc2;

            if (tracklength <= 0) {
              ctx.save();
              roundedImage(ctx, 640, 200, 640, 360, 20);
              ctx.stroke();
              ctx.clip();

              ctx.restore();
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);
              earnings.push(`${emotes.wheelSpin} +${wheelspins}`);
              earnings.push(`${emotes.lockpicks} +${lockpicks}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }

              let raceranks = 1

              let using = userdata.using
              if(usinginv.includes("fruit punch")){
                let cooldown = cooldowndata.fruitpunch;
      let timeout = 60000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        userdata.using.pull("fruit punch");
        userdata.update();
        interaction.channel.send("Your orange juice ran out! :(");
      } else {
                raceranks = 2
      }
              }
                   if(usinginv.includes("fruit punch")){
                let cooldown = cooldowndata.fruitpunch;
      let timeout = 60000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        userdata.using.pull("fruit punch");
        userdata.update();
        interaction.channel.send("Your orange juice ran out! :(");
      } else {
                raceranks = 2
      }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              userdata.wheelspins += wheelspins;
              userdata.lockpicks += lockpicks;

              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(`Tier ${bot} Highway Race won! ${weather2.Emote}`);
              embed.setImage(`attachment://profile-image.png`);

              await i.editReply({ embeds: [embed], files: [attachment] });

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
              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (tracklength2 <= 0) {
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
              embed.setImage(`attachment://profile-image.png`);
              userdata.cash += cashlost;
              embed.setTitle(
                `Tier ${bot} Highway Race lost! ${weather2.Emote}`
              );
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed], files: [attachment] });
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
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "halfmile") {
          let tracklength = 800;
          let tracklength2 = 800;
          await i.update({ content: "Please wait...", components: [] });
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;
          const canvas = createCanvas(1280, 720);
          const ctx = canvas.getContext("2d");
          const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
          const vsimg = await loadImage("https://i.ibb.co/HV63X20/VSIMG.png");
          let cashwon = parseInt(bot) * 250;
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

          let craterare = randomRange(1, 3);

          let crateearned;

          if (craterare == 2) {
            crateearned = "common crate";
          } else if (craterare == 3) {
            crateearned = "rare crate";
          }

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

          ctx.save();
          roundedImage(ctx, 640, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected2image, 640, 200, 640, 360);
          ctx.restore();

          ctx.save();
          roundedImage(ctx, 0, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected1image, 0, 200, 640, 360);
          ctx.restore();
          ctx.font = "40px sans-serif";
          ctx.fillStyle = "#ffffff";

          ctx.fillText(selected.Name, 75, 180);

          ctx.fillText(car2.Name, 845, 180);
          ctx.drawImage(vsimg, 0, 0, canvas.width, canvas.height);

          if (weather2.Emote == "🌧️") {
            let weatherimg = await loadImage(
              "https://i.ibb.co/QYLgQMS/rain-png-transparent-9.png"
            );
            ctx.drawImage(weatherimg, 0, 0, canvas.width, canvas.height);
          } else if (weather2.Emote == "🌨️") {
            let weatherimg = await loadImage(
              "https://i.ibb.co/Rbydwdt/snow-png-images-transparent-download-1-1.png"
            );
            ctx.drawImage(weatherimg, 0, 0, canvas.width, canvas.height);
          }

          let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
            name: "profile-image.png",
          });

          console.log(weather2);

          let slipchance = weather2.Slip;
          let speedreduce = weather2.SpeedReduce;
          let mph;
          if (speedreduce > 0) {
            mph = selected.Speed -= speedreduce;
          } else {
            mph = selected.Speed;
          }
          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling / weather2.Grip;

          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          if (speedreduce > 0) {
            mph2 = car2.Speed -= speedreduce;
          } else {
            mph2 = car2.Speed;
          }
          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling / weather2.Grip;
          if (slipchance > 0) {
            let slip = randomRange(1, slipchance);
            if (slip >= 2) {
              mph -= 10;
            }
          }
          let speed = 0;
          let speed2 = 0;

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Half Mile Race ${weather2.Emote}`)

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
            .setImage("attachment://profile-image.png");

          await i.editReply({
            content: "",
            embeds: [embed],
            files: [attachment],
            components: [],
            fetchReply: true,
          });


          let accms = acceleration * 10
          let accms2 = acceleration2 * 10

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          handling = handling / 100
          handling2 = handling2 / 100
          let i2 = setInterval(async () => {
            let calc = (speed / 200)
            sec = (weight / calc)
            calc = calc / sec;
            console.log(`calc: ${calc}`);
            console.log(`sec: ${sec}`);
            // car 2
            console.log(speed2);
            let calc2 = (speed2 / 200)
            sec2 = (weight2 / calc2)
            console.log(`sec2: ${sec2}`);

            calc2 = calc2 / sec2;
            console.log(`calc2: ${calc2}`);
            tracklength -= calc;
            tracklength2 -= calc2;
            if (tracklength <= 0) {
              ctx.save();
              roundedImage(ctx, 640, 200, 640, 360, 20);
              ctx.stroke();
              ctx.clip();

              ctx.restore();
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let raceranks = 1

              let using = userdata.using
              if(usinginv.includes("fruit punch")){
                let cooldown = cooldowndata.fruitpunch;
      let timeout = 60000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        userdata.using.pull("fruit punch");
        userdata.update();
        interaction.channel.send("Your orange juice ran out! :(");
      } else {
                raceranks = 2
      }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;

              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(
                `Tier ${bot} Half Mile Race won! ${weather2.Emote}`
              );
              embed.setImage(`attachment://profile-image.png`);

              await i.editReply({ embeds: [embed], files: [attachment] });

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
              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (tracklength2 <= 0) {
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
              embed.setImage(`attachment://profile-image.png`);
              userdata.cash += cashlost;
              embed.setTitle(
                `Tier ${bot} Half Mile Race lost! ${weather2.Emote}`
              );
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed], files: [attachment] });
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
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "quartermile") {
          let tracklength = 400;
          let tracklength2 = 400;
          await i.update({ content: "Please wait...", components: [] });
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;
          const canvas = createCanvas(1280, 720);
          const ctx = canvas.getContext("2d");
          const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
          const vsimg = await loadImage("https://i.ibb.co/HV63X20/VSIMG.png");
          let cashwon = parseInt(bot) * 200;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;
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

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

          ctx.save();
          roundedImage(ctx, 640, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected2image, 640, 200, 640, 360);
          ctx.restore();

          ctx.save();
          roundedImage(ctx, 0, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected1image, 0, 200, 640, 360);
          ctx.restore();
          ctx.font = "40px sans-serif";
          ctx.fillStyle = "#ffffff";

          ctx.fillText(selected.Name, 75, 180);

          ctx.fillText(car2.Name, 845, 180);
          ctx.drawImage(vsimg, 0, 0, canvas.width, canvas.height);

          if (weather2.Emote == "🌧️") {
            let weatherimg = await loadImage(
              "https://i.ibb.co/QYLgQMS/rain-png-transparent-9.png"
            );
            ctx.drawImage(weatherimg, 0, 0, canvas.width, canvas.height);
          } else if (weather2.Emote == "🌨️") {
            let weatherimg = await loadImage(
              "https://i.ibb.co/Rbydwdt/snow-png-images-transparent-download-1-1.png"
            );
            ctx.drawImage(weatherimg, 0, 0, canvas.width, canvas.height);
          }

          let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
            name: "profile-image.png",
          });

          console.log(weather2);

          let slipchance = weather2.Slip;
          let speedreduce = weather2.SpeedReduce;
          let mph;
          if (speedreduce > 0) {
            mph = selected.Speed -= speedreduce;
          } else {
            mph = selected.Speed;
          }
          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling / weather2.Grip;

          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          if (speedreduce > 0) {
            mph2 = car2.Speed -= speedreduce;
          } else {
            mph2 = car2.Speed;
          }
          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling / weather2.Grip;
          if (slipchance > 0) {
            let slip = randomRange(1, slipchance);
            if (slip >= 2) {
              mph -= 10;
            }
          }
          let speed = 0;
          let speed2 = 0;

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Quarter Mile Race ${weather2.Emote}`)

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
            .setImage("attachment://profile-image.png");

          await i.editReply({
            content: "",
            embeds: [embed],
            files: [attachment],
            components: [],
            fetchReply: true,
          });

          let accms = acceleration * 10
          let accms2 = acceleration2 * 10

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          handling = handling / 100
          handling2 = handling2 / 100
          let i2 = setInterval(async () => {
            let calc = (speed / 200)
            sec = (weight / calc)
            calc = calc / sec;
            console.log(`calc: ${calc}`);
            console.log(`sec: ${sec}`);
            // car 2
            console.log(speed2);
            let calc2 = (speed2 / 200)
            sec2 = (weight2 / calc2)
            console.log(`sec2: ${sec2}`);

            calc2 = calc2 / sec2;
            console.log(`calc2: ${calc2}`);
            tracklength -= calc;
            tracklength2 -= calc2;

            if (tracklength <= 0) {
              ctx.save();
              roundedImage(ctx, 640, 200, 640, 360, 20);
              ctx.stroke();
              ctx.clip();

              ctx.restore();
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
              }
              if (commonkeys && commonkeys > 0) {
                earnings.push(`${emotes.ckey} +${commonkeys}`);
                userdata.ckeys += commonkeys;
              }
              if (rarekeys && rarekeys > 0) {
                earnings.push(`${emotes.rkey} +${rarekeys}`);
                userdata.rkeys += rarekeys;
              }
              if (exotickeys && exotickeys > 0) {
                earnings.push(`${emotes.ekey} +${exotickeys}`);
                userdata.ekeys += exotickeys;
              }
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              let raceranks = 1

              let using = userdata.using
              if(usinginv.includes("fruit punch")){
                let cooldown = cooldowndata.fruitpunch;
      let timeout = 60000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        userdata.using.pull("fruit punch");
        userdata.update();
        interaction.channel.send("Your orange juice ran out! :(");
      } else {
                raceranks = 2
      }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;
              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(
                `Tier ${bot} Quarter Mile Race won! ${weather2.Emote}`
              );
              embed.setImage(`attachment://profile-image.png`);

              await i.editReply({ embeds: [embed], files: [attachment] });

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
              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (tracklength2 <= 0) {
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
              embed.setImage(`attachment://profile-image.png`);
              userdata.cash += cashlost;
              embed.setTitle(
                `Tier ${bot} Quarter Mile Race lost! ${weather2.Emote}`
              );
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed], files: [attachment] });
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
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        } else if (race[0].name == "crossrace") {
          let itemdb = require('../data/items.json')
          let findables = []
          for(let ite in itemdb){
            if(itemdb[ite].Findable == true){
              findables.push(itemdb[ite])
            }
          }
          let tracklength = 2500;
          let tracklength2 = 2500;
          await i.update({ content: "Please wait...", components: [] });
          let weather2 = lodash.sample(weather);
          let car2;
          let bot = i.customId;
          const canvas = createCanvas(1280, 720);
          const ctx = canvas.getContext("2d");
          const bg = await loadImage("https://i.ibb.co/b7WGPX2/bgqm.png");
          const vsimg = await loadImage("https://i.ibb.co/HV63X20/VSIMG.png");
          let cashwon = parseInt(bot) * 350;
          let rpwon = parseInt(bot) * 2;
          let cashlost = parseInt(bot) * 20;
          let commonmaps;
          let raremaps;
          let legendarymaps;
          let itemfound 
          let itemsucc = lodash.random(5)

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
            itemfound = lodash.sample(findables)
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 210
            );
            legendarymaps = 1;
          } else if (bot == 6) {
            itemfound = lodash.sample(findables)
            car2 = carsarray.filter(
              (car) => car.Class == "S" && car.Speed < 220
            );
            legendarymaps = 2;
          } else if (bot == 7) {
            itemfound = lodash.sample(findables)
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

          let selected1image = await loadImage(
            `${cardb.Cars[selected.Name.toLowerCase()].Image}`
          );
          let selected2image = await loadImage(`${car2.Image}`);

          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

          ctx.save();
          roundedImage(ctx, 640, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected2image, 640, 200, 640, 360);
          ctx.restore();

          ctx.save();
          roundedImage(ctx, 0, 200, 640, 360, 20);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(selected1image, 0, 200, 640, 360);
          ctx.restore();
          ctx.font = "40px sans-serif";
          ctx.fillStyle = "#ffffff";

          ctx.fillText(selected.Name, 75, 180);

          ctx.fillText(car2.Name, 845, 180);
          ctx.drawImage(vsimg, 0, 0, canvas.width, canvas.height);

          if (weather2.Emote == "🌧️") {
            let weatherimg = await loadImage(
              "https://i.ibb.co/QYLgQMS/rain-png-transparent-9.png"
            );
            ctx.drawImage(weatherimg, 0, 0, canvas.width, canvas.height);
          } else if (weather2.Emote == "🌨️") {
            let weatherimg = await loadImage(
              "https://i.ibb.co/Rbydwdt/snow-png-images-transparent-download-1-1.png"
            );
            ctx.drawImage(weatherimg, 0, 0, canvas.width, canvas.height);
          }

          let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
            name: "profile-image.png",
          });

          console.log(weather2);

          let slipchance = weather2.Slip;
          let speedreduce = weather2.SpeedReduce;
          let mph;
          if (speedreduce > 0) {
            mph = selected.Speed -= speedreduce;
          } else {
            mph = selected.Speed;
          }
          let weight =
            selected.WeightStat ||
            cardb.Cars[selected.Name.toLowerCase()].Weight;
          let acceleration = selected.Acceleration;
          let handling = selected.Handling / weather2.Grip;

          if (!selected.WeightStat) {
            selected.WeightStat =
              cardb.Cars[selected.Name.toLowerCase()].Weight;
          }

          let mph2;

          if (speedreduce > 0) {
            mph2 = car2.Speed -= speedreduce;
          } else {
            mph2 = car2.Speed;
          }
          let weight2 = car2.Weight;
          let acceleration2 = car2["0-60"];
          let handling2 = car2.Handling / weather2.Grip;
          if (slipchance > 0) {
            let slip = randomRange(1, slipchance);
            if (slip >= 2) {
              mph -= 10;
            }
          }
          let speed = 0;
          let speed2 = 0;

          let sec;
          let sec2;
          handling = Math.floor(handling);
          handling2 = Math.floor(handling2);
          let helmet = helmetdb.Pfps[userdata.helmet.toLowerCase()];

          let embed = new EmbedBuilder()
            .setTitle(`Racing Tier ${bot} Cross Country Race ${weather2.Emote}`)

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
            .setImage("attachment://profile-image.png");

          await i.editReply({
            content: "",
            embeds: [embed],
            files: [attachment],
            components: [],
            fetchReply: true,
          });

          let accms = acceleration * 10
          let accms2 = acceleration2 * 10

          let x = setInterval(() => {
            if (speed < mph) {
              speed++;
            } else {
              clearInterval(x);
            }
          }, accms);
          let x2 = setInterval(() => {
            if (speed2 < mph2) {
              speed2++;
            } else {
              clearInterval(x2);
            }
          }, accms2);
          handling = handling / 100
          handling2 = handling2 / 100
          let i2 = setInterval(async () => {
            let calc = (speed / 234)
            sec = (weight / calc)
            sec += handling
            calc = calc / sec;
            console.log(`calc: ${calc}`);
            console.log(`sec: ${sec}`);
            // car 2
            console.log(speed2);
            let calc2 = (speed2 / 234)
            sec2 = (weight2 / calc2)
            sec2 += handling2
            console.log(`sec2: ${sec2}`);

            calc2 = calc2 / sec2;

            console.log(`calc2: ${calc2}`);
            console.log(`sec2: ${sec2}`);
            tracklength -= calc;
            tracklength2 -= calc2;

            console.log(tracklength);

            if (tracklength <= 0) {
              ctx.save();
              roundedImage(ctx, 640, 200, 640, 360, 20);
              ctx.stroke();
              ctx.clip();

              ctx.restore();
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
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
              if (weather2.Reward > 0) {
                cashwon = cashwon += weather2.Reward;
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
              earnings.push(`${emotes.cash} +${toCurrency(cashwon)}`);
              earnings.push(`${emotes.rp} +${rpwon}`);

              if (crateearned !== undefined) {
                userdata.items.push(crateearned);
                earnings.push(
                  `${cratedb.Crates[crateearned].Emote} +1 ${cratedb.Crates[crateearned].Name}`
                );
              }
              if(itemfound !== undefined){
                if(itemsucc == 3){
                  userdata.items.push(itemfound.Name.toLowerCase());
                  earnings.push(
                    `${itemfound.Emote} +1 ${itemfound.Name}`
                  );

                }
              }

              let raceranks = 1

              let using = userdata.using
              if(usinginv.includes("fruit punch")){
                let cooldown = cooldowndata.fruitpunch;
      let timeout = 60000;
      console.log(timeout - (Date.now() - cooldown));
      if (cooldown !== null && timeout - (Date.now() - cooldown) < 0) {
        console.log("pulled");
        userdata.using.pull("fruit punch");
        userdata.update();
        interaction.channel.send("Your orange juice ran out! :(");
      } else {
                raceranks = 2
      }
              }
              userdata.racerank += raceranks;

              userdata.cash += cashwon;
              userdata.rp3 += rpwon;

              embed.setDescription(`${earnings.join("\n")}`);
              embed.setTitle(
                `Tier ${bot} Cross Country Race won! ${weather2.Emote}`
              );
              embed.setImage(`attachment://profile-image.png`);

              await i.editReply({ embeds: [embed], files: [attachment] });

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
              clearInterval(i2);
              userdata.save();

              console.log(`track length ${tracklength}`);
              console.log(`track length 2 ${tracklength2}`);
            }
            // lost
            else if (tracklength2 <= 0) {
              attachment = new AttachmentBuilder(await canvas.toBuffer(), {
                name: "profile-image.png",
              });
              embed.setImage(`attachment://profile-image.png`);
              userdata.cash += cashlost;
              embed.setTitle(
                `Tier ${bot} Cross Country Race lost! ${weather2.Emote}`
              );
              embed.setDescription(`${emotes.cash} +${toCurrency(cashlost)}`);

              await i.editReply({ embeds: [embed], files: [attachment] });
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
              clearInterval(i2);
              userdata.save();
            }
          }, 1000);
        }
      }
    });
  },
};

function roundedImage(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
