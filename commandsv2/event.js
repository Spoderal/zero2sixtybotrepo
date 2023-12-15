

const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");
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
            label: "Christmas",
            description: "Information for the Christmas Event",
            value: "event_1",
            customId: "event_1",
            emoji: "🎅🏼",
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
          Season 3 <:season3:1183248587774238741>
          Christmas Event 🎅🏼
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
        embed.setTitle("Season 3");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to the third season on Zero2Sixty!

            Welcome to winter! With new winter items, brand new designed helmets, and a whole new Z Pass there's so many things to do!

            Try out the new limited time race, Snow Race, where you will need AWD, and lots of handling to get even more notoriety!

            Earn notoriety from snow race, and use that towards the Z Pass in /season!

            **Ends March 1st 2023**

                  `);
        embed.setThumbnail(seasondb.Seasons.Winter.Image);
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/dMnN6LL/season3image.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } 
      else  if (value === "event_1") {
        embed.setTitle("Christmas Event");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`The Christmas event is here!

        Get <:zpresent:1183910541194956871> presents from racing in the snow race, and obtain snowballs, exclusive cars, and more!

        During the event, daily and weekly rewards are **doubled**! Its a Christmas miracle!

        **Ends December 31st 2023**

                  `);
        embed.setThumbnail();
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/kySCd7y/CHRISTMASEVENT.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } 
    });
  },
};
