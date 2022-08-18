const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const lodash = require("lodash");
const { numberWithCommas } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("steal")
    .setDescription("Steal cash from another user!")
    .addUserOption((option) =>
      option.setDescription("The user to rob").setName("user").setRequired(true)
    ),

  async execute(interaction) {
    let userid = interaction.user.id;
    let user = interaction.user;
    let usertorob = interaction.options.getUser("user");
    let userdata = await User.findOne({ id: userid });
    let user2data = await User.findOne({ id: usertorob.id });

    if (userdata.prestige < 4)
      return interaction.reply(
        `You need to be prestige 4 to steal from others!`
      );
    if (user2data.prestige < 2)
      return interaction.reply(
        `The person you're trying to steal from needs to be prestige 2!`
      );

    if (userid == usertorob.id)
      return interaction.reply(`You cant steal from yourself!`);

    let cash = user2data.cash;

    if (cash < 1000)
      return interaction.reply(
        `This user doesn't have a lot of cash, stealing from them wouldn't be worth it.`
      );

    if (!userdata.using.includes("disguise"))
      return interaction.reply(
        `You need a disguise to steal from other players!`
      );

    let chance = lodash.random(100);
    let fails = [
      `${user}, you failed to steal from ${usertorob.username}`,
      `${usertorob}, ${user} just tried to steal from you but failed!`,
    ];
    let successs = [
      `${user}, you stole from ${usertorob.username}`,
      `${usertorob}, ${user} just tried to steal from you and succeeded!`,
    ];

    let fail = lodash.sample(fails);
    let successe = lodash.sample(successs);

    if (chance < 50) {
      userdata.using.pull("disguise");
      userdata.save();
      return interaction.reply(`${fail}`);
    }
    if (chance > 50) {
      let newcash;
      if (cash <= 10000) {
        newcash = 10000;
      } else if (cash <= 100000) {
        newcash = 50000;
      } else if (cash >= 100000) {
        newcash = 100000;
      } else if (cash >= 500000) {
        newcash = 500000;
      } else if (cash >= 1000000) {
        newcash = 1000000;
      }
      let randcash = randomRange(1, newcash);

      interaction.reply(
        `${successe}\nGot away with $${numberWithCommas(randcash)}`
      );
      userdata.using.pull("disguise");
      userdata.save();
    }
  },
};

function randomRange(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}
