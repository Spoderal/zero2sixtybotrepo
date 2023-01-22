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
            label: "1/12/2023",
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
            label: "1/22/2023",
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
            ⚙️ Latest Patch 1/13/2023\n
            ❄️ Winter Update 11/30/2022\n
            ⬆️ Small Update 1/22/2023
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
                • Hoonigan limited exotic imports\n
                • Wheelspins added to highway race rewards\n
                • Bunch of new cars\n
                • New house\n
                • Crates revamp

                `
              )
              .setFooter({ text: "1/13/2023" })
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
            embed.setTitle(`Small Update`);
            embed
              .setDescription(
                `• Limited stock cars! Check the dealership and get these cars fast before they're off sale forever!\n
                • New house\n
                • Market listing limits, you may only have 5 items listed at once\n
                • Bug fixes
                • 
                `
              )
              .setFooter({ text: "1/22/2023" })
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
