

const { SlashCommandBuilder } = require("@discordjs/builders");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { emotes } = require("../common/emotes");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prestige")
    .setDescription("Prestige your rank, this will reset your cash."),

  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let driftrank = userdata.driftrank;
    let racerank = userdata.racerank;
    let prestigerank = userdata.prestige;

    let keeprace = userdata.keeprace;
    let keepdrift = userdata.keepdrift;
    let oldrank = userdata.prestige;
    let newprestige2 = (prestigerank += 1);

    let raceprestige = newprestige2 * 20;
    let driftprestige = newprestige2 * 20;

    if (driftrank < driftprestige)
      return await interaction.reply(
        `Your drift rank needs to be ${driftprestige}!`
      );
    if (racerank < raceprestige)
      return await interaction.reply(
        `Your race rank needs to be ${raceprestige}!`
      );

    let row = new ActionRowBuilder().setComponents(
      new ButtonBuilder().setCustomId("yes").setLabel("Yes").setStyle("Success")
    );

    let msg = await interaction.reply({
      content: `Are you sure? You'll lose all of your cash!`,
      fetchReply: true,
      components: [row],
    });

    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    let collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 10000,
    });

    collector.on("collect", async (i) => {
      if (i.customId == "yes") {
        let prestigetoadd = 1
        if(userdata.items.includes("cheese")){
          prestigetoadd = 2
          let items = userdata.items
          for (var i7 = 0; i7 < 1; i7++) {items.splice(items.indexOf("cheese"), 1)}
          userdata.items = items;
        }
        userdata.prestige += prestigetoadd;
        if (keeprace) {
          let oldraces = (racerank -= raceprestige);
          userdata.keeprace = false;
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                racerank: oldraces,
              },
            }
          );
        } else {
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                racerank: 0,
              },
            }
          );
        }
        if (keepdrift) {
          let olddrift = (driftrank -= driftprestige);
          userdata.keepdrift = false;
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                driftrank: olddrift,
              },
            }
          );
        } else {
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                driftrank: 0,
              },
            }
          );
        }
        let vault = userdata.vault;
        if (vault && vault == "small vault") {
          let cash = userdata.cash;
          let cashtostore = 50000 - cash;

          let cashtostore2 = 50000 - cashtostore;

          if (cashtostore2 <= 0) {
            cashtostore2 = 50000;
          }
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                vault: null,
              },
            }
          );
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                cash: 25000,
              },
            }
          );
        } else if (vault && vault == "medium vault") {
          let cash = userdata.cash;
          let cashtostore = 100000 - cash;

          let cashtostore2 = 100000 - cashtostore;

          if (cashtostore2 <= 0) {
            cashtostore2 = 100000;
          }
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                vault: null,
              },
            }
          );
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                cash: cashtostore2,
              },
            }
          );
        } else if (vault && vault == "large vault") {
          let cash = userdata.cash;
          let cashtostore = 500000 - cash;

          let cashtostore2 = 500000 - cashtostore;

          if (cashtostore2 <= 0) {
            cashtostore2 = 500000;
          }
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                vault: null,
              },
            }
          );
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                cash: cashtostore2,
              },
            }
          );
        } else if (vault && vault == "huge vault") {
          let cash = userdata.cash;
          let cashtostore = 1000000 - cash;

          let cashtostore2 = 1000000 - cashtostore;

          if (cashtostore2 <= 0) {
            cashtostore2 = 1000000;
          }
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                vault: null,
              },
            }
          );
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                cash: cashtostore2,
              },
            }
          );
        } else {
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                cash: 0,
              },
            }
          );
        }
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              rp: 0,
            },
          }
        );

        userdata.swheelspins += 1;

        let upgrade = prestigerank * 1000;
        userdata.items.push("prestige crate");
        userdata.banklimit += upgrade;
      

        userdata.save();
        
        let newrank = oldrank + prestigetoadd;
        let embed = new EmbedBuilder()
          .setTitle("Prestiged")
          .setDescription(
            `+1 <:supplydropprestige:1044404462581719041> Prestige Crate`
          )
          .addFields(
            {
              name: `${emotes.prestige} Old Rank`,
              value: `${oldrank}`,
            },
            {
              name: `${emotes.prestige} New Rank`,
              value: `${newrank}`,
            }
          )
          .setColor(colors.blue);

        await interaction.editReply({
          embeds: [embed],
          fetchReply: true,
          components: [],
          content: "",
        });
      }
    });
  },
};
