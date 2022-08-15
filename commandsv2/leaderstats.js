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

    let users = await User.find({});

    console.log(`DEBUG: Found ${users?.length} users`);

    if (!users?.length) {
      return await interaction.editReply("The leaderboard is currently empty!");
    }

    let embed = new Discord.EmbedBuilder()
      .setTitle("Cash Leaderboard")
      .setColor(colors.blue);

    console.log("DEBUG: filtering with cash, sorting by cash, and slicing to 50");
    const filteredUsers = users
      .filter((value) => value.cash > 0)
      .sort((b, a) => a.cash - b.cash)
      .slice(0, 50);

    console.log(
      `DEBUG: Filtered user array length is now at ${filteredUsers?.length}`
    );

    if (!filteredUsers?.length) {
      return await interaction.editReply("The leaderboard is currently empty!");
    }

    console.log("DEBUG: Fetching user names...");
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

    console.log("DEBUG: Slicing to 10...");
    const onlyTaggedUsers = filteredUsers.filter((u) => u.tag).slice(0, 10);
    if (!onlyTaggedUsers?.length) {
      return await interaction.editReply("The leaderboard is currently empty!");
    }

    if (currentUserPosition > 0) {
      embed.setFooter({
        text: `Your position is #${currentUserPosition} on the cash leaderboard!`,
      });
    }

    console.log("DEBUG: Creating the list of users for the description...");
    let desc = "";
    for (let i = 0; i < onlyTaggedUsers.length; i++) {
      desc += `${i + 1}. ${onlyTaggedUsers[i].tag} - ${toCurrency(
        onlyTaggedUsers[i].cash
      )}.00\n`;
    }

    embed.setDescription(desc);

    console.log("DEBUG: Replying");
    await interaction.editReply({ embeds: [embed] });
  },
};
