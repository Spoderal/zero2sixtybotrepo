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
            label: "11/10/2022",
            description: "Information for recent small update",
            value: "3_update",
            customId: "up3",
            emoji: "⬆️",
          },
          {
            label: "11/30/2022",
            description: "Information for the recent winter season update!",
            value: "4_update",
            customId: "up4",
            emoji: "❄️",
          },
        ])
    );

    let embed = new EmbedBuilder();
    embed.setTitle("Updates Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the recent updates!\n\n
            **__Updates__**
            🏪 Big Update 11/10/2022\n
            ❄️ Winter Update 11/30/2022
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

            embed.setTitle(`Big Update`);
            embed
              .setDescription(
                `• Highway race for lockpicks!\n
                • Find old garages filled with loot like restored barn cars, cash, and parts with lockpicks! [BETA]\n
                • The user market is back! Its economy will be controlled by the users, you can list currencies, cars, parts, and items!\n
                • Added TXClutch\n
                • Added T4 and T5WeightReduction\n
                • Uncommon barn maps removed, joined with rare barn maps
                `
              )
              .setFooter({ text: "11/10/2022" })
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
          }
        });
      });
  },
};
