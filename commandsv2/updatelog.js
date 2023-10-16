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
            label: "9/24/2023",
            description: "Information for the latest patch",
            value: "3_update",
            customId: "up3",
            emoji: "⚙️",
          },
          {
            label: "8/31/2023",
            description: "Information for the recent fall season update!",
            value: "4_update",
            customId: "up4",
            emoji: "🍂",
          },
          {
            label: "10/16/2023",
            description: "Information for the recent halloween update!",
            value: "5_update",
            customId: "up5",
            emoji: "🎃",
          },
          {
            label: "7/26/2023",
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
            ⚙️ Latest Patch 9/24/2023\n
            🍂 Fall Update 8/31/2023\n
            🎃 Halloween Update 10/16/2023\n
            ⬆️ New Update 7/26/2023
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
          if (value === "5_update") {
            embed.fields = [];
            embed.setDescription("\u200b");

            embed.setTitle(`Halloween Update`);
            embed
              .setDescription(
                `• Halloween Event\n
                 • New icons for car stats\n
                 • Win records on profiles\n
                 • New profile design\n
                 • Fixed crates\n
                 • New cars in /dealer
                 
                `
              )
              .setFooter({ text: "10/15/2023" })
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
              .addFields(
                {
                  name: "Features ⭐",
                  value: `New season, shorter seasons, more unique themes, better rewards, and paths!\n
                Tier 6 upgrades! Find tier 6 parts, and upgrade the car like you normally would to use the part\n
                New Crew season\n
                Kick people from crews\n
                Crew VIP Cards, put crew points into a card you'd like to activate, and once you activate it, get the perks!
                Restoration guide in help\n
                Trading is now limited to people who have beaten the 3rd squad instead\n
                New job: doctor\n
                New business upgrades\n
                New helmet designs\n
                Stats cards are easier to read\n
                Drivetrains for all cars\n
                New tasks\n
                PVP gives more rp than regular races\n
                /rank will show your RP bonus\n
                Bug fixes`,
                  inline: true,
                },
                {
                  name: "Cars 🚗",
                  value: `
                ${cardb.Cars["2019 subaru brz rocket bunny"].Emote} ${cardb.Cars["2019 subaru brz rocket bunny"].Name}\n
                ${cardb.Cars["2023 bmw m2 g87"].Emote} ${cardb.Cars["2023 bmw m2 g87"].Name}\n
                ${cardb.Cars["2023 cadillac ct5"].Emote} ${cardb.Cars["2023 cadillac ct5"].Name}\n
                ${cardb.Cars["2019 brabham bt62"].Emote} ${cardb.Cars["2019 brabham bt62"].Name}\n
                ${cardb.Cars["2022 porsche 911 gt3 touring"].Emote} ${cardb.Cars["2022 porsche 911 gt3 touring"].Name}\n
                ${cardb.Cars["2023 chevy corvette c8 z06"].Emote} ${cardb.Cars["2023 chevy corvette c8 z06"].Name}\n
                ${cardb.Cars["2021 aston martin dbs superleggera"].Emote} ${cardb.Cars["2021 aston martin dbs superleggera"].Name}
                `,
                  inline: true,
                },
                {
                  name: `Items 🪛`,
                  value: `
                ${itemdb["cookie"].Emote} ${itemdb["cookie"].Name}\n
                ${itemdb["fake id"].Emote} ${itemdb["fake id"].Name}\n
                ${itemdb["pills"].Emote} ${itemdb["pills"].Name}\n
                ${itemdb["compass"].Emote} ${itemdb["compass"].Name}
                `,
                  inline: true,
                }
              )
              .setFooter({ text: "8/31/2023" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "2_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Big Update`);
            embed
              .addFields(
                {
                  name: "Features ⭐",
                  value: `• Bug fixes\n
                  • Car rating, boosts your race rank earnings from races\n
                  • Track legends returns with new cars!\n
                  • New jobs\n
                  • Body kits\n
                  • Fiero replaces the firebird in starter cars\n
                  • Businesses have perks, gas station will get a discount on gas, car wash gets half off when washing your car, and mechanic gets 2 parts in the junkyard!\n
                  • Level 4 business upgrades\n
                  • Button to abandon your business\n
                  • Motorcycles! And a motorcycle exclusive race\n
                  • Engine and drivetrain information added for a few cars\n
                  • Delist items from market`,
                  inline: true,
                },
                {
                  name: "Cars 🚗",
                  value: `
                ${cardb.Cars["2021 volvo s90"].Emote} ${cardb.Cars["2021 volvo s90"].Name}\n
                ${cardb.Cars["2022 genisis g70"].Emote} ${cardb.Cars["2022 genisis g70"].Name}\n
                ${cardb.Cars["2016 dodge dart"].Emote} ${cardb.Cars["2016 dodge dart"].Name}\n
                ${cardb.Cars["2014 chevy camaro z28"].Emote} ${cardb.Cars["2014 chevy camaro z28"].Name}\n
                ${cardb.Cars["2023 mclaren solus gt"].Emote} ${cardb.Cars["2023 mclaren solus gt"].Name}\n
                ${cardb.Cars["2016 apollo arrow"].Emote} ${cardb.Cars["2016 apollo arrow"].Name}\n
                ${cardb.Cars["1997 tvr cerbera speed 12"].Emote} ${cardb.Cars["1997 tvr cerbera speed 12"].Name}\n
                ${cardb.Cars["2021 honda cbr600rr"].Emote} ${cardb.Cars["2021 honda cbr600rr"].Name}\n
                ${cardb.Cars["2020 kawasaki z900"].Emote} ${cardb.Cars["2020 kawasaki z900"].Name}\n
                ${cardb.Cars["2017 kawasaki ninja 650"].Emote} ${cardb.Cars["2017 kawasaki ninja 650"].Name}\n
                ${cardb.Cars["2019 yamaha r15"].Emote} ${cardb.Cars["2019 yamaha r15"].Name}

                `,
                  inline: true,
                },
                {
                  name: `Items 🪛`,
                  value: `
                ${itemdb["star sticker"].Emote} ${itemdb["star sticker"].Name}\n
                ${itemdb["camera"].Emote} ${itemdb["camera"].Name}\n
                `,
                  inline: true,
                }
              )
              .setFooter({ text: "7/26/2023" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "6_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Big Update`);
            embed
              .addFields(
                {
                  name: "Features ⭐",
                  value: `Used car dealership\n
                Favorite cars filtering in garage\n
                Steal changed to rob\n
                Pet statuses\n
                New parts store design\n
                Drift is easier\n
                New part, and item skins\n
                F1 Event ended`,
                  inline: true,
                },
                {
                  name: "Cars 🚗",
                  value: `
                ${cardb.Cars["2021 porsche 911 turbo"].Emote} ${cardb.Cars["2021 porsche 911 turbo"].Name}

                ${cardb.Cars["1992 bugatti eb110"].Emote} ${cardb.Cars["1992 bugatti eb110"].Name}

                ${cardb.Cars["2021 porsche mission r"].Emote} ${cardb.Cars["2021 porsche mission r"].Name}

                ${cardb.Cars["2023 bentley bentayga"].Emote} ${cardb.Cars["2023 bentley bentayga"].Name}

                 ${cardb.Cars["2020 land rover range rover"].Emote} ${cardb.Cars["2020 land rover range rover"].Name}

                 ${cardb.Cars["2021 audi r8 lms gt3"].Emote} ${cardb.Cars["2021 audi r8 lms gt3"].Name}

                 ${cardb.Cars["2021 audi r8 green hell"].Emote} ${cardb.Cars["2021 audi r8 green hell"].Name}

                 ${cardb.Cars["1959 cadillac series 62"].Emote} ${cardb.Cars["1959 cadillac series 62"].Name}

                 ${cardb.Cars["1981 dmc delorean"].Emote} ${cardb.Cars["1981 dmc delorean"].Name} *RETURNED*
                `,
                  inline: true,
                },
                {
                  name: `Items 🪛`,
                  value: `
                ${itemdb.gem.Emote} ${itemdb.gem.Name}\n
                ${itemdb["pet collar"].Emote} ${itemdb["pet collar"].Name}\n
                ${itemdb["huge vault"].Emote} ${itemdb["huge vault"].Name}\n
                ${itemdb.pizza.Emote} ${itemdb.pizza.Name}\n
                ${itemdb["veggie pizza"].Emote} ${itemdb["veggie pizza"].Name}\n
                ${itemdb.radio.Emote} ${itemdb.radio.Name}\n
                ${itemdb.taser.Emote} ${itemdb.taser.Name}\n
                ${itemdb["tequila shot"].Emote} ${itemdb["tequila shot"].Name}\n
                `,
                  inline: true,
                }
              )
              .setFooter({ text: "4/31/2023" })
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
