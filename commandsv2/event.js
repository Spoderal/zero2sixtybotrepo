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
            label: "F1 Icons",
            description: "Information for the F1 Icons Event",
            value: "f1_icons",
            customId: "f1",
            emoji: "🏎️",
          },
          {
            label: "Colonization Race",
            description: "Information for the Colonization Race Event",
            value: "colonize",
            customId: "colonize",
            emoji: "🪐",
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
          F1 Icons 🏎️\n
          Colonization Race🪐
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
      } else if (value === "f1_icons") {
        let row3 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("2023 Ferrari SF23")
            .setEmoji("<:ferrari:931011838374727730>")
            .setStyle("Secondary")
            .setCustomId("ferrari"),
          new ButtonBuilder()
            .setLabel("2023 Mercedes W14 E")
            .setEmoji("<:mercedes_z:973000364410404924>")
            .setStyle("Secondary")
            .setCustomId("mercedes"),
          new ButtonBuilder()
            .setLabel("2023 Aston Martin AMR23")
            .setEmoji("<:aston:931011548682534962>")
            .setStyle("Secondary")
            .setCustomId("aston")
        );
        embed.setTitle("F1 Icons Event");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`You can only pick 1 F1 Starter car, so make sure you check that its the one for your style!

            Introducing the first ever F1 cars to Zero2Sixty, you'll be racing on the F1 track to get to 1st place! Multiple laps, and a leaderboard for laps of course! Use /f1race

            And of course there's other F1 cars to obtain, for every lap you complete you'll obtain 1 F1 Blueprint, you can redeem 25 of those for a blueprint that could include an exclusive F1 car!


            __List of obtainable F1 Cars__
            ${cardb.Cars["2023 alfa romeo c38"].Emote} ${cardb.Cars["2023 alfa romeo c38"].Name}
            ${cardb.Cars["2021 red bull rb18"].Emote} ${cardb.Cars["2021 red bull rb18"].Name}
            ${cardb.Cars["2022 mclaren mcl36"].Emote} ${cardb.Cars["2022 mclaren mcl36"].Name}
            ${cardb.Cars["1988 mclaren mp4/4"].Emote} ${cardb.Cars["1988 mclaren mp4/4"].Name}
            ${cardb.Cars["2006 bmw sauber f106"].Emote} ${cardb.Cars["2006 bmw sauber f106"].Name}
            ${cardb.Cars["2022 haas vf22"].Emote} ${cardb.Cars["2022 haas vf22"].Name}

            *More to come soon*

            **Choose your starter F1 below!**

            **Ends April 31st 2023**
            
                  `);
        embed.setImage("https://i.ibb.co/N60pqYw/event-f1.png");
        embed.setColor(colors.blue);

        await interaction.editReply({
          embeds: [embed],
          components: [row2, row3],
          fetchReply: true,
        });

        if (userdata.chosef1 !== true) {
          let filter2 = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };
          let collector2 = msg.createMessageComponentCollector({
            filter: filter2,
          });
          let carobj = {};
          collector2.on("collect", async (i) => {
            if (i.customId == "ferrari") {
              let carindb = cardb.Cars["2023 ferrari sf23"];
              carobj = {
                ID: carindb.alias,
                Name: carindb.Name,
                Speed: carindb.Speed,
                Acceleration: carindb["0-60"],
                Handling: carindb.Handling,
                Parts: [],
                Emote: carindb.Emote,
                Livery: carindb.Image,
                Miles: 0,
                Resale: 1000000,
              };
              userdata.cars.push(carobj);
              userdata.chosef1 = true;
              userdata.save();
              await i.update("✅");
              collector2.stop();
            } else if (i.customId == "mercedes") {
              let carindb = cardb.Cars["2023 mercedes w14 e"];
              carobj = {
                ID: carindb.alias,
                Name: carindb.Name,
                Speed: carindb.Speed,
                Acceleration: carindb["0-60"],
                Handling: carindb.Handling,
                Parts: [],
                Emote: carindb.Emote,
                Livery: carindb.Image,
                Miles: 0,
                Resale: 1000000,
              };
              userdata.cars.push(carobj);
              userdata.chosef1 = true;
              userdata.save();
              await i.update("✅");
              collector2.stop();
            } else if (i.customId == "aston") {
              let carindb = cardb.Cars["2023 aston martin amr23"];
              carobj = {
                ID: carindb.alias,
                Name: carindb.Name,
                Speed: carindb.Speed,
                Acceleration: carindb["0-60"],
                Handling: carindb.Handling,
                Parts: [],
                Emote: carindb.Emote,
                Livery: carindb.Image,
                Miles: 0,
                Resale: 1000000,
              };
              userdata.cars.push(carobj);
              userdata.chosef1 = true;
              userdata.save();
              await i.update("✅");
              collector2.stop();
            }
          });
        }
      }
    });
  },
};
