const Discord = require("discord.js");
const ms = require("ms");

const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { toCurrency, formatDate } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearcooldowns")
    .setDescription("Clear your cooldowns"),
  async execute(interaction) {
    let uid = interaction.user.id
    let userdata = (await User.findOne({ id: uid })) || new User({ id: uid });
    let cooldowndata = (await User.findOne({ id: uid })) || new User({ id: uid });

    let goldcooldown = cooldowndata.goldclear;
    let usergold = userdata.gold
    if(5 > usergold) return interaction.reply("You need 5 gold to clear cooldowns!")
    let timeout = 60000;
    if (
      goldcooldown !== null &&
      timeout - (Date.now() - goldcooldown) > 0
    ) {
      let time = ms(timeout - (Date.now() - goldcooldown));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`You can use gold to clear cooldowns again in ${time}.`);
      return await interaction.reply({ embeds: [timeEmbed] });
    }
    await Cooldowns.findOneAndUpdate(
      {
        id: interaction.user.id,
      },
      {
        $set: {
          racing: 0,
          hm: 0,
          qm: 0,
          drifting: 0,
          waterbottle: Date.now(),
        },
      }
    );

    cooldowndata.markModified();

    cooldowndata.save();
    userdata.gold -= 5
    interaction.reply("Used 5 gold to clear race cooldowns")
    userdata.save();
    return;
  },
};
