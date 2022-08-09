const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const prestiges = require("../data/prestige.json");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("See your ranks"),
  async execute(interaction) {
    let user = interaction.user;

    let userdata = await User.findOne({ id: user.id });
    let prestigerank = userdata.prestige;
    let driftrank = userdata.driftrank;
    let newprestige2 = (prestigerank += 1);

    let racerank = userdata.racerank;
    if (newprestige2 >= 12) {
      newprestige2 = "Max";
    }
    let patron =
      userdata.patron.required || prestiges[newprestige2].DriftRequired;
    let patron2 =
      userdata.patron.required || prestiges[newprestige2].RaceRequired;

    let embed = new Discord.EmbedBuilder()
      .setTitle(`${user.username}'s ranks`)
      .setDescription(
        `
      Race Rank: ${racerank}/${patron}\n
      Drift Rank: ${driftrank}/${patron2}\n
      **Prestige**: ${prestigerank}
      
      `
      )
      .addFields([
        {
          name: "Prestige Ranks",
          value: `
            *Prestige resets your cash balance and RP*\n
            Prestige 1: 0.1x cash earnings\n
            Prestige 2: 0.2x cash earnings\n
            Prestige 3: 0.3x cash earnings\n
            Prestige 4: 0.4x cash earnings\n
            Prestige 5: 0.5x cash earnings\n
            Prestige 6: 0.6x cash earnings\n
            Prestige 7: 0.7x cash earnings\n
            Prestige 8: 0.8x cash earnings\n
            Prestige 9: 0.9x cash earnings\n
            Prestige 10: 1x cash earnings\n
            Prestige 11: 1.1x cash earnings
          `,
        },
      ])

      .setColor(colors.blue);

    interaction.reply({ embeds: [embed] });
  },
};
