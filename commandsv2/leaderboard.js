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
    interaction.reply({ content: `Please wait...`, fetchReply: true });

    let data = await User.find({});
    let members = [];

    for (let obj of data) {
      try {
        await interaction.client.users
          .fetch(`${obj.id}`)
          .then(members.push(obj));
      } catch (err) {
        // do nothing?
      }
    }

    let embed = new Discord.EmbedBuilder()
      .setTitle("Cash Leaderboard")
      .setColor(colors.blue);

    members = members.sort(function (b, a) {
      return a.cash - b.cash;
    });

    members = members.filter(function BigEnough(value) {
      return value.cash > 0;
    });

    let pos = 0;

    for (let obj of members) {
      pos++;
      if (obj.id == interaction.user.id) {
        embed.setFooter({
          text: `Your position is #${pos} on the cash leaderboard`,
        });
      }
    }

    members = members.slice(0, 10);

    let desc = "";

    for (let i = 0; i < members.length; i++) {
      let user = interaction.client.users.cache.get(members[i].id);
      if (!user) return;
      let bal = members[i].cash;
      desc += `${i + 1}. ${user.tag} - ${toCurrency(bal)}\n`;
    }

    embed.setDescription(desc);

    await interaction.editReply({ embeds: [embed] });
  },
};
