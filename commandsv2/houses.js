const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const housedb = require("../data/houses.json");
const lodash = require("lodash");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const warehousedb = require("../data/warehouses.json");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { emotes } = require("../common/emotes");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("houses")
    .setDescription("View houses for sale"),
  async execute(interaction) {
    let houseimages = [];

    houseimages.push(housedb["speed street"].Image);
    houseimages.push(housedb["zero avenue"].Image);
    houseimages.push(housedb["bently boulevard"].Image);
    houseimages.push(housedb["driving drive"].Image);
    houseimages.push(housedb["porsche point"].Image);

    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Warehouses")
        .setEmoji(emotes.warehouse)
        .setCustomId("warehouse")
        .setStyle("Secondary")
    );
    let houseimage = lodash.sample(houseimages);

    let embed = new Discord.EmbedBuilder()
      .setTitle("Houses For Sale")
      .setDescription(
        `**YOU CAN ONLY OWN 1 AT A TIME**\n\n**__Speed Street: ${toCurrency(
          housedb["speed street"].Price
        )}__** ${housedb["speed street"].Emote}\n__Perks__\n${housedb[
          "speed street"
        ].Rewards.join("\n")}\n
        **__Driving Drive: ${toCurrency(housedb["driving drive"].Price)}__** ${
          housedb["driving drive"].Emote
        }\n__Perks__\n${housedb["driving drive"].Rewards.join("\n")}\n
        **__Zero Avenue: ${toCurrency(housedb["zero avenue"].Price)}__** ${
          housedb["zero avenue"].Emote
        }\n__Perks__\n${housedb["zero avenue"].Rewards.join("\n")}\n
        **__Bently Boulevard: ${toCurrency(
          housedb["bently boulevard"].Price
        )}__** ${housedb["bently boulevard"].Emote}\n__Perks__\n${housedb[
          "bently boulevard"
        ].Rewards.join("\n")}\n
        **__Porsche Point: ${toCurrency(housedb["porsche point"].Price)}__** ${
          housedb["porsche point"].Emote
        }\n__Perks__\n${housedb["porsche point"].Rewards.join("\n")}\n
        **__Moon Base: ${toCurrency(housedb["moon base"].Price)}__** ${
          housedb["moon base"].Emote
        }\n__Perks__\n${housedb["moon base"].Rewards.join("\n")}\n
        **__Yacht: ${toCurrency(housedb["yacht"].Price)}__** ${
          housedb["yacht"].Emote
        }\n__Perks__\n${housedb["yacht"].Rewards.join("\n")}\n

        `
      )
      .setColor(colors.blue)
      .setThumbnail(houseimage);

    let msg = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
      components: [row],
    });
    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    const collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 10000,
    });

    collector.on("collect", async (i) => {
      if (i.customId.includes("warehouse")) {
        embed
          .setTitle("Warehouses for sale")
          .setDescription(
            `**__${warehousedb.t1warehouse.Emote} ${
              warehousedb.t1warehouse.Name
            } : ${toCurrency(warehousedb.t1warehouse.Price)}__**\n${
              warehousedb.t1warehouse.Space
            } Garage Spaces\n\n**__${warehousedb.t2warehouse.Emote} ${
              warehousedb.t2warehouse.Name
            } : ${toCurrency(warehousedb.t2warehouse.Price)}__**\n${
              warehousedb.t2warehouse.Space
            } Garage Spaces`
          );
        i.update({ embeds: [embed] });
      }
    });
  },
};
