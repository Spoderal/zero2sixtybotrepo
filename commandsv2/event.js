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
            label: "Winter Season",
            description: "Information for the Winter Season Event",
            value: "winter_event",
            customId: "winter",
            emoji: "❄️",
          },
          {
            label: "Track Legends",
            description: "Information for the Track Legends Event",
            value: "track_event",
            customId: "track",
            emoji: "🏁",
          },
          {
            label: "McLaren Event",
            description: "Information for the McLaren Event",
            value: "mclaren_event",
            customId: "mclaren",
            emoji: "<:mclaren:931011546354692137>",
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
          Winter Season 2022 ❄️\n
          Track Legends 🏁\n
          McLaren Event <:mclaren:931011546354692137>
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
          if (value === "winter_event") {
            embed.setTitle("Winter Season");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Sometimes, too much speed is a bad thing.

            The snow has returned on Zero2Sixty!

            Make sure you max out your handling, but make sure your speed is low, because too much speed will make you spin out and lose!
            
            Race bots for notoriety in /snowrace

            Use notoriety to redeem rewards from /season

            This winter will bring a lot of new things!

            **Ends March 1st 2023**

                  `);
            embed.setThumbnail("https://i.ibb.co/F8jDWw2/winterseason.png");
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
          } else if (value === "mclaren_event") {
            embed.setTitle("McLaren Event");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Bring out your best McLaren, because its time to race with it!

            Race for McLaren keys in \`/streetrace\`, and use them towards a McLaren import crate with \`/unbox\`

            Get any of the following from the crate:
            2020 McLaren Speedtail
            1995 McLaren F1
            2020 McLaren 570S
            2021 McLaren 765LT
            2017 McLaren 650S
            2018 McLaren P1 GT

            **Ends Febuary 28th 2023**
            
                  `);
            embed.setThumbnail(
              "https://www.topgear.com/sites/default/files/images/news-article/2018/07/06ba2b96a4ea4fa5d86b083bd8ab42ba/dsc03169.jpg"
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
