const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { numberWithCommas, toCurrency } = require("../common/utils");
const {userGetFromInteraction } = require("../common/user");
const { tipFooterRandom } = require("../common/tips");
const { emotes } = require("../common/emotes");
const colors = require("../common/colors");
const User = require("../schema/horseschema");
const horsedb = require("../data/horsedb.json")

const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stable")
    .setDescription("See your horses")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user id to check")
        .setRequired(false)
    ),

  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata) return await interaction.reply({content: GET_STARTED_MESSAGE, ephemeral: true});

    let horses = userdata.horses;

    if (horses.length === 0) {
      return await interaction.reply({content: "You don't have any horses!", ephemeral: true});
    }

    let embed = new EmbedBuilder()
      .setTitle("Your horses")
      .setColor(colors.blue)
      .setThumbnail("https://i.ibb.co/1X1h1vz/icons8-horse-240.png");

    let fields = [];

    for (let i = 0; i < horses.length; i++) {
      let horse = horses[i];
      fields.push({
        name: `${horsedb.Horses[horse.Name.toLowerCase()].Emote} ${horse.Name}`,
        value: `Speed: ${horse.Speed}\nStamina: ${horse.Stamina}\nJump: ${horse.Jump}\nStrength: ${horse.Strength}`,
        inline: true,
      });
    }

    embed.addFields(fields);

    await interaction.reply({embeds: [embed]});

    
  },
};