"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");
const squadsdb = require("../data/squads.json");
const { EmbedBuilder } = require("discord.js");

const { toCurrency } = require("../common/utils");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("squad")
    .setDescription(
      "Show the information of the squad you're at, or another squad"
    )
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Option to use")
        .addChoices(
          { name: "List", value: "list" },
          { name: "Info", value: "info" }
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("squad")
        .setDescription("Squad to see the info of")
        .setRequired(false)
    ),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let tier = userdata.tier;
    let squadsarr = [];
    let option = interaction.options.getString("option");
    for (let s in squadsdb.Squads) {
      let sq = squadsdb.Squads[s];
      squadsarr.push(sq);
    }

    if (option == "list") {
      let embed = new EmbedBuilder()
        .setTitle("Squads List")
        .setColor(`#60B0F4`);
      for (let s in squadsarr) {
        embed.addFields({
          name: `${squadsarr[s].Emote} ${squadsarr[s].Name}`,
          value: `Tier: ${squadsarr[s].Tier}`,
          inline: true,
        });
      }

      interaction.reply({ embeds: [embed] });
    } else if (option == "info") {
      let squatofind = interaction.options.getString("squad").toLowerCase();
      let squadfiltered = squadsarr.filter(
        (squad) => squad.Name.toLowerCase() == squatofind
      );
      if (!squadfiltered[0]) return interaction.reply("Thats not a squad!");

      let squadinfo = squadfiltered[0];

      let embed = new EmbedBuilder()
        .setTitle(`Info for ${squadinfo.Emote} ${squadinfo.Name}`)
        .setColor(`#60B0F4`)
        .setDescription(
          `Class: ${squadinfo.Class}\nTier: ${
            squadinfo.Tier
          }\nCash Earnings: ${toCurrency(
            squadinfo.Reward
          )}\nBoss Cash Earnings: ${toCurrency(squadinfo.BigReward)}`
        )
        .addFields({ name: "Cars", value: `${squadinfo.Cars.join("\n")}` })
        .setThumbnail(`${squadinfo.Icon}`);

      interaction.reply({ embeds: [embed] });
    } else {
      let squadfiltered = squadsarr.filter((squad) => squad.Tier == tier);
      let squadinfo = squadfiltered[0];

      let embed = new EmbedBuilder()
        .setTitle(`Info for ${squadinfo.Emote} ${squadinfo.Name}`)
        .setColor(`#60B0F4`)
        .setDescription(
          `Class: ${squadinfo.Class}\nTier: ${
            squadinfo.Tier
          }\nCash Earnings: ${toCurrency(
            squadinfo.Reward
          )}\nBoss Cash Earnings: ${toCurrency(squadinfo.BigReward)}`
        )
        .addFields({ name: "Cars", value: `${squadinfo.Cars.join("\n")}` })
        .setThumbnail(`${squadinfo.Icon}`);

      interaction.reply({ embeds: [embed] });
    }
  },
};
