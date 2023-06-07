const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const ms = require("pretty-ms");
const emotes = require("../common/emotes").emotes;

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
    let bountycooldown = prestigerank * 1000;
    let bonus = prestigerank * 0.05;

    let racerank = userdata.racerank;

    let required1 = newprestige2 * 30;
    let required2 = newprestige2 * 20;

    let embed = new Discord.EmbedBuilder()
      .setTitle(`${user.username}'s ranks`)
      .setDescription(
        `
        ${emotes.prestige} **Prestige**: ${prestigerank}\n
        ${emotes.race} Race Rank: ${racerank}/${required1}\n
        ${emotes.drift} Drift Rank: ${driftrank}/${required2}\n
        Bounty cooldown: ${ms(bountycooldown)}\n
        Bonus Cash: ${bonus}%
        `
      )

      .setColor(colors.blue);

    await interaction.reply({ embeds: [embed] });
  },
};
