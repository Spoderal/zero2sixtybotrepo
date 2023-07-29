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
            label: "7/14/2023",
            description: "Information for the latest patch",
            value: "3_update",
            customId: "up3",
            emoji: "⚙️",
          },
          {
            label: "5/31/2023",
            description: "Information for the recent summer season update!",
            value: "4_update",
            customId: "up4",
            emoji: "☀️",
          },
          {
            label: "7/11/2023",
            description: "Information for the recent huge overhaul!",
            value: "5_update",
            customId: "up5",
            emoji: "🏎️",
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
            ⚙️ Latest Patch 7/14/2023\n
            ☀️ Summer Update 5/31/2023\n
            🏎️ Race Update 7/11/2023\n
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
          if (value === "3_update") {
            embed.fields = [];
            embed.setDescription("\u200b");

            embed.setTitle(`Latest Patch`);
            embed
              .setDescription(
                `• New car series\n
                 • New fuse parts in crates\n
                 • Import cars are buyable with credits obtained from selling them\n
                 • New business upgrades\n
                 • Business leveling\n
                 • /uninstall, /install and /fuseparts for fuse parts\n
                 • Weight fuse parts for reducing or increasing car weight\n
                 • Crates fixed\n
                 • Car series is raceable\n
                 • Races give miles
                `
              )
              .setFooter({ text: "7/14/2023" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "4_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Big Update`);
            embed
              .addFields(
                {
                  name: "Features ⭐",
                  value: `New season design, shorter seasons, more unique themes and better rewards\n
                Garage images (BETA, PLEASE WAIT 3 SECONDS BEFORE SCROLLING THROUGH YOUR GARAGE)\n
                New Crew season\n
                New Crew command design\n
                Police racing rewards nerfed\n
                Imports and super wheelspins are now limited to users who have beaten the 2nd squad.\n
                Police racing now ranks your police rank up\n
                Item shop changed to daily instead of weekly\n
                New titles and helmets\n
                editprofile removed, moved to /profile edit\n
                Profile now shows buttons to view helmets and titles\n
                Miles and "power total" shows in garage now instead of full stats\n
                Bounty conversion nerfed\n
                Race rewards nerfed\n
                TXGearbox, TXECU`,
                  inline: true,
                },
                {
                  name: "Cars 🚗",
                  value: `
                ${cardb.Cars["2020 chevy camaro ss"].Emote} ${cardb.Cars["2020 chevy camaro ss"].Name}

                ${cardb.Cars["2020 ford mustang gt500"].Emote} ${cardb.Cars["2020 ford mustang gt500"].Name}

                ${cardb.Cars["2019 dodge challenger hellcat redeye"].Emote} ${cardb.Cars["2019 dodge challenger hellcat redeye"].Name}

                ${cardb.Cars["2015 dodge charger hellcat"].Emote} ${cardb.Cars["2015 dodge charger hellcat"].Name}

                 ${cardb.Cars["1969 ford mustang boss"].Emote} ${cardb.Cars["1969 ford mustang boss"].Name}

                 ${cardb.Cars["2021 dodge durango hellcat"].Emote} ${cardb.Cars["2021 dodge durango hellcat"].Name}

                 ${cardb.Cars["1968 plymouth roadrunner"].Emote} ${cardb.Cars["1968 plymouth roadrunner"].Name}

                 ${cardb.Cars["2021 mclaren 720s gt3x"].Emote} ${cardb.Cars["2021 mclaren 720s gt3x"].Name}

                 ${cardb.Cars["1973 ford mustang mach 1"].Emote} ${cardb.Cars["1973 ford mustang mach 1"].Name} *RETURNED*
                `,
                  inline: true,
                },
                {
                  name: `Items 🪛`,
                  value: `
                ${itemdb["beach ball"].Emote} ${itemdb["beach ball"].Name}\n
                ${itemdb["cocktail"].Emote} ${itemdb["cocktail"].Name}\n
                ${itemdb["ice cube"].Emote} ${itemdb["ice cube"].Name}\n
                ${itemdb["old kite"].Emote} ${itemdb["old kite"].Name}\n
                ${itemdb["permission slip"].Emote} ${itemdb["permission slip"].Name}\n
                ${itemdb.radar.Emote} ${itemdb.radar.Name}\n
                `,
                  inline: true,
                }
              )
              .setFooter({ text: "7/14/2023" })
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
          } else if (value === "5_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed
              .addFields(
                {
                  name: "Features ⭐",
                  value: `__Race revamp__
                  Quarter mile and half mile joined into 1 race\n
                  Race menu removed, typing only\n
                  Highway removed\n
                  Track race added\n
                  Tiers go up to 8 \n
                  Bounty removed for the time being until its reworked\n
                  Barn maps moved to drag race\n
                  Cash cup removed\n
                  Wheelspin cars are purchasable\n
                  Stats changed for more cars\n

                
            `,
                  inline: true,
                },
                {
                  name: "Features 2 ⭐",
                  value: `  Keys earned in track race\n
                  Key droprates, and barn droprates reduced\n
                  Lockpicks only obtainable in wheelspins\n
                  Wheelspins and super wheelspins obtainable in crates\n
                  Upgrade system overhauled\n
                  Restoration tweaked, now you must have 5 of the right junk parts in your inventory to restore a car\n
                  New stats card\n
                  GAS! You'll need gas for each of your cars to race, view the current gas price with /bot, and fill up with /gas, EVs are charged their car price / 1000 to charge the car\n
            `,
                  inline: true,
                }
              )
              .setFooter({ text: "7/11/2023" })
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
