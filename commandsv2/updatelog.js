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
            label: "6/7/2023",
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
            label: "6/19/2023",
            description: "Information for the recent small update!",
            value: "5_update",
            customId: "up5",
            emoji: "🏎️",
          },
        ])
    );

    let embed = new EmbedBuilder();
    embed.setTitle("Updates Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the recent updates!\n\n
            **__Updates__**
            ⚙️ Latest Patch 6/7/2023\n
            ☀️ Summer Update 5/31/2023\n
            🏎️ Race Update 6/19/2023\n
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
                `• 2 New events! Check /events\n
                • Fixed a lot of bugs!\n
                • New feature, Car series, check /series and click help for more information!\n
                • Bounty resets every 24 hours\n
                • Bounty earnings increased for cops
                • New items: Brief Case\n
                • Stats now shows your livery\n
                • Livery overhaul, all liveries deleted, but you can now utilize liveries in more places\n
                • New car series\n
                • New leaderboards for prestige, and pvp\n
                • /carlist will show you all cars on the bot\n
                • Tags, add tags to cars you want to set apart from the others\n
                • Filter garage by favorites\n
                • 2 New houses\n
                • New warehouses
                • New cars, check /dealer
                • New parts: T5Weight, TXXBrakes
                `
              )
              .setFooter({ text: "6/7/2023" })
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
              .setFooter({ text: "4/31/2023" })
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
                  Displays a new map of races\n
                  New formula so you wont lose randomly\n
                  New tiers for street race only (BETA)\n
                  You now lose money if you lose races\n
                  **NEW EVENT: WET WARRIORS**\n
                  Sell cars from lockpicks easier\n
                  No more duplicates in lockpicks\n
                  Garage sorts by new\n
                  Crew delete added\n
                  /restore shows parts needed when you don't have the parts\n
                  Item shop no longer has duplicate items
            `,
                  inline: true,
                },
                {
                  name: "Cars 🚗",
                  value: `
                  ${cardb.Cars["2024 porsche mission x"].Emote} ${cardb.Cars["2024 porsche mission x"].Name}\n
                  ${cardb.Cars["2021 porsche panamara turbo"].Emote} ${cardb.Cars["2021 porsche panamara turbo"].Name}\n
                  ${cardb.Cars["2011 mercedes sl65 amg black series"].Emote} ${cardb.Cars["2011 mercedes sl65 amg black series"].Name}\n
                  ${cardb.Cars["2015 lotus exige s roadster"].Emote} ${cardb.Cars["2015 lotus exige s roadster"].Name}\n
                  ${cardb.Cars["2024 lotus eletra"].Emote} ${cardb.Cars["2024 lotus eletra"].Name}\n
                  ${cardb.Cars["2008 audi rs6"].Emote} ${cardb.Cars["2008 audi rs6"].Name}\n
                  ${cardb.Cars["2008 bmw z4"].Emote} ${cardb.Cars["2008 bmw z4"].Name}\n
                  ${cardb.Cars["1995 porsche 928"].Emote} ${cardb.Cars["1995 porsche 928"].Name}\n
                  ${cardb.Cars["1986 ford escort rs turbo"].Emote} ${cardb.Cars["1986 ford escort rs turbo"].Name}\n
                  ${cardb.Cars["1993 lamborghini lm002"].Emote} ${cardb.Cars["1993 lamborghini lm002"].Name}\n
                  ${cardb.Cars["1999 lamborghini diablo gtr"].Emote} ${cardb.Cars["1999 lamborghini diablo gtr"].Name}\n
                  ${cardb.Cars["1998 mercedes amg clk gtr"].Emote} ${cardb.Cars["1998 mercedes amg clk gtr"].Name}\n

              `,
                  inline: true,
                },
                {
                  name: `Items 🪛`,
                  value: `
              ${itemdb.gas.Emote} ${itemdb.gas.Name}\n
              ${itemdb.fireplace.Emote} ${itemdb.fireplace.Name}\n
              ${itemdb.bubbles.Emote} ${itemdb.bubbles.Name}\n
              ${itemdb["parking brake"].Emote} ${itemdb["parking brake"].Name}\n
              ${itemdb.chips.Emote} ${itemdb.chips.Name}\n
              ${itemdb.match.Emote} ${itemdb.match.Name}\n

              `,
                  inline: true,
                }
              )
              .setFooter({ text: "6/19/2023" })
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
