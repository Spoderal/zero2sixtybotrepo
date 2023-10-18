"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const partdb = require("../data/partsdb.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uninstall")
    .setDescription("Take off fuse parts from your upgrades")
    .addStringOption((option) =>
      option
        .setDescription("The car to uninstall the part from")
        .setName("car")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setDescription("The part to uninstall")
        .setName("part")
        .setRequired(true)
    ),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let caroption = interaction.options.getString("car");
    let partoption = interaction.options.getString("part");

    let ucars = userdata.cars;
    let uparts = userdata.parts;

    let selected = ucars.filter((car) => car.ID == caroption.toLowerCase());

    if (!partdb.Parts[partoption.toLowerCase()])
      return interaction.reply(`Thats not a part!`);

    let fusable = partdb.Parts[partoption.toLowerCase()].Fuse;

    if (!fusable)
      return interaction.reply(
        "Thats not a installable part! If its a legacy part, wait for it to be implemented."
      );

    if (!selected[0])
      return interaction.reply(
        `Thats not a car! Did you make sure to put the cars ID?`
      );

    if (!uparts.includes(partoption.toLowerCase()))
      return interaction.reply(`You don't have this part!`);

    if (
      !selected[0][partindb.Type.toLowerCase()] ||
      selected[0][partindb.Type.toLowerCase()] == null
    )
      return interaction.reply("This car doesn't have this part!");

    if (
      !selected[0][partindb.Type.toLowerCase()] ||
      selected[0][partindb.Type.toLowerCase()] == null
    )
      return interaction.reply("This car doesn't have this part!");

    let partindb = partdb.Parts[partoption.toLowerCase()];
    let partoncar = selected[0][partindb.Type.toLowerCase()];


    if (partindb.Power) {
      selected[0].Speed -= partindb.Power;
    }
    if (partindb.Handling) {
      selected[0].Handling -= partindb.Handling;
    }
    if (partindb.Weight) {
      selected[0].WeightStat -= partindb.Weight;
    }
    if (partindb.WeightMinus) {
      selected[0].WeightStat += partindb.WeightMinus;
    }
    if (partindb.Acceleration) {
      selected[0].Acceleration += partindb.Acceleration;
    }
    if (partindb.HandlingMinus) {
      selected[0].Handling += partindb.HandlingMinus;
    }

    if (partindb.Stars) {
      selected[0].Rating -= partindb.Stars;
    }

    selected[0][partindb.Type.toLowerCase()] = null;

    await User.findOneAndUpdate(
      {
        id: interaction.user.id,
      },
      {
        $set: {
          "cars.$[car]": selected[0],
        },
      },

      {
        arrayFilters: [
          {
            "car.Name": selected[0].Name,
          },
        ],
      }
    );

    userdata.parts.push(partoncar.toLowerCase());

    userdata.save();

    interaction.reply(
      `Uninstalled ${partindb.Emote} ${partindb.Name} from your ${selected[0].Name}`
    );
  },
};
