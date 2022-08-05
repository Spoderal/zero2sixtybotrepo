const db = require("quick.db");
const Discord = require("discord.js");
const barns = require("../junkparts.json");
const lodash = require("lodash");
const partsdb = require("../partsdb.json");
const ms = require(`pretty-ms`);
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

            if (ct >= client.guilds.size) {
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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function convert(val) {
  // thousands, millions, billions etc..
  var s = ["", "k", "m", "b", "t"];

  // dividing the value by 3.
  var sNum = Math.floor(("" + val).length / 3);

  // calculating the precised value.
  var sVal = parseFloat(
    (sNum != 0 ? val / Math.pow(1000, sNum) : val).toPrecision(2)
  );

  if (sVal % 1 != 0) {
    sVal = sVal.toFixed(1);
  }

  // appending the letter to precised val.
  return sVal + s[sNum];
}
