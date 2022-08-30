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
            label: "End of an Era",
            description: "Information for the End of an Era Event",
            value: "event_2",
            customId: "event_2",
            emoji: "<:bugatti:931012624110460979>",
          },
        ])
    );

    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let bwins = userdata.bugattiwins || 0;

    let embed = new EmbedBuilder();
    embed.setTitle("Events Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the current events going on!\n\n
          **__Events__**
          Fall Season 2022 🍂
          End of an Era <:bugatti:931012624110460979>
        
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
          } else if (value === "event_2") {
            embed.setTitle("End of an Era");
            embed.setFooter({ text: `Your wins: ${bwins}` });
            embed.setDescription(`The Bugatii W16 is one of the most well known engines. However, all good things must come to an end...

            Bugatti announced that the Mistral will be the last car with its famous W16 engine. So in honor of that, we thought we'd do an event for them!

            Use Bugatti cars on any tier 6 track of your choice to earn points towards the event reward, the 2024 Bugatti Mistral. Win 1K tier 6 races in the bugatti of your choice to earn this limited time car.

            It'll never be obtainable again after September 15th 2022.
                  `);
            embed.setThumbnail(
              "https://www.topgear.com/sites/default/files/2022/08/04%20BUGATTI_Roadster_launch-set_dynamic.jpg"
            );
            embed.setImage();
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
