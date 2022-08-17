const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("customtrack")
    .setDescription("View the default stats of a car or part")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("race")
        .setDescription("Race on a custom track")
        .addStringOption((option) =>
          option
            .setName("track")
            .setDescription("The track ID to race on")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription(
          "Create a custom track, with length, weather, and more!"
        )
        .addStringOption((option) =>
          option
            .setName("weather")
            .setDescription("The track weather")
            .setRequired(true)
        )
    ),

  // eslint-disable-next-line no-unused-vars
  async execute(interaction) {
    // let subcommandfetch = interaction.options.getSubcommand();
    // if (subcommandfetch == "create") {
    //   let weathers = ["sunny", "clear", "raining", "snowing"];
    //   let times = ["morning", "evening", "night"];
    // }
  },
};