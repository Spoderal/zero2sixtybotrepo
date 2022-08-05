const { SlashCommandBuilder } = require("@discordjs/builders");
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
        .addChoice("Cash", "cash")
        .addChoice("Rare Keys", "rkeys")
        .addChoice("Common Keys", "ckeys")
        .addChoice("Exotic Keys", "ekeys")
        .addChoice("Common Barn Maps", "cmaps")
        .addChoice("Uncommon Barn Maps", "ucmaps")
        .addChoice("Rare Barn Maps", "rmaps")
        .addChoice("Legendary Barn Maps", "lmaps")
        .addChoice("Wheel spins", "wheelspins")
        .addChoice("Super wheel spins", "swheelspins")
        .setRequired(true)
    ),
  async execute(interaction) {
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    if (
      interaction.user.id !== "937967206652837928" &&
      interaction.user.id !== "890390158241853470" &&
      interaction.user.id !== "670895157016657920"
    ) {
      interaction.reply({
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

      interaction.reply(
        `Gave ${givingto} ${numberWithCommas(togive)} ${itemtogive}`
      );
    }
  },
};
