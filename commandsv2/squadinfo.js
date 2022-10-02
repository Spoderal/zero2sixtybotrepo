const { SlashCommandBuilder } = require("@discordjs/builders");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");
const squadsdb = require("../data/squads.json");
const { EmbedBuilder } = require("discord.js");
const { primary } = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("squad")
    .setDescription("Show the information of the squad you're at"),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let tier = userdata.tier;
    let squadsarr = [];
    for (let s in squadsdb.Squads) {
      let sq = squadsdb.Squads[s];
      squadsarr.push(sq);
    }

    let squadfiltered = squadsarr.filter((squad) => squad.Tier == tier);
    console.log(squadfiltered[0]);

    let squadinfo = squadfiltered[0];

    let embed = new EmbedBuilder()
      .setTitle(`Info for ${squadinfo.Name}`)
      .setColor(`#60B0F4`)
      .setDescription(
        `Class: ${squadinfo.Class}\nTier: ${squadinfo.Tier}\nCash Earnings: ${squadinfo.Reward}\nBoss Cash Earnings: ${squadinfo.BigReward}`
      )
      .addFields({ name: "Cars", value: `${squadinfo.Cars.join("\n")}` })
      .setThumbnail(`${squadinfo.Icon}`);

    interaction.reply({ embeds: [embed] });
  },
};
