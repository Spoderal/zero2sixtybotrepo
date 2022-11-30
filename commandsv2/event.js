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
            label: "Space Race",
            description: "Information for the Space Race Event",
            value: "space_event",
            customId: "space",
            emoji: "🚀",
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
          Space Race 🚀
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
          } else if (value === "space_event") {
            embed.setTitle("Space Race");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`We're in space now!

            Race other bots on the moon with /moonrace for moon tokens and use those tokens to get rewards from the space race season! 

            The final reward is something really special.

            Bots will have better stats than you, but both of your stats will be halved on the moon!

            Make sure to use your best cars.

            **Ends January 31st 2023**
            
                  `);
            embed.setThumbnail("https://i.ibb.co/L5D1zDK/moontokensicon.png");
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
