
const Cooldowns = require("../schema/cooldowns");
const {series} = require("./series")

const { InteractionType } = require("discord.js");
const { updateCrew } = require("./crews/updateCrew");
const { patreon } = require("./patreon");
const User = require("../schema/profile-schema");
const { PermissionsBitField } = require('discord.js');

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
    let timeout2 = 5000;


    try {
      if (interaction.isStringSelectMenu()) {
        await interaction.deferUpdate();
      }
      if (interaction.isButton()) {
        await interaction.deferUpdate();
      }
      if (interaction.isChatInputCommand()) {
        command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        // Command

        let cooldowndata =
          (await Cooldowns.findOne({ id: interaction.user.id })) ||
          new Cooldowns({ id: interaction.user.id });
        let userdata = await User.findOne({ id: interaction.user.id });

        try {
          if (userdata) {
            let zpasstimer = userdata.zpasstimer;
            let timeoutmonth = 2629746000;
            if (zpasstimer !== null && timeoutmonth - (Date.now() - zpasstimer) > 0) {

              userdata.zpass = false
              userdata.save()
            }
          }
        }
        catch (err){
          console.log(err)
        }

        try {
          console.log("updating")
          updateCrew(interaction)
        }
        catch (err){
          return console.log("err")
        }

        try {
          let timeout = 1000;
          let commandran = cooldowndata.command_ran;
          if (commandran !== null && timeout - (Date.now() - commandran) > 0) {
            await interaction.reply({
              content: "Wait 1 second before running another command!",
              fetchReply: true,
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
          }
          
        
          else {
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

            cooldowndata.command_ran = Date.now();
            await cooldowndata.save()
            try {
              let permissions = interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)
              let permissions2 = interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)


              if(!permissions) return interaction.reply("I need the manage messages permission to run commands, it'll allow me to edit my own messages and delete them when needed.")
              if(!permissions2) return 

              await command.execute(interaction);
            }
            catch(err){
              try {
                console.log(err)

                await interaction.reply({
                  content:
                    "An error occurred, please contact our support team with the details.",
                  ephemeral: true,
                  fetchReply: true,
                });

              }
              catch(err){
                console.log(err)
                await interaction.channel.send({
                  content:
                    "An error occurred, please contact our support team with the details.",
                  fetchReply: true,
                });
              
              }
            }
            series(interaction)
            patreon(interaction, interaction.client)
          }
        } catch (err) {
          console.log(err);
        }

        cooldowndata.save();
        // Pets


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
