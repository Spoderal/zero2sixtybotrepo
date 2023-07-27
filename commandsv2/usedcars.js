const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");
const colors = require("../common/colors");
const emotes = require("../common/emotes");
const { toCurrency, randomRange } = require("../common/utils");
const lodash = require("lodash");
const cardb = require("../data/cardb.json");
const Cooldowns = require("../schema/cooldowns");
const ms = require("pretty-ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("usedcars")
    .setDescription("View the used cars for the week"),
  async execute(interaction) {
    let uid = interaction.user.id;
    let userdata = (await User.findOne({ id: uid })) || new User({ id: uid });
    let cooldowns =
      (await Cooldowns.findOne({ id: uid })) || new Cooldowns({ id: uid });
    let global = await Global.findOne({});

    let usedcars = global.usedcars;

    let car1 = usedcars[0];
    let car2 = usedcars[1];
    let car3 = usedcars[2];
    let car4 = usedcars[3];

    let descriptions = [
      "Runs and drives",
      "Perfect condition",
      "It was my moms car",
      "I know what I have",
    ];

    let description1 = lodash.sample(descriptions);
    let description2 = lodash.sample(descriptions);

    let description3 = lodash.sample(descriptions);
    let description4 = lodash.sample(descriptions);

    let description5 = lodash.sample(descriptions);
    let description6 = lodash.sample(descriptions);

    let description7 = lodash.sample(descriptions);
    let description8 = lodash.sample(descriptions);
    let n1speed = "???";
    let n2speed = "???";
    let n3speed = "???";
    let n4speed = "???";
    if (userdata.items.includes("flowers")) {
      n1speed = car1.Speed;
      n2speed = car2.Speed;
      n3speed = car3.Speed;
      n4speed = car4.Speed;
    }

    let embed = new Discord.EmbedBuilder()
      .setTitle("Used cars for this week")
      .addFields({
        name: `${car1.NPC.emote} Jerry's ${car1.Name}`,
        value: `${emotes.emotes.speed} ${n1speed}\n${
          emotes.emotes.zero2sixty
        } ${car1.Acceleration}s\n${emotes.emotes.handling} ${car1.Handling}\n${
          emotes.emotes.weight
        } ${car1.Weight}\n\n${toCurrency(
          car1.Price
        )}\n${description1}\n${description2}`,
      })
      .setDescription(
        "Used cars have a random price, and a random speed, take a gamble! The used car dealership resets weekly and each NPC has different cars that they put up for sale. So you can be sure all the NPCs will have a different exclusive car!\n**You can only buy 1 per day**"
      )
      .setImage(`${car1.Livery}`)
      .setColor(colors.blue)
      .setThumbnail(`${car1.NPC.image}`);

    let row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("jerry")
        .setEmoji(`${car1.NPC.emote}`)
        .setStyle("Secondary"),
      new Discord.ButtonBuilder()
        .setCustomId("larry")
        .setEmoji(`${car2.NPC.emote}`)
        .setStyle("Secondary"),
      new Discord.ButtonBuilder()
        .setCustomId("gary")
        .setEmoji(`${car3.NPC.emote}`)
        .setStyle("Secondary"),
      new Discord.ButtonBuilder()
        .setCustomId("mary")
        .setEmoji(`${car4.NPC.emote}`)
        .setStyle("Secondary"),
      new Discord.ButtonBuilder()
        .setCustomId("buy")
        .setEmoji("💲")
        .setLabel("Buy")
        .setStyle("Success")
    );

    let msg = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
      components: [row],
    });

    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector2 = msg.createMessageComponentCollector({
      filter: filter2,
    });

    let tobuy = car1;
    collector2.on("collect", async (i) => {
      if (i.customId.includes("jerry")) {
        tobuy = car1;
        embed = new Discord.EmbedBuilder()
          .setTitle("Used cars for this week")
          .addFields({
            name: `${car1.NPC.emote} Jerry's ${car1.Name}`,
            value: `${emotes.emotes.speed}${n1speed}\n${
              emotes.emotes.zero2sixty
            } ${car1.Acceleration}s\n${emotes.emotes.handling} ${
              car1.Handling
            }\n${emotes.emotes.weight} ${car1.Weight}\n\n${toCurrency(
              car1.Price
            )}\n${description1}\n${description2}`,
          })
          .setImage(`${car1.Livery}`)
          .setColor(colors.blue)
          .setThumbnail(`${car1.NPC.image}`);

        await i.update({
          embeds: [embed],
          fetchReply: true,
          components: [row],
        });
      } else if (i.customId.includes("larry")) {
        tobuy = car2;
        embed = new Discord.EmbedBuilder()
          .setTitle("Used cars for this week")
          .addFields({
            name: `${car2.NPC.emote} Larry's ${car2.Name}`,
            value: `${emotes.emotes.speed} ${n2speed}\n${
              emotes.emotes.zero2sixty
            } ${car2.Acceleration}s\n${emotes.emotes.handling} ${
              car2.Handling
            }\n${emotes.emotes.weight} ${car2.Weight}\n\n${toCurrency(
              car2.Price
            )}\n${description3}\n${description4}`,
          })
          .setImage(`${car2.Livery}`)
          .setColor(colors.blue)
          .setThumbnail(`${car2.NPC.image}`);

        await i.update({
          embeds: [embed],
          fetchReply: true,
          components: [row],
        });
      } else if (i.customId.includes("gary")) {
        tobuy = car3;
        embed = new Discord.EmbedBuilder()
          .setTitle("Used cars for this week")
          .addFields({
            name: `${car3.NPC.emote} Gary's ${car3.Name}`,
            value: `${emotes.emotes.speed} ${n3speed}\n${
              emotes.emotes.zero2sixty
            } ${car3.Acceleration}s\n${emotes.emotes.handling} ${
              car3.Handling
            }\n${emotes.emotes.weight} ${car3.Weight}\n\n${toCurrency(
              car3.Price
            )}\n${description5}\n${description6}`,
          })
          .setImage(`${car3.Livery}`)
          .setColor(colors.blue)
          .setThumbnail(`${car3.NPC.image}`);

        await i.update({
          embeds: [embed],
          fetchReply: true,
          components: [row],
        });
      } else if (i.customId.includes("mary")) {
        tobuy = car4;
        embed = new Discord.EmbedBuilder()
          .setTitle("Used cars for this week")
          .addFields({
            name: `${car4.NPC.emote} Gary's ${car4.Name}`,
            value: `${emotes.emotes.speed} ${n4speed}\n${
              emotes.emotes.zero2sixty
            } ${car4.Acceleration}s\n${emotes.emotes.handling} ${
              car4.Handling
            }\n${emotes.emotes.weight} ${car4.Weight}\n\n${toCurrency(
              car4.Price
            )}\n${description7}\n${description8}`,
          })
          .setImage(`${car4.Livery}`)
          .setColor(colors.blue)
          .setThumbnail(`${car4.NPC.image}`);

        await i.update({
          embeds: [embed],
          fetchReply: true,
          components: [row],
        });
      } else if (i.customId.includes("buy")) {
        let cooldown = cooldowns.usedcar;
        let timeout = 86400000;

        if (cooldown !== null && timeout - (Date.now() - cooldown) > 0) {
          let time = ms(timeout - (Date.now() - cooldown));

          await i.update({
            content: `You've already bought a used car today\n\nBuy another in ${time}.`,
            fetchReply: true,
          });
          return;
        }

        let cash = userdata.cash;
        let price = tobuy.Price;

        if (userdata.using.includes("cocktail")) {
          let chance = randomRange(1, 100);

          if (chance <= 15) {
            price = price += price * 0.1;
          } else {
            price = price -= price * 0.25;
          }
        }

        if (cash < price)
          return i.update(
            `You don't have enough cash for this car! You need ${price}`
          );

        let carindb = cardb.Cars[tobuy.Name.toLowerCase()];
        let carobj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: tobuy.Speed,
          Acceleration: carindb["0-60"],
          Handling: carindb.Handling,
          Parts: [],
          Emote: carindb.Emote,
          Livery: carindb.Image,
          Miles: 0,
          WeightStat: carindb.Weight,
          Gas: 10,
          MaxGas: 10,
        };

        userdata.cars.push(carobj);
        userdata.update();
        userdata.save();
        cooldowns.usedcar = Date.now();
        cooldowns.save();
        userdata.cash -= price;
        await i.update(`Bought!`);

        collector2.stop();
      }
    });
  },
};
