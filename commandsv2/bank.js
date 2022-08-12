const { SlashCommandBuilder } = require("@discordjs/builders");
const { toCurrency } = require("../common/utils");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bank")
    .setDescription("Check your bank, and deposit money")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("deposit")
        .setDescription("Deposit some cash")
        .addNumberOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount you want to deposit")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("withdraw")
        .setDescription("Withdraw some cash")
        .addNumberOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount you want to withdraw")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    let subcommand = interaction.options.getSubcommand();
    let user = interaction.user;
    let userid = user.id;
    let userdata =
      (await User.findOne({ id: userid })) || new User({ id: userid });
    let cash = userdata.cash;
    let bank = userdata.bank;
    let banklimit = userdata.banklimit || 10000;
    let amount = interaction.options.getNumber("amount");

    if (subcommand === "deposit") {
      if (amount > banklimit)
        return await interaction.reply(
          "Your bank doesn't have enough room for that much!"
        );
      if (amount > banklimit - bank)
        return await interaction.reply(
          "Your bank doesn't have enough room for that much!"
        );

      if (amount > cash)
        return await interaction.reply(`You don't have enough cash!`);
      userdata.bank += Number(amount);
      userdata.cash -= Number(amount);
      userdata.save();

      await interaction.reply(`Deposited ${toCurrency(amount)}`);
    } else if (subcommand === "withdraw") {
      if (amount > bank)
        return await interaction.reply(
          "Your bank doesn't have enough cash to withdraw this amount!"
        );
      userdata.cash += Number(amount);
      userdata.bank -= Number(amount);
      userdata.save();
      await interaction.reply(`Withdrawed ${toCurrency(amount)}`);
    }
  },
};
