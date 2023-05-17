const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
  ButtonBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");
const cardb = require("../data/cardb.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("events")
    .setDescription("Check the current events"),
  async execute(interaction) {
    const row2 = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("No event selected")
        .addOptions([
          {
            label: "Spring Season",
            description: "Information for the Spring Season Event",
            value: "spring_event",
            customId: "spring",
            emoji: "🌸",
          },
          {
            label: "Spring Season",
            description: "Information for the 2023 World Championship Event",
            value: "world_championship",
            customId: "world",
            emoji: "🏆",
          },
          {
            label: "Colonization Race",
            description: "Information for the Colonization Race Event",
            value: "colonize",
            customId: "colonize",
            emoji: "🪐",
          },
          {
            label: "Le Mans",
            description: "Information for the Le Mans Event",
            value: "lemans",
            customId: "lemans",
            emoji: "🏎️",
          },
        ])
    );

    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let embed = new EmbedBuilder();
    embed.setTitle("Events Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the current events going on!\n\n
          **__Events__**
          Spring Season 2023 🌸\n
          World Championship 2023 🏆\n
          Colonization Race🪐\n
          Le Mans 🏎️
      `);

    embed.setColor(colors.blue);

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row2],
      fetchReply: true,
    });
    const filter = (interaction2) =>
      interaction2.isSelectMenu() &&
      interaction2.user.id === interaction.user.id;

    const collector = msg.createMessageComponentCollector({
      filter,
      time: 1000 * 15,
    });

    collector.on("collect", async (collected) => {
      const value = collected.values[0];
      if (value === "spring_event") {
        embed.setTitle("Spring Season");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to the drifting season!

            The snow has melted in Zero2Sixty!

            Make sure you max out your handling and weight, drifting is revamped and master difficulty is the hardest drift you'll ever face!
            
            Drift for notoriety in /drift

            Use notoriety to redeem rewards from /season

            This spring will bring a lot of new things!

            **Ends May 31st 2023**

                  `);
        embed.setThumbnail("https://i.ibb.co/h9TxV6B/springicon.png");
        embed.setColor(colors.blue);

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } else if (value === "world_championship") {
        embed.setTitle("World Championship Event");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Bring out your best car, and be the best for the 2023 World Championship!

            Race to be on top of the leaderboard in /streetrace to win huge prizes! View the leaderboard with /leaderboard

            This event only happens once a year!

            1st: 2023 Tesla Roadster\n
            2nd: $20M Cash\n
            3rd: $10M Cash\n
            4th: $5M Cash\n
            5th: $1M Cash\n

            **Ends May 31st 2023**
            
                  `);
        embed.setImage("https://i.ibb.co/jvXzrB0/worldchampionship.png");
        embed.setColor(colors.blue);

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } else if (value === "lemans") {
        embed.setTitle("Le Mans Event");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`
        24 Hours of Le Mans has entered Zero2Sixty!

        Race in the Le Mans to gain Le Keys, which will help you get Le Mans cars! 

        Each car has a team its on, for example, a Porsche Le Mans car will be on the Porsche team and gain points for Porsche

        At the end of the event, the team with the most points will get its own event!

        I've given you 10 Le Keys to start, go to /unbox and unbox a Le Mans crate.

            **Ends June 31st 2023**
            
                  `);
        embed.setImage("https://i.ibb.co/4fb0D5V/events-lemans.png");
        embed.setColor(colors.blue);

        if (userdata.lemans !== true) {
          userdata.lekeys += 10;
          userdata.lemans = true;
          userdata.save();
        }

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } else if (value === "colonize") {
        embed.setTitle("Colonization Race Event");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Whats this? Space in Zero2Sixty? Thats right! As wild as this may seem, the rewards in this event are insane, you won't want to miss this event!

        Travel to different planets that have all different types of gravity to collect the parts you need to build the <:superduperrocket:1096348560510943302> **Epic Rocket Engine**, a part that'll only be obtainable **once** in **this event**!

        These parts are a little rare, so you may need to race on these planets multiple times!

        You can also get space tokens to redeem for rewards in /season

        Gravity will effect how you race, so make sure you equip <:spacetires:1096351158429286521> SpaceTires or use the mars rover!

        Buy T1SpaceTires: $10,000

        **View /season (colonization race) to view the rewards!**

            **Ends May 31st 2023**
            
                  `);
        embed.setImage("https://i.ibb.co/Q621RKK/event-colonize.png");
        embed.setColor(colors.blue);

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      }
    });
  },
};
