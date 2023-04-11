const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("See your ranks"),
  async execute(interaction) {
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let prestigerank = userdata.prestige;
    let driftrank = userdata.driftrank;
    let newprestige2 = prestigerank + 1;

    let racerank = userdata.racerank;

    let required1 = newprestige2 * 30;
    let required2 = newprestige2 * 20;

    let embed = new Discord.EmbedBuilder()
      .setTitle(`${user.username}'s ranks`)
      .setDescription(
        `
        **Prestige**: ${prestigerank}\n
        Race Rank: ${racerank}/${required1}\n
        Drift Rank: ${driftrank}/${required2}\n
        `
      )

      .setColor(colors.blue);

    await interaction.reply({ embeds: [embed] });
  },
};
