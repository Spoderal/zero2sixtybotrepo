const codes = require("../data/codes.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const { toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("code")
    .setDescription("Redeem a code")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code to redeem")
        .setRequired(true)
    ),
  async execute(interaction) {
    let code = interaction.options.getString("code");
    let uid = interaction.user.id;
    if (!code)
      return interaction.reply({
        content:
          "Specify a code to redeem! You can find codes in the Discord server, or on the Twitter page!",
        ephemeral: true,
      });
    let userdata = (await User.findOne({ id: uid })) || new User({ id: uid });

    let codesredeemed = userdata.codes;

    if (codes.Twitter[code]) {
      if (codesredeemed.includes(code))
        return interaction.reply("You've already redeemed this code!");

      interaction.reply(
        `Redeemed code ${code} and earned ${toCurrency(
          codes.Twitter[code].Reward
        )}`
      );
      userdata.cash += Number(codes.Twitter[code].Reward);

      codesredeemed.push(code);
      userdata.save();
    } else if (codes.Discord[code]) {
      if (codesredeemed.includes(code))
        return interaction.reply("You've already redeemed this code!");

      interaction.reply(
        `Redeemed code ${code} and earned ${toCurrency(
          codes.Discord[code].Reward
        )}`
      );
      userdata.cash += Number(codes.Discord[code].Reward);

      codesredeemed.push(code);
      userdata.save();
    } else if (codes.Patreon[code]) {
      let patreontier = userdata.patron;

      if (!patreontier)
        return interaction.reply(
          "You need to purchase a patreon tier to redeem this code!"
        );

      if (codesredeemed.includes(code))
        return interaction.reply("You've already redeemed this code!");

      if (codes.Patreon[code].Gold) {
        interaction.reply(
          `Redeemed code ${code} and earned ${toCurrency(
            codes.Patreon[code].Reward
          )} gold`
        );
        userdata.gold += Number(codes.Patreon[code].Reward);
      } else {
        interaction.reply(
          `Redeemed code ${code} and earned ${toCurrency(
            codes.Patreon[code].Reward
          )}`
        );
        userdata.cash += Number(codes.Patreon[code].Reward);
      }

      codesredeemed.push(code);
      userdata.save();
    } else {
      interaction.reply({
        content: "Thats not a valid code!",
        ephemeral: true,
      });
    }
  },
};
