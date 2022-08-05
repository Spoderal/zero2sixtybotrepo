const {
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("updates")
    .setDescription("Check the update log"),
  async execute(interaction) {
    const row2 = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select")
        .setPlaceholder("No update selected")
        .addOptions([
          {
            label: "6/24/2022",
            description: "Information for the small update",
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

    let embed = new MessageEmbed();
    embed.setTitle("Updates Menu");
    embed.setFooter('Prefix is "/"');
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the recent updates!\n\n
            **__Updates__**
            ⬆️ Big Update 7/17/2022\n
            ⚙️ Patch 7/10/2022\n
            👥 Small Update 6/24/2022\n
        `);

    embed.setColor("#60b0f4");

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
          let emotef = "<:features_update:974452301920104509>";
          if (value === "1_update") {
            embed.fields = [];
            embed.setDescription("");
            embed
              .setTitle(`Small Update`)
              .addField(
                `${emotef} Features`,
                `
                • Wrench has been fixed\n
                • Liveries now accept IDs for installing and removing\n
                • Liveries can be removed easily\n
                • Turbos now have new emojis\n
                • T4 and T5 Turbo **T4Turbo found in super wheel spins only**\n
                • Bet race nerfed heavily - 5 hour cooldown, and 35% cash earnings instead of 50%\n
                • Super wheel spin cash rewards buffed\n
                • Dealership includes a list of import cars\n
                • Ferrari Event\n
                • Daily tasks fixed
                `
              )

              .setFooter("6/24/2022")
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor("#60b0f4");

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "2_update") {
            embed.fields = [];
            embed.setDescription("");

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

              .setFooter("7/10/2022")
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor("#60b0f4");

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "3_update") {
            embed.fields = [];
            embed.setDescription("");

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

              .setFooter("7/17/2022")
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor("#60b0f4");

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          }
        });
      });
  },
};
