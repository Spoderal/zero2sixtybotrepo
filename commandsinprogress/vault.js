// const Discord = require("discord.js");
// const { SlashCommandBuilder } = require("@discordjs/builders");
// const User = require("../schema/profile-schema");
// const colors = require("../common/colors");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("vault")
//     .setDescription("View your vault")
//     .addSubcommand((cmd) => cmd
//     .setDescription("View your vault")
//     .setName("view")
    
//     )
//     .addSubcommand((cmd) => cmd
//     .setDescription("Set some settings for your vault")
//     .setName("settings")
//     .addStringOption(``)
    
//     ),
//   async execute(interaction) {
//     let uid = interaction.user.id;
//     let userdata = (await User.findOne({ id: uid })) || new User({ id: uid });
    
//     let vault = userdata.vault

//     if(!vault || vault == null || vault == [] || vault.length == 0){
//         return interaction.reply(`You don't have any vaulted cars! Try obtaining some cars first and they'll appear here!`)
//     }

//   },
// };
