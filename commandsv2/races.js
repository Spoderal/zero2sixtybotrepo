const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const squads = require("../data/squads.json");
const { toCurrency } = require("../common/utils");

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
            label: "Offroad",
            description: "Information about offroad racing",
            value: "offroad",
            emoji:"⛰️",
            customId: "offroad",
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
    embed.setThumbnail("https://i.ibb.co/Z1PqfDM/races-img.png");
    embed.setDescription(`Here you can check out the race types and their rewards!\n

          Choose an item from the drop down menu below, there are many different types such as PVP, street racing, drifting, and more!\n
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
            embed.setThumbnail("https://i.ibb.co/pxJBdC4/races-pvp.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "bot_race") {
            embed = new EmbedBuilder();
            embed.setTitle("Street Racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Race in the street!`);
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

            embed.setThumbnail("https://i.ibb.co/2jSdP8K/races-street.png");
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
              `Race bots on the drag strip and earn maps for barn finds!`
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

            embed.setThumbnail("https://i.ibb.co/fk35dwX/races-drag.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } 
          else if (value === "offroad") {
            embed = new EmbedBuilder();
            embed.setTitle("Offroad Racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Race bots in the dirt, AWD helps a lot, and this race is very weight dependent, higher the weight the better!`
            );
            embed.addFields([
              {
                name: `Tier 1`,
                value: `${cashemote} $300\n${rpemote} 1\n${emotes.notoriety} 10`,
                inline: true,
              },
              {
                name: `Tier 2`,
                value: `${cashemote} $600\n${rpemote} 2\n${emotes.notoriety} 15`,
                inline: true,
              },
              {
                name: `Tier 3`,
                value: `${cashemote} $900\n${rpemote} 3\n${emotes.notoriety} 20`,
                inline: true,
              },
              {
                name: `Tier 4`,
                value: `${cashemote} $1100\n${rpemote} 4\n${emotes.notoriety} 25`,
                inline: true,
              },
              {
                name: `Tier 5`,
                value: `${cashemote} $1400\n${rpemote} 5\n${emotes.notoriety} 30`,
                inline: true,
              }
             
            ]);

            embed.setThumbnail("https://i.ibb.co/WVLPL6T/race-offroad.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "squad_race") {
            embed = new EmbedBuilder();
            embed.setTitle("Squad Racing");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(`Race squads to reach the next class of cars, and unlock features`);
            embed.addFields([{ name: `Rewards for ${squads.Squads["flame house"].Emote} ${squads.Squads["flame house"].Name}`, value: `Win: ${toCurrency(squads.Squads["flame house"].Reward)}\nBoss win: ${toCurrency(squads.Squads["flame house"].BigReward)}`, inline: true },
            { name: `Rewards for ${squads.Squads["the astros"].Emote} ${squads.Squads["the astros"].Name}`, value: `Win: ${toCurrency(squads.Squads["the astros"].Reward)}\nBoss win: ${toCurrency(squads.Squads["the astros"].BigReward)}`, inline: true  },
            { name: `Rewards for ${squads.Squads["muscle brains"].Emote} ${squads.Squads["muscle brains"].Name}`, value: `Win: ${toCurrency(squads.Squads["muscle brains"].Reward)}\nBoss win: ${toCurrency(squads.Squads["muscle brains"].BigReward)}`, inline: true  },
            { name: `Rewards for ${squads.Squads["cool cobras"].Emote} ${squads.Squads["cool cobras"].Name}`, value: `Win: ${toCurrency(squads.Squads["cool cobras"].Reward)}\nBoss win: ${toCurrency(squads.Squads["cool cobras"].BigReward)}`, inline: true  },
            { name: `Rewards for ${squads.Squads["demonz"].Emote} ${squads.Squads["demonz"].Name}`, value: `Win: ${toCurrency(squads.Squads["demonz"].Reward)}\nBoss win: ${toCurrency(squads.Squads["demonz"].BigReward)}`, inline: true  },
            { name: `Rewards for ${squads.Squads["double 0"].Emote} ${squads.Squads["double 0"].Name}`, value: `Win: ${toCurrency(squads.Squads["double 0"].Reward)}\nBoss win: ${toCurrency(squads.Squads["double 0"].BigReward)}`, inline: true  },

          ]);
            embed.setThumbnail("https://i.ibb.co/d4ZHBbD/races-squad.png");
            embed.setColor(colors.blue);

            await interaction.editReply({
              embeds: [embed],
              components: [row2],
            });
          } else if (value === "tt_race") {
            embed.data.fields = [];
            embed.setTitle("Time Trial");
            embed.setFooter({ text: 'Prefix is "/"' });
            embed.setDescription(
              `Test your cars limits by doing a time trial!`
            );
            embed.addFields([{ name: `Rewards`, value: `$300 - time` }]);
            embed.setThumbnail("https://i.ibb.co/WVBBPcH/races-time.png");
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
                value: `${cashemote} $200\n${rpemote} 2\n1 Drift Rank`,
                inline: true,
              },
              {
                name: `Medium`,
                value: `${cashemote} $450\n${rpemote} 4\n2 Drift Rank`,
                inline: true,
              },
              {
                name: `Hard`,
                value: `${cashemote} $800\n${rpemote} 6\n3 Drift Rank`,
                inline: true,
              },
            ]);

            embed.setThumbnail("https://i.ibb.co/tz0ygYM/races-drift.png");
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
                name: `Spa-Francorchamps`,
                value: `${cashemote} $750\n${rpemote} 1\n<:ckey:993011409132728370> 5`,
                inline: true,
              },
              {
                name: `Suzuka`,
                value: `${cashemote} $1,000\n${rpemote} 2\n<:rkey:993011407681486868> 3`,
                inline: true,
              },
              {
                name: `Nürburgring`,
                value: `${cashemote} $1,250\n${rpemote} 3\n<:rkey:993011407681486868> 1`,
                inline: true,
              },
            ]);

            embed.setThumbnail("https://i.ibb.co/HV588CS/races-track.png");
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

            embed.setThumbnail("https://i.ibb.co/557zSrr/races-cross.png");
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
