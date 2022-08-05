const Discord = require("discord.js");
const cars = require("../cardb.json");
const ms = require("ms");
const db = require("quick.db");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const lodash = require("lodash");
const partdb = require("../partsdb.json");
const itemdb = require("../items.json");
const petdb = require("../pets.json");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const Global = require("../schema/global-schema");
const Car = require("../schema/car");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pet")
    .setDescription("View your mini miata"),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    console.log(userdata);
    let pet = userdata.pet;
    if (!pet) return interaction.reply(`You don't have a pet!`);
    let condition = pet.condition;
    let gas = pet.gas;
    let oil = pet.oil;
    let love = pet.love;
    let color = pet.color || "Red";
    let spoiler = pet.spoiler;
    let name = pet.name || "N/A";

    let petimage;

    if (color == "Black") {
      petimage = petdb.Pets["mini miata"].Black;

      if (spoiler) {
        petimage = petdb.Pets["mini miata"].BlackSpoiler;
      }
    } else if (color == "Blue") {
      petimage = petdb.Pets["mini miata"].Blue;

      if (spoiler) {
        petimage = petdb.Pets["mini miata"].BlueSpoiler;
      }
    } else if (color == "Red") {
      petimage = petdb.Pets["mini miata"].Red;

      if (spoiler) {
        petimage = petdb.Pets["mini miata"].RedSpoiler;
      }
    } else if (color == "White") {
      petimage = petdb.Pets["mini miata"].White;

      if (spoiler) {
        petimage = petdb.Pets["mini miata"].WhiteSpoiler;
      }
    }

    let embed = new Discord.MessageEmbed()
      .setTitle(`Your Pet`)
      .addField("Name", `${name}`, true)
      .addField("Status", "Looking for items", true)

      .addField("Condition", `${condition}`, true)
      .addField("Gas", `${gas}`, true)
      .addField("Oil", `${oil}`, true)
      .addField("Love", `${love}`, true)
      .setThumbnail(petimage)
      .setColor("#60b0f4");

    let row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Drive")
        .setEmoji("🚗")
        .setCustomId("drive")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setLabel("Change Oil")
        .setEmoji("🛢️")
        .setCustomId("oil")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setLabel("Fill Gas")
        .setEmoji("⛽")
        .setCustomId("gas")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setLabel("Wash")
        .setEmoji("🧼")
        .setCustomId("wash")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setLabel("Change Name")
        .setEmoji("📝")
        .setCustomId("name")
        .setStyle("SECONDARY")
    );

    let row2 = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Paint")
        .setEmoji("🖌️")
        .setCustomId("paint")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setLabel("Send Racing")
        .setEmoji("🏁")
        .setCustomId("race")
        .setStyle("SECONDARY")
    );

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row, row2],
      fetchReply: true,
    });

    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    let collector = msg.createMessageComponentCollector({
      filter: filter,
    });

    collector.on("collect", async (i, user) => {
      if (i.customId.includes("drive")) {
        let pet = userdata.pet;
        let condition = pet.condition;
        let gas = pet.gas;
        let oil = pet.oil;
        let love = pet.love;

        let addedlove = 100 - pet.love;

        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "pet.love": 100,
            },
          }
        );
        userdata = await User.findOne({ id: i.user.id });
        userdata.save();
        let newlove = await userdata.pet.love;

        let embed = new Discord.MessageEmbed()
          .setTitle(`Your Pet`)
          .addField("Name", `${name}`, true)
          .addField("Status", "Looking for items", true)

          .addField("Condition", `${condition}`, true)
          .addField("Gas", `${gas}`, true)
          .addField("Oil", `${oil}`, true)
          .addField("Love", `${newlove}`, true)
          .setThumbnail(petimage)
          .setColor("#60b0f4");
        i.update({
          content: `You drove your pet car and gave it love!`,
          embeds: [embed],
        });
      } else if (i.customId.includes("gas")) {
        let pet = userdata.pet;
        let condition = pet.condition;
        let gas = pet.gas;
        let oil = pet.oil;
        let love = pet.love;
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "pet.gas": 100,
            },
          }
        );
        userdata = await User.findOne({ id: i.user.id });
        userdata.cash -= 2000;
        userdata.save();
        let newgas = await userdata.pet.gas;

        let embed = new Discord.MessageEmbed()
          .setTitle(`Your Pet`)
          .addField("Name", `${name}`, true)
          .addField("Status", "Looking for items", true)

          .addField("Condition", `${condition}`, true)
          .addField("Gas", `${newgas}`, true)
          .addField("Oil", `${oil}`, true)
          .addField("Love", `${love}`, true)
          .setThumbnail(petimage)
          .setColor("#60b0f4");
        i.update({
          content: `You filled your pets gas costing you $2,000`,
          embeds: [embed],
        });
      } else if (i.customId.includes("oil")) {
        let pet = userdata.pet;
        let condition = pet.condition;
        let gas = pet.gas;
        let oil = pet.oil;
        let love = pet.love;

        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "pet.oil": 100,
            },
          }
        );
        userdata = await User.findOne({ id: i.user.id });
        userdata.cash -= 500;
        userdata.save();
        let newoil = await userdata.pet.oil;

        let embed = new Discord.MessageEmbed()
          .setTitle(`Your Pet`)

          .addField("Name", `${name}`, true)
          .addField("Status", "Looking for items", true)

          .addField("Condition", `${condition}`, true)
          .addField("Gas", `${gas}`, true)
          .addField("Oil", `${newoil}`, true)
          .addField("Love", `${love}`, true)
          .setThumbnail(petimage)
          .setColor("#60b0f4");
        i.update({
          content: `You changed your pets oil costing you $500`,
          embeds: [embed],
        });
      } else if (i.customId.includes("wash")) {
        let pet = userdata.pet;
        let condition = pet.condition;
        let gas = pet.gas;
        let oil = pet.oil;
        let love = pet.love;

        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "pet.condition": 100,
            },
          }
        );
        userdata = await User.findOne({ id: i.user.id });
        userdata.save();
        let newcond = await userdata.pet.condition;

        let embed = new Discord.MessageEmbed()
          .setTitle(`Your Pet`)

          .addField("Name", `${name}`, true)
          .addField("Status", "Looking for items", true)

          .addField("Condition", `${newcond}`, true)
          .addField("Gas", `${gas}`, true)
          .addField("Oil", `${oil}`, true)
          .addField("Love", `${love}`, true)
          .setThumbnail(petimage)
          .setColor("#60b0f4");
        i.update({ content: `You washed your pet`, embeds: [embed] });
      } else if (i.customId.includes("name")) {
        let pet = userdata.pet;
        let condition = pet.condition;
        let gas = pet.gas;
        let oil = pet.oil;
        let love = pet.love;

        i.channel.send(`Type the name you want to set`);

        const filter2 = (m = discord.Message) => {
          return m.author.id === interaction.user.id;
        };
        let collector2 = interaction.channel.createMessageCollector({
          filter: filter2,
          max: 1,
          time: 1000 * 20,
        });
        let nametoset;
        collector2.on("collect", async (msg) => {
          nametoset = msg.content;

          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "pet.name": nametoset,
              },
            }
          );
          userdata = await User.findOne({ id: i.user.id });
          userdata.save();

          name = userdata.pet.name;
          let embed = new Discord.MessageEmbed()
            .setTitle(`Your Pet`)
            .addField("Name", `${name}`, true)
            .addField("Status", "Looking for items", true)

            .addField("Condition", `${condition}`, true)
            .addField("Gas", `${gas}`, true)
            .addField("Oil", `${oil}`, true)
            .addField("Love", `${love}`, true)
            .setThumbnail(petimage)
            .setColor("#60b0f4");
          i.update({ content: `You changed your pets name`, embeds: [embed] });
        });
      } else if (i.customId.includes("paint")) {
        let row3 = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("black")
            .setEmoji("⚫")
            .setStyle("SECONDARY"),
          new MessageButton()
            .setCustomId("red")
            .setEmoji("🔴")
            .setStyle("SECONDARY"),
          new MessageButton()
            .setCustomId("white")
            .setEmoji("⚪")
            .setStyle("SECONDARY"),
          new MessageButton()
            .setCustomId("blue")
            .setEmoji("🔵")
            .setStyle("SECONDARY")
        );

        let msg = await i.update({ components: [row, row3], fetchReply: true });

        let filter3 = (btnInt) => {
          return interaction.user.id === btnInt.user.id;
        };

        let collector3 = msg.createMessageComponentCollector({
          filter: filter3,
        });

        collector3.on("collect", async (i, user) => {
          userdata = await User.findOne({ id: i.user.id });

          if (i.customId.includes("black")) {
            await User.findOneAndUpdate(
              {
                id: interaction.user.id,
              },
              {
                $set: {
                  "pet.color": "Black",
                },
              }
            );
            let spoiler = userdata.pet.spoiler;
            if (!spoiler) {
              embed.setThumbnail(petdb.Pets["mini miata"].Black);
            } else {
              embed.setThumbnail(petdb.Pets["mini miata"].BlackSpoiler);
            }
            i.update({ embeds: [embed] });
          } else if (i.customId.includes("red")) {
            await User.findOneAndUpdate(
              {
                id: interaction.user.id,
              },
              {
                $set: {
                  "pet.color": "Red",
                },
              }
            );
            let spoiler = userdata.pet.spoiler;
            if (!spoiler) {
              embed.setThumbnail(petdb.Pets["mini miata"].Red);
            } else {
              embed.setThumbnail(petdb.Pets["mini miata"].RedSpoiler);
            }
            i.update({ embeds: [embed] });
          } else if (i.customId.includes("blue")) {
            await User.findOneAndUpdate(
              {
                id: interaction.user.id,
              },
              {
                $set: {
                  "pet.color": "Blue",
                },
              }
            );
            let spoiler = userdata.pet.spoiler;
            if (!spoiler) {
              embed.setThumbnail(petdb.Pets["mini miata"].Blue);
            } else {
              embed.setThumbnail(petdb.Pets["mini miata"].BlueSpoiler);
            }
            i.update({ embeds: [embed] });
          } else if (i.customId.includes("white")) {
            await User.findOneAndUpdate(
              {
                id: interaction.user.id,
              },
              {
                $set: {
                  "pet.color": "White",
                },
              }
            );
            let spoiler = userdata.pet.spoiler;
            if (!spoiler) {
              embed.setThumbnail(petdb.Pets["mini miata"].White);
            } else {
              embed.setThumbnail(petdb.Pets["mini miata"].WhiteSpoiler);
            }
            i.update({ embeds: [embed] });
          }
          userdata.save();
        });
      } else if (i.customId.includes("race")) {
        let timetorace = pet.racing || 0;
        let timeout = 600000;
        if (timetorace !== null && timeout - (Date.now() - timetorace) > 0) {
          let time = ms(timeout - (Date.now() - timetorace));

          i.update({
            content: `You've already sent your pet racing\n\nRace again in ${time}.`,
          });
        } else {
          let gas = userdata.pet.gas;
          let lessgas = (gas -= 50);
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "pet.gas": lessgas,
              },
            }
          );
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "pet.racing": Date.now(),
              },
            }
          );

          let rewardrange = randomRange(0, 5);
          let rewards = [
            "t2tires",
            "pet spoiler",
            "bank increase",
            "water bottle",
          ];

          let ranreward = lodash.sample(rewards);

          i.update({ content: `You sent your pet racing for 10 minutes` });

          setTimeout(() => {
            i.channel.send({
              content: `${i.user}, Your pet returned with ${rewardrange} Xessence, and a ${ranreward}`,
            });
            userdata.xessence += rewardrange;

            if (partdb.Parts[ranreward.toLowerCase()]) {
              userdata.parts.push(ranreward.toLowerCase());
            } else if (itemdb.Other[ranreward.toLowerCase()]) {
              userdata.items.push(ranreward.toLowerCase());
            } else if (itemdb.Collectable[ranreward.toLowerCase()]) {
              userdata.items.push(ranreward.toLowerCase());
            }
            userdata.save();
          }, 10000);
        }
      }
    });

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
};

function randomRange(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}
