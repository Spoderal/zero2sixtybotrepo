const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const partdb = require("../data/partsdb.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("install")
    .setDescription("Install parts onto your upgrades")
    .addStringOption((option) =>
      option
        .setDescription("The car to install the part on")
        .setName("car")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setDescription("The part to install")
        .setName("part")
        .setRequired(true)
    ),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let uid = interaction.user.id;

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

    let partindb = partdb.Parts[partoption.toLowerCase()];
    let partoncar = selected[0][partindb.Type.toLowerCase()];

    let partoncardb = partdb.Parts[partoncar];

    if (partoncar !== undefined && partoncardb.Power) {
      selected[0].Speed -= partoncardb.Power;
    }
    if (partoncar !== undefined && partoncardb.Handling) {
      selected[0].Handling -= partoncardb.Handling;
    }
    if (partoncar !== undefined && partoncardb.Weight) {
      selected[0].WeightStat -= partoncardb.Weight;
    }
    if (partoncar !== undefined && partoncardb.Acceleration) {
      selected[0].Acceleration += partoncardb.Acceleration;
    }

    if (partindb.Power) {
      selected[0].Speed += partindb.Power;
    }
    if (partindb.Handling) {
      selected[0].Handling += partindb.Handling;
    }
    if (partindb.Weight) {
      selected[0].WeightStat += partindb.Weight;
    }
    if (partindb.Acceleration) {
      selected[0].Acceleration -= partindb.Acceleration;
    }

    selected[0][partindb.Type.toLowerCase()] = partindb.Name.toLowerCase();

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

    userdata.save();

    interaction.reply(
      `Installed a ${partindb.Emote} ${partindb.Name} on your ${selected[0].Name}`
    );
  },
};
