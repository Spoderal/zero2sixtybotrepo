const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("updates")
    .setDescription("Check the update log"),
  async execute(interaction) {
    const row2 = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("No update selected")
        .addOptions([
          {
            label: "8/13/2022",
            description: "Information for the latest update",
            value: "1_update",
            customId: "up1",
            emoji: "❓",
          },
          {
            label: "Patch",
            description: "Information for the latest patch (UPDATES REGULARLY)",
            value: "2_update",
            customId: "up2",
            emoji: "⚙️",
          },
          {
            label: "7/17/2022",
            description: "Information for recent big update",
            value: "3_update",
            customId: "up3",
            emoji: "⬆️",
          },
        ])
    );

    let embed = new EmbedBuilder();
    embed.setTitle("Updates Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the recent updates!\n\n
            **__Updates__**
            ⬆️ Update 8/13/2022\n
            ⚙️ Patch 7/10/2022\n
            👥 Small Update 6/24/2022\n
        `);

    embed.setColor(colors.blue);

    interaction
      .reply({ embeds: [embed], components: [row2], fetchReply: true })
      .then((msg) => {
        const filter = (interaction2) =>
          interaction2.isSelectMenu() &&
          interaction2.user.id === interaction.user.id;

        const collector = msg.createMessageComponentCollector({
          filter,
        });

        collector.on("collect", async (collected) => {
          const value = collected.values[0];
          if (value === "1_update") {
            embed.fields = [];
            embed.setDescription(`\u200b`);
            embed
              .setTitle(`Small Update`)
              .addFields([
                {
                  name: `${emotes.featuresUpdate} Features`,
                  value: `
                    • New and faster response times
                    • A lot of bug fixes
                    • Ranks fixed
                    • Drift revamped
                    • Unbox command fixed
                    • Work removed for the time being while we reWORK it
                    • 5 Gold can now clear all race cooldowns
                    • Losing bot races gives you some cash
                  `,
                },
                {
                  name: `${emotes.ckey} New Cars`,
                  value: `
                  ${emotes.ferrari} 2023 Ferrari Daytona SP3
                  `,
                },
              ])
              .setFooter({ text: "8/13/2022" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "2_update") {
            embed.fields = [];
            embed.setDescription(`\u200b`);

            embed.setTitle(`Small Patch`);
            embed
              .setDescription(
                `• Support server cash multiplier for botraces and daily cash\n
                • Vault items, store some cash before you prestige\n
                • Trims, view /stats dealership [car] to view trims for cars that have them\n
                • Multiple bug fixes\n
                • New cars 7/10/2022
                `
              )
              .setFooter({ text: "7/10/2022" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "3_update") {
            embed.fields = [];
            embed.setDescription(`\u200b`);
            embed.setTitle(`Big Update`);
            embed
              .setDescription(
                `• Garage update, filtering added, and the garage now uses buttons.\n
                • Pets! Get a pet egg from the item shop and take care of it.\n
                • Tier X parts, get Xessence from having a pet, and use that with a T5 part to make a Tier X part.\n
                • 4th item added to the daily item shop\n
                • Numerous bug fixes\n
                • New cars\n
                `
              )
              .setFooter({ text: "7/17/2022" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          }
        });
      });
  },
};
