const { createBugCard } = require("../services/trello");
const { updatePetOnCommands } = require("./pets/updatePetOnCommands");
const { updateCrew } = require("./crews/updateCrew");
const {
  blacklistInteractionCheck,
  userGetFromInteraction,
} = require("../common/user");

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    let command;
    let options = interaction.options;
    let user = interaction.user;
    let guild = interaction.guild;

    try {
      if (interaction.isSelectMenu()) {
        await interaction.deferUpdate();
      }
      if (interaction.isChatInputCommand()) {
        command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        // Command
        const commandExecutionTimeName = `Command ${interaction.commandName} execution time`;
        console.time(commandExecutionTimeName);
        const userdata = userGetFromInteraction(interaction);
        let blacklist = await blacklistInteractionCheck(userdata, interaction);
        if (blacklist == 1) {
          console.log("A blacklisted user tried to use the bot!");
        } else {
          await command.execute(interaction);
          console.timeEnd(commandExecutionTimeName);
        }

        // Pets
        const petExecutionTimeName = "Pet update time";
        console.time(petExecutionTimeName);
        await updatePetOnCommands(interaction);
        await updateCrew(interaction);
        console.timeEnd(petExecutionTimeName);
      }
    } catch (error) {
      if (error) {
        console.error({ interactionCreateExecuteError: error });
        createBugCard({
          error,
          event: "interactionCreate",
          command,
          options,
          user,
          guild,
        });
      }
      try {
        await interaction.reply({
          content:
            "An error occurred, please contact our support team with the details.",
          ephemeral: true,
          fetchReply: true,
        });
      } catch (error) {
        await interaction.channel.send({
          content:
            "An error occurred, please contact our support team with the details.",
          fetchReply: true,
        });
      }
    }
  },
};
