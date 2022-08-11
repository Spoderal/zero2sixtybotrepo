const { updatePetOnCommands } = require("./pets/updatePetOnCommands");

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    if (interaction.isSelectMenu()) {
      await interaction.deferUpdate();
    }
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        // Command
        const commandExecutionTimeName = `Command ${interaction.commandName} execution time`;
        console.time(commandExecutionTimeName);
        await command.execute(interaction);
        console.endTime(commandExecutionTimeName);

        // Pets
        const petExecutionTimeName = "Pet update time";
        console.time(petExecutionTimeName);
        await updatePetOnCommands(interaction);
        console.time(petExecutionTimeName);
      } catch (err) {
        if (err) console.error({ interactionCreateExecuteError: err });
        try {
          await interaction.reply({
            content:
              "An error occurred, please contact our support team with the details.",
            ephemeral: true,
            fetchReply: true,
          });
        } catch (err) {
          await interaction.channel.send({
            content:
              "An error occurred, please contact our support team with the details.",
            fetchReply: true,
          });
        }
      }
    }
  },
};
