const {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const cardb = require("../data/cardb.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("updates")
    .setDescription("Check the update log"),
  async execute(interaction) {
    const row2 = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("No update selected")
        .addOptions([
          {
            label: "4/23/2024",
            description: "Information for the latest patch",
            value: "3_update",
            customId: "up3",
            emoji: "⚙️",
          },
        
          {
            label: "4/14/2024",
            description: "Information for the recent update!",
            value: "2_update",
            customId: "up4",
            emoji: "⬆️",
          },
          {
            label: "3/1/2024",
            description: "Information for the recent season update!",
            value: "1_update",
            customId: "up1",
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
            ⚙️ Latest Patch *4/23/2024*\n
            ⬆️ New Update *4/14/2024*\n
            <:season4_icon:1211169992213794827> Season 4 *3/1/2024*\n
            🛣️ Roadmap
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
         
          
  if (value === "2_update") {
    embed.data.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Update 4/14/2024`);
            embed
              .addFields(
                {
                  name: "Features ⭐",
                  value: `
                  - Items drop based on tier rarity, tier 1 60% chance, 2 30%, 3 10%\n
                  - Nerfed lockpick drop rate to 20%\n
                  - Le Mans returns!\n
                  - New Z Pass benefits\n
                  - You can now buy cars with gold\n
                  - New cars\n
                  - Buying the premium pass will automatically give you any past premium rewards you missed\n
                  - TXParts return!\n
                  - Buffed prestige crates\n
                  - Cash bombs no longer give bots cash\n
                  - Gold revamp\n
                  - Switched default track in track race to be the easy track\n
                  - /mystats (beta) shows your stats on the bot such as race time, best cars, and more!
                  `,
                  inline: true,
                },
                {
                  name: "Items",
                  value: `
                  <:item_applepie:1225439417737678848> Apple pie
                  <:item_apple:1227292354386591744> Apple
                  <:item_xessencedetector:1229122030893404261> Xessence Detector
                  `
                }
            
              )
              .setFooter({ text: "4/14/2024" })
              .setThumbnail(`https://i.ibb.co/5WBX33k/icons8-upgrade-144.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "3_update") {
            embed.data.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Latest Patch`);
            embed.addFields(
              {
                name: "Features ⭐",
                value: `
                - New Le Mans cars added to the Le Mans crate\n
                - Space Race returns! /events\n
                - Added upper limit to market items\n
                - Added limit on how many market listings you can have\n
                - Added search function to dealer\n
                - Added new achievements, view them with /achievements\n
                - Added a new squad: Impossible Defenders\n
                - Buffed rewards when beating a squad, or its squad members\n

                `,
                inline: true,
              },
          
              {
                name: "Bug Fixes 🐞",
                value:`
                - Fixed an issue where the cars original image would display while drifting instead of the livery.\n
                - Fixed a bug in racing where it would display the wrong bot car stats\n
                - Fixed a bug where /mystats would only display cars from your garage, instead of your garage including your vault.\n
                - Improved achievement displaying in /profile\n


                `
              }
              )
              .setFooter({ text: "4/23/2024" })
              .setThumbnail("https://i.ibb.co/5WBX33k/icons8-upgrade-144.png")
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } 
          else if (value === "1_update") {
            embed.data.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Latest Patch`);
            embed
            .addFields(
              {
                name: "Features ⭐",
                value: `
                * New Season\n
                * New event: McLaren Event\n
                * New pictures for all McLarens\n
                * New season look, premium season pass, and season visuals\n
                * Offroad racing\n
                * Cocktail usage changed\n
                * Removed robbing and heists as it was hardly used, and doesn't fit the bots theme\n
                * Removed jobs as it was hardly used, and doesn't fit the bots theme\n
                * Removed pets as it was hardly used, and doesn't fit the bots theme\n
                * Moved /parts to /dealer parts\n
                * You can now obtain the original engine when engine swapping\n
                * Brand new longer and more in depth tutorial to help new users\n
                * Drift overhaul, drift crates are permanent\n
                * Collection command to view all the cars you've collected so far\n
                `,
                inline: true,
              },
              

              )
              .setFooter({ text: "3/1/2024" })
              .setThumbnail("https://i.ibb.co/5WBX33k/icons8-upgrade-144.png")
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } 
          else if (value === "roadmap") {
            embed.data.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`2024 Roadmap First Half`);
            embed
            .addFields(
              {
                name: "First Quarter",
                value: `
                * New Season\n
                * New event: McLaren Event\n
                * New pictures for all cars\n
                * New uses for gold\n
                * New race types\n
                * Tire overhaul\n
                * Track surfaces\n
                * Weather overhaul\n
                * New tasks\n
                * Server tournaments
                `,
                inline: true,
              },
              {
                name: "Second Quarter",
                value: `
                * New Season\n
                * Event: World Championship returns\n
                * Event: Type Takeover returns\n
                * Balancing\n
                * New drift squads\n
                * More leaderboards\n
                * More ways to compete with other players\n
                * New engines\n
                * Class changes with upgrades\n
                * Tuning
                `,
                inline: true,
              },

              )
              .setThumbnail("https://i.ibb.co/5WBX33k/icons8-upgrade-144.png")
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
