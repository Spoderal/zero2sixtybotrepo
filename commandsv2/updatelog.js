const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const cardb = require("../data/cardb.json");
const itemdb = require("../data/items.json");

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
            label: "12/25/2023",
            description: "Information for the latest patch",
            value: "3_update",
            customId: "up3",
            emoji: "⚙️",
          },
        
          {
            label: "12/15/2023",
            description: "Information for the recent update!",
            value: "2_update",
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
            ⚙️ Latest Patch 12/25/2023\n
            ⬆️ New Update 12/15/2023
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
            embed.setTitle(`Big Update`);
            embed
              .addFields(
                {
                  name: "Features ⭐",
                  value: `• Bug fixes\n
                  • Car stat cards have a new design showcasing the cars OVR\n
                  • Christmas event!\n
                  • New season\n
                  • **New drive feature**, use /location help to learn more!\n
                  • 30 new cars\n
                  • New dealership design\n
                  • Old upgrade system is back!\n
                  • Race to earn junk parts instead of junk yards\n
                  • Race earnings buffed\n
                  • Cross country gives wheelspins\n
                  • /races command updated to be more accurate\n
                  • 30+ new cars /dealer\n
                  • Weekly Item shop is back!\n
                  • Tons of bug fixes and performance improvements`,
                  inline: true,
                },
                {
                  name: `Items 🪛`,
                  value: `
                ${itemdb["snowball"].Emote} ${itemdb["snowball"].Name}\n
                ${itemdb["airplane"].Emote} ${itemdb["airplane"].Name}
                `,
                  inline: true,
                }
              )
              .setFooter({ text: "12/15/2023" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "3_update") {
            embed.data.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Latest Patch`);
            embed
              .addFields(
                {
                  name: "Features ⭐",
                  value: `Crime! Try \`/crime\`\n
                  New location: UK\n
                  New track race revamp\n
                  2 New events, try \`/events\`\n
                  New squad\n
                  Crew top doesn't show rank 1 crews to clear space
                  
                  `,
                  inline: true,
                },
                {
                  name: "Cars 🚗",
                  value: `
                ${cardb.Cars["2023 rolls royce ghost"].Emote} ${cardb.Cars["2023 rolls royce ghost"].Name}

                ${cardb.Cars["2023 audi rs6 performance"].Emote} ${cardb.Cars["2023 audi rs6 performance"].Name}

                ${cardb.Cars["2021 mini jcw"].Emote} ${cardb.Cars["2021 mini jcw"].Name}

                ${cardb.Cars["2024 mclaren artura"].Emote} ${cardb.Cars["2024 mclaren artura"].Name}

                ${cardb.Cars["2017 rolls royce wraith"].Emote} ${cardb.Cars["2017 rolls royce wraith"].Name}

                ${cardb.Cars["2012 jaguar xkrs"].Emote} ${cardb.Cars["2012 jaguar xkrs"].Name}

                ${cardb.Cars["1989 toyota corolla"].Emote} ${cardb.Cars["1989 toyota corolla"].Name}
                `,
                  inline: true,
                },
               
              )
              .setFooter({ text: "12/25/2023" })
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
