const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const achievementdb = require("../data/achievements.json");
const lodash = require("lodash");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("achievements")
    .setDescription("View the list of achievements and how to obtain them"),
  async execute(interaction) {
    let acharr = [];

    for (let i in achievementdb.Achievements) {
      acharr.push({
        Name: achievementdb.Achievements[i].Name,
        Task: achievementdb.Achievements[i].Task,
        Emote: achievementdb.Achievements[i].Emote,
      });
    }

    let achievementsmap = lodash.chunk(
      acharr.map((a) => a),
      6
    );
    let page = 0;

    let embed = new EmbedBuilder()
      .setTitle(`🏆 Achievements`)
      .setColor(colors.blue);

    console.log(achievementsmap[0]);
    for (let i in achievementsmap[0]) {
      let achievement = achievementsmap[0][i];
      embed.addFields({
        name: `${achievement.Emote} ${achievement.Name}`,
        value: `${achievement.Task}`,
      });
    }

    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setEmoji("⬅️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("➡️")
        .setStyle("Secondary")
    );
    let msg = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector2 = msg.createMessageComponentCollector({
      filter: filter2,
    });

    collector2.on("collect", async (i) => {
      if (i.customId === "previous") {
        if (page === 0) {
          page = achievementsmap.length - 1;
        } else {
          page--;
        }
      } else if (i.customId === "next") {
        if (page === achievementsmap.length - 1) {
          page = 0;
        } else {
          page++;
        }
      }

      let embed = new EmbedBuilder()
        .setTitle(`🏆 Achievements`)
        .setColor(colors.blue);

      for (let i in achievementsmap[page]) {
        embed.addFields({
          name: `${achievementsmap[page][i].Emote} ${achievementsmap[page][i].Name}`,
          value: `${achievementsmap[page][i].Task}`,
        });
      }

      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setEmoji("⬅️")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("next")
          .setEmoji("➡️")
          .setStyle("Secondary")
      );
      await interaction.editReply({ embeds: [embed], components: [row] });
    });
  },
};
