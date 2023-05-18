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
            label: "5/5/2023",
            description: "Information for the latest patch",
            value: "3_update",
            customId: "up3",
            emoji: "⚙️",
          },
          {
            label: "3/1/2023",
            description: "Information for the recent spring season update!",
            value: "4_update",
            customId: "up4",
            emoji: "🌸",
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
            ⚙️ Latest Patch 5/5/2023\n
            🌸 Spring Update 3/1/2023\n
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
                `• New event! Check /events\n
                • Fixed a lot of bugs!\n
                • New visuals\n
                • Autocomplete now in /race, and /buy, phasing out ids as the summer starts!\n
                • Race visuals updated for smoother performance\n
                • Profile visuals updated for smoother performance\n
                • New job: Chef
                • New items for chef job, <:item_spatula:1103826123600707658> Spatula and <a:item_pot:1103826120299778078> Cooking Pot

                `
              )
              .setFooter({ text: "5/5/2023" })
              .setThumbnail(`https://i.ibb.co/XXnHjYQ/newlogo2.png`)
              .setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "4_update") {
            embed.fields = [];
            embed.setDescription("\u200b");
            embed.setTitle(`Spring Update`);
            embed
              .setDescription(
                `• New season! The snow melts, and everyone starts drifting! Featuring a brand new season with never seen before rewards! Check /season for more information and use /drift to earn notoriety!\n
                 • Drift mechanics revamp, no more drift stat, handling and weight matter the most in drifting! The more weight and the more handling, the better chance you have\n
                 • Master drift difficulty with a badge for winning 20 times on it!\n
                 • New parts, featuring drift spoilers, a new TXTurbo, and T5DriftTires!\n
                 • New seasonal crate featuring new helmets, and drift spoilers\n
                 • The drift crate returns with more drift cars than ever!\n
                 • Referrals, make a code and give it to your friends who sign up so you both get $10K!\n
                 • Profile backgrounds, make your profile look snazzy\n
                 • /stats fixed, now shows the correct information for parts\n
                 • View the new cars with /dealer\n
                 • View cars in crates with the new list option in /unbox!\n
                 • Remove all parts with /remove!
                `
              )
              .setFooter({ text: "3/1/2023" })
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
