const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("imports")
    .setDescription("View import crates"),
  async execute(interaction) {
    let key1emote = emotes.commonKey;
    let key2emote = emotes.rareKey;
    let key3emote = emotes.exoticKey;
    let key4emote = emotes.drfitKey;
    let goldemote = emotes.gold;

    let embed = new Discord.EmbedBuilder()
      .setTitle("Import Crates")
      .addFields([
        {
          name: "​",
          value: `
            Common Import Crate: 50 ${key1emote} Keys
            Rare Import Crate : 25 ${key2emote} Keys
            Exotic Import Crate : 20 ${key3emote} Keys
            Drift Import Crate : 5 ${key4emote} **LIMITED**
            Ferrari Import Crate : 100 <:ferrari:931011838374727730> **LIMITED**
            Z Crate 1 : 5 ${goldemote}
          `,
        },
      ])
      .setDescription(
        "Exclusive cars that you can only find in crates!\n\nUse `/unbox` to buy them!"
      )
      .setThumbnail("https://i.ibb.co/vs3Gm1H/Logo-Makr-2hu-VKG.png")
      .setColor(colors.blue);
    await interaction.reply({ embeds: [embed] });
  },
  permissions: "",
  requiredRoles: [],
};
