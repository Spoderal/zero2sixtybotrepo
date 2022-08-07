const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exchange")
    .setDescription("Exchange gold for keys, maps, and more!")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item to exchange gold for")
        .addChoice("Cash", "cash")
        .addChoice("Rare Keys", "rkeys")
        .addChoice("Exotic Keys", "ekeys")
        .addChoice("Uncommon Barn Maps", "ubmaps")
        .addChoice("Rare Barn Maps", "rbmaps")
        .addChoice("Legendary Barn Maps", "lbmaps")
        .addChoice("Super Wheel Spins", "swspins")

        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("How much gold you want to exchange (like 20 gold)")
        .setRequired(true)
    ),
  async execute(interaction) {
    let toconv = interaction.options.getString("item");
    let toturnin = interaction.options.getNumber("amount");
    let userdata = await User.findOne({ id: interaction.user.id });

    let gold = userdata.gold;

    if (!toturnin)
      return interaction.reply("Specify how much gold you'd like to exchange!");
    if (isNaN(toturnin)) return interaction.reply("Specify a number!");
    if (toturnin > gold)
      return interaction.reply("You don't have enough gold!");
    if (toconv == "cash") {
      let finalamount = toturnin * 10000;
      userdata.gold -= toturnin;
      userdata.cash += finalamount;
      userdata.save();

      interaction.reply(
        `Converted ${toturnin} gold into $${numberWithCommas(finalamount)}`
      );
    } else if (toconv == "rkeys") {
      let finalamount = toturnin * 2.5;
      userdata.gold -= toturnin;
      userdata.rkeys += finalamount;
      userdata.save();
      interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} rare keys`
      );
    } else if (toconv == "ekeys") {
      let finalamount = toturnin * 0.5;
      userdata.gold -= toturnin;
      userdata.ekeys += finalamount;
      userdata.save();
      interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} exotic keys`
      );
    } else if (toconv == "ubmaps") {
      let finalamount = toturnin * 5;
      userdata.gold -= toturnin;
      userdata.ucmaps += finalamount;
      userdata.save();
      interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} uncommon barn maps`
      );
    } else if (toconv == "rbmaps") {
      let finalamount = toturnin * 2;
      userdata.gold -= toturnin;
      userdata.rmaps += finalamount;
      userdata.save();
      interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} rare barn maps`
      );
    } else if (toconv == "lbmaps") {
      let finalamount = toturnin * 0.2;
      userdata.gold -= toturnin;
      userdata.lmaps += finalamount;
      userdata.save();
      interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} legendary barn maps`
      );
    } else if (toconv == "swspins") {
      let finalamount = toturnin * 1;
      userdata.gold -= toturnin;
      userdata.swheelspins += finalamount;
      userdata.save();
      interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} Super wheelspins`
      );
    }
  },
};
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
