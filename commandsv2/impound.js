const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { invisibleSpace } = require("../common/utils");
const User = require("../schema/profile-schema");
const ms = require("pretty-ms");
const cardb = require("../data/cardb.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("impound")
    .setDescription("Take back a car that was recently impounded")
    .addStringOption((option) =>
      option.setName("car").setDescription("The car to take back (ID)")
    ),
  async execute(interaction) {
    let option = interaction.options.getString("car");

    let userdata = await User.findOne({ id: interaction.user.id });
    let uid = interaction.user.id;
    let impounds = userdata.cars || [];

    let impound = impounds.filter(
      (car) => car.ID == option.toLowerCase() && car.Impounded == true
    );
    impound = impound[0];
    console.log(impound);

    let impoundtimer = impound.ImpoundTime || 0;
    let timeout = 600000;

    if (impoundtimer !== null && timeout - (Date.now() - impoundtimer) > 0) {
      let time = ms(timeout - (Date.now() - impoundtimer));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(
          `You need to wait ${time} before removing the impound from your car.`
        );
      return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }

    let impoundcost = cardb.Cars[impound.Name.toLowerCase()].Price;

    if (impoundcost == 0) {
      impoundcost = 5000;
    }

    let impoundc = impoundcost / 10;

    if (userdata.cash < impoundc)
      return interaction.reply(
        `You need ${impoundc} to remove the impound from your car!`
      );

    await interaction.reply(
      `Your car's impound has been removed, next time be more careful`
    );

    await User.findOneAndUpdate(
      {
        id: interaction.user.id,
      },
      {
        $set: {
          "cars.$[car].Impounded": false,
          "cars.$[car].ImpoundTime": 0,
        },
      },

      {
        arrayFilters: [
          {
            "car.Name": impound.Name,
          },
        ],
      }
    );

    userdata.cash -= impoundc;

    userdata.save();
  },
  permissions: "",
  requiredRoles: [],
};
