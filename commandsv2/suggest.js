

const { SlashCommandBuilder } = require("@discordjs/builders");
const { numberWithCommas } = require("../common/utils");
const User = require("../schema/profile-schema");
const { EmbedBuilder } = require("discord.js");
const { emotes } = require("../common/emotes");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest a feature")
    .addSubcommand((subcommand) => subcommand
    .setName("feature")
    .setDescription("Suggest a feature")
    .addStringOption((option) => option
    .setName("feature")
    .setDescription("The feature to suggest")

    .setRequired(true)
    )
    )
    .addSubcommand((option) => option
    .setName("car")
    .setDescription("Suggest a car")
    .addStringOption((option) => option
    .setName("car")
    .setDescription("The car name to suggest")
    .setRequired(true)
    )
    .addNumberOption((option) => option
    .setName("hp")
    .setDescription("The hp of the car")
    .setRequired(true)
    )
    .addNumberOption((option) => option
    .setName("acceleration")
    .setDescription("The 0-60 mph of the car")
    .setRequired(true)
    )
    .addNumberOption((option) => option
    .setName("handling")
    .setDescription("The estimated handling of the car (see other cars for reference)")
    .setRequired(true)
    )
    .addNumberOption((option) => option
    .setName("weight")
    .setDescription("The weight of the car in lbs")
    .setRequired(true)
    )
    .addAttachmentOption((option) => option
    .setName("image")
    .setDescription("The car's image, could be from google")
    .setRequired(true)
    )
    .addStringOption((option) => option
    .setName("obtained")
    .setDescription("Where the car can be obtained, if from the dealership set a price")
    .setRequired(false)
    )
    ),
  async execute(interaction) {
    let subcommand = interaction.options.getSubcommand();

    let suggestionschannel = interaction.guild.channels.cache.get("1214129063363616778");
    if(subcommand === "feature"){
      let feature = interaction.options.getString("feature");
    
      let embed = new EmbedBuilder()
        .setTitle("New feature suggestion")
        .setDescription(`Suggested feature: ${feature}`)
        .setFooter({text: `Suggested by ${interaction.user.tag}`})
        .setColor(colors.blue)
        
    await interaction.reply(`✅ Suggested ${feature}`)
    await suggestionschannel.send({embeds: [embed], fetchReply: true}).then((msg) => {

      msg.react('👍');
      msg.react('👎');
      console.log("reacted")
 
       }).catch(error => console.error('One of the emojis failed to react:', error));
    } else if(subcommand === "car"){
      let car = interaction.options.getString("car");
      let image = interaction.options.getAttachment("image");
      let obtained = interaction.options.getString("obtained") || "Not Specified"

      let embed = new EmbedBuilder()
      .setTitle("New car suggestion")
      .setDescription(`Suggested car: ${car}`)
      .addFields({name: "Stats", value:`${emotes.speed} HP: ${numberWithCommas(interaction.options.getNumber("hp"))}\n${emotes.acceleration} 0-60 mph: ${interaction.options.getNumber("acceleration")}s\n${emotes.handling} Handling: ${interaction.options.getNumber("handling")}\n${emotes.weight} Weight: ${numberWithCommas(interaction.options.getNumber("weight"))} lbs\nObtained: ${obtained}`})
      .setFooter({text: `Suggested by ${interaction.user.tag}`})
      .setImage(image.proxyURL)
      .setColor(colors.blue)

      await interaction.reply(`✅ Suggested car: ${car}`);
      await suggestionschannel.send({embeds: [embed], fetchReply: true}).then((msg) => {

     msg.react('👍');
     msg.react('👎');
     console.log("reacted")

      }).catch(error => console.error('One of the emojis failed to react:', error));
    }
    
  },
};
