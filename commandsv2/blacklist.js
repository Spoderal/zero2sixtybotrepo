const { SlashCommandBuilder } = require("@discordjs/builders");
const {  userGetFromInteraction, blacklistCheck } = require("../common/user");
const { EmbedBuilder } = require('discord.js');
const colors = require("../common/colors");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("BOT OWNER ONLY")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Add, Remove, or check reason!")
        .setRequired(true)
        .addChoices(
          { name: "Add", value: "add" },
          { name: "Remove", value: "del" },
          { name: "View", value: "view" }, 
        )
    )

    .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user id to check")
      .setRequired(false)
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
      const user = userGetFromInteraction(interaction);
      let option = interaction.options.getString("option");
      if(option == "add"){
        await interaction.reply("Adding soon!")
      }
      if(option == "del"){
        await interaction.reply("Adding soon!")
      }
      if(option == "view"){
        let blacklist = await blacklistCheck(user)
        if (blacklist["blacklist"] == 0){
          await interaction.reply("The user is not blacklisted!")
        }
        else{
          const blacklistEmbed = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle(`${user.username}#${user.discriminator} is __**blacklisted**__`)
          .addFields(
            { name: 'Reason:', value: blacklist["reason"] },
            { name: 'Staff', value: blacklist["staff"]},
          )
          .setTimestamp()
          .setFooter({ text: 'Zero2Sixty', iconURL: 'https://cdn.discordapp.com/avatars/932455367777067079/4f3488204b720ae817770ed61ab6226a.png?size=4096' });
        
        await interaction.reply({ embeds: [blacklistEmbed] });
        }
      }

    }
  },
};
