const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");

const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("referral")
    .setDescription("Enter a referral code, or create one!")
    .addSubcommand((cmd) =>
      cmd
        .setName("create")
        .setDescription("Create a referral code")
        .addStringOption((option) =>
          option.setName("code").setDescription("The code name you want")
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("use")
        .setDescription("Use a referral code")
        .addStringOption((option) =>
          option.setName("code").setDescription("The code you want to use")
        )
    ),
  async execute(interaction) {
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });
    let global = await Global.findOne();
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    if (Date.now() - user.createdAt < 1000 * 60 * 60 * 24 * 10)
      return interaction.reply(
        "Your account needs to be at least 10 days old to use this command!"
      );

    let subcommand = interaction.options.getSubcommand();

    if (subcommand == "create") {
      let code = interaction.options.getString("code");

      let codesdb = global.referrals || [];
      let filteredcode = codesdb.filter((c) => c.code == code);
      let usercheck = codesdb.filter((c) => c.user == user.id);

      if (usercheck[0])
        return interaction.reply(
          `You've already made a code! Your code is **${usercheck[0].code}**`
        );

      if (filteredcode[0])
        return interaction.reply(
          `${code} is already a referral code! Choose another name for your code!`
        );

      let codeobj = {
        user: user.id,
        code: code,
      };

      global.referrals.push(codeobj);

      global.save();
      interaction.reply(
        "Created! Share it with your friends and they can use /referral use"
      );
    } else if (subcommand == "use") {
      let code = interaction.options.getString("code");

      let codesdb = global.referrals || [];
      let filteredcode = codesdb.filter((c) => c.code == code);
      if (!filteredcode[0]) return interaction.reply(`${code} is not a code!`);
      if (userdata.codes.includes(code))
        return interaction.reply("You've already used this code!");
      if (userdata.code == true)
        return interaction.reply("You've already used a referral code!");

      if (filteredcode[0].user == user.id)
        return interaction.reply("You can't use your own code!");

      interaction.reply(
        "Used referral code and earned $10K Cash! The user who made the code has also earned $10K"
      );

      userdata.cash += 10000;
      userdata.code = true;
      let userdata2 = await User.findOne({ id: filteredcode[0].user });
      userdata2.cash += 10000;
      userdata2.save();

      userdata.save();
    }
  },
};
