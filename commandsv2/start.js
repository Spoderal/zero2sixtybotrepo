const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Begin your racing career"),
  async execute(interaction) {
    let userid = interaction.user.id;
    let userdata = await User.findOne({ id: userid });

    if (userdata) return interaction.reply("You have an account!");

    let embed = new discord.EmbedBuilder({
      title: "You've started your journey!",
      color: 3447003,
      thumbnail: { url: "https://i.ibb.co/5n1ts36/newlogoshadow.png" },
      description:
        "Check out the getting started tutorial on YouTube, Run `/dealer` to buy your first car, and go race with it!\n\nAny Questions? Join our [community server](https://discord.gg/bHwqpxJnJk)!\n\nHave fun!\n[YouTube tutorial on Zero2Sixty](https://www.youtube.com/watch?v=HA5lm8UImWo&ab_channel=Zero2Sixty)",
    });
    interaction.reply({ embeds: [embed] });

    let newuser = await new User({ id: interaction.user.id });
    newuser.cash += 500;
    newuser.save();
  },
};
