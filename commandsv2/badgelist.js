const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("badgelist")
    .setDescription("Check the available badges to collect"),

  async execute(interaction) {
    let embed = new EmbedBuilder()
      .setTitle(`Badges Available`)
      .setDescription(
        `
        **Car Collector** = *Own 10 cars*
        **Filthy Rich** = *Earn 1 million cash*
        **Time Master** = *Complete the time trial in under 20 seconds*
        **Drift King** = *Earn a drift level of 50 or more*
        **How?** = *Win a race in a Peel P50*
        **Race King** = *Win 100 races*
        **2EZ** = *Win a group pvp race*
        **Car Rich** = *Have a total garage value of $50M*
        **SECRET** = *SECRET*
      `
      )
      .setColor(colors.blue);

    await interaction.reply({ embeds: [embed] });
  },
  permissions: "",
  requiredRoles: [],
};
