

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
          { name: "Barn Maps", value: "barnmaps" },
          { name: "Notoriety", value: "notoriety" },
          { name: "Super Wheel Spins", value: "swspins" },
          { name: "T5 Voucher", value: "t5vouch" },
          { name: "Series Tickets", value: "stickets" }
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
    if (isNaN(toturnin)) return await interaction.reply("Specify a valid number!");
    if (toturnin < 0) return await interaction.reply("Specify a valid number!");
    
    toturnin = Math.floor(toturnin)

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
    } else if (toconv == "notoriety") {
      let finalamount = toturnin * 100;
      userdata.gold -= toturnin;
      userdata.notoriety += finalamount;
      userdata.save();
      await interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} notoriety`
      );
    } else if (toconv == "ekeys") {
      let finalamount = toturnin * 0.5;
      if(finalamount < 1) return interaction.reply(`You don't have enough gold to make 1 exotic key! You need at least 2 gold`)

      userdata.gold -= toturnin;
      userdata.ekeys += finalamount;
      userdata.save();
      await interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} exotic keys`
      );
    } else if (toconv == "barnmaps") {
      let finalamount = toturnin * 0.5;
      if(finalamount < 1) return interaction.reply(`You don't have enough gold to make 1 barn map! You need at least 2 gold`)

      userdata.gold -= toturnin;
      userdata.barnmaps += finalamount;
      userdata.save();
      await interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} barn maps`
      );
    }  
    else if (toconv == "t5vouch") {
      let finalamount = toturnin * 0.5;
      if(finalamount < 1) return interaction.reply(`You don't have enough gold to make 1 t5voucher! You need at least 2 gold`)
      userdata.gold -= toturnin;
      userdata.t5vouchers += finalamount;
      userdata.save();
      await interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} t5 vouchers`
      );
    }
    
    else if (toconv == "stickets") {
      let finalamount = toturnin * 0.5;
      if(finalamount < 1) return interaction.reply(`You don't have enough gold to make 1 series ticket! You need at least 2 gold`)
      userdata.gold -= toturnin;
      userdata.seriestickets += finalamount;
      userdata.save();
      await interaction.reply(
        `Converted ${toturnin} gold into ${finalamount} series tickets`
      );
      }
    else if (toconv == "swspins") {
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
