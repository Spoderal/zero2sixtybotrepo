const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("privacypolicy")
    .setDescription("Check the privacy policy of the bot"),

  async execute(interaction) {
    let embed = new discord.MessageEmbed()
      .setTitle("Privacy Policy")
      .setDescription(
        `By using the Discord bot Zero2Sixty, you agree to the following.
    
        Information stored
        
        • Your user id is stored if you decide to create an account, and use the features, your user id may be stored multiple times depending on what features you decide to use.
        • Your user tag is stored if you decide to use the "crews" feature on the bot.
        
        Why your information is stored and how we use it
        
        • Your user id is used for displaying your cars, money, and other features on the bot that can not work properly without your user id.
        • Your user tag is used for displaying the crew owner of the crew specified.
        
        Who gets this data
        
        No one besides the administrators of Zero2Sixty has access to your stored information. They may only see information that will be displayed when you use the commands.
        
        Questions
        
        If you have any questions, please contact us via email at zero2sixtybot@gmail.com
        How to remove your data
        
        If you would like us to remove your data, please contact us via email at zero2sixtybot@gmail.com
        
        We reserve the right to change this at any time.`
      )
      .setColor("#60b0f4");
    interaction.reply({ embeds: [embed] });
  },
};
