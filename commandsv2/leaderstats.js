const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderstats")
    .setDescription("Check the leaderboard"),

  async execute(interaction) {
    await interaction.deferReply();
    let leaderboardtype = interaction.options.getString("leaderboard");

    let users = await User.find({});
    if (!users?.length) {
      return await interaction.editReply("The leaderboard is currently empty!");
    }

    let embed = new Discord.EmbedBuilder()
      .setTitle("Cash Leaderboard")
      .setColor(colors.blue);

    const filteredUsers = users
      .filter((value) => value.cash > 0)
      .sort((b, a) => a.cash - b.cash)
      .slice(0, 40);

    if (!filteredUsers?.length) {
      return await interaction.editReply("The leaderboard is currently empty!");
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
      return await interaction.editReply("The leaderboard is currently empty!");
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
  },
};
