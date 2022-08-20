const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
 const { emotes } = require("../common/emotes");
 const User = require("../schema/profile-schema")

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
            label: "Summer Event",
            description: "Information for the Summer Season Event",
            value: "spring_event",
            customId: "spring",
            emoji: "☀️",
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

    let udata = await User.findOne({id: interaction.user.id})

    let bwins = udata.bugattiwins || 0

    let embed = new EmbedBuilder();
    embed.setTitle("Events Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the current events going on!\n\n
          **__Events__**
          Summer Season 2022 ☀️
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
            embed.setTitle("Summer Season");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Its time to drift! Get your best set of tires, your favorite car to drift in, and start drifting around different types of tracks!

            There are many different rewards to claim this season, get more garage space, some cool helmets, keys, cash, and more!

            
    
            __Commands__
    
            /drift [difficulty] [track] [car] - Race with a drift bot on the tracks!

            /reward [reward id] - Claim rewards from the season
    
            /season [page] - View the rewards available to claim
    
            **Ends August 31st 2022**
                  `);
            embed.setThumbnail("https://i.ibb.co/C0S0bfQ/summericongif.gif");
            embed.setImage("https://i.ibb.co/XYrY5d6/seasonsummer.png");
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

            Use Bugatti cars on any tier 5 track of your choice to earn points towards the event reward, the 2024 Bugatti Mistral. Win 1K tier 5 races in the bugatti of your choice to earn this limited time car.

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
