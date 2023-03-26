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
            label: "Track Legends",
            description: "Information for the Track Legends Event",
            value: "track_event",
            customId: "track",
            emoji: "🏁",
          },
          {
            label: "Stock Champions",
            description: "Information for the Stock Champions Event",
            value: "stock_event",
            customId: "stock",
            emoji: "🎈",
          },
          {
            label: "F1 Icons",
            description: "Information for the F1 Icons Event",
            value: "f1_icons",
            customId: "f1",
            emoji: "🏎️",
          },
          {
            label: "April Fools",
            description: "Information for the April Fools Event",
            value: "april_fools",
            customId: "april",
            emoji: "🎉",
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
          Track Legends 🏁\n
          Stock Champions 🎈\n
          F1 Icons 🏎️\n
          April Fools 🎉
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
      } else if (value === "track_event") {
        embed.setTitle("Track Legends");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Its track day baby! Bring out your best cars for the track and race for the best track cars in history!

            **Beat the car you're racing, and you keep the car**! However, if you lose, **you lose a heafty amount of cash**... Depending on the difficulty you choose of course!
            
            **Speed is the least of your worries, sometimes it may be the most because you may crash and lose!**

            The event goes up to tier 4 in \`/trackrace\`!

            Tier 4: -$20K
            Tier 3: $-15K
            Tier 2: $-10K
            Tier 1: $-5K

            **Ends March 31st 2023**
            
                  `);
        embed.setThumbnail("https://i.ibb.co/XYNrhZr/event-track.png");
        embed.setColor(colors.blue);

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } else if (value === "stock_event") {
        embed.setTitle("Stock Champions Event");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Bring out your best stock car, there's no parts allowed!

            Race to be on top of the leaderboard in /stockrace to win prizes! View the leaderboard with /leaderboard

            1st: 1987 RUF CTR Yellowbird\n
            2nd: $10M Cash\n
            3rd: $5M Cash\n
            4th: $1M Cash\n
            5th: $500K Cash\n

            **Ends March 31st 2023**
            
                  `);
        embed.setImage(
          "https://www.ruf-automobile.de/site/assets/files/1093/scr-generationen.1920x720.jpg"
        );
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
      } else if (value === "april_fools") {
        let row4 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Horse Carriage")
            .setEmoji("🐎")
            .setStyle("Secondary")
            .setCustomId("horse")
        );
        embed.setTitle("APRIL FOOLS!");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Bring out your WORST car, and be the WORST for this event!

            Until April 1st, street race will tell you that you've won if you lose!

            This event only happens once a year!

            Claim your free April Fools car below as well!

            You can obtain Fools Keys to get april fools cars from LOSING street races, use /unbox to unbox a fools crate!

            There aren't just funny cars, but there's some exclusive cars as well!



            **Ends April 1st 2023**
            
                  `);
        embed.setColor(colors.blue);

        await interaction.editReply({
          embeds: [embed],
          components: [row2, row4],
          fetchReply: true,
        });

        if (userdata.choseapril !== true) {
          let filter2 = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };
          let collector2 = msg.createMessageComponentCollector({
            filter: filter2,
          });
          let carobj = {};
          collector2.on("collect", async (i) => {
            if (i.customId == "horse") {
              let carindb = cardb.Cars["horse carriage"];
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
              userdata.choseapril = true;
              userdata.save();
              await i.update("✅");
              collector2.stop();
            }
          });
        }
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
