

const seasons = require("../data/seasons.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldown = require("../schema/cooldowns");
const colors = require("../common/colors");
const { numberWithCommas, toCurrency } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const partdb = require("../data/partsdb.json");
const cardb = require("../data/cardb.json");
const lodash = require("lodash");
const itemdb = require("../data/items.json");
const emotes = require("../common/emotes").emotes;
const titledb = require("../data/titles.json");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("season")
    .setDescription("Check the season 3 rewards page"),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let cooldowndata = await Cooldown.findOne({ id: interaction.user.id });
    let seasonRewards = seasons.Seasons.Winter.Rewards;
    let notoriety = userdata.notoriety;

    let rewards = [];

    for (let rew in seasonRewards) {
      let re = seasonRewards[rew];
      let rewardobj = {
        Number: re.Number,
        Item: re.Item,
        Required: re.Required,
      };
      if (re.Path1) {
        rewardobj = {
          Number: re.Number,
          Item: re.Item,
          Required: re.Required,
          Path1: re.Path1,
          Path2: re.Path2,
          Path3: re.Path3,
        };
      }
      rewards.push(rewardobj);
    }

    rewards = lodash.chunk(
      rewards.map((a) => a),
      6
    );
    
    console.log(rewards.length)


    let claimable = userdata.seasonclaimed || 1;

    let opened = cooldowndata.opened;
    let timeout = 15000;
    if (opened !== null && timeout - (Date.now() - opened) > 0) {
      let time = ms(timeout - (Date.now() - opened));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`You need to wait ${time} to open the season again.`);
      await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }

    let row9 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setEmoji("◀️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("▶️")
        .setStyle("Secondary")
    );

    let rowclaim = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("claim")
        .setEmoji("✔️")
        .setLabel(`Claim Reward ${claimable}`)
        .setStyle("Success")
    );

    let rewardtoclaim = seasonRewards[`${claimable}`];

    if (rewardtoclaim.Required > notoriety) {
      rowclaim.components[0].setEmoji("✖️");
      rowclaim.components[0].setStyle("Danger");
    }

    let page = 0;
    let vispage = 1;


    let embed = new EmbedBuilder()
      .setTitle(`Season 3 Page ${vispage}`)
      .setColor(colors.blue)
      .setThumbnail(seasons.Seasons.Winter.Image)
      .setFooter({ text: `December 12th - March 1st` });

    for (let field in rewards[page]) {
      let data = rewards[page][field];
      if (data.Item.endsWith("Cash")) {
        let amount = data.Item.split(" ");
        embed.addFields({
          name: `Reward ${data.Number}`,
          value: `${emotes.cash} ${toCurrency(amount[0])}\n${numberWithCommas(
            data.Required
          )} ${emotes.notoriety}`,
          inline: true,
        });
      } else if (data.Item.includes("Rare Keys")) {
        let amount = data.Item.split(" ");
        embed.addFields({
          name: `Reward ${data.Number}`,
          value: `${numberWithCommas(amount[0])} ${
            emotes.rareKey
          }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
          inline: true,
        });
      } else if (data.Item.includes("Common Keys")) {
        let amount = data.Item.split(" ");
        embed.addFields({
          name: `Reward ${data.Number}`,
          value: `${numberWithCommas(amount[0])} ${
            emotes.commonKey
          }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
          inline: true,
        });
      } else if (data.Item.includes("Exotic Keys")) {
        let amount = data.Item.split(" ");
        embed.addFields({
          name: `Reward ${data.Number}`,
          value: `${numberWithCommas(amount[0])} ${
            emotes.exoticKey
          }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
          inline: true,
        });
      } else if (data.Item.includes("Garage Spaces")) {
        let amount = data.Item.split(" ");
        embed.addFields({
          name: `Reward ${data.Number}`,
          value: `${numberWithCommas(amount[0])} ${
            emotes.addgarage
          } Garage Space\n${numberWithCommas(data.Required)} ${
            emotes.notoriety
          }`,
          inline: true,
        });
      } else if (data.Item.toLowerCase() == "path car") {
        if (userdata.path == "none" || !userdata.path) {
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `Path Car\n${numberWithCommas(data.Required)} ${
              emotes.notoriety
            }`,
            inline: true,
          });
        } else if (userdata.path == "1") {
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${cardb.Cars[data.Path1.toLowerCase()].Emote} ${
              cardb.Cars[data.Path1.toLowerCase()].Name
            }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
            inline: true,
          });
        } else if (userdata.path == "2") {
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${cardb.Cars[data.Path2.toLowerCase()].Emote} ${
              cardb.Cars[data.Path2.toLowerCase()].Name
            }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
            inline: true,
          });
        } else if (userdata.path == "3") {
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${cardb.Cars[data.Path3.toLowerCase()].Emote} ${
              cardb.Cars[data.Path3.toLowerCase()].Name
            }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
            inline: true,
          });
        }
      } else if (data.Item.includes("RP")) {
        let amount = data.Item.split(" ");
        embed.addFields({
          name: `Reward ${data.Number}`,
          value: `${numberWithCommas(amount[0])} ${
            emotes.rp
          }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
          inline: true,
        });
      } else if (cardb.Cars[data.Item.toLowerCase()]) {
        let car = cardb.Cars[data.Item.toLowerCase()];
        embed.addFields({
          name: `Reward ${data.Number}`,
          value: `${car.Emote} ${car.Name}\n${numberWithCommas(
            data.Required
          )} ${emotes.notoriety}`,
          inline: true,
        });
      } else if (partdb.Parts[data.Item.toLowerCase()]) {
        let car = partdb.Parts[data.Item.toLowerCase()];
        embed.addFields({
          name: `Reward ${data.Number}`,
          value: `${car.Emote} ${car.Name}\n${numberWithCommas(
            data.Required
          )} ${emotes.notoriety}`,
          inline: true,
        });
      }else if (titledb[data.Item.toLowerCase()]) {
        let car = titledb[data.Item.toLowerCase()];
        embed.addFields({
          name: `Reward ${data.Number}`,
          value: `${car.Title} Title\n${numberWithCommas(data.Required)} ${
            emotes.notoriety
          }`,
          inline: true,
        });
      } else if (itemdb[data.Item.toLowerCase()]) {
        let car = itemdb[data.Item.toLowerCase()];
        embed.addFields({
          name: `Reward ${data.Number}`,
          value: `${car.Emote} ${car.Name}\n${numberWithCommas(
            data.Required
          )} ${emotes.notoriety}`,
          inline: true,
        });
      }
    }

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row9, rowclaim],
      fetchReply: true,
    });
    cooldowndata.opened = Date.now();
    cooldowndata.save();
    let filter = (btnInt) => {
      return interaction.user.id == btnInt.user.id;
    };
    const collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 15000,
    });
    collector.on("collect", async (i) => {
      
      if (i.customId == "next") {
        if (page >= 8) return interaction.editReply("No more pages!");
        page ++ ;
        vispage++;
      } else if (i.customId == "previous") {
        if ((page <= 0)) return interaction.editReply("No more pages!");
        page--;
        vispage--;
      } else if (i.customId == "claim") {
        let path = userdata.path || "none";
        userdata = await User.findOne({id: interaction.user.id})
          notoriety = userdata.notoriety;

          if (rewardtoclaim.Required > notoriety) return;

          if (rewardtoclaim.Item.endsWith("Cash")) {
            let amount = rewardtoclaim.Item.split(" ");
            let num = parseInt(amount[0]);
            let usercash = parseInt(userdata.cash);
            let newamount = parseInt((usercash += num));

            let oldnoto = userdata.notoriety;
            userdata.cash = newamount;
            userdata.seasonclaimed += 1;
            userdata.save();
          } else if (rewardtoclaim.Item.toLowerCase() == "path car") {
            let carin;
            if (userdata.path == "1") {
              carin = rewardtoclaim.Path1;
            } else if (userdata.path == "2") {
              carin = rewardtoclaim.Path2;
            } else if (userdata.path == "3") {
              carin = rewardtoclaim.Path3;
            }
            let car = cardb.Cars[carin.toLowerCase()];

            let carobj = {
              ID: car.alias,
              Name: car.Name,
              Speed: car.Speed,
              Acceleration: car["0-60"],
              Handling: car.Handling,
              Parts: [],
              Emote: car.Emote,
              Livery: car.Image,
              Miles: 0,
              WeightStat: car.Weight,
              Gas: 10,
              MaxGas: 10,
            };
            userdata.cars.push(carobj);
            userdata.seasonclaimed += 1;
            userdata.save();
          } else if (rewardtoclaim.Item.includes("Rare Keys")) {
            let amount = rewardtoclaim.Item.split(" ");

            let num = parseInt(amount[0]);
            let usercash = parseInt(userdata.rkeys);
            let newamount = parseInt((usercash += num));


            userdata.rkeys = newamount;
            userdata.seasonclaimed += 1;
            userdata.save();
          } else if (rewardtoclaim.Item.includes("Common Keys")) {
            let amount = rewardtoclaim.Item.split(" ");

            let num = parseInt(amount[0]);
            let usercash = parseInt(userdata.ckeys);
            let newamount = parseInt((usercash += num));

            userdata.ckeys = newamount;
            userdata.seasonclaimed += 1;
            userdata.save();
          } else if (rewardtoclaim.Item.includes("Exotic Keys")) {
            let amount = rewardtoclaim.Item.split(" ");

            let num = parseInt(amount[0]);
            let usercash = parseInt(userdata.ekeys);
            let newamount = parseInt((usercash += num));


            userdata.ekeys = newamount;
            userdata.seasonclaimed += 1;
            userdata.save();
          } else if (rewardtoclaim.Item.includes("Garage Spaces")) {
            let amount = rewardtoclaim.Item.split(" ");

            let num = parseInt(amount[0]);
            let usercash = parseInt(userdata.garageLimit);
            let newamount = parseInt((usercash += num));


            userdata.garageLimit = newamount;
            userdata.seasonclaimed += 1;
            userdata.save();
          } else if (rewardtoclaim.Item.includes("RP")) {
            let amount = rewardtoclaim.Item.split(" ");

            let num = parseInt(amount[0]);
            let usercash = parseInt(userdata.rp);
            let newamount = parseInt((usercash += num));


            userdata.rp = newamount;
            userdata.seasonclaimed += 1;
            userdata.save();
          } else if (cardb.Cars[rewardtoclaim.Item.toLowerCase()]) {
            let car = cardb.Cars[rewardtoclaim.Item.toLowerCase()];
            let carobj = {
              ID: car.alias,
              Name: car.Name,
              Speed: car.Speed,
              Acceleration: car["0-60"],
              Handling: car.Handling,
              Parts: [],
              Emote: car.Emote,
              Livery: car.Image,
              Miles: 0,
              Resale: 0,
              WeightStat: car.Weight,
              Gas: 10,
              MaxGas: 10,
            };
            userdata.cars.push(carobj);
            userdata.seasonclaimed += 1;
            userdata.save();
          } else if (partdb.Parts[rewardtoclaim.Item.toLowerCase()]) {
            let car = partdb.Parts[rewardtoclaim.Item.toLowerCase()];

            userdata.parts.push(car.Name.toLowerCase());
            userdata.seasonclaimed += 1;
            userdata.save();
          } else if (itemdb[rewardtoclaim.Item.toLowerCase()]) {
            let car = itemdb[rewardtoclaim.Item.toLowerCase()];

            userdata.items.push(car.Name.toLowerCase());
            userdata.seasonclaimed += 1;
            userdata.save();
          }  else if (titledb[rewardtoclaim.Item.toLowerCase()]) {

            userdata.titles.push(rewardtoclaim.Item.toLowerCase());
            userdata.seasonclaimed += 1;
            userdata.save();
          }
        
      }

      notoriety = userdata.notoriety;

      embed = new EmbedBuilder()
        .setTitle(`Season 3 Page ${vispage}`)
        .setColor(colors.blue)
        .setThumbnail(seasons.Seasons.Winter.Image)
        .setFooter({ text: `December 12th - March 1st` });
      for (let field in rewards[page]) {
        let data = rewards[page][field];
        if (data.Item.endsWith("Cash")) {
          let amount = data.Item.split(" ");
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${emotes.cash} ${toCurrency(amount[0])}\n${numberWithCommas(
              data.Required
            )} ${emotes.notoriety}`,
            inline: true,
          });
        } else if (data.Item.includes("Rare Keys")) {
          let amount = data.Item.split(" ");
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${numberWithCommas(amount[0])} ${
              emotes.rareKey
            }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
            inline: true,
          });
        } else if (data.Item.includes("Common Keys")) {
          let amount = data.Item.split(" ");
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${numberWithCommas(amount[0])} ${
              emotes.commonKey
            }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
            inline: true,
          });
        } else if (data.Item.includes("Exotic Keys")) {
          let amount = data.Item.split(" ");
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${numberWithCommas(amount[0])} ${
              emotes.exoticKey
            }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
            inline: true,
          });
        } else if (data.Item.includes("Garage Spaces")) {
          let amount = data.Item.split(" ");
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${numberWithCommas(amount[0])} ${
              emotes.addgarage
            } Garage Space\n${numberWithCommas(data.Required)} ${
              emotes.notoriety
            }`,
            inline: true,
          });
        } else if (data.Item.includes("RP")) {
          let amount = data.Item.split(" ");
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${numberWithCommas(amount[0])} ${
              emotes.rp
            }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
            inline: true,
          });
        } else if (cardb.Cars[data.Item.toLowerCase()]) {
          let car = cardb.Cars[data.Item.toLowerCase()];
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${car.Emote} ${car.Name}\n${numberWithCommas(
              data.Required
            )} ${emotes.notoriety}`,
            inline: true,
          });
        } else if (data.Item.toLowerCase() == "path car") {
          if (userdata.path == "none" || !userdata.path) {
            embed.addFields({
              name: `Reward ${data.Number}`,
              value: `Path Car\n${numberWithCommas(data.Required)} ${
                emotes.notoriety
              }`,
              inline: true,
            });
          } else if (userdata.path == "1") {
            embed.addFields({
              name: `Reward ${data.Number}`,
              value: `${cardb.Cars[data.Path1.toLowerCase()].Emote} ${
                cardb.Cars[data.Path1.toLowerCase()].Name
              }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
              inline: true,
            });
          } else if (userdata.path == "2") {
            embed.addFields({
              name: `Reward ${data.Number}`,
              value: `${cardb.Cars[data.Path2.toLowerCase()].Emote} ${
                cardb.Cars[data.Path2.toLowerCase()].Name
              }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
              inline: true,
            });
          } else if (userdata.path == "3") {
            embed.addFields({
              name: `Reward ${data.Number}`,
              value: `${cardb.Cars[data.Path3.toLowerCase()].Emote} ${
                cardb.Cars[data.Path3.toLowerCase()].Name
              }\n${numberWithCommas(data.Required)} ${emotes.notoriety}`,
              inline: true,
            });
          }
        } else if (partdb.Parts[data.Item.toLowerCase()]) {
          let car = partdb.Parts[data.Item.toLowerCase()];
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${car.Emote} ${car.Name}\n${numberWithCommas(
              data.Required
            )} ${emotes.notoriety}`,
            inline: true,
          });
        }  else if (titledb[data.Item.toLowerCase()]) {
          let car = titledb[data.Item.toLowerCase()];
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${car.Title} Title\n${numberWithCommas(data.Required)} ${
              emotes.notoriety
            }`,
            inline: true,
          });
        } else if (itemdb[data.Item.toLowerCase()]) {
          let car = itemdb[data.Item.toLowerCase()];
          embed.addFields({
            name: `Reward ${data.Number}`,
            value: `${car.Emote} ${car.Name}\n${numberWithCommas(
              data.Required
            )} ${emotes.notoriety}`,
            inline: true,
          });
        }
      }
      claimable = userdata.seasonclaimed;

      rowclaim = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("claim")
          .setEmoji("✔️")
          .setLabel(`Claim Reward ${claimable}`)
          .setStyle("Success")
      );

      rewardtoclaim = seasonRewards[`${claimable}`];

      if (rewardtoclaim.Required > notoriety) {
        rowclaim.components[0].setEmoji("✖️");
        rowclaim.components[0].setStyle("Danger");
      }

      await interaction.editReply({
        embeds: [embed],
        fetchReply: true,
        components: [row9, rowclaim],
      });
    });
  },
};
