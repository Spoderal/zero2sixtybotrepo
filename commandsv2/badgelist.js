const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("badgelist")
    .setDescription("Check the available badges to collect"),
  async execute(interaction) {
    let embed = new Discord.MessageEmbed()

      .setTitle(`Badges Available`)
      .setDescription(
        `**Car Collector** = *Own 10 cars*\n
       **Filthy Rich** = *Earn 1 million cash*\n
       **Time Master** = *Complete the time trial in under 20 seconds*\n
       **Drift King** = *Earn a drift level of 50 or more*\n
       **How?** = *Win a race in a Peel P50*\n
       **Race King** = *Win 100 races*\n
       **2EZ** = *Win a group pvp race*\n
       **Car Rich** = *Have a total garage value of $50M*\n
       **SECRET** = *SECRET*
       `
      )
      .setColor("#60b0f4");

    interaction.reply({ embeds: [embed] });
  },
  permissions: "",
  requiredRoles: [],
};
