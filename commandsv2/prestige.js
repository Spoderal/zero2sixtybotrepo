const { SlashCommandBuilder } = require("@discordjs/builders");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const { toCurrency } = require("../common/utils");
const User = require("../schema/profile-schema");

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

    let newprestige2 = (prestigerank += 1);

    let raceprestige = newprestige2 * 100;
    let driftprestige = newprestige2 * 100;

    if (driftrank < driftprestige)
      return await interaction.reply(
        `Your drift rank needs to be ${raceprestige}!`
      );
    if (racerank < raceprestige)
      return await interaction.reply(
        `Your race rank needs to be ${driftprestige}!`
      );

    userdata.prestige += 1;
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
    let vault = userdata.vault;
    if (vault && vault == "small vault") {
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
            cash: 50000,
          },
        }
      );
    } else if (vault && vault == "large vault") {
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
            cash: 100000,
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

    await interaction.reply(
      `Prestiged to rank ${
        userdata.prestige
      }! Your bank limit is now increased by ${toCurrency(
        upgrade
      )}\n\n+1 <:supplydropprestige:1044404462581719041> Prestige Crate`
    );
  },
};
