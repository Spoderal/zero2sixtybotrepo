const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderstats")
    .setDescription("Check the leaderboard")
    .addStringOption((option) =>
      option
        .setDescription("The leaderboard to view")

        .setRequired(false)
        .setName("leaderboard")
        .addChoices(
          {
            name: "Stock Event",
            value: "stock event",
          },
          {
            name: "World Championship",
            value: "world",
          }
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();
    let leaderboardtype = interaction.options.getString("leaderboard");
    if (leaderboardtype == "stock event") {
      let users = await User.find({});
      if (!users?.length) {
        return await interaction.editReply(
          "The leaderboard is currently empty!"
        );
      }

      let embed = new Discord.EmbedBuilder()
        .setTitle("Stock Points Leaderboard")
        .setColor(colors.blue);

      const filteredUsers = users
        .filter((value) => value.stockpoints > 0)
        .sort((b, a) => a.stockpoints - b.stockpoints)
        .slice(0, 10);

      if (!filteredUsers?.length) {
        return await interaction.editReply(
          "The leaderboard is currently empty!"
        );
      }

      let currentUserPosition = 0;
      for (let i = 0; i < filteredUsers?.length; i++) {
        const user = await interaction.client.users
          .fetch(filteredUsers[i].id)
          .catch(() => {});
        if (!user?.username) continue;
        filteredUsers[i].tag = `${user.username}#${user.discriminator}`;
        currentUserPosition =
          filteredUsers[i].id == interaction.user.id ? i + 1 : 0;
      }

      const onlyTaggedUsers = filteredUsers.filter((u) => u.tag).slice(0, 10);
      if (!onlyTaggedUsers?.length) {
        return await interaction.editReply(
          "The leaderboard is currently empty!"
        );
      }

      if (currentUserPosition > 0) {
        embed.setFooter({
          text: `Your position is #${currentUserPosition} on the stock points leaderboard!`,
        });
      }

      let desc = "";
      for (let i = 0; i < onlyTaggedUsers.length; i++) {
        desc += `${i + 1}. ${onlyTaggedUsers[i].tag} - ${
          onlyTaggedUsers[i].stockpoints
        }\n`;
      }
      embed.setThumbnail("https://i.ibb.co/tZ1qs7K/STOCKPOINTS.png");
      embed.setDescription(desc);

      await interaction.editReply({ embeds: [embed] });
    } else if (leaderboardtype == "world") {
      let users = await User.find({});
      if (!users?.length) {
        return await interaction.editReply(
          "The leaderboard is currently empty!"
        );
      }

      let embed = new Discord.EmbedBuilder()
        .setTitle("World Championship Leaderboard")
        .setColor(colors.blue);

      const filteredUsers = users
        .filter((value) => value.worldwins > 0)
        .sort((b, a) => a.worldwins - b.worldwins)
        .slice(0, 10);

      if (!filteredUsers?.length) {
        return await interaction.editReply(
          "The leaderboard is currently empty!"
        );
      }

      let currentUserPosition = 0;
      for (let i = 0; i < filteredUsers?.length; i++) {
        const user = await interaction.client.users
          .fetch(filteredUsers[i].id)
          .catch(() => {});
        if (!user?.username) continue;
        filteredUsers[i].tag = `${user.username}#${user.discriminator}`;
        currentUserPosition =
          filteredUsers[i].id == interaction.user.id ? i + 1 : 0;
      }

      const onlyTaggedUsers = filteredUsers.filter((u) => u.tag).slice(0, 10);
      if (!onlyTaggedUsers?.length) {
        return await interaction.editReply(
          "The leaderboard is currently empty!"
        );
      }

      if (currentUserPosition > 0) {
        embed.setFooter({
          text: `Your position is #${currentUserPosition} on the world championship leaderboard!`,
        });
      }

      let desc = "";
      for (let i = 0; i < onlyTaggedUsers.length; i++) {
        desc += `${i + 1}. ${onlyTaggedUsers[i].tag} - ${
          onlyTaggedUsers[i].stockpoints
        }\n`;
      }
      embed.setThumbnail("https://i.ibb.co/tZ1qs7K/STOCKPOINTS.png");
      embed.setDescription(desc);

      await interaction.editReply({ embeds: [embed] });
    } else {
      let users = await User.find({});
      if (!users?.length) {
        return await interaction.editReply(
          "The leaderboard is currently empty!"
        );
      }

      let embed = new Discord.EmbedBuilder()
        .setTitle("Cash Leaderboard")
        .setColor(colors.blue);

      const filteredUsers = users
        .filter((value) => value.cash > 0)
        .sort((b, a) => a.cash - b.cash)
        .slice(0, 40);

      if (!filteredUsers?.length) {
        return await interaction.editReply(
          "The leaderboard is currently empty!"
        );
      }

      let currentUserPosition = 0;
      for (let i = 0; i < filteredUsers?.length; i++) {
        const user = await interaction.client.users
          .fetch(filteredUsers[i].id)
          .catch(() => {});
        if (!user?.username) continue;
        filteredUsers[i].tag = `${user.username}#${user.discriminator}`;
        currentUserPosition =
          filteredUsers[i].id == interaction.user.id ? i + 1 : 0;
      }

      const onlyTaggedUsers = filteredUsers.filter((u) => u.tag).slice(0, 10);
      if (!onlyTaggedUsers?.length) {
        return await interaction.editReply(
          "The leaderboard is currently empty!"
        );
      }

      if (currentUserPosition > 0) {
        embed.setFooter({
          text: `Your position is #${currentUserPosition} on the cash leaderboard!`,
        });
      }

      let desc = "";
      for (let i = 0; i < onlyTaggedUsers.length; i++) {
        desc += `${i + 1}. ${onlyTaggedUsers[i].tag} - ${toCurrency(
          onlyTaggedUsers[i].cash
        )}.00\n`;
      }

      embed.setDescription(desc);

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
