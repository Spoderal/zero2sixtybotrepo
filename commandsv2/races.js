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
            emoji:"🆚",
            customId: "pvp",
          },
          {
            label: "Street Race",
            description: "Information about street racing",
            value: "bot_race",
            emoji:"🚗",
            customId: "botrace",
          },
          {
            label: "Track Race",
            description: "Information about track racing",
            value: "track_race",
            emoji:"🟢",
            customId: "trackrace",
          },
          {
            label: "Cross Country",
            description: "Information about cross country",
            value: "crosscountry",
            emoji:"🌍",
            customId: "crosscountry",
          },
          {
            label: "Drag Race",
            description: "Information about drag racing",
            value: "qm_race",
            emoji:"🏁",
            customId: "qmrace",
          },
          {
            label: "Squad Race",
            description: "Information about squad racing",
            value: "squad_race",
            emoji:"🧑‍🤝‍🧑",
            customId: "squadrace",
          },
          {
            label: "Time Trial",
            description: "Information about time trials",
            value: "tt_race",
            emoji:"⏱️",
            customId: "ttrace",
          },
          {
            label: "Drift",
            description: "Information about drifting",
            value: "driftrace",
            emoji:"🛞",
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

          **Your cars rating will boost your race rank earnings in races! Check /rating for your cars rating and tips on how to boost it**

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
            embed = new EmbedBuilder();
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
            embed = new EmbedBuilder();
            embed.setTitle("Street Racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Race against bots for practice!`);
            embed.addFields([
              {
                name: `Tier 1`,
                value: `${cashemote} $200\n${rpemote} 1\n25 Race XP`,
                inline: true,
              },
              {
                name: `Tier 2`,
                value: `${cashemote} $400\n${rpemote} 2\n50 Race XP`,
                inline: true,
              },
              {
                name: `Tier 3`,
                value: `${cashemote} $600\n${rpemote} 3\n100 Race XP`,
                inline: true,
              },
              {
                name: `Tier 4`,
                value: `${cashemote} $800\n${rpemote} 4\n150 Race XP`,
                inline: true,
              },
              {
                name: `Tier 5`,
                value: `${cashemote} $1000\n${rpemote} 5\n200 Race XP`,
                inline: true,
              },
              {
                name: `Tier 6`,
                value: `${cashemote} $1200\n${rpemote} 6\n200 Race XP`,
                inline: true,
              },
              {
                name: `Tier 7`,
                value: `${cashemote} $1400\n${rpemote} 7\n200 Race XP`,
                inline: true,
              },
              {
                name: `Tier 8`,
                value: `${cashemote} $1600\n${rpemote} 8\n200 Race XP`,
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
            embed = new EmbedBuilder();
            embed.setTitle("Drag Racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Race bots on the quarter mile track and earn maps for barns!`
            );
            embed.addFields([
              {
                name: `Tier 1`,
                value: `${cashemote} $250\n${rpemote} 1\n${emotes.barnMapCommon} 1`,
                inline: true,
              },
              {
                name: `Tier 2`,
                value: `${cashemote} $500\n${rpemote} 2\n${emotes.barnMapCommon} 1`,
                inline: true,
              },
              {
                name: `Tier 3`,
                value: `${cashemote} $750\n${rpemote} 3\n${emotes.barnMapCommon} 1`,
                inline: true,
              },
              {
                name: `Tier 4`,
                value: `${cashemote} $1000\n${rpemote} 4\n${emotes.barnMapCommon} 2`,
                inline: true,
              },
              {
                name: `Tier 5`,
                value: `${cashemote} $1250\n${rpemote} 5\n${emotes.barnMapCommon} 2`,
                inline: true,
              },
              {
                name: `Tier 6`,
                value: `${cashemote} $1500\n${rpemote} 6\n${emotes.barnMapCommon} 2`,
                inline: true,
              },
              {
                name: `Tier 7`,
                value: `${cashemote} $1750\n${rpemote} 7\n${emotes.barnMapCommon} 2`,
                inline: true,
              },
              {
                name: `Tier 8`,
                value: `${cashemote} $2000\n${rpemote} 8\n${emotes.barnMapCommon} 2`,
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
            embed = new EmbedBuilder();
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
            embed = new EmbedBuilder();
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
          } else if (value === "track_race") {
            embed = new EmbedBuilder();
            embed.setTitle("Track Race");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Take your car to the track and test its limits!`
            );
            embed.addFields([
              {
                name: `Tier 1`,
                value: `${cashemote} $225\n${rpemote} 1\n<:ckey:993011409132728370> 2`,
                inline: true,
              },
              {
                name: `Tier 2`,
                value: `${cashemote} $450\n${rpemote} 2\n<:ckey:993011409132728370> 4`,
                inline: true,
              },
              {
                name: `Tier 3`,
                value: `${cashemote} $675\n${rpemote} 3\n<:rkey:993011407681486868> 1`,
                inline: true,
              },
              {
                name: `Tier 4`,
                value: `${cashemote} $900\n${rpemote} 4\n<:rkey:993011407681486868> 2`,
                inline: true,
              },
              {
                name: `Tier 5`,
                value: `${cashemote} $1125\n${rpemote} 5\n<:rkey:993011407681486868> 3`,
                inline: true,
              },
              {
                name: `Tier 6`,
                value: `${cashemote} $1350\n${rpemote} 6\n<:rkey:993011407681486868> 3`,
                inline: true,
              },
              {
                name: `Tier 7`,
                value: `${cashemote} $1575\n${rpemote} 7\n<:rkey:993011407681486868> 3`,
                inline: true,
              },
              {
                name: `Tier 8`,
                value: `${cashemote} $1800\n${rpemote} 8\n<:rkey:993011407681486868> 3`,
                inline: true,
              },
            ]);

            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } 
          else if (value === "crosscountry") {
            embed = new EmbedBuilder();
            embed.setTitle("Cross Country");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Take your car to the country in this long race!`
            );
            embed.addFields([
              {
                name: `Tier 1`,
                value: `${cashemote} $275\n${rpemote} 1\n50% Chance for 1 ${emotes.wheelSpin}`,
                inline: true,
              },
              {
                name: `Tier 2`,
                value: `${cashemote} $550\n${rpemote} 2\n50% Chance for 1 ${emotes.wheelSpin}`,
                inline: true,
              },
              {
                name: `Tier 3`,
                value: `${cashemote} $825\n${rpemote} 3\n50% Chance for 1 ${emotes.wheelSpin}`,
                inline: true,
              },
              {
                name: `Tier 4`,
                value: `${cashemote} $1100\n${rpemote} 4\n50% Chance for 1 ${emotes.wheelSpin}`,
                inline: true,
              },
              {
                name: `Tier 5`,
                value: `${cashemote} $1375\n${rpemote} 5\n50% Chance for 1 ${emotes.superWheel}`,
                inline: true,
              },
              {
                name: `Tier 6`,
                value: `${cashemote} $1650\n${rpemote} 6\n50% Chance for 1 ${emotes.superWheel}`,
                inline: true,
              },
              {
                name: `Tier 7`,
                value: `${cashemote} $1925\n${rpemote} 7\n50% Chance for 1 ${emotes.superWheel}`,
                inline: true,
              },
              {
                name: `Tier 8`,
                value: `${cashemote} $2200\n${rpemote} 8\n50% Chance for 1 ${emotes.superWheel}`,
                inline: true,
              },
            ]);

            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } 
          else if (value === "dpvp_race") {
            embed = new EmbedBuilder();
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
            embed = new EmbedBuilder();
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
            embed = new EmbedBuilder();
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
            embed = new EmbedBuilder();
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
