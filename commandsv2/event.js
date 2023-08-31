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
let seasondb = require("../data/seasons.json");

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
            label: "Season 2",
            description: "Information for the Season 2 Z Pass",
            value: "spring_event",
            customId: "spring",
            emoji: "<:season2_ico:1146637806354047007>",
          },
          {
            label: "Rust Bowl",
            description: "Information for the Snow Vs Sun Event",
            value: "event_1",
            customId: "event_1",
            emoji: "🌋",
          }
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
          Season 2 <:season2_ico:1146637806354047007>\n
          Rust Bowl 🌋
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
        embed.setTitle("Season 2");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to the second season on Zero2Sixty!

            Welcome to fall! With new fall items, brand new designed helmets, a whole new Z Pass, and 2 different paths for which cars you earn on the season pass, there's so many things to do!

            Try out the new limited time race, Mountain Climb, where you will need AWD, and lots of weight to get even more notoriety!

            Earn notoriety from street race, and use that towards the Z Pass in /season!

            **Ends September 31st 2023**

                  `);
        embed.setThumbnail(seasondb.Seasons.Fall.Image);
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/89DwwfN/season2image.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      }
     else if (value === "event_1") {
        embed.setTitle("Rust Bowl");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to the rust bowl of Zero2Sixty!

            An all new event, focused on restoring cars! Gain tier 6 parts at random, by racing your barn finds in the rust bowl in /race!

            You will also earn restoration parts for your other barn finds!

            Win 100 rust bowl races and earn the brand new hennessey venom gt!

            **Ends September 31st 2023**

                  `);
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/CnmpN47/season2.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      }
    });
  },
};
