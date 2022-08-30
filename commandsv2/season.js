const discord = require("discord.js");
const db = require("quick.db");
const seasons = require("../data/seasons.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { numberWithCommas } = require("../common/utils");
const { tipFooterSeasonPages } = require("../common/tips");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const {ActionRowBuilder, ButtonBuilder} = require('discord.js')
const partdb = require('../data/partsdb.json')
const cardb = require('../data/cardb.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("season")
    .setDescription("Check the fall season")
    .addStringOption((option) =>
      option
        .setName("page")
        .setDescription("View a page of the season")
        .setRequired(false)
    ),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let seasonrewards = seasons.Seasons.Fall.Rewards;
    let reward = [];
    let redeemed = userdata.fallrewards || 1
    let embed
    let page = interaction.options.getString("page");
    for (var i in seasonrewards) {
      let item = seasonrewards[i];
      reward.push(
        `**${item.Number}** : ${item.Item} **Required : ${numberWithCommas(
          item.Required
        )} Notoriety**`
      );
    }
    let itemrewards1 = reward.slice(0, 10);
    let itemrewards2 = reward.slice(10, 20);
    let itemrewards3 = reward.slice(20, 30);
    let itemrewards4 = reward.slice(30, 40);
    let itemrewards5 = reward.slice(40, 50);
    let itemrewards6 = reward.slice(50, 60);
    let itemrewards7 = reward.slice(60, 70);
    let itemrewards8 = reward.slice(70, 80);
    let itemrewards9 = reward.slice(80, 90);
    let itemrewards10 = reward.slice(90, 100);

    let seasonxp = db.fetch(`notoriety3_${interaction.user.id}`) || 0;

    if (!page || page == "1") {
       embed = new discord.EmbedBuilder()
        .setTitle("Fall Season Page 1 of 10")
        .setDescription(
          `*Ends November 31st 2022*\nClaim rewards with the button below`
        )
        .addFields([{ name: "Rewards", value: `${itemrewards1.join("\n")}` }])
        .setColor(colors.blue)
        .setThumbnail("https://i.imgur.com/9oPxIib.png")
        .setFooter(tipFooterSeasonPages);
    } else if (page == "2") {
       embed = new discord.EmbedBuilder()
        .setTitle("Fall Season Page 2 of 10")
        .setDescription(
          "*Ends December 1st 2022*\n**Use `/reward [number]` to redeem rewards.**"
        )
        .setFooter({ text: `Your notoriety: ${seasonxp}` })
        .addFields([{ name: "Rewards", value: `${itemrewards2.join("\n")}` }])
        .setColor(colors.blue)
        .setThumbnail("https://i.imgur.com/9oPxIib.png")
        .setFooter(tipFooterSeasonPages);
    } else if (page == "3") {
       embed = new discord.EmbedBuilder()
        .setTitle("Fall Season Page 3 of 10")
        .setDescription(
          "*Ends December 1st 2022*\n**Use `/reward [number]` to redeem rewards.**"
        )
        .setFooter({ text: `Your notoriety: ${seasonxp}` })
        .addFields([{ name: "Rewards", value: `${itemrewards3.join("\n")}` }])
        .setColor(colors.blue)
        .setThumbnail("https://i.imgur.com/9oPxIib.png")
        .setFooter(tipFooterSeasonPages);
    } else if (page == "4") {
       embed = new discord.EmbedBuilder()
        .setTitle("Fall Season Page 4 of 10")
        .setDescription(
          "*Ends December 1st 2022*\n**Use `/reward [number]` to redeem rewards.**"
        )
        .setFooter({ text: `Your notoriety: ${seasonxp}` })
        .addFields([{ name: "Rewards", value: `${itemrewards4.join("\n")}` }])
        .setColor(colors.blue)
        .setThumbnail("https://i.imgur.com/9oPxIib.png")
        .setFooter(tipFooterSeasonPages);
    } else if (page == "5") {
       embed = new discord.EmbedBuilder()
        .setTitle("Fall Season Page 5 of 10")
        .setDescription(
          "*Ends December 1st 2022*\n**Use `/reward [number]` to redeem rewards.**"
        )
        .setFooter({ text: `Your notoriety: ${seasonxp}` })
        .addFields([{ name: "Rewards", value: `${itemrewards5.join("\n")}` }])
        .setColor(colors.blue)
        .setThumbnail("https://i.imgur.com/9oPxIib.png")
        .setFooter(tipFooterSeasonPages);
    }
    else if (page == "6") {
       embed = new discord.EmbedBuilder()
        .setTitle("Fall Season Page 6 of 10")
        .setDescription(
          "*Ends December 1st 2022*\n**Use `/reward [number]` to redeem rewards.**"
        )
        .setFooter({ text: `Your notoriety: ${seasonxp}` })
        .addFields([{ name: "Rewards", value: `${itemrewards6.join("\n")}` }])
        .setColor(colors.blue)
        .setThumbnail("https://i.imgur.com/9oPxIib.png")
        .setFooter(tipFooterSeasonPages);
    }
    else if (page == "7") {
       embed = new discord.EmbedBuilder()
        .setTitle("Fall Season Page 7 of 10")
        .setDescription(
          "*Ends December 1st 2022*\n**Use `/reward [number]` to redeem rewards.**"
        )
        .setFooter({ text: `Your notoriety: ${seasonxp}` })
        .addFields([{ name: "Rewards", value: `${itemrewards7.join("\n")}` }])
        .setColor(colors.blue)
        .setThumbnail("https://i.imgur.com/9oPxIib.png")
        .setFooter(tipFooterSeasonPages);
    }
    else if (page == "8") {
       embed = new discord.EmbedBuilder()
        .setTitle("Fall Season Page 8 of 10")
        .setDescription(
          "*Ends December 1st 2022*\n**Use `/reward [number]` to redeem rewards.**"
        )
        .setFooter({ text: `Your notoriety: ${seasonxp}` })
        .addFields([{ name: "Rewards", value: `${itemrewards8.join("\n")}` }])
        .setColor(colors.blue)
        .setThumbnail("https://i.imgur.com/9oPxIib.png")
        .setFooter(tipFooterSeasonPages);
    }
    else if (page == "9") {
       embed = new discord.EmbedBuilder()
        .setTitle("Fall Season Page 9 of 10")
        .setDescription(
          "*Ends December 1st 2022*\n**Use `/reward [number]` to redeem rewards.**"
        )
        .setFooter({ text: `Your notoriety: ${seasonxp}` })
        .addFields([{ name: "Rewards", value: `${itemrewards9.join("\n")}` }])
        .setColor(colors.blue)
        .setThumbnail("https://i.imgur.com/9oPxIib.png")
        .setFooter(tipFooterSeasonPages);
    }
    else if (page == "10") {
       embed = new discord.EmbedBuilder()
        .setTitle("Fall Season Page 10 of 10")
        .setDescription(
          "*Ends December 1st 2022*\n**Use `/reward [number]` to redeem rewards.**"
        )
        .setFooter({ text: `Your notoriety: ${seasonxp}` })
        .addFields([{ name: "Rewards", value: `${itemrewards10.join("\n")}` }])
        .setColor(colors.blue)
        .setThumbnail("https://i.imgur.com/9oPxIib.png")
        .setFooter(tipFooterSeasonPages);
        
      }
      let row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId("claim")
        .setLabel(`Claim Reward ${redeemed += 1}`)
        .setStyle(`Success`)
      )
      
      let notor = userdata.notofall
      redeemed = userdata.fallrewards || 1;
      let rew = redeemed
      let item = seasons.Seasons.Fall.Rewards[rew];
      if(item.Required > notor) {
        row.components[0].setStyle(`Danger`)
         
      }

    let msg =  await interaction.reply({ embeds: [embed], components: [row] });
      

    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector = msg.createMessageComponentCollector({
      filter: filter,
    });

    collector.on('collect', async (i) => {
      if(i.customId.includes("claim")){
         notor = userdata.notofall
        redeemed = userdata.fallrewards || 1
         rew = redeemed
         item = seasons.Seasons.Fall.Rewards[rew];
        if(item.Required > notor) {
           return i.update({content:`You need ${item.Required} notoriety!`})
        }
        if(item.Item.endsWith("Cash")){
          let amount = Number(item.Item.split(" ")[0])
          userdata.cash += amount
          userdata.fallrewards += 1
        }
        else if(item.Item.endsWith("Rare Keys")){
          let amount = Number(item.Item.split(" ")[0])
          userdata.rkeys += amount
          userdata.fallrewards += 1
        }
        else if(item.Item.endsWith("Exotic Keys")){
          let amount = Number(item.Item.split(" ")[0])
          userdata.ekeys += amount
          userdata.fallrewards += 1
        }
        else if(item.Item.endsWith("Barn Map") || item.Item.endsWith("Barn Maps")){
          let amount = Number(item.Item.split(" ")[0])
          userdata.cmaps += amount
          userdata.fallrewards += 1
        }
    
        else if(item.Item.endsWith("Legendary Barn Map") || item.Item.endsWith("Legendary Barn Maps")){
          let amount = Number(item.Item.split(" ")[0])
          userdata.lmaps += amount
          userdata.fallrewards += 1
        }

        else if(item.Item.endsWith("Garage Space" || item.Item.endsWith("Garage Spaces"))){
          let amount = Number(item.Item.split(" ")[0])
          userdata.garagelimit += amount
          userdata.fallrewards += 1
        }
        else if(item.Item.endsWith("Helmet")){
          let helm = item.Item.toLowerCase()
          userdata.pfps.push(helm)
          userdata.fallrewards += 1
        }
        else if(item.Item.endsWith("Bank Increase") || item.Item.endsWith("Bank Increases")){
          let amount = item.Item.split(" ")[0]
          let user1newpart = [];
          for (var b = 0; i < amount; b++) user1newpart.push("bank increase");
          for (i in user1newpart) {
            userdata.parts.push("bank increase");
          }
          userdata.fallrewards += 1
        }
        else if(item.Item.endsWith("Big Bank Increase") || item.Item.endsWith("Big Bank Increases")){
          let amount = item.Item.split(" ")[0]
          let user1newpart = [];
          for (var c = 0; i < amount; c++) user1newpart.push("big bank increase");
          for (i in user1newpart) {
            userdata.parts.push("big bank increase");
          }
          userdata.fallrewards += 1
        }
        else if(partdb.Parts[item.Item.toLowerCase()]){
          userdata.parts.push(item.Item.toLowerCase())
          userdata.fallrewards += 1
        }
        else if(cardb.Cars[item.Item.toLowerCase()]){
          let carindb = cardb.Cars[item.Item.toLowerCase()];
          let carobj = {
            ID: carindb.alias,
            Name: carindb.Name,
            Speed: carindb.Speed,
            Acceleration: carindb["0-60"],
            Handling: carindb.Handling,
            Parts: [],
            Emote: carindb.Emote,
            Livery: carindb.Image,
            Miles: 0,
          };
          userdata.cars.push(carobj)
          userdata.fallrewards += 1
        }
        userdata.save()
        console.log(item)
        row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId("claim")
          .setLabel(`Claim Reward ${redeemed += 1}`)
          .setStyle(`Secondary`)
        )


       i.update({embeds: [embed], components: [row]})
      }
    })


  },
};
