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
            label: "5/17/2023",
            description: "Information for the recent small update!",
            value: "5_update",
            customId: "up5",
            emoji: "🚨",
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
            🚨 Police Update 5/17/2023\n
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
                  value: `Police Overhaul, view new in-depth tutorial [here](https://youtu.be/oGNZQdiF2fk)\n
              Heists, make a heist with friends, or alone for decreased chances on success to get lots of money!\n
              Bug fixes including squad race losses being random\n
              Le Mans event!\n
              Use /bal convert to convert bounty into cash
            `,
                  inline: true,
                },
                {
                  name: "Cars 🚗",
                  value: `
              ${cardb.Cars["2021 chevrolet corvette c8.r"].Emote} ${cardb.Cars["2021 chevrolet corvette c8.r"].Name}

              ${cardb.Cars["2023 porsche 963"].Emote} ${cardb.Cars["2023 porsche 963"].Name}

              ${cardb.Cars["2016 audi r18"].Emote} ${cardb.Cars["2016 audi r18"].Name}

              ${cardb.Cars["2007 audi r10 tdi"].Emote} ${cardb.Cars["2007 audi r10 tdi"].Name}

               ${cardb.Cars["2011 peugeot 908"].Emote} ${cardb.Cars["2011 peugeot 908"].Name}

               ${cardb.Cars["2023 ferrari 499p"].Emote} ${cardb.Cars["2023 ferrari 499p"].Name}

               ${cardb.Cars["2019 porsche 911 rsr19"].Emote} ${cardb.Cars["2019 porsche 911 rsr19"].Name}

               ${cardb.Cars["2023 toyota gr010 hybrid"].Emote} ${cardb.Cars["2023 toyota gr010 hybrid"].Name}

               ${cardb.Cars["2022 peugeot 9x8"].Emote} ${cardb.Cars["2022 peugeot 9x8"].Name}

               ${cardb.Cars["1997 honda civic del sol"].Emote}  ${cardb.Cars["1997 honda civic del sol"].Name}

               ${cardb.Cars["2012 honda accord"].Emote}  ${cardb.Cars["2012 honda accord"].Name}

               ${cardb.Cars["2010 noble m600"].Emote}  ${cardb.Cars["2010 noble m600"].Name}

               ${cardb.Cars["2008 acura tl"].Emote}  ${cardb.Cars["2008 acura tl"].Name}
              `,
                  inline: true,
                },
                {
                  name: `Police Cars 🚨`,
                  value: `
                ${cardb.Cars["police 2010 ford mustang"].Emote} ${cardb.Cars["police 2010 ford mustang"].Name}

                ${cardb.Cars["police 2012 audi r8"].Emote} ${cardb.Cars["police 2012 audi r8"].Name}
  
                ${cardb.Cars["police 2012 bentley continental gt"].Emote} ${cardb.Cars["police 2012 bentley continental gt"].Name}
  
                ${cardb.Cars["police 2018 bmw m2"].Emote} ${cardb.Cars["police 2018 bmw m2"].Name}

                ${cardb.Cars["police 2012 mercedes c63"].Emote} ${cardb.Cars["police 2012 mercedes c63"].Name}

                ${cardb.Cars["police 2019 nissan gtr"].Emote} ${cardb.Cars["police 2019 nissan gtr"].Name}

                ${cardb.Cars["police 2020 lamborghini urus"].Emote} ${cardb.Cars["police 2020 lamborghini urus"].Name}

                ${cardb.Cars["police 2020 lamborghini huracan"].Emote} ${cardb.Cars["police 2020 lamborghini huracan"].Name}
              `,
                  inline: true,
                },
                {
                  name: `Items 🪛`,
                  value: `
              ${itemdb.dirt.Emote} ${itemdb.dirt.Name}\n
              ${itemdb["coconut"].Emote} ${itemdb["coconut"].Name}\n
              ${itemdb["milk"].Emote} ${itemdb["milk"].Name}\n
              ${itemdb["chocolate milk"].Emote} ${itemdb["chocolate milk"].Name}\n
              ${itemdb["strawberry milk"].Emote} ${itemdb["strawberry milk"].Name}\n
              ${itemdb.crowbar.Emote} ${itemdb.crowbar.Name}\n
              ${itemdb.mask.Emote} ${itemdb.mask.Name}\n
              ${itemdb["spikes"].Emote} ${itemdb["spikes"].Name}\n
              ${itemdb["emp"].Emote} ${itemdb["emp"].Name}\n
              ${itemdb["flowers"].Emote} ${itemdb["flowers"].Name}\n
              `,
                  inline: true,
                }
              )
              .setFooter({ text: "5/17/2023" })
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
