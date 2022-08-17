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
<<<<<<< HEAD
            label: "8/13/2022",
            description: "Information for the latest update",
            value: "1_update",
            customId: "up1",
            emoji: "❓",
          },
          {
=======
>>>>>>> 922d53e... Small update: new pet, bug fixes, steal command, xp buff, new item
            label: "Patch",
            description: "Information for the latest patch (UPDATES REGULARLY)",
            value: "2_update",
            customId: "up2",
            emoji: "⚙️",
          },
          {
            label: "8/17/2022",
            description: "Information for recent small update",
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
<<<<<<< HEAD
            ⬆️ Update 8/13/2022\n
            ⚙️ Patch 7/10/2022\n
            👥 Small Update 6/24/2022\n
=======
            ⬆️ Small Update 8/17/2022\n
            ⚙️ Patch 7/10/2022
>>>>>>> 922d53e... Small update: new pet, bug fixes, steal command, xp buff, new item
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
<<<<<<< HEAD
            embed.setDescription(`\u200b`);
            embed.setTitle(`Big Update`);
=======
            embed.setDescription("");
            embed.setTitle(`Small Update`);
>>>>>>> 922d53e... Small update: new pet, bug fixes, steal command, xp buff, new item
            embed
              .setDescription(
                `• New pet: Pretty Porsche\n
                • Tons of bug fixes\n
                • Steal command added with a disguise item\n
                • XP needed decreased to rank * 100\n
                • Drift revamp\n
                • Big bank increase added, find them with your pretty porsche, you can use the big bank increases to go past the bank limit!
                • Bank limit cap fixed, should've been 2 million, but it was 200 million\n

                `
              )
              .setFooter({ text: "8/17/2022" })
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
