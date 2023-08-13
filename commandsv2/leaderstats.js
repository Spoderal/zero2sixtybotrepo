const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const ranks = require("../data/ranks.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderstats")
    .setDescription("Check the leaderboard")
    .addSubcommand((cmd) =>
      cmd.setName("cash").setDescription("See the richest users")
    )
    .addSubcommand((cmd) =>
      cmd.setName("prestige").setDescription("See the highest prestiged users")
    )
    .addSubcommand((cmd) =>
      cmd.setName("pvp").setDescription("See who has the best PVP rank")
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("typetakeover")
        .setDescription("See who has the best typing speed")
    ),

  async execute(interaction) {
    await interaction.deferReply();
    let leaderboardtype = interaction.options.getSubcommand();

    let users = await User.find({});
    if (!users?.length) {
      return await interaction.editReply(
        "The cash leaderboard is currently empty!"
      );
    }

    let embed;
    if (leaderboardtype == "cash") {
      embed = new Discord.EmbedBuilder()
        .setTitle("Cash Leaderboard")
        .setColor(colors.blue)
        .setThumbnail("https://i.ibb.co/M9tTHXX/emote-cash.png");

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
        console.log(user.id);
        currentUserPosition =
          filteredUsers[i].id == interaction.user.id ? i + 1 : 0;
      }

      const onlyTaggedUsers = filteredUsers.filter((u) => u.tag).slice(0, 10);
      if (!onlyTaggedUsers?.length) {
        return await interaction.editReply(
          "The cash leaderboard is currently empty!"
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
        )}\n`;
      }

      embed.setDescription(desc);
    } else if (leaderboardtype == "typetakeover") {
      embed = new Discord.EmbedBuilder()
        .setTitle("Type Racer Leaderboard")
        .setColor(colors.blue)
        .setThumbnail("https://i.ibb.co/kxct423/key-z.png");

      const filteredUsers = users
        .filter((value) => value.typespeed > 0)
        .sort((b, a) => a.typespeed - b.typespeed)
        .slice(0, 20);

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
        console.log(user.id);
        currentUserPosition =
          filteredUsers[i].id == interaction.user.id ? i + 1 : 0;
      }

      const onlyTaggedUsers = filteredUsers.filter((u) => u.tag).slice(0, 10);
      if (!onlyTaggedUsers?.length) {
        return await interaction.editReply(
          "The cash leaderboard is currently empty!"
        );
      }

      if (currentUserPosition > 0) {
        embed.setFooter({
          text: `Your position is #${currentUserPosition} on the type racer leaderboard!`,
        });
      }

      let desc = "";
      for (let i = 0; i < onlyTaggedUsers.length; i++) {
        desc += `${i + 1}. ${onlyTaggedUsers[i].tag} - ${
          onlyTaggedUsers[i].typespeed
        }s\n`;
      }

      embed.setDescription(desc);
    } else if (leaderboardtype == "prestige") {
      embed = new Discord.EmbedBuilder()
        .setTitle("Prestige Leaderboard")
        .setThumbnail("https://i.ibb.co/n31P7rK/rank-prestige.png")
        .setColor(colors.blue);

      const filteredUsers = users
        .filter((value) => value.prestige > 0)
        .sort((b, a) => a.prestige - b.prestige)
        .slice(0, 40);

      if (!filteredUsers?.length) {
        return await interaction.editReply(
          "The prestige leaderboard is currently empty!"
        );
      }

      let currentUserPosition = 0;
      for (let i = 0; i < filteredUsers?.length; i++) {
        const user = await interaction.client.users
          .fetch(filteredUsers[i].id)
          .catch(() => {});
        if (!user?.username) continue;
        filteredUsers[i].tag = `${user.username}#${user.discriminator}`;
        console.log(user.id);
        currentUserPosition =
          filteredUsers[i].id == interaction.user.id ? i + 1 : 0;
      }

      const onlyTaggedUsers = filteredUsers.filter((u) => u.tag).slice(0, 10);
      if (!onlyTaggedUsers?.length) {
        return await interaction.editReply(
          "The prestige leaderboard is currently empty!"
        );
      }

      if (currentUserPosition > 0) {
        embed.setFooter({
          text: `Your position is #${currentUserPosition} on the prestige leaderboard!`,
        });
      }

      let desc = "";
      for (let i = 0; i < onlyTaggedUsers.length; i++) {
        desc += `${i + 1}. ${onlyTaggedUsers[i].tag} - ${
          onlyTaggedUsers[i].prestige
        } <:rank_newprestige:1114812459182723102>\n`;
      }

      embed.setDescription(desc);
    } else if (leaderboardtype == "pvp") {
      embed = new Discord.EmbedBuilder()
        .setTitle("PVP Leaderboard")
        .setColor(colors.blue);

      const filteredUsers = users
        .filter((value) => value.pvprank.Wins > 0)
        .sort((b, a) => a.pvprank.Wins - b.pvprank.Wins)
        .slice(0, 40);

      if (!filteredUsers?.length) {
        return await interaction.editReply(
          "The PVP leaderboard is currently empty!"
        );
      }

      let currentUserPosition = 0;
      for (let i = 0; i < filteredUsers?.length; i++) {
        const user = await interaction.client.users
          .fetch(filteredUsers[i].id)
          .catch(() => {});
        if (!user?.username) continue;
        filteredUsers[i].tag = `${user.username}#${user.discriminator}`;
        console.log(user.id);
        currentUserPosition =
          filteredUsers[i].id == interaction.user.id ? i + 1 : 0;
      }

      const onlyTaggedUsers = filteredUsers.filter((u) => u.tag).slice(0, 10);
      if (!onlyTaggedUsers?.length) {
        return await interaction.editReply(
          "The PVP leaderboard is currently empty!"
        );
      }

      if (currentUserPosition > 0) {
        embed.setFooter({
          text: `Your position is #${currentUserPosition} on the PVP leaderboard!`,
        });
      }

      let desc = "";
      for (let i = 0; i < onlyTaggedUsers.length; i++) {
        let pvpemote =
          ranks[onlyTaggedUsers[i].pvprank.Rank.toLowerCase()].emote;
        desc += `${i + 1}. ${onlyTaggedUsers[i].tag} - ${pvpemote} ${
          onlyTaggedUsers[i].pvprank.Wins
        }\n`;
      }

      embed.setDescription(desc);
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
