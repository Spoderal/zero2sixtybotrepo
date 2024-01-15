

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { invisibleSpace } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("imports")
    .setDescription("View import crates"),
  async execute(interaction) {
    let key1emote = emotes.commonKey;
    let key2emote = emotes.rareKey;
    let key3emote = emotes.exoticKey;
    let key5emote = emotes.dirftKey;

    let embed = new Discord.EmbedBuilder()
      .setTitle("Kaylas Import Crates")
      .addFields([
        {
          name: invisibleSpace,
          value: `
          <:crate_common:1103921687818407936> Common Import Crate: 50 ${key1emote} Keys *Car Cost: 25 Common Credits*
          <:crate_rare:1103921686765637703> Rare Import Crate : 25 ${key2emote} Keys *Car Cost: 25 Rare Credits*
          <:crate_esxotic:1103921685972922449> Exotic Import Crate : 20 ${key3emote} Keys *Car Cost: 25 Exotic Credits*
          <:crate_limited:1103921683968032829> Fictional Import Crate : 250 <:key_limited:1103923572063354880> Keys
          `,
        },
      ])
      .setDescription(
        "Exclusive cars that you can only find in crates!\n\nUse `/unbox` to buy them! Or, if you get too many you don't like, use /sell to get import credits to buy a car you DO want"
      )
      .setThumbnail("https://i.ibb.co/MBGccn7/kayla.png")
      .setColor(colors.blue);
    await interaction.reply({ embeds: [embed] });
  },
  permissions: "",
  requiredRoles: [],
};
