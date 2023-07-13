const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const partdb = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const { capitalize } = require("lodash");
const colors = require("../common/colors");
const emotes = require("../common/emotes").emotes;
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json").Cars;
const parttiersdb = require("../data/parttiers.json");
const { toCurrency } = require("../common/utils");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a part from your car")
    .addStringOption((option) =>
      option.setName("car").setDescription("Your car ID").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("part")
        .setDescription("The part to remove")
        .setRequired(true)
        .addChoices(
          { name: "Exhaust", value: "exhaust" },
          { name: "Tires", value: "tires" },
          { name: "Suspension", value: "suspension" },
          { name: "Turbo", value: "turbo" },
          { name: "Intake", value: "intake" },
          { name: "Engine", value: "engine" },
          { name: "Intercooler", value: "intercooler" },
          { name: "ECU", value: "ecu" },
          { name: "Clutch", value: "clutch" },
          { name: "Gearbox", value: "gearbox" }
        )
    ),
  async execute(interaction) {
    let inputCarIdOrName = interaction.options.getString("car");
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let usercars = userdata.cars || [];

    let selected = usercars.filter(
      (car) =>
        car.Name.toLowerCase() == inputCarIdOrName.toLowerCase() ||
        car.ID == inputCarIdOrName
    );

    if (selected.length == 0)
      return interaction.reply(
        "Thats not a car! Make sure to specify a car ID, or car name"
      );
    let carindb = cardb[selected[0].Name.toLowerCase()];
    let carprice = carindb.Price;
    if (carindb.Price == 0) {
      carprice = 1000;
    }
    let removepart = interaction.options.getString("part");

    if (!selected[0][removepart.toLowerCase()])
      return interaction.reply("Your car doesn't have this part!");

    if (selected[0][removepart.toLowerCase()] == 0)
      return interaction.reply("This part cant go any lower!");
    let partoncar = selected[0][removepart.toLowerCase()];

    let parttier = parttiersdb[`${removepart.toLowerCase()}1`];

    if (parttier.Power) {
      selected[0].Speed -= selected[0].Speed * parttier.Power;
    }
    if (parttier.Handling) {
      selected[0].Handling -= selected[0].Handling * parttier.Handling;
    }
    if (parttier.Acceleration) {
      selected[0].Acceleration +=
        selected[0].Acceleration * parttier.Acceleration;
    }

    selected[0][removepart.toLowerCase()] -= 1;

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

   
    let partcost = partoncar * parttier.Cost

    userdata.cash += partcost;

    userdata.save();

    interaction.reply("✅");
  },
};
