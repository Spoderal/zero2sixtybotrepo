const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const lodash = require("lodash");
const { numberWithCommas } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const Cooldowns = require("../schema/cooldowns");
const ms = require("pretty-ms");
const { EmbedBuilder } = require("discord.js");

const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("Steal cash from another user!")
    .addUserOption((option) =>
      option.setDescription("The user to rob").setName("user").setRequired(true)
    ),

  async execute(interaction) {
    let userid = interaction.user.id;
    let user = interaction.user;
    let usertorob = interaction.options.getUser("user");
    let userdata = await User.findOne({ id: userid });
    let cooldowndata = await Cooldowns.findOne({ id: userid });
    let cooldowndata2 = await Cooldowns.findOne({ id: usertorob.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let user2data = await User.findOne({ id: usertorob.id });

    if (userdata.prestige < 4)
      return interaction.reply(
        `You need to be prestige 4 to steal from others!`
      );
    if (user2data.prestige < 2)
      return interaction.reply(
        `The person you're trying to steal from needs to be prestige 2!`
      );

    let timeout = 7200000;
    if (
      cooldowndata.rob !== null &&
      timeout - (Date.now() - cooldowndata.rob) > 0
    ) {
      let time = ms(timeout - (Date.now() - cooldowndata.rob));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`You need to wait ${time} before robbing again.`);
      await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
      return;
    }

    if (userid == usertorob.id)
      return interaction.reply(`You cant steal from yourself!`);

    if (user2data.canrob == false) {
      let timeout = 604800000;
      let cooldownrob = cooldowndata2.canrob;
      let time = ms(timeout - (Date.now() - cooldownrob));

      if (timeout - (Date.now() - cooldownrob) > 0) {
        return interaction.reply(`This user can't be robbed from for ${time}`);
      }
    }

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

    if (chance <= 50) {
      userdata.using.pull("disguise");
      userdata.save();
      cooldowndata.rob = Date.now();
      cooldowndata.save();
      return interaction.reply(`${fail}`);
    } else if (chance >= 50) {
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
      cooldowndata.rob = Date.now();
      userdata.using.pull("disguise");
      cooldowndata.save();
      userdata.save();
    }
  },
};

function randomRange(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}
