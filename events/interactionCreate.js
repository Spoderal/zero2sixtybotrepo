const { createBugCard } = require("../services/trello");
const { updatePetOnCommands } = require("./pets/updatePetOnCommands");
const { updateCrew } = require("./crews/updateCrew");
const Cooldowns = require("../schema/cooldowns")

const {
  blacklistInteractionCheck,
  userGetFromInteraction,
} = require("../common/user");
const { InteractionType } = require("discord.js");

//test
//test
module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    let command;
    let options = interaction.options;
    let user = interaction.user;
    let guild = interaction.guild;
    let client = interaction.client;

    try {
      if (interaction.isSelectMenu()) {
        await interaction.deferUpdate();
      }
      if (interaction.isChatInputCommand()) {
        command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        // Command
        const commandExecutionTimeName = `Command ${interaction.commandName} execution time`;

        let cooldowndata = await Cooldowns.findOne({id: interaction.user.id}) || new Cooldowns({id: interaction.user.id})
        try {

          let timeout = 3000
          let commandran = cooldowndata.command_ran
          if (commandran !== null && timeout - (Date.now() - commandran) > 0) {
            
            await interaction.reply({ content: 'Wait 3 seconds before running another command!', fetchReply: true, ephemeral: true });
          } else {
         
          
            cooldowndata.command_ran = Date.now()
            await command.execute(interaction);
          }
        } catch (err) {
          console.log(err);
        }
        
        cooldowndata.save()
        // Pets
        const petExecutionTimeName = "Pet update time";
        
      
        await updatePetOnCommands(interaction);
      } else if (
        interaction.type == InteractionType.ApplicationCommandAutocomplete
      ) {
        command = interaction.client.commands.get(interaction.commandName);
        // try {
        //   command.autocomplete(interaction, client);
        // } catch (err) {
        //   console.log(err);
        // }
      }
    } catch (error) {
      if (error) {
        console.log({ interactionCreateExecuteError: error });
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
