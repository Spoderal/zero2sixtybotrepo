const Discord = require("discord.js");

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("imports")
    .setDescription("View import crates"),
  async execute(interaction) {
    let key1emote = "<:commonkey:938734258065932339>";
    let key2emote = "<:rarekey:938734258367918120>";
    let key3emote = "<:exotickey:938734258275631164>";
    let key4emote = "<:driftkey:970486254896570469>";
    let goldemote = "<:z_gold:933929482518167552>";

    let embed = new Discord.MessageEmbed()
      .setTitle("Import Crates")
      .addFields({
        name: "​",
        value: `Common Import Crate: 50 ${key1emote} Keys\nRare Import Crate : 25 ${key2emote} Keys\nExotic Import Crate : 20 ${key3emote} Keys\nDrift Import Crate : 5 ${key4emote} **LIMITED**\nFerrari Import Crate : 100 <:ferrari:931011838374727730> **LIMITED**\nZ Crate 1 : 5 ${goldemote}`,
      })
      .setDescription(
        "Exclusive cars that you can only find in crates!\n\nUse `/unbox` to buy them!"
      )
      .setThumbnail("https://i.ibb.co/vs3Gm1H/Logo-Makr-2hu-VKG.png")
      .setColor("#60b0f4");
    interaction.reply({ embeds: [embed] });
  },
  permissions: "",
  requiredRoles: [],
};
