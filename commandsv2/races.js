const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("races")
    .setDescription("See details for each race type"),
  async execute(interaction) {
    const row2 = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("No race selected")
        .addOptions([
          {
            label: "PVP",
            description: "Information about PVP racing",
            value: "pvp_race",
            customId: "pvp",
          },
          {
            label: "streetrace",
            description: "Information about street racing",
            value: "bot_race",
            customId: "botrace",
          },
          {
            label: "dragrace",
            description: "Information about drag racing",
            value: "qm_race",
            customId: "qmrace",
          },
          {
            label: "squadrace",
            description: "Information about squad racing",
            value: "squad_race",
            customId: "squadrace",
          },
          {
            label: "timetrial",
            description: "Information about time trials",
            value: "tt_race",
            customId: "ttrace",
          },
          {
            label: "drift",
            description: "Information about drifting",
            value: "driftrace",
            customId: "drift",
          },
        ])
    );

    let rpemote = emotes.rp;
    let cashemote = emotes.cash;
    let embed = new EmbedBuilder();
    embed.setTitle("Race Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
    embed.setDescription(`Here you can check out the race types and their rewards!\n\n
        

          Choose an item from the drop down menu below, there are many different types such as drifting, pink slips, and more!\n
          Use /race to race in any of these races!

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
          time: 1000 * 30,
        });

        collector.on("collect", async (collected) => {
          const value = collected.values[0];
          if (value === "pvp_race") {
            embed.fields = [];
            embed.setTitle("PVP Racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Race against other players!`);
            embed.addFields([{ name: `Rewards`, value: `$500\n10 RP` }]);
            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "bot_race") {
            embed.fields = [];
            embed.setTitle("Street Racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Race against bots for practice!`);
            embed.addFields([
              {
                name: `Tier 1`,
                value: `${cashemote} $50\n${rpemote} 1\n25 Race XP`,
                inline: true,
              },
              {
                name: `Tier 2`,
                value: `${cashemote} $100\n${rpemote} 1\n50 Race XP`,
                inline: true,
              },
              {
                name: `Tier 3`,
                value: `${cashemote} $150\n${rpemote} 2\n100 Race XP`,
                inline: true,
              },
              {
                name: `Tier 4`,
                value: `${cashemote} $200\n${rpemote} 3\n150 Race XP`,
                inline: true,
              },
              {
                name: `Tier 5`,
                value: `${cashemote} $250\n${rpemote} 4\n<:zbarns:941571059600195594> 1\n200 Race XP`,
                inline: true,
              },
            ]);

            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "qm_race") {
            embed.fields = [];
            embed.setTitle("Drag Racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Race bots on the quarter mile track and earn maps for barns!`
            );
            embed.addFields([
              {
                name: `Tier 1`,
                value: `${cashemote} $75\n${rpemote} 1\n<:ckey:993011409132728370> 2`,
                inline: true,
              },
              {
                name: `Tier 2`,
                value: `${cashemote} $150\n${rpemote} 2\n<:ckey:993011409132728370> 4`,
                inline: true,
              },
              {
                name: `Tier 3`,
                value: `${cashemote} $225\n${rpemote} 3\n<:rkey:993011407681486868> 1`,
                inline: true,
              },
              {
                name: `Tier 4`,
                value: `${cashemote} $300\n${rpemote} 4\n<:rkey:993011407681486868> 2`,
                inline: true,
              },
              {
                name: `Tier 5`,
                value: `${cashemote} $375\n${rpemote} 5\n<:rkey:993011407681486868> 3`,
                inline: true,
              },
            ]);

            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "squad_race") {
            embed.fields = [];
            embed.setTitle("Squad Racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Race squads to take their cars!`);
            embed.addFields([{ name: `Rewards`, value: `$600` }]);
            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "tt_race") {
            embed.fields = [];
            embed.setTitle("Time Trial");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Test your cars limits by doing a time trial!`
            );
            embed.addFields([{ name: `Rewards`, value: `$300 - time` }]);
            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "driftrace") {
            embed.fields = [];
            embed.setTitle("Drifting");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Drift freely and earn money for it!`);
            embed.addFields([
              {
                name: `Easy`,
                value: `${cashemote} $200\n${rpemote} 2\n<:zeronotor:962785804202176574> Car Drift Rating * 5 - time to complete track\n25 Drift XP`,
                inline: true,
              },
              {
                name: `Medium`,
                value: `${cashemote} $450\n${rpemote} 4\n<:zeronotor:962785804202176574> Car Drift Rating * 5 - time to complete track\n50 Drift XP`,
                inline: true,
              },
              {
                name: `Hard`,
                value: `${cashemote} $800\n${rpemote} 6\n<:zeronotor:962785804202176574> Car Drift Rating * 5 - time to complete track\n100 Drift XP`,
                inline: true,
              },
            ]);

            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "track") {
            embed.fields = [];
            embed.setTitle("Track Race");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Take your car to the track and test its limits!`
            );
            embed.addFields([
              {
                name: `Tier 1`,
                value: `${cashemote} $65\n${rpemote} 1\n<:ckey:993011409132728370> 2`,
                inline: true,
              },
              {
                name: `Tier 2`,
                value: `${cashemote} $130\n${rpemote} 2\n<:ckey:993011409132728370> 4`,
                inline: true,
              },
              {
                name: `Tier 3`,
                value: `${cashemote} $195\n${rpemote} 3\n<:rkey:993011407681486868> 1`,
                inline: true,
              },
              {
                name: `Tier 4`,
                value: `${cashemote} $260\n${rpemote} 4\n<:rkey:993011407681486868> 2`,
                inline: true,
              },
              {
                name: `Tier 5`,
                value: `${cashemote} $325\n${rpemote} 5\n<:rkey:993011407681486868> 3`,
                inline: true,
              },
            ]);

            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "dpvp_race") {
            embed.fields = [];
            embed.setTitle("PVP Drifting");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Drift against other players!`);
            embed.addFields([{ name: `Rewards`, value: `$500\n10 RP` }]);
            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "police_race") {
            embed.fields = [];
            embed.setTitle("Wanted");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Get away from the cops, but if you don't get away suffer a loss!`
            );
            embed.addFields([
              { name: `Tier 1`, value: `${cashemote} $400`, inline: true },
              { name: `Tier 2`, value: `${cashemote} $700`, inline: true },
              { name: `Tier 3`, value: `${cashemote} $1000`, inline: true },
            ]);
            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "cash_race") {
            embed.fields = [];
            embed.setTitle("Cashcup");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Rise up the ranks of cash cup, and earn more money from each tier!`
            );
            embed.addFields([
              { name: `Rewards`, value: `Cash cup tier * $75` },
            ]);
            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "bet_race") {
            embed.fields = [];
            embed.setTitle("Bet racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Bet against the odds! Careful, the bot chooses any car from the game, so you could be racing a miata or a mclaren speedtail.`
            );
            embed.addFields([
              { name: `Rewards`, value: `The amount you bet * 1.5` },
            ]);
            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
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
