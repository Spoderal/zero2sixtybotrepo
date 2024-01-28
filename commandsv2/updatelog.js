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
            label: "1/15/2023",
            description: "Information for the latest patch",
            value: "3_update",
            customId: "up3",
            emoji: "⚙️",
          },
        
          {
            label: "1/28/2024",
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
            ⚙️ Latest Patch 1/15/2023\n
            ⬆️ New Update 1/28/2024
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
            embed.setTitle(`Update 1/28/2024`);
            embed
              .addFields(
                {
                  name: "Features ⭐",
                  value: `• Bug fixes\n
                  • New revamped Z Pass on the [patreon](https://www.patreon.com/zero2sixtybot) \`/zpass\`\n
                  • You can now list currencies like barn maps and wheelspins on the market\n
                  • Gold can be exchanged for T5 parts with T5 Vouchers\n
                  • Gold can be exchanged for series tickets\n
                  • New series: Italian Heritage\n
                  • New command /itemlist displays all items in the game\n
                  • Races are now harder depending on your prestige\n
                  • New prestige leaderstats design\n
                  • New parts, gas tanks! Obtain them from wheelspins and blueprints!\n
                  • New crew season <:crew_season4:1200642745002373201>\n
                  • F1 has returned with a PERMANENT new blueprint to obtain F1 cars!\n
                  • New event: City carvers!\n`,
                  inline: true,
                },
                {
                  name: "Items 🪛",
                  value: `<:item_headphones:1198182631968346112> Headphones - With this in your inventory the radio item will give 4x earnings instead of 2x\n
                  <:item_record:1198183499019067412> Record - With this item in your inventory you boost your race rank earnings to 2x PERMANENTLY *STACKS WITH OTHER ITEMS*\n
                  <:item_comet:1200941172114341969> Comet - Found while doing the astroaut job\n
                  <:item_moon:1200941169752948826> Moon - Found while doing the astronaut job\n
                  <:item_cheese:1200941173712375889> Cheese - With this in your inventory, you can prestige TWICE while only needing the ranks for 1 prestige`,
                  inline: true,
                }
              )
              .setFooter({ text: "1/28/2024" })
              .setThumbnail(`https://i.ibb.co/xH4L53M/Icon-01.jpg`)
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
                  value: `Vault for your extra cars! Try \`/vault\`\n
                  User market returns! Market your items for other users to purchase\n
                  Improved parts list so it shows what parts are missing\n
                  Improved information for restoring barn finds\n
                  Junkyard returns!\n
                  Improved tutorial\n
                  New event: Swan Song, see \`/events\`\n
                  Fixed EV engine swapping\n
                  Garage usability improved by removing the parking lot image\n
                  New item: reverse card
                  `,
                  inline: true,
                },
                {
                  name: "Cars 🚗",
                  value: `
                ${cardb.Cars["2020 porsche 718 cayman gt4"].Emote} ${cardb.Cars["2020 porsche 718 cayman gt4"].Name} -> Added to Super wheelspin\n
                ${cardb.Cars["2022 porsche 911 gt3"].Emote} ${cardb.Cars["2022 porsche 911 gt3"].Name} -> Added to Super wheelspin\n
                ${cardb.Cars["2019 subaru brz"].Emote} ${cardb.Cars["2019 subaru brz"].Name} -> Added to Wheelspin\n
                ${cardb.Cars["1994 mitsubishi 3000gt vr4"].Emote} ${cardb.Cars["1994 mitsubishi 3000gt vr4"].Name} -> Added to Wheelspin\n
                ${cardb.Cars["2010 chevy camaro v6"].Emote} ${cardb.Cars["2010 chevy camaro v6"].Name} -> Added to Wheelspin\n


                `,
                  inline: true,
                }
              )
              .setFooter({ text: "1/15/2023" })
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
