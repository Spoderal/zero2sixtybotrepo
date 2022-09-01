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
            label: "8/17/2022",
            description: "Information for recent small update",
            value: "3_update",
            customId: "up3",
            emoji: "⬆️",
          },
          {
            label: "8/30/2022",
            description:
              "Information for the recent large update, and new season!",
            value: "4_update",
            customId: "up4",
            emoji: "🍂",
          },
        ])
    );

    let embed = new EmbedBuilder();
    embed.setTitle("Updates Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the recent updates!\n\n
            **__Updates__**
            ⬆️ Small Update 8/17/2022\n
            ⚙️ Patch 8/22/2022\n
            🍂 Fall Update 8/30/2022
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
            embed.setDescription("\u200b");
            embed
              .setTitle(`Small Update`)
              .addFields([
                {
                  name: `${emotes.featuresUpdate} Features`,
                  value: `
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
                  `,
                },
              ])
              .setFooter({ text: "6/24/2022" })
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
          } else if (value === "3_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Small Update`);
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
          } else if (value === "4_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Fall Update`);
            embed
              .setDescription(
                `__New parts__
                • Track Springs\n
                • Drift Springs\n
                • Race Springs\n
                • T1, T2, T3, T4, T5 Track tires\n
                • T3, T4, T5 BodyKits\n

                __Nerfs and buffs__
                V8 added to wheelspin, it adds 15 speed to your car.\n
                T1Exhaust price decreased, added speed and acceleration increased\n
                T2Exhaust price decreased, added speed and acceleration increased\n

                __Features__
                •  New season! Check /season for more information. **NOTORIETY AND RP HAS BEEN RESET FOR THE NEW SEASONS**\n
                • New race! /trackrace\n
                • Tutorial for new players\n
                • Season, and crew pages make it easier to claim rewards, having a purely button based system.\n
                • /reward removed\n
                • You can buy cars via name **or** ID now

                __Bug Fixes__
                • Fixed the issue where /upgrade removes all parts instead of 1
                
                `
              )
              .setFooter({ text: "8/30/2022" })
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
