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
            label: "4/18/2023",
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
            label: "4/11/2023",
            description: "Information for the recent small update!",
            value: "5_update",
            customId: "up5",
            emoji: "⬆️",
          },
          {
            label: "4/1/2023",
            description: "Information for the recent big update!",
            value: "6_update",
            customId: "up6",
            emoji: "🎉",
          },
        ])
    );

    let embed = new EmbedBuilder();
    embed.setTitle("Updates Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the recent updates!\n\n
            **__Updates__**
            ⚙️ Latest Patch 4/18/2023\n
            🌸 Spring Update 3/1/2023\n
            ⬆️ Small Update 4/11/2023\n
            🎉 Big Update 4/1/2023\n
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
                `• New event! Check /events\n
                • Fixed a ton of bugs, including livery bugs, racing bugs where the user would lose if their stats were better, and more!\n
                • New items! Orange Juice, Fruit Punch, Oil, Blueberry, Flat tire, Pet treats, and Epic Lockpick!\n
                • New favoriting cars system! Favorite cars to prevent them from being sold with /ids favorite\n
                • New jobs rework, old jobs have been removed!\n
                • /open has been removed, now you can use /use (crate) for the same functionality!\n
                • Cross country now has a chance to drop items\n
                • Selling in bulk for cars\n
                • New cars

                `
              )
              .setFooter({ text: "4/18/2023" })
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
          } else if (value === "6_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Big Update`);
            embed
              .setDescription(
                `• New race system, use /race to find most races in one place! The only one's not there are drift, squadrace, timetrial, and cashcup\n
                • New stats cards are finally here! New designs for cars make showing cars stats a lot better!\n
                • New race: cross country, you can earn barn maps and $350 * the bot tier!
                • Race rewards adjusted\n
                • New cars, check /dealer\n
                • New codes\n
                
                `
              )
              .setFooter({ text: "4/1/2023" })
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
                `• Garage filtering by power!\n
                • Drivetrains! View /parts and select suspension to swap your drivetrain!\n
                • New starting tutorial\n
                • Weekly item shop instead of all items being purchasable\n
                • New items, Apple juice <:item_applejuice:1094894556983611423>  and Grape juice <:item_grapejuice:1094894554097909760>\n
                • Pets overhaul, new pets, get xessence by racing /streetrace with a pet\n
                • Stats for items updated\n
                • New limited stock cars
                `
              )
              .setFooter({ text: "4/11/2023" })
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
