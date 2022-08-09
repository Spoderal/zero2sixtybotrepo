const discord = require("discord.js");
const squads = require("../data/squads.json");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("squad")
    .setDescription("Check the details of a squad")
    .addStringOption((option) =>
      option
        .setName("squad")
        .setDescription("The squad you want to see the details of")
        .setRequired(true)
        .addChoices(
          { name: "Flame House", value: "flamehouse" },
          { name: "Skull Crunchers", value: "skullcrunchers" },
          { name: "The Speed", value: "thespeed" },
          { name: "Scrap Heads", value: "scrapheads" },
          { name: "Snow Monsters", value: "snowmonsters" },
          { name: "Tuner4Life", value: "tuner4life" },
          { name: "BikerGang", value: "bikergang" },
          { name: "ZeroRacers", value: "zeroracers" }
        )
    ),
  async execute(interaction) {
    let squas = squads.Squads;
    let squad = interaction.options.getString("squad");
    if (!squad) return interaction.reply("Specify a squad!");
    if (!squas[squad.toLowerCase()])
      return interaction.reply("Thats not a squad!");

    let embed = new discord.EmbedBuilder()
      .setTitle(`Squad Info for ${squas[squad.toLowerCase()].Name}`)
      .setThumbnail(squas[squad.toLowerCase()].Icon)
      .setColor(squas[squad].Color)
      .addFields([
        { name: "Leader", value: squas[squad].Leader },
        { name: "Members", value: `${squas[squad].Members.join("\n")}` },
        { name: "Class", value: `${squas[squad].Class}` },
      ]);

    interaction.reply({ embeds: [embed] });
  },
};
