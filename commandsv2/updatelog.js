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
            label: "1/12/2022",
            description: "Information for the latest patch",
            value: "3_update",
            customId: "up3",
            emoji: "⚙️",
          },
          {
            label: "11/30/2022",
            description: "Information for the recent winter season update!",
            value: "4_update",
            customId: "up4",
            emoji: "❄️",
          },
          {
            label: "1/6/2022",
            description: "Information for the recent overhaul!",
            value: "5_update",
            customId: "up5",
            emoji: "🔃",
          },
        ])
    );

    let embed = new EmbedBuilder();
    embed.setTitle("Updates Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the recent updates!\n\n
            **__Updates__**
            ⚙️ Latest Patch 12/15/2022\n
            ❄️ Winter Update 11/30/2022\n
            🔃 Overhaul Update 1/6/2022
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
                `• Season reward 21 bug fixed\n
                • Unboxing glitch where it didn't give you the cash if you had the car fixed.\n
                • Items not displaying in garage fixed\n
                • McLaren keys fixed\n
                • Market listing bugs fixed\n
                • Hoonigan event\n
                • Wheelspins added to highway race rewards\n
                • Bunch of new cars\n
                • New house\n
                • Crates revamp

                `
              )
              .setFooter({ text: "1/12/2022" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "4_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Winter Update`);
            embed
              .setDescription(
                `• New season! The leaves fade away, here comes the snow! Get out your best off road vehicles and go at it! Make sure to view the season information in /events\n
                • Another new season! Its an event! Go to the moon and race your car in low gravity environments, view /events for more!\n
                • Dealership now has a new cars section\n
                • The first garage exclusive car is here! Check the new cars in the dealership.\n
                • New winter tires, can be found in wheelspins, and garages\n
                • Gold can now be used to purchase notoriety and clear cooldowns\n
                • Bug fixes
                `
              )
              .setFooter({ text: "11/30/2022" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "5_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Overhaul Update`);
            embed
              .setDescription(
                `• Racing as a whole has a huge overhaul with new visuals, how it works, etc. **Join the support server if you'd like an in depth guide to how it works**\n
                •  PVP Revamp is finally here! With competitive ranking, dedicated rewards per win, earning gold, and more, there's no way you'll get bored with it!\n
                • Barn maps can no longer be obtained via racing, but now wheelspins drop all rarities!\n
                • Bet racing removed to comply with Discords gambling regulations.\n
                • Car packs are now live, buy exclusive cars with gold!\n
                • qm and hm have been joined into one command **/dragrace**\n
                • New houses!\n
                • Weight stat now has effect everywhere.
                `
              )
              .setFooter({ text: "1/6/2022" })
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
