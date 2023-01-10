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
          {
            label: "wanted",
            description: "Information about escaping the police",
            value: "police_race",
            customId: "police",
          },
          {
            label: "pinkslips",
            description:
              "Information about betting your car against other users",
            value: "pinkslip_race",
            customId: "pinkslip",
          },
          {
            label: "cashcup",
            description: "Information about cashcup races",
            value: "cash_race",
            customId: "cash",
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
          
          <:boost:983813400289234978> = You can use nitrous in this race

          Choose an item from the drop down menu below, there are many different types such as drifting, pink slips, and more!

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
            embed.setDescription(
              `Race against bots for practice!\n<:boost:983813400289234978>`
            );
            embed.addFields([
              {
                name: `Tier 1`,
                value: `${cashemote} $50\n${rpemote} 1\n25 Race XP`,
                inline: true,
              },
              {
                name: `Tier 2`,
                value: `${cashemote} $150\n${rpemote} 1\n50 Race XP`,
                inline: true,
              },
              {
                name: `Tier 3`,
                value: `${cashemote} $350\n${rpemote} 2\n100 Race XP`,
                inline: true,
              },
              {
                name: `Tier 4`,
                value: `${cashemote} $450\n${rpemote} 3\n150 Race XP`,
                inline: true,
              },
              {
                name: `Tier 5`,
                value: `${cashemote} $550\n${rpemote} 4\n<:zbarns:941571059600195594> 1\n200 Race XP`,
                inline: true,
              },
              {
                name: `Tier 6`,
                value: `${cashemote} $750\n${rpemote} 5\n<:zbarns:941571059600195594> 2\n250 Race XP`,
                inline: true,
              },
              {
                name: `Tier 7`,
                value: `${cashemote} $1050\n${rpemote} 10\n<:zbarns_u:958540705964371978> 1\n300 Race XP`,
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
            embed.setTitle("Quarter Mile Racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Race bots on the quarter mile track and earn keys for import crates!\n<:boost:983813400289234978>`
            );
            embed.addFields([
              {
                name: `Tier 1`,
                value: `${cashemote} $75\n${rpemote} 1\n<:ckey:993011409132728370> 2`,
                inline: true,
              },
              {
                name: `Tier 2`,
                value: `${cashemote} $225\n${rpemote} 2\n<:ckey:993011409132728370> 4`,
                inline: true,
              },
              {
                name: `Tier 3`,
                value: `${cashemote} $275\n${rpemote} 3\n<:rkey:993011407681486868> 1`,
                inline: true,
              },
              {
                name: `Tier 4`,
                value: `${cashemote} $375\n${rpemote} 4\n<:rkey:993011407681486868> 2`,
                inline: true,
              },
              {
                name: `Tier 5`,
                value: `${cashemote} $475\n${rpemote} 5\n<:rkey:993011407681486868> 3`,
                inline: true,
              },
              {
                name: `Tier 6`,
                value: `${cashemote} $675\n${rpemote} 6\n<:rkey:993011407681486868> 5`,
                inline: true,
              },
              {
                name: `Tier 7`,
                value: `${cashemote} $850\n${rpemote} 7\n<:ekey:993011410210672671> 1`,
                inline: true,
              },
            ]);

            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "train_race") {
            embed.fields = [];
            embed.setTitle("Training Track Racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Race beginner bots on the track **for new users**!\n<:boost:983813400289234978>`
            );
            embed.addFields([
              {
                name: `Tier 1`,
                value: `${cashemote} $150\n${rpemote} 1`,
                inline: true,
              },
              {
                name: `Tier 2`,
                value: `${cashemote} $250\n${rpemote} 2`,
                inline: true,
              },
              {
                name: `Tier 3`,
                value: `${cashemote} $350\n${rpemote} 3`,
                inline: true,
              },
            ]);
            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "hm_race") {
            embed.fields = [];
            embed.setTitle("Half Mile Racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Race bots on the half mile track!\n<:boost:983813400289234978>`
            );
            embed.addFields([
              {
                name: `Tier 1`,
                value: `${cashemote} $150\n${rpemote} 2`,
                inline: true,
              },
              {
                name: `Tier 2`,
                value: `${cashemote} $300\n${rpemote} 3 ${rpemote}`,
                inline: true,
              },
              {
                name: `Tier 3`,
                value: `${cashemote} $450\n${rpemote} 4`,
                inline: true,
              },
              {
                name: `Tier 4`,
                value: `${cashemote} $650\n${rpemote} 4`,
                inline: true,
              },
              {
                name: `Tier 5`,
                value: `${cashemote} $750\n${rpemote} 5\n${emotes.barnMapRare} 1`,
                inline: true,
              },
              {
                name: `Tier 6`,
                value: `${cashemote} $900\n${rpemote} 6\n<:wheelspin:985048616865517578> 1\nChance at <:bankupgrade:974153111298007131> 1`,
                inline: true,
              },
              {
                name: `Tier 7`,
                value: `${cashemote} $1250\n${rpemote} 10\n<:wheelspin:985048616865517578> 2`,
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
            embed.setDescription(
              `Race squads to take their cars!\n<:boost:983813400289234978>`
            );
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
                name: `Easy`,
                value: `${cashemote} $200\n${rpemote} 2\n<:zeronotor:962785804202176574> Car Handling / Laps\n100 Race XP`,
                inline: true,
              },
              {
                name: `Medium`,
                value: `${cashemote} $500\n${rpemote} 4\n<:zeronotor:962785804202176574> Car Handling / Laps\n250 Race XP`,
                inline: true,
              },
              {
                name: `Hard`,
                value: `${cashemote} $1,000\n${rpemote} 6\n<:zeronotor:962785804202176574> Car Handling / Laps\n400 Race XP`,
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
          } else if (value === "pinkslip_race") {
            embed.fields = [];
            embed.setTitle("Pinkslips");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Race another user to steal their car!*`);
            embed.addFields([
              { name: `Rewards`, value: `The winner gets the losers car` },
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
