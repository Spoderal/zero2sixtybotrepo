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
            label: "Fall Season",
            description: "Information for the Fall Season Event",
            value: "spring_event",
            customId: "spring",
            emoji: "🍂",
          },
          {
            label: "Trick or Speed",
            description: "Information for the Trick or Speed Event",
            value: "halloween_event",
            customId: "halloween",
            emoji: "🍬",
          },
          {
            label: "Time Champions",
            description: "Information for the Time Champions Event",
            value: "time_event",
            customId: "time",
            emoji: "⏱️",
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
          Fall Season 2022 🍂\n
          Trick or Speed 🍬\n
          Time Champions ⏱️
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
            embed.setTitle("Fall Season");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Get your track cars out because its track season!

            Choose from a bunch of new parts that help your handling increase, because you'll want to make sure your handling is MAX!

            Test your cars limits on the track with /trackrace and earn notoriety to earn exclusive season rewards, this time DOUBLE the length of last season!

            
    
            __Commands__
    
            /tracklength [difficulty] [track] [car] - Race with a drift bot on the tracks!
    
            /season [page] - View the rewards available to claim
    
            **Ends November 31st 2022**
                  `);
            embed.setThumbnail("https://i.imgur.com/9oPxIib.pngf");
            embed.setImage("https://i.imgur.com/w6t4kOC.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "halloween_event") {
            embed.setTitle("Trick or Speed");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Its Halloween in Zero City! You know what that means, candy!!!

            Race to get sweets in the new \`/trickortreat\` command! 

            You can also get the brand new Zero Bar! A brand new candy bar that gives some spooky effects!

            Use those candies to get spooky wheel spins and get exclusive cars that are a little...scary!

            **Ends November 1st 2022**
            
                  `);
            embed.setThumbnail("https://i.ibb.co/1RLHhVP/logo-halloween.png");
            embed.setImage("https://i.ibb.co/yWWWXx9/halloweeeen.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          }
          else if (value === "time_event") {
            embed.setTitle("Time Champions");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`People are competing to get the best time on /timetrial! Can you beat everyone and get the best time!

            Race against the clock in timetrial with /timetrial race
            Check the leaderboard and top 3 users with /timetrial leaderboard

            1st place wins an exclusive 2010 Dodge Viper SRT10 and an exclusive badge\n
            2nd place wins $1M, and an exclusive badge\n
            3rd place wins $500K and an exclusive badge\n
            
                  `);
            embed.setThumbnail("https://i.ibb.co/Fng0cKF/timetrialevent.png");
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
