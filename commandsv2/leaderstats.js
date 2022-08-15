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
    let members = [];
    console.log(`Found ${users?.length} users`);

    for (let user of users) {
      try {
        await interaction.client.users.fetch(user.id).then(members.push(user));
      } catch (err) {
        // swallow this error
      }
    }

    console.log(`Created ${members?.length} members`);

    if (!members?.length) {
      return await interaction.editReply("The leaderboard is currently empty!");
    }

    let embed = new Discord.EmbedBuilder()
      .setTitle("Cash Leaderboard")
      .setColor(colors.blue);

    console.log("filtering, sorting, and slicing members array");
    members = members
      .filter(function BigEnough(value) {
        return value.cash > 0;
      })
      .sort(function (b, a) {
        return a.cash - b.cash;
      })
      .slice(0, 10);

    console.log(`Members array length is now at ${members?.length}`);
    
    console.log("Checking for user in top 10...");
    const userPositionInTopTen = members?.findIndex(
      (m) => m.id == interaction.user.id
    );

    if (userPositionInTopTen >= 0) {
      embed.setFooter({
        text: `Your position is #${
          userPositionInTopTen + 1
        } on the cash leaderboard!`,
      });
    }

    console.log("Creating the list of users for the descriptoin...");
    let desc = "";
    for (let i = 0; i < members.length; i++) {
      let user = interaction.client.users.cache.get(members[i].id);
      if (!user) return;
      let bal = members[i].cash;
      desc += `${i + 1}. ${user.tag} - ${toCurrency(bal)}.00\n`;
    }

    embed.setDescription(desc);

    await interaction.editReply({ embeds: [embed] });
  },
};
