const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
// const { emotes } = require("../common/emotes");

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
            description: "Information for the Spring Season Event",
            value: "spring_event",
            customId: "spring",
            emoji: "☀️",
          }
       
        ])
    );

    let embed = new EmbedBuilder();
    embed.setTitle("Events Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the current events going on!\n\n
          **__Events__**
          Summer Season 2022 ☀️
        
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
          } else if (value === "ferrari") {
            embed.setTitle("Ferrari Championship");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Race with your favorite Ferrari in bot races to stack up on Ferrari keys!\n

            Only Ferraris are allowed in this event!

            The exclusive Ferrari crate includes a new event exclusive Ferrari F40 and the 2013 LaFerrari!

            Event Ends **7/31/2022**
                  `);
            embed.setThumbnail(
              "https://upload.wikimedia.org/wikipedia/commons/c/cb/F40_Ferrari_20090509.jpg"
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
