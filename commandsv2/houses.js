const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const housedb = require("../data/houses.json");
const lodash = require("lodash");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const warehousedb = require("../data/warehouses.json");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { emotes } = require("../common/emotes");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("houses")
    .setDescription("View houses for sale")
    .addSubcommand((cmd) =>
      cmd
        .setDescription("View the stats of a house")
        .setName("stats")
        .addStringOption((option) =>
          option
            .setName("house")
            .setRequired(true)
            .setDescription("The house to view")
        )
    )
    .addSubcommand((cmd) =>
      cmd.setDescription("View the list of houses").setName("list")
    ),

  async execute(interaction) {
    let subcommand = interaction.options.getSubcommand();
    let userdata = await User.findOne({ id: interaction.user.id });
    let housearray = [];
    let housearr = [];

    for (let house in housedb) {
      house = housedb[house];
      housearr.push(house);
      housearray.push(
        `${house.Emote} ${house.Name} : ${toCurrency(house.Price)} **<:rank_newprestige:1114812459182723102> ${house.Prestige}**\`ID: ${
          house.id
        }\``
      );
    }

    if (subcommand == "list") {
      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Warehouses")
          .setEmoji(emotes.warehouse)
          .setCustomId("warehouse")
          .setStyle("Secondary")
      );

      let embed = new Discord.EmbedBuilder()
        .setTitle("Houses For Sale")
        .setDescription(
          `
          ${housearray.join("\n\n")}
          `
        )
        .setColor(colors.blue);

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
    } else if (subcommand == "stats") {
      let housetoview = interaction.options.getString("house").toLowerCase();
      let filteredhouse = housearr.filter(
        (house) =>
          house.Name == housetoview.toLowerCase() ||
          house.id == housetoview.toLowerCase()
      );

      let embed = new Discord.EmbedBuilder()
        .setTitle(`Stats for ${filteredhouse[0].Name}`)
        .setImage(filteredhouse[0].Image)
        .setDescription(
          `Price: ${toCurrency(filteredhouse[0].Price)}\n\nPerk: ${
            filteredhouse[0].Perk
          }\n\nGarage Space: ${
            filteredhouse[0].Space
          }\n\nUnlocks at prestige: ${filteredhouse[0].Prestige}`
        )
        .setColor(colors.blue);

      interaction.reply({ embeds: [embed] });
    } 
  },
};
