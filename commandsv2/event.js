const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");

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
          Track Legends 🏁\n
          Stock Champions 🎈
      `);

    embed.setColor(colors.blue);

    await interaction
      .reply({ embeds: [embed], components: [row2] })
      .then(() => {
        const filter = (interaction2) =>
          interaction2.isSelectMenu() &&
          interaction2.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({
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
          }
        });
      });
  },
};
