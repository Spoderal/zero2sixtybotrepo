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

    if (userdata) return await interaction.reply("You have an account!");

    let embed = new discord.EmbedBuilder({
      title: "You've started your journey!",
      color: 3447003,
      thumbnail: { url: "https://i.ibb.co/5n1ts36/newlogoshadow.png" },
      description:
        "Check out the getting started tutorial on YouTube, Run `/dealer` to buy your first car, and go race with it!\n\nAny Questions? Join our [community server](https://discord.gg/bHwqpxJnJk)!\n\nHave fun!\n[YouTube tutorial on Zero2Sixty](https://www.youtube.com/watch?v=HA5lm8UImWo&ab_channel=Zero2Sixty)",
    });
    await interaction.reply({
      content: `Starting the tutorial, run \`/dealer\` to find and pick your first car! Click the **D Class** button from the menu below the message it sends to view the cars.`,
      embeds: [embed],
    });
    await interaction.channel.send("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDg4Mjk2ZTY2ZDkwNDRlZWEyY2U4Mzk4ODQ2YmNmZjJmYzg5Zjk5OSZjdD1n/OfB8WvjTmlILKTs7to/giphy.gif")

    let newuser = await new User({ id: interaction.user.id });
    newuser.tutorial = {
      started: true,
      finished: false,
      stage: 1,
    };
    newuser.cash += 500;
    newuser.save();
  },
};
