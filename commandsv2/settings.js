const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const prestiges = require("../data/prestige.json");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("View configurable settings"),
  async execute(interaction) {
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let dailyenabled = userdata.settings.daily
    let tipsenabled = userdata.settings.tips
    let kmhormph = userdata.settings.ph

    let voteenabled = userdata.settings.vote
    let demote = "❌"
    let vemote = "❌"
    let temote = "❌"

    if(dailyenabled == true){
        demote = "✅"
    }
    if(voteenabled == true){
        vemote = "✅"
    }
    if(tipsenabled == true){
        temote = "✅"
    }

    let embed = new Discord.EmbedBuilder()
    .setTitle(`Settings for ${user.username}`)
    .addFields(
        {name: "Daily Reward Reminder", value: `${demote}`},
        {name: "Top.gg Vote Reminder", value: `${vemote}`},
        {name: "Tips", value: `${temote}`},
        {name: "Unit", value: `${kmhormph}`}
    )
    .setColor(colors.blue)

    let row = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
        .setCustomId("daily")
        .setLabel("Enable Daily Reminders")
        .setStyle("Success"),
        new Discord.ButtonBuilder()
        .setCustomId("top")
        .setLabel("Enable Vote Reminders")
        .setStyle("Success"),
        new Discord.ButtonBuilder()
        .setCustomId("tips")
        .setLabel("Enable Tips")
        .setStyle("Success"),
        new Discord.ButtonBuilder()
        .setCustomId("kmh")
        .setLabel("Set to KMH")
        .setStyle("Success")
    )

    if(voteenabled == true){
        row.components[1].setStyle("Danger")
        row.components[1].setLabel("Disable Vote Reminders")
    }
    if(dailyenabled == true){
        row.components[0].setStyle("Danger")
        row.components[0].setLabel("Disable Daily Reward Reminders")
    }
    if(tipsenabled == true){
        row.components[2].setStyle("Danger")
        row.components[2].setLabel("Disable Tips")
    }
    if(kmhormph == "KMH"){
        row.components[3].setStyle("Danger")
        row.components[3].setLabel("Set to MPH")
    }

   let msg = await interaction.reply({embeds: [embed], components: [row], fetchReply: true})

    

    let filter2 = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };
      let collector = msg.createMessageComponentCollector({
        filter: filter2,
      });

      collector.on("collect", async (i) => {
        if(i.customId.includes("daily")){
            if(userdata.settings.daily == true){
                userdata.settings.daily = false
                row.components[0].setStyle("Success")
                row.components[0].setLabel("Enable Daily Reward Reminders")
            }
            else if(userdata.settings.daily == false){
                userdata.settings.daily = true
                row.components[0].setStyle("Danger")
                row.components[0].setLabel("Disable Daily Reward Reminders")

            }
            userdata.markModified("settings")
            userdata.save()
            if(userdata.settings.daily == true){
                demote = "✅"
            }
            else {
                demote = "❌"
            }
           
             embed = new Discord.EmbedBuilder()
            .setTitle(`Settings for ${user.username}`)
            .addFields(
                {name: "Daily Reward Reminder", value: `${demote}`},
                {name: "Top.gg Vote Reminder", value: `${vemote}`},
                {name: "Tips", value: `${temote}`}
            )
            .setColor(colors.blue)
            await  i.update({embeds: [embed], components: [row], fetchReply: true})
        } 
        else if(i.customId.includes("top")){
            if(userdata.settings.vote == true){
                userdata.settings.vote = false
                row.components[1].setStyle("Success")
                row.components[1].setLabel("Enable Vote Reminders")
            }
            else if(userdata.settings.vote == false){
                userdata.settings.vote = true
                row.components[1].setStyle("Danger")
                row.components[1].setLabel("Disable Vote Reminders")

            }
            userdata.markModified("settings")
            userdata.save()
            if(userdata.settings.vote == true){
                vemote = "✅"
            }
            else {
                vemote = "❌"
            }
           
             embed = new Discord.EmbedBuilder()
            .setTitle(`Settings for ${user.username}`)
            .addFields(
                {name: "Daily Reward Reminder", value: `${demote}`},
                {name: "Top.gg Vote Reminder", value: `${vemote}`},
                {name: "Tips", value: `${temote}`}
            )
            .setColor(colors.blue)
            await  i.update({embeds: [embed], components: [row], fetchReply: true})
        }
        else if(i.customId.includes("tips")){
            if(userdata.settings.tips == true){
                userdata.settings.tips = false
                row.components[2].setStyle("Success")
                row.components[2].setLabel("Enable Tips")
            }
            else if(userdata.settings.tips == false){
                userdata.settings.tips = true
                row.components[2].setStyle("Danger")
                row.components[2].setLabel("Disable Tips")

            }
            userdata.markModified("settings")
            userdata.save()
            if(userdata.settings.tips == true){
                temote = "✅"
            }
            else {
                temote = "❌"
            }
           
             embed = new Discord.EmbedBuilder()
            .setTitle(`Settings for ${user.username}`)
            .addFields(
                {name: "Daily Reward Reminder", value: `${demote}`},
                {name: "Top.gg Vote Reminder", value: `${vemote}`},
                {name: "Tips", value: `${temote}`}
            )
            .setColor(colors.blue)
            await  i.update({embeds: [embed], components: [row], fetchReply: true})
        }
        else if(i.customId.includes("kmh")){
            if(userdata.settings.ph == "MPH"){
                userdata.settings.ph = "KMH"
                row.components[3].setStyle("Danger")
                row.components[3].setLabel("Set to MPH")
            }
            else if(userdata.settings.ph == "KMH"){
                userdata.settings.ph = "MPH"
                row.components[3].setStyle("Success")
                row.components[3].setLabel("Set to KMH")

            }
            userdata.markModified("settings")
            userdata.save()
   
            kmhormph = userdata.settings.ph
             embed = new Discord.EmbedBuilder()
            .setTitle(`Settings for ${user.username}`)
            .addFields(
                {name: "Daily Reward Reminder", value: `${demote}`},
                {name: "Top.gg Vote Reminder", value: `${vemote}`},
                {name: "Tips", value: `${temote}`},
                {name: "Unit", value: `${kmhormph}`}
            )
            .setColor(colors.blue)
            await  i.update({embeds: [embed], components: [row], fetchReply: true})
        }
      })

  },
};
