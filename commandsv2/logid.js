const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logid")
    .setDescription("Test command"),
  async execute(interaction) {
    if (
      interaction.user.id !== "937967206652837928" &&
      interaction.user.id !== "890390158241853470" &&
      interaction.user.id !== "670895157016657920"
    ) {
      interaction.reply({
        content: "You dont have permission to use this command!",
        ephemeral: true,
      });
      return;
    } else {
      let invites = ["ignore me"],
        ct = 0;
      interaction.client.guilds.cache.forEach((g) => {
        g.invites
          .fetch()
          .then((guildInvites) => {
            invites[invites.length + 1] =
              g + " - `Invites: " + guildInvites.array().join(", ") + "`";
            ct++;

            if (ct >= g.guilds.size) {
              invites.forEach((invite, i) => {
                if (invite == undefined) invites.splice(i, 1);
              });

              invites.shift();
              invites.forEach((invite, i) => (invites[i] = "- " + invite));
              invites = invites.join("\n\n");

              let embed = new Discord.RichEmbed()
                .setTitle("All Invites:")
                .setDescription(invites);

              interaction.channel.send({ embeds: [embed] });
            }
          })
          .catch((err) => {
            console.log(err);
            ct++;
          });
      });
    }
  },
};
