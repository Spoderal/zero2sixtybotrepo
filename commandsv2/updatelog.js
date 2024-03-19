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
            label: "3/8/2024",
            description: "Information for the latest patch",
            value: "3_update",
            customId: "up3",
            emoji: "⚙️",
          },
        
          {
            label: "3/19/2024",
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
          {
            label: "Roadmap",
            description: "Information for the 2024 roadmap!",
            value: "roadmap",
            customId: "roadmap",
            emoji: "🛣️",
          },
        ])
    );

    let embed = new EmbedBuilder();
    embed.setTitle("Updates Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the recent updates!\n\n
            **__Updates__**
            ⚙️ Latest Patch *3/8/2024*\n
            ⬆️ New Update *3/19/2024*\n
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
            embed.setTitle(`Update 3/19/2024`);
            embed
              .addFields(
                {
                  name: "Features ⭐",
                  value: `
                  - Car shows! Create one with \`/carshow create\` and join one with \`/carshow join\`\n
                  - Garage parts now display similar to cars\n
                  - Class X makes a return! Obtain xessence for a certain car by racing with it, and use \`/prestige car\` to make it X Class! **you need to be prestige 2 to prestige cars to X Class**\n
                  - Prestiging no longe resets your cash\n
                  - Surfaces, and tire overhaul, see /tires for more info\n
                  - Referral system added, refer a friend to get rewards\n
                  - Easter event! /events\n
                  - You can now open multiple crates at once\n
                  - New cars\n
                  `,
                  inline: true,
                }
            
              )
              .setFooter({ text: "3/19/2024" })
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
                * Added buttons to purchase cars in the dealership\n
                * Added double xp/double cash weekend\n
                * Added tutorial for seasons\n
                * Added custom crew icons **/custom-icon**\n
                * Added task details for tutorials depending on what stage you're on if you forget what to do\n
                * Type takeover returns! Part 2... See how the story progresses in \`/event\`!\n
                * Updated livery submissions to require image in command options instead of sending the image after sending the command\n
                * Suggest command added\n
                * Legendary crates added\n
                * Moved filter by favorites to a select menu in the garage\n
                * Moved unobtainable cars to new methods of obtaining\n
                * Moved owner commands to a separate bot\n
                * Increased base daily reward to $5K\n
                `,
                inline: true,
              },
         
              {
                name: "Cars 🚗",
                value: `
                ${cardb.Cars["2021 porsche 911 turbo"].Emote} 2021 Porsche 911 Turbo -> PVP Shop\n
                ${cardb.Cars["2024 ford mustang dark horse"].Emote} 2024 Ford Mustang Dark Horse -> PVP Shop\n
                ${cardb.Cars["2023 bentley bentayga"].Emote} 2023 Bentley Bentayga -> Super Wheelspin\n
                ${cardb.Cars["1992 bugatti eb110"].Emote} 1992 Bugatti EB110 -> Exotic Imports\n
                ${cardb.Cars["2008 acura tl"].Emote} 2008 Acura TL -> $12K in dealership\n
                ${cardb.Cars["2010 noble m600"].Emote} 2010 Noble M600 -> Blueprints\n
                ${cardb.Cars["2012 honda accord"].Emote} 2012 Honda Accord -> Blueprints\n
                ${cardb.Cars["1997 honda civic del sol"].Emote} 1997 Honda Civic Del Sol -> Common Imports\n
                ${cardb.Cars["1987 ford mustang gt"].Emote} 1987 Ford Mustang GT -> Common Garage\n
                ${cardb.Cars["2023 rolls royce ghost"].Emote} 2023 Rolls Royce Ghost -> Super Wheelspin\n
                ${cardb.Cars["1989 toyota corolla"].Emote} 1989 Toyota Corolla -> Common Imports\n
                `,
                inline: true
              },
              {
                name: "Bug Fixes 🐞",
                value: `
                * Fixed undefined appearing in crates\n
                * Fixed tutorial command saying you're already in a tutorial after completing one\n
                * Fixed motorcycle races\n
                `,
                inline: true,
              },
              

              )
              .setFooter({ text: "3/8/2024" })
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
