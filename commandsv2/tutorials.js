const { SlashCommandBuilder } = require("@discordjs/builders");
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const cardb = require("../data/cardb.json");
const colors = require("../common/colors");
const lodash = require("lodash");
const { emotes } = require("../common/emotes");
const tutorials = require("../data/tutorials.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tutorial")
    .setDescription("View some tutorials to help you get a sense of the bot"),
  async execute(interaction) {
    let userid = interaction.user.id;
    let userdata = await User.findOne({ id: userid });

    let tutorialstarter = userdata.tutorial.type && userdata.tutorial.type == "starter" ? true : false;
    let tutorialrestore = userdata.tutorial.type && userdata.tutorial.type == "restore" ? true : false;
    let tutoriaseason = userdata.tutorial.type && userdata.tutorial.type == "season" ? true : false;

    let stage
    if(tutorialstarter){
      let stagein = userdata.tutorial.stage
      stage = tutorials.starter.stages.find((stage) => stage.number == stagein)
    }
    let stage2
    if(tutorialrestore){
      let stagein = userdata.tutorial.stage
      stage2 = tutorials.restore.stages.find((stage) => stage.number == stagein)
    }

    let stage3
    if(tutoriaseason){
      console.log("season")
      let stagein = userdata.tutorial.stage
      stage3 = tutorials.season.stages.find((stage) => stage.number == stagein)
    }

    let embed = new EmbedBuilder()
      .setColor(colors.blue)
      .setTitle("Tutorials")
      .setDescription("Here are some tutorials to help you get started with the bot")
     

      if(stage !== undefined){
        embed.addFields(
          {
            name: "Starter",
            value: `Learn the basics\nReward: $2.5K, T1Exhaust\nStage: ${stage.number}\nTask: ${stage.task}`,
  
          }
        )

      }
      else if(stage == undefined){
        embed.addFields(
          {
            name: "Starter",
            value: `Learn the basics\nReward: $2.5K, T1Exhaust`,
  
          }
        )
        }

        if(stage2 !== undefined){
          embed.addFields(
            {
              name: "Barn Finds",
              value: `Learn how to restore barn finds\nReward: whatever barn car you find, $5K\nStage: ${stage2.number}\nTask: ${stage2.task}`,
    
            }
          )
  
        }
        else if(stage2 == undefined){
          embed.addFields(
            {
              name: "Barn Finds",
              value: `Learn how to restore barn finds\nReward: whatever barn car you find, $5K`,
    
            }
          )
          }
          console.log(stage3)
          if(stage3 !== undefined){
            embed.addFields(
              {
                name: "Season",
                value: `Learn about the season events\nReward: 5K Notoriety\nStage: ${stage3.number}\nTask: ${stage3.task}`,
      
              }
            )
    
          }
          else if(stage3 == undefined){
            embed.addFields(
              {
                name: "Season",
                value: `Learn about the season events\nReward: 5K Notoriety`,
              }
            )
            }
        
      let row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("tutorial_starter")
            .setLabel("Starter")
            .setStyle("Primary"),
            new ButtonBuilder()
            .setCustomId("tutorial_restore")
            .setLabel("Barn Finds")
            .setStyle("Primary"),
            new ButtonBuilder()
            .setCustomId("tutorial_season")
            .setLabel("Season")
            .setStyle("Primary")
        );

      let msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    let filter = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };
      let collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 60000,
      });

    collector.on("collect", async (i) => {
        if(i.customId == "tutorial_starter"){
            if( userdata.tutorial.started == true) return interaction.editReply("You've already started a tutorial!")
            if (userdata.tutorial.startfinished && userdata.tutorial.startfinished == true) return interaction.editReply("You've already finished this tutorial!")
            userdata.tutorial = {
                started: true,
                startfinished: false,
                type: "starter",
                stage: 1,
              };
              userdata.save()

              interaction.editReply(`Starting the tutorial... Run \`/garage\` to start!`)
        }
      else  if(i.customId == "tutorial_restore"){
            if(userdata.tutorial.started == true) return interaction.editReply("You've already started a tutorial!")
            if (userdata.tutorial.restorefinished && userdata.tutorial.restorefinished == true) return interaction.editReply("You've already finished this tutorial!")

            userdata.tutorial = {
                started: true,
                restorefinished: false,
                type: "restore",
                stage: 1,
              };
              userdata.barnmaps += 1
              userdata.save()

              interaction.editReply(`Starting the restoration tutorial... Run \`/barn\` to start! I've given you a free barn map, see what you can find!`)
        }
        else  if(i.customId == "tutorial_season"){
          if(userdata.tutorial.started == true) return interaction.editReply("You've already started a tutorial!")
          if (userdata.tutorial.seasonfinished && userdata.tutorial.seasonfinished == true) return interaction.editReply("You've already finished this tutorial!")

          userdata.tutorial = {
              started: true,
              seasonfinished: false,
              type: "season",
              stage: 1,
            };
            userdata.save()

            interaction.editReply(`Starting the season tutorial... Run \`/events\` to start!`)
      }

    })
    },
  };
