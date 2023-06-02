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
          {
            label: "Le Mans",
            description: "Information for the Le Mans Event",
            value: "lemans",
            customId: "lemans",
            emoji: "🏎️",
          },
          {
            label: "Devils Mountain",
            description: "Information for the Devils Mountain Event",
            value: "devilsmountain",
            customId: "devilsmountain",
            emoji: "🤘",
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
          Le Mans 🏎️\n
          Devils Mountain 🤘
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

            **Ends July 12th 2023**

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
      else if (value === "devilsmountain") {
        embed.setTitle("Devils Mountain");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Can you beat the drift king?

            Welcome to Devils Mountain, the longest, and hardest drift track ever, you're gonna need an extra good drift build to win against the drift king, his name is unknown.

            Drift in /drift mountain extreme to race the drift king, you'll earn 3x drift rank for winning, an achievement if you win, 

            Earn the title "DRIFT KING" for winning against him!
            
            The drift crate is also back with new cars temporarily!

            **Ends July 1st 2023**

                  `);
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/fXrT4K0/devilsmountain.png");

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
      }
    });
  },
};
