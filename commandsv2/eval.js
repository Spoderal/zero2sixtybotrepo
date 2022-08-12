const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("BOT OWNER ONLY")
    .addStringOption((option) =>
      option.setName("command").setDescription("The command").setRequired(true)
    ),
  async execute(interaction) {
    if (
      interaction.user.id !== "937967206652837928" &&
      interaction.user.id !== "890390158241853470" &&
      interaction.user.id !== "670895157016657920"
    ) {
      await interaction.reply({
        content: "You dont have permission to use this command!",
        ephemeral: true,
      });
      return;
    } else {
      let command = interaction.options.getString("command");
      eval(command);

      await interaction.reply(`CMD: ${command}`);
    }
  },
};
