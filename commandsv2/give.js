const cars = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require(`../schema/profile-schema`);
const partdb = require("../data/partsdb.json");
const itemdb = require("../data/items.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Give items to users (OWNER ONLY)")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item to give")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to give the item to")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (
      interaction.user.id !== "890390158241853470" &&
      interaction.user.id !== "937967206652837928"
    ) {
      await interaction.reply("You dont have permission to use this command!");
      return;
    } else {
      let togive = interaction.options.getString("item");
      let givingto = interaction.options.getUser("user");

      if (!togive) return;
      if (!givingto) return;

      let udata2 = await User.findOne({ id: givingto.id });

      if (cars.Cars[togive.toLowerCase()]) {
        let carindb = cars.Cars[togive.toLowerCase()];
        let carobj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: carindb.Speed,
          Acceleration: carindb["0-60"],
          Handling: carindb.Handling,
          Parts: [],
          Emote: carindb.Emote,
          Livery: carindb.Image,
          Miles: 0,
          WeightStat: carindb.Weight,
          Gas: 10,
          MaxGas: 10,
        };
        if (carindb.Range) {
          carobj = {
            ...carobj,
            Range: carindb.Range,
            MaxRange: carindb.Range,
          };
        }

        udata2.cars.push(carobj);

        udata2.save();
      } else if (partdb.Parts[togive.toLowerCase()]) {
        udata2.parts.push(togive.toLowerCase());
        udata2.save();
        await interaction.reply(
          `Gave <@${givingto.id}> a ${partdb.Parts[togive.toLowerCase()].Name}`
        );
        console.log("given");
      } else if (itemdb[togive.toLowerCase()]) {
        udata2.items.push(togive.toLowerCase());
        udata2.save();
        await interaction.reply(
          `Gave <@${givingto.id}> a ${itemdb[togive.toLowerCase()].Name}`
        );
      } else {
        return await interaction.reply("Thats not an item!");
      }

      await interaction.reply(`Gave <@${givingto.id}> a ${togive}`);
    }
  },
};
