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
            label: "1/5/2024",
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
            ⬆️ New Update 1/5/2024
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
                  • Gambling commands, /dice, /blackjack, /coinflip\n
                  • New profile card\n
                  • Achievements fixed\n
                  • New house, Casa Haus\n
                  • House perks fixed\n
                  • New custom racers with helmets, accessories, and outfits!\n
                  • New event, fictional powerhouse\n
                  • Added list to remove command\n
                  • Added featured part to parts store\n
                  • Added price to featured cars in the dealership\n
                  • Better and more realistic engine swapping, your engines were given back to you if you had one as an upgrade\n
                  • Vote crate buffed\n
                  • For 2024, everyone has received a 2024 crown to customize their racer with!\n
                  • New brand logos for low quality brand logos`,
                  inline: true,
                },
                {
                  name: "Nerfs 📉",
                  value: `<:ssc:979620786757337098>2020 SSC Tuatara -> Increased price, more weight, nerfed acceleration, nerfed handling\n
                  <:lotus:931011548317642814> 2020 Lotus Evija -> Decreased handling\n
                  <:ferrari:931011838374727730> 2010 Ferrari 599XX -> Moved to Legendary Garage\n
                  2001 Lexus IS300 -> Moved to Common Garage\n
                  1998 Pontiac Fiero -> Moved to Common Garage\n
                  <:toyota:931012829283233883> 1986 Toyota AE86 -> Moved to Common Garage\n
                  <:lexus:932776357124001823> 1989 Nissan Silvia S13 -> Moved to Common Garage\n
                  <:mercedes_z:973000364410404924> 2001 Mercedes SL600 -> Moved to Common Garage\n
                  <:bugatti:931012624110460979> 2008 Bugatti Veyron -> Price increased`,
                  inline: true,
                },
                {
                  name: "Buffs 📈",
                  value: `<:maserati:961332832767184987> 2022 Maserati MC20 -> Increased handling, new image\n
                  <:bmw:931011550054056007> 2016 BMW i8 -> Better acceleration\n
                  <:brand_ford:1192958185863118889> 2010 Ford Mustang -> Better handling\n
                  <:brand_ford:1192958185863118889> 2024 Ford Mustang -> Better acceleration, better handling, less weight\n
                  <:hyundai:931015215447941200> 2012 Hyundai Veloster -> Better handling, decreased price\n
                  <:aston:931011548682534962> 2016 Aston Martin Vulkan -> Decreased price`,
                  inline: true,
                }
              )
              .setFooter({ text: "1/5/2024" })
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
