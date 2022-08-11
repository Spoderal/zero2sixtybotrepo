const { SlashCommandBuilder } = require("@discordjs/builders");
const { toCurrency } = require("../common/utils");
const prestiges = require("../data/prestige.json");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prestige")
    .setDescription("Prestige your rank, this will reset your cash."),

  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    let driftrank = userdata.driftrank;
    let racerank = userdata.racerank;
    let prestigerank = userdata.prestige;
    if (prestigerank == 11)
      return await interaction.reply(
        "Your prestige is currently maxed! The current max prestige is 11."
      );
    let newprestige2 = (prestigerank += 1);

    let patron =
      userdata.patron.required || prestiges[newprestige2].DriftRequired;
    let patron2 =
      userdata.patron.required || prestiges[newprestige2].RaceRequired;

    if (driftrank < patron)
      return await interaction.reply(`Your drift rank needs to be ${patron}!`);
    if (racerank < patron2)
      return await interaction.reply(`Your race rank needs to be ${patron2}!`);

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

    userdata.banklimit += upgrade;

    userdata.save();

    await interaction.reply(
      `Prestiged to rank ${
        userdata.prestige
      }! Your bank limit is now increased by ${toCurrency(
        upgrade
      )} and you've unlocked the following: ${prestiges[
        userdata.prestige
      ].Unlocks.join(", ")}`
    );
  },
};
