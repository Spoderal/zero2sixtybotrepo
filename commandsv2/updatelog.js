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
            label: "Patch",
            description: "Information for the latest patch (UPDATES REGULARLY)",
            value: "2_update",
            customId: "up2",
            emoji: "⚙️",
          },
          {
            label: "9/26/2022",
            description: "Information for recent small update",
            value: "3_update",
            customId: "up3",
            emoji: "⬆️",
          },
          {
            label: "10/18/2022",
            description: "Information for the recent update!",
            value: "4_update",
            customId: "up4",
            emoji: "🏆",
          },
          {
            label: "10/2/2022",
            description:
              "Information for the recent large update, and new season!",
            value: "5_update",
            customId: "up5",
            emoji: "🍬",
          },
        ])
    );

    let embed = new EmbedBuilder();
    embed.setTitle("Updates Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the recent updates!\n\n
            **__Updates__**
            ⬆️ Small Update 9/26/2022\n
            ⚙️ Patch 8/22/2022\n
            🍬 Halloween Big Update 10/2/2022\n
            🏆 QA Update 10/18/2022
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
          if (value === "3_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed
              .setTitle(`Small Update`)
              .addFields([
                {
                  name: `${emotes.featuresUpdate} Features`,
                  value: `
                    • Toolbox item added\n
                    • Cashcup bug fixed\n
                    • Item information in /stats command shows what an item does.\n
                    • Item shop expanded and fixed\n
                    • New cars\n
                  `,
                },
              ])
              .setFooter({ text: "9/26/2022" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "5_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed
              .setTitle(`Huge Update`)
              .addFields([
                {
                  name: `${emotes.featuresUpdate} Features`,
                  value: `
                    • Halloween event! View in \`/events\`\n
                    • **Squads overhaul, you need to beat a squad before advancing to the next car class, more information in the community server**\n
                    • Ranks increase every race/drift now\n
                    • Nothing reward removed from super wheel spin\n
                    • New cars\n
                    • New parts\n
                    • Item shop is no longer daily, it shows all items.\n
                    • Super wheel spin removed from item shop.\n
                    • Super wheel spin can be earned from regular wheel spins

                    [Please give feedback here!](https://forms.gle/gebEz2h1jGJzUYsC9)
                  `,
                },
              ])
              .setFooter({ text: "10/2/2022" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "2_update") {
            embed.fields = [];
            embed.setDescription("\u200b");

            embed.setTitle(`Small Patch`);
            embed
              .setDescription(
                `• Rare barn maps can be found at the half mile tier 5\n
                 • Legendary barn maps can be found by pretty porsche pets\n
                 • New legendary barn find: 2002 Koenigsegg CC8S\n
                 • New TX Part: TXIntake\n
                 • New part: Brakes

                `
              )
              .setFooter({ text: "8/22/2022" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "4_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`QA Update`);
            embed
              .setDescription(
                `• Improved the dealership design, easier to read and includes more details.\n
                 • New /settings command! Turn on tips that help you better understand the game (for new players), accessibility, set daily reminders for voting, and claiming your daily reward! More settings coming soon.\n
                 • Achievements! Say goodbye to badges, and hello to achievements you can show off and get rewarded from completing! Check /help for more information.
                 • Bug fixes\n
                 __New Cars__
                 <:ford:931012624152399902> 2024 Ford Mustang\n
                 <:ferrari:931011838374727730> 2017 Ferrari 812 Superfast
                `
              )
              .setFooter({ text: "10/18/2022" })
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
