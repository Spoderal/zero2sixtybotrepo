


const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
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

    if (partoncardb)
      return interaction.reply("This car part already has a fuse slot in use!");

    if (partindb.Power) {
      selected[0].Speed += partindb.Power;
    }
    if (partindb.Handling) {
      selected[0].Handling += partindb.Handling;
    }
    if (partindb.Weight) {
      selected[0].WeightStat += partindb.Weight;
    }
    if (partindb.WeightMinus) {
      selected[0].WeightStat -= partindb.WeightMinus;
    }
    if (partindb.Acceleration) {
      selected[0].Acceleration -= partindb.Acceleration;
    }
    if (partindb.HandlingMinus) {
      selected[0].Handling -= partindb.HandlingMinus;
    }

    if (partindb.Stars) {
      selected[0].Rating += partindb.Stars;
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
    let userparts = userdata.parts;
    for (var i2 = 0; i2 < 1; i2++)
      userparts.splice(
        userparts.indexOf(partindb.Name.toLowerCase.toLowerCase()),
        1
      );
    userdata.parts = userparts;

    userdata.save();

    interaction.reply(
      `Installed a ${partindb.Emote} ${partindb.Name} on your ${selected[0].Name}`
    );
  },
};
