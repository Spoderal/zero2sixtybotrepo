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
        `**YOU CAN ONLY OWN 1 AT A TIME**\n
        **__Speed Street:__ ${toCurrency(housedb["speed street"].Price)}** ${
          housedb["speed street"].Emote
        }\n__Perks__\n${housedb["speed street"].Rewards.join("\n")}\n
        **__Driving Drive:__ ${toCurrency(housedb["driving drive"].Price)}** ${
          housedb["driving drive"].Emote
        }\n__Perks__\n${housedb["driving drive"].Rewards.join("\n")}\n
        **__Zero Avenue:__ ${toCurrency(housedb["zero avenue"].Price)}** ${
          housedb["zero avenue"].Emote
        }\n__Perks__\n${housedb["zero avenue"].Rewards.join("\n")}\n
        **__Bently Boulevard:__ ${toCurrency(
          housedb["bently boulevard"].Price
        )}** ${housedb["bently boulevard"].Emote}\n__Perks__\n${housedb[
          "bently boulevard"
        ].Rewards.join("\n")}\n
        **__Porsche Point:__ ${toCurrency(housedb["porsche point"].Price)}** ${
          housedb["porsche point"].Emote
        }\n__Perks__\n${housedb["porsche point"].Rewards.join("\n")}\n
        **__Moon Base:__ ${toCurrency(housedb["moon base"].Price)}** ${
          housedb["moon base"].Emote
        }\n__Perks__\n${housedb["moon base"].Rewards.join("\n")}\n
        **__Yacht:__ ${toCurrency(housedb["yacht"].Price)}** ${
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
        embed.setTitle("Warehouses for sale").setDescription(
          `**__${warehousedb.t1warehouse.Emote} ${
            warehousedb.t1warehouse.Name
          }__ : ${toCurrency(warehousedb.t1warehouse.Price)}**\n${
            warehousedb.t1warehouse.Space
          } Garage Spaces\n
            **__${warehousedb.t2warehouse.Emote} ${
            warehousedb.t2warehouse.Name
          }__ : ${toCurrency(warehousedb.t2warehouse.Price)}**\n${
            warehousedb.t2warehouse.Space
          } Garage Spaces`
        );
        i.update({ embeds: [embed] });
      }
    });
  },
};
