const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Claim vote rewards for top.gg"),
  async execute(interaction) {
    let uid = interaction.user.id;
    let userdata = (await User.findOne({ id: uid })) || new User({ id: uid });
    let embed = new Discord.MessageEmbed().setDescription(
      `You haven't voted yet! [Vote](https://top.gg/bot/932455367777067079/vote) then run the command again.`
    );

    embed.setColor("#60b0f4");
    let voted = userdata.hasvoted;

    if (voted == false) return interaction.reply({ embeds: [embed] });

    userdata.cash += 1000;
    userdata.wheelspins += 1;
    userdata.hasvoted = false;

    let embed2 = new Discord.MessageEmbed()
      .setThumbnail("https://i.ibb.co/JjrvkQs/smalllogo.png")
      .setDescription(
        "Thank you for voting! Here's $1k cash, and a wheelspin! 💙"
      );
    embed.setColor("#60b0f4");

    userdata.save();

    interaction.reply({ embeds: [embed2] });
  },
};
