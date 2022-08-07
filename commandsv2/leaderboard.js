const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderstats")
    .setDescription("Check the leaderboard"),
  async execute(interaction) {
    interaction.reply({ content: `Please wait...`, fetchReply: true });

    let data = await User.find({});
    let members = [];

    for (let obj of data) {
      console.log(obj.id);
      try {
        await interaction.client.users
          .fetch(`${obj.id}`)
          .then(members.push(obj));
      } catch (err) {
        console.log(err);
      }
    }

    let embed = new Discord.MessageEmbed()
      .setTitle("Cash Leaderboard")
      .setColor("#60b0f4");

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
        embed.setFooter(`Your position is #${pos} on the cash leaderboard`);
      }
    }

    members = members.slice(0, 10);

    let desc = "";

    for (let i = 0; i < members.length; i++) {
      let user = interaction.client.users.cache.get(members[i].id);
      if (!user) return;
      let bal = members[i].cash;
      desc += `${i + 1}. ${user.tag} - $${numberWithCommas(bal)}\n`;
    }

    embed.setDescription(desc);

    await interaction.editReply({ embeds: [embed] });
  },
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
