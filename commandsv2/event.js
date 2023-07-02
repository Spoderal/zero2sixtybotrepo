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
            label: "Season 1",
            description: "Information for the Season 1 Z Pass",
            value: "spring_event",
            customId: "spring",
            emoji: "<a:season_1:1111097329836113920>",
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
          Season 1 <a:season_1:1111097329836113920>\n
          
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
        embed.setTitle("Season 1");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to the first season on Zero2Sixty!

            Welcome to summer! With new summer themed items, summer helmets, a whole new Z Pass, and muscle cars, there's so many things to do!

            Try out the new limited time race, Muscle Drag Race, where you can only use muscle cars and get even more notoriety!

            Earn notoriety from street race, and use that towards the Z Pass in /season!

            **Ends August 31st 2023**

                  `);
        embed.setThumbnail(seasondb.Seasons.Summer.Image);
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/85G4t6R/season1-image.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      }
    });
  },
};
