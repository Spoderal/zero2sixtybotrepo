const { SlashCommandBuilder } = require("@discordjs/builders");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const { toCurrency } = require("../common/utils");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exchange")
    .setDescription("Exchange gold for keys, maps, and more!")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item to exchange gold for")
        .addChoices(
          { name: "Cash", value: "cash" },
          { name: "Rare Keys", value: "rkeys" },
          { name: "Exotic Keys", value: "ekeys" },
          { name: "Uncommon Barn Maps", value: "ubmaps" },
          { name: "Rare Barn Maps", value: "rbmaps" },
          { name: "Legendary Barn Maps", value: "lbmaps" },
          { name: "Super Wheel Spins", value: "swspins" }
        )
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
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let gold = userdata.gold;

    if (!toturnin)
      return await interaction.reply(
        "Specify how much gold you'd like to exchange!"
      );
    if (isNaN(toturnin)) return await interaction.reply("Specify a number!");
    if (toturnin > gold)
      return await interaction.reply("You don't have enough gold!");
    if (toconv == "cash") {
      let finalamount = toturnin * 10000;
      userdata.gold -= toturnin;
      userdata.cash += finalamount;
      userdata.save();

      await interaction.reply(
        `Converted ${toturnin} gold into ${toCurrency(finalamount)}`
      );
    } else if (toconv == "rkeys") {
      let finalamount = toturnin * 2.5;
      userdata.gold -= toturnin;
      userdata.rkeys += finalamount;
      userdata.save();
      await interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} rare keys`
      );
    } else if (toconv == "ekeys") {
      let finalamount = toturnin * 0.5;
      userdata.gold -= toturnin;
      userdata.ekeys += finalamount;
      userdata.save();
      await interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} exotic keys`
      );
    } else if (toconv == "ubmaps") {
      let finalamount = toturnin * 5;
      userdata.gold -= toturnin;
      userdata.ucmaps += finalamount;
      userdata.save();
      await interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} uncommon barn maps`
      );
    } else if (toconv == "rbmaps") {
      let finalamount = toturnin * 2;
      userdata.gold -= toturnin;
      userdata.rmaps += finalamount;
      userdata.save();
      await interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} rare barn maps`
      );
    } else if (toconv == "lbmaps") {
      let finalamount = toturnin * 0.2;
      userdata.gold -= toturnin;
      userdata.lmaps += finalamount;
      userdata.save();
      await interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} legendary barn maps`
      );
    } else if (toconv == "swspins") {
      let finalamount = toturnin * 1;
      userdata.gold -= toturnin;
      userdata.swheelspins += finalamount;
      userdata.save();
      await interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} Super wheelspins`
      );
    }
  },
};
