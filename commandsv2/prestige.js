const { SlashCommandBuilder } = require("@discordjs/builders");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const { toCurrency } = require("../common/utils");
const User = require("../schema/profile-schema");
const ms = require("pretty-ms");

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

    let raceprestige = newprestige2 * 30;
    let driftprestige = newprestige2 * 20;

    if (driftrank < driftprestige)
      return await interaction.reply(
        `Your drift rank needs to be ${driftprestige}!`
      );
    if (racerank < raceprestige)
      return await interaction.reply(
        `Your race rank needs to be ${raceprestige}!`
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

    await interaction.reply(
      `Prestiged to rank ${
        userdata.prestige
      }! Your bank limit is now increased by ${toCurrency(
        upgrade
      )}\n\n+1 <:supplydropprestige:1044404462581719041> Prestige Crate`
    );
  },
};
