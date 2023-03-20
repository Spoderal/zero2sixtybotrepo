const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Claim vote rewards for top.gg"),
  async execute(interaction) {
    let uid = interaction.user.id;
    let userdata = (await User.findOne({ id: uid })) || new User({ id: uid });
    let embed = new Discord.EmbedBuilder().setDescription(
      `You haven't voted yet! [Vote](https://top.gg/bot/932455367777067079/vote) then run the command again.`
    );

    embed.setColor(colors.blue);
    let voted = userdata.hasvoted;

    if (voted == false) return await interaction.reply({ embeds: [embed] });

    userdata.cash += 2000;
    userdata.wheelspins += 1;
    userdata.items.push("common crate");
    userdata.hasvoted = false;

    let embed2 = new Discord.EmbedBuilder()
      .setThumbnail("https://i.ibb.co/JjrvkQs/smalllogo.png")
      .setDescription(
        "Thank you for voting! Here's $2k cash, a common crate, and a wheelspin! 💙\n\nTip: Support us even more by purchasing gold! Join the support server to learn more."
      );
    embed.setColor(colors.blue);

    userdata.save();

    await interaction.reply({ embeds: [embed2] });
  },
};
