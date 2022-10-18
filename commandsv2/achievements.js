const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const User = require("../schema/profile-schema")
const achievementsdb = require("../data/achievements.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("achievements")
    .setDescription("View your achievements"),

  async execute(interaction) {
    let userdata = await User.findOne({id: interaction.user.id})
    let achievements = await userdata.achievements
    let finalach = []
    if(!achievements || achievements == undefined || achievements.length == 0) return interaction.reply("No achievements!")

    let filteredAchiev = achievements.filter((achiev) => achiev.completed == true)

    for(let ach in filteredAchiev){
        let achievement = filteredAchiev[ach]
        console.log(achievement)

        finalach.push(`${achievementsdb.Achievements[achievement.id.toLowerCase()].Emote} ${achievement.name}`)
    }

    let embed = new EmbedBuilder()
      .setTitle(`Your Achievements`)
      .setDescription(finalach.join('\n'))
      .setColor(colors.blue);

    await interaction.reply({ embeds: [embed], fetchReply: true });
  },
  permissions: "",
  requiredRoles: [],
};
