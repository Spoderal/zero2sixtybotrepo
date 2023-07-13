const { SlashCommandBuilder } = require("@discordjs/builders");
const { numberWithCommas } = require("../common/utils");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("BOT OWNER ONLY")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you want to give something to")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("amount").setDescription("The amount").setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The amount")
        .addChoices(
          { name: "Cash", value: "cash" },
          { name: "Rare Keys", value: "rkeys" },
          { name: "Common Keys", value: "ckeys" },
          { name: "Exotic Keys", value: "ekeys" },
          { name: "Barn Maps", value: "barnmaps" },
          { name: "Wheel spins", value: "wheelspins" },
          { name: "Super wheel spins", value: "swheelspins" }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    if (
      interaction.user.id !== "937967206652837928" &&
      interaction.user.id !== "890390158241853470" &&
      interaction.user.id !== "670895157016657920"
    ) {
      await interaction.reply({
        content: "You dont have permission to use this command!",
        ephemeral: true,
      });
      return;
    } else {
      let togive = interaction.options.getString("amount");
      let givingto = interaction.options.getUser("target");
      let itemtogive = interaction.options.getString("item");

      if (!togive) return;
      if (!givingto) return;
      let udata = await User.findOne({ id: givingto.id });

      udata[itemtogive] += Number(togive);
      udata.save();

      await interaction.reply(
        `Gave ${givingto} ${numberWithCommas(togive)} ${itemtogive}`
      );
    }
  },
};
