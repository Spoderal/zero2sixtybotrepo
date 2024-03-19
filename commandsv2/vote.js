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
    let bot = interaction.client.user;

    userdata.cash += 2000;
    userdata.items.push("vote crate");
    userdata.hasvoted = false;
    await interaction.reply({content: `Please wait...`})

    for(let c in userdata.cars){
      let car = userdata.cars[c]

      car.Gas = car.MaxGas

      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            "cars.$[car]": car,
          },
        },
  
        {
          arrayFilters: [
            {
              "car.Name": car.Name,
            },
          ],
        }
      );
    }

    let embed2 = new Discord.EmbedBuilder()
      .setThumbnail(bot.displayAvatarURL())
      .setDescription(
        `Thank you for voting! Here's a <:votecrate:1125629728175431761> vote crate!\nAll of your cars gas have been refilled! 💙\n\nTip: Support us even more by purchasing gold! Join the support server to learn more or run \`/gold\`\n\nWanna vote for us on another site to grow the bot more? Try voting [here](https://discordbotlist.com/bots/zero2sixty-5237)`
      );
    embed.setColor(colors.blue);

    userdata.save();

    await interaction.editReply({ embeds: [embed2] });
  },
};
