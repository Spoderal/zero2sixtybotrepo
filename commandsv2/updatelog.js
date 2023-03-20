const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");

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
            label: "3/20/2023",
            description: "Information for the latest patch",
            value: "3_update",
            customId: "up3",
            emoji: "⚙️",
          },
          {
            label: "3/1/2023",
            description: "Information for the recent spring season update!",
            value: "4_update",
            customId: "up4",
            emoji: "🌸",
          },
          {
            label: "3/15/2023",
            description: "Information for the recent small update!",
            value: "5_update",
            customId: "up5",
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
            ⚙️ Latest Patch 3/20/2023\n
            🌸 Spring Update 3/1/2023\n
            ⬆️ Small Update 3/15/2023
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

            embed.setTitle(`Latest Patch`);
            embed
              .setDescription(
                `• New trade system, removing all previous bugs\n
                 • Fixed bug where it showed you the wrong required rank to prestige\n
                 • Fixed bug where a house perk that gave 2x notoriety, didn't give 2x notoriety\n
                 • Gold is now easier to purchase, giving you a link to purchase on balance commands, and dealership commands\n
                 • Dealership has a featured car whenever you open it\n
                 • Voting now gives a common crate, 1 wheelspin, and $2K\n
                 • All cars can be purchased with gold

                `
              )
              .setFooter({ text: "3/15/2023" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "4_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Spring Update`);
            embed
              .setDescription(
                `• New season! The snow melts, and everyone starts drifting! Featuring a brand new season with never seen before rewards! Check /season for more information and use /drift to earn notoriety!\n
                 • Drift mechanics revamp, no more drift stat, handling and weight matter the most in drifting! The more weight and the more handling, the better chance you have\n
                 • Master drift difficulty with a badge for winning 20 times on it!\n
                 • New parts, featuring drift spoilers, a new TXTurbo, and T5DriftTires!\n
                 • New seasonal crate featuring new helmets, and drift spoilers\n
                 • The drift crate returns with more drift cars than ever!\n
                 • Referrals, make a code and give it to your friends who sign up so you both get $10K!\n
                 • Profile backgrounds, make your profile look snazzy\n
                 • /stats fixed, now shows the correct information for parts\n
                 • View the new cars with /dealer\n
                 • View cars in crates with the new list option in /unbox!\n
                 • Remove all parts with /remove!
                `
              )
              .setFooter({ text: "3/1/2023" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "5_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Small Update`);
            embed
              .setDescription(
                `• Tasks are back! View them with /tasks list\n
                • F1 Event! F1 Cars are here! Check it out with /events\n
                • World Championship event is back!\n
                • Prestige requirements nerfed, you need less drift than race wins\n
                • Bug fixes
                `
              )
              .setFooter({ text: "3/15/2023" })
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
