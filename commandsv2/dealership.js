const cars = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  SelectMenuBuilder,
  EmbedBuilder,
  ButtonBuilder,
  CommandInteractionOptionResolver,
} = require("discord.js");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { toCurrency, numberWithCommas } = require("../common/utils");
const { tipFooterPurchaseCar } = require("../common/tips");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dealer")
    .setDescription("The car dealership"),
  async execute(interaction) {
    let userdata =
      (await User.findOne({ id: interaction.user.id })) ||
      (await new User({ id: interaction.user.id }));
    let usercars = userdata.cars || [];
    let carclassDarr = [];
    let carclassCarr = [];
    let carclassBarr = [];
    let carclassAarr = [];
    let carclassSarr = [];
    let carclassParr = [];
    let carEventarr = [];
    let newcars = [
      cars.Cars["2016 bmw m4 gts"],
      cars.Cars["2018 bmw m4cs"],
      cars.Cars["2016 bugatti chiron pur sport"],
      cars.Cars["2019 mclaren senna gtr"],
      cars.Cars["2010 pagani zonda r evolution"],
      cars.Cars["2017 ferrari 488 gte"],
      cars.Cars["2021 alpine a110 r"],
    ];
    let global = await Global.findOne();
    let carstock = global.stock;
    let carsarray = [];
    if (userdata.police == false) {
      for (let c in cars.Cars) {
        let car = cars.Cars[c];
        carsarray.push(car);
        if (car.Class == "D" && car.Price > 0 && !car.Police) {
          if (car.Stock) {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassDarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "✅",

                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            } else {
              carclassDarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "❌",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            }
          } else {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassDarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "✅",
              });
            } else {
              carclassDarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "❌",
              });
            }
          }
        } else if (car.Class == "C" && car.Price > 0 && !car.Police) {
          if (car.Stock) {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassCarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "✅",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            } else {
              carclassCarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "❌",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            }
          } else {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassCarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "✅",
              });
            } else {
              carclassCarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "❌",
              });
            }
          }
        } else if (car.Class == "B" && car.Price > 0 && !car.Police) {
          if (car.Stock) {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassBarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "✅",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            } else {
              carclassBarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "❌",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            }
          } else {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassBarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "✅",
              });
            } else {
              carclassBarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "❌",
              });
            }
          }
        } else if (car.Class == "A" && car.Price > 0 && !car.Police) {
          if (car.Stock) {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassAarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "✅",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            } else {
              carclassAarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "❌",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            }
          } else {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassAarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "✅",
              });
            } else {
              carclassAarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "❌",
              });
            }
          }
        } else if (car.Class == "S" && car.Price > 0 && !car.Police) {
          if (car.Stock) {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassSarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "✅",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            } else {
              carclassSarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "❌",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            }
          } else {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassSarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "✅",
              });
            } else {
              carclassSarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                owned: "❌",
              });
            }
          }
        } else if (car.Exclusive && car.Price == 0 && !car.Police) {
          if (car.Stock) {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carEventarr.push({
                Name: car.Name,
                Exclusive: car.Exclusive,
                alias: car.alias,
                Emote: car.Emote,
                owned: "✅",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            } else {
              carEventarr.push({
                Name: car.Name,
                Exclusive: car.Exclusive,
                alias: car.alias,
                Emote: car.Emote,
                owned: "❌",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            }
          } else {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carEventarr.push({
                Name: car.Name,
                Exclusive: car.Exclusive,
                alias: car.alias,
                Emote: car.Emote,
                owned: "✅",
              });
            } else {
              carEventarr.push({
                Name: car.Name,
                Exclusive: car.Exclusive,
                alias: car.alias,
                Emote: car.Emote,
                owned: "❌",
              });
            }
          }
        }
      }
    } else if (userdata.police == true) {
      for (let c in cars.Cars) {
        let car = cars.Cars[c];
        carsarray.push(car);
        if (car.Class == "D" && car.Price > 0 && car.Police) {
          if (car.Stock) {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassDarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "✅",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            } else {
              carclassDarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "❌",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            }
          } else {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassDarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "✅",
              });
            } else {
              carclassDarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "❌",
              });
            }
          }
        } else if (car.Class == "C" && car.Price > 0 && car.Police) {
          if (car.Stock) {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassCarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "✅",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            } else {
              carclassCarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "❌",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            }
          } else {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassCarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "✅",
              });
            } else {
              carclassCarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "❌",
              });
            }
          }
        } else if (car.Class == "B" && car.Price > 0 && car.Police) {
          if (car.Stock) {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassBarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "✅",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            } else {
              carclassBarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "❌",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            }
          } else {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassBarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "✅",
              });
            } else {
              carclassBarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "❌",
              });
            }
          }
        } else if (car.Class == "A" && car.Price > 0 && car.Police) {
          if (car.Stock) {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassAarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "✅",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            } else {
              carclassAarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "❌",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            }
          } else {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassAarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "✅",
              });
            } else {
              carclassAarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "❌",
              });
            }
          }
        } else if (car.Class == "S" && car.Price > 0 && car.Police) {
          if (car.Stock) {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassSarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "✅",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            } else {
              carclassSarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "❌",
                Stock: carstock[car.Name.toLowerCase()].Stock,
              });
            }
          } else {
            let owned2 = usercars.filter((caru) => caru.Name == car.Name);
            if (owned2[0]) {
              carclassSarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "✅",
              });
            } else {
              carclassSarr.push({
                Name: car.Name,
                Price: car.Price,
                alias: car.alias,
                Emote: car.Emote,
                Rank: car.Rank,
                owned: "❌",
              });
            }
          }
        }
      }
    }
    carclassDarr = carclassDarr.sort((a, b) => {
      return a.Price - b.Price;
    });
    carclassCarr = carclassCarr.sort((a, b) => {
      return a.Price - b.Price;
    });

    carclassBarr = carclassBarr.sort((a, b) => {
      return a.Price - b.Price;
    });

    carclassAarr = carclassAarr.sort((a, b) => {
      return a.Price - b.Price;
    });

    carclassSarr = carclassSarr.sort((a, b) => {
      return a.Price - b.Price;
    });
    carEventarr = carEventarr.sort((a, b) => {
      return a.Price - b.Price;
    });
    newcars = newcars.sort((a, b) => {
      return a.Price - b.Price;
    });

    carclassDarr = lodash.chunk(
      carclassDarr.map((a) => a),
      10
    );

    carclassCarr = lodash.chunk(
      carclassCarr.map((a) => a),
      10
    );

    carclassBarr = lodash.chunk(
      carclassBarr.map((a) => a),
      10
    );

    carclassAarr = lodash.chunk(
      carclassAarr.map((a) => a),
      10
    );

    carclassSarr = lodash.chunk(
      carclassSarr.map((a) => a),
      10
    );
    carEventarr = lodash.chunk(
      carEventarr.map((a) => a),
      10
    );
    newcars = lodash.chunk(
      newcars.map((a) => a),
      10
    );

    let carslist = carsarray.filter((car) => car.Price > 0);
    let randomcar = lodash.sample(carslist);
    let row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("classD")
        .setEmoji("<:Dclass:954635612986679317>")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("classC")
        .setEmoji("<:cclass:954635613385162792>")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("classB")
        .setEmoji("<:Bclass:954635613339000862>")
        .setStyle("Secondary")
    );

    let row5 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("classA")
        .setEmoji("<:aclass:954635613376770108>")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("classS")
        .setEmoji("<:sclass:967698398314655754>")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("classE")
        .setEmoji("<:eventclass:1140186232001933312>")
        .setStyle("Secondary")
    );

    let row3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("classN")
        .setLabel("New")
        .setEmoji("⭐")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setStyle("Link")
        .setEmoji("🪙")
        .setLabel("Buy Gold")
        .setURL("https://zero2sixty-store.tebex.io/")
    );
    let row9 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setEmoji("◀️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("▶️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("first")
        .setEmoji("⏮️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("last")
        .setEmoji("⏭️")
        .setStyle("Secondary")
    );

    let embed = new EmbedBuilder()
      .setTitle("Dealership")
      .setThumbnail("https://i.ibb.co/6yt9vLT/dealer.png")
      .setImage(randomcar.Image)
      .setColor(colors.blue)
      .setDescription(
        `Welcome to the dealership! Click on a class to begin looking through the cars we have available.\n\n
        **__Featured car__**
        ${randomcar.Emote} ${randomcar.Name}\n
        Class ${randomcar.Class}
        ${emotes.cash} Price: ${toCurrency(randomcar.Price)}
        ${emotes.speed} Power: ${randomcar.Speed}
        ${emotes.zero2sixty} Acceleration: ${randomcar["0-60"]}
        ${emotes.handling} Handling: ${randomcar.Handling}`
      );

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row2, row5, row3],
      fetchReply: true,
    });

    let page;
    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector2 = msg.createMessageComponentCollector({
      filter: filter2,
    });

    let classpage;
    collector2.on("collect", async (i) => {
      if (i.customId.includes("classD")) {
        classpage = carclassDarr;
        embed = new EmbedBuilder().setTitle("Class D Dealership");

        embed = new EmbedBuilder()
          .setThumbnail("https://i.ibb.co/0MggTrB/Dclass.png")
          .setTitle("Class D Dealership")
          .setColor(colors.blue);
        embed.setFooter({ text: `Pages 1/${classpage.length}` });

        console.dir(carclassDarr[0]);
        for (let b in carclassDarr[0]) {
          let car = carclassDarr[0][b];
          console.dir(car);
          if (car.Stock) {
            embed.addFields({
              name: `${car.Emote} ${car.Name}`,
              value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(
                car.Price
              )}\nStock: ${car.Stock}\n
              Owned: ${car.owned}`,
              inline: true,
            });
          } else {
            if (car.Rank) {
              embed.addFields({
                name: `${car.Emote} ${car.Name}`,
                value: `\`ID: ${car.alias}\`\nPrice: ${
                  emotes.bounty
                } ${toCurrency(car.Price)}
                Gold Price: ${emotes.gold} ${Math.round(
                  car.Price / 150
                )}\nOwned: ${car.owned}
                Rank: ${car.Rank}`,
                inline: true,
              });
            } else {
              embed.addFields({
                name: `${car.Emote} ${car.Name}`,
                value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}
                Gold Price: ${emotes.gold} ${Math.round(
                  car.Price / 150
                )}\nOwned: ${car.owned}`,
                inline: true,
              });
            }
          }
        }
        await i.update({
          embeds: [embed],
          components: [row2, row5, row3, row9],
          fetchReply: true,
        });

        page = 1;
      } else if (i.customId.includes("classC")) {
        classpage = carclassCarr;
        embed = new EmbedBuilder().setTitle("Class C Dealership");
        let row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("previous")
            .setEmoji("◀️")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("next")
            .setEmoji("▶️")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("first")
            .setEmoji("⏮️")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("last")
            .setEmoji("⏭️")
            .setStyle("Secondary")
        );
        embed = new EmbedBuilder()
          .setThumbnail("https://i.ibb.co/fYgt2kj/cclass.png")
          .setTitle("Class C Dealership")
          .setColor(colors.blue);
        embed.setFooter({ text: `Pages 1/${classpage.length}` });

        console.dir(carclassCarr[0]);
        for (let b in carclassCarr[0]) {
          let car = carclassCarr[0][b];
          console.dir(car);
          if (car.Stock) {
            embed.addFields({
              name: `${car.Emote} ${car.Name}`,
              value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(
                car.Price
              )}\nStock: ${car.Stock}\nOwned: ${car.owned}`,
              inline: true,
            });
          } else {
            if (car.Rank) {
              embed.addFields({
                name: `${car.Emote} ${car.Name}`,
                value: `\`ID: ${car.alias}\`\nPrice: ${
                  emotes.bounty
                } ${toCurrency(car.Price)}
                Gold Price: ${emotes.gold} ${Math.round(
                  car.Price / 150
                )}\nOwned: ${car.owned}
                Rank: ${car.Rank}`,
                inline: true,
              });
            } else {
              embed.addFields({
                name: `${car.Emote} ${car.Name}`,
                value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}
                Gold Price: ${emotes.gold} ${Math.round(
                  car.Price / 150
                )}\nOwned: ${car.owned}`,
                inline: true,
              });
            }
          }
        }
        await i.update({
          embeds: [embed],
          components: [row2, row5, row3, row9],
          fetchReply: true,
        });

        page = 1;
      } else if (i.customId.includes("classB")) {
        classpage = carclassBarr;
        embed = new EmbedBuilder().setTitle("Class B Dealership");
        let row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("previous")
            .setEmoji("◀️")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("next")
            .setEmoji("▶️")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("first")
            .setEmoji("⏮️")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("last")
            .setEmoji("⏭️")
            .setStyle("Secondary")
        );
        embed = new EmbedBuilder()
          .setThumbnail("https://i.ibb.co/k5ByyvZ/Bclass.png")
          .setTitle("Class B Dealership")
          .setColor(colors.blue);
        embed.setFooter({ text: `Pages 1/${classpage.length}` });

        console.dir(carclassBarr[0]);
        for (let b in carclassBarr[0]) {
          let car = carclassBarr[0][b];
          console.dir(car);
          if (car.Stock) {
            embed.addFields({
              name: `${car.Emote} ${car.Name}`,
              value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(
                car.Price
              )}\nStock: ${car.Stock}\nOwned: ${car.owned}`,
              inline: true,
            });
          } else {
            if (car.Rank) {
              embed.addFields({
                name: `${car.Emote} ${car.Name}`,
                value: `\`ID: ${car.alias}\`\nPrice: ${
                  emotes.bounty
                } ${toCurrency(car.Price)}
                Gold Price: ${emotes.gold} ${Math.round(
                  car.Price / 150
                )}\nOwned: ${car.owned}
                Rank: ${car.Rank}`,
                inline: true,
              });
            } else {
              embed.addFields({
                name: `${car.Emote} ${car.Name}`,
                value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}
                Gold Price: ${emotes.gold} ${Math.round(
                  car.Price / 150
                )}\nOwned: ${car.owned}`,
                inline: true,
              });
            }
          }
        }
        await i.update({
          embeds: [embed],
          components: [row2, row5, row3, row9],
          fetchReply: true,
        });

        page = 1;
      } else if (i.customId.includes("classA")) {
        classpage = carclassAarr;
        embed = new EmbedBuilder();
        let row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("previous")
            .setEmoji("◀️")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("next")
            .setEmoji("▶️")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("first")
            .setEmoji("⏮️")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("last")
            .setEmoji("⏭️")
            .setStyle("Secondary")
        );
        embed = new EmbedBuilder()
          .setThumbnail("https://i.ibb.co/mDNbCrR/aclass.png")
          .setTitle("Class A Dealership")
          .setColor(colors.blue);
        embed.setFooter({ text: `Pages 1/${classpage.length}` });

        console.dir(carclassAarr[0]);
        for (let b in carclassAarr[0]) {
          let car = carclassAarr[0][b];
          console.dir(car);
          if (car.Stock) {
            embed.addFields({
              name: `${car.Emote} ${car.Name}`,
              value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(
                car.Price
              )}\nStock: ${car.Stock}\nOwned: ${car.owned}`,
              inline: true,
            });
          } else {
            if (car.Rank) {
              embed.addFields({
                name: `${car.Emote} ${car.Name}`,
                value: `\`ID: ${car.alias}\`\nPrice: ${
                  emotes.bounty
                } ${toCurrency(car.Price)}
                Gold Price: ${emotes.gold} ${Math.round(
                  car.Price / 150
                )}\nOwned: ${car.owned}
                Rank: ${car.Rank}`,
                inline: true,
              });
            } else {
              embed.addFields({
                name: `${car.Emote} ${car.Name}`,
                value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}
                Gold Price: ${emotes.gold} ${Math.round(
                  car.Price / 150
                )}\nOwned: ${car.owned}`,
                inline: true,
              });
            }
          }
        }
        await i.update({
          embeds: [embed],
          components: [row2, row5, row3, row9],
          fetchReply: true,
        });

        page = 1;
      } else if (i.customId.includes("classS")) {
        classpage = carclassSarr;
        embed = new EmbedBuilder().setTitle("Class S Dealership");
        let row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("previous")
            .setEmoji("◀️")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("next")
            .setEmoji("▶️")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("first")
            .setEmoji("⏮️")
            .setStyle("Secondary"),
          new ButtonBuilder()
            .setCustomId("last")
            .setEmoji("⏭️")
            .setStyle("Secondary")
        );
        embed = new EmbedBuilder()
          .setThumbnail("https://i.ibb.co/tqY1mCf/sclass.png")
          .setTitle("Class S Dealership")
          .setColor(colors.blue);
        embed.setFooter({ text: `Pages 1/${classpage.length}` });
        console.dir(carclassSarr[0]);
        for (let b in carclassSarr[0]) {
          let car = carclassSarr[0][b];
          console.dir(car);
          if (car.Stock) {
            embed.addFields({
              name: `${car.Emote} ${car.Name}`,
              value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(
                car.Price
              )}\nStock: ${car.Stock}\nOwned: ${car.owned}`,
              inline: true,
            });
          } else {
            if (car.Rank) {
              embed.addFields({
                name: `${car.Emote} ${car.Name}`,
                value: `\`ID: ${car.alias}\`\nPrice: ${
                  emotes.bounty
                } ${toCurrency(car.Price)}
                Gold Price: ${emotes.gold} ${Math.round(
                  car.Price / 150
                )}\nOwned: ${car.owned}
                Rank: ${car.Rank}`,
                inline: true,
              });
            } else {
              embed.addFields({
                name: `${car.Emote} ${car.Name}`,
                value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}
                Gold Price: ${emotes.gold} ${Math.round(
                  car.Price / 150
                )}\nOwned: ${car.owned}`,
                inline: true,
              });
            }
          }
        }
        await i.update({
          embeds: [embed],
          components: [row2, row5, row3, row9],
          fetchReply: true,
        });

        page = 1;
      } else if (i.customId.includes("classN")) {
        classpage = newcars;
        embed = new EmbedBuilder().setTitle("New Cars");

        embed = new EmbedBuilder()
          .setThumbnail("https://i.ibb.co/MBtYRYz/NEWCARS.png")
          .setColor(colors.blue);
        embed.setFooter({ text: `Pages 1/${classpage.length}` });
        for (let b in newcars[0]) {
          let car = newcars[0][b];
          console.dir(car);
          if (car.Obtained) {
            embed.addFields({
              name: `${car.Emote} ${car.Name}`,
              value: `\`ID: ${car.alias}\`\nObtained: ${car.Obtained}`,
              inline: true,
            });
          } else {
            embed.addFields({
              name: `${car.Emote} ${car.Name}`,
              value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}
              Gold Price: ${emotes.gold} ${Math.round(car.Price / 150)}`,
              inline: true,
            });
          }
        }
        await i.update({
          embeds: [embed],
          components: [row2, row5, row3, row9],
          fetchReply: true,
        });

        page = 1;
      } else if (i.customId.includes("classE")) {
        classpage = carEventarr;
        embed = new EmbedBuilder().setTitle("Event Dealership");
        console.log(carEventarr);
        embed = new EmbedBuilder()
          .setThumbnail("https://i.ibb.co/fDZg10f/eventclass.png")
          .setTitle("Event Dealership")
          .setColor(colors.blue);
        embed.setFooter({ text: `Pages 1/${classpage.length}` });
        console.dir(carEventarr[0]);
        for (let b in carEventarr[0]) {
          let car = carEventarr[0][b];
          console.dir(car);

          embed.addFields({
            name: `${car.Emote} ${car.Name}`,
            value: `\`ID: ${
              car.alias
            }\`\nPrice: <:key_z:1140029565360668783> ${numberWithCommas(
              car.Exclusive
            )}\nOwned: ${car.owned}`,
            inline: true,
          });
        }

        await i.update({
          embeds: [embed],
          components: [row2, row5, row3, row9],
          fetchReply: true,
        });

        page = 1;
      } else {
        console.log(page);
        let current = page;
        if (i.customId.includes("previous") && page !== 1) {
          embed.data.fields = null;

          page--;
        } else if (i.customId.includes("next") && page !== classpage.length) {
          embed.data.fields = null;

          page++;
        } else if (i.customId.includes("first")) {
          embed.data.fields = null;

          page = 1;
        } else if (i.customId.includes("last")) {
          embed.data.fields = null;

          page = classpage.length;
        }
        for (let e in classpage[page - 1]) {
          let car = classpage[page - 1][e];
          console.log(car);
          if (car.Stock) {
            embed.addFields({
              name: `${car.Emote} ${car.Name}`,
              value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(
                car.Price
              )}\nStock: ${car.Stock}\nOwned: ${car.owned}`,
              inline: true,
            });
          } else if (car.Obtained) {
            embed.addFields({
              name: `${car.Emote} ${car.Name}`,
              value: `\`ID: ${car.alias}\`\nObtained: ${car.Obtained}\nOwned: ${car.owned}`,
              inline: true,
            });
          } else {
            embed.addFields({
              name: `${car.Emote} ${car.Name}`,
              value: `\`ID: ${car.alias}\`\nPrice: ${toCurrency(car.Price)}
              Gold Price: ${emotes.gold} ${emotes.gold} ${Math.round(
                car.Price / 150
              )}\nOwned: ${car.owned}`,
              inline: true,
            });
          }
        }

        if (current !== page) {
          embed.setFooter({ text: `Pages ${page}/${classpage.length}` });
          i.update({ embeds: [embed], fetchReply: true });
        } else {
          return i.update({ content: "No pages left!" });
        }
      }
    });
  },
};
