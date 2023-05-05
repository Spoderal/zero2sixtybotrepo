const { createBugCard } = require("../services/trello");
const { updatePetOnCommands } = require("./pets/updatePetOnCommands");
const { updateCrew } = require("./crews/updateCrew");

const {
  blacklistInteractionCheck,
  userGetFromInteraction,
} = require("../common/user");
const {InteractionType} = require("discord.js")

const { dailyCheck } = require("./daily");

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    let command;
    let options = interaction.options;
    let user = interaction.user;
    let guild = interaction.guild;
    let client = interaction.client

    try {
      if (interaction.isSelectMenu()) {
        await interaction.deferUpdate();
      }
      if (interaction.isChatInputCommand()) {
        command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        // Command
        const commandExecutionTimeName = `Command ${interaction.commandName} execution time`;

        await command.execute(interaction);

        // Pets
        const petExecutionTimeName = "Pet update time";

        await updatePetOnCommands(interaction);
        await updateCrew(interaction);
        await dailyCheck(interaction);
      }

      else if(interaction.type == InteractionType.ApplicationCommandAutocomplete) {
        command = interaction.client.commands.get(interaction.commandName);
        try {
          command.autocomplete(interaction, client)
        } catch (err){
          console.log(err)
        }
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
