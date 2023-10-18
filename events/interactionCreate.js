const { updatePetOnCommands } = require("./pets/updatePetOnCommands");
const Cooldowns = require("../schema/cooldowns");

const { InteractionType } = require("discord.js");

//test
//test
module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    let command;

    let timeout2 = 5000;
    try {
      if (interaction.isSelectMenu()) {
        await interaction.deferUpdate();
      }
      if (interaction.isChatInputCommand()) {
        command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        // Command

        let cooldowndata =
          (await Cooldowns.findOne({ id: interaction.user.id })) ||
          new Cooldowns({ id: interaction.user.id });

        try {
          let timeout = 3000;
          let commandran = cooldowndata.command_ran;
          if (commandran !== null && timeout - (Date.now() - commandran) > 0) {
            await interaction.reply({
              content: "Wait 3 seconds before running another command!",
              fetchReply: true,
              ephemeral: true,
            });
          } else if (
            cooldowndata.is_racing !== null &&
            timeout2 - (Date.now() - cooldowndata.is_racing) > 0
          ) {
            cooldowndata.command_ran = Date.now();
            return await interaction.reply({
              content: `Wait for your race to finish to run other commands`,
              fetchReply: true,
              ephemeral: true,
            });
          } else {
            // await updateCrew(interaction);
            // if (userdata) {
            //   if (Number.isInteger(userdata.cash) == false) {
            //     let bal1 = userdata.cash;
            //     console.log(bal1);
            //     let bal = Math.trunc(bal1);
            //     console.log("bal fixed");
            //     console.log(bal);
            //     userdata.cash = bal;
            //     userdata.save();
            //   }
            // }
            await command.execute(interaction);
          }
        } catch (err) {
          console.log(err);
        }

        cooldowndata.save();
        // Pets

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
